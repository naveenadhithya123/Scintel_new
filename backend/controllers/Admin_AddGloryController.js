import sequelize from "../config/database.js";
import { QueryTypes } from "sequelize";

export const addGlory = async (req, res) => {
  try {
    const { title, description } = req.body;

    // ============================
    // VALIDATION
    // ============================

    if (!title || !description) {
      return res.status(400).json({
        message: "Title and Description are required",
      });
    }

    // ============================
    // IMAGE HANDLING
    // ============================

    let image_url = null;

    if (req.file) {
      // CloudinaryStorage → file already uploaded
      image_url = req.file.path;
    }

    // ============================
    // INSERT QUERY
    // ============================

    const [result] = await sequelize.query(
      `
      INSERT INTO scintel_glories
      (title, description, image_url)
      VALUES (:title, :description, :image_url)
      RETURNING *
      `,
      {
        replacements: {
          title,
          description,
          image_url,
        },
        type: QueryTypes.INSERT,
      }
    );

    return res.status(201).json({
      message: "Glory added successfully",
      data: result[0],
    });

  } catch (error) {
    console.error("Add Glory Error:", error);

    return res.status(500).json({
      message: "Internal Server Error",
      error: error.message,
    });
  }
};