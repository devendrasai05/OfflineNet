import prisma from "../lib/prisma.js";

export const createMessage = async ({ senderId, receiverId, message }) => {
  return await prisma.message.create({
    data: {
      senderId,
      receiverId,
      message,
    },
  });
};

export const getConversation = async (user1Id, user2Id) => {
  return await prisma.message.findMany({
    where: {
      OR: [
        {
          senderId: user1Id,
          receiverId: user2Id,
        },
        {
          senderId: user2Id,
          receiverId: user1Id,
        },
      ],
    },
    orderBy: {
      createdAt: "asc",
    },
  });
};