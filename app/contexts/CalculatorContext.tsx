import { createContext, useContext, useState } from 'react';

interface CalculatorContextType {
    foodProgressPer: number,
    setFoodProgressPer: React.Dispatch<React.SetStateAction<number>>;
}

const CalculatorContext = createContext<CalculatorContextType | null>(null);

export default function CalculatorProvider({children}: {children: React.ReactNode}){
    const [foodProgressPer, setFoodProgressPer] = useState(1);
    return (
        <CalculatorContext.Provider value={{foodProgressPer, setFoodProgressPer}}>
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