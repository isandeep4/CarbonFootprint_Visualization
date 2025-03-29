export const Questionnaire = {
  foodQuestionnaire: [
    {
      id: "q1",
      question: "What do you eat in a week?",
      options: [
        {
          label: "BEEF(Kg)",
          value: 36,
          nextQuestionId: "q2",
          prevQuestionId: null,
        },
        {
          label: "LAMB & MUTTON(Kg)",
          value: 20,
          nextQuestionId: "q2",
          prevQuestionId: null,
        },
        {
          label: "PORK(Kg)",
          value: 12,
          nextQuestionId: "q2",
          prevQuestionId: null,
        },
        {
          label: "POULTRY",
          value: 10,
          nextQuestionId: "q2",
          prevQuestionId: null,
        },
        {
          label: "SEA FOOD",
          value: 20,
          nextQuestionId: "q2",
          prevQuestionId: null,
        },
        {
          label: "DIARY PRODUCTS",
          value: 15,
          nextQuestionId: "q2",
          prevQuestionId: null,
        },
        {
          label: "Vegetables",
          value: 5,
          nextQuestionId: "q2",
          prevQuestionId: null,
        },
      ],
      answerType: "select",
      optionType: "multiple",
    },
    {
      id: "q2",
      question:
        "In a week, how much do you spend on food from restaurants, canteens and takeaways?",
      optionType: "single",
      options: [
        {
          label: "0$",
          value: "0$",
          nextQuestionId: "q3",
          prevQuestionId: "q1",
        },
        {
          label: "1$-10$",
          value: "1$-10$",
          nextQuestionId: "q3",
          prevQuestionId: "q1",
        },
        {
          label: "10$-50$",
          value: "10$-50$",
          nextQuestionId: "q3",
          prevQuestionId: "q1",
        },
        {
          label: "More than 50$",
          value: ">50$",
          nextQuestionId: "q3",
          prevQuestionId: "q1",
        },
      ],
      answerType: "select",
    },
    {
      id: "q3",
      question: "Of the food you buy how much is wasted and thrown away?",
      optionType: "single",
      options: [
        {
          label: "None",
          value: "none",
          nextQuestionId: "q4",
          prevQuestionId: "q2",
        },
        {
          label: "0%-10%",
          value: "0%-10%",
          nextQuestionId: "q4",
          prevQuestionId: "q2",
        },
        {
          label: "10%-30%",
          value: "10%-50%",
          nextQuestionId: "q4",
          prevQuestionId: "q2",
        },
        {
          label: "More than 30$",
          value: ">30%",
          nextQuestionId: "q4",
          prevQuestionId: "q2",
        },
      ],
      answerType: "select",
    },
    {
      id: "q4",
      question:
        "How often do you buy locally produced food that is not imported to the UK?",
      optionType: "single",
      options: [
        {
          label: "Local market",
          value: "local_market",
          nextQuestionId: null,
          prevQuestionId: "q3",
        },
        {
          label: "Food mart",
          value: "food_mart",
          nextQuestionId: null,
          prevQuestionId: "q3",
        },
        {
          label: "Both",
          value: "both",
          nextQuestionId: null,
          prevQuestionId: "q3",
        },
      ],
      answerType: "select",
    },
  ],
  travelQuestionnaire: [
    {
      id: "q1",
      question:
        "What kind of vehicle do you travel in most often as driver or passenger? (if any)?",
      optionType: "single",
      options: [
        {
          label: "Car",
          value: "car",
          nextQuestionId: "q2",
          prevQuestionId: null,
        },
        {
          label: "Motorbike",
          value: "motorbike",
          nextQuestionId: "q3",
          prevQuestionId: null,
        },
        {
          label: "Public transport",
          value: "public_transport",
          nextQuestionId: "q4",
          prevQuestionId: null,
        },
        {
          label: "Walk or Cycle",
          value: "walk_cycle",
          nextQuestionId: "q4",
          prevQuestionId: null,
        },
      ],
      answerType: "select",
    },
    {
      id: "q2",
      question: "What is your car's fuel type?",
      optionType: "single",
      options: [
        {
          label: "Petrol",
          value: "petrol",
          nextQuestionId: "q3",
          prevQuestionId: "q1",
        },
        {
          label: "Electric",
          value: "electric",
          nextQuestionId: "q3",
          prevQuestionId: "q1",
        },
        {
          label: "Diesel",
          value: "diesel",
          nextQuestionId: "q3",
          prevQuestionId: "q1",
        },
        {
          label: "Hybrid",
          value: "hybrid",
          nextQuestionId: "q3",
          prevQuestionId: "q1",
        },
      ],
      answerType: "select",
    },
    {
      id: "q3",
      question:
        "How many hours a week do you spend in your car or on your motorbike for personal use including commuting?",
      optionType: "single",
      options: [
        {
          label: "Under 2 hours",
          value: "2hrs",
          nextQuestionId: "q5",
          prevQuestionId: "q2",
        },
        {
          label: "2 to 5 hours",
          value: "2to5hrs",
          nextQuestionId: "q5",
          prevQuestionId: "q2",
        },
        {
          label: "5 to 15 hours",
          value: "5to15hrs",
          nextQuestionId: "q5",
          prevQuestionId: "q2",
        },
        {
          label: "15 to 25 hours",
          value: "15to25hrs",
          nextQuestionId: "q5",
          prevQuestionId: "q2",
        },
        {
          label: "Over 25 hours",
          value: "25hrs",
          nextQuestionId: "q5",
          prevQuestionId: "q2",
        },
      ],
      answerType: "select",
    },
    {
      id: "q4",
      question:
        "How many hours a week do you spend on the train for personal use including commuting?",
      optionType: "single",
      options: [
        {
          label: "I don't travel by train",
          value: "none",
          nextQuestionId: "q5",
          prevQuestionId: "q3",
        },
        {
          label: "under 2 hours",
          value: "2hrs",
          nextQuestionId: "q5",
          prevQuestionId: "q3",
        },
        {
          label: "2 to 5 hours",
          value: "2to5hrs",
          nextQuestionId: "q5",
          prevQuestionId: "q3",
        },
        {
          label: "5 to 15 hours",
          value: "55to15hrs",
          nextQuestionId: "q5",
          prevQuestionId: "q3",
        },
        {
          label: "15 to 25 hours",
          value: "15to25hrs",
          nextQuestionId: "q5",
          prevQuestionId: "q3",
        },
        {
          label: "Over 25 hours",
          value: "25hrs",
          nextQuestionId: "q5",
          prevQuestionId: "q3",
        },
      ],
      answerType: "select",
    },
    {
      id: "q5",
      question:
        "In the last year, how many return flights have you made in total to the following locations?",
      optionType: "single",
      options: [
        {
          label: "Domestic (UK / Ireland)",
          value: "domestic",
          nextQuestionId: "q6",
          prevQuestionId: "q4",
        },
        {
          label: "To/from Europe",
          value: "continent",
          nextQuestionId: "q6",
          prevQuestionId: "q4",
        },
        {
          label: "To/from outside Europe",
          value: "international",
          nextQuestionId: "q6",
          prevQuestionId: "q4",
        },
      ],
      answerType: "textField",
    },
    {
      id: "q6",
      question: "What percentage of your flights do you offset?",
      optionType: "single",
      options: [
        {
          label: "None of them",
          value: "none",
          nextQuestionId: null,
          prevQuestionId: "q5",
        },
        {
          label: "25%",
          value: "25%",
          nextQuestionId: null,
          prevQuestionId: "q5",
        },
        {
          label: "50%",
          value: "50%",
          nextQuestionId: null,
          prevQuestionId: "q5",
        },
        {
          label: "75%",
          value: "75%",
          nextQuestionId: null,
          prevQuestionId: "q5",
        },
        {
          label: "All of them",
          value: "all",
          nextQuestionId: null,
          prevQuestionId: "q5",
        },
      ],
      answerType: "select",
    },
  ],
  homeQuestionnaire: [
    {
      id: "q1",
      question: "What kind of house do you live in?",
      optionType: "single",
      options: [
        {
          label: "Detached",
          value: "detached",
          nextQuestionId: "q2",
          prevQuestionId: null,
        },
        {
          label: "Semi detached",
          value: "semiDetached",
          nextQuestionId: "q2",
          prevQuestionId: null,
        },
        {
          label: "Terrace",
          value: "terrace",
          nextQuestionId: "q2",
          prevQuestionId: null,
        },
        {
          label: "Flat",
          value: "flat",
          nextQuestionId: "q2",
          prevQuestionId: null,
        },
      ],
      answerType: "select",
    },
    {
      id: "q2",
      question: "How many bedrooms does your house have?",
      optionType: "single",
      options: [
        {
          label: "1",
          value: "1",
          nextQuestionId: "q3",
          prevQuestionId: "q1",
        },
        {
          label: "2",
          value: "2",
          nextQuestionId: "q3",
          prevQuestionId: "q1",
        },
        {
          label: "3",
          value: "3",
          nextQuestionId: "q3",
          prevQuestionId: "q1",
        },
        {
          label: "4 or more",
          value: ">=4",
          nextQuestionId: "q3",
          prevQuestionId: "q1",
        },
      ],
      answerType: "select",
    },
    {
      id: "q3",
      question: "How many people (aged 17 and over) live in your house?",
      optionType: "single",
      options: [
        {
          label: "1",
          value: "1",
          nextQuestionId: "q4",
          prevQuestionId: "q2",
        },
        {
          label: "2",
          value: "2",
          nextQuestionId: "q4",
          prevQuestionId: "q2",
        },
        {
          label: "3",
          value: "3",
          nextQuestionId: "q4",
          prevQuestionId: "q2",
        },
        {
          label: "4 or more",
          value: ">=4",
          nextQuestionId: "q4",
          prevQuestionId: "q2",
        },
      ],
      answerType: "select",
    },
    {
      id: "q4",
      question: "How do you heat your home?",
      optionType: "single",
      options: [
        {
          label: "Gas",
          value: "gas",
          nextQuestionId: "q5",
          prevQuestionId: "q3",
        },
        {
          label: "Oil",
          value: "oil",
          nextQuestionId: "q5",
          prevQuestionId: "q3",
        },
        {
          label: "Electricity",
          value: "electricity",
          nextQuestionId: "q5",
          prevQuestionId: "q3",
        },
        {
          label: "Wood",
          value: "wood",
          nextQuestionId: "q5",
          prevQuestionId: "q3",
        },
      ],
      answerType: "select",
    },
    {
      id: "q5",
      question:
        "Do you regularly turn off lights and not leave your appliances on standby?",
      optionType: "single",
      options: [
        {
          label: "Yes",
          value: "yes",
          nextQuestionId: "q6",
          prevQuestionId: "q4",
        },
        {
          label: "No",
          value: "no",
          nextQuestionId: "q6",
          prevQuestionId: "q4",
        },
      ],
      answerType: "select",
    },
    {
      id: "q6",
      question: "How warm do you keep your home in winter?",
      optionType: "single",
      options: [
        {
          label: "below 14 degree",
          value: "<14",
          nextQuestionId: null,
          prevQuestionId: "q5",
        },
        {
          label: "14 - 17 degree c",
          value: "14-17",
          nextQuestionId: null,
          prevQuestionId: "q5",
        },
        {
          label: "18-21 degree c",
          value: "18-21",
          nextQuestionId: null,
          prevQuestionId: "q5",
        },
        {
          label: "over 21 degree c",
          value: ">21",
          nextQuestionId: null,
          prevQuestionId: "q5",
        },
      ],
      answerType: "select",
    },
  ],
  shoppingQuestionnaire: [
    {
      id: "q1",
      question:
        "In a typical month, how much do you spend on clothes and footwear?",
      optionType: "single",
      options: [
        {
          label: "0$",
          value: "0",
          nextQuestionId: "q2",
          prevQuestionId: null,
        },
        {
          label: "1$-60$",
          value: "1-60",
          nextQuestionId: "q2",
          prevQuestionId: null,
        },
        {
          label: "60$-150$",
          value: "terrace",
          nextQuestionId: "q2",
          prevQuestionId: null,
        },
        {
          label: "More than 150$",
          value: ">150$",
          nextQuestionId: "q2",
          prevQuestionId: null,
        },
      ],
      answerType: "select",
    },
    {
      id: "q2",
      question:
        "In a typical month, how much do you spend on health, beauty and grooming products?",
      optionType: "single",
      options: [
        {
          label: "1$",
          value: "1",
          nextQuestionId: "q3",
          prevQuestionId: "q1",
        },
        {
          label: "1$ - 60$",
          value: "1-60",
          nextQuestionId: "q3",
          prevQuestionId: "q1",
        },
        {
          label: "More than 60$",
          value: ">60$",
          nextQuestionId: "q3",
          prevQuestionId: "q1",
        },
      ],
      answerType: "select",
    },
    {
      id: "q3",
      question:
        "In a typical month, how much do you spend on phone, internet and TV contracts?",
      optionType: "single",
      options: [
        {
          label: "0$",
          value: "0",
          nextQuestionId: "q4",
          prevQuestionId: "q2",
        },
        {
          label: "1$ - 35$",
          value: "2",
          nextQuestionId: "q4",
          prevQuestionId: "q2",
        },
        {
          label: "35$ - 70$",
          value: "35-70",
          nextQuestionId: "q4",
          prevQuestionId: "q2",
        },
        {
          label: "70$+",
          value: ">=70$",
          nextQuestionId: "q4",
          prevQuestionId: "q2",
        },
      ],
      answerType: "select",
    },
    {
      id: "q4",
      question:
        "In a typical month, how much do you spend on entertainment and hobbies (sports/gym, cinema, books, newspapers, gardening, computer games)",
      optionType: "single",
      options: [
        {
          label: "0$ - 25$",
          value: "0-25",
          nextQuestionId: "q5",
          prevQuestionId: "q3",
        },
        {
          label: "25$ - 50$",
          value: "25-50",
          nextQuestionId: "q5",
          prevQuestionId: "q3",
        },
        {
          label: "50$ - 75$",
          value: "50-75",
          nextQuestionId: "q5",
          prevQuestionId: "q3",
        },
        {
          label: "75$+",
          value: ">75$",
          nextQuestionId: "q5",
          prevQuestionId: "q3",
        },
      ],
      answerType: "select",
    },
    {
      id: "q5",
      question: "Which of these types of waste do you recycle and/or compost?",
      optionType: "single",
      options: [
        {
          label: "Food",
          value: "food",
          nextQuestionId: "q6",
          prevQuestionId: "q4",
        },
        {
          label: "Paper",
          value: "Paper",
          nextQuestionId: "q6",
          prevQuestionId: "q4",
        },
        {
          label: "Tin Cans",
          value: "metal",
          nextQuestionId: "q6",
          prevQuestionId: "q4",
        },
        {
          label: "Plastic",
          value: "plastic",
          nextQuestionId: "q6",
          prevQuestionId: "q4",
        },
        {
          label: "Glass",
          value: "glass",
          nextQuestionId: "q6",
          prevQuestionId: "q4",
        },
      ],
      answerType: "select",
    },
  ],
};
