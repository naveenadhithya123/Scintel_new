import sequelize from "../config/database.js";
import { QueryTypes } from "sequelize";

export const deleteAssociationMember = async (req, res) => {
  try {
    const { register_number } = req.params;

    // ============================
    // CHECK IF MEMBER EXISTS
    // ============================

    const [member] = await sequelize.query(
      `
      SELECT register_number 
      FROM association_members
      WHERE register_number = :register_number
      `,
      {
        replacements: { register_number },
        type: QueryTypes.SELECT,
      }
    );

    if (!member) {
      return res.status(404).json({
        message: "Member not found",
      });
    }

    // ============================
    // DELETE QUERY
    // ============================

    await sequelize.query(
      `
      DELETE FROM association_members
      WHERE register_number = :register_number
      `,
      {
        replacements: { register_number },
      }
    );

    // ============================
    // RESPONSE
    // ============================

    return res.status(200).json({
      message: "Member deleted successfully",
    });

  } catch (error) {
    console.error("Delete Member Error:", error);

    return res.status(500).json({
      message: "Internal Server Error",
      error: error.message,
    });
  }
};