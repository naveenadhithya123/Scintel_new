import sequelize from "../config/database.js";
import { QueryTypes } from "sequelize";

export const deleteSpecificActivity = async (req, res) => {
  try {
    const { id } = req.params;

    // ============================
    // VALIDATION
    // ============================

    if (!id) {
      return res.status(400).json({
        message: "Activity ID is required",
      });
    }

    // ============================
    // CHECK IF ACTIVITY EXISTS
    // ============================

    const [activity] = await sequelize.query(
      `
      SELECT activity_id
      FROM activities
      WHERE activity_id = :id
      `,
      {
        replacements: { id },
        type: QueryTypes.SELECT,
      }
    );

    if (!activity) {
      return res.status(404).json({
        message: "Activity not found",
      });
    }

    // ============================
    // DELETE ACTIVITY
    // ============================

    await sequelize.query(
      `
      DELETE FROM activities
      WHERE activity_id = :id
      `,
      {
        replacements: { id },
      }
    );

    // ============================
    // RESPONSE
    // ============================

    return res.status(200).json({
      message: "Activity deleted successfully",
    });

  } catch (error) {
    console.error("Delete Activity Error:", error);

    return res.status(500).json({
      message: "Internal Server Error",
      error: error.message,
    });
  }
};