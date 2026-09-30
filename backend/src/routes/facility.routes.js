const express = require("express");
const { getFacilities, createFacility, getFacilityById, updateFacility, deleteFacility } = require("../controllers/facility.controller");
const { authenticate } = require("../middlewares/auth.middleware");
const { requireRole } = require("../middlewares/role.middleware");

const router = express.Router();

router.get("/", getFacilities);
router.get("/:id", getFacilityById);
router.post(
  "/",
  authenticate,
  requireRole("ADMIN"),
  createFacility
);

router.put(
  "/:id",
  authenticate,
  requireRole("ADMIN"),
  updateFacility
);

router.delete(
  "/:id",
  authenticate,
  requireRole("ADMIN"),
  deleteFacility
);


module.exports = router;
