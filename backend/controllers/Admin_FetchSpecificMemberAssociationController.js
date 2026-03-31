import sequelize from "../config/database.js";

export const fetchSpecificMember = async (req, res) => {
  try {
    const { id } = req.params;

    const [result] = await sequelize.query(
      `
      SELECT
        member_id,
        phone_number,
        name,
        batch_year,
        role,
        year
      FROM association_members
      WHERE member_id = :id
      `,
      {
        replacements: { id },
      }
    );

    if (!result.length) {
      return res.status(404).json({
        message: "Member not found",
      });
    }

    return res.status(200).json({
      message: "Member fetched successfully",
      data: {
        ...result[0],
        register_number: result[0].phone_number,
      },
    });
  } catch (error) {
    console.error("Fetch Specific Member Error:", error);

    return res.status(500).json({
      message: "Internal Server Error",
      error: error.message,
    });
  }
};
