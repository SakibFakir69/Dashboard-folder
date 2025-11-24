import React, { useState } from "react";
import { Paper, TextField } from "@mui/material";
import SearchButton from "../../../components/ui/SearchButton";
import Modal from "react-modal";
import {
  useAllCategoryQuery,
  useCreateCategoryMutation,
  useDeleteCategoryMutation,
  useEditCategoryMutation,
} from "../../../redux/features/api";
import Loading from "../../../components/ui/Loading";
import toast from "react-hot-toast";
import { MdDelete, MdEdit } from "react-icons/md";

Modal.setAppElement("#root");

function Category() {
  const [category, setCategory] = useState("");
  const [modalIsOpen, setIsOpen] = useState(false);
  const [editingCategory, setEditingCategory] = useState(null);
  const [editName, setEditName] = useState("");
  const [ id, setId ] = useState("");

  const { data: allCategory, isLoading } = useAllCategoryQuery();

  const [createCategory, { isLoading: categoryLoading }] =
    useCreateCategoryMutation();
  const [deleteCategory] = useDeleteCategoryMutation();
  const [editCategory, { isLoading: editLoading }] = useEditCategoryMutation();

  const hanldelAddtoCategory = async () => {
    if (!category) {
      toast.error("Please enter a category");
      return;
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

  const handleDeleteCategory = async (id) => {
    try {
      await deleteCategory(id).unwrap();
      toast.success("Category deleted successfully");
    } catch (error) {
      console.error(error);
      toast.error("Failed to delete category");
    }
  };

  const openEditModal = (item) => {
    setEditingCategory(item);
    setEditName(item.name);
    setIsOpen(true);
  };

  const closeModal = () => {
    setIsOpen(false);
    setEditingCategory(null);
    setEditName("");
  };

  console.log(editingCategory)

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

  if (isLoading) return <Loading />;

  return (
    <div className="p-4 md:p-6">
      {/* Add Category */}
      <section className="flex flex-col md:flex-row gap-4 md:gap-x-6 mb-6">
        <TextField
          value={category}
          onChange={(e) => setCategory(e.target.value)}
          placeholder="Add your category..."
          sx={{ width: "100%", "& .MuiInputBase-root": { height: "48px" } }}
        />
        <SearchButton
          onClick={hanldelAddtoCategory}
          title={categoryLoading ? "Adding..." : "Add"}
        />
      </section>

      <h3 className="font-bold md:text-2xl text-black mt-8 md:mt-12">
        All Categories
      </h3>

      <Paper elevation={2} className="p-4 mt-6 min-h-96">
        <section className="flex flex-wrap gap-4 ">
          {allCategory.map((item) => (
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
