import sequelize from "../config/database.js";
import { QueryTypes } from "sequelize";

export const getActivityById = async (req, res) => {
  try {
    const { id } = req.params;

    const result = await sequelize.query(
      `SELECT * FROM activities WHERE activity_id = :id`,
      {
        replacements: { id },
        type: QueryTypes.SELECT,
      }
    );

    const activity = result[0];

    if (!activity) {
      return res.status(404).json({
        message: "Activity not found",
      });
    }

    // Replace null values with "Not Applicable"
    const formattedResult = {};

    for (let key in activity) {
      formattedResult[key] =
        activity[key] === null ? "Not Applicable" : activity[key];
    }

    res.status(200).json(formattedResult);
  } catch (error) {
    console.error("Error fetching activity:", error);
    res.status(500).json({
      message: "Internal Server Error",
    });
  }
};
