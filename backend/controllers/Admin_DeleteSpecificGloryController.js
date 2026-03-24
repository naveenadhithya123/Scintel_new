import sequelize from "../config/database.js";
import { QueryTypes } from "sequelize";
import cloudinary from "../config/cloudinary.js";

// helper to extract public_id from cloudinary URL
const getPublicIdFromUrl = (url) => {
  try {
    if (!url || !url.includes("res.cloudinary.com")) return null;

    const parts = url.split("/");
    const fileName = parts.pop().split(".")[0]; // remove extension
    const folder = parts.slice(parts.indexOf("upload") + 1).join("/");

    return `${folder}/${fileName}`;
  } catch {
    return null;
  }
};

export const deleteSpecificGlory = async (req, res) => {
  try {
    const { id } = req.params;

    // ============================
    // 1. Check if glory exists
    // ============================

    const [glory] = await sequelize.query(
      `SELECT * FROM scintel_glories WHERE glorie_id = :id`,
      {
        replacements: { id },
        type: QueryTypes.SELECT,
      }
    );

    if (!glory) {
      return res.status(404).json({
        message: "Glory not found",
      });
    }

    // ============================
    // 2. Delete image from Cloudinary
    // ============================

    if (glory.image_url) {
      const publicId = getPublicIdFromUrl(glory.image_url);

      if (publicId) {
        try {
          const result = await cloudinary.uploader.destroy(publicId);

          if (result.result !== "ok") {
            console.warn("Image not found in Cloudinary:", publicId);
          }
        } catch (err) {
          console.error("Cloudinary delete failed:", publicId);
        }
      }
    }

    // ============================
    // 3. Delete from DB
    // ============================

    await sequelize.query(
      `DELETE FROM scintel_glories WHERE glorie_id = :id`,
      {
        replacements: { id },
      }
    );

    // ============================
    // 4. Response
    // ============================

    return res.status(200).json({
      message: "Glory deleted successfully",
    });

  } catch (error) {
    console.error("Delete Glory Error:", error);

    return res.status(500).json({
      message: "Internal Server Error",
      error: error.message,
    });
  }
};