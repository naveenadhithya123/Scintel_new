import sequelize from "../config/database.js";
import { QueryTypes } from "sequelize";
import cloudinary from "../config/cloudinary.js";

// helper to extract public_id
const getPublicIdFromUrl = (url) => {
  try {
    if (!url || !url.includes("res.cloudinary.com")) return null;

    const parts = url.split("/");
    const fileName = parts.pop().split(".")[0];
    const folder = parts.slice(parts.indexOf("upload") + 1).join("/");

    return `${folder}/${fileName}`;
  } catch {
    return null;
  }
};

export const deleteSpecificBatch = async (req, res) => {
  try {
    const { id } = req.params;

    // ============================
    // CHECK IF EXISTS
    // ============================

    const [batch] = await sequelize.query(
      `
      SELECT * FROM association_batch
      WHERE batch_id = :id
      `,
      {
        replacements: { id },
        type: QueryTypes.SELECT,
      }
    );

    if (!batch) {
      return res.status(404).json({
        message: "Batch not found",
      });
    }

    // ============================
    // DELETE IMAGE (Cloudinary)
    // ============================

    if (batch.image_url) {
      const publicId = getPublicIdFromUrl(batch.image_url);

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
    // DELETE FROM DB
    // ============================

    await sequelize.query(
      `
      DELETE FROM association_batch
      WHERE batch_id = :id
      `,
      {
        replacements: { id },
      }
    );

    // ============================
    // RESPONSE
    // ============================

    return res.status(200).json({
      message: "Batch deleted successfully",
    });

  } catch (error) {
    console.error("Delete Batch Error:", error);

    return res.status(500).json({
      message: "Internal Server Error",
      error: error.message,
    });
  }
};