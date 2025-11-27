import React, { useEffect, useState } from "react";
import { Paper, TextField } from "@mui/material";
import toast, { Toaster } from "react-hot-toast";
import SearchButton from "../../../components/ui/SearchButton";
import InventoryTable3 from "../../../components/ui/InventoryTable3";
import Modal from "react-modal";
import { responsiveModalStylesInventory } from "../../../style/modal";
import { MdDelete } from "react-icons/md";
import {
  useAllShareInventoryQuery,
  useDeleteInventoryMutation,
  useShareWithOtherInventoryMutation,
} from "../../../redux/features/api";

function Share() {
  const [username, setUsername] = useState("");
  const [inventories, setInventories] = useState([]);
  const [modalIsOpen, setIsOpen] = useState(false);
  const {
    data:allShareInventory} = useAllShareInventoryQuery();

  const [ track , setTrack ] = useState("");

  const token = localStorage.getItem("token") || "";
  const currentUser = localStorage.getItem("username");
  console.log(currentUser , " current user")

  const [deleteInventory] = useDeleteInventoryMutation();
  const [shareWithOtherInventory] = useShareWithOtherInventoryMutation();

  const openModal = () => setIsOpen(true);
  const closeModal = () => setIsOpen(false);

  
  const wsUrl = `ws://127.0.0.1:8020/ws/inventories/${currentUser}/?token=${token}`;

  
  useEffect(() => {
    if (!token || !currentUser) {
      toast.error("No token or user");
      return;
    }

    const ws = new WebSocket(wsUrl);

    ws.onopen = () => {
      console.log("WebSocket Connected →", currentUser);
      toast.success("Live updates ON", { duration: 2000 });
    };

    ws.onmessage = (event) => {
      try {
        const data = JSON.parse(event.data);
        console.log("Live Event:", data);
        setTrack(data?.event);

        switch (data.event) {
        
          case "initial":
            
            setInventories(data.inventories || []);
            break;

          case "create":
          case "share":
            setInventories((prev) => {
              const exists = prev.some((i) => i.id === data.inventory.id);
              if (exists) return prev;
              toast.success(`New item shared with you!`);
              return [...prev, data.inventory];
            });
            break;

          case "update":
            setInventories((prev) =>
              prev.map((i) => (i.id === data.inventory.id ? data.inventory : i))
            );
            break;

          case "delete":
            setInventories((prev) =>
              prev.filter((i) => i.id !== data.inventory_id)
            );
            toast.success("One shared item was removed");
            break;

          case "error":
            toast.error(data.message || "Access denied");
            ws.close();
            break;

          default:
            console.log("Unknown event:", data);
        }
      } catch (err) {
        console.error("Failed to parse message:", err);
      }
    };

    ws.onerror = (error) => {
      console.error("WebSocket error:", error);
      toast.error("Connection failed");
    };

    ws.onclose = () => {
      console.log("WebSocket closed");
      toast("Live updates OFF", { icon: "Warning", duration: 3000 });
    };

    return () => ws.close();
  }, [currentUser, token , track]);
  console.log(track); 
  // track run useeffect any change webscoket

  // Share with another user
  const handleShare = async () => {
    if (!username.trim()) return toast.error("Enter a username");

    try {
      await shareWithOtherInventory({ shared_user: username }).unwrap();
      toast.success(`Shared with ${username}`);
      setUsername("");
      closeModal();
    } catch (err) {
      toast.error(err.data?.detail || "Failed to share");
    }
  };

  // Delete shared access
  const handleDelete = async (id) => {
    try {
      await deleteInventory(id).unwrap();
      toast.success("Removed successfully");
    } catch (err) {
      toast.error(err.data?.detail || "Delete failed");
    }
  };

  return (
    <div className="p-4 max-w-6xl mx-auto">
      <Toaster />

      {/* Share Input */}
      <section className="flex gap-x-6 mb-6 mt-6">
        <TextField
          placeholder="Enter username to share inventory"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          onKeyPress={(e) => e.key === "Enter" && handleShare()}
          sx={{ width: "100%", "& .MuiInputBase-root": { height: "48px" } }}
        />
        <SearchButton onClick={handleShare} title="Share" />
      </section>

      {/* Open Modal Button */}
      <button
        onClick={openModal}
        className="bg-blue-600 hover:bg-blue-700 text-white font-medium py-2.5 px-8 rounded mb-6 transition"
      >
        View Shared Users
      </button>

      {/* Modal — List of users you shared with */}
      <Modal
        isOpen={modalIsOpen}
        onRequestClose={closeModal}
        style={responsiveModalStylesInventory}
        contentLabel="Shared Users List"
        ariaHideApp={false}
      >
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold text-gray-800">Shared With</h2>
          <button
            onClick={closeModal}
            className="text-gray-500 hover:text-red-600 text-3xl font-light"
          >
            ×
          </button>
        </div>

        <Paper className="p-6 min-h-64">
          {inventories.length === 0 ? (
            <p className="text-center text-gray-500 py-8">No shares yet</p>
          ) : (
            <div className="space-y-3">
              {allShareInventory?.map((item) => (
                <div
                  key={item.id}
                  className="flex items-center justify-between p-4 bg-gray-50 rounded-lg border hover:shadow transition"
                >
                  <p className="text-lg font-medium text-gray-800">
                    {item.shared_user}
                  </p>
                  <MdDelete
                    className="text-red-500 hover:text-red-700 cursor-pointer transition"
                    size={26}
                    onClick={() => handleDelete(item.id)}
                  />
                </div>
              ))}
            </div>
          )}
        </Paper>
      </Modal>

      {/* Table of your inventory */}
      <section>
        <InventoryTable3
          inventoryData={inventories}
          onDelete={handleDelete}
        
        />
      </section>
    </div>
  );
}

export default Share;