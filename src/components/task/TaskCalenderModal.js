import React, { useState, useEffect } from "react";
import Calendar from "react-calendar";
import "react-calendar/dist/Calendar.css";
import Box from "@mui/material/Box";
import Modal from "@mui/material/Modal";
import Typography from "@mui/material/Typography";

const style = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  bgcolor: "background.paper",
  boxShadow: 24,
  p: 2,
  width: { xs: "90%", sm: 400 }, 
  borderRadius: 2,
};

const TaskCalenderModal = ({ open, setOpen, tasks }) => {
  const handleClose = () => setOpen(false);
  const [value, setValue] = useState(new Date());
  const [taskMap, setTaskMap] = useState({});

  useEffect(() => {
    const map = {};
    tasks.forEach((task) => {
      const date = new Date(task.dueDate).toLocaleDateString();
      if (!map[date]) {
        map[date] = [];
      }
      map[date].push(task);
    });
    setTaskMap(map);
  }, [tasks]);

  const handleDateChange = (newDate) => {
    setValue(newDate);
  };

  const formatDate = (date) => {
    return new Date(date).toLocaleDateString();
  };

  return (
    <Modal open={open} onClose={handleClose}>
      <Box sx={style}>
        <Typography variant="h6" component="h2" textAlign="center" mb={2}>
          Task Calendar
        </Typography>
        <Calendar onChange={handleDateChange} value={value} />
        <div style={{ marginTop: "16px" }}>
          <ul>
            {taskMap[formatDate(value)] ? (
              taskMap[formatDate(value)].map((task) => (
                <li
                  key={task._id}
                  className="text-md font-sans font-semibold text-rose-500 text-center border border-gray-200 p-2"
                >
                  {task.title}
                </li>
              ))
            ) : (
              <p className="text-md font-sans font-semibold mt-4 text-center">
                No tasks due on this date.
              </p>
            )}
          </ul>
        </div>
      </Box>
    </Modal>
  );
};

export default TaskCalenderModal;
