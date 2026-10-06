const prisma = require("../utils/prisma");
const { createAuditLog } = require("../utils/audit-log");

const createReport = async (req, res) => {
  try {
    console.log("=== CREATE REPORT START ===");

    console.log("BODY:", req.body);
    console.log("USER:", req.user);
    console.log("FILE:", req.file);

    const { title, description, priority, facilityId } = req.body;

    if (!title || !description || !facilityId) {
      console.log("VALIDATION FAILED");

      return res.status(400).json({
        success: false,
        message: "Judul, deskripsi, dan fasilitas wajib diisi.",
      });
    }

    console.log("1. Membuat report ke database...");

    const report = await prisma.report.create({
      data: {
        title,
        description,
        priority: priority || "MEDIUM",
        facilityId: Number(facilityId),
        userId: req.user.userId,
      },
    });

    console.log("2. Report berhasil dibuat:", report.id);

    if (req.file) {
      console.log("3. Menyimpan gambar...");

      const imageUrl = `/uploads/${req.file.filename}`;

      await prisma.reportImage.create({
        data: {
          reportId: report.id,
          imageUrl,
        },
      });

      console.log("4. Gambar berhasil disimpan");
    }

    console.log("5. Membuat audit log...");

    await createAuditLog({
      userId: req.user.userId,
      action: "CREATE",
      entity: "Report",
      entityId: report.id,
      details: `Created report ${report.title}`,
    });

    console.log("6. Audit log berhasil");

    console.log("7. Mengirim response");

    return res.status(201).json({
      success: true,
      message: "Report created successfully",
      data: report,
    });
  } catch (error) {
    console.error("=== CREATE REPORT ERROR ===");
    console.error(error);

    return res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};

const getReports = async (req, res) => {
  try {
    let where = {};

    // STUDENT hanya melihat laporan miliknya
    if (req.user.role === "STUDENT") {
      where.userId = req.user.userId;
    }

    // TECHNICIAN hanya melihat laporan yang ditugaskan kepadanya
    if (req.user.role === "TECHNICIAN") {
      where.assignment = {
        technicianId: req.user.userId,
      };
    }

    // ADMIN tidak diberi filter sehingga bisa melihat semua laporan
    const reports = await prisma.report.findMany({
      where,
      orderBy: {
        createdAt: "desc",
      },
      include: {
        facility: {
          select: {
            id: true,
            name: true,
            location: true,
          },
        },
        user: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
        assignment: {
          include: {
            technician: {
              select: {
                id: true,
                name: true,
                email: true,
              },
            },
          },
        },
      },
    });

    return res.status(200).json({
      success: true,
      message: "Reports retrieved successfully",
      data: reports,
    });
  } catch (error) {
    console.error("Get reports error:", error);

    return res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};

const getReportById = async (req, res) => {
  try {
    const id = Number(req.params.id);

    const report = await prisma.report.findUnique({
      where: {
        id,
      },
      include: {
        facility: {
          select: {
            id: true,
            name: true,
            location: true,
          },
        },
        user: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
        images: true,
        assignment: true,
        updates: {
          orderBy: {
            createdAt: "desc",
          },
        },
      },
    });

    if (!report) {
      return res.status(404).json({
        success: false,
        message: "Report not found",
      });
    }

    res.status(200).json({
      success: true,
      message: "Report retrieved successfully",
      data: report,
    });
  } catch (error) {
    console.error(error);

    res.status(500).json({
      success: false,
      message: "Internal server error",
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
      "REJECTED",
    ];

    if (!allowedStatuses.includes(status)) {
      return res.status(400).json({
        success: false,
        message: "Invalid report status",
      });
    }

    const report = await prisma.report.findUnique({
      where: {
        id,
      },
    });

    if (!report) {
      return res.status(404).json({
        success: false,
        message: "Report not found",
      });
    }

    const result = await prisma.$transaction(async (tx) => {
      const updatedReport = await tx.report.update({
        where: {
          id,
        },
        data: {
          status,
        },
      });

      const reportUpdate = await tx.reportUpdate.create({
        data: {
          reportId: id,
          userId: req.user.userId,
          type: "STATUS_CHANGE",
          status,
        },
      });

      // Create audit log
      await tx.auditLog.create({
        data: {
          userId: req.user.userId,
          action: "UPDATE",
          entity: "Report",
          entityId: id,
          details: `Report status changed from ${report.status} to ${status}`,
        },
      });

      return {
        updatedReport,
        reportUpdate,
      };
    });

    return res.status(200).json({
      success: true,
      message: "Report status updated successfully",
      data: result.updatedReport,
    });
  } catch (error) {
    console.error("Update report status error:", error);

    return res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};

const confirmReport = async (req, res) => {
  try {
    const reportId = Number(req.params.id);
    const userId = req.user.userId;

    console.log("USER YANG LOGIN:", userId);

    const report = await prisma.report.findUnique({
      where: {
        id: reportId,
      },
    });

    console.log("PEMILIK LAPORAN:", report?.userId);
    console.log("STATUS LAPORAN:", report?.status);

    if (!report) {
      return res.status(404).json({
        success: false,
        message: "Report not found",
      });
    }

    // Hanya pembuat laporan yang boleh melakukan konfirmasi
    if (report.userId !== userId) {
      return res.status(403).json({
        success: false,
        message: "You are not allowed to confirm this report",
      });
    }

    // Report harus sudah selesai
    if (report.status !== "COMPLETED") {
      return res.status(400).json({
        success: false,
        message: "Report must be COMPLETED first",
      });
    }

    const updatedReport = await prisma.report.update({
      where: {
        id: reportId,
      },
      data: {
        status: "CONFIRMED",
      },
    });

    await prisma.reportUpdate.create({
      data: {
        reportId,
        userId,
        type: "STATUS_CHANGE",
        status: "CONFIRMED",
      },
    });

    await prisma.auditLog.create({
      data: {
        userId,
        action: "UPDATE",
        entity: "Report",
        entityId: reportId,
        details: `Report ${reportId} confirmed by student ${userId}`,
      },
    });

    return res.status(200).json({
      success: true,
      message: "Report confirmed successfully",
      data: updatedReport,
    });
  } catch (error) {
    console.error("Confirm report error:", error);

    return res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};

const getReportHistory = async (req, res) => {
  try {
    const reportId = Number(req.params.id);
    const userId = req.user.userId;

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

        // STUDENT hanya boleh melihat history laporan miliknya
    if (
      req.user.role === "STUDENT" &&
      report.userId !== userId
    ) {
      return res.status(403).json({
        success: false,
        message: "You are not allowed to view this report history",
      });
    }

    // TECHNICIAN hanya boleh melihat history laporan
    // yang ditugaskan kepadanya
    if (req.user.role === "TECHNICIAN") {
      const assignment = await prisma.assignment.findUnique({
        where: {
          reportId,
        },
      });

    if (!assignment || assignment.technicianId !== userId) {
      return res.status(403).json({
        success: false,
        message: "You are not assigned to this report",
      });
    }
  }

    // ADMIN boleh melihat semua history

    const history = await prisma.reportUpdate.findMany({
      where: {
        reportId,
      },
      include: {
        user: {
          select: {
            id: true,
            name: true,
            role: true,
          },
        },
      },
      orderBy: {
        createdAt: "asc",
      },
    });

    return res.status(200).json({
      success: true,
      message: "Report history retrieved successfully",
      data: history,
    });
  } catch (error) {
    console.error("Get report history error:", error);

    return res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};

const addReportNote = async (req, res) => {
  try {
    const reportId = Number(req.params.id);
    const userId = req.user.userId;
    const { note } = req.body;

    if (!note || note.trim() === "") {
      return res.status(400).json({
        success: false,
        message: "Note is required",
      });
    }

    const report = await prisma.report.findUnique({
      where: {
        id: reportId,
      },
      include: {
        assignment: true,
      },
    });

    if (!report) {
      return res.status(404).json({
        success: false,
        message: "Report not found",
      });
    }

    // STUDENT hanya boleh menambahkan note pada laporan miliknya
    if (
      req.user.role === "STUDENT" &&
      report.userId !== userId
    ) {
      return res.status(403).json({
        success: false,
        message: "You are not allowed to add a note to this report",
      });
    }

    // TECHNICIAN hanya boleh menambahkan note pada laporan
    // yang ditugaskan kepadanya
    if (
      req.user.role === "TECHNICIAN" &&
      (!report.assignment ||
        report.assignment.technicianId !== userId)
    ) {
      return res.status(403).json({
        success: false,
        message: "You are not assigned to this report",
      });
    }

    const reportNote = await prisma.reportUpdate.create({
      data: {
        reportId,
        userId,
        type: "NOTE",
        note: note.trim(),
      },
      include: {
        user: {
          select: {
            id: true,
            name: true,
            role: true,
          },
        },
      },
    });

    await prisma.auditLog.create({
      data: {
        userId,
        action: "CREATE",
        entity: "ReportUpdate",
        entityId: reportNote.id,
        details: `Added note to report ${reportId}`,
      },
    });

    return res.status(201).json({
      success: true,
      message: "Report note added successfully",
      data: reportNote,
    });
  } catch (error) {
    console.error("Add report note error:", error);

    return res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};

const getReportDetail = async (req, res) => {
  try {
    const reportId = Number(req.params.id);

    const report = await prisma.report.findUnique({
      where: {
        id: reportId,
      },
      include: {
        user: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },

        facility: {
          select: {
            id: true,
            name: true,
            location: true,
          },
        },

        images: true,

        assignment: {
          include: {
            technician: {
              select: {
                id: true,
                name: true,
                email: true,
              },
            },
          },
        },

        updates: {
          orderBy: {
            createdAt: "asc",
          },
          include: {
            user: {
              select: {
                id: true,
                name: true,
                email: true,
                role: true,
              },
            },
          },
        },
      },
    });

    if (!report) {
      return res.status(404).json({
        success: false,
        message: "Report not found",
      });
    }

    // STUDENT hanya boleh melihat laporan miliknya
    if (
      req.user.role === "STUDENT" &&
      report.user.id !== req.user.userId
    ) {
      return res.status(403).json({
        success: false,
        message: "You are not allowed to view this report",
      });
    }

    // TECHNICIAN hanya boleh melihat laporan yang ditugaskan kepadanya
    if (
      req.user.role === "TECHNICIAN" &&
      report.assignment?.technician?.id !== req.user.userId
    ) {
      return res.status(403).json({
        success: false,
        message: "You are not assigned to this report",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Report detail retrieved successfully",
      data: report,
    });
  } catch (error) {
    console.error("Get report detail error:", error);

    return res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};

module.exports = {
  createReport,
  getReports,
  getReportById,
  updateReportStatus,
  confirmReport,
  getReportHistory,
  addReportNote,
  getReportDetail, 
};