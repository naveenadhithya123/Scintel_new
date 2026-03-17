import sequelize from "../config/database.js";

export const getSpecificCurrentProblem = async (req, res) => {

    try {

        const problemId = req.params.id;

        const [problem] = await sequelize.query(`
            SELECT 
                problem_id,
                title,
                category,
                short_description,
                detailed_description
            FROM current_problems
            WHERE problem_id = :problemId
        `, {
            replacements: { problemId }
        });

        if(problem.length === 0){
            return res.status(404).json({
                message: "Problem not found"
            });
        }

        res.json(problem[0]);

    } catch (error) {

        console.error("Error fetching specific problem:", error);

        res.status(500).json({
            error: "Internal Server Error"
        });

    }

};