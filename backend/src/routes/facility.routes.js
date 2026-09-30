const express = require("express");
const { getFacilities, createFacility } = require("../controllers/facility.controller");
const { authenticate } = require("../middlewares/auth.middleware");
const { requireRole } = require("../middlewares/role.middleware");

const router = express.Router();

router.get("/", getFacilities);
router.post(
  "/",
  authenticate,
  requireRole("ADMIN"),
  createFacility
);


module.exports = router;
