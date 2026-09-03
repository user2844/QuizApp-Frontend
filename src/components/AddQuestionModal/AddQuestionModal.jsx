import styles from "./AddQuestionModal.module.css";
import Button from "../Button/Button";
import { useState } from "react";
import { FiX } from "react-icons/fi";
import Dropdown from "../Dropdown/Dropdown.jsx";
import { toast } from "sonner";

export default function AddQuestionModal({
  isOpen,
  onClose,
  onSave,
  category,
}) {
  const [question, setQuestion] = useState("");
  const [optionA, setOptionA] = useState("");
  const [optionB, setOptionB] = useState("");
  const [optionC, setOptionC] = useState("");
  const [optionD, setOptionD] = useState("");
  const [correctAnswer, setCorrectAnswer] = useState("");
  const [selectedCategory, setCategory] = useState("");
  const [subCategory, setSubCategory] = useState("");
  const [difficulty, setDifficulty] = useState("Easy");
  const selectAnswers = [optionA, optionB, optionC, optionD];
  const difficulties = ["Easy", "Medium", "Hard"];

  const categoryNames = category.map((item) => item.category);
  if (!isOpen) return null;

  const selectedCategoryData = category.find(
    (item) => item.category === selectedCategory,
  );

  const subCategoryNames = selectedCategoryData?.subCategories || [];

  const handleSubmit = (e) => {
    e.preventDefault();

    if(
      question.trim() === "" ||
       optionA.trim() === "" ||
        optionB.trim() === "" ||
         optionC.trim() === "" || 
         optionD.trim() === "" ||
         correctAnswer.trim() === ""||
          selectedCategory.trim() === ""||
           subCategory.trim() === ""||
            difficulty.trim() === ""
    ){
      toast.error("Enter all fields!");
      return;
    }

    onSave({
      question,
      optionA,
      optionB,
      optionC,
      optionD,
      correctAnswer,
      selectedCategory,
      subCategory,
      difficulty
    })
  }

  return (
    <div className={styles.overlay}>
      <div className={styles.modal}>
        <div className={styles.header}>
          <h2>Add new Question</h2>
          <Button text={<FiX />} variant="wrongBtn" onClick={onClose} />
        </div>
        <form className={styles.form} onSubmit={handleSubmit}>
          {/*Question*/}
          <div className={styles.formGroup}>
            <label>Question</label>
            <textarea
              type="text"
              placeholder="Enter question..."
              onChange={(e) => setQuestion(e.target.value)}
            />
          </div>
          {/*Options*/}
          <div className={styles.optionGrid}>
            <div className={styles.formGroup}>
              <label>Option A</label>
              <input
                type="text"
                placeholder="Option A"
                onChange={(e) => setOptionA(e.target.value)}
              />
            </div>

            <div className={styles.formGroup}>
              <label>Option B</label>
              <input
                type="text"
                placeholder="Option B"
                onChange={(e) => setOptionB(e.target.value)}
              />
            </div>

            <div className={styles.formGroup}>
              <label>Option C</label>
              <input
                type="text"
                placeholder="Option C"
                onChange={(e) => setOptionC(e.target.value)}
              />
            </div>

            <div className={styles.formGroup}>
              <label>Option D</label>
              <input
                type="text"
                placeholder="Option D"
                onChange={(e) => setOptionD(e.target.value)}
              />
            </div>
          </div>

          {/* Correct Answer*/}
          <div className={styles.formGroup}>
            <label>Correct Answer</label>
            <Dropdown
              value={correctAnswer}
              onChange={(e) => setCorrectAnswer(e.target.value)}
              options={selectAnswers}
              placeholder="Select the correct answer.."
            />
          </div>

          {/* Category && subCategory*/}

          <div className={styles.doubleInput}>
            {/*Category*/}
            <div className={styles.formGroup}>
              <label>Category</label>

              <Dropdown
                value={selectedCategory}
                onChange={(e) => setCategory(e.target.value)}
                options={categoryNames}
                placeholder="Select Category..."
              />
            </div>

            {/*Sub-category*/}
            <div className={styles.formGroup}>
              <label>Sub Category</label>

              <Dropdown
                value={subCategory}
                onChange={(e) => setSubCategory(e.target.value)}
                options={subCategoryNames}
                placeholder="Select subCategory..."
              />
            </div>
          </div>

          {/*Difficulty*/}
          <div className={styles.formGroup}>
            <label>Difficulty</label>

            <Dropdown
              value={difficulty}
              onChange={(e) => setDifficulty(e.target.value)}
              options={difficulties}
              placeholder="Choose difficulty"
            />
          </div>

          {/*Buttons*/}
          <div className={styles.formGroup}>
            <Button text="Cancel" variant="wrongBtn" onClick={onClose} />
            <Button
              type="submit"
              text="Save Question"
              variant="correctBtn"
              
            />
          </div>
        </form>
      </div>
    </div>
  );
}
