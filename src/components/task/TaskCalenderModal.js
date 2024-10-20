import React, { useState, useEffect } from "react";
import Calendar from "react-calendar";
import "react-calendar/dist/Calendar.css";
import Box from "@mui/material/Box";
import Modal from "@mui/material/Modal";

const style = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: 400,
  bgcolor: "background.paper",
  boxShadow: 24,
  p: 4,
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
    <>
      <Modal open={open} onClose={handleClose}>
        <Box sx={style}>
          <div>
            <Calendar onChange={handleDateChange} value={value} />
            <div>
              <ul>
                {taskMap[formatDate(value)] ? (
                  taskMap[formatDate(value)].map((task) => (
                    <li
                      key={task._id}
                      className="text-md font-sans font-semibold text-rose-500 text-center border border-gray-200"
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
          </div>
        </Box>
      </Modal>
    </>
  );
};

export default TaskCalenderModal;
