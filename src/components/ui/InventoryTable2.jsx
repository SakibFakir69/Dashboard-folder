import React from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  IconButton,
  Typography,
  Box,
  useTheme,
  useMediaQuery,
} from "@mui/material";
import { useAllCategoryQuery } from "../../redux/features/api";
import { MdDelete, MdEdit } from "react-icons/md";

function InventoryTable2({ inventoryData = [], onDelete, onEdit }) {
  const { data: allCategory } = useAllCategoryQuery();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("md")); // < 900px

  if (!inventoryData || inventoryData.length === 0) {
    return (
      <Box className="p-6 text-center text-gray-500">
        <Typography>No inventory items found</Typography>
      </Box>
    );
  }

  const getCategoryName = (categoryId) =>
    allCategory?.find((cat) => cat.id === categoryId)?.name || "Unknown";

  const getPriorityColor = (priority) => {
    switch (priority) {
      case "High":
        return "text-red-600 font-bold";
      case "Medium":
        return "text-yellow-600 font-bold";
      case "Low":
        return "text-green-600 font-bold";
      default:
        return "text-gray-500";
    }
  };

  // Mobile Card View
  if (isMobile) {
    return (
      <Box className="space-y-4 p-4">
        {inventoryData.map((item, index) => {
          const categoryName = getCategoryName(item.category);

          return (
            <Paper
              key={item.id || index}
              elevation={2}
              className="p-4 rounded-lg shadow-sm border border-gray-200"
            >
              <Box className="flex justify-between items-start mb-3">
                <Typography variant="subtitle1" className="font-bold text-blue-700">
                  #{index + 1} - {item.name}
                </Typography>
                <Box className="flex gap-2">
                  <IconButton size="small" onClick={() => onEdit(item)}>
                    <MdEdit className="text-blue-500" size={20} />
                  </IconButton>
                  <IconButton size="small" onClick={() => onDelete(item.id)}>
                    <MdDelete className="text-red-500" size={20} />
                  </IconButton>
                </Box>
              </Box>

              <Box className="grid grid-cols-2 gap-3 text-sm">
                <div>
                  <Typography className="text-gray-500">Category</Typography>
                  <Typography className="font-medium">{categoryName}</Typography>
                </div>
                <div>
                  <Typography className="text-gray-500">Priority</Typography>
                  <Typography className={getPriorityColor(item.priority)}>
                    {item.priority}
                  </Typography>
                </div>
                <div>
                  <Typography className="text-gray-500">Quantity</Typography>
                  <Typography className="font-bold">{item.number}</Typography>
                </div>
              </Box>
            </Paper>
          );
        })}
      </Box>
    );
  }

  // Desktop Table View (unchanged but cleaned up)
  return (
    <TableContainer component={Paper} sx={{ maxHeight: "70vh" }}>
      <Table stickyHeader aria-label="inventory table">
        <TableHead>
          <TableRow>
            <TableCell sx={{ fontWeight: "bold", backgroundColor: "#f9fafb" }}>
              ID
            </TableCell>
            <TableCell sx={{ fontWeight: "bold", backgroundColor: "#f9fafb" }}>
              Name
            </TableCell>
            <TableCell sx={{ fontWeight: "bold", backgroundColor: "#f9fafb" }}>
              Category
            </TableCell>
            <TableCell sx={{ fontWeight: "bold", backgroundColor: "#f9fafb" }}>
              Priority
            </TableCell>
            <TableCell sx={{ fontWeight: "bold", backgroundColor: "#f9fafb" }}>
              Quantity
            </TableCell>
            <TableCell sx={{ fontWeight: "bold", backgroundColor: "#f9fafb" }}>
              Actions
            </TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {inventoryData.map((item, index) => {
            const categoryName = getCategoryName(item.category);

            return (
              <TableRow
                key={item.id || index}
                hover
                sx={{ "&:nth-of-type(odd)": { backgroundColor: "#f9fafb" } }}
              >
                <TableCell className="text-blue-600 font-medium">
                  {index + 1}
                </TableCell>
                <TableCell>{item.name}</TableCell>
                <TableCell>{categoryName}</TableCell>
                <TableCell className={getPriorityColor(item.priority)}>
                  {item.priority}
                </TableCell>
                <TableCell className="font-bold">{item.number}</TableCell>
                <TableCell>
                  <Box className="flex gap-2">
                    <IconButton onClick={() => onEdit(item)} size="small">
                      <MdEdit className="text-blue-500" size={20} />
                    </IconButton>
                    <IconButton onClick={() => onDelete(item.id)} size="small">
                      <MdDelete className="text-red-500" size={20} />
                    </IconButton>
                  </Box>
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