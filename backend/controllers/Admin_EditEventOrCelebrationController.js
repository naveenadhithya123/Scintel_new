import sequelize from "../config/database.js";

export const updateAnnouncement = async (req, res) => {
    try {
        console.log("✅ HIT UPDATE API");
        const { id, type } = req.params;
        const {
            title,
            short_description,
            description,
            brochure_url,
            start_date,
            end_date,
            faculty_contact,
            student_contact,
            event_link
        } = req.body;

        if (!id || !type) {
            return res.status(400).json({
                success: false,
                message: "ID and type are required"
            });
        }

        let query = "";

        if (type === "event") {
            query = `
                UPDATE upcoming_events
                SET
                    event_title = :title,
                    event_short_description = :short_description,
                    event_description = :description,
                    brochure_url = :brochure_url,
                    start_date = :start_date,
                    end_date = :end_date,
                    faculty_contact = :faculty_contact,
                    student_contact = :student_contact,
                    event_link = :event_link
                WHERE event_id = :id
            `;
        } 
        else if (type === "celebration") {
            query = `
                UPDATE upcoming_celebrations
                SET
                    event_title = :title,
                    short_description = :short_description,
                    event_description = :description,
                    brochure_url = :brochure_url,
                    start_date = :start_date,
                    end_date = :end_date,
                    faculty_contact = :faculty_contact,
                    student_contact = :student_contact
                WHERE event_id = :id
            `;
        } 
        else {
            return res.status(400).json({
                success: false,
                message: "Invalid type"
            });
        }

        const result = await sequelize.query(query, {
            replacements: {
                id,
                title,
                short_description,
                description,
                brochure_url,
                start_date,
                end_date,
                faculty_contact,
                student_contact,
                event_link
            }
        });

        console.log("Update result:", result);


        res.status(200).json({
            success: true,
            message: "Updated successfully"
        });

    } catch (error) {
        console.error("Error updating announcement:", error);
        res.status(500).json({
            success: false,
            message: "Server error"
        });
    }
};