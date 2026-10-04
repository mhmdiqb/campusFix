const express = require("express");

const {
  assignReport,
  getMyAssignments,
  startAssignment,
  completeAssignment,
  updateAssignmentStatus,
  getTechnicians
} = require("../controllers/assignment.controller");

const {
  authenticate,
} = require("../middlewares/auth.middleware");

const {
  requireRole,
} = require("../middlewares/role.middleware");

const router = express.Router();

router.get(
  "/technicians",
  authenticate,
  requireRole("ADMIN"),
  getTechnicians
);

router.get(
  "/my",
  authenticate,
  requireRole("TECHNICIAN"),
  getMyAssignments
);

router.post(
  "/reports/:reportId",
  authenticate,
  requireRole("ADMIN"),
  assignReport
);

router.patch(
  "/reports/:reportId/start",
  authenticate,
  requireRole("TECHNICIAN"),
  startAssignment
);

router.patch(
  "/reports/:reportId/complete",
  authenticate,
  requireRole("TECHNICIAN"),
  completeAssignment
);

router.patch(
  "/:id/status",
  authenticate,
  requireRole("TECHNICIAN"),
  updateAssignmentStatus
);

module.exports = router;