"use client"
import { Box, Button, Typography } from "@mui/material";
import { useState } from "react";

const foodQuestionaire = [{
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
]

export default function Food(){
    const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
    const onNextClick = () => {
        setCurrentQuestionIndex((prev) => prev+1);
    }
    const onPrevClick = () => {
        setCurrentQuestionIndex((prev) => prev-1);
    }
    return (
        <Box sx={{ bgcolor: "rgb(255, 255, 255)", width: "600px"}}>
            <Box sx={{ margin: "1rem" }}>
                <Typography sx={{ fontSize: "1.4rem"}}>{foodQuestionaire[currentQuestionIndex].question}</Typography>
            </Box>
            <Box sx={{ display: "flex", flexDirection: "column"}}>
            {
                foodQuestionaire[currentQuestionIndex].options.map((option, index) => (
                    <Button sx={{ margin: "0.5rem", padding:"1rem", bgcolor: "black", color: "white" }} key={index}><Typography>{option}</Typography></Button>
                ))
            }
            </Box>
            <Box sx={{ margin: "1rem", display: "flex", gap: "1rem", justifyContent: "center" }}>
                <Button sx={{paddingX: "1rem"}} variant="outlined" onClick={()=>onPrevClick()} disabled={currentQuestionIndex < 1}>Back</Button>
                <Button variant="contained" sx={{ paddingX: "1rem"}} onClick={()=>onNextClick()} disabled={currentQuestionIndex >= 3}>Next</Button>
            </Box>
        </Box>
    )
}