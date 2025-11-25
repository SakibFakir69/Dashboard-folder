import React, { useState } from "react";
import { TextField, Button } from "@mui/material";
import Modal from "react-modal";
import { customStyles } from "../../../style/modal";
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
} from "../../../redux/features/api";
import toast, { Toaster } from "react-hot-toast";
import InventoryTable2 from "../../../components/ui/InventoryTable2";

function Inventory() {
  const [modalIsOpen, setIsOpen] = useState(false);
  const [createInventory] = useCreateInventoryMutation();
  const { data: allCategory } = useAllCategoryQuery();
  const { data: allInventory, isLoading } = useAllInventoryQuery();

  const [deleteInventory] = useDeleteInventoryMutation();

  console.log(allCategory, " category");
  console.log(allInventory, " inv");

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

  const onSubmit = async (data) => {
    const newItem = {
      name: data.name,
      number: data.number,
      priority: data.priority.value,
      category: data.category,
    };
    console.log(data);

    try {
      const res = await createInventory(newItem).unwrap();
      console.log(res, " inventory");
      toast.success("Add to inventory successful");
    } catch (error) {
      console.log(error);
      toast.error("Failed to add item");
    }

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
      duration: Infinity, // keep until user clicks
    }
  );
};

  const selectStyles = {
    control: (provided, state) => ({
      ...provided,
      backgroundColor: "#f3f4f6",
      borderColor: state.isFocused ? "#3b82f6" : "#d1d5db",
      borderRadius: 4,
      minHeight: "56px",
      boxShadow: state.isFocused ? "0 0 0 2px #3b82f6" : "none",
      "&:hover": { borderColor: "#3b82f6" },
    }),
    menu: (provided) => ({
      ...provided,
      backgroundColor: "#f3f4f6",
      zIndex: 9999,
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

  const responsiveModalStyles = {
    ...customStyles,
    content: {
      ...customStyles.content,
      width: "95%",
      maxWidth: "500px",
      top: "50%",
      left: "50%",
      right: "auto",
      bottom: "auto",
      marginRight: "-50%",
      transform: "translate(-50%, -50%)",
      maxHeight: "90vh",
      overflowY: "auto",
    },
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

      <Modal
        isOpen={modalIsOpen}
        onRequestClose={closeModal}
        style={responsiveModalStyles}
        contentLabel="Add Inventory Modal"
        ariaHideApp={false}
      >
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-lg md:text-xl font-bold text-black">
            Add item to inventory
          </h2>
          <button
            onClick={closeModal}
            className="text-gray-500 hover:text-red-500 font-bold"
          >
            ✕
          </button>
        </div>

        <form className="flex flex-col gap-5" onSubmit={handleSubmit(onSubmit)}>
          <TextField
            label="Inventory Name"
            {...register("name", { required: true })}
            fullWidth
            variant="outlined"
          />

          <TextField
            label="Number"
            type="number"
            {...register("number", { required: true })}
            fullWidth
            variant="outlined"
          />

          <div className="flex flex-col gap-1">
            <label className="text-sm text-gray-600 font-medium">
              Priority
            </label>
            <Controller
              name="priority"
              control={control}
              rules={{ required: true }}
              render={({ field }) => (
                <Select
                  {...field}
                  options={priorityOptions}
                  placeholder="Select Priority"
                  styles={selectStyles}
                />
              )}
            />
          </div>

          <div className="flex flex-col gap-1">
            <label className="text-sm text-gray-600 font-medium">
              Category
            </label>
            <Controller
              name="category"
              control={control}
              rules={{ required: true }}
              render={({ field }) => (
                <Select
                  {...field}
                  value={
                    allCategory
                      ?.map((cat) => ({ value: cat.id, label: cat.name }))
                      .find((opt) => opt.value === field.value) || null
                  }
                  onChange={(selected) =>
                    field.onChange(selected?.value || null)
                  }
                  options={allCategory?.map((cat) => ({
                    value: cat.id,
                    label: cat.name,
                  }))}
                  placeholder="Select Category"
                  styles={selectStyles}
                />
              )}
            />
          </div>

          <div className="flex flex-col-reverse sm:flex-row justify-end gap-3 mt-4">
            <Button
              variant="contained"
              color="warning"
              onClick={closeModal}
              fullWidth={true}
              sx={{ maxWidth: { sm: "120px" } }}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              variant="contained"
              color="primary"
              fullWidth={true}
              sx={{ maxWidth: { sm: "120px" } }}
            >
              Add Item
            </Button>
          </div>
        </form>
      </Modal>

      <section className="w-full mx-auto overflow-x-auto shadow-md rounded-lg border border-gray-200">
        {isLoading ? (
          <div>
            <p>Loading....</p>
          </div>
        ) : (
          <div>
            <InventoryTable2
              inventoryData={allInventory}
              onEdit={(item) => console.log("Edit", item)}
              onDelete={onDelete}
            />
          </div>
        )}
      </section>
    </div>
  );
}

export default Inventory;
