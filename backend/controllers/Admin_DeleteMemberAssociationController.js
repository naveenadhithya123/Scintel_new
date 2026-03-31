import sequelize from "../config/database.js";

export const deleteAssociationMember = async (req, res) => {
  try {
    const { id } = req.params;

    const [existing] = await sequelize.query(
      `
      SELECT member_id
      FROM association_members
      WHERE member_id = :id
      `,
      {
        replacements: { id },
      }
    );

    if (!existing.length) {
      return res.status(404).json({
        message: "Member not found",
      });
    }

    await sequelize.query(
      `
      DELETE FROM association_members
      WHERE member_id = :id
      `,
      {
        replacements: { id },
      }
    );

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
