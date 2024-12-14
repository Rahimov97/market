import React from "react";
import { Box, Typography, Link } from "@mui/material";

const BottomBar: React.FC = () => {
  return (
    <Box
      sx={{
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        fontSize: "14px",
        color: "#888",
        borderTop: "1px solid #ddd",
        paddingTop: "8px",
        marginTop: "16px",
      }}
    >
      <Box sx={{ display: "flex", gap: "16px" }}>
      </Box>
      <Typography>© 2024 ООО «ФАРО МАРКЕТ»</Typography>
    </Box>
  );
};

export default BottomBar;
