import React, { useState } from "react";
import { LinearProgress, Paper, TextField } from "@mui/material";
import SearchButton from "../../../components/ui/SearchButton";
import Modal from "react-modal";
import {
  useAllCategoryQuery,
  useCreateCategoryMutation,
  useDeleteCategoryMutation,
  useEditCategoryMutation,
} from "../../../redux/features/api";
import Loading from "../../../components/ui/Loading";
import toast, { Toaster } from "react-hot-toast";
import { MdDelete, MdEdit } from "react-icons/md";

Modal.setAppElement("#root");

function Category() {
  const [category, setCategory] = useState(null);
  const [modalIsOpen, setIsOpen] = useState(false);
  const [editingCategory, setEditingCategory] = useState(null);
  const [editName, setEditName] = useState("");
  const { data: allCategory, isLoading } = useAllCategoryQuery();
  const [createCategory, { isLoading: categoryLoading }] =
    useCreateCategoryMutation();
  const [deleteCategory] = useDeleteCategoryMutation();
  const [editCategory, { isLoading: editLoading }] = useEditCategoryMutation();


  // add category
  console.log(allCategory, ' categorty')

  const handelAddtoCategory = async () => {

    console.log(category , 's');

    
    if (!category || category.trim() === "") {
      toast.error("Please enter a category");
      return;
    }else{
      console.log(category , 'a')
    }

    try {
      await createCategory({ name: category }).unwrap();
      toast.success("Category added successfully");
      setCategory("");
    } catch (error) {
      console.error(error);
      toast.error("Failed to add category");
    }
  };


  // delete category

  const handleDeleteCategory = async (id) => {

     toast(
      (t) => (
        <div className="flex flex-col gap-2">
          <span>Are you sure you want to delete this item?</span>
          <div className="flex gap-2 justify-end">
            <button
              className="bg-gray-200 px-3 py-1 rounded"
              onClick={() => toast.dismiss(t.id)}
            >
              Cancel
            </button>
            <button
              className="bg-red-500 text-white px-3 py-1 rounded"
              onClick={async () => {
                toast.dismiss(t.id);
                try {
                       await deleteCategory(id).unwrap();
      toast.success("Category deleted successfully");
                } catch (error) {
                  toast.error(error.message);
                }
              }}
            >
              Delete
            </button>
          </div>
        </div>
      ),
      { duration: Infinity }
    );
   
  };


  // open modal

  const openEditModal = (item) => {
    setEditingCategory(item);
    setEditName(item.name);
    setIsOpen(true);
  };


  // close modal

  const closeModal = () => {
    setIsOpen(false);
    setEditingCategory(null);
    setEditName("");
  };

  console.log(editingCategory)

  // edit category

  const handleEditCategory = async (e) => {
    e.preventDefault();
    if (!editName || !editingCategory) return;

    try {
      await editCategory({ id: editingCategory.id, name: editName }).unwrap();
      toast.success("Category updated successfully");
      closeModal();
    } catch (error) {
      console.error(error);
      toast.error("Failed to update category");
    }
  };
// loading
  if (isLoading) return(
    <div className="mt-64 flex justify-center ">
       <Loading />
    </div>
  )
  ;

  return (
    <div className="p-4 md:p-6">

      <Toaster/>
      
      <section className="flex flex-col md:flex-row gap-4 md:gap-x-6 mb-6">
        <TextField
          value={category}
          onChange={(e) => setCategory(e.target.value)}
          placeholder="Add your category..."
          sx={{ width: "100%", "& .MuiInputBase-root": { height: "48px" } }}
        />
        
        <button onClick={handelAddtoCategory} className="h-12  md:mt-0 bg-blue-600  rounded text-white w-32 md:w-36 md:text-xl md:font-semibold w-1/2  "> {categoryLoading ? "Adding..." : "Add"}  </button>
      </section>

      <h3 className="font-bold md:text-2xl text-black mt-8 md:mt-12">
        All Categories
      </h3>


      {/* show category */}

      <Paper elevation={2} className="p-4 mt-6 min-h-96">

        
      
        <section className="flex flex-wrap gap-4 ">
          {allCategory?.map((item) => (
            <div
              key={item.id}
              className="flex items-center border bg-white shadow-sm border-gray-300 rounded-md px-2 py-1 cursor-pointer"
            >
              <p className="text-black text-center px-4 p-1">{item.name}</p>

              <button
                onClick={() => handleDeleteCategory(item.id)}
                className="text-red-500"
              >
                <MdDelete size={20} />
              </button>

              <button
                onClick={() => openEditModal(item)}
                className="ml-2 font-bold text-blue-600"
              >
                <MdEdit size={20} />
              </button>
            </div>
          ))}
        </section>
      </Paper>



      {/* edit category */}
      <Modal
        isOpen={modalIsOpen}
        onRequestClose={closeModal}
        contentLabel="Edit Category"
        className="max-w-md mx-auto mt-20 p-6 bg-white rounded shadow-lg outline-none"
        overlayClassName="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-start z-50"
      >
        <h2 className="text-xl font-bold mb-4 text-black">Edit Category</h2>
        <form onSubmit={handleEditCategory} className="flex flex-col gap-4">
          <TextField
            value={editName}
            onChange={(e) => setEditName(e.target.value)}
            label="Category Name"
          />
          <div className="flex justify-end gap-2">
            <button
              type="button"
              onClick={closeModal}
              className="px-4 py-2 bg-red-400 rounded "
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-blue-600 text-white rounded"
              disabled={editLoading}
            >
              {editLoading ? "Updating..." : "Update"}
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
}

export default Category;
