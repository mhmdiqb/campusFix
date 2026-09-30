const prisma = require("../utils/prisma");

async function createCategory(req, res) {
  try {
    const { name } = req.body;

    if (!name) {
      return res.status(400).json({
        success: false,
        message: "Name is required",
      });
    }

    const existingCategory = await prisma.facilityCategory.findUnique({
      where: {
        name,
      },
    });

    if (existingCategory) {
      return res.status(409).json({
        success: false,
        message: "Category already exists",
      });
    }

    const category = await prisma.facilityCategory.create({
        data: {
            name,
        }
    })

    return res.status(201).json({
      success: true,
      message: "Facility category created successfully",
      data: category,
    });
  } catch (error) {
    console.error("Create category error:", error);

    return res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
}

module.exports = {
  createCategory,
};