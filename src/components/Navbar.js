import React from "react";
import { AppBar, Tabs, Tab, Toolbar, Typography } from "@mui/material";
import { useLocation, useNavigate } from "react-router-dom";

function Navbar() {
  const location = useLocation();
  const navigate = useNavigate();

  const handleChange = (event, newValue) => {
    navigate(newValue);
  };

  return (
    <AppBar position="static">
      <Toolbar>
        <Typography variant="h6" sx={{ flexGrow: 1 }}>
          🧠 Cost Optimizer Admin
        </Typography>
        <Tabs
          value={location.pathname === "/subscribe" ? "/subscribe" : "/"}
          onChange={handleChange}
          textColor="inherit"
          indicatorColor="secondary"
        >
          <Tab label="Customer List" value="/" />
          <Tab label="Subscribe New" value="/subscribe" />
        </Tabs>
      </Toolbar>
    </AppBar>
  );
}

export default Navbar;
