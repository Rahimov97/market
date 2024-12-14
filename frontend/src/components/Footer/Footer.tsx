import React from "react";
import { Box } from "@mui/material";
import Newsletter from "./components/Newsletter";
import FooterLinks from "./components/FooterLinks";
import BottomBar from "./components/BottomBar";

const Footer: React.FC = () => {
  return (
    <Box
      component="footer"
      sx={{
        backgroundColor: "#f6f8fa",
        padding: "32px",
        borderTop: "1px solid #e3e4e8",
      }}
    >
      <Newsletter />
      <FooterLinks />
      <BottomBar />
    </Box>
  );
};

export default Footer;
