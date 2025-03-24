"use client"
import { useRouter } from "next/navigation";
import { useState } from "react";
import { QuestionnaireI, useCalculator } from "../../contexts/CalculatorContext";
import { getNextQuestion, getPreviousQuestion, updateQuestionnaire } from "../../utils/helper_functions";
import { Questionnaire } from "../../utils/mockQuestionnaire";
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


export default function FoodQuestionnaire(){
    const [currentQuestion, setCurrentQuestion] = useState<QuestionType>(Questionnaire['food'][0]);
    const [selectedOption, setSelectedOption] = useState<{
        id: string,
        value: string,
        nextQuestionId: string,
        prevQuestionId: string,
    }>(null);
    const router = useRouter();
    const { foodProgressPer, setFoodProgressPer, questionnaireContext, setQuestionnaireContext } = useCalculator();
    const [qNo, setQNo] = useState(1);
    const [optionNotSelectederr, setOptionNotSelectedErr] = useState("");
    const [submitError, setSubmitError] = useState(false);

    const onNextClick = () => {
        if(!selectedOption){
            setSubmitError(true);
            setOptionNotSelectedErr("Please select one option");
            return;
        }
        setSubmitError(false);
        setQuestionnaireContext(
            (prevQuestionnaire: QuestionnaireI)=>
             updateQuestionnaire(
                prevQuestionnaire, 
                currentQuestion, 
                selectedOption, 
                "food"
             ))
        if(currentQuestion.id === "q4") {
            router.push('/calculator/travelQuestionnaire');
        }
        else{
            const nextQuestion = getNextQuestion(Questionnaire['food'], currentQuestion, selectedOption);
            setCurrentQuestion(nextQuestion);
            setQNo(prev => prev+1);
        }
        updateProgress(25);
        resetSubmittedAnswer();
        
    }
    const onPrevClick = () => {
        updateProgress(-25);
        const currentSelectedOption = selectedOption;
        const prevQuestionId = getPreviousQuestion(Questionnaire['food'], currentQuestion, currentSelectedOption);
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