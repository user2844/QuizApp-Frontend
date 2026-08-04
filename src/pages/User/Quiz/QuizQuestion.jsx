import styles from "./QuizQuestion.module.css";
import Button from "../../../components/Button/Button.jsx";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import ProgressCircle from "../../../components/ProgressCircle/ProgressCircle.jsx";
import { toast } from 'sonner';

const questions = [
    {
      id: 1,
      question: "What is the largest organ in human body?",
      options: ["Hair", "Eye", "Liver", "Skin"],
      answer: "Skin",
    },
    {
      id: 2,
      question: `Which planet is known as the "Red Planet"?`,
      options: ["Venus", "Mercury", "Mars", "Jupiter"],
      answer: "Mars",
    },
    {
      id: 3,
      question: "Name a non-metal that conducts electricity.",
      options: ["Carbon", "Graphite", "Nitrogen", "Hydrogen"],
      answer: "Graphite",
    },
    {
      id: 4,
      question: "What is the smallest prime number?",
      options: ["1", "0", "3", "2"],
      answer: "2",
    },
    {
      id: 5,
      question: "What is the currency used in Belgium?",
      options: ["Euro", "USD", "Rupees", "Yen"],
      answer: "Euro",
    },
    {
      id: 6,
      question: "Who invented the telephone?",
      options: ["Alexander Graham Bell", "Issac Newton", "Albert Einstein", "Openheimer"],
      answer: "Alexander Graham Bell",
    },
    {
      id: 7,
      question: "What is the capital of Australia?",
      options: ["Canberra", "Melbourne", "Sydney", "Brisbane"],
      answer: "Canberra",
    }
];

export default function QuizQuestion() {
  const navigate = useNavigate();

  const [currentQuestion, setCurrentQuestion] = useState(0); 
  const [score, setScore] = useState(0); 
  const [answered, setAnswered] = useState(false); 
  const [selectedAnswer, setSelectedAnswer] = useState(null); 
  const [quizFinished, setQuizFinished] = useState(false); 

  const [sortedQuestion] = useState(() => [...questions].sort(() => Math.random() - 0.5));

  const percentage = ((score / questions.length) * 100).toFixed(1);
  const quiz = sortedQuestion[currentQuestion];

  const finalScore = score;
  const category = "General Knowledge";
  const totalQuestions = questions.length;
  const mistakes = totalQuestions - finalScore;


  // Save results safely using useEffect when quizFinished turns true
  useEffect(() => {
    if (!quizFinished) return;
      const token = localStorage.getItem("token");
      
      if(!token){
        return toast.error("User not identified!");
      }

    async function saveQuizResult() {
      
      try {
        const response = await fetch("http://localhost:4000/api/records", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            score: finalScore,
            category,
            totalQuestions,
            mistakes,
            percentage,
          })
        });
        const data = await response.json();
        console.log(data)

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

  function handleAnswer(option) {
    if (answered) return;

    setSelectedAnswer(option);
    setAnswered(true);

    if (option === quiz.answer) {
      setScore(prev => prev + 1);
    }
  }

  function handleNext() {
    if (!answered) {
      toast.error("u haven't choosed a answer", {
        style: {
          background: 'rgba(229, 224, 224, 0.187)',
          backdropFilter: 'blur(8px)',
        }
      });
      return;
    }

    if (currentQuestion === sortedQuestion.length - 1) {
      setQuizFinished(true);
      return;
    }

    setAnswered(false);
    setSelectedAnswer(null);
    setCurrentQuestion(prev => prev + 1);
  }

  // Render the finished screen if the quiz is done
  if (quizFinished) {
    return (
        <div className={styles.finishedDiv}>
          <h1> Quiz Finished! 🥳</h1>
          <p>Score: {score} / {questions.length}</p>
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

  return (
    <div className={styles.quizContainer}>
      <ProgressCircle 
        progress={percentage}
        score={score * 100}
      />
      <div className={styles.questionDiv}>
        <h1>{quiz.question}</h1>
      </div>
      <div className={styles.answers}>
        {quiz.options.map((option) => (
            <Button 
              key={option}
              text={option} 
              disabled={answered}
              variant={
                answered 
                  ? option === quiz.answer
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
      <div className={styles.nextBtn}>
        <Button text="Next" variant="toggleBtn" onClick={handleNext} />
      </div>
    </div>
  );
}