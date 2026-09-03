import { FiX } from "react-icons/fi";
import Button from "../../components/Button/Button.jsx";
import styles from "./AddCategoryModal.module.css";
import { useState } from "react";
import { toast } from "sonner";

export default function AddCategoryModal({ isOpen, onSave, onClose }) {
  if (!isOpen) return null;

  const [subCategories, setSubCategories] = useState([""]);
  const [category, setCategory] = useState("");

  function handleAddSubCategory() {
    setSubCategories([...subCategories, ""]);
  }

  function handleAddSubCategoryChange(index, value) {
    const updated = [...subCategories];

    updated[index] = value;

    setSubCategories(updated);
  }

  function handleRemoveSubCategory() {
    if (subCategories.length === 1) return;
    setSubCategories(subCategories.slice(0, -1));
  }
  const handleSubmit = (e) => {
    e.preventDefault();

    if (
      category.trim() === "" ||
      subCategories.some((sub) => sub.trim() === "")
    ) {
      toast.error("Enter all fields!");
      return;
    }
    onSave({
      category,
      subCategories,
    });
  };

  return (
    <div className={styles.overlay}>
      <div className={styles.modal}>
        <h1>Add Category</h1>
        <Button text={<FiX />} variant="wrongBtn" onClick={onClose} />

        <form>
          <div className={styles.formGroup}>
            <div className={styles.formGroup}>
              <label>Category: </label>
              <input
                type="text"
                placeholder="Quiz category"
                onChange={(e) => setCategory(e.target.value)}
              />
            </div>

            <div className={styles.formGroup}>
              <label>Sub Category: </label>

              {subCategories.map((subcategory, index) => (
                <input
                  key={index}
                  type="text"
                  placeholder={`Sub-category ${index + 1}`}
                  value={subcategory}
                  onChange={(e) =>
                    handleAddSubCategoryChange(index, e.target.value)
                  }
                />
              ))}

              <Button
                text="+ Add another"
                variant="correctBtn"
                onClick={(e) => {
                  e.preventDefault();
                  handleAddSubCategory();
                }}
              />

              <Button
                text="- Remove Last"
                variant="wrongBtn"
                onClick={(e) => {
                  e.preventDefault();
                  handleRemoveSubCategory();
                }}
              />
            </div>

            <div className={styles.buttonGroup}>
              <Button text="Cancel" variant="wrongBtn" onClick={onClose} />
              <Button text="Save" variant="correctBtn" onClick={handleSubmit} />
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}
