import sequelize from "../config/database.js";

export const getSpecificAnnouncement = async (req, res) => {
    try {
        const { id, type } = req.params;

        if (!id || !type) {
            return res.status(400).json({
                success: false,
                message: "ID and type are required"
            });
        }

        let query = "";

        if (type === "event") {
            query = `
                SELECT 
                    event_id AS id,
                    event_title AS title,
                    event_short_description AS short_description,
                    event_description AS description,
                    brochure_url,
                    start_date,
                    end_date,
                    faculty_contact,
                    student_contact,
                    event_link
                FROM upcoming_events
                WHERE event_id = :id
            `;
        } 
        else if (type === "celebration") {
            query = `
                SELECT 
                    event_id AS id,
                    event_title AS title,
                    short_description AS short_description,
                    event_description AS description,
                    brochure_url,
                    start_date,
                    end_date,
                    faculty_contact,
                    student_contact
                FROM upcoming_celebrations
                WHERE event_id = :id
            `;
        } 
        else {
            return res.status(400).json({
                success: false,
                message: "Invalid type"
            });
        }

        const [result] = await sequelize.query(query, {
            replacements: { id }
        });

        if (result.length === 0) {
            return res.status(404).json({
                success: false,
                message: "Data not found"
            });
        }

        res.status(200).json({
            success: true,
            data: result[0]
        });

    } catch (error) {
        console.error("Error fetching specific announcement:", error);
        res.status(500).json({
            success: false,
            message: "Server error"
        });
    }
};