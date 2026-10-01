const prisma = require("../utils/prisma");

const createAuditLog = async (req, res) => {
  try {
    const { action, entity, entityId, details } = req.body;
    console.log("REQ USER:", req.user);

    if (!action || !entity || !entityId) {
      return res.status(400).json({
        success: false,
        message: "action, entity, and entityId are required",
      });
    }

    const auditLog = await prisma.auditLog.create({
      data: {
        userId: req.user.userId,
        action,
        entity,
        entityId: Number(entityId),
        details: details || null,
      },
    });

    return res.status(201).json({
      success: true,
      message: "Audit log created successfully",
      data: auditLog,
    });
  } catch (error) {
    console.error(error);

    return res.status(500).json({
      success: false,
      message: "Failed to create audit log",
    });
  }
};

const getAuditLogs = async (req, res) => {
  try {
    const auditLogs = await prisma.auditLog.findMany({
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
      orderBy: {
        createdAt: "desc",
      },
    });

    return res.status(200).json({
      success: true,
      message: "Audit logs retrieved successfully",
      data: auditLogs,
    });
  } catch (error) {
    console.error(error);

    return res.status(500).json({
      success: false,
      message: "Failed to get audit logs",
    });
  }
};

module.exports = {
  createAuditLog,
  getAuditLogs,
};