import style from "./ManageQuiz.module.css";
import SearchBar from "../../../components/SearchBar/SearchBar.jsx";
import { useState, useEffect } from "react";
import Dropdown from "../../../components/Dropdown/Dropdown.jsx";
import Button from "../../../components/Button/Button.jsx";
import QuestionRow from "../../../components/QuestionRow/QuestionRow.jsx";
import {toast} from "sonner";
import { useNavigate } from "react-router-dom";

export default function ManageQuiz() {
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("");
  const [questions, setQuestions] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem("token");

    if (!token) {
      return toast.error("User not identified!");
    }
    async function getQuizzes() {
      try {
        const response = await fetch("http://localhost:4000/admin/getAllQuiz", {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        
        if(response.status === 401){
          localStorage.removeItem('token');
          localStorage.removeItem('loggedInUser')
          navigate('/');
          return;
        }

        const data = await response.json();
        console.log(data);

        if(data.length === 0){
          toast.info("No quiz questions found.");
          return;
        }

        setQuestions(data);

      } catch (error) {
        return toast.error(error.message);
      }

    }

    getQuizzes();
  }, []);

  const categories = ["Science", "Geography", "Math", "History", "Biology"];
  

  return (
    <div className={style.mainContainer}>
      <h1>Manage Questions</h1>

      <div className={style.searchBarDiv}>
        <SearchBar
          value={search}
          placeholder="Search Questions...."
          onChange={(e) => setSearch(e.target.value)}
        />
        <Dropdown
          value={category}
          onChange={(e) => setCategory(e.target.value)}
          options={categories}
        />
        <Button text="+Add Quiz" variant="toggleBtn" />
      </div>
      <div className={style.questionsDiv}>
        <div className={style.tableHeader}>
          <div>Question</div>
          <div>Category</div>
          <div>Difficulty</div>
          <div>Actions</div>
        </div>
        {questions.map((question) => (
          <QuestionRow key={question._id} question={question} />
        ))}
      </div>
    </div>
  );
}
