import sequelize from "../config/database.js";

export const addEvent = async (req, res) => {
  try {
    const {
      title,
      short_description,
      description,
      start_date,
      end_date,
      faculty_contact,
      student_contact,
      event_type,
      event_link,
      registration_start_date,
      registration_end_date
    } = req.body;

    const fileUrl = req.file?.path;

    if (!fileUrl) {
      return res.status(400).json({ message: "File upload failed" });
    }

    if (!title || !event_type) {
      return res.status(400).json({
        message: "Title and event type are required"
      });
    }

    let data;

    if (event_type === "celebration") {
      [data] = await sequelize.query(
        `INSERT INTO upcoming_celebrations
        (
          event_title,
          short_description,
          event_description,
          brochure_url,
          start_date,
          end_date,
          faculty_contact,
          student_contact
        )
        VALUES
        (
          :title,
          :short_desc,
          :desc,
          :url,
          :start,
          :end,
          :faculty,
          :student
        )
        RETURNING *`,
        {
          replacements: {
            title,
            short_desc: short_description || null,
            desc: description || null,
            url: fileUrl,
            start: start_date || null,
            end: end_date || null,
            faculty: faculty_contact || null,
            student: student_contact || null
          }
        }
      );

      return res.status(201).json({
        message: "Celebration added successfully",
        data: data[0]
      });
    }

    if (event_type !== "event") {
      return res.status(400).json({
        message: "Invalid event type"
      });
    }

    [data] = await sequelize.query(
      `INSERT INTO upcoming_events 
      (
        event_title, 
        event_short_description, 
        event_description, 
        brochure_url, 
        start_date, 
        end_date, 
        faculty_contact, 
        student_contact, 
        event_type, 
        event_link,
        registration_start_date,
        registration_end_date
      )
      VALUES 
      (
        :title,
        :short_desc,
        :desc,
        :url,
        :start,
        :end,
        :faculty,
        :student,
        :type,
        :link,
        :reg_start,
        :reg_end
      )
      RETURNING *`,
      {
        replacements: {
          title,
          short_desc: short_description || null,
          desc: description || null,
          url: fileUrl,
          start: start_date || null,
          end: end_date || null,
          faculty: faculty_contact || null,
          student: student_contact || null,
          type: event_type,
          link: event_link || null,
          reg_start: registration_start_date || null,
          reg_end: registration_end_date || null
        }
      }
    );

    res.status(201).json({
      message: "Event added successfully",
      data: data[0]
    });

  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};
