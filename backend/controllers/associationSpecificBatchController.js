import sequelize from "../config/database.js";

export const getAssociationBatchDetails = async (req, res) => {

    try {

        const year = req.params.year;

        // Query batch information
        const [batchInfo] = await sequelize.query(`
            SELECT batch_id, batch_year, title, description, image_url
            FROM association_batch
            WHERE batch_year = :year
        `, {
            replacements: { year }
        });

        const [members] = await sequelize.query(`
            SELECT register_number, name, role, year
            FROM association_members
            WHERE batch_year = :year
            ORDER BY name
        `, {
            replacements: { year }
        });

        res.json({
            batch_info: batchInfo[0] || null,
            members: members || []
        });

    } catch (error) {

        console.error("Error fetching association batch details:", error);
        res.status(500).json({ error: "Internal Server Error" });

    }

};