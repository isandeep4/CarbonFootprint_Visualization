"use client"
import { Box, Button, LinearProgress, TextField, Typography } from "@mui/material";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { getNextQuestion, getPreviousQuestion } from "../../utils/helper_functions";
import { Questionnaire } from "../../utils/mockQuestionnaire";
import { AnswerI, QuestionnaireI, useCalculator } from "../../contexts/CalculatorContext";


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
    const { foodProgressPer, setFoodProgressPer, questionnaireContext, setQuestionnaireContext  } = useCalculator();

    const resetSubmittedAnswer = () => {
        setSelectedOption(null);
    };
    
    const onNextClick = () => {
        if(!selectedOption){
            setSubmitError(true);
            setOptionNotSelectedErr("Please select one option");
        }else if (currentQuestion.answerType === "textField" && Object.keys(selectedOption.value).length !== 3){
            setSubmitError(true);
            setOptionNotSelectedErr("Please provide one or more input");
        }
        else{
            setSubmitError(false);
            setQuestionnaireContext((prevQuestionnaire: QuestionnaireI)=>{
                const newQuestionnaireSet = { ...prevQuestionnaire};
                const travelQuestionnaireSet: AnswerI[] = [...(newQuestionnaireSet['travel'] || [])];
                    const updatedAnswer: AnswerI = {
                        qId: currentQuestion.id,
                        question: currentQuestion.question,
                        answer: selectedOption.value
                    };
                    const existingTravelQId = travelQuestionnaireSet.findIndex(tr => tr.qId === currentQuestion.id);
                    if(existingTravelQId !== -1){
                        travelQuestionnaireSet[existingTravelQId] = updatedAnswer;
                    }else {
                        travelQuestionnaireSet.push(updatedAnswer);
                    }
                    
                return {
                    ...newQuestionnaireSet,
                    travel: travelQuestionnaireSet
                };
            })
            if(currentQuestion.id === "q6") {
                return router.push('/calculator/home');
            } else {
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
            }
        }
        resetSubmittedAnswer();
     }
    const onPrevClick = () => {
        if(currentQuestion.id === "q1") {
            return router.push('/calculator/food');
        }else{
        const prevQuestionId = getPreviousQuestion(Questionnaire['travel'], currentQuestion, selectedOption)
        setCurrentQuestion(prevQuestionId);
        }
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
            <Typography sx={{fontSize: "1.35rem", fontFamily: "serif", fontWeight: "500"}}>{`TRAVEL Q${qNo} of Q`}</Typography>
          {/* <LinearProgress variant="determinate" value={foodProgressPer} /> */}
        </Box>
         <Box sx={{ bgcolor: "rgb(255, 255, 255)", width: "600px"}}>
            <Box sx={{ margin: "1rem" }}>
                <Typography sx={{ fontSize: "1.4rem"}}>{currentQuestion?.question}</Typography>
            </Box>
            <Box sx={{ display: "flex", flexDirection: "column"}}>
            {
                currentQuestion?.answerType === "select" ?
                currentQuestion?.options.map((option, index) => (
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
                      onClick={()=> setSelectedOption({
                        id: currentQuestion.id,
                        value: option.value,
                        nextQuestionId: option.nextQuestionId,
                        prevQuestionId: option.prevQuestionId,
                      })}
                    >
                      <Typography>
                        {option.label}
                      </Typography>
                    </Button>
                )) 
                :
                currentQuestion.options.map((opt, index)=>(
                    <TextField 
                      key={index}
                      sx={{margin: "0.5rem"}}
                      variant="standard"
                      label={opt.label}
                      type="number"
                      onChange={(e)=>setSelectedOption(prev => {
                        const updatedTextFieldOption = {...prev};
                        const existingQId = updatedTextFieldOption.id === currentQuestion.id;
                        if(existingQId){
                            const updateTextFieldValue = {
                                ...(updatedTextFieldOption.value as {[key: string]: string}),
                                [opt.value]: e.target.value
                            };
                            updatedTextFieldOption.value = updateTextFieldValue;
                            return updatedTextFieldOption;
                        }else {
                            return {
                                id: currentQuestion.id,
                                value: {
                                    [opt.value]: e.target.value
                                },
                                nextQuestionId: opt.nextQuestionId,
                                prevQuestionId: opt.prevQuestionId,
                            };
                        }
                      })}
                      slotProps={{
                        inputLabel: {
                          shrink: true,
                        },
                    }}
                    />
                ))
            }
            </Box>
            <Box sx={{ margin: "1rem", display: "flex", gap: "1rem", justifyContent: "center" }}>
                <Button sx={{paddingX: "1rem"}} variant="outlined" onClick={()=>onPrevClick()}>Back</Button>
                <Button variant="contained" sx={{ paddingX: "1rem"}} onClick={()=>onNextClick()}>Next</Button>
            </Box>
            {submitError && <Typography sx={{ padding: "1rem", textAlign: "center"}}>{optionNotSelectederr}</Typography>}
         </Box>
        </Box>
    )
}