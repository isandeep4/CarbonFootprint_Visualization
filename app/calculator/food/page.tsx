"use client"
import { Box, Button, LinearProgress, Typography } from "@mui/material";
import { useRouter } from "next/navigation";
import { useContext, useState } from "react";
import { useCalculator } from "../../contexts/CalculatorContext";

const foodQuestionnaire = [{
    "question": "How would you best describe your diet?",
    "options": ["Vegeterian", "Non-Vegeterian", "Eggeterian", "Vegan"]
},
{
    "question": "In a week, how much do you spend on food from restaurants, canteens and takeaways?",
    "options": ["0$", "1$-10$", "10$-50$", "More than 50$"]
},
{
    "question": "Of the food you buy how much is wasted and thrown away?",
    "options": ["None", "0%-10%", "10%-30%", "More than 30$"]
},
{
    "question": "How often do you buy locally produced food that is not imported to the UK?",
    "options": ["Local market", "Food mart", "Both"]
}
];

export default function Food(){
    const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
    const [foodAnswers, setFoodAnswers] = useState([]);
    const router = useRouter();
    const { foodProgressPer, setFoodProgressPer } = useCalculator();

    const onNextClick = () => {
        setFoodProgressPer(prevVal => prevVal+ 25)
        if(currentQuestionIndex >= 3) {
            router.push('/calculator/travel');
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
                <Typography sx={{ fontSize: "1.4rem"}}>{foodQuestionnaire[currentQuestionIndex].question}</Typography>
            </Box>
            <Box sx={{ display: "flex", flexDirection: "column"}}>
            {
                foodQuestionnaire[currentQuestionIndex].options.map((option, index) => (
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
                      onClick={()=>{setFoodAnswers(prev=>[...prev, option]); onNextClick()}}
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