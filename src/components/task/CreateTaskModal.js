import React, { useState, useEffect } from "react";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Modal from "@mui/material/Modal";
import AddIcon from "@mui/icons-material/Add";
import axios from "axios";
import CircularProgress from "@mui/material/CircularProgress";

const style = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: 500,
  bgcolor: "background.paper",
  boxShadow: 24,
  p: 4,
};

const CreateTaskModal = ({
  open,
  setOpen,
  existingTask = null,
  isEditing = false,
  fetchCategories,
  categories,
}) => {
  const [taskName, setTaskName] = useState("");
  const [taskDescription, setTaskDescription] = useState("");
  const [taskStatus, setTaskStatus] = useState("pending");
  const [dueDate, setDueDate] = useState("");
  const [category, setCategory] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (isEditing && existingTask) {
      setTaskName(existingTask.title);
      setTaskDescription(existingTask.description);
      setTaskStatus(existingTask.status);
      setDueDate(new Date(existingTask.dueDate).toISOString().split("T")[0]);
      setCategory(existingTask.category);
    } else {
      setTaskName("");
      setTaskDescription("");
      setTaskStatus("pending");
      setDueDate("");
      setCategory("");
    }
  }, [existingTask, isEditing]);

  const handleClose = () => setOpen(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    const taskData = {
      title: taskName,
      description: taskDescription,
      status: taskStatus,
      dueDate: new Date(dueDate).toISOString(),
      category: category,
    };

    try {
      const token = localStorage.getItem("token");

      if (isEditing && existingTask) {
        await axios.put(
          `https://task-manager-nodejs-nyyo.onrender.com/tasks/tasks/${existingTask._id}`,
          taskData,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
      } else {
        await axios.post(
          "https://task-manager-nodejs-nyyo.onrender.com/tasks/tasks",
          taskData,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
      }

      handleClose();
    } catch (error) {
      console.error("Error saving task:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Modal open={open} onClose={handleClose}>
        <Box sx={style}>
          <form onSubmit={handleSubmit}>
            <div className="mt-5">
              <label
                htmlFor="task_name"
                className="block mb-2 text-sm font-medium text-gray-900"
              >
                Task name
              </label>
              <input
                type="text"
                id="task_name"
                className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg block w-full p-2.5"
                placeholder="Task Name"
                required
                value={taskName}
                onChange={(e) => setTaskName(e.target.value)}
              />
            </div>

            <div className="mt-5">
              <label
                htmlFor="task_description"
                className="block mb-2 text-sm font-medium text-gray-900"
              >
                Task description
              </label>
              <textarea
                id="task_description"
                rows="4"
                className="block p-2.5 w-full text-sm bg-gray-50 rounded-lg border"
                placeholder="Write your task description here..."
                value={taskDescription}
                onChange={(e) => setTaskDescription(e.target.value)}
              ></textarea>
            </div>

            <div className="mt-5">
              <h3 className="block mb-2 text-sm font-medium text-gray-900">
                Mark Status
              </h3>
              <ul className="items-center w-full text-sm font-medium text-gray-900 bg-white border rounded-lg sm:flex">
                {["pending", "in-progress", "completed"].map((status) => (
                  <li key={status} className="w-full border-b sm:border-r">
                    <div className="flex items-center ps-3">
                      <input
                        id={`status-${status}`}
                        type="radio"
                        value={status}
                        name="task-status"
                        checked={taskStatus === status}
                        onChange={(e) => setTaskStatus(e.target.value)}
                        className="w-4 h-4"
                      />
                      <label
                        htmlFor={`status-${status}`}
                        className="w-full py-3 ms-2"
                      >
                        {status}
                      </label>
                    </div>
                  </li>
                ))}
              </ul>
            </div>

            <div className="mt-5">
              <label
                htmlFor="category"
                className="block mb-2 text-sm font-medium text-gray-900"
              >
                Choose category
              </label>
              <select
                id="category"
                className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg block w-full p-2.5"
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                required
              >
                <option value="" disabled>
                  Select a category
                </option>
                {categories.map((cat) => (
                  <option key={cat._id} value={cat._id}>
                    {cat.name}
                  </option>
                ))}
              </select>
            </div>

            <div className="mt-5">
              <label
                htmlFor="due_date"
                className="block mb-2 text-sm font-medium text-gray-900"
              >
                Select due date
              </label>
              <input
                type="date"
                id="due_date"
                className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg block w-full p-2.5"
                value={dueDate}
                onChange={(e) => setDueDate(e.target.value)}
                required
              />
            </div>

            <div className="flex justify-center mt-10">
              <Button
                type="submit"
                variant="contained"
                endIcon={loading ? <CircularProgress size={20} /> : <AddIcon />}
                disabled={loading}
                style={{ backgroundColor: "black", width: "500px" }}
              >
                {loading ? "Saving..." : isEditing ? "Update task" : "Add task"}
              </Button>
            </div>
          </form>
        </Box>
      </Modal>
    </>
  );
};

export default CreateTaskModal;
