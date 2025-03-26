import { AnswerI, useCalculator } from "../contexts/CalculatorContext";
import { Questionnaire } from "./mockQuestionnaire";

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
  optionSelected?
) => {
  const previousQuestionId = currentQuestion.options[0]?.prevQuestionId;
  return questionnaire.find((qns) => qns.id === previousQuestionId);
};

export const updateQuestionnaire = (
  prevQuestionnaire,
  currentQuestion,
  selectedOption,
  section,
  inputType?,
  event?
) => {
  const newQuestionnaireSet = { ...prevQuestionnaire };
  const travelQuestionnaireSet: AnswerI[] = [
    ...(newQuestionnaireSet[section] || []),
  ];
  if (inputType === "select") {
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
  } else {
    const existingTextFieldQid = travelQuestionnaireSet.findIndex(
      (tr) => tr.qId === currentQuestion.id
    );
    if (existingTextFieldQid !== -1) {
      const existingTextFieldQAns =
        travelQuestionnaireSet[existingTextFieldQid];
      const updatedQAns = {
        ...existingTextFieldQAns,
        answer: {
          ...(existingTextFieldQAns.answer as { [type: string]: string }),
          [selectedOption.value]: event.target.value,
        },
      };
      travelQuestionnaireSet[existingTextFieldQid] = updatedQAns;
      return {
        ...newQuestionnaireSet,
        [section]: travelQuestionnaireSet,
      };
    } else {
      travelQuestionnaireSet.push({
        qId: currentQuestion.id,
        question: currentQuestion.question,
        answer: {
          [selectedOption.value]: event.target.value,
        },
      });
      return {
        ...newQuestionnaireSet,
        [section]: travelQuestionnaireSet,
      };
    }
  }
};

// Helper function for updating progress bar
export const updateProgress = (value: number, setFoodProgressPer) => {
  setFoodProgressPer((prevVal) => prevVal + value);
};
// Helper function for resetting selected option state
export const resetSubmittedAnswer = (setSelectedOption) => {
  setSelectedOption(null);
};
export const getLastQuestionIdForSection = (section) => {
  return Questionnaire[section][Questionnaire[section].length - 1].id;
};
export const isFirstQuestionForCurrentSection = (currentQuestion) => {
  console.log("currentQuestion.id", currentQuestion.id);
  return currentQuestion.id === "q1";
};
//Helper function to switch to the next section
export const getNextSection = (currentSection) => {
  const currentSectionIndex =
    Object.keys(Questionnaire).indexOf(currentSection);

  if (currentSectionIndex > 4) {
    return;
  }
  return Object.keys(Questionnaire)[currentSectionIndex + 1];
};
//helper function for switching to prev section
export const getPrevSection = (currentSection) => {
  const currentSectionIndex =
    Object.keys(Questionnaire).indexOf(currentSection);

  if (currentSectionIndex === 0) {
    return null;
  }
  return Object.keys(Questionnaire)[currentSectionIndex - 1];
};
export const getProgressBarContext = (section) => {
  const {
    foodProgressPer,
    setFoodProgressPer,
    travelProgressPer,
    setTravelProgressPer,
    homeProgressPer,
    setHomeProgressPer,
    shoppingProgressPer,
    setShoppingProgressPer,
  } = useCalculator();
  const currentQuestionnaireSectionLength = Questionnaire[section].length;
  const progressFactor = 100 / currentQuestionnaireSectionLength;
  if (section === "foodQuestionnaire") {
    return {
      progressFactor,
      progressBarStatus: foodProgressPer,
      setProgressBarStatus: setFoodProgressPer,
    };
  } else if (section === "travelQuestionnaire") {
    return {
      progressFactor,
      progressBarStatus: travelProgressPer,
      setProgressBarStatus: setTravelProgressPer,
    };
  } else if (section === "homeQuestionnaire") {
    return {
      progressFactor,
      progressBarStatus: homeProgressPer,
      setProgressBarStatus: setHomeProgressPer,
    };
  } else {
    return {
      progressFactor,
      progressBarStatus: shoppingProgressPer,
      setProgressBarStatus: setShoppingProgressPer,
    };
  }
};
export const resetProgressBar = (progressBarPer) => {
  const {
    setFoodProgressPer,
    setTravelProgressPer,
    setHomeProgressPer,
    setShoppingProgressPer,
  } = progressBarPer;
  setFoodProgressPer(0);
  setTravelProgressPer(0);
  setHomeProgressPer(0);
  setShoppingProgressPer(0);
};

//Get already selected Option
export const getSelectedOption = (
  questionnaireContext,
  currentQuestion,
  section
) => {
  if (!questionnaireContext || !questionnaireContext[section]) {
    return;
  }
  //get the selected option from the context store
  const QAnsSet = questionnaireContext[section];
  const currentQAns = QAnsSet.find((qans) => qans.qId === currentQuestion.id);
  //if current questionAns set not exist in the context
  if (!currentQAns) {
    return;
  }
  if (currentQuestion.answerType !== "select") {
    return;
  }
  //find the selected option index from the current options list matches with the selected option
  const selectedOptionIndex = currentQuestion.options.findIndex(
    (opt) => opt.value === currentQAns.answer
  );
  return selectedOptionIndex;
};
//fetch particular text field value by label
export const getTextFieldValue = (
  questionnaireContext,
  currentQuestion,
  label
) => {
  const textFieldValue = questionnaireContext.find(
    (qans) => qans.qId === currentQuestion.id
  )?.answer[label];
  return textFieldValue ? textFieldValue : 0;
};
