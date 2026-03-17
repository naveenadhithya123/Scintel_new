import sequelize from "../config/database.js";

export const getAllCurrentProblems = async (req, res) => {

    try {

        const [problems] = await sequelize.query(`
            SELECT 
                problem_id,
                title,
                short_description
            FROM current_problems
            ORDER BY problem_id DESC
        `);

        res.json(problems);

    } catch (error) {

        console.error("Error fetching current problems:", error);

        res.status(500).json({
            error: "Internal Server Error"
        });

    }

};