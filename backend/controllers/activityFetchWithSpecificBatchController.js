import sequelize from "../config/database.js";

export const getActivitiesBySpecificBatch = async (req, res) => {

    try {

        const batch = req.params.batch;

        const [results] = await sequelize.query(`
            SELECT 
                activity_id,
                title,
                description,
                brochure_url,
                event_image_url
            FROM activities
            WHERE batch = :batch
            ORDER BY start_date DESC
        `, {
            replacements: { batch }
        });

        res.json(results);

    } catch (error) {

        console.error("Error fetching activities by batch:", error);
        res.status(500).json({ error: "Internal Server Error" });

    }

};
