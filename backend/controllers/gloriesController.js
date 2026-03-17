import sequelize from "../config/database.js";

export const getAllGlories = async (req, res) => {

    try {

        const [results] = await sequelize.query(`
            SELECT glorie_id, title, description, image_url
            FROM scintel_glories
            ORDER BY glorie_id DESC
        `);

        res.json(results);

    } catch (error) {

        console.error("Error fetching glories:", error);
        res.status(500).json({ error: "Internal Server Error" });

    }

};