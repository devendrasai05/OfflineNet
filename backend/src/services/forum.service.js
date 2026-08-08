import prisma from "../lib/prisma.js";

export const createPost = async ({ authorId, content }) => {
  return await prisma.post.create({
    data: {
      authorId,
      content,
    },
    include: {
      author: {
        select: {
          id: true,
          username: true,
        },
      },
      _count: {
        select: {
          likes: true,
          comments: true,
        },
      },
    },
  });
};

export const getPosts = async () => {
  return await prisma.post.findMany({
    include: {
      author: {
        select: {
          id: true,
          username: true,
        },
      },
      comments: {
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
      },
      likes: {
        select: {
          userId: true,
        },
      },
      _count: {
        select: {
          likes: true,
          comments: true,
        },
      },
    },
    orderBy: {
      createdAt: "desc",
    },
  });
};

export const toggleLike = async (postId, userId) => {
  const existingLike = await prisma.postLike.findUnique({
    where: {
      postId_userId: {
        postId,
        userId,
      },
    },
  });

  if (existingLike) {
    await prisma.postLike.delete({
      where: {
        postId_userId: {
          postId,
          userId,
        },
      },
    });

    return {
      liked: false,
    };
  }

  await prisma.postLike.create({
    data: {
      postId,
      userId,
    },
  });

  return {
    liked: true,
  };
};

export const editPost = async (postId, userId, content) => {
  const post = await prisma.post.findUnique({
    where: {
      id: postId,
    },
  });

  if (!post) {
    throw new Error("Post not found");
  }

  if (post.authorId !== userId) {
    throw new Error("Unauthorized");
  }

  return await prisma.post.update({
    where: {
      id: postId,
    },
    data: {
      content,
    },
    include: {
      author: {
        select: {
          id: true,
          username: true,
        },
      },
      comments: {
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
      },
      likes: {
        select: {
          userId: true,
        },
      },
      _count: {
        select: {
          likes: true,
          comments: true,
        },
      },
    },
  });
};

export const deletePost = async (postId, userId) => {
  const post = await prisma.post.findUnique({
    where: {
      id: postId,
    },
  });

  if (!post) {
    throw new Error("Post not found");
  }

  if (post.authorId !== userId) {
    throw new Error("Unauthorized");
  }

  await prisma.post.delete({
    where: {
      id: postId,
    },
  });

  return {
    success: true,
  };
};
