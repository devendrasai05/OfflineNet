import { getAllUsers } from "../services/user.service.js";

export const getUsers = async (req, res) => {
  try {
    const users = await getAllUsers(req.user.id);

    res.status(200).json({
      success: true,
      users,
    });
  } catch (error) {
    console.error(error);

    res.status(500).json({
      success: false,
      message: "Failed to fetch users",
    });
  }
};