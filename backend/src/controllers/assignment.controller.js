const prisma = require("../utils/prisma");

const assignReport = async (req, res) => {
  try {
    const reportId = Number(req.params.reportId);
    const { technicianId } = req.body;

    if (!technicianId) {
      return res.status(400).json({
        success: false,
        message: "technicianId is required",
      });
    }

    const report = await prisma.report.findUnique({
      where: {
        id: reportId,
      },
    });

    if (!report) {
      return res.status(404).json({
        success: false,
        message: "Report not found",
      });
    }

    const technician = await prisma.user.findUnique({
      where: {
        id: Number(technicianId),
      },
    });

    if (!technician) {
      return res.status(404).json({
        success: false,
        message: "Technician not found",
      });
    }

    if (technician.role !== "TECHNICIAN") {
      return res.status(400).json({
        success: false,
        message: "User is not a technician",
      });
    }

    const existingAssignment = await prisma.assignment.findUnique({
      where: {
        reportId,
      },
    });

    if (existingAssignment) {
      return res.status(409).json({
        success: false,
        message: "Report is already assigned",
      });
    }

    const result = await prisma.$transaction(async (tx) => {
      const assignment = await tx.assignment.create({
        data: {
          reportId,
          technicianId: Number(technicianId),
        },
        include: {
          technician: {
            select: {
              id: true,
              name: true,
              email: true,
            },
          },
        },
      });

      const updatedReport = await tx.report.update({
        where: {
          id: reportId,
        },
        data: {
          status: "ASSIGNED",
        },
      });

      await tx.reportUpdate.create({
        data: {
          reportId,
          userId: req.user.userId,
          type: "STATUS_CHANGE",
          status: "ASSIGNED",
        },
      });

      // Audit Log
      await tx.auditLog.create({
        data: {
          userId: req.user.userId,
          action: "CREATE",
          entity: "Assignment",
          entityId: assignment.id,
          details: `Assigned report ${reportId} to technician ${technicianId}`,
        },
      });

      return {
        assignment,
        report: updatedReport,
      };
    });

    return res.status(201).json({
      success: true,
      message: "Report assigned successfully",
      data: result,
    });
  } catch (error) {
    console.error("Assign report error:", error);

    return res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};

const getMyAssignments = async (req, res) => {
  try {
    const technicianId = req.user.userId;

    const assignments = await prisma.assignment.findMany({
      where: {
        technicianId
      },
      include: {
        report: {
          include: {
            facility: {
              include: {
                category: true
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
        }
      },
      orderBy: {
        assignedAt: "desc"
      }
    });

    return res.status(200).json({
      success: true,
      message: "Assignments retrieved successfully",
      data: assignments
    });
  } catch (error) {
    console.error("Get my assignments error:", error);

    return res.status(500).json({
      success: false,
      message: "Internal server error"
    });
  }
};

const startAssignment = async (req, res) => {
  try {
    const technicianId = req.user.userId;
    const reportId = Number(req.params.reportId);

    const assignment = await prisma.assignment.findFirst({
      where: {
        reportId,
        technicianId
      }
    });

    if (!assignment) {
      return res.status(404).json({
        success: false,
        message: "Assignment not found"
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

    if (report.status !== "ASSIGNED") {
      return res.status(400).json({
        success: false,
        message: "Report must be ASSIGNED first"
      });
    }

    const updatedReport = await prisma.report.update({
      where: {
        id: reportId
      },
      data: {
        status: "IN_PROGRESS"
      }
    });

    await prisma.reportUpdate.create({
      data: {
        reportId,
        userId: technicianId,
        type: "STATUS_CHANGE",
        status: "IN_PROGRESS"
      }
    });

    return res.status(200).json({
      success: true,
      message: "Report status updated to IN_PROGRESS",
      data: updatedReport
    });
  } catch (error) {
    console.error("Start assignment error:", error);

    return res.status(500).json({
      success: false,
      message: "Internal server error"
    });
  }
};  

const completeAssignment = async (req, res) => {
  try {
    const technicianId = req.user.userId;
    const reportId = Number(req.params.reportId);

    const assignment = await prisma.assignment.findFirst({
      where: {
        reportId,
        technicianId
      }
    });

    if (!assignment) {
      return res.status(404).json({
        success: false,
        message: "Assignment not found"
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

    if (report.status !== "IN_PROGRESS") {
      return res.status(400).json({
        success: false,
        message: "Report must be IN_PROGRESS first"
      });
    }

    const updatedReport = await prisma.report.update({
      where: {
        id: reportId
      },
      data: {
        status: "COMPLETED"
      }
    });

    await prisma.assignment.update({
      where: {
        id: assignment.id
      },
      data: {
        completedAt: new Date()
      }
    });

    await prisma.reportUpdate.create({
      data: {
        reportId,
        userId: technicianId,
        type: "STATUS_CHANGE",
        status: "COMPLETED"
      }
    });

    return res.status(200).json({
      success: true,
      message: "Report completed successfully",
      data: updatedReport
    });
  } catch (error) {
    console.error("Complete assignment error:", error);

    return res.status(500).json({
      success: false,
      message: "Internal server error"
    });
  }
};

const updateAssignmentStatus = async (req, res) => {
  try {
    const assignmentId = Number(req.params.id);
    const { status, note } = req.body;

    const allowedStatuses = ["IN_PROGRESS", "COMPLETED"];

    if (!allowedStatuses.includes(status)) {
      return res.status(400).json({
        success: false,
        message: "Invalid assignment status",
      });
    }

    const assignment = await prisma.assignment.findUnique({
      where: {
        id: assignmentId,
      },
      include: {
        report: true,
      },
    });

    if (!assignment) {
      return res.status(404).json({
        success: false,
        message: "Assignment not found",
      });
    }

    // Pastikan assignment milik teknisi yang sedang login
    if (assignment.technicianId !== req.user.userId) {
      return res.status(403).json({
        success: false,
        message: "You are not assigned to this report",
      });
    }

    if (
      status === "IN_PROGRESS" &&
      assignment.report.status !== "ASSIGNED"
    ) {
      return res.status(400).json({
        success: false,
        message: "Report must be ASSIGNED first",
      });
    }

    if (
      status === "COMPLETED" &&
      assignment.report.status !== "IN_PROGRESS"
    ) {
      return res.status(400).json({
        success: false,
        message: "Report must be IN_PROGRESS first",
      });
    }

    const result = await prisma.$transaction(async (tx) => {
      const updatedAssignment = await tx.assignment.update({
        where: {
          id: assignmentId,
        },
        data: {
          completedAt:
            status === "COMPLETED" ? new Date() : null,
        },
      });

      const updatedReport = await tx.report.update({
        where: {
          id: assignment.reportId,
        },
        data: {
          status,
        },
      });

      const reportUpdate = await tx.reportUpdate.create({
        data: {
          reportId: assignment.reportId,
          userId: req.user.userId,
          type: "STATUS_CHANGE",
          status,
          note: note || null,
        },
      });

      await tx.auditLog.create({
        data: {
          userId: req.user.userId,
          action: "UPDATE",
          entity: "Assignment",
          entityId: assignmentId,
          details: `Assignment ${assignmentId} status changed to ${status}`,
        },
      });

      return {
        assignment: updatedAssignment,
        report: updatedReport,
        reportUpdate,
      };
    });

    return res.status(200).json({
      success: true,
      message: "Assignment status updated successfully",
      data: result,
    });
  } catch (error) {
    console.error("Update assignment status error:", error);

    return res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};

const getTechnicians = async (req, res) => {
  try {
    const technicians = await prisma.user.findMany({
      where: {
        role: "TECHNICIAN",
      },
      select: {
        id: true,
        name: true,
        email: true,
      },
      orderBy: {
        name: "asc",
      },
    });

    return res.status(200).json({
      success: true,
      message: "Technicians retrieved successfully",
      data: technicians,
    });
  } catch (error) {
    console.error("Get technicians error:", error);

    return res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};

module.exports = {
  assignReport,
  getMyAssignments,
  startAssignment,
  completeAssignment,
  updateAssignmentStatus,
  getTechnicians,
};