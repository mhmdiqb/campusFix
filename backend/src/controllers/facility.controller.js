const prisma = require("../utils/prisma");

async function getFacilities(req, res) {
  try {
    const facilities = await prisma.facility.findMany({
      include: {
        category: true,
      },
      orderBy: {
        name: "asc",
      },
    });

    return res.status(200).json({
      success: true,
      data: facilities,
    });
  } catch (error) {
    console.error("Get facilities error:", error);

    return res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
}

async function createFacility(req, res) {
  try {
    const {
      name,
      description,
      location,
      qrCode,
      categoryId,
    } = req.body;

    if (!name || !location || !qrCode || !categoryId) {
      return res.status(400).json({
        success: false,
        message: "Name, location, qrCode, and categoryId are required",
      });
    }

    const facility = await prisma.facility.create({
      data: {
        name,
        description,
        location,
        qrCode,
        categoryId: Number(categoryId),
      },
      include: {
        category: true,
      },
    });

    return res.status(201).json({
      success: true,
      message: "Facility created successfully",
      data: facility,
    });
  } catch (error) {
    console.error("Create facility error:", error);

    return res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
}

module.exports = {
  getFacilities,
  createFacility,
};