import sequelize, { withDbRetry } from "../config/database.js";

export const getAllAssociationBatches = async (req, res) => {

    try {

        const [results] = await withDbRetry(
            () => sequelize.query(`
                SELECT batch_id, batch_year, title, description, image_url
                FROM association_batch
                ORDER BY batch_year DESC
            `),
            { label: "Fetching association batches" }
        );

        res.json(results);

    } catch (error) {

        console.error("Error fetching association batches:", error);
        res.status(500).json({ error: "Internal Server Error" });

    }

};
