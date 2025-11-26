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
} from "@mui/material";
import { MdDelete, MdEdit } from "react-icons/md";

function InventoryTable3({ wsUrl, token, onDelete }) {
  const [inventories, setInventories] = useState([]);
  const [loading, setLoading] = useState(true);

  console.log(inventories, "3   ");

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
        console.error("WS message parse error:", err);
      }
    };

    ws.onerror = (err) => console.error("WebSocket error:", err);
    ws.onclose = () => console.log("WebSocket disconnected");

    return () => ws.close();
  }, [wsUrl, token, onDelete]);

  if (loading) {
    return (
      <div className="flex justify-center items-center p-6">
        <CircularProgress />
      </div>
    );
  }

  return (
    <TableContainer component={Paper} className="max-h-96 overflow-y-auto">
      <Table stickyHeader>
        <TableHead>
          <TableRow>
            <TableCell className="!font-semibold text-gray-600">ID</TableCell>
            <TableCell className="!font-semibold text-gray-600">Name</TableCell>
            <TableCell className="!font-semibold text-gray-600">
              Category
            </TableCell>
            <TableCell className="!font-semibold text-gray-600">
              Priority
            </TableCell>
            <TableCell className="!font-semibold text-gray-600">
              Number
            </TableCell>
            <TableCell className="!font-semibold text-gray-600">
              Actions
            </TableCell>
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
                <MdEdit size={20}/>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
}

export default InventoryTable3;
