"use client"
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { getNextQuestion, getPreviousQuestion, updateQuestionnaire } from "../../utils/helper_functions";
import { Questionnaire } from "../../utils/mockQuestionnaire";
import { QuestionnaireI, useCalculator } from "../../contexts/CalculatorContext";
import QuestionnaireSection from "../QuestionnaireSection";


export default function TravelQuestionnaire(){
    const [currentQuestion, setCurrentQuestion] = useState(Questionnaire['travel'][0]);
    const router = useRouter();
    const [optionNotSelectederr, setOptionNotSelectedErr] = useState("");
    const [submitError, setSubmitError] = useState(false);
    const [selectedOption, setSelectedOption] = useState<{
        id: string,
        value: string |  {[key: string]: string},
        nextQuestionId: string,
        prevQuestionId: string,
    }>(null);
    const [qNo, setQNo] = useState(1)
    const { travelProgressPer, setTravelProgressPer, questionnaireContext, setQuestionnaireContext } = useCalculator();
    
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
                "travel"
             ))
        if(currentQuestion.id === "q6") {
            router.push('/calculator/homeQuestionnaire');
            return;
        }
        const nextQuestion = currentQuestion.answerType === "select" ? 
            getNextQuestion(Questionnaire["travel"], currentQuestion, selectedOption) :
            getNextQuestion(Questionnaire["travel"], currentQuestion);
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
        if(currentQuestion.id === "q1") {
           router.push('/calculator/food');
           return;
        }
        const prevQuestion = getPreviousQuestion(Questionnaire['travel'], currentQuestion, selectedOption)
        setCurrentQuestion(prevQuestion);
        updateProgress(-25);
    }
     // Helper function for updating progress bar
    const updateProgress = (value: number) => {
        setTravelProgressPer(prevVal => prevVal + value);
    };
    const resetSubmittedAnswer = () => {
        setSelectedOption(null);
    };
    return (
        <QuestionnaireSection 
          qNo={qNo}
          progressBarStatus={travelProgressPer} 
          currentQuestion={currentQuestion} 
          setSelectedOption={setSelectedOption}
          onPrevClick={onPrevClick}
          onNextClick={onNextClick} 
          submitError={submitError} 
          optionNotSelectederr={optionNotSelectederr}
          questionnaireType={'TRAVEL'}
       />
    )
}