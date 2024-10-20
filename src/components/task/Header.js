import React, { useState, useEffect } from "react";
import WavingHandIcon from "@mui/icons-material/WavingHand";
import Button from "@mui/material/Button";
import AddIcon from "@mui/icons-material/Add";
import { useNavigate } from "react-router-dom";

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

  const handletaskModal = () => {
    if (token) {
      setOpen(true);
    } else {
      navigate("/login");
    }
  };
  return (
    <>
      <div className="flex items-center justify-between">
        <div className="flex flex-col items-start gap-2">
          <div className="flex items-center gap-4">
            <h1 className="text-xl font-bold text-black">
              {greeting}, Pragati!{" "}
            </h1>
            <span>
              <WavingHandIcon style={{ color: "#F3C623" }} />
            </span>
          </div>
          <p className="text-gray-400 font-semibold text-md">{currentDate}</p>
        </div>
        <div className="flex items-center gap-4">
          <div>
            <Button
              variant="outlined"
              startIcon={<AddIcon />}
              sx={{ color: "black" }}
              onClick={handleCategoryModal}
            >
              Create new category
            </Button>
          </div>
          <div>
            <Button
              variant="contained"
              startIcon={<AddIcon />}
              style={{ backgroundColor: "black" }}
              onClick={handletaskModal}
            >
              Create new task
            </Button>
          </div>
        </div>
      </div>
    </>
  );
};

export default Header;
