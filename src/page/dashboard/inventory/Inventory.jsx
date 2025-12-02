import React, { useState } from "react";
import { TextField, Button } from "@mui/material";
import Modal from "react-modal";

import { priorityOptions } from "../../../constant/priority";
import Select from "react-select";
import { useForm, Controller } from "react-hook-form";
import SearchButton from "../../../components/ui/SearchButton";
import AddButton from "../../../components/ui/AddButton";
import {
  useAllCategoryQuery,
  useAllInventoryQuery,
  useCreateInventoryMutation,
  useDeleteInventoryMutation,
  useOnUpdateInventoryMutation,
} from "../../../redux/features/api";
import toast, { Toaster } from "react-hot-toast";
import InventoryTable2 from "../../../components/ui/InventoryTable2";
import { selectStylesInventory, responsiveModalStylesInventory } from "../../../style/modal";

Modal.setAppElement("#root");

function Inventory() {
  const [modalIsOpen, setIsOpen] = useState(false);
  const [editingItem, setEditingItem] = useState(null);
  const [createInventory] = useCreateInventoryMutation();
  const { data: allCategory } = useAllCategoryQuery();
  const { data: allInventory, isLoading } = useAllInventoryQuery();
  const [onUpdateInventory] = useOnUpdateInventoryMutation();
  const [deleteInventory] = useDeleteInventoryMutation();

  const { register, handleSubmit, control, reset } = useForm({
    defaultValues: {
      name: "",
      number: "",
      priority: null,
      category: null,
    },
  });

  const openModal = () => setIsOpen(true);
  const closeModal = () => {
    setIsOpen(false);
    setEditingItem(null);
    reset();
  };

  const onEdit = (item) => {
    setEditingItem(item);
    setIsOpen(true); 
    reset({
      name: item.name,
      number: item.number,
      priority: { value: item.priority, label: item.priority },
      category: item.category?.value,
    });
  };

  const onSubmit = async (data) => {
    const itemData = {
      name: data.name,
      number: data.number,
      priority: data.priority.value,
      category: data.category?.value
    };

    try {
      if (editingItem) {
        await onUpdateInventory({ id: editingItem.id, ...itemData }).unwrap();
        toast.success("Inventory updated successfully");
      } else {
        await createInventory(itemData).unwrap();
        toast.success("Item added successfully");
      }
    } catch (error) {
      toast.error("Failed to save inventory");
      console.error(error);
    }

    closeModal();
  };

  const onDelete = (id) => {
    toast(
      (t) => (
        <div className="flex flex-col gap-2">
          <span>Are you sure you want to delete this item?</span>
          <div className="flex gap-2 justify-end">
            <button className="bg-gray-200 px-3 py-1 rounded" onClick={() => toast.dismiss(t.id)}>
              Cancel
            </button>
            <button
              className="bg-red-500 text-white px-3 py-1 rounded"
              onClick={async () => {
                toast.dismiss(t.id);
                try {
                  await deleteInventory(id).unwrap();
                  toast.success("Deleted successfully");
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

  return (
    <div className="p-4 md:p-6 w-full min-h-screen">
      <Toaster />

      {/* Search and Add */}
      <section className="flex flex-col md:flex-row gap-4 mb-8 items-center w-full">
        <TextField
          placeholder="Search your inventory ..."
          fullWidth
          sx={{ flex: 1, "& .MuiInputBase-root": { height: "48px" } }}
        />
        <div className="w-full md:w-auto">
         
            <button className="h-10 md:h-12 md:mt-0 bg-blue-600  rounded text-white  md:w-44 md:text-xl md:font-semibold w-44 ">Submit</button>
        </div>
      </section>

      <section className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
        <h3 className="font-bold text-xl md:text-2xl text-black">Inventory List</h3>
        <div className="w-full sm:w-auto">
          <AddButton onClick={openModal} title="Add to Inventory" />
        </div>
      </section>

      {/* Inventory Table */}
      <section className="w-full mx-auto overflow-x-auto shadow-md rounded-lg border border-gray-200">
        {isLoading ? (
          <p>Loading....</p>
        ) : (
          <InventoryTable2
            inventoryData={allInventory}
            onDelete={onDelete}
            onEdit={onEdit}
          />
        )}
      </section>

      {/* Modal */}
      <Modal
        isOpen={modalIsOpen}
        onRequestClose={closeModal}
        style={responsiveModalStylesInventory}
        contentLabel="Inventory Modal"
      >
        <h2 className="font-bold text-xl mb-4 text-black">{editingItem ? "Edit Inventory" : "Add Inventory"}</h2>
        <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4">
          <TextField
            label="Item Name"
            {...register("name", { required: true })}
          />
          <TextField
            label="Quantity"
            type="number"
            {...register("number", { required: true })}
          />
          <Controller
            name="priority"
            control={control}
            render={({ field }) => (
              <Select
                {...field}
                options={priorityOptions}
                styles={selectStylesInventory}
                placeholder="Select Priority"
              />
            )}
          />
          <Controller
            name="category"
            control={control}
            render={({ field }) => (
              <Select
                {...field}
                options={allCategory?.map((cat) => ({ value: cat.id, label: cat.name })) || []}
                styles={selectStylesInventory}
                placeholder="Select Category"
              />
            )}
          />
          <div className="flex md:justify-end justify-center gap-2 mt-2 text-red-400">
            <Button className="!border" variant="" onClick={closeModal}>
              Cancel
            </Button>

            <button className="h-12  md:mt-0 bg-blue-600  rounded text-white  md:w-36 md:text-xl md:font-semibold w-32" type="submit" >
              {editingItem ? "Update" : "Add"}
            </button>

          </div>
        </form>
      </Modal>
    </div>
  );
}

export default Inventory;
