import { useNavigate, useLocation } from "react-router-dom";
import {
  AppBar, Toolbar, Typography, Button, Box
} from "@mui/material";
import GamepadIcon from "@mui/icons-material/Gamepad";

export default function Navbar() {
  const navigate = useNavigate();
  const location = useLocation();

  return (
    <AppBar 
      position="fixed" 
      sx={{ 
        zIndex: (theme) => theme.zIndex.drawer + 1,
        backgroundColor: "#1976d2"
      }}
    >
      <Toolbar>
        {/* Logo và Title */}
        <GamepadIcon sx={{ mr: 2 }} />
        <Typography 
          variant="h6" 
          component="div" 
          sx={{ 
            flexGrow: 1, 
            fontWeight: "bold",
            cursor: "pointer"
          }}
          onClick={() => navigate("/")}
        >
          🎮 Game Management
        </Typography>

        {/* Navigation Links */}
        <Box sx={{ display: "flex", gap: 2 }}>
          <Button 
            color="inherit"
            onClick={() => navigate("/")}
            sx={{ 
              fontWeight: location.pathname === "/" ? "bold" : "normal",
              backgroundColor: location.pathname === "/" ? "rgba(255,255,255,0.1)" : "transparent"
            }}
          >
            Game List
          </Button>
          <Button 
            color="inherit"
            onClick={() => navigate("/categories")}
            sx={{ 
              fontWeight: location.pathname === "/categories" ? "bold" : "normal",
              backgroundColor: location.pathname === "/categories" ? "rgba(255,255,255,0.1)" : "transparent"
            }}
          >
            📂 Categories
          </Button>
          <Button 
            color="inherit"
            onClick={() => navigate("/games/new")}
            sx={{ 
              fontWeight: location.pathname === "/games/new" ? "bold" : "normal",
              backgroundColor: location.pathname === "/games/new" ? "rgba(255,255,255,0.1)" : "transparent"
            }}
          >
            ➕ Add Game
          </Button>
        </Box>
      </Toolbar>
    </AppBar>
  );
}
