const express = require("express");

const {
  createAuditLog,
  getAuditLogs,
} = require("../controllers/audit-log.controller");

const { authenticate } = require("../middlewares/auth.middleware");

const router = express.Router();

router.post("/", authenticate, createAuditLog);

router.get("/", authenticate, getAuditLogs);

module.exports = router;