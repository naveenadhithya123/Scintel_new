import sequelize from "../config/database.js";

const getTableColumns = async (tableName) => {
  const [rows] = await sequelize.query(
    `
      SELECT column_name
      FROM information_schema.columns
      WHERE table_schema = 'public' AND table_name = :tableName
    `,
    {
      replacements: { tableName }
    }
  );

  return new Set(rows.map((row) => row.column_name));
};

const insertIntoTable = async (tableName, values) => {
  const supportedColumns = await getTableColumns(tableName);
  const entries = Object.entries(values).filter(
    ([column, value]) => supportedColumns.has(column) && value !== undefined
  );

  if (!entries.length) {
    throw new Error(`No matching columns found for ${tableName}`);
  }

  const columns = entries.map(([column]) => column);
  const replacements = Object.fromEntries(entries.map(([column, value]) => [column, value]));
  const placeholders = columns.map((column) => `:${column}`);

  const [data] = await sequelize.query(
    `
      INSERT INTO ${tableName} (${columns.join(", ")})
      VALUES (${placeholders.join(", ")})
      RETURNING *
    `,
    { replacements }
  );

  return data[0];
};

export const addCelebration = async (req, res) => {
  try {
    const {
      title,
      description,
      short_description,   
      start_date,
      end_date,
      faculty_contact,
      student_contact,
    } = req.body;

    const fileUrl = req.file?.path;

    if (!fileUrl) {
      return res.status(400).json({ message: "File upload failed" });
    }

    const data = await insertIntoTable("upcoming_celebrations", {
      event_title: title,
      event_description: description || null,
      short_description: short_description || null,
      brochure_url: fileUrl,
      start_date: start_date || null,
      end_date: end_date || null,
      faculty_contact: faculty_contact || null,
      student_contact: student_contact || null,
    });

    res.status(201).json({
      message: "Celebration added successfully",
      data,
    });

  } catch (error) {
    console.error("Add celebration error:", error);
    res.status(500).json({ message: error.message || "Server error" });
  }
};
