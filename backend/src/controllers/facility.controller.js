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

const getFacilityById = async (req, res) => {
  try {
    const { id } = req.params;

    const facility = await prisma.facility.findUnique({
      where: {
        id: Number(id)
      },
      include: {
        category: true
      }
    });

    if (!facility) {
      return res.status(404).json({
        success: false,
        message: "Facility not found"
      });
    }

    return res.status(200).json({
      success: true,
      message: "Facility retrieved successfully",
      data: facility
    });
  } catch (error) {
    console.error(error);

    return res.status(500).json({
      success: false,
      message: "Internal server error"
    });
  }
};

const updateFacility = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, location, qrCode, status, categoryId } = req.body;

    const facility = await prisma.facility.findUnique({
      where: {
        id: Number(id)
      }
    });

    if (!facility) {
      return res.status(404).json({
        success: false,
        message: "Facility not found"
      });
    }

    const updatedFacility = await prisma.facility.update({
      where: {
        id: Number(id)
      },
      data: {
        name,
        location,
        qrCode,
        status,
        categoryId: categoryId ? Number(categoryId) : undefined
      },
      include: {
        category: true
      }
    });

    return res.status(200).json({
      success: true,
      message: "Facility updated successfully",
      data: updatedFacility
    });
  } catch (error) {
    console.error(error);

    return res.status(500).json({
      success: false,
      message: "Internal server error"
    });
  }
};

const deleteFacility = async (req, res) => {
  try {
    const { id } = req.params;

    const facility = await prisma.facility.findUnique({
      where: {
        id: Number(id)
      }
    });

    if (!facility) {
      return res.status(404).json({
        success: false,
        message: "Facility not found"
      });
    }

    await prisma.facility.delete({
      where: {
        id: Number(id)
      }
    });

    return res.status(200).json({
      success: true,
      message: "Facility deleted successfully"
    });
  } catch (error) {
    console.error(error);

    return res.status(500).json({
      success: false,
      message: "Internal server error"
    });
  }
};

module.exports = {
  getFacilities,
  createFacility,
  getFacilityById,
  updateFacility,  
  deleteFacility
};