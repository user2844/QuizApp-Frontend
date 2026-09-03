import styles from "./QuizQuestion.module.css";
import Button from "../../../components/Button/Button.jsx";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import ProgressCircle from "../../../components/ProgressCircle/ProgressCircle.jsx";
import { toast } from "sonner";

export default function QuizQuestion({ category, subCategory }) {
  const navigate = useNavigate();

  // -----------------------------
  // QUIZ STATES
  // -----------------------------

  const [questions, setQuestions] = useState([]);
  const [currentQuestion, setCurrentQuestion] = useState(0);

  const [score, setScore] = useState(0);
  const [answered, setAnswered] = useState(false);
  const [selectedAnswer, setSelectedAnswer] = useState(null);
  const [quizFinished, setQuizFinished] = useState(false);
  const [loading, setLoading] = useState(true);

  // -----------------------------
  // GET QUIZZES FROM BACKEND
  // -----------------------------

  async function getQuizzes() {
    const token = localStorage.getItem("token");

    if (!token) {
      toast.error("User not identified!");
      return;
    }

    try {
      const response = await fetch(
        `http://localhost:4000/api/records/questions?category=${encodeURIComponent(category)}&subCategory=${encodeURIComponent(subCategory)}`,
        {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );

      // Unauthorized
      if (response.status === 401) {
        localStorage.removeItem("token");
        localStorage.removeItem("loggedInUser");

        navigate("/");
        return;
      }

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Failed to fetch quiz questions");
      }

      if (data.length === 0) {
        toast.info("No quiz questions found.");
        return;
      }

      console.log("Questions received from backend:", data);

      // Shuffle questions
      const shuffledQuestions = [...data].sort(() => Math.random() - 0.5);

      setQuestions(shuffledQuestions);
    } catch (error) {
      console.error(error);
      toast.error(error.message);
    } finally {
      setLoading(false);
    }
  }

  // -----------------------------
  // FETCH QUESTIONS WHEN PAGE LOADS
  // -----------------------------

  useEffect(() => {
    if (category && subCategory) {
      getQuizzes();
    }
  }, [category, subCategory]);

  // -----------------------------
  // SAVE QUIZ RESULT
  // -----------------------------

  useEffect(() => {
    if (!quizFinished) return;

    const token = localStorage.getItem("token");

    if (!token) {
      toast.error("User not identified!");
      return;
    }

    async function saveQuizResult() {
      try {
        const finalScore = score;
        const totalQuestions = questions.length;
        const mistakes = totalQuestions - finalScore;

        const percentage =
          totalQuestions > 0
            ? ((finalScore / totalQuestions) * 100).toFixed(1)
            : 0;

        const response = await fetch("http://localhost:4000/api/records", {
          method: "POST",

          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },

          body: JSON.stringify({
            score: finalScore,
            category: "General Knowledge",
            totalQuestions,
            mistakes,
            percentage,
          }),
        });

        const data = await response.json();

        console.log(data);

        if (response.ok) {
          toast.success("Your results have been recorded!");
        } else {
          toast.error(data.message);
        }
      } catch (error) {
        toast.error(error.message);
      }
    }

    saveQuizResult();
  }, [quizFinished]);

  // -----------------------------
  // LOADING SCREEN
  // -----------------------------

  if (loading) {
    return (
      <div className={styles.quizContainer}>
        <h2>Loading questions...</h2>
      </div>
    );
  }

  // -----------------------------
  // NO QUESTIONS
  // -----------------------------

  if (questions.length === 0) {
    return (
      <div className={styles.quizContainer}>
        <h2>No quiz questions available.</h2>

        <Button
          text="Return"
          variant="toggleBtn"
          onClick={() => navigate("/dashboard")}
        />
      </div>
    );
  }

  // -----------------------------
  // CURRENT QUESTION
  // -----------------------------

  const quiz = questions[currentQuestion];

  // -----------------------------
  // PROGRESS
  // -----------------------------

  const percentage = ((score / questions.length) * 100).toFixed(1);

  // -----------------------------
  // HANDLE ANSWER
  // -----------------------------

  function handleAnswer(option) {
    // Don't allow another answer
    if (answered) return;

    setSelectedAnswer(option);
    setAnswered(true);

    // IMPORTANT:
    // Your MongoDB field is correctAnswer
    if (option === quiz.correctAnswer) {
      setScore((prev) => prev + 1);
    }
  }

  // -----------------------------
  // NEXT QUESTION
  // -----------------------------

  function handleNext() {
    if (!answered) {
      toast.error("You haven't chosen an answer!", {
        style: {
          background: "rgba(229, 224, 224, 0.187)",
          backdropFilter: "blur(8px)",
        },
      });

      return;
    }

    // Last question
    if (currentQuestion === questions.length - 1) {
      setQuizFinished(true);

      return;
    }

    // Move to next question

    setAnswered(false);
    setSelectedAnswer(null);

    setCurrentQuestion((prev) => prev + 1);
  }

  // -----------------------------
  // QUIZ FINISHED
  // -----------------------------

  if (quizFinished) {
    return (
      <div className={styles.finishedDiv}>
        <h1>Quiz Finished! 🥳</h1>

        <p>
          Score: {score} / {questions.length}
        </p>

        <p>Mistakes: {questions.length - score}</p>

        <p>Points Earned = {score * 100}</p>

        <div className={styles.nextBtn}>
          <Button
            text="Return"
            variant="toggleBtn"
            onClick={() => navigate("/dashboard")}
          />
        </div>
      </div>
    );
  }

  // -----------------------------
  // QUIZ UI
  // -----------------------------

  return (
    <div className={styles.quizContainer}>
      {/* Progress */}

      <ProgressCircle progress={percentage} score={score * 100} />

      {/* Question */}

      <div className={styles.questionDiv}>
        <h1>{quiz.question}</h1>
      </div>

      {/* Answers */}

      <div className={styles.answers}>
        {quiz.options.map((option, index) => (
          <Button
            key={index}
            text={option}
            disabled={answered}
            variant={
              answered
                ? option === quiz.correctAnswer
                  ? "correctBtn"
                  : selectedAnswer === option
                    ? "wrongBtn"
                    : "mcqBtn"
                : "mcqBtn"
            }
            onClick={() => handleAnswer(option)}
          />
        ))}
      </div>

      {/* Next */}

      <div className={styles.nextBtn}>
        <Button text="Next" variant="toggleBtn" onClick={handleNext} />
      </div>
    </div>
  );
}
