import sequelize from "../config/database.js";

const VALID_YEARS = new Set(["I", "II", "III", "IV"]);

export const addAssociationMember = async (req, res) => {
  try {
    const {
      phone_number,
      register_number,
      name,
      role,
      year,
      batch_year,
    } = req.body;

    const finalPhoneNumber = phone_number || register_number;

    if (!finalPhoneNumber || !name || !role || !year || !batch_year) {
      return res.status(400).json({
        message: "Phone number, Name, Role, Year and Batch year are required",
      });
    }

    if (!VALID_YEARS.has(year)) {
      return res.status(400).json({
        message: "Year must be one of I, II, III or IV",
      });
    }

    const [result] = await sequelize.query(
      `
      INSERT INTO association_members
      (phone_number, name, batch_year, role, year)
      VALUES
      (:phone_number, :name, :batch_year, :role, :year)
      RETURNING member_id, phone_number, name, batch_year, role, year
      `,
      {
        replacements: {
          phone_number: finalPhoneNumber,
          name,
          batch_year,
          role,
          year,
        },
      }
    );

    return res.status(201).json({
      message: "Member added successfully",
      data: {
        ...result[0],
        register_number: result[0].phone_number,
      },
    });
  } catch (error) {
    console.error("Add Member Error:", error);

    return res.status(500).json({
      message: "Internal Server Error",
      error: error.message,
    });
  }
};
