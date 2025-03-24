"use client"

import { useRouter } from "next/navigation";
import { useState } from "react";
import { QuestionnaireI, useCalculator } from "../../contexts/CalculatorContext";
import { Questionnaire } from "../../utils/mockQuestionnaire";
import { getNextQuestion, getPreviousQuestion, updateQuestionnaire } from "../../utils/helper_functions";
import QuestionnaireSection from "../QuestionnaireSection";

export default function HomeQuestionnaire(){
    const [currentQuestion, setCurrentQuestion] = useState(Questionnaire['home'][0]);
    const [selectedOption, setSelectedOption] = useState<{
      id: string,
      value: string,
      nextQuestionId: string,
      prevQuestionId: string,
    }>(null);
    const router = useRouter();
    const { homeProgressPer, setHomeProgressPer, questionnaireContext, setQuestionnaireContext } = useCalculator();
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
              "home"
           ))
      if(currentQuestion.id === "q4") {
          router.push('/calculator/shoppingQuestionnaire');
      }
      else{
          const nextQuestion = getNextQuestion(Questionnaire['home'], currentQuestion, selectedOption);
          setCurrentQuestion(nextQuestion);
          setQNo(prev => prev+1);
      }
      updateProgress(25);
      resetSubmittedAnswer();
      
  }
  const onPrevClick = () => {
    updateProgress(-25);
    const currentSelectedOption = selectedOption;
    const prevQuestionId = getPreviousQuestion(Questionnaire['home'], currentQuestion, currentSelectedOption);
    setCurrentQuestion(prevQuestionId);
    setQNo(prev => prev-1);
  }
  const updateProgress = (value: number) => {
    setHomeProgressPer(prevVal => prevVal + value);
  };
  const resetSubmittedAnswer = () => {
    setSelectedOption(null);
  };
  return (
    <QuestionnaireSection 
     qNo={qNo}
     progressBarStatus={homeProgressPer} 
     currentQuestion={currentQuestion} 
     setSelectedOption={setSelectedOption}
     onPrevClick={onPrevClick}
     onNextClick={onNextClick} 
     submitError={submitError} 
     optionNotSelectederr={optionNotSelectederr}
     questionnaireType={'HOME'}
   />
  )
}