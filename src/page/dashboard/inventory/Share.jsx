import React, { useEffect, useState, useRef } from "react";
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

  const wsRef = useRef(null);
  const pollingRef = useRef(null);
  const isMountedRef = useRef(true);

  const { data: allShareInventory, refetch: refetchShareUsers } =
    useAllShareInventoryQuery();

  const [deleteInventory] = useDeleteInventoryMutation();
  const [shareWithOtherInventory] = useShareWithOtherInventoryMutation();
  const [deleteShareInventory] = useDeleteShareInventoryMutation();

  const token = localStorage.getItem("token") || "";
  const currentUser = localStorage.getItem("username");
  const dispatch = useDispatch();

  const wsUrl = `ws://127.0.0.1:8020/ws/inventories/${currentUser}/?token=${token}`;

  const setupWebSocket = () => {
    if (!token || !currentUser) return;

    if (wsRef.current) wsRef.current.close();

    const ws = new WebSocket(wsUrl);
    wsRef.current = ws;

    ws.onopen = () => {
      console.log("WebSocket Connected →", currentUser);
      toast.success("Live updates ON", { duration: 1000 });
    };

    ws.onmessage = (event) => {
      try {
        const data = JSON.parse(event.data);

        switch (data.event) {
          
          case "initial":
            if (isMountedRef.current) {
              setInventories(data.inventories || []);
            }
            break;

          // ------------------- CREATE ITEM -------------------
          case "create":
            if (isMountedRef.current) {
              const item = data.inventory;
              if (!item) return;

              setInventories((prev) =>
                prev.some((i) => i.id === item.id) ? prev : [...prev, item]
              );

              refetchShareUsers();

              toast.success(
                item.owner !== currentUser
                  ? `New item shared by ${item.owner}!`
                  : "New item created!"
              );
            }
            break;

          // ------------------- UPDATE ITEM (FIXED) -------------------
          case "updated": {
            const updatedItem = data.inventories?.[0]; // FIXED
            if (!updatedItem) return;

            if (isMountedRef.current) {
              setInventories((prev) => {
                const index = prev.findIndex((i) => i.id === updatedItem.id);

                if (index !== -1) {
                  const newArr = [...prev];
                  newArr[index] = updatedItem; // FULL REPLACE
                  return newArr;
                }

                // If item was not found → push it
                return [...prev, updatedItem];
              });

              toast.success("Inventory updated!");
            }
            break;
          }

          // ------------------- DELETE ITEM -------------------
          case "delete":
            if (isMountedRef.current) {
              setInventories((prev) =>
                prev.filter((i) => i.id !== data.inventory_id)
              );
              refetchShareUsers();
              toast.success("Item removed");
            }
            break;

          // ------------------- SHARE LIST UPDATED -------------------
          case "share_update":
            refetchShareUsers();
            toast.success("Share list updated");
            break;

          // ------------------- ERROR -------------------
          case "error":
            toast.error(data.message || "Access denied");
            break;

          default:
            console.log("Unknown event:", data);
        }
      } catch (err) {
        console.error("Failed to parse WS message:", err);
      }
    };

    ws.onerror = (error) => console.error("WebSocket error:", error);

    ws.onclose = (event) => {
      console.log("WebSocket closed", event.code, event.reason);
      if (isMountedRef.current && event.code !== 1000) {
        setTimeout(setupWebSocket, 3000);
      }
    };

    return ws;
  };

  // -------------------- Polling --------------------
  const setupPolling = () => {
    if (pollingRef.current) clearInterval(pollingRef.current);

    pollingRef.current = setInterval(
      () => {
        if (isMountedRef.current) refetchShareUsers();
      },
      modalIsOpen ? 3000 : 10000
    );
  };

  useEffect(() => {
    isMountedRef.current = true;
    setupWebSocket();
    setupPolling();

    return () => {
      isMountedRef.current = false;
      if (wsRef.current) wsRef.current.close();
      if (pollingRef.current) clearInterval(pollingRef.current);
    };
  }, [allShareInventory?.length]);

  useEffect(() => {
    if (pollingRef.current) {
      clearInterval(pollingRef.current);
      setupPolling();
    }
  }, [modalIsOpen]);

  // -------------------- Share Functions --------------------
  const handleShare = async () => {
    if (!username.trim()) return toast.error("Enter a username");
    if (username === currentUser)
      return toast.error("Cannot share with yourself");

    try {
      await shareWithOtherInventory({ shared_user: username }).unwrap();
      toast.success(`Successfully shared with ${username}`);
      setUsername("");
      refetchShareUsers();
    } catch (err) {
      toast.error(err.data?.detail || "Failed to share");
    }
  };

  // delete

  const handleDelete = async (id) => {
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
                toast.dismiss(t.id);
                try {
                  await deleteInventory(id).unwrap();
                  toast.success("Item deleted successfully");
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

  const handleDeleteShareUser = async (id) => {
    toast(
      (t) => (
        <div className="flex flex-col gap-2">
          <span>Are you sure you want to delete this user?</span>
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
                toast.dismiss(t.id);
                try {
                  await deleteShareInventory(id).unwrap();
                  refetchShareUsers();
                  toast.success("User removed successfully");
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

  const handleKeyPress = (e) => {
    if (e.key === "Enter") handleShare();
  };

  const openModal = () => {
    setIsOpen(true);
    refetchShareUsers();
  };
  const closeModal = () => setIsOpen(false);

  return (
    <div className="p-4 max-w-6xl mx-auto">
      <Toaster />

      <section className="flex gap-x-6 mb-6 mt-6 items-center">
        <TextField
          placeholder="Enter username to share inventory"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          onKeyPress={handleKeyPress}
          sx={{
            width: "100%",
            "& .MuiInputBase-root": { height: "48px", fontSize: "16px" },
            "& .MuiOutlinedInput-root": {
              "&:hover fieldset": { borderColor: "#3b82f6" },
              "&.Mui-focused fieldset": { borderColor: "#3b82f6" },
            },
          }}
          variant="outlined"
        />
        <SearchButton
          onClick={handleShare}
          title="Share"
          disabled={!username.trim()}
        />
      </section>

      <div className="flex items-center gap-4 mb-6 text-sm">
        <div className="flex items-center gap-2">
          <div
            className={`w-3 h-3 rounded-full ${
              wsRef.current?.readyState === WebSocket.OPEN
                ? "bg-green-500"
                : "bg-red-500"
            }`}
          ></div>
          <span className="text-gray-600">
            {wsRef.current?.readyState === WebSocket.OPEN
              ? "Live updates connected"
              : "Connecting..."}
          </span>
        </div>
      </div>

      <button
        onClick={openModal}
        className="bg-blue-600 hover:bg-blue-700 text-white font-medium py-2.5 px-8 rounded mb-6 transition duration-200 transform hover:scale-[1.02] active:scale-[0.98] shadow-md hover:shadow-lg"
      >
        View Shared Users ({allShareInventory?.length || 0})
      </button>

      {/* Modal code unchanged */}
      <Modal
        isOpen={modalIsOpen}
        onRequestClose={closeModal}
        style={responsiveModalStylesInventory}
        contentLabel="Shared Users List"
        ariaHideApp={false}
      >
        <div className="bg-white rounded-xl shadow-2xl w-full max-w-2xl max-h-[80vh] overflow-hidden flex flex-col">
          {/* Modal Header */}
          <div className="flex justify-between items-center p-6 border-b border-gray-200 bg-gradient-to-r from-blue-50 to-indigo-50">
            <div>
              <h2 className="text-2xl font-bold text-gray-800">Shared With</h2>
              <p className="text-gray-600 text-sm mt-1">
                Users who have access to your inventory
              </p>
            </div>
            <button
              onClick={closeModal}
              className="text-gray-400 hover:text-gray-700 text-3xl font-light bg-gray-100 hover:bg-gray-200 w-10 h-10 rounded-full flex items-center justify-center"
            >
              ×
            </button>
          </div>

          {/* Modal Content */}
          <div className="flex-1 overflow-y-auto p-6">
            <Paper className="p-4 min-h-64 shadow-none border border-gray-200">
              {!allShareInventory || allShareInventory.length === 0 ? (
                <div className="text-center py-12">No shares yet</div>
              ) : (
                <div className="space-y-3">
                  {allShareInventory.map((item) => (
                    <div
                      key={item.id}
                      className="flex items-center justify-between p-4 bg-white rounded-lg border border-gray-200 hover:border-blue-300 hover:shadow-md"
                    >
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-gradient-to-br from-blue-100 to-indigo-100 rounded-full flex items-center justify-center">
                          <span className="text-blue-600 font-semibold">
                            {item.shared_user?.charAt(0).toUpperCase()}
                          </span>
                        </div>
                        <div>
                          <p className="text-lg font-medium text-gray-800">
                            {item.shared_user}
                          </p>
                          <p className="text-sm text-gray-500">
                            {item.created_at
                              ? `Shared on ${new Date(
                                  item.created_at
                                ).toLocaleDateString()}`
                              : "Recently shared"}
                          </p>
                        </div>
                      </div>
                      <MdDelete
                        className="text-red-400 hover:text-red-600 cursor-pointer"
                        size={24}
                        onClick={() => handleDeleteShareUser(item.id)}
                      />
                    </div>
                  ))}
                </div>
              )}
            </Paper>
          </div>
        </div>
      </Modal>

      {/* Inventory Table */}
      <section className="mt-8">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold text-gray-800">
            Shared Inventory Items
          </h2>
          <span className="text-gray-600">{inventories.length} items</span>
        </div>
        <div className="bg-white rounded-xl shadow border border-gray-200 overflow-hidden">
          {inventories.length === 0 ? (
            <div className="text-center py-12">
              No shared inventory items yet.
            </div>
          ) : (
            <InventoryTable3
              inventoryData={inventories}
              onDelete={handleDelete}
              showOwner={true}
            />
          )}
        </div>
      </section>
    </div>
  );
}

export default Share;
