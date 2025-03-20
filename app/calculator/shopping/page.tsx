"use client"
import { Box, Button, LinearProgress, Typography } from "@mui/material";
import { useRouter } from "next/navigation";
import { useContext, useState } from "react";
import { useCalculator } from "../../contexts/CalculatorContext";

const shoppingQuestionnaire = [{
    "question": "In a typical month, how much do you spend on clothes and footwear?",
    "options": ["0$", "1$ - 60$", "60$ - 180$", "180$+"]
},
{
    "question": "In a typical month, how much do you spend on health, beauty and grooming products?",
    "options": ["0$", "1$ - 60$", "60$+"]
},
{
    "question": "In a typical month, how much do you spend on phone, internet and TV contracts?",
    "options": ["0$", "1$ - 35$", "35$ - 70$", "70$+"]
},
{
    "question": "In a typical month, how much do you spend on entertainment and hobbies (sports/gym, cinema, books, newspapers, gardening, computer games)",
    "options": ["0$ - 25$", "25$ - 50$", "50$ - 75$", "75$+"]
},
{
    "question": "Which of these types of waste do you recycle and/or compost?",
    "options": ["Food", "Paper", "Tin Cans", "Plastic", "Glass"]
}
];

export default function ShoppingQuestionnaire(){
    const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
    const [shoppingQuestionnaireAnswers, setShoppingQuestionnaireAnswers] = useState([]);
    const router = useRouter();
    const { foodProgressPer, setFoodProgressPer } = useCalculator();

    const onNextClick = () => {
        setFoodProgressPer(prevVal => prevVal+ 25)
        if(currentQuestionIndex >= 3) {
            router.push('/calculator/food');
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
                <Typography sx={{ fontSize: "1.4rem"}}>{shoppingQuestionnaire[currentQuestionIndex].question}</Typography>
            </Box>
            <Box sx={{ display: "flex", flexDirection: "column"}}>
            {
                shoppingQuestionnaire[currentQuestionIndex].options.map((option, index) => (
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
                      onClick={()=>{setShoppingQuestionnaireAnswers(prev=>[...prev, option]); onNextClick()}}
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