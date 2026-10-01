const express = require("express");

const {
  getAdminDashboard,
} = require("../controllers/dashboard.controller");

const {
  authenticate,
} = require("../middlewares/auth.middleware");

const {
  requireRole,
} = require("../middlewares/role.middleware");

const router = express.Router();

router.get(
  "/admin",
  authenticate,
  requireRole("ADMIN"),
  getAdminDashboard
);

module.exports = router;