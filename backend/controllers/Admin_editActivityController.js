import sequelize from "../config/database.js";

export const getActivityById = async (req, res) => {
  try {
    const { id } = req.params;

    const [result] = await sequelize.query(
      `SELECT * FROM activities WHERE activity_id = :id`,
      {
        replacements: { id },
        type: sequelize.QueryTypes.SELECT,
      }
    );

    if (!result) {
      return res.status(404).json({
        message: "Activity not found",
      });
    }

    // Replace null values with "Not Applicable"
    const formattedResult = {};

    for (let key in result) {
      formattedResult[key] =
        result[key] === null ? "Not Applicable" : result[key];
    }

    res.status(200).json(formattedResult);
  } catch (error) {
    console.error("Error fetching activity:", error);
    res.status(500).json({
      message: "Internal Server Error",
    });
  }
};