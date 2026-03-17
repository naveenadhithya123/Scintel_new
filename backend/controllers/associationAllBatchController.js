import sequelize from "../config/database.js";

export const getAllAssociationBatches = async (req, res) => {

    try {

        const [results] = await sequelize.query(`
            SELECT batch_year, title
            FROM association_batch
            ORDER BY batch_year DESC
        `);

        res.json(results);

    } catch (error) {

        console.error("Error fetching association batches:", error);
        res.status(500).json({ error: "Internal Server Error" });

    }

};