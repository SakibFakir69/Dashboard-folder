import React from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
} from "@mui/material";
import { useAllCategoryQuery } from "../../redux/features/api";
import { MdDelete, MdEdit } from "react-icons/md";

function InventoryTable2({ inventoryData = [], onDelete, onEdit }) {
  const { data: allCategory } = useAllCategoryQuery();

  if (!inventoryData || inventoryData.length === 0) {
    return (
      <div className="p-4 text-center text-gray-500">
        No inventory items found
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
              Action
            </TableCell>
          </TableRow>
        </TableHead>

        <TableBody>
          {inventoryData.map((item, index) => {
            const categoryName =
              allCategory?.find((cat) => cat.id === item.category)?.name ||
              "Unknown";

            return (
              <TableRow key={item.id || index}>
                <TableCell className="!text-blue-600">{index + 1}</TableCell>
                <TableCell>{item.name}</TableCell>
                <TableCell>{categoryName}</TableCell>
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

                {/* operation */}
                <TableCell className="!flex md:!gap-x-2 ">
                  <MdEdit
                    className="text-blue-500 cursor-pointer"
                    size={20}
                    onClick={() => onEdit(item)}
                  />
                  <MdDelete
                    className="size-5 text-red-500"
                    onClick={() => onDelete(item.id)}
                  />
                </TableCell>
              </TableRow>
            );
          })}
        </TableBody>
      </Table>
    </TableContainer>
  );
}

export default InventoryTable2;
