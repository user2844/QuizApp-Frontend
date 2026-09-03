import { useEffect, useState } from "react";
import style from "./QuizSelection.module.css";
import { toast } from "sonner";

export default function QuizSelection({ onStartQuiz }) {

  const [categories, setCategories] = useState([]);

  const [selectedCategory, setSelectedCategory] = useState("");
  const [selectedSubCategory, setSelectedSubCategory] = useState("");

  const [loading, setLoading] = useState(true);


  useEffect(() => {
    getCategories();
  }, []);


  async function getCategories() {

    const token = localStorage.getItem("token");

    try {

      const response = await fetch(
        "http://localhost:4000/api/records/getCategories",
        {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.message || "Failed to load categories"
        );
      }

      setCategories(data);
      

    } catch (error) {

      console.error(error);
      toast.error(error.message);

    } finally {

      setLoading(false);

    }
  }

  
  // Find the category that the user clicked
  const selectedCategoryData = categories.find(
    item => item.category === selectedCategory
  );


  // Get subcategories from that category
  const subCategories =
    selectedCategoryData?.subCategories || [];


  function handleCategoryClick(category) {

    setSelectedCategory(category);

    // Reset previously selected subcategory
    setSelectedSubCategory("");
  }


  function handleSubCategoryClick(subCategory) {

    setSelectedSubCategory(subCategory);
  }


  function handleStartQuiz() {

    if (!selectedCategory) {
      toast.error("Please select a category");
      return;
    }

    if (!selectedSubCategory) {
      toast.error("Please select a subcategory");
      return;
    }

    onStartQuiz({
      category: selectedCategory,
      subCategory: selectedSubCategory
    });
  }


  if (loading) {
    return <p>Loading categories...</p>;
  }


  return (
    <div className={style.container}>

      <h1>Choose a Category</h1>


      {/* CATEGORY BLOCKS */}

      <div className={style.categoryGrid}>

        {categories.map(item => (

          <button
            key={item._id}
            className={`${style.categoryCard} ${
              selectedCategory === item.category
                ? style.selected
                : ""
            }`}
            onClick={() =>
              handleCategoryClick(item.category)
            }
          >
            {item.category}
          </button>

        ))}

      </div>


      {/* SUBCATEGORY */}

      {selectedCategory && (

        <div className={style.subCategorySection}>

          <h2>
            Choose a Subcategory
          </h2>

          <div className={style.subCategoryGrid}>

            {subCategories.map(subCategory => (

              <button
                key={subCategory}
                className={`${style.subCategoryCard} ${
                  selectedSubCategory === subCategory
                    ? style.selected
                    : ""
                }`}
                onClick={() =>
                  handleSubCategoryClick(subCategory)
                }
              >
                {subCategory}
              </button>

            ))}

          </div>

        </div>

      )}


      {/* START QUIZ */}

      {selectedSubCategory && (

        <button
          className={style.startButton}
          onClick={handleStartQuiz}
        >
          Start Quiz
        </button>

      )}

    </div>
  );
}