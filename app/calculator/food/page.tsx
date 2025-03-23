"use client"
import { Box, Button, LinearProgress, Typography } from "@mui/material";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { useCalculator } from "../../contexts/CalculatorContext";
import DoneIcon from '@mui/icons-material/Done';
import { getNextQuestion, getPreviousQuestion } from "../../utils/helper_functions";
import { Questionnaire } from "../../utils/mockQuestionnaire";


export default function Food(){
    const [currentQuestion, setCurrentQuestion] = useState(Questionnaire['food'][0]);
    const [selectedOptions, setSelectedOptions] = useState<{
        id: string,
        value: string,
        nextQuestionId: string,
        prevQuestionId: string,
    }[]>(null);
    const router = useRouter();
    const { foodProgressPer, setFoodProgressPer } = useCalculator();
    const [doneIconId, setDoneIconId] = useState<{index: string, isDone: boolean}| any>({});
    const [qNo, setQNo] = useState(1);
    const [optionNotSelectederr, setOptionNotSelectedErr] = useState("");
    const [submitError, setSubmitError] = useState(false);

    const onNextClick = () => {
        const currentSelectedOption = selectedOptions && selectedOptions.find(opt => opt.id === currentQuestion.id)
        if(!selectedOptions || !currentSelectedOption){
            setSubmitError(true);
            setOptionNotSelectedErr("Please select one option");
        }else{
            setSubmitError(false);
            if(currentQuestion.id === "q4") {
                router.push('/calculator/travel');
            }
            else{
                const currentSelectedOption = selectedOptions.find(opt => opt.id === currentQuestion.id)
                const nextQuestion = getNextQuestion(Questionnaire['food'], currentQuestion, currentSelectedOption);
                setCurrentQuestion(nextQuestion);
                setQNo(prev => prev+1);
            }
            setFoodProgressPer(prevVal => prevVal+ 25);
        }
        
    }
    const onPrevClick = () => {
        setFoodProgressPer(prevVal => prevVal - 25);
        const currentSelectedOption = selectedOptions.find(opt => opt.id === currentQuestion.id)
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
                      onClick={()=>{setSelectedOptions((prevSelected) => {
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
                      })}}
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