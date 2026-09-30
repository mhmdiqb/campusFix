const express = require("express");
const cors = require("cors");
require("dotenv").config();

const app = express();

app.use(cors());
app.use(express.json());

// Health Check
app.get("/api/health", (req, res) => {
  res.json({
    success: true,
    message: "CampusFix API is running 🚀",
  });
});

// Root
app.get("/", (req, res) => {
  res.json({
    message: "Welcome to CampusFix API 🚀",
  });
});

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`CampusFix API running on port ${PORT}`);
});