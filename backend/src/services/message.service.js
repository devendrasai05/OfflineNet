import prisma from "../lib/prisma.js";

export const createMessage = async ({
  senderId,
  receiverId,
  message,
  replyToId = null,
}) => {
  return await prisma.message.create({
    data: {
      senderId,
      receiverId,
      message,
      replyToId,
    },
    include: {
      replyTo: true,
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
    include: {
      replyTo: {
        select: {
          id: true,
          message: true,
          senderId: true,
          deleted: true,
        },
      },
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

      const unreadCount = await prisma.message.count({
        where: {
          senderId: user.id,
          receiverId: currentUserId,
          seen: false,
        },
      });

      return {
        ...user,
        lastMessage: lastMessage?.message ?? null,
        lastMessageSenderId: lastMessage?.senderId ?? null,
        lastMessageTime: lastMessage?.createdAt ?? null,
        unreadCount,
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

export const editMessage = async ({ messageId, userId, message }) => {
  const existingMessage = await prisma.message.findUnique({
    where: {
      id: messageId,
    },
  });

  if (!existingMessage) {
    throw new Error("Message not found");
  }

  if (existingMessage.senderId !== userId) {
    throw new Error("You can only edit your own messages");
  }

  return await prisma.message.update({
    where: {
      id: messageId,
    },
    data: {
      message,
      edited: true,
    },
  });
};

export const deleteMessage = async ({ messageId, userId }) => {
  const existingMessage = await prisma.message.findUnique({
    where: {
      id: messageId,
    },
  });

  if (!existingMessage) {
    throw new Error("Message not found");
  }

  if (existingMessage.senderId !== userId) {
    throw new Error("You can only delete your own messages");
  }

  if (existingMessage.deleted) {
    throw new Error("Message has already been deleted");
  }

  return await prisma.message.update({
    where: {
      id: messageId,
    },
    data: {
      deleted: true,
      deletedAt: new Date(),
      message: "This message was deleted.",
      edited: false,
    },
  });
};