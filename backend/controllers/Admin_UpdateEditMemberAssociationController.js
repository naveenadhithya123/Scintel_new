import sequelize from "../config/database.js";

export const updateAssociationMember = async (req, res) => {
  try {
    const { register_number } = req.params;

    const {
      name,
      role,
      year,
      batch_year,
    } = req.body;

    // ============================
    // VALIDATION
    // ============================

    if (!name || !role || !batch_year) {
      return res.status(400).json({
        message: "Name, Role and Batch year are required",
      });
    }

    // ============================
    // CHECK IF MEMBER EXISTS
    // ============================

    const [existing] = await sequelize.query(
      `
      SELECT register_number 
      FROM association_members
      WHERE register_number = :register_number
      `,
      {
        replacements: { register_number },
      }
    );

    if (!existing.length) {
      return res.status(404).json({
        message: "Member not found",
      });
    }

    // ============================
    // UPDATE QUERY
    // ============================

    await sequelize.query(
      `
      UPDATE association_members SET
        name = :name,
        role = :role,
        year = :year,
        batch_year = :batch_year
      WHERE register_number = :register_number
      `,
      {
        replacements: {
          register_number,
          name,
          role,
          year: year || null,
          batch_year,
        },
      }
    );

    // ============================
    // RESPONSE
    // ============================

    return res.status(200).json({
      message: "Member updated successfully",
    });

  } catch (error) {
    console.error("Update Member Error:", error);

    return res.status(500).json({
      message: "Internal Server Error",
      error: error.message,
    });
  }
};