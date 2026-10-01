const prisma = require("../utils/prisma");

const addReportImage = async (req, res) => {
  try {
    const reportId = Number(req.params.id);
    const { imageUrl } = req.body;

    if (!imageUrl) {
      return res.status(400).json({
        success: false,
        message: "Image URL is required"
      });
    }

    const report = await prisma.report.findUnique({
      where: {
        id: reportId
      }
    });

    if (!report) {
      return res.status(404).json({
        success: false,
        message: "Report not found"
      });
    }

    const image = await prisma.reportImage.create({
      data: {
        reportId,
        imageUrl
      }
    });

    return res.status(201).json({
      success: true,
      message: "Report image added successfully",
      data: image
    });
  } catch (error) {
    console.error(error);

    return res.status(500).json({
      success: false,
      message: "Failed to add report image"
    });
  }
};

module.exports = {
  addReportImage
};