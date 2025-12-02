// InventoryTable3.jsx — FULLY RESPONSIVE (Mobile Cards + Desktop Table)
import React, { useState, useEffect } from "react";
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
import {
  useAllCategoryQuery,
  useOnUpdateInventoryMutation,
} from "../../redux/features/api";
import {
  responsiveModalStylesInventory,
  selectStylesInventory,
} from "../../style/modal";
import toast from "react-hot-toast";

const priorityOptions = [
  { value: "High", label: "High" },
  { value: "Medium", label: "Medium" },
  { value: "Low", label: "Low" },
];

function InventoryTable3({ inventoryData, onDelete, showOwner = false }) {
  const [editItem, setEditItem] = useState(null);
  const [modalIsOpen, setModalIsOpen] = useState(false);
  const [categoryOptions, setCategoryOptions] = useState([]);

  const [updateInventory, { isLoading: updating }] =
    useOnUpdateInventoryMutation();
  const { data: allCategory, isLoading: categoriesLoading } =
    useAllCategoryQuery();
  const {
    register,
    handleSubmit,
    control,
    reset,
    formState: { errors },
  } = useForm();

  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("md")); // < 900px

  console.log(inventoryData);

  // Process category data when it loads
  useEffect(() => {
    if (allCategory && Array.isArray(allCategory)) {
      const options = allCategory.map((cat) => ({
        value: cat.id, // UUID
        label: cat.name || "Unnamed Category",
      }));
      setCategoryOptions(options);
    }
  }, [allCategory]);

  // Helper function to safely get category name
  const getCategoryName = (item) => {
    if (!item || !item.category) return "—";

    // If category is an object with name property
    if (typeof item.category === "object" && item.category !== null) {
      return item.category.name || "—";
    }

    // If category is a string (could be name or ID)
    if (typeof item.category === "string") {
      // Check if it looks like a UUID
      const uuidRegex =
        /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
      if (uuidRegex.test(item.category)) {
        // It's a UUID, try to find the name in categories
        const foundCat = allCategory?.find((cat) => cat.id === item.category);
        return foundCat?.name || "—";
      }
      // It's already a name
      return item.category;
    }

    return "—";
  };

  // Get category option for react-select
  const getCategoryOption = (item) => {
    if (!item || !item.category) return null;

    // If category is an object with id and name
    if (typeof item.category === "object" && item.category !== null) {
      return {
        value: item.category.id || item.category,
        label: item.category.name || "Unnamed Category",
      };
    }

    // If category is a string
    if (typeof item.category === "string") {
      const uuidRegex =
        /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

      if (uuidRegex.test(item.category)) {
        // It's a UUID
        const foundCat = allCategory?.find((cat) => cat.id === item.category);
        if (foundCat) {
          return {
            value: foundCat.id,
            label: foundCat.name || "Unnamed Category",
          };
        }
        // UUID not found in categories
        return {
          value: item.category,
          label: "Unknown Category",
        };
      } else {
        // It's a category name, find the ID
        const foundCat = allCategory?.find((cat) => cat.name === item.category);
        if (foundCat) {
          return {
            value: foundCat.id,
            label: foundCat.name,
          };
        }
        // Category name not found
        return {
          value: "", // Empty value to indicate error
          label: item.category,
        };
      }
    }

    return null;
  };

  const handleEditOpen = (item) => {
    if (!item) return;

    setEditItem(item);
    console.log(item, "edit item");

    // Reset form and set values
    reset({
      name: item?.name || "",
      number: item.number || item.total_inventory || "",
      priority:
        priorityOptions.find((p) => p.value === item.priority) ||
        priorityOptions[1], // Default to Medium
      category: getCategoryOption(item),
    });

    setModalIsOpen(true);
  };

  const handleEditClose = () => {
    setModalIsOpen(false);
    setEditItem(null);
    reset();
  };

  const onSubmit = async (data) => {
    if (!editItem) return;

    // Prepare payload with proper data types
    const payload = {
      name: data.name?.trim(),
      number: parseInt(data.number) || 0,
      priority: data.priority?.value,
    };

    // Only include category if it's selected and has a valid UUID value
    if (data.category?.value) {
      const uuidRegex =
        /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
      if (uuidRegex.test(data.category.value)) {
        payload.category = data.category.value; // Send UUID
      } else {
        toast.error("Invalid category selected");
        return;
      }
    } else {
      // If no category selected, send null to clear it
      payload.category = null;
    }

    try {
      await updateInventory({
        id: editItem.id,
        ...payload,
      }).unwrap();

      toast.success("Item updated successfully!");
      handleEditClose();
    } catch (err) {
      console.error("Update error:", err);

      // Better error messages
      if (err.data) {
        if (err.data.category) {
          toast.error(
            `Category error: ${
              Array.isArray(err.data.category)
                ? err.data.category[0]
                : err.data.category
            }`
          );
        } else if (err.data.detail) {
          toast.error(err.data.detail);
        } else {
          toast.error("Update failed. Please check the form data.");
        }
      } else {
        toast.error("Update failed. Please try again.");
      }
    }
  };

  // Loading state for categories
  if (categoriesLoading) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-500">Loading categories...</p>
      </div>
    );
  }

  if (!inventoryData || inventoryData.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-500">No inventory items found</p>
      </div>
    );
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
                  <Typography
                    variant="subtitle1"
                    className="font-bold text-blue-700"
                  >
                    #{index + 1} • {item.name}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    {getCategoryName(item)}
                  </Typography>
                  {showOwner && item.user && (
                    <Typography
                      variant="caption"
                      color="text.secondary"
                      className="block mt-1"
                    >
                      Owner: {item.user}
                    </Typography>
                  )}
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
                    {item.priority || "Medium"}
                  </Typography>
                </div>
                <div>
                  <Typography className="text-gray-500">Quantity</Typography>
                  <Typography className="font-bold">
                    {item.number || item.total_inventory || 0}
                  </Typography>
                </div>
              </Box>
            </Paper>
          ))}
        </Box>

        {/* Edit Modal */}
        <Modal
          isOpen={modalIsOpen}
          onRequestClose={handleEditClose}
          style={responsiveModalStylesInventory}
          ariaHideApp={false}
        >
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold text-gray-800">
              Edit Inventory Item
            </h2>
            <button
              onClick={handleEditClose}
              className="text-gray-500 hover:text-red-600 text-3xl font-light"
            >
              ×
            </button>
          </div>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
            <TextField
              label="Name"
              {...register("name", { required: true })}
              fullWidth
              required
              error={!!errors.name}
              helperText={errors.name ? "Name is required" : ""}
            />
            <p></p>

            <TextField
              label="Quantity"
              type="number"
              {...register("number", {
                required: true,
                min: 0,
                valueAsNumber: true,
              })}
              fullWidth
              required
              InputProps={{ inputProps: { min: 0 } }}
            />

            <div>
              <label className="block text-sm font-medium mb-1 text-gray-700">
                Priority <span className="text-red-500">*</span>
              </label>
              <Controller
                name="priority"
                control={control}
                rules={{ required: true }}
                render={({ field, fieldState }) => (
                  <>
                    <Select
                      {...field}
                      options={priorityOptions}
                      styles={selectStylesInventory}
                      placeholder="Select Priority"
                      isClearable
                    />
                    {fieldState.error && (
                      <p className="text-red-500 text-xs mt-1">
                        Priority is required
                      </p>
                    )}
                  </>
                )}
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-1 text-gray-700">
                Category
              </label>
              <Controller
                name="category"
                control={control}
                render={({ field }) => (
                  <Select
                    {...field}
                    options={categoryOptions}
                    styles={selectStylesInventory}
                    placeholder="Select Category"
                    isClearable
                    isLoading={categoriesLoading}
                  />
                )}
              />
              <p className="text-gray-500 text-xs mt-1">
                {categoryOptions.length === 0
                  ? "No categories available"
                  : "Leave empty to remove category"}
              </p>
            </div>

            {editItem && (
              <div className="bg-gray-50 p-3 rounded text-sm">
                <p className="text-gray-600">Item ID: {editItem.id}</p>
                {editItem.created_at && (
                  <p className="text-gray-600">
                    Created:{" "}
                    {new Date(editItem.created_at).toLocaleDateString()}
                  </p>
                )}
              </div>
            )}

            <div className="flex justify-end gap-3 pt-6 border-t">
              <Button
                variant="outlined"
                color="error"
                onClick={handleEditClose}
                disabled={updating}
              >
                Cancel
              </Button>
              <Button
                type="submit"
                variant="contained"
                color="primary"
                disabled={updating}
              >
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
              <TableCell className="!font-bold text-gray-700">
                Category
              </TableCell>
              {showOwner && (
                <TableCell className="!font-bold text-gray-700">
                  Owner
                </TableCell>
              )}
              <TableCell className="!font-bold text-gray-700">
                Priority
              </TableCell>
              <TableCell className="!font-bold text-gray-700">
                Quantity
              </TableCell>
              <TableCell className="!font-bold text-gray-700">
                Actions
              </TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {inventoryData.map((item, index) => (
              <TableRow key={item.id} hover>
                <TableCell>{index + 1}</TableCell>
                <TableCell className="font-medium">{item.name}</TableCell>
                <TableCell>{getCategoryName(item)}</TableCell>
                {showOwner && (
                  <TableCell className="!text-yellow-500 !font-semibold">
                    {item.user || "—"}
                  </TableCell>
                )}
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
                    {item.priority || "Medium"}
                  </span>
                </TableCell>
                <TableCell className="font-semibold">
                  {item.number || item.total_inventory || 0}
                </TableCell>
                <TableCell>
                  <div className="flex gap-4">
                    <MdDelete
                      className="text-red-500 hover:text-red-700 cursor-pointer transition"
                      size={22}
                      onClick={() => onDelete(item.id)}
                      title="Delete item"
                    />
                    <MdEdit
                      className="text-blue-500 hover:text-blue-700 cursor-pointer transition"
                      size={22}
                      onClick={() => handleEditOpen(item)}
                      title="Edit item"
                    />
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      {/* Edit Modal for Desktop */}
      <Modal
        isOpen={modalIsOpen}
        onRequestClose={handleEditClose}
        style={responsiveModalStylesInventory}
        ariaHideApp={false}
      >
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold text-gray-800">
            Edit Inventory Item
          </h2>
          <button
            onClick={handleEditClose}
            className="text-gray-500 hover:text-red-600 text-3xl font-light"
          >
            ×
          </button>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
          <TextField
            label="Name"
            {...register("name", { required: true })}
            fullWidth
            required
            error={!!register("name").required}
            helperText={errors.name ? "Name is required" : ""}
          />
          <p></p>
          <TextField
            label="Quantity"
            type="number"
            {...register("number", {
              required: true,
              min: 0,
              valueAsNumber: true,
            })}
            fullWidth
            required
            InputProps={{ inputProps: { min: 0 } }}
          />

          <div>
            <label className="block text-sm font-medium mb-1 text-gray-700">
              Priority <span className="text-red-500">*</span>
            </label>
            <Controller
              name="priority"
              control={control}
              rules={{ required: true }}
              render={({ field, fieldState }) => (
                <>
                  <Select
                    {...field}
                    options={priorityOptions}
                    styles={selectStylesInventory}
                    placeholder="Select Priority"
                    isClearable
                  />
                  {fieldState.error && (
                    <p className="text-red-500 text-xs mt-1">
                      Priority is required
                    </p>
                  )}
                </>
              )}
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1 text-gray-700">
              Category
            </label>
            <Controller
              name="category"
              control={control}
              render={({ field }) => (
                <Select
                  {...field}
                  options={categoryOptions}
                  styles={selectStylesInventory}
                  placeholder="Select Category"
                  isClearable
                  isLoading={categoriesLoading}
                />
              )}
            />
            <p className="text-gray-500 text-xs mt-1">
              {categoryOptions.length === 0
                ? "No categories available"
                : "Leave empty to remove category"}
            </p>
          </div>

          {editItem && (
            <div className="bg-gray-50 p-3 rounded text-sm">
              <p className="text-gray-600">Item ID: {editItem.id}</p>
              {editItem.created_at && (
                <p className="text-gray-600">
                  Created: {new Date(editItem.created_at).toLocaleDateString()}
                </p>
              )}
            </div>
          )}

          <div className="flex justify-end gap-3 pt-6 border-t">
            <Button
              variant="outlined"
              color="error"
              onClick={handleEditClose}
              disabled={updating}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              variant="contained"
              color="primary"
              disabled={updating}
            >
              {updating ? "Saving..." : "Save Changes"}
            </Button>
          </div>
        </form>
      </Modal>
    </>
  );
}

export default InventoryTable3;
