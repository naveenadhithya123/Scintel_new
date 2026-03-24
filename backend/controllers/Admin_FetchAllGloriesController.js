
import sequelize from "../config/database.js";
import { QueryTypes } from "sequelize";

export const fetchAllGlories = async (req, res) => {
  try {
    const glories = await sequelize.query(
      `
      SELECT 
        glorie_id,
        title,
        description,
        image_url
      FROM scintel_glories
      ORDER BY glorie_id DESC
      `,
      {
        type: QueryTypes.SELECT,
      }
    );

    return res.status(200).json({
      data: glories,
    });

  } catch (error) {
    console.error("Fetch Glories Error:", error);

    return res.status(500).json({
      message: "Internal Server Error",
      error: error.message,
    });
  }
};