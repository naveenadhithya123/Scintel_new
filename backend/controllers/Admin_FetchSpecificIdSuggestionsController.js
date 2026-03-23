import sequelize from "../config/database.js";
import { QueryTypes } from "sequelize";

export const fetchSpecificSuggestion = async (req, res) => {
  try {
    const { id } = req.params;

    const [result] = await sequelize.query(
      `
      SELECT 
        s.suggestion_id,
        s.title,
        s.description,
        s.category,
        s.priority,
        s.type,
        s.proof_url,

        u.name,
        u.email,
        u.phone_number,
        u.year,
        u.section

      FROM suggestions s
      JOIN users u
      ON s.user_id = u.user_id

      WHERE s.suggestion_id = :id
      `,
      {
        replacements: { id },
        type: QueryTypes.SELECT,
      }
    );

    if (!result) {
      return res.status(404).json({
        message: "Suggestion not found",
      });
    }

    return res.status(200).json({
      data: result,
    });

  } catch (error) {
    console.error("Fetch Specific Suggestion Error:", error);

    return res.status(500).json({
      message: "Internal Server Error",
      error: error.message,
    });
  }
};