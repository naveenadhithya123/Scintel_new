import sequelize from "../config/database.js";
import { QueryTypes } from "sequelize";

export const fetchSpecificGlory = async (req, res) => {
  try {
    const { id } = req.params;

    const [glory] = await sequelize.query(
      `
      SELECT 
        glorie_id,
        title,
        description,
        image_url
      FROM scintel_glories
      WHERE glorie_id = :id
      `,
      {
        replacements: { id },
        type: QueryTypes.SELECT,
      }
    );

    if (!glory) {
      return res.status(404).json({
        message: "Glory not found",
      });
    }

    return res.status(200).json({
      data: glory,
    });

  } catch (error) {
    console.error("Fetch Specific Glory Error:", error);

    return res.status(500).json({
      message: "Internal Server Error",
      error: error.message,
    });
  }
};