const express = require("express");

const {
  createAuditLog,
  getAuditLogs,
} = require("../controllers/audit-log.controller");

const { authenticate } = require("../middlewares/auth.middleware");
const { requireRole } = require("../middlewares/role.middleware");

const router = express.Router();

router.get("/", authenticate, requireRole("ADMIN"), getAuditLogs);

module.exports = router;