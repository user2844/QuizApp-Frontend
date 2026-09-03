import { FiEdit2, FiTrash2 } from "react-icons/fi";
import styles from "./QuestionRow.module.css";

export default function QuestionRow({ question }) {
  return (
    <div className={styles.row}>
      <div className={styles.question}>{question.question}</div>

      <div className={styles.category}>
        <span>Category:</span> {question.category}
      </div>

      <div className={styles.difficulty}>
        <span>Difficulty:</span> {question.difficulty}
      </div>

      <div className={styles.actions}>
        <FiEdit2 />
        <FiTrash2 />
      </div>
    </div>
  );
}
