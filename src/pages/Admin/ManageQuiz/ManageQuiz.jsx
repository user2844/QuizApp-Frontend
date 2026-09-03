import style from "./ManageQuiz.module.css";
import SearchBar from "../../../components/SearchBar/SearchBar.jsx";
import { useState, useEffect } from "react";
import Dropdown from "../../../components/Dropdown/Dropdown.jsx";
import Button from "../../../components/Button/Button.jsx";
import QuestionRow from "../../../components/QuestionRow/QuestionRow.jsx";
import { toast } from "sonner";
import { useNavigate } from "react-router-dom";
import AddQuestionModal from "../../../components/AddQuestionModal/AddQuestionModal.jsx";

export default function ManageQuiz() {
  const [search, setSearch] = useState("");
  const [categories, setCategories] = useState([""]);
  const [selectedCategory, setSelectedCategory] = useState("");
  const [questions, setQuestions] = useState([]);
  const navigate = useNavigate();
  const [showAddQuizModal, setShowAddQuizModal] = useState(false);

  async function getQuizzes() {
    const token = localStorage.getItem("token");

    if (!token) {
      return toast.error("User not identified!");
    }
    try {
      const response = await fetch(
        "http://localhost:4000/admin/quiz/getallquiz",
        {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );

      if (response.status === 401) {
        localStorage.removeItem("token");
        localStorage.removeItem("loggedInUser");
        navigate("/");
        return;
      }

      const data = await response.json();

      if (data.length === 0) {
        toast.info("No quiz questions found.");
        return;
      }

      setQuestions(data);
    } catch (error) {
      return toast.error(error.message);
    }
  }

  {
    /*this fetchCategories is to get all the categories form the data base. */
  }
  const fetchCategories = async () => {
    const token = localStorage.getItem("token");

    try {
      const response = await fetch(
        `http://localhost:4000/admin/category/getAllCategories`,
        {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );

      if (response.status === 401) {
        localStorage.removeItem("token");
        localStorage.removeItem("loggedInUser");
        navigate("/");
        return;
      }

      const data = await response.json();

      if (data.length === 0) {
        toast.info("no category found");
        return;
      }

      setCategories(data);
    } catch (err) {}
  };

  useEffect(() => {
    getQuizzes();
    fetchCategories();
  }, []);

  const createQuiz = async ({
    question,
    optionA,
    optionB,
    optionC,
    optionD,
    correctAnswer,
    selectedCategory,
    subCategory,
    difficulty,
  }) => {
    const token = localStorage.getItem("token");
    try {
      const response = await fetch(
        `http://localhost:4000/admin/quiz/addNewQuiz`,
        {
          method: "POST",
          headers: {
            "Content-type": "Application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            question,
            optionA,
            optionB,
            optionC,
            optionD,
            correctAnswer,
            selectedCategory,
            subCategory,
            difficulty,
          }),
        },
      );

      const data = await response.json();

      if(!response.ok){
        throw new Error(data.message || "Failed to create quiz");
      } else {
        toast.success(`quiz created successfully. `);
        setShowAddQuizModal(false);
      }
    } catch (error) {
      toast.error(error.message);
    }
  };

  const categoryNames = categories.map((item) => item.category);

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
          value={selectedCategory}
          onChange={(e) => setSelectedCategory(e.target.value)}
          options={categoryNames}
          placeholder="All Categories"
        />
        <Button
          text="+Add Quiz"
          variant="toggleBtn"
          onClick={() => setShowAddQuizModal(true)}
        />
      </div>
      <div className={style.questionsDiv}>
        {questions.map((question) => (
          <QuestionRow key={question._id} question={question} />
        ))}
      </div>

      <AddQuestionModal
        isOpen={showAddQuizModal}
        onClose={() => {
          setShowAddQuizModal(false);
        }}
        onSave={createQuiz}
        category={categories}
      />
    </div>
  );
}
