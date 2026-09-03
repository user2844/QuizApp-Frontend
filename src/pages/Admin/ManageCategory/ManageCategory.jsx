import styles from "./ManageCategory.module.css";
import Button from "../../../components/Button/Button.jsx";
import { useEffect, useState } from "react";
import AddCategoryModal from "../../../components/AddCategoryModal/AddCategoryModal.jsx";
import AddSubCategoryModal from "../../../components/AddSubCategory/AddSubCategoryModal.jsx";
import { toast } from "sonner";
import { useNavigate } from "react-router-dom";


export default function ManageCategory() {
  const [showAddCategoryModal, setShowAddCategoryModal] = useState(false);
  const [showAddSubCategoryModal, setShowAddSubCategoryModal] = useState(false);
  const [categories, setCategories] = useState([]);
  const navigate = useNavigate();

  {/*this fetchCategories is to get all the categories form the data base. */}
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
    fetchCategories();
  }, []);

  {
    /*this createCategory is to create a new category in the db*/
 }

  const createCategory = async ({ category, subCategories }) => {
    const token = localStorage.getItem("token");

    try {
      const response = await fetch(
        `http://localhost:4000/admin/category/addCategory`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            category,
            subCategories,
          }),
        },
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Failed to create category");
      } else {
        toast.success(`${data.category} category created successfully. `);
        setShowAddCategoryModal(false);
      }
    } catch (error) {
      toast.error(error.message);
    }
  };

   {/*this addSubCategory is to add subcategories to the existing category */}

   const addSubCategory = async ({category, subCategories}) => {
    const token = localStorage.getItem('token');
    try{
        const response = await fetch(`http://localhost:4000/admin/category/addSubCategories`,{
        method: "PATCH",
        headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${token}`,
        },

        body: JSON.stringify({
            category,
            subCategories
        })
    });

    const data = await response.json();

    if(!response.ok){
        throw new Error(data.message || 'Failed to add subcategory') 
    }else{
        toast.success(`subCategory added successfully!`)
        setShowAddSubCategoryModal(false);
    }
    }catch(error){
        toast.error(error.message)
        return
    }
  }

  return (
    <div className={styles.mainWrapper}>
      <Button
        text="Add Category"
        variant="correctBtn"
        onClick={() => {
          setShowAddCategoryModal(true);
        }}
      />
      <Button
        text="Add Sub-category"
        variant="correctBtn"
        onClick={() => {
          setShowAddSubCategoryModal(true);
        }}
      />

      <AddCategoryModal
        isOpen={showAddCategoryModal}
        onClose={() => {
          setShowAddCategoryModal(false);
        }}
        onSave={createCategory}
      />

      <AddSubCategoryModal
        isOpen={showAddSubCategoryModal}
        onClose={() => {
          setShowAddSubCategoryModal(false);
        }}
        onSave={addSubCategory}
        categories={categories}
      />
    </div>
  );
}
