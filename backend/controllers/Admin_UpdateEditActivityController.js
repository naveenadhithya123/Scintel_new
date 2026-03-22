import sequelize from "../config/database.js";
import { QueryTypes } from "sequelize";

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
      existing_winner_image,
      existing_resource_person_image,
    } = req.body;

    // ============================
    // EVENT IMAGES (MULTIPLE)
    // ============================

    let existingImages = [];

    if (existing_event_images) {
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

    const finalEventImages = [...existingImages, ...newUploadedImages];
    const finalEventImageString = finalEventImages.join(",");

    // ============================
    // WINNER IMAGE (SINGLE)
    // ============================

    let finalWinnerImage = existing_winner_image || null;

    if (req.files && req.files["winner_image"]) {
      finalWinnerImage = req.files["winner_image"][0].path;
    }

    // ============================
    // RESOURCE PERSON IMAGE (SINGLE)
    // ============================

    let finalResourceImage = existing_resource_person_image || null;

    if (req.files && req.files["resource_person_image"]) {
      finalResourceImage = req.files["resource_person_image"][0].path;
    }

    // ============================
    // UPDATE QUERY
    // ============================

    await sequelize.query(
      `
      UPDATE activities SET
        title = :title,
        description = :description,
        participants = :participants,
        batch = :batch,
        start_date = :start_date,
        end_date = :end_date,
        brochure_url = :brochure_url,

        resource_person_name = :resource_person_name,
        resource_person_description = :resource_person_description,
        resource_person_image_url = :resource_person_image_url,

        event_image_url = :event_image_url,

        winner_name = :winner_name,
        winner_description = :winner_description,
        winner_image = :winner_image,

        testimonials_name = :testimonials_name,
        testimonials_class = :testimonials_class,
        testimonials_feedback = :testimonials_feedback

      WHERE activity_id = :id
      `,
      {
        replacements: {
          id,
          title,
          description,
          participants,
          batch,
          start_date,
          end_date: end_date || null,
          brochure_url,

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
        },
        type: QueryTypes.RAW, // IMPORTANT FIX
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