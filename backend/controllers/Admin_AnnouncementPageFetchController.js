import sequelize from "../config/database.js";

export const getAdminAnnouncementFeed = async (req, res) => {
    try {

        const [results] = await sequelize.query(`

            SELECT 
                event_id AS id,
                event_title AS title,
                event_short_description AS short_description,
                brochure_url,
                'event' AS type
            FROM upcoming_events

            UNION ALL

            SELECT 
                event_id AS id,
                event_title AS title,
                short_description AS short_description,
                brochure_url,
                'celebration' AS type
            FROM upcoming_celebrations

            ORDER BY title ASC;

        `);

        res.status(200).json({
            success: true,
            data: results
        });

    } catch (error) {
        console.error("Error fetching announcement feed:", error);
        res.status(500).json({
            success: false,
            message: "Server error"
        });
    }
};
