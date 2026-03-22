import sequelize from "../config/database.js";

export const addCelebration = async (req, res) => {
  try {
    const {
      title,
      description,
      short_description,   
      start_date,
      end_date,
      faculty_contact,
      student_contact,
    } = req.body;

    const fileUrl = req.file?.path;

    if (!fileUrl) {
      return res.status(400).json({ message: "File upload failed" });
    }

    const [data] = await sequelize.query(
      `INSERT INTO upcoming_celebrations 
      (event_title, event_description, short_description, brochure_url, start_date, end_date, faculty_contact, student_contact)
      VALUES (:title,:desc,:short_desc,:url,:start,:end,:faculty,:student)
      RETURNING *`,
      {
        replacements: {
          title,
          desc: description,
          short_desc: short_description,   
          url: fileUrl,
          start: start_date,
          end: end_date,
          faculty: faculty_contact,
          student: student_contact,
        },
      }
    );

    res.status(201).json({
      message: "Celebration added successfully",
      data: data[0],
    });

  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};