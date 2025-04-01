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
  questionnaireContext,
  currentQuestion,
  section,
  updateProgress,
  progressFactor,
  setQNo,
  router
) => {
  const prevSection = getPrevSection(section);
  //get question from previous section if the current section is on first question
  if (isFirstQuestionOfCurrentSection(currentQuestion) && prevSection) {
    setQNo(Questionnaire[prevSection].length);
    router.push(`/calculator/${prevSection}`);
    //get last question of prev questionnaire section
    const prevSectionLastQuestion =
      Questionnaire[prevSection][Questionnaire[prevSection].length - 1];
    return prevSectionLastQuestion;
  }
  if (section === "travelQuestionnaire") {
    const travelQnsIds = questionnaireContext?.map((qAns) => qAns.qId);
    const dependentQuestions = {
      q4: ["q3", "q1"],
      q3: ["q2", "q1"],
    };

    if (dependentQuestions[currentQuestion.id]) {
      for (const depQId of dependentQuestions[currentQuestion.id]) {
        if (travelQnsIds.includes(depQId)) {
          return Questionnaire[section].find((qAns) => qAns.id === depQId);
        }
      }
    }
  }
  updateProgress(-progressFactor);
  setQNo((prev) => prev - 1);
  const previousQuestionId = currentQuestion.options[0]?.prevQuestionId;
  return Questionnaire[section].find((qns) => qns.id === previousQuestionId);
};

export const updateQuestionnaire = (
  prevQuestionnaire,
  currentQuestion,
  selectedOption,
  section,
  inputType,
  optionType,
  isToggled?,
  event?
) => {
  const QuestionAnsSetArr: AnswerI[] = [...(prevQuestionnaire[section] || [])];
  // Helper to update the questionnaire state
  const updateState = () => ({
    ...prevQuestionnaire,
    [section]: QuestionAnsSetArr,
  });

  // handle select inputs
  if (inputType === "select") {
    const updatedAnswer: AnswerI = {
      qId: currentQuestion.id,
      question: currentQuestion.question,
      answer: {
        label: selectedOption.label,
        value: selectedOption.value,
      },
    };
    const existingQAnsIndex = QuestionAnsSetArr.findIndex(
      (tr) => tr.qId === currentQuestion.id
    );
    if (existingQAnsIndex !== -1) {
      if (optionType === "single") {
        //update single choice answer
        //remove all already answered if q1 and q2 question answer updated
        const travelQuestionNo1Index = QuestionAnsSetArr.findIndex(
          (qAns) => qAns.qId === "q1"
        );
        if (
          travelQuestionNo1Index !== -1 &&
          section === "travelQuestionnaire" &&
          currentQuestion.id === "q1"
        ) {
          QuestionAnsSetArr.length = 0;
        }
        QuestionAnsSetArr[existingQAnsIndex] = updatedAnswer;
      } else {
        //handling multiple selection
        const newAnswer = QuestionAnsSetArr[existingQAnsIndex].answer as {
          label: string;
          value: number;
        }[];
        const existingAnsIndex = newAnswer.findIndex(
          (ans) => ans.label === selectedOption.label
        );
        if (existingAnsIndex !== -1) {
          //update existing answers
          //remove answer if deselected
          if (!isToggled) {
            newAnswer.splice(existingAnsIndex, 1);
          } else {
            newAnswer[existingAnsIndex].value = selectedOption.value;
          }
        } else {
          // Add new answers
          newAnswer.push({
            label: selectedOption.label,
            value: selectedOption.value,
          });
        }
        updatedAnswer.answer = newAnswer;
        QuestionAnsSetArr[existingQAnsIndex] = updatedAnswer;
      }
    } else {
      //Add new answer foe songle and multiple choice
      if (optionType === "single") {
        QuestionAnsSetArr.push(updatedAnswer);
      } else {
        QuestionAnsSetArr.push({
          qId: currentQuestion.id,
          question: currentQuestion.question,
          answer: [
            { label: selectedOption.label, value: selectedOption.value },
          ],
        });
      }
    }
    return updateState();
  }

  //adding & updating textfield
  const existingTextFieldQid = QuestionAnsSetArr.findIndex(
    (tr) => tr.qId === currentQuestion.id
  );
  const newTextAnswer = {
    qId: currentQuestion.id,
    question: currentQuestion.question,
    answer: {
      [selectedOption.value]: event.target.value,
    },
  };
  if (existingTextFieldQid !== -1) {
    //update existing tet answers
    const existingTextField = QuestionAnsSetArr[existingTextFieldQid];
    const updatedTextfield = {
      ...existingTextField,
      answer: {
        ...(existingTextField.answer as { [type: string]: string }),
        [selectedOption.value]: event.target.value,
      },
    };
    QuestionAnsSetArr[existingTextFieldQid] = updatedTextfield;
  } else {
    // Add new text answer
    QuestionAnsSetArr.push(newTextAnswer);
  }
  return updateState();
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
export const isFirstQuestionOfCurrentSection = (currentQuestion) => {
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
  if (
    !questionnaireContext ||
    !questionnaireContext[section] ||
    !currentQuestion
  ) {
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
  if (currentQuestion.optionType === "multiple") {
    if (!Array.isArray(currentQAns.answer)) {
      currentQAns.answer = [];
    }
    //find all the indexes of multiple selected answers
    const selectedMultipleIndex: string[] = currentQAns.answer.map((opt) => {
      const index = currentQuestion.options.findIndex(
        (qAns) => qAns.label === opt.label
      );
      if (index === -1) {
        return;
      }
      return index;
    });
    return selectedMultipleIndex;
  }
  //find the selected option index from the current options list matches with the selected option
  const selectedOptionIndex = currentQuestion.options.findIndex(
    (opt) => opt.label === currentQAns.answer.label
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
