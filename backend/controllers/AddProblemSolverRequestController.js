import sequelize from "../config/database.js";

export const addProblemSolverRequest = async (req, res) => {

    try {

        const {
            problem_id,
            name,
            email,
            phone_number,
            year,
            section,
            mentor // ✅ added
        } = req.body;

        // ✅ Validation
        if (!problem_id || !name || !email || !phone_number || !year || !section || !mentor) {
            return res.status(400).json({
                message: "All fields are required"
            });
        }

        // ✅ Step 1: Check problem exists + not taken
        const [problem] = await sequelize.query(`
            SELECT solver_user_id
            FROM current_problems
            WHERE problem_id = :problem_id
        `, {
            replacements: { problem_id }
        });

        if (problem.length === 0) {
            return res.status(404).json({
                message: "Problem not found"
            });
        }

        if (problem[0].solver_user_id !== null) {
            return res.status(400).json({
                message: "Problem already taken"
            });
        }

        // ✅ Step 2: Insert request (including mentor)
        const [insertResult] = await sequelize.query(`
            INSERT INTO problem_solver_requests
            (
                problem_id,
                name,
                email,
                phone_number,
                year,
                section,
                mentor
            )
            VALUES
            (
                :problem_id,
                :name,
                :email,
                :phone_number,
                :year,
                :section,
                :mentor
            )
            RETURNING *
        `, {
            replacements: {
                problem_id,
                name,
                email,
                phone_number,
                year,
                section,
                mentor // ✅ added
            }
        });

        // ✅ Final Response
        res.status(201).json({
            message: "Request submitted successfully (pending approval)",
            data: insertResult[0]
        });

    } catch (error) {

        console.error("Error:", error);

        res.status(500).json({
            error: "Internal Server Error"
        });
    }
};