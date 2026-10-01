const prisma = require("./prisma");

const createAuditLog = async ({
  userId,
  action,
  entity,
  entityId,
  details,
}) => {
  return await prisma.auditLog.create({
    data: {
      userId,
      action,
      entity,
      entityId,
      details: details || null,
    },
  });
};

module.exports = {
  createAuditLog,
};