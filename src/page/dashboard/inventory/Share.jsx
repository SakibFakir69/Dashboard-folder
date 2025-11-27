import React, { useEffect, useState } from "react";
import { Paper, TextField } from "@mui/material";
import toast, { Toaster } from "react-hot-toast";
import SearchButton from "../../../components/ui/SearchButton";

import InventoryTable3 from "../../../components/ui/InventoryTable3";
import { responsiveModalStylesInventory } from "../../../style/modal";

import Modal from "react-modal";
import {
  useAllShareInventoryQuery,
  useDeleteInventoryMutation,
  useDeleteShareInventoryMutation,
  useShareWithOtherInventoryMutation,
} from "../../../redux/features/api";
import { MdDelete } from "react-icons/md";
useDeleteInventoryMutation;

function Share() {
  const [username, setUsername] = useState("");
  const [inventories, setInventories] = useState([]);

  const [shareWithOtherInventory] = useShareWithOtherInventoryMutation();
  const { data: allShareInventory = [] } = useAllShareInventoryQuery();
  const [deleteShareInventory] = useDeleteShareInventoryMutation();
  const [deleteInventory] = useDeleteInventoryMutation();
  const [modalIsOpen, setIsOpen] = useState(false);

  const token = localStorage.getItem("token");
  const currentUser = "google";

  const openModal = () => setIsOpen(true);
  const closeModal = () => setIsOpen(false);

  console.log(allShareInventory, " share user");
  const wsUrl = `ws://127.0.0.1:8020/ws/inventories/${currentUser}/`;

  useEffect(() => {
    if (!currentUser || !token) return;

    const ws = new WebSocket(
      `ws://127.0.0.1:8020/ws/inventories/${currentUser}/`
    );

    ws.onopen = () => {
      console.log("WebSocket connected");
      ws.send(JSON.stringify({ Authorization: `Bearer ${token}` }));
    };

    ws.onmessage = (event) => {
      try {
        const data = JSON.parse(event.data);
        console.log("WS Message:", data?.inventories);

        switch (data.event) {
          case "initial":
            setInventories(data.inventories);
            break;

          default:
            console.log("Unknown event:", data);
        }
      } catch (err) {
        console.error("WebSocket message error:", err);
      }
    };

    ws.onerror = (err) => console.error("WebSocket error:", err);
    ws.onclose = () => console.log("WebSocket disconnected");

    return () => ws.close();
  }, [currentUser, token]);

  console.log(inventories);

  const handleDelete = async (id) => {
    console.log(id);
    try {
      await deleteInventory(id).unwrap();
      toast.success("Deleted successfully");
      setInventories((prev) => prev.filter((inv) => inv.id !== id));
    } catch (err) {
      console.log(err);
      toast.error(err.data?.detail || "Failed to delete");
    }
  };



  const handleShare = async () => {
    if (!username) {
      toast.error("Please enter a username to share with");
      return;
    }

    try {
      const res = await shareWithOtherInventory({
        shared_user: username,
      }).unwrap();
      toast.success(`Inventory shared with ${username}`);
      console.log(res);
      setUsername("");
    } catch (err) {
      toast.error(err.data?.detail || "Failed to share inventory");
      console.error(err);
    }
  };

  return (
    <div className="p-4">
      <Toaster />

      {/* Share input */}
      <section className="flex gap-x-6 mb-6 mt-6">
        <TextField
          placeholder="Enter username to share inventory"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          sx={{ width: "100%", "& .MuiInputBase-root": { height: "48px" } }}
        />
        <SearchButton onClick={handleShare} title="Share" />
      </section>

      <button
        onClick={openModal}
        className="bg-blue-600 text-xl text-white p-2.5 md:w-44 rounded mb-4"
      >
        share user list
      </button>
      <Modal
        isOpen={modalIsOpen}
        onRequestClose={closeModal}
        style={responsiveModalStylesInventory}
        contentLabel="Add Inventory Modal"
        ariaHideApp={false}
      >
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-lg md:text-xl font-bold text-black">
            List
          </h2>
          <button
            onClick={closeModal}
            className="text-gray-500 hover:text-red-500 font-bold"
          >
            ✕
          </button>
        </div>

        <Paper  className="min-h-32 p-4 flex flex-col gap-4">
          {allShareInventory.map((user, key) => (
            <div
              key={key}
              className="flex items-center justify-between p-3 border rounded-md hover:shadow-md transition-shadow duration-200 "
            >
              <p className="text-gray-800 font-medium">{user.shared_user}</p>

              <MdDelete
                className="text-red-500 cursor-pointer hover:text-red-600"
                size={24}
                onClick={() => handleDelete(user.id)}
              />
            </div>
          ))}
        </Paper>
      </Modal>

      {/* list */}

      <section>
        <InventoryTable3
          onDelete={handleDelete}
         
          wsUrl={wsUrl}
          token={token}
          inventoryData={inventories}
        />
      </section>

     
    </div>
  );
}

export default Share;
