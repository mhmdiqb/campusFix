const prisma = require("../utils/prisma");

const createReport = async (req, res) => {
  try {
    const { title, description, priority, facilityId } = req.body;

    if (!title || !description || !facilityId) {
      return res.status(400).json({
        success: false,
        message: "Title, description, and facilityId are required"
      });
    }

    const facility = await prisma.facility.findUnique({
      where: {
        id: Number(facilityId)
      }
    });

    if (!facility) {
      return res.status(404).json({
        success: false,
        message: "Facility not found"
      });
    }

    const report = await prisma.report.create({
      data: {
        title,
        description,
        priority: priority || "MEDIUM",
        facilityId: Number(facilityId),
        userId: req.user.userId
      },
      include: {
        facility: true
      }
    });

    return res.status(201).json({
      success: true,
      message: "Report created successfully",
      data: report
    });
  } catch (error) {
    console.error("Create report error:", error);

    return res.status(500).json({
      success: false,
      message: "Internal server error"
    });
  }
};

const getReports = async (req, res) => {
  try {
    const reports = await prisma.report.findMany({
      orderBy: {
        createdAt: "desc"
      },
      include: {
        facility: {
          select: {
            id: true,
            name: true,
            location: true
          }
        },
        user: {
          select: {
            id: true,
            name: true,
            email: true
          }
        }
      }
    });

    res.status(200).json({
      success: true,
      message: "Reports retrieved successfully",
      data: reports
    });
  } catch (error) {
    console.error(error);

    res.status(500).json({
      success: false,
      message: "Internal server error"
    });
  }
};

const getReportById = async (req, res) => {
  try {
    const id = Number(req.params.id);

    const report = await prisma.report.findUnique({
      where: {
        id
      },
      include: {
        facility: {
          select: {
            id: true,
            name: true,
            location: true
          }
        },
        user: {
          select: {
            id: true,
            name: true,
            email: true
          }
        },
        images: true,
        assignment: true,
        updates: {
          orderBy: {
            createdAt: "desc"
          }
        }
      }
    });

    if (!report) {
      return res.status(404).json({
        success: false,
        message: "Report not found"
      });
    }

    res.status(200).json({
      success: true,
      message: "Report retrieved successfully",
      data: report
    });
  } catch (error) {
    console.error(error);

    res.status(500).json({
      success: false,
      message: "Internal server error"
    });
  }
};

const updateReportStatus = async (req, res) => {
  try {
    const id = Number(req.params.id);
    const { status } = req.body;

    const allowedStatuses = [
      "REPORTED",
      "VERIFIED",
      "ASSIGNED",
      "IN_PROGRESS",
      "COMPLETED",
      "CONFIRMED",
      "REJECTED"
    ];

    if (!allowedStatuses.includes(status)) {
      return res.status(400).json({
        success: false,
        message: "Invalid report status"
      });
    }

    const report = await prisma.report.findUnique({
      where: {
        id
      }
    });

    if (!report) {
      return res.status(404).json({
        success: false,
        message: "Report not found"
      });
    }

    const result = await prisma.$transaction(async (tx) => {
      const updatedReport = await tx.report.update({
        where: {
          id
        },
        data: {
          status
        }
      });

      const reportUpdate = await tx.reportUpdate.create({
        data: {
          reportId: id,
          userId: req.user.userId,
          type: "STATUS_CHANGE",
          status
        }
      });

      return {
        updatedReport,
        reportUpdate
      };
    });

    return res.status(200).json({
      success: true,
      message: "Report status updated successfully",
      data: result.updatedReport
    });
  } catch (error) {
    console.error("Update report status error:", error);

    return res.status(500).json({
      success: false,
      message: "Internal server error"
    });
  }
};

module.exports = {
  createReport,
  getReports,
  getReportById,
  updateReportStatus
};