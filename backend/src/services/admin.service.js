import prisma from "../lib/prisma.js";

export const getAdminStats = async () => {
  const [users, messages, sharedDocuments] = await Promise.all([
    prisma.user.count(),
    prisma.message.count({
      where: {
        deleted: false,
      },
    }),
    prisma.sharedDocument.count(),
  ]);

  return {
    users,
    messages,
    sharedDocuments,
    systemStatus: "Online",
  };
};