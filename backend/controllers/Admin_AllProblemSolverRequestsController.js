import sequelize from "../config/database.js";
import { QueryTypes } from "sequelize";

export const fetchAllProblemSolverRequests = async (req, res) => {
  try {

    // ============================
    // JOIN QUERY
    // ============================

    const data = await sequelize.query(
      `
      SELECT
        psr.problem_solver_request_id,
        cp.title,
        cp.category,
        psr.name,
        psr.year
      FROM problem_solver_requests psr
      JOIN current_problems cp
        ON psr.problem_id = cp.problem_id
      ORDER BY psr.problem_solver_request_id DESC
      `,
      {
        type: QueryTypes.SELECT,
      }
    );

    return res.status(200).json({
      message: "Problem solver requests fetched successfully",
      data,
    });

  } catch (error) {
    console.error("Fetch Problem Solver Requests Error:", error);

    return res.status(500).json({
      message: "Internal Server Error",
      error: error.message,
    });
  }
};