import sequelize from "../config/database.js";

export const createProblemRequest = async (req, res) => {

    try {

        const {
            name,
            email,
            phone_number,
            year,
            section,
            title,
            category,
            short_description,
            detailed_description
        } = req.body;

        if (
            !name ||
            !email ||
            !phone_number ||
            !year ||
            !section ||
            !title ||
            !category ||
            !short_description ||
            !detailed_description
        ) {
            return res.status(400).json({
                message: "All fields are required"
            });
        }

        const [result] = await sequelize.query(`
            INSERT INTO problem_creation_requests
            (
                name,
                email,
                phone_number,
                year,
                section,
                title,
                category,
                short_description,
                detailed_description
            )
            VALUES
            (
                :name,
                :email,
                :phone_number,
                :year,
                :section,
                :title,
                :category,
                :short_description,
                :detailed_description
            )
            RETURNING *
        `, {
            replacements: {
                name,
                email,
                phone_number,
                year,
                section,
                title,
                category,
                short_description,
                detailed_description
            }
        });

        res.status(201).json({
            message: "Problem request submitted successfully",
            data: result[0]
        });

    } catch (error) {

        console.error("Error creating problem request:", error);

        res.status(500).json({
            error: "Internal Server Error"
        });

    }

};