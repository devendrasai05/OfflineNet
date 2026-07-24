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

export const getSidebarConversations = async (currentUserId) => {
  const users = await prisma.user.findMany({
    where: {
      id: {
        not: currentUserId,
      },
    },
    select: {
      id: true,
      username: true,
      email: true,
    },
    orderBy: {
      username: "asc",
    },
  });

  const sidebarUsers = await Promise.all(
    users.map(async (user) => {
      const lastMessage = await prisma.message.findFirst({
        where: {
          OR: [
            {
              senderId: currentUserId,
              receiverId: user.id,
            },
            {
              senderId: user.id,
              receiverId: currentUserId,
            },
          ],
        },
        orderBy: {
          createdAt: "desc",
        },
      });

      return {
        ...user,
        lastMessage: lastMessage?.message ?? null,
        lastMessageSenderId: lastMessage?.senderId ?? null,
        lastMessageTime: lastMessage?.createdAt ?? null,
      };
    })
  );

  return sidebarUsers;
};

export const markMessagesAsSeen = async (senderId, receiverId) => {
  return await prisma.message.updateMany({
    where: {
      senderId,
      receiverId,
      seen: false,
    },
    data: {
      seen: true,
    },
  });
};