"use client"
import { useParams, useRouter } from "next/navigation";
import { useCalculator } from "../../contexts/CalculatorContext";
import { useEffect, useState } from "react";
import { Questionnaire } from "../../utils/mockQuestionnaire";
import { getNextQuestion, getPreviousQuestion, getLastQuestionIdForSection, getNextSection, getProgressBarContext, getPrevSection, isFirstQuestionOfCurrentSection, resetProgressBar, getSelectedOption } from "../../utils/helper_functions";
import QuestionnaireSection, { QuestionType } from "../QuestionnaireSection";

export enum QuestionnaireSectionMapping {
    "foodQuestionnaire" = "FOOD",
    "travelQuestionnaire" = "TRAVEL",
    "homeQuestionnaire" = "HOME",
    "shoppingQuestionnaire" = "SHOPPING"
}

export default function QuestionnaireSectionPage(){
    const { 
        currentQuestionContext, 
        setCurrentQuestionContext, 
        setFoodProgressPer,
        setTravelProgressPer,
        setHomeProgressPer,
        setShoppingProgressPer 
    } = useCalculator();
    const params = useParams();
    const section = params?.questionnaireSection as string;
    const { questionnaireContext, isPrevBtnClickedOnFirstQuestion, setIsPrevBtnClickedOnFirstQuestion  } = useCalculator();
    const router = useRouter();
    const [currentQuestion, setCurrentQuestion] = useState<QuestionType>(currentQuestionContext || Questionnaire[section][0]);
    const alreadySelectedOptionIdx = getSelectedOption(questionnaireContext, currentQuestion, section);
    const [qNo, setQNo] = useState(1);
    const [optionNotSelectedErr, setOptionNotSelectedErr] = useState("");
    const [submitError, setSubmitError] = useState(false);
    const nextSection = getNextSection(section);
    const {progressFactor, progressBarStatus, setProgressBarStatus} = getProgressBarContext(section);
    const [questionnaireType, setQuestionnaireType] = useState(QuestionnaireSectionMapping.foodQuestionnaire);

    useEffect(()=>{
        setQuestionnaireType(QuestionnaireSectionMapping[section]);
        if(!isPrevBtnClickedOnFirstQuestion){
          setCurrentQuestion(Questionnaire[section][0]);
        }else{
            if(Questionnaire[section] && Questionnaire[section].length > 0){
                const currentSectionLastQuestion =  Questionnaire[section][Questionnaire[section]?.length - 1];
                setCurrentQuestion(currentSectionLastQuestion);
            }
        }
    }, [section]);
   
    const onNextClick = () => {
        setIsPrevBtnClickedOnFirstQuestion(false);
        const isSelectWithoutAnswer = currentQuestion.answerType === "select" && alreadySelectedOptionIdx === undefined;
        const isSingleWithoutAnswer = currentQuestion.optionType === "single" && alreadySelectedOptionIdx === -1;
        const isMultipleWithoutAnswer = currentQuestion.optionType === "multiple" && (!Array.isArray(alreadySelectedOptionIdx) || alreadySelectedOptionIdx.length < 1);
        if(isSelectWithoutAnswer || isSingleWithoutAnswer || isMultipleWithoutAnswer){
            setSubmitError(true);
            setOptionNotSelectedErr("Please select one option");
            return;
        }
        if (currentQuestion.answerType === "textField"){
            const answers = questionnaireContext[section]?.find(
                (qans) => qans.qId === currentQuestion.id)?.answer
            if (!answers || Object.keys(answers).length !== 3) {
                setOptionNotSelectedErr("Please provide all answers");
                setSubmitError(true);
                return;
            }        
        }
        setSubmitError(false);
        if(currentQuestion.id === getLastQuestionIdForSection(section) && section === "shoppingQuestionnaire"){
            router.push('/calculator/result');
            setCurrentQuestionContext(null);
            const progressBarPer = {
                setFoodProgressPer,
                setTravelProgressPer,
                setHomeProgressPer,
                setShoppingProgressPer 
            }
            resetProgressBar(progressBarPer);
            return 
        }else if(currentQuestion.id === getLastQuestionIdForSection(section)) {
            router.push(`/calculator/${nextSection}`);
            setCurrentQuestionContext(null);
            return;
        }
        const nextQuestion = currentQuestion.answerType === "select" ? 
            getNextQuestion(Questionnaire[section], currentQuestion, currentQuestion.options[alreadySelectedOptionIdx]) :
            getNextQuestion(Questionnaire[section], currentQuestion);
        setCurrentQuestion({
            id: nextQuestion.id, 
            question: nextQuestion.question ,
            options: nextQuestion.options, 
            answerType: nextQuestion.answerType,
            optionType: nextQuestion.optionType, 
        });
        setCurrentQuestionContext({
            id: nextQuestion.id, 
            question: nextQuestion.question ,
            options: nextQuestion.options, 
            answerType: nextQuestion.answerType 
        })
        setQNo(prev => prev+1);  
        updateProgress(progressFactor);
    }
    const onPrevClick = () => {
        setIsPrevBtnClickedOnFirstQuestion(true);
        const prevQuestion = getPreviousQuestion(
            questionnaireContext[section], currentQuestion, section, updateProgress, progressFactor, setQNo, router);
        setCurrentQuestion(prevQuestion);
        setCurrentQuestionContext(prevQuestion);
    }
    // Helper function for updating progress bar
    const updateProgress = (value: number) => {
        setProgressBarStatus(preVal => preVal + value);
    };

    return (
        <QuestionnaireSection 
         qNo={qNo}
         progressBarStatus={progressBarStatus} 
         currentQuestion={currentQuestion} 
         onPrevClick={onPrevClick}
         onNextClick={onNextClick} 
         submitError={submitError} 
         optionNotSelectederr={optionNotSelectedErr}
         questionnaireType={questionnaireType}
         section={section}
        />
    )
}