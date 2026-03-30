import sequelize from "../config/database.js";

const VALID_YEARS = new Set(["I", "II", "III", "IV"]);

export const updateAssociationMember = async (req, res) => {
  try {
    const { id } = req.params;

    const {
      phone_number,
      register_number,
      name,
      role,
      year,
      batch_year,
    } = req.body;

    const finalPhoneNumber = phone_number || register_number;

    // ============================
    // VALIDATION
    // ============================

    if (!finalPhoneNumber || !name || !role || !batch_year || !year) {
      return res.status(400).json({
        message: "Phone number, Name, Role, Year and Batch year are required",
      });
    }

    if (!VALID_YEARS.has(year)) {
      return res.status(400).json({
        message: "Year must be one of I, II, III or IV",
      });
    }

    // ============================
    // CHECK IF MEMBER EXISTS
    // ============================

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

    // ============================
    // UPDATE QUERY
    // ============================

    await sequelize.query(
      `
      UPDATE association_members SET
        phone_number = :phone_number,
        name = :name,
        role = :role,
        year = :year,
        batch_year = :batch_year
      WHERE member_id = :id
      `,
      {
        replacements: {
          id,
          phone_number: finalPhoneNumber,
          name,
          role,
          year,
          batch_year,
        },
      }
    );

    // ============================
    // RESPONSE
    // ============================

    return res.status(200).json({
      message: "Member updated successfully",
      data: {
        member_id: Number(id),
        phone_number: finalPhoneNumber,
        register_number: finalPhoneNumber,
        name,
        role,
        year,
        batch_year,
      },
    });

  } catch (error) {
    console.error("Update Member Error:", error);

    return res.status(500).json({
      message: "Internal Server Error",
      error: error.message,
    });
  }
};
