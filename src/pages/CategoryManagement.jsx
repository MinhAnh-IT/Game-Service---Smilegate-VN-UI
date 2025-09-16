import { useEffect, useState } from "react";
import {
  Container, Typography, Button, TextField, Table, TableBody,
  TableCell, TableContainer, TableHead, TableRow, Paper,
  Dialog, DialogTitle, DialogContent, DialogActions,
  IconButton, Box, Alert, Grid, Chip
} from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import AddIcon from "@mui/icons-material/Add";
import CategoryIcon from "@mui/icons-material/Category";
import SaveIcon from "@mui/icons-material/Save";
import CancelIcon from "@mui/icons-material/Cancel";
import categoryApi from "../api/categoryApi";
import ErrorAlert from "../components/ErrorAlert";

export default function CategoryManagement() {
  const [categories, setCategories] = useState([]);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState("");
  
  // Dialog states
  const [openDialog, setOpenDialog] = useState(false);
  const [editingCategory, setEditingCategory] = useState(null);
  const [formData, setFormData] = useState({
    displayName: ""
  });

  useEffect(() => {
    loadCategories();
  }, []);

  const loadCategories = async () => {
    try {
      const data = await categoryApi.getAll();
      setCategories(data || []);
      setError(null);
    } catch (err) {
      setError(err);
    }
  };

  const handleOpenDialog = (category = null) => {
    if (category) {
      setEditingCategory(category);
      setFormData({
        displayName: category.displayName
      });
    } else {
      setEditingCategory(null);
      setFormData({
        displayName: ""
      });
    }
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
    setEditingCategory(null);
    setFormData({ displayName: "" });
  };

  const handleSubmit = async () => {
    try {
      if (!formData.displayName.trim()) {
        setError({ message: "Please enter display name" });
        return;
      }

      if (editingCategory) {
        // Update existing category
        await categoryApi.update(editingCategory.code, formData);
        setSuccess("Category updated successfully!");
      } else {
        // Create new category - chỉ truyền displayName
        await categoryApi.create({ displayName: formData.displayName });
        setSuccess("Category created successfully!");
      }
      
      handleCloseDialog();
      loadCategories();
      setError(null);
      
      // Clear success message after 3 seconds
      setTimeout(() => setSuccess(""), 3000);
    } catch (err) {
      setError(err);
    }
  };

  const handleDelete = async (categoryCode) => {
    if (window.confirm(`Are you sure you want to delete category "${categoryCode}"?`)) {
      try {
        await categoryApi.delete(categoryCode);
        setSuccess("Category deleted successfully!");
        loadCategories();
        setError(null);
        
        // Clear success message after 3 seconds
        setTimeout(() => setSuccess(""), 3000);
      } catch (err) {
        setError(err);
      }
    }
  };

  return (
    <Container maxWidth="lg" sx={{ py: 3 }}>
      <Grid container spacing={3} justifyContent="center">
        <Grid item xs={12} md={10}>
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
                📂 Category Management
              </Typography>
              <Typography variant="body1" sx={{ opacity: 0.9 }}>
                Manage game categories for your application
              </Typography>
            </Box>

            {/* Content */}
            <Box sx={{ p: 4 }}>
              <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 3 }}>
                <Typography variant="h6" sx={{ display: "flex", alignItems: "center" }}>
                  <CategoryIcon sx={{ mr: 1, color: "primary.main" }} />
                  All Categories
                </Typography>
                <Button
                  variant="contained"
                  startIcon={<AddIcon />}
                  onClick={() => handleOpenDialog()}
                  size="large"
                  sx={{ 
                    px: 3,
                    background: "linear-gradient(45deg, #2196F3 30%, #21CBF3 90%)",
                    "&:hover": {
                      background: "linear-gradient(45deg, #1976D2 30%, #1EAEDB 90%)"
                    }
                  }}
                >
                  Add Category
                </Button>
              </Box>

              <ErrorAlert error={error} />
              
              {success && (
                <Alert severity="success" sx={{ mb: 2 }}>
                  {success}
                </Alert>
              )}

              <TableContainer component={Paper} elevation={2} sx={{ borderRadius: 2 }}>
                <Table>
                  <TableHead>
                    <TableRow sx={{ backgroundColor: "#f8f9fa" }}>
                      <TableCell sx={{ fontWeight: "bold", fontSize: "1rem" }}>Code</TableCell>
                      <TableCell sx={{ fontWeight: "bold", fontSize: "1rem" }}>Display Name</TableCell>
                      <TableCell sx={{ fontWeight: "bold", textAlign: "center", fontSize: "1rem" }}>Actions</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {categories.length === 0 ? (
                      <TableRow>
                        <TableCell colSpan={3} sx={{ textAlign: "center", py: 6 }}>
                          <CategoryIcon sx={{ fontSize: 48, color: "text.secondary", mb: 2 }} />
                          <Typography variant="h6" color="text.secondary" sx={{ mb: 1 }}>
                            No categories found
                          </Typography>
                          <Typography variant="body2" color="text.secondary">
                            Click "Add Category" to create your first category
                          </Typography>
                        </TableCell>
                      </TableRow>
                    ) : (
                      categories.map((category) => (
                        <TableRow key={category.code} hover sx={{ "&:hover": { backgroundColor: "#f5f5f5" } }}>
                          <TableCell>
                            <Chip 
                              label={category.code} 
                              variant="outlined" 
                              color="primary"
                              sx={{ fontWeight: "bold" }}
                            />
                          </TableCell>
                          <TableCell>
                            <Typography variant="body1" fontWeight="500">
                              {category.displayName}
                            </Typography>
                          </TableCell>
                          <TableCell sx={{ textAlign: "center" }}>
                            <IconButton
                              color="primary"
                              onClick={() => handleOpenDialog(category)}
                              sx={{ mr: 1 }}
                              size="small"
                            >
                              <EditIcon />
                            </IconButton>
                            <IconButton
                              color="error"
                              onClick={() => handleDelete(category.code)}
                              size="small"
                            >
                              <DeleteIcon />
                            </IconButton>
                          </TableCell>
                        </TableRow>
                      ))
                    )}
                  </TableBody>
                </Table>
              </TableContainer>
            </Box>
          </Paper>
        </Grid>
      </Grid>

      {/* Dialog for Add/Edit Category */}
      <Dialog open={openDialog} onClose={handleCloseDialog} maxWidth="sm" fullWidth>
        <DialogTitle sx={{ 
          background: "linear-gradient(135deg, #1976d2 0%, #42a5f5 100%)",
          color: "white",
          textAlign: "center"
        }}>
          <Typography variant="h6" fontWeight="bold">
            {editingCategory ? "✏️ Edit Category" : "➕ Add New Category"}
          </Typography>
        </DialogTitle>
        <DialogContent sx={{ p: 3, mt: 2 }}>
          {/* Show Category Code Only When Editing */}
          {editingCategory && (
            <TextField
              label="Category Code"
              value={editingCategory.code}
              fullWidth
              margin="normal"
              disabled
              variant="outlined"
              helperText="Category code cannot be changed"
              sx={{ mb: 2 }}
            />
          )}
          <TextField
            label="Display Name"
            value={formData.displayName}
            onChange={(e) => setFormData({ ...formData, displayName: e.target.value })}
            fullWidth
            margin="normal"
            variant="outlined"
            helperText="Enter the display name for this category"
            autoFocus={!editingCategory}
          />
        </DialogContent>
        <DialogActions sx={{ p: 3, justifyContent: "center", gap: 2 }}>
          <Button 
            onClick={handleCloseDialog}
            variant="outlined"
            startIcon={<CancelIcon />}
            size="large"
            sx={{ px: 3 }}
          >
            Cancel
          </Button>
          <Button 
            onClick={handleSubmit} 
            variant="contained"
            startIcon={<SaveIcon />}
            size="large"
            sx={{ 
              px: 3,
              background: "linear-gradient(45deg, #2196F3 30%, #21CBF3 90%)",
              "&:hover": {
                background: "linear-gradient(45deg, #1976D2 30%, #1EAEDB 90%)"
              }
            }}
          >
            {editingCategory ? "Update" : "Create"}
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
}
