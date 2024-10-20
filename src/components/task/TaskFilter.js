import React, { useEffect, useState } from "react";
import axios from "axios";
import {
  List,
  ListItem,
  ListItemText,
  Checkbox,
  IconButton,
  Popover,
  MenuItem,
  Typography,
  Box,
} from "@mui/material";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import FilterAltIcon from "@mui/icons-material/FilterAlt";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";

const TaskFilter = ({
  fetchCategories,
  catLoading,
  error,
  categories,
  handleCategoryEdit,
  onFilterChange,
}) => {
  const [anchorEl, setAnchorEl] = useState(null);
  const [selectedCategoryId, setSelectedCategoryId] = useState(null);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [status, setStatus] = useState("");
  const [selectedCategoriesID, setSelectedCategoriesID] = useState(null);
  const token = localStorage.getItem("token");
  useEffect(() => {
    fetchCategories();
  }, []);

  const handleCategoryChange = (categoryId) => {
    setSelectedCategoriesID(categoryId);
  };

  useEffect(() => {
    onFilterChange({
      category: selectedCategoriesID,
      status,
    });
  }, [selectedCategoriesID, status]);

  const handleMoreClick = (event, categoryId, category) => {
    setAnchorEl(event.currentTarget);
    setSelectedCategoryId(categoryId);
    setSelectedCategory(category);
  };

  const handleClosePopover = () => {
    setAnchorEl(null);
    setSelectedCategoryId(null);
    setSelectedCategory(null);
  };

  const open = Boolean(anchorEl);

  const handleDeleteCategory = async (categoryId) => {
    try {
      const token = localStorage.getItem("token");
      await axios.delete(
        `https://task-manager-nodejs-nyyo.onrender.com/categories/categories/${categoryId}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      fetchCategories();
      console.log("Category deleted:", categoryId);
    } catch (error) {
      console.error("Error deleting category:", error);
    } finally {
      handleClosePopover();
    }
  };

  return (
    <>
      {token && (
        <div>
          <div className="px-5">
            <h1 className=" text-md text-center text-semibold bg-gray-700 text-white p-2 flex items-center gap-2">
              {" "}
              <FilterAltIcon />
              Filter by categories
            </h1>
          </div>
          <Box sx={{ maxHeight: 400, overflowY: "auto" }}>
            {catLoading && <Typography sx={{ textAlign:"center"}}>processing...</Typography>}
            {error && <Typography color="error">{error}</Typography>}
            <List>
              {categories.map((category) => (
                <ListItem key={category._id}>
                  <Checkbox
                    checked={selectedCategoriesID === category._id}
                    onChange={() => handleCategoryChange(category._id)}
                  />
                  <ListItemText primary={category.name} />
                  <IconButton
                    onClick={(e) => handleMoreClick(e, category._id, category)}
                  >
                    <MoreVertIcon />
                  </IconButton>
                </ListItem>
              ))}
            </List>

            <Popover
              open={open}
              anchorEl={anchorEl}
              onClose={handleClosePopover}
              anchorOrigin={{
                vertical: "bottom",
                horizontal: "left",
              }}
              transformOrigin={{
                vertical: "top",
                horizontal: "left",
              }}
            >
              <Box sx={{ p: 1, width: 150 }}>
                <MenuItem
                  onClick={() => {
                    handleCategoryEdit(selectedCategory);
                    handleClosePopover();
                  }}
                  sx={{
                    display: "flex",
                    alignItems: "center",
                    gap: 2,
                    color: "gray",
                  }}
                >
                  <EditIcon /> Edit
                </MenuItem>
                <MenuItem
                  onClick={() => {
                    handleDeleteCategory(selectedCategoryId);
                  }}
                  sx={{
                    display: "flex",
                    alignItems: "center",
                    gap: 2,
                    color: "gray",
                  }}
                >
                  <DeleteIcon /> Delete
                </MenuItem>
              </Box>
            </Popover>
          </Box>
        </div>
      )}
      <div className="mt-5">
        <div className="px-5">
          <h1 className=" text-md text-center text-semibold bg-gray-700 text-white p-2 flex items-center gap-2">
            {" "}
            <FilterAltIcon />
            Filter by status
          </h1>
        </div>
        <ul className="items-center  text-sm font-medium mt-4 ml-2 text-gray-900  rounded-lg sm:flex flex-col dark:bg-gray-700 dark:border-gray-600 dark:text-white">
          {["pending", "in-progress", "completed"].map((statusValue) => (
            <li
              key={statusValue}
              className="w-full border-b border-gray-200 sm:border-b-0 sm:border-r dark:border-gray-600"
            >
              <div className="flex items-center ps-3">
                <input
                  id={`status-${statusValue}`}
                  type="radio"
                  value={statusValue}
                  name="task-status"
                  checked={status === statusValue}
                  onChange={() => setStatus(statusValue)}
                  className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-700 dark:focus:ring-offset-gray-700 focus:ring-2 dark:bg-gray-600 dark:border-gray-500"
                />
                <label
                  htmlFor={`status-${statusValue}`}
                  className="w-full py-3 ms-2 text-lg text-gray-900"
                >
                  {statusValue}
                </label>
              </div>
            </li>
          ))}
        </ul>
      </div>
    </>
  );
};

export default TaskFilter;
