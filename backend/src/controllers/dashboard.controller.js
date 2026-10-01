const prisma = require("../utils/prisma");

const getAdminDashboard = async (req, res) => {
  try {
    const totalReports = await prisma.report.count();

    const reported = await prisma.report.count({
      where: {
        status: "REPORTED",
      },
    });

    const assigned = await prisma.report.count({
      where: {
        status: "ASSIGNED",
      },
    });

    const inProgress = await prisma.report.count({
      where: {
        status: "IN_PROGRESS",
      },
    });

    const completed = await prisma.report.count({
      where: {
        status: "COMPLETED",
      },
    });

    return res.status(200).json({
      success: true,
      message: "Admin dashboard retrieved successfully",
      data: {
        totalReports,
        reported,
        assigned,
        inProgress,
        completed,
      },
    });
  } catch (error) {
    console.error("Get admin dashboard error:", error);

    return res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};

module.exports = {
  getAdminDashboard,
};