import sequelize from "../config/database.js";
import { QueryTypes } from "sequelize";

export const fetchSpecificProblemRequest = async (req, res) => {
  try {
    const { id } = req.params;

    const [request] = await sequelize.query(
      `
      SELECT 
        problem_creation_request_id,
        name,
        email,
        phone_number,
        year,
        section,
        title,
        category,
        short_description,
        detailed_description
      FROM problem_creation_requests
      WHERE problem_creation_request_id = :id
      `,
      {
        replacements: { id },
        type: QueryTypes.SELECT,
      }
    );

    // ============================
    // NOT FOUND
    // ============================

    if (!request) {
      return res.status(404).json({
        message: "Problem request not found",
      });
    }

    // ============================
    // RESPONSE
    // ============================

    return res.status(200).json({
      data: request,
    });

  } catch (error) {
    console.error("Fetch Specific Problem Request Error:", error);

    return res.status(500).json({
      message: "Internal Server Error",
      error: error.message,
    });
  }
};