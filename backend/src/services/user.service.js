import prisma from "../lib/prisma.js";

export const getAllUsers = async (currentUserId) => {
  return await prisma.user.findMany({
    where: {
      id: {
        not: currentUserId,
      },
    },
    select: {
      id: true,
      username: true,
      email: true,
      role: true,
    },
    orderBy: {
      username: "asc",
    },
  });
};