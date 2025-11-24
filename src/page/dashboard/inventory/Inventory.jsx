import React, { useState } from "react";
import { TextField, Button } from "@mui/material";
import InventoryCard from "../../../components/ui/InventoryCard";
import Modal from "react-modal";
import { customStyles } from "../../../style/modal";
import { priorityOptions } from "../../../constant/priority";
import Select from "react-select";
import { useForm, Controller } from "react-hook-form";
import SearchButton from "../../../components/ui/SearchButton";
import AddButton from "../../../components/ui/AddButton";
import { useCreateInventoryMutation } from "../../../redux/features/api";
import toast, { Toaster } from "react-hot-toast";

function Inventory() {
  const [modalIsOpen, setIsOpen] = useState(false);

  const [ createInventory] = useCreateInventoryMutation();
 

  const categoryOptions = [
    { value: "IT", label: "IT" },
    { value: "Electronics", label: "Electronics" },
    { value: "Furniture", label: "Furniture" },
    { value: "Stationery", label: "Stationery" },
    { value: "Miscellaneous", label: "Miscellaneous" },
  ];

  const { register, handleSubmit, control, reset } = useForm({
    defaultValues: {
      name: "",
      number: "",
      priority: null,
      category: null,
    },
  });

  const openModal = () => setIsOpen(true);
  const closeModal = () => setIsOpen(false);

  const onSubmit =async (data) => {
    const newItem = {
      name: data.name,
      number: data.number,
      priority: data.priority.value,
      category: data.category.value,
    };
   

    try {

      const res = await createInventory(newItem).unwrap();
      console.log(res, ' inventory');

      toast("Add to inventory successfull" )
      
    } catch (error) {
      console.log(error);
      
    }
    

    reset(); 
    closeModal();
  };

  const selectStyles = {
    control: (provided, state) => ({
      ...provided,
      backgroundColor: "#f3f4f6", 
      borderColor: state.isFocused ? "#3b82f6" : "#d1d5db",
      borderRadius: 4,
      minHeight: "48px",
      boxShadow: state.isFocused ? "0 0 0 2px #3b82f6" : "none",
      "&:hover": { borderColor: "#3b82f6" },
    }),
    menu: (provided) => ({
      ...provided,
      backgroundColor: "#f3f4f6",
    }),
    option: (provided, state) => ({
      ...provided,
      backgroundColor: state.isFocused ? "#3b82f6" : "#f3f4f6",
      color: state.isFocused ? "#fff" : "#111827",
    }),
    singleValue: (provided) => ({
      ...provided,
      color: "#111827",
    }),
  };

  return (
    <div className="p-4">

      <Toaster/>
      {/* Search */}
      <section className="flex gap-x-6 mb-6">
        <TextField
          placeholder="Search your inventory ..."
          sx={{ width: "100%", "& .MuiInputBase-root": { height: "48px" } }}
        />
        <SearchButton onClick={() => {}} title="Submit" />
      </section>

     
      <section className="flex justify-between items-center mb-6">
        <h3 className="font-bold md:text-2xl text-black">Inventory List</h3>
        <AddButton onClick={openModal} title="Add to Inventory" />
      </section>

      {/* Modal */}
      <Modal
        isOpen={modalIsOpen}
        onRequestClose={closeModal}
        style={customStyles}
        contentLabel="Add Inventory Modal"
      >
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold text-black">
            Add item to your inventory
          </h2>
        </div>

        <form
          className="flex flex-col gap-4"
          onSubmit={handleSubmit(onSubmit)}
        >
          <TextField
            label="Item Name"
            {...register("name", { required: true })}
            fullWidth
          />

          <TextField
            label="Number"
            type="number"
            {...register("number", { required: true })}
            fullWidth
          />

          {/* Priority */}
          <Controller
            name="priority"
            control={control}
            rules={{ required: true }}
            render={({ field }) => (
              <Select
                {...field}
                options={priorityOptions}
                placeholder="Select Priority"
                onChange={(val) => field.onChange(val)}
                value={field.value}
                styles={selectStyles}
              />
            )}
          />

          {/* Category */}
          <Controller
            name="category"
            control={control}
            rules={{ required: true }}
            render={({ field }) => (
              <Select
                {...field}
                options={categoryOptions}
                placeholder="Select Category"
                onChange={(val) => field.onChange(val)}
                value={field.value}
                styles={selectStyles}
              />
            )}
          />

          <div className="flex justify-center gap-x-10 mt-2">
            <Button type="submit" variant="contained" color="primary">
              Add Item
            </Button>

            <Button variant="contained" color="warning" onClick={closeModal}>
              Cancel
            </Button>
          </div>
        </form>
      </Modal>

      {/* Inventory items */}
      <section className="flex flex-col gap-y-3 overflow-y-auto max-h-[400px] mt-6">
        { Array.from({ length: 4 }).map((_, idx) => (
              <InventoryCard
                key={idx}
                name="Head phone"
                category="IT"
                proirity="High"
                number="10"
              />
            ))}
      </section>
    </div>
  );
}

export default Inventory;
