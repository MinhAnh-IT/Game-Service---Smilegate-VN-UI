import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Container, Typography, Button, TextField, Select,
  MenuItem, Card, CardContent, Box, Checkbox,
  FormControlLabel, Pagination, IconButton, Paper, Grid, Chip
} from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import FilterListIcon from "@mui/icons-material/FilterList";
import SearchIcon from "@mui/icons-material/Search";
import gameApi from "../api/gameApi";
import categoryApi from "../api/categoryApi";
import ErrorAlert from "../components/ErrorAlert";

export default function GameList() {
  const [games, setGames] = useState([]);
  const [categories, setCategories] = useState([]);
  const [keyword, setKeyword] = useState("");
  const [category, setCategory] = useState("");
  const [selected, setSelected] = useState([]);
  const [error, setError] = useState(null);

  // pagination
  const [page, setPage] = useState(0);
  const [totalPages, setTotalPages] = useState(1);

  const navigate = useNavigate();

  useEffect(() => {
    loadGames(0);
    categoryApi.getAll().then(setCategories).catch(setError);
  }, []);

  const loadGames = async (pageNumber = 0) => {
    try {
      const params = { page: pageNumber, size: 16 };

      if (keyword) params.keyword = keyword;
      if (category) params.category = category;

      const res = await gameApi.getAll(params);

      setGames(res.content || []);
      setTotalPages(res.totalPages || 1);
      setPage(res.page || 0);
      setError(null);
    } catch (err) {
      setError(err);
    }
  };

  const getDefaultName = (game) =>
    game.gameNames?.find((n) => n.defaultName)?.value || "Untitled Game";

  const getImageUrl = (path) =>
    path ? `http://localhost:8080${path}` : "/no-image.png";

  const handleToggleSelect = (id) => {
    setSelected((prev) =>
      prev.includes(id) ? prev.filter((gid) => gid !== id) : [...prev, id]
    );
  };

  const handleDeleteOne = async (id, e) => {
    e.stopPropagation();
    try {
      await gameApi.deleteOne(id);
      loadGames(page);
    } catch (err) {
      setError(err);
    }
  };

  const handleDeleteMany = async () => {
    try {
      await gameApi.deleteMany(selected);
      setSelected([]);
      loadGames(page);
    } catch (err) {
      setError(err);
    }
  };

  return (
    <Container maxWidth="xl" sx={{ py: 3 }}>
      <Grid container spacing={3}>
        <Grid item xs={12}>
          <Paper elevation={4} sx={{ p: 0, borderRadius: 3, overflow: "hidden" }}>
            {/* Header */}
            <Box 
              sx={{ 
                background: "linear-gradient(135deg, #1976d2 0%, #42a5f5 100%)",
                color: "white",
                p: 3,
                textAlign: "center"
              }}
            >
              <Typography variant="h4" fontWeight="bold" sx={{ mb: 1 }}>
                🎮 Game Collection
              </Typography>
              <Typography variant="body1" sx={{ opacity: 0.9 }}>
                Browse and manage your game library
              </Typography>
            </Box>

            {/* Content */}
            <Box sx={{ p: 4 }}>
              <ErrorAlert error={error} />

              {/* Filters Section */}
              <Paper elevation={1} sx={{ p: 3, mb: 3, borderRadius: 2, backgroundColor: "#f8f9fa" }}>
                <Typography variant="h6" sx={{ mb: 2, display: "flex", alignItems: "center" }}>
                  <FilterListIcon sx={{ mr: 1, color: "primary.main" }} />
                  Search & Filter
                </Typography>
                
                <Box sx={{ display: "flex", gap: 2, alignItems: "center", flexWrap: "wrap" }}>
                  <TextField
                    label="Search games..."
                    value={keyword}
                    onChange={(e) => setKeyword(e.target.value)}
                    variant="outlined"
                    size="small"
                    sx={{ flexGrow: 1, minWidth: 250 }}
                    InputProps={{
                      startAdornment: <SearchIcon sx={{ mr: 1, color: "text.secondary" }} />
                    }}
                  />
                  <Select
                    value={category}
                    displayEmpty
                    onChange={(e) => setCategory(e.target.value)}
                    size="small"
                    sx={{ minWidth: 180 }}
                  >
                    <MenuItem value="">All Categories</MenuItem>
                    {categories.map((c) => (
                      <MenuItem key={c.code} value={c.code}>
                        <Chip 
                          label={c.displayName} 
                          size="small" 
                          variant="outlined"
                          sx={{ mr: 1 }}
                        />
                        {c.code}
                      </MenuItem>
                    ))}
                  </Select>
                  <Button 
                    variant="contained" 
                    onClick={() => loadGames(0)}
                    sx={{ 
                      background: "linear-gradient(45deg, #2196F3 30%, #21CBF3 90%)",
                      "&:hover": {
                        background: "linear-gradient(45deg, #1976D2 30%, #1EAEDB 90%)"
                      }
                    }}
                  >
                    Apply Filter
                  </Button>
                  {selected.length > 0 && (
                    <Button
                      variant="outlined"
                      color="error"
                      onClick={handleDeleteMany}
                      startIcon={<DeleteIcon />}
                    >
                      Delete Selected ({selected.length})
                    </Button>
                  )}
                </Box>
              </Paper>

              {/* Grid show 4 items in row */}
              <Box sx={{ 
                display: 'grid', 
                gridTemplateColumns: 'repeat(4, 1fr)', 
                gap: 2,
                width: '100%'
              }}>
                {games.map((g) => (
          <Box key={g.gameId} sx={{ display: 'flex' }}>
            <Card
              elevation={3}
              sx={{
                position: "relative",
                transition: "all 0.2s ease-in-out",
                "&:hover": { boxShadow: 6, transform: "scale(1.03)" },
                height: 320, 
                display: "flex",
                flexDirection: "column",
                width: "100%",
                maxWidth: "100%",
                flex: 1,
              }}
            >
              {/* delete button */}
              <IconButton
                size="small"
                color="error"
                onClick={(e) => handleDeleteOne(g.gameId, e)}
                sx={{ position: "absolute", top: 8, right: 8 }}
              >
                <DeleteIcon fontSize="small" />
              </IconButton>

              {/* Checkbox */}
              <FormControlLabel
                control={
                  <Checkbox
                    checked={selected.includes(g.gameId)}
                    onChange={(e) => {
                      e.stopPropagation();
                      handleToggleSelect(g.gameId);
                    }}
                  />
                }
                label=""
                sx={{ position: "absolute", bottom: 8, right: 8 }}
              />

              {/* This area to click for edit operation */}
              <Box
                onClick={() => navigate(`/games/${g.gameId}/edit`)}
                sx={{ cursor: "pointer", flexGrow: 1 }}
              >
                {/* image */}
                <Box
                  sx={{
                    width: "100%",
                    height: 180,
                    overflow: "hidden",
                    borderBottom: "1px solid #eee",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    backgroundColor: "#f5f5f5",
                  }}
                >
                  <img
                    src={getImageUrl(g.image)}
                    alt={getDefaultName(g)}
                    style={{
                      width: "100%",
                      height: "100%",
                      objectFit: "cover",
                      objectPosition: "center",
                    }}
                  />
                </Box>

                {/* Content */}
                <CardContent sx={{ textAlign: "center", p: 1 }}>
                  <Typography variant="subtitle1" fontWeight="bold" noWrap>
                    {getDefaultName(g)}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    {g.category}
                  </Typography>
                </CardContent>
              </Box>
            </Card>
          </Box>
        ))}
              </Box>

              {/* Pagination */}
              <Box sx={{ display: "flex", justifyContent: "center", mt: 3 }}>
                <Pagination
                  count={totalPages}
                  page={page + 1}
                  onChange={(e, value) => loadGames(value - 1)}
                />
              </Box>
            </Box>
          </Paper>
        </Grid>
      </Grid>
    </Container>
  );
}
