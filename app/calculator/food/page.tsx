"use client"
import { Box, Button, LinearProgress, Typography } from "@mui/material";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { AnswerI, QuestionnaireI, useCalculator } from "../../contexts/CalculatorContext";
import DoneIcon from '@mui/icons-material/Done';
import { getNextQuestion, getPreviousQuestion } from "../../utils/helper_functions";
import { Questionnaire } from "../../utils/mockQuestionnaire";


export default function Food(){
    const [currentQuestion, setCurrentQuestion] = useState(Questionnaire['food'][0]);
    const [selectedOption, setSelectedOption] = useState<{
        id: string,
        value: string,
        nextQuestionId: string,
        prevQuestionId: string,
    }>(null);
    const router = useRouter();
    const { foodProgressPer, setFoodProgressPer, questionnaireContext, setQuestionnaireContext } = useCalculator();
    const [doneIconId, setDoneIconId] = useState<{index: string, isDone: boolean}| any>({});
    const [qNo, setQNo] = useState(1);
    const [optionNotSelectederr, setOptionNotSelectedErr] = useState("");
    const [submitError, setSubmitError] = useState(false);

    const resetSubmittedAnswer = () => {
        setSelectedOption(null);
    };

    const onNextClick = () => {
        if(!selectedOption){
            setSubmitError(true);
            setOptionNotSelectedErr("Please select one option");
        }else{
            setSubmitError(false);
            setQuestionnaireContext((prevQuestionnaire: QuestionnaireI)=>{
                const newQuestionnaireSet = { ...prevQuestionnaire};
                const foodQuestionnaireSet: AnswerI[] = [...(newQuestionnaireSet['food'] || [])];
                    const updatedAnswer: AnswerI = {
                        qId: currentQuestion.id,
                        question: currentQuestion.question,
                        answer: selectedOption.value,
                    };
                    const existingFoodQId = foodQuestionnaireSet.findIndex(fq => fq.qId === currentQuestion.id);
                    if(existingFoodQId !== -1){
                        foodQuestionnaireSet[existingFoodQId] = updatedAnswer;
                    }else {
                        foodQuestionnaireSet.push(updatedAnswer);
                    }
                    
                return {
                    ...newQuestionnaireSet,
                    food: foodQuestionnaireSet
                };
            })
            if(currentQuestion.id === "q4") {
                router.push('/calculator/travel');
            }
            else{
                const nextQuestion = getNextQuestion(Questionnaire['food'], currentQuestion, selectedOption);
                setCurrentQuestion(nextQuestion);
                setQNo(prev => prev+1);
            }
            setFoodProgressPer(prevVal => prevVal+ 25);
        }
        resetSubmittedAnswer();
        
    }
    const onPrevClick = () => {
        setFoodProgressPer(prevVal => prevVal - 25);
        const currentSelectedOption = selectedOption;
        const prevQuestionId = getPreviousQuestion(Questionnaire['food'], currentQuestion, currentSelectedOption);
        setCurrentQuestion(prevQuestionId);
        setQNo(prev => prev-1);
    }
    return (
        <Box
          sx={{ 
            width: "800px",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
         }}
        >
        <Box sx={{ margin: "2rem", width: "100%"}}>
            <Typography sx={{fontSize: "1.35rem", fontFamily: "serif", fontWeight: "500"}}>
                {`FOOD  Q${qNo} of Q`}</Typography>
          <LinearProgress variant="determinate" value={foodProgressPer} />
        </Box>
         <Box sx={{ bgcolor: "rgb(255, 255, 255)", width: "600px"}}>
            <Box sx={{ margin: "1rem" }}>
                <Typography sx={{ fontSize: "1.4rem"}}>{currentQuestion.question}</Typography>
            </Box>
            <Box sx={{ display: "flex", flexDirection: "column"}}>
            {
                currentQuestion.options.map((option, index) => (
                    <Button 
                      sx={{ 
                        margin: "0.5rem", 
                        padding:"1rem", 
                        bgcolor: "black", 
                        color: "white",
                        '&:focus': {
                            backgroundColor: "white",
                            border: "1px solid black",
                            color: "black"
                        } 
                      }} 
                      key={index}
                      onClick={()=>setSelectedOption({
                        id: currentQuestion.id,
                        value: option.value,
                        nextQuestionId: option.nextQuestionId,
                        prevQuestionId: option.prevQuestionId,
                      })}
                    //   onFocus={()=>setDoneIconId((prev)=>({
                    //     ...prev,
                    //     index: currentQuestion.options.indexOf((currentOption as {value: any}).value),
                    //     isDone: true
                    //   }))}
                    >
                      {doneIconId[index] && <DoneIcon />}
                      <Typography>
                        {option.label}
                      </Typography>
                    </Button>
                ))
            }
            </Box>
            <Box sx={{ margin: "1rem", display: "flex", gap: "1rem", justifyContent: "center" }}>
                <Button sx={{paddingX: "1rem"}} variant="outlined" onClick={()=>onPrevClick()} disabled={currentQuestion.id === "q1"}>Back</Button>
                <Button variant="contained" sx={{ paddingX: "1rem"}} onClick={()=>onNextClick()}>Next</Button>
            </Box>
            {submitError && <Typography sx={{ padding: "1rem", textAlign: "center"}}>{optionNotSelectederr}</Typography>}
         </Box>
        </Box>
    )
}