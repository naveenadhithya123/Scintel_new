import sequelize from "../config/database.js";
import { QueryTypes } from "sequelize";

export const addSuggestion = async (req, res) => {
  const t = await sequelize.transaction();

  try {
    const {
      // Suggestion fields
      type,
      title,
      description,
      category,
      priority,

      // User fields
      name,
      email,
      phone_number,
      year,
      section,
    } = req.body;

    // ============================
    // VALIDATION
    // ============================

    if (
      !type ||
      !title ||
      !description ||
      !category ||
      !priority ||
      !name ||
      !email ||
      !phone_number ||
      !year ||
      !section
    ) {
      await t.rollback();
      return res.status(400).json({
        message: "Required fields are missing",
      });
    }

    // ============================
    // IMAGE UPLOAD
    // ============================

    let proof_url = null;

    if (req.file) {
      proof_url = req.file.path; // Cloudinary URL
    }

    // ============================
    // CREATE USER
    // ============================

    const [userResult] = await sequelize.query(
      `
      INSERT INTO users
      (name, email, phone_number, year, section)
      VALUES (:name, :email, :phone, :year, :section)
      RETURNING user_id
      `,
      {
        replacements: {
          name,
          email,
          phone: phone_number,
          year,
          section,
        },
        type: QueryTypes.INSERT,
        transaction: t,
      }
    );

    const user_id = userResult[0].user_id;

    // ============================
    // INSERT SUGGESTION
    // ============================

    const [suggestionResult] = await sequelize.query(
      `
      INSERT INTO suggestions
      (
        type,
        title,
        description,
        category,
        proof_url,
        priority,
        date,
        user_id
      )
      VALUES
      (
        :type,
        :title,
        :description,
        :category,
        :proof_url,
        :priority,
        CURRENT_DATE,
        :user_id
      )
      RETURNING *
      `,
      {
        replacements: {
          type,
          title,
          description,
          category,
          proof_url,
          priority,
          user_id,
        },
        type: QueryTypes.INSERT,
        transaction: t,
      }
    );

    // ============================
    // COMMIT
    // ============================

    await t.commit();

    return res.status(201).json({
      message: "Suggestion submitted successfully",
      data: suggestionResult[0],
    });

  } catch (error) {
    await t.rollback();

    console.error("Error adding suggestion:", error);

    return res.status(500).json({
      message: "Internal Server Error",
      error: error.message,
    });
  }
};