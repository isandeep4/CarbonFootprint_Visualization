"use client"
import { useParams, useRouter } from "next/navigation";
import { useCalculator } from "../../contexts/CalculatorContext";
import { useEffect, useState } from "react";
import { Questionnaire } from "../../utils/mockQuestionnaire";
import { getNextQuestion, getPreviousQuestion, getLastQuestionIdForSection, getNextSection, getProgressBarContext, getPrevSection, isFirstQuestionForCurrentSection, resetProgressBar, getSelectedOption } from "../../utils/helper_functions";
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
    const { questionnaireContext } = useCalculator();
    const router = useRouter();
    const [currentQuestion, setCurrentQuestion] = useState<QuestionType>(currentQuestionContext || Questionnaire[section][0]);
    const alreadySelectedOptionIdx = getSelectedOption(questionnaireContext, currentQuestion, section);
    const [qNo, setQNo] = useState(1);
    const [optionNotSelectedErr, setOptionNotSelectedErr] = useState("");
    const [submitError, setSubmitError] = useState(false);
    const nextSection = getNextSection(section);
    const prevSection = getPrevSection(section);
    const {progressFactor, progressBarStatus, setProgressBarStatus} = getProgressBarContext(section);
    const [questionnaireType, setQuestionnaireType] = useState(QuestionnaireSectionMapping.foodQuestionnaire);

    useEffect(()=>{
        setQuestionnaireType(QuestionnaireSectionMapping[section]);
        setCurrentQuestion(Questionnaire[section][0]);
    }, [section]);
   
    const onNextClick = () => {
        if((currentQuestion.optionType === "single" && alreadySelectedOptionIdx === -1) 
        || (currentQuestion.optionType === "multiple" && alreadySelectedOptionIdx.length < 1)){
            setSubmitError(true);
            setOptionNotSelectedErr("Please select one option");
            return;
        }
        if (currentQuestion.answerType === "textField" &&
        Object.keys(questionnaireContext[section].find(
            (qans) => qans.qId === currentQuestion.id)?.answer).length !== 3){
            setSubmitError(true);
            setOptionNotSelectedErr("Please provide one or more input");
            return;
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
        //switching back to prev q type
        //check if the back click on the first question of the current q and the prev q exist
        if(isFirstQuestionForCurrentSection(currentQuestion) && prevSection){
            //get last question of prev questionnaire section
            const currentSection = prevSection;
            const currentSectionLastQuestion =  Questionnaire[currentSection][Questionnaire[currentSection].length - 1];
            setCurrentQuestion(currentSectionLastQuestion);
            setCurrentQuestionContext(currentSectionLastQuestion);
            setQNo(Questionnaire[currentSection].length);
            router.push(`/calculator/${currentSection}`);
            setQNo(Questionnaire[currentSection].length);  
            return;
        }
        updateProgress(-progressFactor);
        const currentSelectedOption = currentQuestion.options[alreadySelectedOptionIdx];
        const prevQuestion = getPreviousQuestion(Questionnaire[section], currentQuestion, currentSelectedOption);
        setCurrentQuestion(prevQuestion);
        setCurrentQuestionContext(prevQuestion);
        setQNo(prev => prev-1);
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