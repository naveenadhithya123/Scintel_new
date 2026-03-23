import sequelize from "../config/database.js";
import { QueryTypes } from "sequelize";

export const fetchAllProblemTitles = async (req, res) => {
  try {
    const problems = await sequelize.query(
      `
      SELECT 
        problem_id,
        title,
        CASE 
          WHEN solver_user_id IS NOT NULL THEN 'In Progress'
          ELSE 'Open to Build'
        END AS status
      FROM current_problems
      ORDER BY problem_id DESC
      `,
      {
        type: QueryTypes.SELECT,
      }
    );

    return res.status(200).json({
      data: problems,
    });

  } catch (error) {
    console.error("Fetch Problems Error:", error);

    return res.status(500).json({
      message: "Internal Server Error",
      error: error.message,
    });
  }
};