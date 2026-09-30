const express = require("express");

const {
  createCategory,
} = require("../controllers/facility-category.controller");

const { authenticate } = require("../middlewares/auth.middleware");
const { requireRole } = require("../middlewares/role.middleware");

const router = express.Router();

router.post(
  "/",
  authenticate,
  requireRole("ADMIN"),
  createCategory
);

module.exports = router;