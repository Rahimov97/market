import React from "react";
import { useNavigate } from "react-router-dom";

const Logo: React.FC = () => {
  const navigate = useNavigate();

  const handleLogoClick = () => {
    navigate("/");
  };

  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        gap: "8px",
        cursor: "pointer",
      }}
      onClick={handleLogoClick}
    >
      <img
        src="https://placehold.co/40"
        alt="Logo1"
        style={{
          borderRadius: "50%",
          width: 40,
          height: 40,
        }}
      />
      <img
        src="https://placehold.co/80x40?text=Logo"
        alt="Logo2"
        style={{
          height: 40,
        }}
      />
    </div>
  );
};

export default Logo;
