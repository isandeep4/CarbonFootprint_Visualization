import { AnswerI } from "../contexts/CalculatorContext";

export const getNextQuestion = (
  questionnaire,
  currentQuestion,
  optionSelected?
) => {
  if (optionSelected) {
    const nextQuestionId = currentQuestion.options.find(
      (opt) => opt.value === optionSelected.value
    )?.nextQuestionId;
    return questionnaire.find((qns) => qns.id === nextQuestionId);
  } else {
    return questionnaire.find(
      (qns) => qns.id === currentQuestion.options[0]?.nextQuestionId
    );
  }
};
export const getPreviousQuestion = (
  questionnaire,
  currentQuestion,
  optionSelected
) => {
  const previousQuestionId = currentQuestion.options[0]?.prevQuestionId;
  return questionnaire.find((qns) => qns.id === previousQuestionId);
};

export const updateQuestionnaire = (
  prevQuestionnaire,
  currentQuestion,
  selectedOption,
  section
) => {
  const newQuestionnaireSet = { ...prevQuestionnaire };
  const travelQuestionnaireSet: AnswerI[] = [
    ...(newQuestionnaireSet[section] || []),
  ];
  const updatedAnswer: AnswerI = {
    qId: currentQuestion.id,
    question: currentQuestion.question,
    answer: selectedOption.value,
  };
  const existingTravelQId = travelQuestionnaireSet.findIndex(
    (tr) => tr.qId === currentQuestion.id
  );
  if (existingTravelQId !== -1) {
    travelQuestionnaireSet[existingTravelQId] = updatedAnswer;
  } else {
    travelQuestionnaireSet.push(updatedAnswer);
  }
  return {
    ...newQuestionnaireSet,
    [section]: travelQuestionnaireSet,
  };
};

// Helper function for updating progress bar
export const updateProgress = (value: number, setFoodProgressPer) => {
  setFoodProgressPer((prevVal) => prevVal + value);
};
// Helper function for resetting selected option state
export const resetSubmittedAnswer = (setSelectedOption) => {
  setSelectedOption(null);
};
