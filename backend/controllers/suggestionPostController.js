import sequelize from "../config/database.js";

export const addSuggestion = async (req, res) => {

    try {

        const {
            type,
            title,
            description,
            category,
            proof_url,
            priority,
            user_id
        } = req.body;

        // ✅ Validation
        if (!type || !title || !description || !category || !priority || !user_id) {
            return res.status(400).json({
                message: "Required fields are missing"
            });
        }

        // ✅ Insert into DB
        const [result] = await sequelize.query(`
            INSERT INTO suggestions
            (
                type,
                title,
                description,
                category,
                proof_url,
                priority,
                date,
                user_id
            )
            VALUES
            (
                :type,
                :title,
                :description,
                :category,
                :proof_url,
                :priority,
                CURRENT_DATE,
                :user_id
            )
            RETURNING *
        `, {
            replacements: {
                type,
                title,
                description,
                category,
                proof_url: proof_url || null,
                priority,
                user_id
            }
        });

        res.status(201).json({
            message: "Suggestion submitted successfully",
            data: result[0]
        });

    } catch (error) {

        console.error("Error adding suggestion:", error);

        res.status(500).json({
            error: "Internal Server Error"
        });
    }
};