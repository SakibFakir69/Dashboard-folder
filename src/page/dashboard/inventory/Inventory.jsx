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
// import { selectStylesInventory } from "../../../style/modal";
// import { responsiveModalStylesInventory } from "../../../style/modal";
// import { selectStyles } from "../../../style/modal";

function Inventory() {
  const [modalIsOpen, setIsOpen] = useState(false);
  const [editingItem, setEditingItem] = useState(null);
  const [createInventory] = useCreateInventoryMutation();
  const { data: allCategory } = useAllCategoryQuery();
  const { data: allInventory, isLoading } = useAllInventoryQuery();
  const [onUpdateInventory] = useOnUpdateInventoryMutation();

  const [deleteInventory] = useDeleteInventoryMutation();

  const {  reset } = useForm({
    defaultValues: {
      name: "",
      number: "",
      priority: null,
      category: null,
    },
  });

  const openModal = () => setIsOpen(true);
  const closeModal = () => setIsOpen(false);
  const onEdit = (item) => {
    console.log(item);
    setEditingItem(item);
    setIsOpen(true); 
    reset({
      name: item.name,
      number: item.number,
      priority: { value: item.priority, label: item.priority },
      category: item.category,
    });
  };

  const onSubmit = async (data) => {
    const itemData = {
      name: data.name,
      number: data.number,
      priority: data.priority.value,
      category: data.category,
    };

    console.log("data", itemData)

    try {
      if (editingItem) {
        const res = await onUpdateInventory({
          id: editingItem.id,
          ...itemData,
        }).unwrap();
        toast.success("Inventory updated successfully");
        console.log(res);
      } else {
        const res = await createInventory(itemData).unwrap();
        toast.success("Item added successfully");
        console.log(res , 'inventory');
      }
    } catch (error) {
      console.log(error);
      toast.error("Failed to save inventory");
    }

    setEditingItem(null);
    reset();
    closeModal();
  };

  // on delete

  const onDelete = (id) => {
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
                toast.dismiss(t.id); // Close toast
                try {
                  const res = await deleteInventory(id).unwrap();
                  toast.success("Deleted successfully");
                  console.log(res);
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
      {
        duration: Infinity,
      }
    );
  };

  

  return (
    <div className="p-4 md:p-6 w-full   min-h-screen">
      <Toaster />

      <section className="flex flex-col md:flex-row gap-4 mb-8 items-center w-full">
        <TextField
          placeholder="Search your inventory ..."
          fullWidth
          sx={{
            flex: 1,
            "& .MuiInputBase-root": { height: "48px" },
          }}
        />

        <div className="w-full md:w-auto">
          <SearchButton onClick={() => {}} title="Submit" />
        </div>
      </section>

      <section className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
        <h3 className="font-bold text-xl md:text-2xl text-black">
          Inventory List
        </h3>
        <div className="w-full sm:w-auto">
          <AddButton onClick={openModal} title="Add to Inventory" />
        </div>
      </section>

      

      <section className="w-full mx-auto overflow-x-auto shadow-md rounded-lg border border-gray-200">
        {isLoading ? (
          <div>
            <p>Loading....</p>
          </div>
        ) : (
          <div>
            <InventoryTable2
              inventoryData={allInventory}
              onDelete={onDelete}
              onEdit={onEdit}
            />
          </div>
        )}
      </section>
    </div>
  );
}

export default Inventory;
