import prisma from "../lib/prisma.js";

export const uploadSharedDocument = async (data) => {
  return await prisma.sharedDocument.create({
    data,
    include: {
      uploader: {
        select: {
          id: true,
          username: true,
        },
      },
    },
  });
};

export const getAllSharedDocuments = async () => {
  return await prisma.sharedDocument.findMany({
    include: {
      uploader: {
        select: {
          id: true,
          username: true,
        },
      },
    },
    orderBy: {
      createdAt: "desc",
    },
  });
};