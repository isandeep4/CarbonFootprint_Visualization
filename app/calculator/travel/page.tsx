"use client"
import { Box, Button, LinearProgress, TextField, Typography } from "@mui/material";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { getNextQuestion, getPreviousQuestion } from "../../utils/helper_functions";
import { Questionnaire } from "../../utils/mockQuestionnaire";


export default function TravelQuestionnaire(){
    const [currentQuestion, setCurrentQuestion] = useState(Questionnaire['travel'][0]);
    const router = useRouter();
    const [optionNotSelectederr, setOptionNotSelectedErr] = useState("");
    const [submitError, setSubmitError] = useState(false);
    const [selectedOptions, setSelectedOptions] = useState<{
        id: string,
        value: string |  {},
        nextQuestionId: string,
        prevQuestionId: string,
    }[]>(null);
    const [qNo, setQNo] = useState(1)
    const [textFieldAnswers, setTextFieldAnswers] = useState<{[key: string]: string}>({})
    
    const onNextClick = () => {
        const currentSelectedOption = selectedOptions && selectedOptions.find(opt => opt.id === currentQuestion.id);
        if(currentQuestion.answerType === "select" && (!selectedOptions || !currentSelectedOption)){
            setSubmitError(true);
            setOptionNotSelectedErr("Please select one option");
        }else if (currentQuestion.answerType === "textField" && Object.keys(textFieldAnswers).length !== 3){
            setSubmitError(true);
            setOptionNotSelectedErr("Please provide one or more input");
        }
        else{
            setSubmitError(false);
            if(currentQuestion.answerType === "select"){
                if(currentQuestion.id === "q6") {
                    return router.push('/calculator/home');
                }
                else{
                    const currentSelectedOption = selectedOptions.find(opt => opt.id === currentQuestion.id)
                    const nextQuestion = getNextQuestion(Questionnaire["travel"], currentQuestion, currentSelectedOption);
                    setCurrentQuestion({id: nextQuestion.id, question: nextQuestion.question ,options: nextQuestion.options, answerType: nextQuestion.answerType });
                    setQNo(prev => prev+1);  
                }
            }
            else {
              setSelectedOptions((prevAnswers)=>{
                const updatedAnswers = [...prevAnswers];
                const textFieldQuestionId = updatedAnswers.findIndex(ans => ans.id === currentQuestion.id);
                const updateTextfield = {
                    id: currentQuestion.id,
                    value: textFieldAnswers,
                    nextQuestionId: currentQuestion.options[0].nextQuestionId,
                    prevQuestionId: currentQuestion.options[0].prevQuestionId,
                }
                if(textFieldQuestionId !== -1){
                    updatedAnswers[textFieldQuestionId] = updateTextfield;
                }else{
                    updatedAnswers.push(updateTextfield)
                }
                return updatedAnswers
            })
              const nextQuestion = getNextQuestion(Questionnaire["travel"], currentQuestion);
              setCurrentQuestion({id: nextQuestion.id, question: nextQuestion.question ,options: nextQuestion.options, answerType: nextQuestion.answerType });
              setQNo(prev => prev+1);  
            }
        }
     }
    const onPrevClick = () => {
        if(currentQuestion.id === "q1") {
            return router.push('/calculator/food');
        }else{
            const currentSelectedOption = selectedOptions.find(opt => opt.id === currentQuestion.id)
        const prevQuestionId = getPreviousQuestion(Questionnaire['travel'], currentQuestion, currentSelectedOption)
        setCurrentQuestion(prevQuestionId);
        }
    }
    const onOptionClick = (option) =>{
        setSelectedOptions((prevSelected) => {
            const newAnswerSet = Array.isArray(prevSelected) ? [...prevSelected] : [];
            const existingQAnsIndex = newAnswerSet.findIndex((qAns)=> qAns.id === currentQuestion.id);
            const updatedAnswer = {
                id: currentQuestion.id,
                value: option.value,
                nextQuestionId: option.nextQuestionId,
                prevQuestionId: option.prevQuestionId,
            };
            if(existingQAnsIndex !== -1){
                newAnswerSet[existingQAnsIndex] = updatedAnswer;
            }else {
                newAnswerSet.push(updatedAnswer);
            }
            return newAnswerSet;
          })
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
                      onClick={()=>onOptionClick(option)}
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
                      onChange={(e)=>setTextFieldAnswers(prev => ({...prev, [opt.value]: e.target.value}))}
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