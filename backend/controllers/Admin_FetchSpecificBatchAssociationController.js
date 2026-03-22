import sequelize from "../config/database.js";
import { QueryTypes } from "sequelize";

export const fetchSpecificBatch = async (req, res) => {
  try {
    const { id } = req.params;

    const [batch] = await sequelize.query(
      `
      SELECT 
        batch_id,
        batch_year,
        title,
        description,
        image_url
      FROM association_batch
      WHERE batch_id = :id
      `,
      {
        replacements: { id },
        type: QueryTypes.SELECT,
      }
    );

    // ============================
    // NOT FOUND
    // ============================

    if (!batch) {
      return res.status(404).json({
        message: "Batch not found",
      });
    }

    // ============================
    // RESPONSE
    // ============================

    return res.status(200).json({
      data: batch,
    });

  } catch (error) {
    console.error("Fetch Batch Error:", error);

    return res.status(500).json({
      message: "Internal Server Error",
      error: error.message,
    });
  }
};