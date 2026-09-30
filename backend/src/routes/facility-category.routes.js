const express = require("express");

const {
  createCategory,
  getCategories,
  getCategoryById
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

router.get("/", getCategories);
router.get("/:id", getCategoryById);

module.exports = router;