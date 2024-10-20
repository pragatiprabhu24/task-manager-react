import React, { useState, useEffect } from "react";
import WavingHandIcon from "@mui/icons-material/WavingHand";
import Button from "@mui/material/Button";
import AddIcon from "@mui/icons-material/Add";
import { useNavigate } from "react-router-dom";
import { Box, Typography } from "@mui/material";

const Header = ({ setOpen, setOpenModal }) => {
  const [greeting, setGreeting] = useState("");
  const [currentDate, setCurrentDate] = useState("");
  const navigate = useNavigate();

  const getGreeting = () => {
    const now = new Date();
    const hours = now.getHours();

    if (hours < 12) return "Good morning";
    if (hours < 18) return "Good afternoon";
    return "Good evening";
  };

  const getFormattedDate = () => {
    const now = new Date();
    const options = {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
    };
    return now.toLocaleDateString("en-US", options);
  };

  useEffect(() => {
    setGreeting(getGreeting());
    setCurrentDate(getFormattedDate());
  }, []);

  const token = localStorage.getItem("token");

  const handleCategoryModal = () => {
    if (token) {
      setOpenModal(true);
    } else {
      navigate("/login");
    }
  };

  const handleTaskModal = () => {
    if (token) {
      setOpen(true);
    } else {
      navigate("/login");
    }
  };

  return (
    <Box 
      sx={{ 
        display: "flex", 
        flexDirection: { xs: "column", sm: "row" }, 
        justifyContent: "space-between", 
        alignItems: "center",
        padding: 2,
        gap: 2
      }}
    >
      <Box sx={{ textAlign: { xs: "center", sm: "left" } }}>
        <Box sx={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 1 }}>
          <Typography variant="h5" sx={{ fontWeight: "bold" }}>
            {greeting}
          </Typography>
          <WavingHandIcon sx={{ color: "#F3C623" }} />
        </Box>
        <Typography variant="body2" sx={{ color: "gray" }}>
          {currentDate}
        </Typography>
      </Box>
      <Box sx={{ display: "flex", flexDirection: { xs: "column", sm: "row" }, gap: 2 }}>
        <Button
          variant="outlined"
          startIcon={<AddIcon />}
          onClick={handleCategoryModal}
          sx={{ color: "black" }}
        >
          Create new category
        </Button>
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={handleTaskModal}
          sx={{ backgroundColor: "black" }}
        >
          Create new task
        </Button>
      </Box>
    </Box>
  );
};

export default Header;
