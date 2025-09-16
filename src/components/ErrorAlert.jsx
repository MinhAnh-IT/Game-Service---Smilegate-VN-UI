import { Alert } from "@mui/material";

export default function ErrorAlert({ error }) {
  if (!error) return null;
  return (
    <Alert severity="error" sx={{ my: 2 }}>
      {error.message || "Something went wrong"}
    </Alert>
  );
}
