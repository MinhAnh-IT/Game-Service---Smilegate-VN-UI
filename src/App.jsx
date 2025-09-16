import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { Box } from "@mui/material";
import Navbar from "./components/Navbar";
import GameList from "./pages/GameList";
import GameForm from "./pages/GameForm";
import CategoryManagement from "./pages/CategoryManagement";

function App() {
  return (
    <Router>
      <Box sx={{ display: "flex", flexDirection: "column", minHeight: "100vh" }}>
        <Navbar />
        {/* Toolbar spacing để tránh content bị che bởi fixed navbar */}
        <Box sx={{ mt: 8 }}>
          <Routes>
            <Route path="/" element={<GameList />} />
            <Route path="/categories" element={<CategoryManagement />} />
            <Route path="/games/new" element={<GameForm />} />
            <Route path="/games/:id/edit" element={<GameForm />} />
          </Routes>
        </Box>
      </Box>
    </Router>
  );
}

export default App;
