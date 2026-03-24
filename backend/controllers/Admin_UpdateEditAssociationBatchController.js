import sequelize from "../config/database.js";
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

export const updateAssociationBatch = async (req, res) => {
  try {
    const { id } = req.params;

    const {
      batch_year,
      title,
      description,
      existing_image_url,
    } = req.body;

    // ============================
    // VALIDATION
    // ============================

    if (!batch_year || !title || !description) {
      return res.status(400).json({
        message: "Batch year, Title and Description are required",
      });
    }

    // ============================
    // IMAGE LOGIC
    // ============================

    let finalImageUrl = existing_image_url || null;

    // If new image uploaded
    if (req.file) {
      finalImageUrl = req.file.path;

      // delete old image
      if (existing_image_url) {
        const publicId = getPublicIdFromUrl(existing_image_url);

        if (publicId) {
          try {
            await cloudinary.uploader.destroy(publicId);
          } catch (err) {
            console.error("Old image delete failed:", publicId);
          }
        }
      }
    }

    // ============================
    // UPDATE QUERY
    // ============================

    await sequelize.query(
      `
      UPDATE association_batch SET
        batch_year = :batch_year,
        title = :title,
        description = :description,
        image_url = :image_url
      WHERE batch_id = :id
      `,
      {
        replacements: {
          id,
          batch_year,
          title,
          description,
          image_url: finalImageUrl,
        },
      }
    );

    // ============================
    // RESPONSE
    // ============================

    return res.status(200).json({
      message: "Batch updated successfully",
      image_url: finalImageUrl,
    });

  } catch (error) {
    console.error("Update Batch Error:", error);

    return res.status(500).json({
      message: "Internal Server Error",
      error: error.message,
    });
  }
};