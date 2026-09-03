import styles from "./AddSubCategoryModal.module.css";
import { useState } from "react";
import { toast } from "sonner";
import Button from "../Button/Button.jsx";
import { FiX } from "react-icons/fi";
import Dropdown from "../Dropdown/Dropdown.jsx";

export default function AddSubCategory({ isOpen, onSave, onClose, categories}) {

  const [subCategories, setSubCategories] = useState([""]);
  const [category, setCategory] = useState("");

  if (!isOpen) return;

  
 
  const categoryNames = categories.map(
    (item) => item.category
  );

  console.log(categories)

  function handleAddSubCategory(){
    setSubCategories([...subCategories, ""]);
  }

  function handleAddSubCategoryChange(index, value){
    const updated = [...subCategories];

    updated[index] = value;

    setSubCategories(updated);
    
  }

  function handleRemoveSubCategory(){
    if(subCategories.length === 1) return;
    setSubCategories(
      subCategories.slice(0, -1)
    )
    
  }

const handleSubmit = (e) => {

  e.preventDefault();

  if(category.trim() === ""){
    toast.error("Please select a category");
    return;
  }

  if(subCategories.some( sub => sub.trim() === "" )){
    toast.error("Please enter a subcategory")
    return;
  }

  const selectedCategory = categories.find(
    item => item.category === category
  );

  for(const sub of subCategories){
    if(selectedCategory.subCategories.includes(sub.trim())){
      toast.error(`${sub} already exists in this category`);
      return;
    }
  }

  
  onSave({
    category,
    subCategories
  });
 }

 

  return (
    <div className={styles.overlay}>
      <div className={styles.modal}>
        <h1>Add Sub-Category</h1>
        <Button text={<FiX/>} variant="wrongBtn" onClick={onClose} />

        <form>
          <div className={styles.formGroup}>
            {/* this div is for the category selection*/}
            <div className={styles.formGroup}>
              <Dropdown 
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                options={categoryNames}
                placeholder="Select Category"
              />
            </div>

            {/* this div is for the  subcategory insertion*/}
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

            {/* this div is for the  saving and closing buttons */}
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
