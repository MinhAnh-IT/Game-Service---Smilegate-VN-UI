import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import { ThemeProvider, createTheme, CssBaseline } from "@mui/material";

const theme = createTheme({
  palette: {
    mode: "light",
    primary: {
      main: "#1976d2", 
    },
    secondary: {
      main: "#f50057",
    },
    background: {
      default: "#f4f6f8", 
    },
  },
  shape: {
    borderRadius: 12, 
  },
});

ReactDOM.createRoot(document.getElementById("root")).render(
  <ThemeProvider theme={theme}>
    <CssBaseline />
    <App />
  </ThemeProvider>
);
