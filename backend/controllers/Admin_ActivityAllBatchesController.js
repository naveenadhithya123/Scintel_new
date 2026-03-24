import sequelize from "../config/database.js";

export const getAllActivityBatches = async (req, res) => {
    try {
        

        const query = `
            SELECT 
                batch AS year,
                COUNT(*) AS activity_count
            FROM activities
            GROUP BY batch
            ORDER BY batch DESC;
        `;

        const [result] = await sequelize.query(query);

        res.status(200).json({
            success: true,
            data: result
        });

    } catch (error) {
        console.error("Error fetching activity batches:", error);
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};