// InventoryTable3.jsx — FULLY RESPONSIVE (Mobile Cards + Desktop Table)
import React, { useState } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  TextField,
  Button,
  Box,
  Typography,
  IconButton,
  useTheme,
  useMediaQuery,
} from "@mui/material";
import { MdDelete, MdEdit } from "react-icons/md";
import { useForm, Controller } from "react-hook-form";
import Modal from "react-modal";
import Select from "react-select";
import { useAllCategoryQuery, useOnUpdateInventoryMutation } from "../../redux/features/api";
import { responsiveModalStylesInventory, selectStylesInventory } from "../../style/modal";
import toast from "react-hot-toast";

const priorityOptions = [
  { value: "High", label: "High" },
  { value: "Medium", label: "Medium" },
  { value: "Low", label: "Low" },
];

function InventoryTable3({ inventoryData, onDelete }) {
  const [editItem, setEditItem] = useState(null);
  const [modalIsOpen, setModalIsOpen] = useState(false);

  const [updateInventory, { isLoading: updating }] = useOnUpdateInventoryMutation();
  const { data: allCategory } = useAllCategoryQuery();
  const { register, handleSubmit, control, reset, setValue } = useForm();

  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("md")); // < 900px

  const getCategoryName = (category) => {
    if (!category) return "—";
    if (typeof category === "string") return category;
    if (typeof category === "object") return category.name || "—";
    return "—";
  };

  const handleEditOpen = (item) => {
    setEditItem(item);
    setValue("name", item.name || "");
    setValue("number", item.number || "");
    setValue("priority", priorityOptions.find(p => p.value === item.priority) || null);

    // Pre-select category for react-select
    const categoryValue = item.category
      ? {
          value: item.category.id || item.category,
          label: item.category.name || item.category,
        }
      : null;
    setValue("category", categoryValue);

    setModalIsOpen(true);
  };

  const handleEditClose = () => {
    setModalIsOpen(false);
    setEditItem(null);
    reset();
  };

  const onSubmit = async (data) => {
    if (!editItem) return;

    const payload = {
      name: data.name,
      number: data.number,
      priority: data.priority?.value,
      category: data.category?.value,
    };

    try {
      await updateInventory({ id: editItem.id, ...payload }).unwrap();
      toast.success("Updated successfully!");
      handleEditClose();
    } catch (err) {
      toast.error("Update failed");
      console.log(err)
    }
  };

  if (!inventoryData || inventoryData.length === 0) {
    return <p className="text-center py-12 text-gray-500">No inventory shared with you yet</p>;
  }

  // MOBILE CARD VIEW
  if (isMobile) {
    return (
      <>
        <Box className="p-4 space-y-4">
          {inventoryData.map((item, index) => (
            <Paper key={item.id} elevation={3} className="p-5 rounded-xl">
              <Box className="flex justify-between items-start mb-3">
                <Box>
                  <Typography variant="subtitle1" className="font-bold text-blue-700">
                    #{index + 1} • {item.name}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    {getCategoryName(item.category)}
                  </Typography>
                </Box>
                <Box className="flex gap-2">
                  <IconButton size="small" onClick={() => handleEditOpen(item)}>
                    <MdEdit className="text-blue-600" size={22} />
                  </IconButton>
                  <IconButton size="small" onClick={() => onDelete(item.id)}>
                    <MdDelete className="text-red-600" size={22} />
                  </IconButton>
                </Box>
              </Box>

              <Box className="grid grid-cols-2 gap-4 text-sm mt-4">
                <div>
                  <Typography className="text-gray-500">Priority</Typography>
                  <Typography
                    className={`font-bold ${
                      item.priority === "High"
                        ? "text-red-600"
                        : item.priority === "Medium"
                        ? "text-yellow-600"
                        : "text-green-600"
                    }`}
                  >
                    {item.priority}
                  </Typography>
                </div>
                <div>
                  <Typography className="text-gray-500">Quantity</Typography>
                  <Typography className="font-bold">{item.number}</Typography>
                </div>
              </Box>
            </Paper>
          ))}
        </Box>

        {/* Modal */}
        <Modal
          isOpen={modalIsOpen}
          onRequestClose={handleEditClose}
          style={responsiveModalStylesInventory}
          ariaHideApp={false}
        >
          <h2 className="text-2xl font-bold mb-6 text-black">Edit Inventory</h2>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
            <TextField label="Name" {...register("name", { required: true })} fullWidth />
            <TextField label="Number" type="number" {...register("number", { required: true })} fullWidth />

            <div>
              <label className="block text-sm font-medium mb-1 text-black">Priority</label>
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
            </div>

            <div>
              <label className="block text-sm font-medium mb-1 text-black">Category</label>
              <Controller
                name="category"
                control={control}
                render={({ field }) => (
                  <Select
                    {...field}
                    options={allCategory?.map(cat => ({ value: cat.id, label: cat.name })) || []}
                    styles={selectStylesInventory}
                    placeholder="Select Category"
                  />
                )}
              />
            </div>

            <div className="flex justify-end gap-3 pt-6">
              <Button variant="outlined" color="error" onClick={handleEditClose}>
                Cancel
              </Button>
              <Button type="submit" variant="contained" disabled={updating}>
                {updating ? "Saving..." : "Save Changes"}
              </Button>
            </div>
          </form>
        </Modal>
      </>
    );
  }

  // DESKTOP TABLE VIEW
  return (
    <>
      <TableContainer component={Paper} className="shadow-lg mt-8">
        <Table stickyHeader>
          <TableHead>
            <TableRow>
              <TableCell className="!font-bold text-gray-700">ID</TableCell>
              <TableCell className="!font-bold text-gray-700">Name</TableCell>
              <TableCell className="!font-bold text-gray-700">Category</TableCell>
              <TableCell className="!font-bold text-gray-700">Priority</TableCell>
              <TableCell className="!font-bold text-gray-700">Number</TableCell>
              <TableCell className="!font-bold text-gray-700">Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {inventoryData.map((item, index) => (
              <TableRow key={item.id} hover>
                <TableCell>{index + 1}</TableCell>
                <TableCell className="font-medium">{item.name}</TableCell>
                <TableCell>{getCategoryName(item.category)}</TableCell>
                <TableCell>
                  <span
                    className={`font-bold ${
                      item.priority === "High"
                        ? "text-red-600"
                        : item.priority === "Medium"
                        ? "text-yellow-600"
                        : "text-green-600"
                    }`}
                  >
                    {item.priority}
                  </span>
                </TableCell>
                <TableCell className="font-semibold">{item.number}</TableCell>
                <TableCell>
                  <div className="flex gap-4">
                    <MdDelete
                      className="text-red-500 hover:text-red-700 cursor-pointer transition"
                      size={22}
                      onClick={() => onDelete(item.id)}
                    />
                    <MdEdit
                      className="text-blue-500 hover:text-blue-700 cursor-pointer transition"
                      size={22}
                      onClick={() => handleEditOpen(item)}
                    />
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      {/* Modal for Desktop */}
      <Modal
        isOpen={modalIsOpen}
        onRequestClose={handleEditClose}
        style={responsiveModalStylesInventory}
        ariaHideApp={false}
      >
        <h2 className="text-2xl font-bold mb-6 text-black">Edit Inventory</h2>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
          <TextField label="Name" {...register("name", { required: true })} fullWidth />
          <TextField label="Number" type="number" {...register("number", { required: true })} fullWidth />

          <div>
            <label className="block text-sm font-medium mb-1 text-black">Priority</label>
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
          </div>

          <div>
            <label className="block text-sm font-medium mb-1 text-black">Category</label>
            <Controller
              name="category"
              control={control}
              render={({ field }) => (
                <Select
                  {...field}
                  options={allCategory?.map(cat => ({ value: cat.id, label: cat.name })) || []}
                  styles={selectStylesInventory}
                  placeholder="Select Category"
                />
              )}
            />
          </div>

          <div className="flex justify-end gap-3 pt-6">
            <Button variant="outlined" color="error" onClick={handleEditClose}>
              Cancel
            </Button>
            <Button type="submit" variant="contained" disabled={updating}>
              {updating ? "Saving..." : "Save Changes"}
            </Button>
          </div>
        </form>
      </Modal>
    </>
  );
}

export default InventoryTable3;
