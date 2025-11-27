import React, { useEffect, useState } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  CircularProgress,
  TextField,
  Button,
} from "@mui/material";
import { MdDelete, MdEdit } from "react-icons/md";
import { useForm, Controller } from "react-hook-form";
import Modal from "react-modal";
import Select from "react-select";
import { useOnUpdateInventoryMutation } from "../../redux/features/api";
import { responsiveModalStylesInventory, selectStylesInventory } from "../../style/modal";
import toast from "react-hot-toast";

const priorityOptions = [
  { value: "High", label: "High" },
  { value: "Medium", label: "Medium" },
  { value: "Low", label: "Low" },
];

function InventoryTable3({ wsUrl, token, onDelete, allCategory }) {
  const [inventories, setInventories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editItem, setEditItem] = useState(null);
  const [modalIsOpen, setModalIsOpen] = useState(false);

  const [updateInventory, { isLoading: updating }] = useOnUpdateInventoryMutation();

  const { register, handleSubmit, control, reset } = useForm({
    defaultValues: {
      name: "",
      number: "",
      priority: null,
      category: null,
    },
  });

  // WebSocket for real-time updates
  useEffect(() => {
    if (!wsUrl || !token) return;

    const ws = new WebSocket(wsUrl);

    ws.onopen = () => {
      console.log("WebSocket connected");
      ws.send(JSON.stringify({ Authorization: `Bearer ${token}` }));
    };

    ws.onmessage = (event) => {
      try {
        const data = JSON.parse(event.data);
        switch (data.event) {
          case "initial":
            setInventories(data.inventories);
            setLoading(false);
            break;
          case "create":
            setInventories((prev) => [...prev, data.inventory]);
            break;
          case "update":
            setInventories((prev) =>
              prev.map((inv) => (inv.id === data.inventory.id ? data.inventory : inv))
            );
            break;
          case "delete":
            setInventories((prev) => prev.filter((inv) => inv.id !== data.inventory.id));
            break;
          default:
            console.log("Unknown event:", data);
        }
      } catch (err) {
        console.error("WS message parse error:", err);
      }
    };

    ws.onerror = (err) => console.error("WebSocket error:", err);
    ws.onclose = () => console.log("WebSocket disconnected");

    return () => ws.close();
  }, [wsUrl, token]);

  // Open edit modal
  const handleEditOpen = (item) => {
    setEditItem(item);
    reset({
      name: item.name,
      number: item.number,
      priority: priorityOptions.find((p) => p.value === item.priority),
      category:
        allCategory?.map((cat) => ({ value: cat.id, label: cat.name })).find(
          (opt) => opt.value === item.category
        ) || null,
    });
    setModalIsOpen(true);
  };

  const handleEditClose = () => {
    setModalIsOpen(false);
    setEditItem(null);
    reset();
  };

  // Submit updated inventory
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

  
      setInventories((prev) =>
        prev.map((inv) => (inv.id === editItem.id ? { ...inv, ...payload } : inv))
      );
      toast.success("update successfully")

      handleEditClose();
    } catch (error) {
      console.error("Update failed:", error);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center p-6">
        <CircularProgress />
      </div>
    );
  }

  return (
    <>
      <TableContainer component={Paper} className="max-h-96 overflow-y-auto">
        <Table stickyHeader>
          <TableHead>
            <TableRow>
              <TableCell className="!font-semibold text-gray-600">ID</TableCell>
              <TableCell className="!font-semibold text-gray-600">Name</TableCell>
              <TableCell className="!font-semibold text-gray-600">Category</TableCell>
              <TableCell className="!font-semibold text-gray-600">Priority</TableCell>
              <TableCell className="!font-semibold text-gray-600">Number</TableCell>
              <TableCell className="!font-semibold text-gray-600">Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {inventories.map((item, index) => (
              <TableRow key={item.id}>
                <TableCell className="!text-blue-600">{index + 1}</TableCell>
                <TableCell>{item.name}</TableCell>
                <TableCell>{item.category?.name || item.category}</TableCell>
                <TableCell
                  className={`!font-bold ${
                    item.priority === "High"
                      ? "!text-red-500"
                      : item.priority === "Medium"
                      ? "!text-yellow-500"
                      : "!text-green-500"
                  }`}
                >
                  {item.priority}
                </TableCell>
                <TableCell className="!font-bold">{item.number}</TableCell>
                <TableCell className="!flex gap-x-4">
                  <MdDelete
                    className="text-red-500 cursor-pointer hover:text-red-600"
                    size={20}
                    onClick={() => onDelete(item.id)}
                  />
                  <MdEdit
                    size={20}
                    className="text-blue-500 cursor-pointer hover:text-blue-600"
                    onClick={() => handleEditOpen(item)}
                  />
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

  
      <Modal
        isOpen={modalIsOpen}
        onRequestClose={handleEditClose}
        style={responsiveModalStylesInventory}
        ariaHideApp={false}
        contentLabel="Edit Inventory"
      >
        <h2 className="text-lg md:text-xl font-bold mb-6">Edit Inventory</h2>

        <form className="flex flex-col gap-5" onSubmit={handleSubmit(onSubmit)}>
          <TextField
            label="Inventory Name"
            {...register("name", { required: true })}
            fullWidth
          />

          <TextField
            label="Number"
            type="number"
            {...register("number", { required: true })}
            fullWidth
          />

          <div className="flex flex-col gap-1">
            <label className="text-sm text-gray-600 font-medium">Priority</label>
            <Controller
              name="priority"
              control={control}
              render={({ field }) => (
                <Select
                  {...field}
                  options={priorityOptions}
                  placeholder="Select Priority"
                  styles={selectStylesInventory}
                />
              )}
            />
          </div>

          <div className="flex flex-col gap-1">
            <label className="text-sm text-gray-600 font-medium">Category</label>
            <Controller
              name="category"
              control={control}
              render={({ field }) => (
                <Select
                  {...field}
                  value={
                    allCategory
                      ?.map((cat) => ({ value: cat.id, label: cat.name }))
                      .find((opt) => opt.value === field.value) || null
                  }
                  onChange={(selected) => field.onChange(selected)}
                  options={allCategory?.map((cat) => ({
                    value: cat.id,
                    label: cat.name,
                  }))}
                  placeholder="Select Category"
                  styles={selectStylesInventory}
                />
              )}
            />
          </div>

          <div className="flex justify-end gap-3 mt-4">
            <Button variant="outlined" color="warning" onClick={handleEditClose}>
              Cancel
            </Button>
            <Button type="submit" variant="contained" color="primary" disabled={updating}>
              {updating ? "Saving..." : "Save"}
            </Button>
          </div>
        </form>
      </Modal>
    </>
  );
}

export default InventoryTable3;
