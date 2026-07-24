import {
  getConversation,
  getSidebarConversations,
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