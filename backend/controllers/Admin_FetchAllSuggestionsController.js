import sequelize from "../config/database.js";
import { QueryTypes } from "sequelize";

export const fetchAllSuggestions = async (req, res) => {
  try {

    const suggestions = await sequelize.query(
      `
      SELECT 
        s.suggestion_id,
        s.title,
        s.category,
        u.name,
        u.year
      FROM suggestions s
      JOIN users u
      ON s.user_id = u.user_id
      ORDER BY s.date DESC
      `,
      {
        type: QueryTypes.SELECT,
      }
    );

    return res.status(200).json({
      data: suggestions,
    });

  } catch (error) {
    console.error("Fetch Suggestions Error:", error);

    return res.status(500).json({
      message: "Internal Server Error",
      error: error.message,
    });
  }
};