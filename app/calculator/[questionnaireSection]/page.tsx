"use client"
import { useParams, useRouter } from "next/navigation";
import { QuestionnaireI, useCalculator } from "../../contexts/CalculatorContext";
import { useState } from "react";
import { Questionnaire } from "../../utils/mockQuestionnaire";
import { updateQuestionnaire, getNextQuestion, getPreviousQuestion, getLastQuestionIdForSection, getNextSection } from "../../utils/helper_functions";
import QuestionnaireSection from "../QuestionnaireSection";

export type QuestionType = {
    id: string;
    question: string;
    options: {
        label: string;
        value: string;
        nextQuestionId: string;
        prevQuestionId: string;
    }[];
    answerType: string;
}

export default function DynamicQuestionnaireSection(){
    const params = useParams();
    const section = params?.questionnaireSection as string;
    const router = useRouter();
    const [currentQuestion, setCurrentQuestion] = useState<QuestionType>(Questionnaire[section][0]);
    const [selectedOption, setSelectedOption] = useState<{
        id: string,
        value: string,
        nextQuestionId: string,
        prevQuestionId: string,
    }>(null);
    const [qNo, setQNo] = useState(1);
    const [optionNotSelectederr, setOptionNotSelectedErr] = useState("");
    const [submitError, setSubmitError] = useState(false);
    const { foodProgressPer, setFoodProgressPer, questionnaireContext, setQuestionnaireContext } = useCalculator();
    const nextSection = getNextSection(section);

    const onNextClick = () => {
        if(!selectedOption){
            setSubmitError(true);
            setOptionNotSelectedErr("Please select one option");
            return;
        }
        if (currentQuestion.answerType === "textField" && Object.keys(selectedOption.value).length !== 3){
            setSubmitError(true);
            setOptionNotSelectedErr("Please provide one or more input");
            return;
        }
        setSubmitError(false);
        setQuestionnaireContext(
            (prevQuestionnaire: QuestionnaireI)=>
             updateQuestionnaire(
                prevQuestionnaire, 
                currentQuestion, 
                selectedOption, 
                section
             ))
        if(currentQuestion.id === getLastQuestionIdForSection(section) && section === "shoppingQuestionnaire"){
            router.push('/calculator/result');
            return 
        }else if(currentQuestion.id === getLastQuestionIdForSection(section)) {
            router.push(`/calculator/${nextSection}`);
            return;
        }
        const nextQuestion = currentQuestion.answerType === "select" ? 
            getNextQuestion(Questionnaire[section], currentQuestion, selectedOption) :
            getNextQuestion(Questionnaire[section], currentQuestion);
        setCurrentQuestion({
            id: nextQuestion.id, 
            question: nextQuestion.question ,
            options: nextQuestion.options, 
            answerType: nextQuestion.answerType 
        });
        setQNo(prev => prev+1);  
        resetSubmittedAnswer();
        updateProgress(25);
        
    }
    const onPrevClick = () => {
        updateProgress(-25);
        const currentSelectedOption = selectedOption;
        const prevQuestionId = getPreviousQuestion(Questionnaire[section], currentQuestion, currentSelectedOption);
        setCurrentQuestion(prevQuestionId);
        setQNo(prev => prev-1);
    }
    // Helper function for updating progress bar
    const updateProgress = (value: number) => {
        setFoodProgressPer(prevVal => prevVal + value);
    };
    const resetSubmittedAnswer = () => {
        setSelectedOption(null);
    };
    return (
        <QuestionnaireSection 
         qNo={qNo}
         progressBarStatus={foodProgressPer} 
         currentQuestion={currentQuestion} 
         setSelectedOption={setSelectedOption}
         onPrevClick={onPrevClick}
         onNextClick={onNextClick} 
         submitError={submitError} 
         optionNotSelectederr={optionNotSelectederr}
         questionnaireType={"FOOD"}
        />
    )
}