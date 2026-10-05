const express = require("express");

const {
  createReport,
  getReports,
  updateReportStatus,
  confirmReport,
  getReportHistory,
  addReportNote,
  getReportDetail,
} = require("../controllers/report.controller");

const { authenticate } = require("../middlewares/auth.middleware");

const { requireRole } = require("../middlewares/role.middleware");

const upload = require("../middlewares/upload.middleware");

const router = express.Router();

router.post(
  "/",
  authenticate,
  upload.single("image"),
  createReport
);

router.get("/", authenticate, getReports);

router.get("/:id/history", authenticate, getReportHistory);

router.post(
  "/:id/notes",
  authenticate,
  addReportNote
);

router.patch(
  "/:id/status",
  authenticate,
  requireRole("ADMIN"),
  updateReportStatus
);

router.patch(
  "/:id/confirm",
  authenticate,
  confirmReport
);

router.get(
  "/:id",
  authenticate,
  getReportDetail
);

module.exports = router;