import sequelize from "../config/database.js";
import { QueryTypes } from "sequelize";
import cloudinary from "../config/cloudinary.js";

// helper to extract public_id
const getPublicIdFromUrl = (url) => {
  try {
    if (!url.includes("res.cloudinary.com")) return null;

    const parts = url.split("/");
    const fileName = parts.pop().split(".")[0];
    const folder = parts.slice(parts.indexOf("upload") + 1).join("/");

    return `${folder}/${fileName}`;
  } catch {
    return null;
  }
};

export const deleteSpecificSuggestion = async (req, res) => {
  try {
    const { id } = req.params;

    // ============================
    // 1. Check if exists
    // ============================

    const [suggestion] = await sequelize.query(
      `SELECT * FROM suggestions WHERE suggestion_id = :id`,
      {
        replacements: { id },
        type: QueryTypes.SELECT,
      }
    );

    if (!suggestion) {
      return res.status(404).json({
        message: "Suggestion not found",
      });
    }

    // ============================
    // 2. Delete proof image (if exists)
    // ============================

    if (suggestion.proof_url) {
      const publicId = getPublicIdFromUrl(suggestion.proof_url);

      if (publicId) {
        try {
          const result = await cloudinary.uploader.destroy(publicId);

          if (result.result !== "ok") {
            console.warn("Cloudinary image not found:", publicId);
          }

        } catch (err) {
          console.error("Cloudinary delete failed:", publicId);
        }
      }
    }

    // ============================
    // 3. Delete DB record
    // ============================

    await sequelize.query(
      `DELETE FROM suggestions WHERE suggestion_id = :id`,
      {
        replacements: { id },
        type: QueryTypes.RAW,
      }
    );

    // ============================
    // 4. Response
    // ============================

    return res.status(200).json({
      message: "Suggestion deleted successfully",
    });

  } catch (error) {
    console.error("Delete Suggestion Error:", error);

    return res.status(500).json({
      message: "Internal Server Error",
      error: error.message,
    });
  }
};