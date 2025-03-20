"use client"
import { Box, Button, LinearProgress, Typography } from "@mui/material";
import { useRouter } from "next/navigation";
import { useContext, useState } from "react";
import { useCalculator } from "../../contexts/CalculatorContext";

const homeQuestionnaire = [{
    "question": "What kind of house do you live in?",
    "options": ["Detached", "Semi detached", "terrace", "Flat"]
},
{
    "question": "How many bedrooms does your house have?",
    "options": ["1", "2", "3", " 4 or more"]
},
{
    "question": "How many people (aged 17 and over) live in your house?",
    "options": ["1", "2", "3", " 4 or more"]
},
{
    "question": "How do you heat your home?",
    "options": ["Gas", "Oil", "Electricity", "Wood"]
},
{
    "question": "Do you regularly turn off lights and not leave your appliances on standby?",
    "options": ["Yes", "No"]
},
{
    "question": "How warm do you keep your home in winter?",
    "options": ["below 14 degree", "14 - 17 degree c", "18-21 degree c", "over 21 degree c"]
}
];

export default function HomeQuestionnaire(){
    const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
    const [homeQuestionnaireAnswers, setHomeQuestionnaireAnswers] = useState([]);
    const router = useRouter();
    const { foodProgressPer, setFoodProgressPer } = useCalculator();

    const onNextClick = () => {
        setFoodProgressPer(prevVal => prevVal+ 25)
        if(currentQuestionIndex >= 3) {
            router.push('/calculator/shopping');
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
                <Typography sx={{ fontSize: "1.4rem"}}>{homeQuestionnaire[currentQuestionIndex].question}</Typography>
            </Box>
            <Box sx={{ display: "flex", flexDirection: "column"}}>
            {
                homeQuestionnaire[currentQuestionIndex].options.map((option, index) => (
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
                      onClick={()=>{setHomeQuestionnaireAnswers(prev=>[...prev, option]); onNextClick()}}
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