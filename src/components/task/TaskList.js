import React, { useEffect } from "react";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemText from "@mui/material/ListItemText";
import IconButton from "@mui/material/IconButton";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import AccessTimeIcon from "@mui/icons-material/AccessTime"; 
import AutorenewIcon from "@mui/icons-material/Autorenew";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import Pagination from "@mui/material/Pagination";
import { Box, CircularProgress, Typography } from "@mui/material";
import axios from "axios";

const TaskList = ({
  tasks,
  loading,
  page,
  totalPages,
  fetchTasks,
  handlePageChange,
  handleEditClick,
}) => {
  const handleDeleteClick = async (taskId) => {
    if (window.confirm("Are you sure you want to delete this task?")) {
      try {
        const token = localStorage.getItem("token");
        await axios.delete(
          `https://task-manager-nodejs-nyyo.onrender.com/tasks/tasks/${taskId}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        fetchTasks(page);
      } catch (error) {
        console.error("Error deleting task:", error);
      }
    }
  };

  useEffect(() => {
    fetchTasks(page);
  }, [page]);

  const getStatusIcon = (status) => {
    switch (status) {
      case "pending":
        return <AccessTimeIcon sx={{ color: "red", mr: 1 }} />;
      case "in-progress":
        return <AutorenewIcon sx={{ color: "orange", mr: 1 }} />;
      case "completed":
        return <CheckCircleIcon sx={{ color: "green", mr: 1 }} />;
      default:
        return null;
    }
  };

  return (
    <>
      {loading ? (
        <Box sx={{ display: "flex", justifyContent: "center", mt: 5 }}>
          <CircularProgress />
        </Box>
      ) : tasks.length === 0 ? (
        <Box
          sx={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            mt: 5,
          }}
        >
          <img
            src="https://cdni.iconscout.com/illustration/premium/thumb/businessman-completed-tasks-illustration-download-in-svg-png-gif-file-formats--no-task-list-tasklist-complete-done-emaily-pack-communication-illustrations-4202464.png?f=webp"
            alt="No tasks"
            style={{ width: "200px", height: "200px" }}
          />
          <Typography variant="h6" sx={{ color: "gray", mt: 2 }}>
            No tasks available.
          </Typography>
        </Box>
      ) : (
        <List sx={{ width: "100%", mt: 5 }}>
          {tasks.map((task) => (
            <ListItem
              key={task._id}
              secondaryAction={
                <Box display="flex" alignItems="center">
                  <IconButton
                    edge="end"
                    aria-label="edit"
                    size="small"
                    title="Edit Task"
                    onClick={() => handleEditClick(task)}
                  >
                    <EditIcon sx={{ color: "#E4E0E1" }} />
                  </IconButton>
                  <IconButton
                    edge="end"
                    aria-label="delete"
                    size="small"
                    title="Delete Task"
                    onClick={() => handleDeleteClick(task._id)}
                  >
                    <DeleteIcon sx={{ color: "#E4E0E1" }} />
                  </IconButton>
                </Box>
              }
              sx={{
                bgcolor: "white",
                mb: 2,
                p: 1,
                boxShadow: "0px 3px 6px rgba(0, 0, 0, 0.1)",
                borderRadius: "8px",
              }}
              disablePadding
            >
              <ListItemButton dense>
            
                {getStatusIcon(task.status)}
                <ListItemText
                  sx={{ fontSize: 14 }}
                  id={`checkbox-list-label-${task._id}`}
                  primary={task.title}
                />
              </ListItemButton>
            </ListItem>
          ))}
        </List>
      )}

      {tasks.length > 0 && (
        <Box
          sx={{
            display: "flex",
            mt: 3,
            position: "fixed",
            bottom: 50,
            bgcolor: "white",
            p: 2,
            boxShadow: "0px -3px 6px rgba(0, 0, 0, 0.1)",
          }}
        >
          <Pagination
            count={totalPages}
            page={page}
            onChange={handlePageChange}
            variant="outlined"
            shape="rounded"
          />
        </Box>
      )}
    </>
  );
};

export default TaskList;
