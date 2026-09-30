const express = require("express");
const cors = require("cors");
const healthRoutes = require("./routes/health.routes");
const authRoutes = require("./routes/auth.routes");
const facilityRoutes = require("./routes/facility.routes");
const facilityCategoryRoutes = require("./routes/facility-category.routes");
const reportRoutes = require("./routes/report.routes");

require("dotenv").config();

const app = express();

app.use(cors());
app.use(express.json());

app.use("/api/reports", reportRoutes);
app.use("/api/health", healthRoutes);
app.use("/api/auth", authRoutes);
app.use("/api/facilities", facilityRoutes);
app.use(
  "/api/facility-categories",
  facilityCategoryRoutes
);

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