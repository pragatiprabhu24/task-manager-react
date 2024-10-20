import React, { useState, useEffect } from "react";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Modal from "@mui/material/Modal";
import AddIcon from "@mui/icons-material/Add";
import axios from "axios";
import CircularProgress from "@mui/material/CircularProgress";
import Typography from "@mui/material/Typography";

const style = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  bgcolor: "background.paper",
  boxShadow: 24,
  p: 3,
  width: { xs: "90%", sm: 400 }, // Responsive width
  borderRadius: 2,
};

const CreateCategoryModal = ({
  open,
  setOpen,
  existingCategory,
  isEditing,
  onRefresh,
}) => {
  const [categoryName, setCategoryName] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (open && isEditing && existingCategory) {
      setCategoryName(existingCategory.name);
    } else {
      setCategoryName("");
    }
  }, [open, existingCategory, isEditing]);

  const handleClose = () => {
    setOpen(false);
    setCategoryName("");
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    const categoryData = {
      name: categoryName,
    };

    try {
      const token = localStorage.getItem("token");

      if (isEditing && existingCategory) {
        await axios.put(
          `https://task-manager-nodejs-nyyo.onrender.com/categories/categories/${existingCategory._id}`,
          categoryData,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
      } else {
        await axios.post(
          "https://task-manager-nodejs-nyyo.onrender.com/categories/categories",
          categoryData,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
      }

      handleClose();
      onRefresh();
    } catch (error) {
      console.error("Error saving category:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal
      open={open}
      onClose={handleClose}
      aria-labelledby="modal-modal-title"
      aria-describedby="modal-modal-description"
    >
      <Box sx={style}>
        <Typography variant="h6" component="h2" textAlign="center" mb={2}>
          {isEditing ? "Edit Category" : "Create Category"}
        </Typography>
        <form onSubmit={handleSubmit}>
          <Box mt={2}>
            <label
              htmlFor="category_name"
              className="block mb-1 text-sm font-medium text-gray-900 dark:text-white"
            >
              Category name
            </label>
            <input
              type="text"
              id="category_name"
              className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
              placeholder="Category Name"
              required
              value={categoryName}
              onChange={(e) => setCategoryName(e.target.value)}
            />
          </Box>

          <Box mt={3} display="flex" justifyContent="center">
            <Button
              type="submit"
              variant="contained"
              endIcon={loading ? <CircularProgress size={20} /> : <AddIcon />}
              sx={{
                backgroundColor: "black",
                width: "100%",
                maxWidth: "400px",
              }} // Responsive button
              disabled={loading}
            >
              {loading ? "Saving..." : isEditing ? "Update" : "Add"}
            </Button>
          </Box>
        </form>
      </Box>
    </Modal>
  );
};

export default CreateCategoryModal;
