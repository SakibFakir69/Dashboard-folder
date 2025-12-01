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
  Box,
  Typography,
  useTheme,
  useMediaQuery,
} from "@mui/material";
import { useAllCategoryQuery } from "../../redux/features/api";

function InventoryTable({ inventoryData = [] }) {
  const { data: allCategory = [], isLoading: isCategoryLoading } = useAllCategoryQuery();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("md")); // < 900px = mobile

  if (isCategoryLoading) {
    return (
      <Box className="flex justify-center items-center p-10">
        <CircularProgress />
      </Box>
    );
  }

  if (!inventoryData || inventoryData.length === 0) {
    return (
      <Box className="text-center py-12 text-gray-500">
        <Typography>No inventory items found</Typography>
      </Box>
    );
  }

  const getCategoryName = (categoryId) =>
    allCategory.find((c) => c.id === categoryId)?.name || "None";

  const getPriorityColor = (priority) => {
    if (priority === "High") return "text-red-600 font-bold";
    if (priority === "Medium") return "text-yellow-600 font-bold";
    if (priority === "Low") return "text-green-600 font-bold";
    return "text-gray-500";
  };

  // mobile
  if (isMobile) {
    return (
      <Box className="p-4 space-y-4">
        {inventoryData.map((item, index) => (
          <Paper key={index} elevation={2} className="p-5 rounded-lg">
            <Box className="flex justify-between items-start mb-3">
              <Box>
                <Typography variant="subtitle1" className="font-bold text-blue-700">
                  #{index + 1} • {item.name}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Category: {getCategoryName(item.category)}
                </Typography>
              </Box>
            </Box>

            <Box className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <Typography className="text-gray-500 text-xs">Priority</Typography>
                <Typography className={getPriorityColor(item.priority)}>
                  {item.priority}
                </Typography>
              </div>
              <div>
                <Typography className="text-gray-500 text-xs">Quantity</Typography>
                <Typography className="font-bold text-lg">
                  {item.number}
                </Typography>
              </div>
            </Box>
          </Paper>
        ))}
      </Box>
    );
  }

  // desktop
  return (
    <TableContainer component={Paper} sx={{ maxHeight: "70vh" }}>
      <Table stickyHeader>
        <TableHead>
          <TableRow>
            <TableCell className="!font-semibold text-gray-600 bg-gray-50">ID</TableCell>
            <TableCell className="!font-semibold text-gray-600 bg-gray-50">Name</TableCell>
            <TableCell className="!font-semibold text-gray-600 bg-gray-50">Category</TableCell>
            <TableCell className="!font-semibold text-gray-600 bg-gray-50">Priority</TableCell>
            <TableCell className="!font-semibold text-gray-600 bg-gray-50">Number</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {inventoryData.map((item, index) => {
            const category = allCategory.find((c) => c.id === item.category);

            return (
              <TableRow key={index} hover>
                <TableCell className="text-blue-600 font-medium">{index + 1}</TableCell>
                <TableCell>{item.name}</TableCell>
                <TableCell>{category?.name ?? "None"}</TableCell>
                <TableCell className={getPriorityColor(item.priority)}>
                  {item.priority}
                </TableCell>
                <TableCell className="font-bold">{item.number}</TableCell>
              </TableRow>
            );
          })}
        </TableBody>
      </Table>
    </TableContainer>
  );
}

export default InventoryTable;