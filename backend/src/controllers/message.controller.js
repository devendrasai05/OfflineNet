import { getIO } from "../socket/socket.js";

import {
  getConversation,
  getSidebarConversations,
  editMessage,
  deleteMessage,
} from "../services/message.service.js";

export const getMessages = async (req, res) => {
  try {
    const senderId = req.user.id;
    const receiverId = Number(req.params.userId);

    const messages = await getConversation(senderId, receiverId);

    res.status(200).json({
      success: true,
      messages,
    });
  } catch (error) {
    console.error(error);

    res.status(500).json({
      success: false,
      message: "Failed to fetch messages",
    });
  }
};

export const getSidebar = async (req, res) => {
  try {
    const sidebar = await getSidebarConversations(req.user.id);

    res.status(200).json({
      success: true,
      sidebar,
    });
  } catch (error) {
    console.error(error);

    res.status(500).json({
      success: false,
      message: "Failed to fetch sidebar conversations",
    });
  }
};

export const updateMessage = async (req, res) => {
  try {
    const messageId = Number(req.params.id);
    const userId = req.user.id;
    const { message } = req.body;

    if (!message || !message.trim()) {
      return res.status(400).json({
        success: false,
        message: "Message cannot be empty",
      });
    }

    const updatedMessage = await editMessage({
  messageId,
  userId,
  message: message.trim(),
});



// Notify all connected clients
const io = getIO();

io.emit("message-edited", updatedMessage);

res.status(200).json({
  success: true,
  message: "Message updated successfully",
  data: updatedMessage,
});
  } catch (error) {
    console.error(error);

    if (
      error.message === "Message not found" ||
      error.message === "You can only edit your own messages"
    ) {
      return res.status(403).json({
        success: false,
        message: error.message,
      });
    }

    res.status(500).json({
      success: false,
      message: "Failed to update message",
    });
  }
};


export const removeMessage = async (req, res) => {
  try {
    const messageId = Number(req.params.id);
    const userId = req.user.id;

    const deletedMessage = await deleteMessage({
      messageId,
      userId,
    });

    // Notify all connected clients
    const io = getIO();

    io.emit("message-deleted", deletedMessage);

    res.status(200).json({
      success: true,
      message: "Message deleted successfully",
      data: deletedMessage,
    });
  } catch (error) {
    console.error(error);

    if (
      error.message === "Message not found" ||
      error.message === "You can only delete your own messages" ||
      error.message === "Message has already been deleted"
    ) {
      return res.status(403).json({
        success: false,
        message: error.message,
      });
    }

    res.status(500).json({
      success: false,
      message: "Failed to delete message",
    });
  }
};