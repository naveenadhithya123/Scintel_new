import sequelize from "../config/database.js";

export const getActivitiesByBatch = async (req, res) => {

    try {

        const [results] = await sequelize.query(`
            SELECT batch, COUNT(*) AS activity_count
            FROM activities
            GROUP BY batch
            ORDER BY batch DESC
        `);

        res.json(results);

    } catch (error) {

        console.error("Error fetching activity batches:", error);
        res.status(500).json({ error: "Internal Server Error" });

    }

};