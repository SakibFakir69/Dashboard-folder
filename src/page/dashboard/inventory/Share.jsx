import React, { useEffect, useState } from "react";
import { Paper, TextField } from "@mui/material";
import toast, { Toaster } from "react-hot-toast";
import SearchButton from "../../../components/ui/SearchButton";

import InventoryTable2 from "../../../components/ui/InventoryTable2"; // import your table

import {
  useAllShareInventoryQuery,
  useDeleteShareInventoryMutation,
  useShareWithOtherInventoryMutation,
} from "../../../redux/features/api";
import { MdDelete } from "react-icons/md";

function Share() {
  const [username, setUsername] = useState("");
  const [inventories, setInventories] = useState([]);

  const [shareWithOtherInventory] = useShareWithOtherInventoryMutation();
  const { data: allShareInventory = [] } = useAllShareInventoryQuery();
  const [deleteShareInventory] = useDeleteShareInventoryMutation();

  const token = localStorage.getItem("token");
  const currentUser = "google";

  console.log(allShareInventory, " share user");

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
        console.log("WS Message:", data);

        switch (data.event) {
          case "initial":
            setInventories(data.inventories);
            break;

          case "create":
            setInventories((prev) => [...prev, data.inventory]);
            break;

          case "update":
            setInventories((prev) =>
              prev.map((inv) =>
                inv.id === data.inventory.id ? data.inventory : inv
              )
            );
            break;

          case "delete":
            setInventories((prev) =>
              prev.filter((inv) => inv.id !== data.inventory.id)
            );
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

  const handleDelete = async (id) => {
    console.log(id);
    try {
      await deleteShareInventory(id).unwrap();
      toast.success("Deleted successfully");
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
      <Toaster/>

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

      <h3 className="font-bold md:text-2xl text-black mt-6 mb-4">
        Live share user list
      </h3>

      <Paper elevation={2} className="min-h-32 p-4 flex flex-col gap-4">
        {allShareInventory.map((user, key) => (
          <div
            key={key}
            className="flex items-center justify-between p-3 border rounded-md hover:shadow-md transition-shadow duration-200 border-gray-200"
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
    </div>
  );
}

export default Share;
