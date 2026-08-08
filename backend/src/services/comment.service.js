import prisma from "../lib/prisma.js";

export const createComment = async (postId, authorId, content) => {
  return prisma.comment.create({
    data: {
      content,
      postId,
      authorId,
    },
    include: {
      author: {
        select: {
          id: true,
          username: true,
        },
      },
    },
  });
};

export const getComments = async (postId) => {
  return prisma.comment.findMany({
    where: {
      postId,
    },
    include: {
      author: {
        select: {
          id: true,
          username: true,
        },
      },
    },
    orderBy: {
      createdAt: "asc",
    },
  });
};

export const editComment = async (
  commentId,
  authorId,
  content
) => {
  const comment = await prisma.comment.findUnique({
    where: {
      id: commentId,
    },
  });

  if (!comment) {
    throw new Error("Comment not found");
  }

  if (comment.authorId !== authorId) {
    throw new Error("Unauthorized");
  }

  return await prisma.comment.update({
    where: {
      id: commentId,
    },
    data: {
      content,
      edited: true,
    },
    include: {
      author: {
        select: {
          id: true,
          username: true,
        },
      },
    },
  });
};

export const deleteComment = async (
  commentId,
  authorId
) => {
  const comment = await prisma.comment.findUnique({
    where: {
      id: commentId,
    },
  });

  if (!comment) {
    throw new Error("Comment not found");
  }

  if (comment.authorId !== authorId) {
    throw new Error("Unauthorized");
  }

  await prisma.comment.delete({
    where: {
      id: commentId,
    },
  });

  return {
    success: true,
  };
};