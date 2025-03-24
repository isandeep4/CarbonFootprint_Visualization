"use client"

import { useRouter } from "next/navigation";
import { useState } from "react";
import { QuestionnaireI, useCalculator } from "../../contexts/CalculatorContext";
import { Questionnaire } from "../../utils/mockQuestionnaire";
import { updateQuestionnaire, getNextQuestion, getPreviousQuestion, resetSubmittedAnswer, updateProgress } from "../../utils/helper_functions";
import QuestionnaireSection from "../QuestionnaireSection";

export default function ShoppingQuestionnaire(){
  const [currentQuestion, setCurrentQuestion] = useState(Questionnaire['shopping'][0]);
  const [selectedOption, setSelectedOption] = useState<{
      id: string,
      value: string,
      nextQuestionId: string,
      prevQuestionId: string,
  }>(null);
  const router = useRouter();
  const { shoppingProgressPer, setShoppingProgressPer, questionnaireContext, setQuestionnaireContext } = useCalculator();
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
            "shopping"
         ))
    if(currentQuestion.id === "q4") {
        router.push('/calculator/result');
    }
    else{
        const nextQuestion = getNextQuestion(Questionnaire['shopping'], currentQuestion, selectedOption);
        setCurrentQuestion(nextQuestion);
        setQNo(prev => prev+1);
    }
    updateProgress(25, setShoppingProgressPer);
    resetSubmittedAnswer(setSelectedOption);
    
}
const onPrevClick = () => {
  updateProgress(-25, setShoppingProgressPer);
  const currentSelectedOption = selectedOption;
  const prevQuestionId = getPreviousQuestion(Questionnaire['shopping'], currentQuestion, currentSelectedOption);
  setCurrentQuestion(prevQuestionId);
  setQNo(prev => prev-1);
}

    return (
      <QuestionnaireSection 
      qNo={qNo}
      progressBarStatus={shoppingProgressPer} 
      currentQuestion={currentQuestion} 
      setSelectedOption={setSelectedOption}
      onPrevClick={onPrevClick}
      onNextClick={onNextClick} 
      submitError={submitError} 
      optionNotSelectederr={optionNotSelectederr}
      questionnaireType={'SHOPPING'}
     />
    )
}