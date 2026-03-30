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
    // INSERT QUERY
    // ============================

    await sequelize.query(
      `
      INSERT INTO association_members
      (phone_number, name, batch_year, role, year)
      VALUES (:phone_number, :name, :batch_year, :role, :year)
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

    // ============================
    // RESPONSE
    // ============================

    return res.status(201).json({
      message: "Member added successfully",
      data: {
        phone_number: finalPhoneNumber,
        register_number: finalPhoneNumber,
        name,
        role,
        year,
        batch_year,
      },
    });

  } catch (error) {
    console.error("Add Member Error:", error);

    // Handle duplicate phone_number
    if (error.name === "SequelizeUniqueConstraintError") {
      return res.status(400).json({
        message: "Member with this phone number already exists",
      });
    }

    return res.status(500).json({
      message: "Internal Server Error",
      error: error.message,
    });
  }
};
