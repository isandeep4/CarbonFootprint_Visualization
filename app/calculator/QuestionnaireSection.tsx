import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import LinearProgress from "@mui/material/LinearProgress";
import Typography from "@mui/material/Typography";
import { Dispatch, SetStateAction } from "react";
import TextField from "@mui/material/TextField";
import { AnswerI, QuestionnaireI, useCalculator } from "../contexts/CalculatorContext";
import { getSelectedOption, getTextFieldValue, updateQuestionnaire } from "../utils/helper_functions";

export type QuestionType = {
  id: string;
  question: string;
  options: {
      label: string;
      value: string;
      nextQuestionId: string;
      prevQuestionId: string;
  }[];
  answerType: string;
}

interface QuestionnaireSectionPropsI {
    qNo: number;
    progressBarStatus: number,
    currentQuestion: QuestionType,
    onPrevClick: () => void;
    onNextClick: () => void;
    submitError: boolean;
    optionNotSelectederr: string;
    questionnaireType: string;
    section: string;
}

export default function QuestionnaireSection({
     qNo, 
     progressBarStatus, 
     currentQuestion, 
     onPrevClick, 
     onNextClick, 
     submitError, 
     optionNotSelectederr,
     questionnaireType,
     section
    }: QuestionnaireSectionPropsI)
    {
      const { questionnaireContext, setQuestionnaireContext } 
        = useCalculator();
      const selectedOptionIdx = getSelectedOption(questionnaireContext, currentQuestion, section);

      const handleOptionClick = (option) => {
        setQuestionnaireContext(
          prevQuestionnaire=>
            updateQuestionnaire(prevQuestionnaire, currentQuestion, option, section, "select"));
      }
      const handleTextFieldChange = (event, field) => {
        setQuestionnaireContext(
          prevQuestionnaire=>
           updateQuestionnaire(prevQuestionnaire, currentQuestion, field, section, "textfield", event));
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
                {`${questionnaireType}  ${currentQuestion.id.toLocaleUpperCase()} of Q`}</Typography>
          <LinearProgress variant="determinate" value={progressBarStatus} />
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
                        bgcolor: selectedOptionIdx === index ? "white": "black", 
                        color: selectedOptionIdx === index ? "black": "white",
                        border: selectedOptionIdx === index ? "1px solid black" : "none"
                      }} 
                      key={index}
                      onClick={()=> handleOptionClick(option)}
                    >
                      <Typography>
                        {option.label}
                      </Typography>
                    </Button>
                )) 
                :
                currentQuestion?.options.map((opt, index)=>(
                    <TextField 
                      key={index}
                      sx={{margin: "0.5rem"}}
                      variant="standard"
                      label={opt.label}
                      type="number"
                      onChange={(e)=>handleTextFieldChange(e, opt)}
                      slotProps={{
                        inputLabel: {
                          shrink: true,
                        },
                      }}
                      value={getTextFieldValue(questionnaireContext[section], currentQuestion, opt.value)}
                    />
                ))
            }
            </Box>
            <Box sx={{ margin: "1rem", display: "flex", gap: "1rem", justifyContent: "center" }}>
              <Button 
                 sx={{paddingX: "1rem"}} 
                 variant="outlined" 
                 onClick={()=>onPrevClick()} 
                 disabled={currentQuestion?.id === "q1" && questionnaireType === "FOOD"}
                 >
               Back
              </Button>
              <Button 
                 variant="contained" 
                 sx={{ paddingX: "1rem"}} 
                 onClick={()=>onNextClick()}
                 >
               Next
              </Button>
            </Box>
            {submitError && <Typography sx={{ padding: "1rem", textAlign: "center"}}>{optionNotSelectederr}</Typography>}
         </Box>
        </Box>
    )
}