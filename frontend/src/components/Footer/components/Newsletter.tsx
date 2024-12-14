import React from "react";
import { Box, Typography, TextField, Button } from "@mui/material";
import EmailIcon from "@mui/icons-material/Email";

const Newsletter: React.FC = () => {
  return (
    <Box
      sx={{
        backgroundColor: "#e6f0fc",
        padding: "16px 32px",
        borderRadius: "8px",
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        marginBottom: "24px",
      }}
    >
      <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
        <EmailIcon sx={{ fontSize: 40, color: "#5a9bd4" }} />
        <Typography variant="body1">
          Будьте в курсе скидок на электронику, товары для детей и для дома
        </Typography>
      </Box>
      <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
        <TextField
          placeholder="example@email.com"
          size="small"
          sx={{
            backgroundColor: "white",
            borderRadius: "4px",
            "& .MuiOutlinedInput-root": {
              padding: "0 12px",
            },
          }}
        />
        <Button
          variant="contained"
          sx={{
            backgroundColor: "#5a9bd4",
            color: "white",
            fontWeight: "bold",
            textTransform: "none",
            "&:hover": { backgroundColor: "#4a8ac4" },
          }}
        >
          Подписаться
        </Button>
      </Box>
    </Box>
  );
};

export default Newsletter;
