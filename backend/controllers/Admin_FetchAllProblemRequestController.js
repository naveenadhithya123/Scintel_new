import sequelize from "../config/database.js";
import { QueryTypes } from "sequelize";

export const fetchAllProblemRequests = async (req, res) => {
  try {
    const requests = await sequelize.query(
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
      ORDER BY problem_creation_request_id DESC
      `,
      {
        type: QueryTypes.SELECT,
      }
    );

    return res.status(200).json({
      data: requests,
    });

  } catch (error) {
    console.error("Fetch Problem Requests Error:", error);

    return res.status(500).json({
      message: "Internal Server Error",
      error: error.message,
    });
  }
};