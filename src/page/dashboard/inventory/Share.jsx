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
  useDeleteShareInventoryMutation,
  useShareWithOtherInventoryMutation,
} from "../../../redux/features/api";
import { useDispatch } from "react-redux";

function Share() {
  const [username, setUsername] = useState("");
  const [inventories, setInventories] = useState([]);
  const [modalIsOpen, setIsOpen] = useState(false);

  // RTK Query Hooks
  const { data: allShareInventory } = useAllShareInventoryQuery();
  const [deleteInventory] = useDeleteInventoryMutation();
  const [shareWithOtherInventory] = useShareWithOtherInventoryMutation();
  const [deleteShareInventory] = useDeleteShareInventoryMutation();
  
  // Auth Data
  const token = localStorage.getItem("token") || "";
  const currentUser = localStorage.getItem("username");
  const dispatch = useDispatch();

  const wsUrl = `ws://127.0.0.1:8020/ws/inventories/${currentUser}/?token=${token}`;

  useEffect(() => {
    if (!token || !currentUser) {
      toast.error("No token or user");
      return;
    }

    const ws = new WebSocket(wsUrl);

    // Helper to force RTK Query to refetch the "Shared With" user list
    const invalidateShareCache = () => {
      dispatch({ type: 'api/invalidateTags', payload: ['Share'] });
    };

    ws.onopen = () => {
      console.log("WebSocket Connected →", currentUser);
      toast.success("Live updates ON", { duration: 2000 });
    };

    ws.onmessage = (event) => {
      try {
        const data = JSON.parse(event.data);
        console.log("Live Event:", data.event);

        switch (data.event) {
          case "initial":
            setInventories(data.inventories || []);
            break;

          case "share": // In case backend sends specific 'share' event
          case "create": // Standard event when item is added/shared
            setInventories((prev) => {
              const exists = prev.some((i) => i.id === data.inventory.id);
              if (exists) return prev;
              toast.success(`New item received!`);
              return [...prev, data.inventory];
            });
            // Optional: Refresh user list if item creation affects it
            invalidateShareCache(); 
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
            toast.success("Item removed");
            invalidateShareCache();
            break;

          case "error":
            toast.error(data.message || "Access denied");
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
    };

    return () => ws.close();
  }, [currentUser, token, dispatch]);

  const openModal = () => setIsOpen(true);
  const closeModal = () => setIsOpen(false);

  // Share with another user (Mutation updates Modal automatically via tags)
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

  // Delete item (Mutation updates Table automatically via WebSocket 'delete' event)
  const handleDelete = async (id) => {
    try {
      await deleteInventory(id).unwrap();
      // No toast needed here if WebSocket sends "delete" event back
    } catch (err) {
      toast.error(err.data?.detail || "Delete failed");
    }
  };

  // Delete shared user (Mutation updates Modal automatically via tags)
  const handelDeleteShareUser = async (id) => {
    try {
      await deleteShareInventory(id).unwrap();
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

      {/* User List Modal */}
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
          {(!allShareInventory || allShareInventory.length === 0) ? (
            <p className="text-center text-gray-500 py-8">No shares yet</p>
          ) : (
            <div className="space-y-3">
              {allShareInventory.map((item) => (
                <div
                  key={item.id}
                  className="flex items-center justify-between p-4 bg-gray-50 rounded-lg border hover:shadow transition border-gray-300/20"
                >
                  <p className="text-lg font-medium text-gray-800">
                    {item.shared_user}
                  </p>
                  <MdDelete
                    className="text-red-500 hover:text-red-700 cursor-pointer transition"
                    size={26}
                    onClick={() => handelDeleteShareUser(item.id)}
                  />
                </div>
              ))}
            </div>
          )}
        </Paper>
      </Modal>

      {/* Inventory Table */}
      <section>
        <InventoryTable3 inventoryData={inventories} onDelete={handleDelete} />
      </section>
    </div>
  );
}

export default Share;