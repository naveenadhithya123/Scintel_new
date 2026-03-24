import sequelize from "../config/database.js";
import { QueryTypes } from "sequelize";

export const fetchSpecificMember = async (req, res) => {
  try {
    const { register_number } = req.params;

    const [member] = await sequelize.query(
      `
      SELECT 
        register_number,
        name,
        role,
        year,
        batch_year
      FROM association_members
      WHERE register_number = :register_number
      `,
      {
        replacements: { register_number },
        type: QueryTypes.SELECT,
      }
    );

    // ============================
    // NOT FOUND
    // ============================

    if (!member) {
      return res.status(404).json({
        message: "Member not found",
      });
    }

    // ============================
    // RESPONSE
    // ============================

    return res.status(200).json({
      data: member,
    });

  } catch (error) {
    console.error("Fetch Member Error:", error);

    return res.status(500).json({
      message: "Internal Server Error",
      error: error.message,
    });
  }
};