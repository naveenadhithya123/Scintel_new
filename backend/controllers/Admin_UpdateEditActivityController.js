import sequelize from "../config/database.js";
import { QueryTypes } from "sequelize";

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

export const updateActivity = async (req, res) => {
  try {
    const { id } = req.params;

    const {
      title,
      description,
      participants,
      batch,
      start_date,
      end_date,
      brochure_url,

      resource_person_name,
      resource_person_description,

      winner_name,
      winner_description,

      testimonials_name,
      testimonials_class,
      testimonials_feedback,

      existing_event_images,
      image_order,
      existing_winner_image,
      existing_resource_person_image,
    } = req.body;

    // ============================
    // EVENT IMAGES (MULTIPLE)
    // ============================

    let existingImages = [];

    if (image_order) {
      try {
        const parsedOrder =
          typeof image_order === "string" ? JSON.parse(image_order) : image_order;

        if (Array.isArray(parsedOrder)) {
          existingImages = parsedOrder.filter(
            (img) => typeof img === "string" && !img.startsWith("NEW_FILE_")
          );
        }
      } catch (error) {
        console.error("Invalid image_order payload:", error);
      }
    }

    if (existingImages.length === 0 && existing_event_images) {
      if (Array.isArray(existing_event_images)) {
        existingImages = existing_event_images;
      } else if (typeof existing_event_images === "string") {
        existingImages = existing_event_images
          .split(",")
          .map((img) => img.trim())
          .filter((img) => img !== "");
      }
    }

    let newUploadedImages = [];

    if (req.files && req.files["event_images"]) {
      for (let file of req.files["event_images"]) {
        newUploadedImages.push(file.path);
      }
    }

    let finalEventImages = [...existingImages];

    if (image_order) {
      try {
        const parsedOrder =
          typeof image_order === "string" ? JSON.parse(image_order) : image_order;

        if (Array.isArray(parsedOrder)) {
          let newFileIndex = 0;
          finalEventImages = parsedOrder
            .map((item) => {
              if (typeof item === "string" && item.startsWith("NEW_FILE_")) {
                const uploaded = newUploadedImages[newFileIndex];
                newFileIndex += 1;
                return uploaded || null;
              }

              return item;
            })
            .filter(Boolean);
        }
      } catch (error) {
        console.error("Failed to map ordered images:", error);
      }
    } else {
      finalEventImages = [...existingImages, ...newUploadedImages];
    }

    const finalEventImageString = finalEventImages.join(",");

    // ============================
    // WINNER IMAGE (SINGLE)
    // ============================

    let finalWinnerImage =
      existing_winner_image && existing_winner_image !== "Not Applicable"
        ? existing_winner_image
        : null;

    if (req.files && req.files["winner_image"]) {
      finalWinnerImage = req.files["winner_image"][0].path;
    }

    // ============================
    // RESOURCE PERSON IMAGE (SINGLE)
    // ============================

    let finalResourceImage =
      existing_resource_person_image && existing_resource_person_image !== "Not Applicable"
        ? existing_resource_person_image
        : null;

    if (req.files && req.files["resource_person_image"]) {
      finalResourceImage = req.files["resource_person_image"][0].path;
    }

    let finalBrochure =
      brochure_url && brochure_url !== "Not Applicable" ? brochure_url : null;

    if (req.files && req.files["brochure"]) {
      finalBrochure = req.files["brochure"][0].path;
    }

    // ============================
    // UPDATE QUERY
    // ============================

    const supportedColumns = await getTableColumns("activities");
    const candidateValues = {
      title,
      description,
      participants,
      batch,
      start_date,
      end_date: end_date || null,
      brochure_url: finalBrochure,
      resource_person_name: resource_person_name || null,
      resource_person_description: resource_person_description || null,
      resource_person_image_url: finalResourceImage,
      event_image_url: finalEventImageString,
      winner_name: winner_name || null,
      winner_description: winner_description || null,
      winner_image: finalWinnerImage,
      testimonials_name,
      testimonials_class,
      testimonials_feedback,
    };

    const updates = Object.entries(candidateValues).filter(([column, value]) => {
      return supportedColumns.has(column) && value !== undefined;
    });

    if (!updates.length) {
      return res.status(400).json({
        message: "No valid activity fields provided for update"
      });
    }

    const assignments = updates.map(([column]) => `${column} = :${column}`);
    const replacements = Object.fromEntries(updates);
    replacements.id = id;

    await sequelize.query(
      `
      UPDATE activities SET
        ${assignments.join(",\n        ")}
      WHERE activity_id = :id
      `,
      {
        replacements,
        type: QueryTypes.RAW,
      }
    );

    console.log("Update successful");

    return res.status(200).json({
      message: "Activity updated successfully"
    });

  } catch (error) {
    console.error("FULL ERROR:", error);

    return res.status(500).json({
      message: "Internal Server Error",
      error: error.message
    });
  }
};
