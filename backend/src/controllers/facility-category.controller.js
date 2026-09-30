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

const getCategories = async (req, res) => {
  try {
    const categories = await prisma.facilityCategory.findMany({
      orderBy: {
        id: "asc",
      },
    });

    res.status(200).json({
      success: true,
      message: "Facility categories retrieved successfully",
      data: categories,
    });
  } catch (error) {
    console.error(error);

    res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};

const getCategoryById = async (req, res) => {
  try {
    const { id } = req.params;

    const category = await prisma.facilityCategory.findUnique({
      where: {
        id: Number(id),
      },
    });

    if (!category) {
      return res.status(404).json({
        success: false,
        message: "Facility category not found",
      });
    }

    res.status(200).json({
      success: true,
      message: "Facility category retrieved successfully",
      data: category,
    });
  } catch (error) {
    console.error(error);

    res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};

module.exports = {
  createCategory,
  getCategories,
  getCategoryById
};