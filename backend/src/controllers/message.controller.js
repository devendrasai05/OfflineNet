import { getConversation } from "../services/message.service.js";

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