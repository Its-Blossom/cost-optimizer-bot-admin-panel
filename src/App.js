import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import CustomerList from "./components/CustomerList";
import CustomerForm from "./components/CustomerForm";
import Navbar from "./components/Navbar";
import { Container, CssBaseline, ThemeProvider, createTheme } from "@mui/material";

const darkTheme = createTheme({
  palette: {
    mode: "dark",
    primary: { main: "#90caf9" },
    background: { default: "#121212", paper: "#1d1d1d" }
  }
});

function App() {
  return (
    <ThemeProvider theme={darkTheme}>
      <CssBaseline />
      <Router>
        <Navbar />
        <Container maxWidth="md" sx={{ mt: 4 }}>
          <Routes>
            <Route path="/" element={<CustomerList />} />
            <Route path="/subscribe" element={<CustomerForm />} />
          </Routes>
        </Container>
      </Router>
    </ThemeProvider>
  );
}

export default App;
