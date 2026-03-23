import sequelize from "../config/database.js";
import { QueryTypes } from "sequelize";

export const deleteActivitiesByBatch = async (req, res) => {
  try {
    const { batch } = req.params;

    // ============================
    // VALIDATION
    // ============================

    if (!batch) {
      return res.status(400).json({
        message: "Batch is required",
      });
    }

    // ============================
    // CHECK IF BATCH EXISTS
    // ============================

    const existing = await sequelize.query(
      `
      SELECT activity_id
      FROM activities
      WHERE batch = :batch
      `,
      {
        replacements: { batch },
        type: QueryTypes.SELECT,
      }
    );

    if (existing.length === 0) {
      return res.status(404).json({
        message: "No activities found for this batch",
      });
    }

    // ============================
    // DELETE ALL ROWS WITH THIS BATCH
    // ============================

    await sequelize.query(
      `
      DELETE FROM activities
      WHERE batch = :batch
      `,
      {
        replacements: { batch },
      }
    );

    // ============================
    // RESPONSE
    // ============================

    return res.status(200).json({
      message: `All activities for batch ${batch} deleted successfully`,
    });

  } catch (error) {
    console.error("Delete Batch Activities Error:", error);

    return res.status(500).json({
      message: "Internal Server Error",
      error: error.message,
    });
  }
};