import sequelize from "../config/database.js";

export const addAssociationMember = async (req, res) => {
  try {
    const {
      register_number,
      name,
      role,
      year,
      batch_year,
    } = req.body;

    // ============================
    // VALIDATION
    // ============================

    if (!register_number || !name || !role || !batch_year) {
      return res.status(400).json({
        message: "Register number, Name, Role and Batch year are required",
      });
    }

    // ============================
    // INSERT QUERY
    // ============================

    await sequelize.query(
      `
      INSERT INTO association_members
      (register_number, name, batch_year, role, year)
      VALUES (:register_number, :name, :batch_year, :role, :year)
      `,
      {
        replacements: {
          register_number,
          name,
          batch_year,
          role,
          year: year || null,
        },
      }
    );

    // ============================
    // RESPONSE
    // ============================

    return res.status(201).json({
      message: "Member added successfully",
    });

  } catch (error) {
    console.error("Add Member Error:", error);

    // Handle duplicate register_number
    if (error.name === "SequelizeUniqueConstraintError") {
      return res.status(400).json({
        message: "Member with this register number already exists",
      });
    }

    return res.status(500).json({
      message: "Internal Server Error",
      error: error.message,
    });
  }
};