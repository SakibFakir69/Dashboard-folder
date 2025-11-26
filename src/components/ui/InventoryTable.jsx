import React from "react";
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
import { useAllCategoryQuery } from "../../redux/features/api";

function InventoryTable({ inventoryData = [] }) {
  // Default to empty array to avoid undefined errors
  const { data: allCategory = [], isLoading: isCategoryLoading } = useAllCategoryQuery();

  if (isCategoryLoading) {
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
            <TableCell className="!font-semibold text-gray-600">Category</TableCell>
            <TableCell className="!font-semibold text-gray-600">Priority</TableCell>
            <TableCell className="!font-semibold text-gray-600">Number</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {inventoryData.map((item, index) => {
            const category = allCategory.find((c) => c.id === item.category);

            return (
              <TableRow key={index}>
                <TableCell className="!text-blue-600">{index + 1}</TableCell>
                <TableCell>{item.name}</TableCell>
                <TableCell>{category?.name ?? "none"}</TableCell>
                <TableCell
                  className={`!font-bold ${
                    item.priority === "High"
                      ? "!text-red-500"
                      : item.priority === "Medium"
                      ? "!text-yellow-500"
                      : item.priority === "Low"
                      ? "!text-green-500"
                      : "!text-gray-500"
                  }`}
                >
                  {item.priority}
                </TableCell>
                <TableCell className="!font-bold">{item.number}</TableCell>
              </TableRow>
            );
          })}
        </TableBody>
      </Table>
    </TableContainer>
  );
}

export default InventoryTable;
