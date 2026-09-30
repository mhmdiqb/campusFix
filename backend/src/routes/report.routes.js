const express = require("express");

const { createReport, getReports, getReportById, updateReportStatus } = require("../controllers/report.controller");

const { authenticate } = require("../middlewares/auth.middleware");

const { requireRole } = require("../middlewares/role.middleware");

const router = express.Router();

router.post(
  "/",
  authenticate,
  createReport
);

router.get("/", authenticate, getReports);
router.get("/:id", authenticate, getReportById);

router.patch(
  "/:id/status",
  authenticate,
  requireRole("ADMIN"),
  updateReportStatus
);

module.exports = router;