import fs from "fs";
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

export const deleteSharedDocument=async(documentId,user)=>{
    const document=await prisma.sharedDocument.findUnique({
        where:{id:documentId},
    });

    if(!document)
        throw new Error("Document not found.");

    if(document.uploaderId!==user.id&&user.role!=="ADMIN")
        throw new Error("Unauthorized.");

    if(fs.existsSync(document.filePath))
        fs.unlinkSync(document.filePath);

    await prisma.sharedDocument.delete({
        where:{id:documentId},
    });
};