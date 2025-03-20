"use client"
import { Box, Button, LinearProgress, Typography } from "@mui/material";
import { useRouter } from "next/navigation";
import { useContext, useState } from "react";
import { useCalculator } from "../../contexts/CalculatorContext";

const travelQuestionnaire = [{
    "question": "What kind of vehicle do you travel in most often as driver or passenger? (if any)?",
    "options": ["Car", "Motorbike", "public transport", "Walk or Cycle"]
},
{
    "question": "How many hours a week do you spend on the train for personal use including commuting?",
    "options": ["I don't travel by train", "under 2 hours", "2 to 5 hours", "5 to 15 hours", "15 to 25 hours", "Over 25 hours"]
},
{
    "question": "In the last year, how many return flights have you made in total to the following locations?",
    "options": ["0 to 5 times", "5 to 10 times", "10 - 20 times", "20 to 30 times"]
},
{
    "question": "What percentage of your flights do you offset?",
    "options": ["None of them", "25%", "50%", "75%", "All of them"]
}
];

export default function TravelQuestionnaire(){
    const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
    const [travelQuestionnaireAnswers, setTravelQuestionnaireAnswers] = useState([]);
    const router = useRouter();
    const { foodProgressPer, setFoodProgressPer } = useCalculator();

    const onNextClick = () => {
        setFoodProgressPer(prevVal => prevVal+ 25)
        if(currentQuestionIndex >= 3) {
            router.push('/calculator/home');
        }else{
            setCurrentQuestionIndex((prevIndex) => prevIndex+1);
        }
        
    }
    const onPrevClick = () => {
        setFoodProgressPer(prevVal => prevVal - 25);
        setCurrentQuestionIndex((prev) => prev-1);
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
            <Typography sx={{fontSize: "1.35rem", fontFamily: "serif", fontWeight: "500"}}>{`FOOD  Q${currentQuestionIndex+1} of Q`}</Typography>
          <LinearProgress variant="determinate" value={foodProgressPer} />
        </Box>
         <Box sx={{ bgcolor: "rgb(255, 255, 255)", width: "600px"}}>
            <Box sx={{ margin: "1rem" }}>
                <Typography sx={{ fontSize: "1.4rem"}}>{travelQuestionnaire[currentQuestionIndex].question}</Typography>
            </Box>
            <Box sx={{ display: "flex", flexDirection: "column"}}>
            {
                travelQuestionnaire[currentQuestionIndex].options.map((option, index) => (
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
                      onClick={()=>{setTravelQuestionnaireAnswers(prev=>[...prev, option]); onNextClick()}}
                    >
                      <Typography>
                        {option}
                      </Typography>
                    </Button>
                ))
            }
            </Box>
            <Box sx={{ margin: "1rem", display: "flex", gap: "1rem", justifyContent: "center" }}>
                <Button sx={{paddingX: "1rem"}} variant="outlined" onClick={()=>onPrevClick()} disabled={currentQuestionIndex < 1}>Back</Button>
                <Button variant="contained" sx={{ paddingX: "1rem"}} onClick={()=>onNextClick()}>Next</Button>
            </Box>
         </Box>
        </Box>
    )
}