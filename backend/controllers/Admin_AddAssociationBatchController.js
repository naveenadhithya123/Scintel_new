import sequelize from "../config/database.js";

export const addAssociationBatch = async (req, res) => {
  try {
    const { batch_year, title, description } = req.body;

    // ============================
    // VALIDATION
    // ============================

    if (!batch_year || !title || !description) {
      return res.status(400).json({
        message: "Batch year, Title and Description are required",
      });
    }

    // ============================
    // IMAGE HANDLING
    // ============================

    let image_url = null;

    if (req.file) {
      image_url = req.file.path;
    }

    // ============================
    // INSERT QUERY
    // ============================

    const result = await sequelize.query(
      `
      INSERT INTO association_batch
      (batch_year, title, description, image_url)
      VALUES (:batch_year, :title, :description, :image_url)
      RETURNING *
      `,
      {
        replacements: {
          batch_year,
          title,
          description,
          image_url,
        },
      }
    );

    // ============================
    // SAFE RESPONSE HANDLING
    // ============================

    const insertedData = result?.[0]?.[0] || null;

    return res.status(201).json({
      message: "Association batch added successfully",
      data: insertedData,
    });

  } catch (error) {
    console.error("Add Association Batch Error:", error);

    return res.status(500).json({
      message: "Internal Server Error",
      error: error.message,
    });
  }
};