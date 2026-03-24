import sequelize from "../config/database.js";
import { QueryTypes } from "sequelize";

export const fetchSpecificProblem = async (req, res) => {
  try {
    const { id } = req.params;

    const [problem] = await sequelize.query(
      `
      SELECT 
        problem_id,
        title,
        category,
        short_description,
        detailed_description,
        creator_user_id,
        solver_user_id,
        mentor,
        CASE 
          WHEN solver_user_id IS NOT NULL THEN 'In Progress'
          ELSE 'Open to Build'
        END AS status
      FROM current_problems
      WHERE problem_id = :id
      `,
      {
        replacements: { id },
        type: QueryTypes.SELECT,
      }
    );

    // ============================
    // NOT FOUND
    // ============================

    if (!problem) {
      return res.status(404).json({
        message: "Problem not found",
      });
    }

    // ============================
    // RESPONSE
    // ============================

    return res.status(200).json({
      data: problem,
    });

  } catch (error) {
    console.error("Fetch Specific Problem Error:", error);

    return res.status(500).json({
      message: "Internal Server Error",
      error: error.message,
    });
  } };