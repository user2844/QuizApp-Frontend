import { useState } from "react";
import QuizSelection from "./QuizSelection";
import QuizQuestion from "./QuizQuestion";

export default function TakeQuiz() {

  const [quizStarted, setQuizStarted] = useState(false);
  const [quizSettings, setQuizSettings] = useState(null);


  function handleStartQuiz(settings) {

    setQuizSettings(settings);
    setQuizStarted(true);

  }


  // Show category/subcategory selection
  if (!quizStarted) {
    return (
      <QuizSelection
        onStartQuiz={handleStartQuiz}
      />
    );
  }


  // Show the actual questions
  return (
    <QuizQuestion
      category={quizSettings.category}
      subCategory={quizSettings.subCategory}
    />
  );
}