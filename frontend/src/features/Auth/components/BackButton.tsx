import React from "react";
import { IconButton } from "@mui/material";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import { useNavigate } from "react-router-dom";

const BackButton: React.FC = () => {
  const navigate = useNavigate();
  return (
    <IconButton
      onClick={() => navigate("/")}
      sx={{ position: "absolute", top: 16, left: 16, color: "#000" }}
    >
      <ArrowBackIcon />
    </IconButton>
  );
};

export default BackButton;
