const express = require("express");

const {
  assignReport, getMyAssignments, startAssignment, completeAssignment
} = require("../controllers/assignment.controller");

const {
  authenticate
} = require("../middlewares/auth.middleware");

const {
  requireRole
} = require("../middlewares/role.middleware");

const router = express.Router();

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

module.exports = router;