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
