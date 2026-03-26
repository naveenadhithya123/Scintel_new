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
      registration_start_date,   // ✅ added
      registration_end_date      // ✅ added
    } = req.body;

    const fileUrl = req.file?.path;

    if (!fileUrl) {
      return res.status(400).json({ message: "File upload failed" });
    }

    const [data] = await sequelize.query(
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
          short_desc: short_description,
          desc: description,
          url: fileUrl,
          start: start_date,
          end: end_date,
          faculty: faculty_contact,
          student: student_contact,
          type: event_type,
          link: event_link,
          reg_start: registration_start_date || null,  // ✅ safe handling
          reg_end: registration_end_date || null       // ✅ safe handling
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