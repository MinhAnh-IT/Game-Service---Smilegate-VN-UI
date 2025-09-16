import { useEffect, useRef, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import {
  Container, Typography, TextField, Button, Select,
  MenuItem, Card, CardContent, Box, Radio, FormControlLabel,
  Grid, Paper, Divider, FormControl, InputLabel, Chip,
  Avatar, Alert
} from "@mui/material";
import CloudUploadIcon from "@mui/icons-material/CloudUpload";
import SaveIcon from "@mui/icons-material/Save";
import CancelIcon from "@mui/icons-material/Cancel";
import ImageIcon from "@mui/icons-material/Image";
import LanguageIcon from "@mui/icons-material/Language";
import CategoryIcon from "@mui/icons-material/Category";
import gameApi from "../api/gameApi";
import categoryApi from "../api/categoryApi";
import languageApi from "../api/languageApi";
import gameNameApi from "../api/GameNameApi"; 
import ErrorAlert from "../components/ErrorAlert";

export default function GameForm() {
  const [categories, setCategories] = useState([]);
  const [languages, setLanguages] = useState([]);
  const [form, setForm] = useState({
    gameId: "",
    category: "",
    gameNames: [],   // [{id?, language, value, defaultName}]
    image: null,
  });
  const [error, setError] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);

  const originalNamesRef = useRef([]); 

  const navigate = useNavigate();
  const { id } = useParams(); // id = gameId

  useEffect(() => {
    categoryApi.getAll().then(setCategories).catch(setError);
    languageApi.getAll().then(setLanguages).catch(setError);

    if (id) {
      gameApi.getById(id)
        .then((g) => {
          setForm({
            gameId: g.gameId,
            category: g.category,
            gameNames: g.gameNames || [],
            image: null,
          });
          originalNamesRef.current = g.gameNames || [];
        })
        .catch(setError);
    } else {
      // To do
    }
  }, [id]);

  const setDefaultLanguage = (langCode) => {
    setForm((prev) => ({
      ...prev,
      gameNames: [
        ...languages.map(l => {
          const existing = prev.gameNames.find(n => n.language === l.code) || { language: l.code, value: "" };
          return {
            ...existing,
            defaultName: l.code === langCode,
          };
        })
      ],
    }));
  };

  const handleChangeName = (lang, value) => {
    setForm((prev) => {
      const existing = prev.gameNames.find((n) => n.language === lang);
      const others = prev.gameNames.filter((n) => n.language !== lang);
      return {
        ...prev,
        gameNames: [
          ...others,
          {
            ...(existing || { language: lang, defaultName: false }),
            value,
          },
        ],
      };
    });
  };

  const validateBeforeSubmit = () => {
    if (!form.category) {
      setError({ message: "Please select a category!" });
      return false;
    }
    const hasDefault = form.gameNames.some((n) => n.defaultName && (n.value || "").trim().length > 0);
    if (!hasDefault) {
      setError({ message: "Please select a default name!" });
      return false;
    }
    return true;
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setForm({ ...form, image: file });
      // Create preview URL
      const reader = new FileReader();
      reader.onload = () => setImagePreview(reader.result);
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async () => {
    try {
      if (!validateBeforeSubmit()) return;

      if (!id) {
        // CREATE
        const formData = new FormData();
        formData.append("category", form.category);
        if (form.image) formData.append("image", form.image);

        // chỉ đẩy những item có value
        const validNames = form.gameNames.filter(n => (n.value || "").trim().length > 0);
        validNames.forEach((n, idx) => {
          formData.append(`gameNames[${idx}].language`, n.language);
          formData.append(`gameNames[${idx}].value`, n.value);
          formData.append(`gameNames[${idx}].defaultName`, n.defaultName);
        });

        await gameApi.create(formData);
      } else {
        // UPDATE GAME: category + image
        const formData = new FormData();
        formData.append("category", form.category);
        if (form.image) formData.append("image", form.image);
        await gameApi.update(id, formData);

        // Đồng bộ tên
        const origByLang = Object.fromEntries(
          (originalNamesRef.current || []).map(n => [n.language, n])
        );

        // 1) Thêm mới / Sửa
        for (const n of form.gameNames) {
          const hasValue = (n.value || "").trim().length > 0;
          const orig = origByLang[n.language];

          if (!orig && hasValue) {
            // thêm mới
            await gameNameApi.add(id, {
              language: n.language,
              value: n.value,
              defaultName: n.defaultName === true,
            });
          } else if (orig && hasValue) {
            const valueChanged = n.value !== orig.value;
            const becameDefault = !orig.defaultName && !!n.defaultName;

            // Nếu đổi default từ A → B, chỉ cần update cho B với defaultName=true
            // (backend tự bỏ mặc định của A)
            if (valueChanged || becameDefault) {
              await gameNameApi.update(id, orig.id, {
                language: n.language,
                value: n.value,
                defaultName: !!n.defaultName,
              });
            }
          }
        }

        // 2) Delete if user remove value
        for (const orig of originalNamesRef.current || []) {
          const cur = form.gameNames.find(n => n.language === orig.language);
          const removed = !cur || !(cur.value || "").trim().length;
          if (removed) {
            await gameNameApi.delete(id, orig.id);
          }
        }
      }

      navigate("/");
    } catch (err) {
      setError(err);
    }
  };

  return (
    <Container maxWidth="lg" sx={{ py: 3 }}>
      <Grid container spacing={3} justifyContent="center">
        <Grid item xs={12} md={8}>
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
                {id ? "✏️ Edit Game" : "🎮 Add New Game"}
              </Typography>
              <Typography variant="body1" sx={{ opacity: 0.9 }}>
                {id ? "Update game information" : "Create a new game entry"}
              </Typography>
            </Box>

            {/* Content */}
            <CardContent sx={{ p: 4 }}>
              <ErrorAlert error={error} />

              <Grid container spacing={3}>
                {/* Left Column - Basic Info */}
                <Grid item xs={12} md={6}>
                  <Typography variant="h6" sx={{ mb: 2, display: "flex", alignItems: "center" }}>
                    <CategoryIcon sx={{ mr: 1, color: "primary.main" }} />
                    Basic Information
                  </Typography>

                  {/* GameId must show when use eidt operation */}
                  {id && (
                    <TextField
                      label="Game ID"
                      value={form.gameId}
                      fullWidth
                      margin="normal"
                      disabled
                      variant="outlined"
                      sx={{ mb: 2 }}
                    />
                  )}

                  {/* Category */}
                  <FormControl fullWidth margin="normal" sx={{ mb: 2 }}>
                    <InputLabel>Category</InputLabel>
                    <Select
                      value={form.category}
                      onChange={(e) => setForm({ ...form, category: e.target.value })}
                      label="Category"
                    >
                      <MenuItem value="">
                        <em>Select Category</em>
                      </MenuItem>
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
                  </FormControl>

                  {/* Image Upload */}
                  <Box sx={{ mb: 3 }}>
                    <Typography variant="h6" sx={{ mb: 2, display: "flex", alignItems: "center" }}>
                      <ImageIcon sx={{ mr: 1, color: "primary.main" }} />
                      Game Image
                    </Typography>
                    
                    <Box 
                      sx={{ 
                        border: "2px dashed #ddd",
                        borderRadius: 2,
                        p: 3,
                        textAlign: "center",
                        transition: "all 0.3s"
                      }}
                    >
                      {imagePreview ? (
                        <Box>
                          <Avatar
                            src={imagePreview}
                            sx={{ width: 100, height: 100, mx: "auto", mb: 2 }}
                            variant="rounded"
                          />
                          <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                            Image selected
                          </Typography>
                        </Box>
                      ) : (
                        <Box sx={{ mb: 2 }}>
                          <CloudUploadIcon sx={{ fontSize: 48, color: "text.secondary", mb: 1 }} />
                          <Typography variant="body2" color="text.secondary">
                            No image selected
                          </Typography>
                        </Box>
                      )}
                      
                      <input
                        id="image-upload"
                        type="file"
                        accept="image/*"
                        onChange={handleImageChange}
                        style={{ display: "none" }}
                      />
                      <label htmlFor="image-upload">
                        <Button
                          variant="outlined"
                          component="span"
                          startIcon={<CloudUploadIcon />}
                        >
                          {imagePreview ? "Change Image" : "Upload Image"}
                        </Button>
                      </label>
                    </Box>
                  </Box>
                </Grid>

                {/* Right Column - Game Names */}
                <Grid item xs={12} md={6}>
                  <Typography variant="h6" sx={{ mb: 2, display: "flex", alignItems: "center" }}>
                    <LanguageIcon sx={{ mr: 1, color: "primary.main" }} />
                    Game Names by Language
                  </Typography>

                  <Alert severity="info" sx={{ mb: 2 }}>
                    Set game names for different languages. Select one as default.
                  </Alert>

                  {languages.map((lang) => {
                    const entry = form.gameNames.find((n) => n.language === lang.code) || {};
                    const isDefault = !!entry.defaultName;
                    return (
                      <Paper 
                        key={lang.code} 
                        elevation={1} 
                        sx={{ 
                          p: 2, 
                          mb: 2, 
                          border: isDefault ? "2px solid" : "1px solid",
                          borderColor: isDefault ? "primary.main" : "divider",
                          backgroundColor: isDefault ? "primary.50" : "background.paper"
                        }}
                      >
                        <Box sx={{ display: "flex", alignItems: "center", mb: 1 }}>
                          <Chip 
                            label={lang.name} 
                            size="small" 
                            color={isDefault ? "primary" : "default"}
                            sx={{ mr: 1 }}
                          />
                          {isDefault && (
                            <Chip 
                              label="DEFAULT" 
                              size="small" 
                              color="success" 
                              variant="outlined"
                            />
                          )}
                        </Box>
                        
                        <TextField
                          label={`Game name in ${lang.name}`}
                          value={entry.value || ""}
                          onChange={(e) => handleChangeName(lang.code, e.target.value)}
                          fullWidth
                          variant="outlined"
                          size="small"
                          sx={{ mb: 1 }}
                        />
                        
                        <FormControlLabel
                          control={
                            <Radio
                              checked={isDefault}
                              onChange={() => setDefaultLanguage(lang.code)}
                              color="primary"
                            />
                          }
                          label="Set as default language"
                        />
                      </Paper>
                    );
                  })}
                </Grid>
              </Grid>

              <Divider sx={{ my: 3 }} />

              {/* Action Buttons */}
              <Box sx={{ display: "flex", gap: 2, justifyContent: "center" }}>
                <Button 
                  variant="contained" 
                  size="large"
                  onClick={handleSubmit}
                  startIcon={<SaveIcon />}
                  sx={{ 
                    px: 4,
                    background: "linear-gradient(45deg, #2196F3 30%, #21CBF3 90%)",
                    "&:hover": {
                      background: "linear-gradient(45deg, #1976D2 30%, #1EAEDB 90%)"
                    }
                  }}
                >
                  {id ? "Update Game" : "Create Game"}
                </Button>
                <Button 
                  variant="outlined" 
                  size="large"
                  onClick={() => navigate("/")}
                  startIcon={<CancelIcon />}
                  sx={{ px: 4 }}
                >
                  Cancel
                </Button>
              </Box>
            </CardContent>
          </Paper>
        </Grid>
      </Grid>
    </Container>
  );
}
