import { createContext, useContext, useState } from 'react';
import { QuestionType } from '../calculator/QuestionnaireSection';
import { Questionnaire } from '../utils/mockQuestionnaire';

export type AnswerI = {
  qId: string;
  answer: string | {} | [];
};
export type QuestionnaireI = {
  [type: string]: AnswerI[];
}

interface CalculatorContextType {
    foodProgressPer: number,
    setFoodProgressPer: React.Dispatch<React.SetStateAction<number>>;
    shoppingProgressPer: number,
    setShoppingProgressPer: React.Dispatch<React.SetStateAction<number>>;
    travelProgressPer: number,
    setTravelProgressPer: React.Dispatch<React.SetStateAction<number>>;
    homeProgressPer: number,
    setHomeProgressPer: React.Dispatch<React.SetStateAction<number>>;
    questionnaireContext: QuestionnaireI,
    setQuestionnaireContext: React.Dispatch<React.SetStateAction<QuestionnaireI>>;
    currentQuestionContext: QuestionType,
    setCurrentQuestionContext: React.Dispatch<React.SetStateAction<QuestionType | {}>>;
    isPrevBtnClickedOnFirstQuestion: boolean, 
    setIsPrevBtnClickedOnFirstQuestion: React.Dispatch<React.SetStateAction<boolean>>;
}

const CalculatorContext = createContext<CalculatorContextType | null>(null);

export default function CalculatorProvider({children}: {children: React.ReactNode}){
    const [foodProgressPer, setFoodProgressPer] = useState(1);
    const [questionnaireContext, setQuestionnaireContext] = useState({});
    const [shoppingProgressPer, setShoppingProgressPer] = useState(1);
    const [travelProgressPer, setTravelProgressPer] = useState(1);
    const [homeProgressPer, setHomeProgressPer] = useState(1);
    const [currentQuestionContext, setCurrentQuestionContext] = useState(null);
    const [isPrevBtnClickedOnFirstQuestion, setIsPrevBtnClickedOnFirstQuestion] = useState(false);

    return (
        <CalculatorContext.Provider value={{
          foodProgressPer, 
          setFoodProgressPer, 
          questionnaireContext, 
          setQuestionnaireContext,
          travelProgressPer,
          setTravelProgressPer,
          homeProgressPer,
          setHomeProgressPer,
          shoppingProgressPer,
          setShoppingProgressPer,
          currentQuestionContext,
          setCurrentQuestionContext,
          isPrevBtnClickedOnFirstQuestion,
          setIsPrevBtnClickedOnFirstQuestion
        }}
        >
          {children}
        </CalculatorContext.Provider>
    )
} 
export function useCalculator(){
  const context = useContext(CalculatorContext);
  if (!context) {
    throw new Error("useCalculator must be used within a CalculatorProvider");
  }
  return context;
}