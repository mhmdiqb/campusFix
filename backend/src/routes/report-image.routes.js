const express = require("express");

const {
  addReportImage
} = require("../controllers/report-image.controller");

const { authenticate } = require("../middlewares/auth.middleware");

const router = express.Router();

router.post(
  "/:id/images",
  authenticate,
  addReportImage
);

module.exports = router;