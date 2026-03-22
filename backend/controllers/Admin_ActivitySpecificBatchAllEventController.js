import sequelize from "../config/database.js";

export const getActivitiesByBatch = async (req, res) => {
    try {
        console.log("🔥 ACTIVITY BY BATCH API CALLED");

        const { batch } = req.params;

        if (!batch) {
            return res.status(400).json({
                success: false,
                message: "Batch is required"
            });
        }

        const query = `
            SELECT 
                activity_id,
                event_image_url AS image,
                title,
                description
            FROM activities
            WHERE batch = :batch
            ORDER BY activity_id DESC;
        `;

        const [result] = await sequelize.query(query, {
            replacements: { batch }
        });

        res.status(200).json({
            success: true,
            data: result
        });

    } catch (error) {
        console.error("Error fetching activities by batch:", error);
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};