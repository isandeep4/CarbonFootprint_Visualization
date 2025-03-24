import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import LinearProgress from "@mui/material/LinearProgress";
import Typography from "@mui/material/Typography";
import { QuestionType } from "./foodQuestionnaire/page";
import { Dispatch, SetStateAction } from "react";
import TextField from "@mui/material/TextField";

interface QuestionnaireSectionPropsI {
    qNo: number;
    progressBarStatus: number,
    currentQuestion: QuestionType,
    setSelectedOption: Dispatch<SetStateAction<{
        id: string;
        value: string| {
            [key: string]: string;
        };
        nextQuestionId: string;
        prevQuestionId: string;
    }>>;
    onPrevClick: () => void;
    onNextClick: () => void;
    submitError: boolean;
    optionNotSelectederr: string;
    questionnaireType: string;
}

export default function QuestionnaireSection({
     qNo, 
     progressBarStatus, 
     currentQuestion, 
     setSelectedOption, 
     onPrevClick, 
     onNextClick, 
     submitError, 
     optionNotSelectederr,
     questionnaireType
    }: QuestionnaireSectionPropsI)
    {
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
                {`${questionnaireType}  Q${qNo} of Q`}</Typography>
          <LinearProgress variant="determinate" value={progressBarStatus} />
        </Box>
         <Box sx={{ bgcolor: "rgb(255, 255, 255)", width: "600px"}}>
            <Box sx={{ margin: "1rem" }}>
                <Typography sx={{ fontSize: "1.4rem"}}>{currentQuestion.question}</Typography>
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
                      onChange={(e)=>
                        setSelectedOption(prev => {
                          if(prev?.id === currentQuestion.id){
                            return {
                                ...prev,
                                value: {
                                    ...(prev.value as { [key: string]: string }),
                                    [opt.value]: e.target.value
                                }
                            };
                          }
                          return {
                            id: currentQuestion.id,
                            value: {
                                [opt.value]: e.target.value
                            },
                            nextQuestionId: opt.nextQuestionId,
                            prevQuestionId: opt.prevQuestionId,
                          };
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
              <Button 
                 sx={{paddingX: "1rem"}} 
                 variant="outlined" 
                 onClick={()=>onPrevClick()} 
                 disabled={currentQuestion.id === "q1"}
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