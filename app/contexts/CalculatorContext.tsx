import { createContext, useContext, useState } from 'react';

export type AnswerI = {
  qId: string;
  question: string;
  answer: string | {};
};
export type QuestionnaireI = {
  [type: string]: AnswerI[];
}

interface CalculatorContextType {
    foodProgressPer: number,
    setFoodProgressPer: React.Dispatch<React.SetStateAction<number>>;
    questionnaireContext: QuestionnaireI,
    setQuestionnaireContext: React.Dispatch<React.SetStateAction<QuestionnaireI>>;
}

const CalculatorContext = createContext<CalculatorContextType | null>(null);

export default function CalculatorProvider({children}: {children: React.ReactNode}){
    const [foodProgressPer, setFoodProgressPer] = useState(1);
    const [questionnaireContext, setQuestionnaireContext] = useState({});
    return (
        <CalculatorContext.Provider value={{foodProgressPer, setFoodProgressPer, questionnaireContext, setQuestionnaireContext}}>
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