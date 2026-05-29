import { getDashboardStats } from "../../modules/stats.service.js";
import { errorResponse, successResponse } from "../../utils/response.js";

export const getStatsHandler = async (req, res) => {
  try {
    const stats = await getDashboardStats();
    return successResponse(res, stats, "Dashboard stats retrieved", 200);
  } catch (error) {
    return errorResponse(res, "Error retrieving stats", 500, error.message);
  }
};
