import { getAdminStats } from "../services/admin.service.js";

export const getStats = async (req, res) => {
  try {
    const stats = await getAdminStats();

    res.status(200).json(stats);
  } catch (error) {
    console.error("Admin stats error:", error);

    res.status(500).json({
      message: "Failed to load admin statistics.",
    });
  }
};