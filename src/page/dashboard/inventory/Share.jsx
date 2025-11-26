import React, { useEffect, useState } from "react";
import { TextField } from "@mui/material";
import SearchButton from "../../../components/ui/SearchButton";
import toast, { Toaster } from "react-hot-toast";

import {
  useAllShareInventoryQuery,
  useDeleteShareInventoryMutation,
  useShareWithOtherInventoryMutation,
} from "../../../redux/features/api";

function Share() {
  const [username, setUsername] = useState(""); 
  const [inventories, setInventories] = useState([]); 

  const [shareWithOtherInventory] = useShareWithOtherInventoryMutation();
  const { data: allShareInventory = [] } = useAllShareInventoryQuery();
  const [deleteShareInventory] = useDeleteShareInventoryMutation();

  const token = localStorage.getItem("token");
  const currentUser = "sakib";
  console.log(allShareInventory);



  useEffect(() => {
    if (!currentUser || !token) return;

    const ws = new WebSocket(`ws://127.0.0.1:8020/ws/inventories/${currentUser}/`);

    ws.onopen = () => {
      console.log("WebSocket connected");
     
      ws.send(JSON.stringify({ Authorization: `Bearer ${token}` }));
    };

    ws.onmessage =async (event) => {
      try {
        const data = JSON.parse(event.data);
        console.log(data);
    

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
            
            await handelDelete();
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



  // delete 

  const handelDelete = async (id)=>{

  try {

    const res = await deleteShareInventory(id).unwrap();
    toast.success("Delete");
    
  } catch (error) {
    console.log(error);
    
  }
  }

  // create

  const handleCreate = async ()=>{

    try {

      const res = await createin
      
    } catch (error) {
      console.log(error);
      
    }
  }
 
  const handleShare = async () => {
    if (!username) {
      toast.error("Please enter a username to share with");
      return;
    }

    try {
      const res = await shareWithOtherInventory({ shared_user: username }).unwrap();
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
      <Toaster position="top-right" />

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

      {/* Live updates */}
      <h3 className="font-bold md:text-2xl text-black mt-6 mb-4">Live Inventory Updates</h3>
      {inventories.length === 0 ? (
        <p>No inventories to display</p>
      ) : (
        <ul className="space-y-2">
          {inventories.map((inv) => (
            <li
              key={inv.id}
              className="p-2 border rounded flex justify-between items-center"
            >
              <span>
                {inv.name} - {inv.number} pcs - {inv.priority} - {inv.category}
              </span>
              <button
                className="text-red-500 font-bold"
                onClick={async () => {
                  try {
                    await deleteShareInventory(inv.id).unwrap();
                    toast.success("Deleted successfully");
                  } catch (err) {
                    toast.error(err.data?.detail || "Failed to delete");
                  }
                }}
              >
                Delete
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

export default Share;
