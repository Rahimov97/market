import React, { useState } from "react";
import { Box, TextField, Button } from "@mui/material";
import { useNavigate } from "react-router-dom";
import { handleSearchNavigate } from "@/utils/searchUtils";

const SearchBar: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState<string>("");
  const navigate = useNavigate();

  const handleSearch = () => {
    handleSearchNavigate(navigate, searchTerm);
  };

  return (
    <Box
      sx={{
        display: "flex",
        alignItems: "center",
        border: "2px solid #FFD700",
        borderRadius: "8px",
        overflow: "hidden",
        width: "50%",
      }}
    >
      <TextField
        placeholder="Найти товары"
        variant="outlined"
        size="small"
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        onKeyDown={(e) => e.key === "Enter" && handleSearch()}
        sx={{
          flex: 1,
          "& .MuiOutlinedInput-root": {
            border: "none",
            borderRadius: 0,
            paddingLeft: "8px",
          },
          "& .MuiOutlinedInput-notchedOutline": {
            border: "none",
          },
        }}
      />
      <Button
        variant="contained"
        onClick={handleSearch}
        sx={{
          bgcolor: "#FFD700",
          color: "black",
          textTransform: "none",
          fontWeight: "bold",
          padding: "8px 16px",
          borderRadius: 0,
          "&:hover": { bgcolor: "#FFD700" },
        }}
      >
        Найти
      </Button>
    </Box>
  );
};

export default SearchBar;
