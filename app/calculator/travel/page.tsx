"use client"
import { Box, Button, LinearProgress, TextField, Typography } from "@mui/material";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { useCalculator } from "../../contexts/CalculatorContext";

const travelQuestionnaire = [
{
    id: "q1",
    question: "What kind of vehicle do you travel in most often as driver or passenger? (if any)?",
    options: [
        {label: "Car", value: "car", nextQuestionId: "q2", prevQuestionId: null},
        {label: "Motorbike", value: "motorbike", nextQuestionId: "q3", prevQuestionId: null},
        {label: "Public transport", value: "public_transport", nextQuestionId: "q4", prevQuestionId: null},
        {label: "Walk or Cycle", value: "walk_cycle", nextQuestionId: "q4", prevQuestionId: null},
    ],
    answerType: "select"
},
{
    id: "q2",
    question: "What is your car's fuel type?",
    options: [
        { label: "Petrol", value: "petrol", nextQuestionId: "q3", prevQuestionId: "q1"},
        { label: "Electric", value: "electric", nextQuestionId: "q3", prevQuestionId: "q1" },
        { label: "Diesel", value: "diesel", nextQuestionId: "q3", prevQuestionId: "q1" },
        { label: "Hybrid", value: "hybrid", nextQuestionId: "q3", prevQuestionId: "q1" },
    ],
    answerType: "select"
},
{
    id: "q3",
    question: "How many hours a week do you spend in your car or on your motorbike for personal use including commuting?",
    options: [
        { label: "Under 2 hours", value: "2hrs", nextQuestionId: "q5", prevQuestionId: "q2" },
        { label: "2 to 5 hours", value: "2to5hrs", nextQuestionId: "q5", prevQuestionId: "q2" },
        { label: "5 to 15 hours", value: "5to15hrs", nextQuestionId: "q5", prevQuestionId: "q2" },
        { label: "15 to 25 hours", value: "15to25hrs", nextQuestionId: "q5", prevQuestionId: "q2" },
        { label: "Over 25 hours", value: "25hrs", nextQuestionId: "q5" },
    ],
    answerType: "select"
},
{
    id: "q4",
    question: "How many hours a week do you spend on the train for personal use including commuting?",
    options: [
        { label: "I don't travel by train", value: "2hrs", nextQuestionId: "q5", prevQuestionId: "q1" },
        { label: "under 2 hours", value: "2to5hrs", nextQuestionId: "q5", prevQuestionId: "q1" },
        { label: "2 to 5 hours", value: "5to15hrs", nextQuestionId: "q5", prevQuestionId: "q1" },
        { label: "5 to 15 hours", value: "15to25hrs", nextQuestionId: "q5", prevQuestionId: "q1" },
        { label: "15 to 25 hours", value: "25hrs", nextQuestionId: "q5", prevQuestionId: "q1" },
        { label: "Over 25 hours", value: "25hrs", nextQuestionId: "q5", prevQuestionId: "q1"}
    ],
    answerType: "select"
},
{
    id: "q5",
    question: "In the last year, how many return flights have you made in total to the following locations?",
    options: [
        { label: "Domestic (UK / Ireland)", value: "domestic", nextQuestionId: "q6", prevQuestionId: "q4" },
        { label: "To/from Europe", value: "continent", nextQuestionId: "q6", prevQuestionId: "q4" },
        { label: "To/from outside Europe", value: "international", nextQuestionId: "q6", prevQuestionId: "q4" },
    ],
    answerType: "textField"
},
{
    id: "q6",
    question: "What percentage of your flights do you offset?",
    options: [
        { label: "None of them", value: "none", nextQuestionId: null, prevQuestionId: "q5" },
        { label: "25%", value: "25%", nextQuestionId: null, prevQuestionId: "q5" },
        { label: "50%", value: "50%", nextQuestionId: null, prevQuestionId: "q5" },
        { label: "75%", value: "75%", nextQuestionId: null, prevQuestionId: "q5" },
        { label: "All of them", value: "all", nextQuestionId: null, prevQuestionId: "q5" },
    ],
    answerType: "select"
},
];
const getNextQuestion = (currentQuestion, optionSelected?) => {
    if(optionSelected){
        const nextQuestionId = currentQuestion.options.find(opt => opt.value === optionSelected.value)?.nextQuestionId;
        return travelQuestionnaire.find(qns => qns.id === nextQuestionId)
    }else{
        return travelQuestionnaire.find(qns => qns.id === currentQuestion.options[0]?.nextQuestionId)
    }
}
const getPreviousQuestion = (currentQuestion, optionSelected) => {
    return currentQuestion.options.find(opt => opt.value === optionSelected)?.prevQuestionId;
}

export default function TravelQuestionnaire(){
    const [currentQuestion, setCurrentQuestion] = useState(travelQuestionnaire[0]);
    const router = useRouter();
    const [optionNotSelectederr, setOptionNotSelectedErr] = useState("");
    const [submitError, setSubmitError] = useState(false);
    const [currentOption, setCurrentOption] = useState<{
        label: string,
        value: string,
        nextQuestionId: string,
        prevQuestionId: string} | {}>({});
    const [qNo, setQNo] = useState(1)
    const [textFieldAnswers, setTextFieldAnswers] = useState<{[key: string]: string}>({})

    useEffect(()=>{
        if((currentOption as {nextQuestionId: string}).nextQuestionId === null) {
            return router.push('/calculator/home');
        }
        if(currentOption.hasOwnProperty("value")) {
            const nextQuestion = getNextQuestion(currentQuestion, currentOption);
            setCurrentQuestion(nextQuestion);
            setQNo(prev => prev+1);
        }
    }, [currentOption])
    
    const onNextClick = () => {
        if(!currentOption && !Object.keys(textFieldAnswers).length){
            setSubmitError(true);
            setOptionNotSelectedErr("Please select one option");
            return;
        }
        const nextQuestion = getNextQuestion(currentQuestion);
        setCurrentQuestion({id: nextQuestion.id, question: nextQuestion.question ,options: nextQuestion.options, answerType: nextQuestion.answerType });
        setQNo(prev => prev+1);  
     }
    const onPrevClick = () => {
        const prevQuestionId = getPreviousQuestion(currentQuestion, currentOption)
        setCurrentQuestion(prevQuestionId);
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
                        '&:hover': {
                            backgroundColor: "white",
                            border: "1px solid black",
                            color: "black"
                        } 
                      }} 
                      key={index}
                      onClick={()=>setCurrentOption(option)}
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
                <Button sx={{paddingX: "1rem"}} variant="outlined" onClick={()=>onPrevClick()} disabled={currentQuestion?.id === null}>Back</Button>
                <Button variant="contained" sx={{ paddingX: "1rem"}} onClick={()=>onNextClick()}>Next</Button>
            </Box>
            {submitError && <p>{optionNotSelectederr}</p>}
         </Box>
        </Box>
    )
}