import sequelize from "../config/database.js";
import { QueryTypes } from "sequelize";

export const deleteSpecificProblem = async (req, res) => {
  const t = await sequelize.transaction();

  try {
    const { id } = req.params;

    // ============================
    // CHECK IF PROBLEM EXISTS
    // ============================

    const [problem] = await sequelize.query(
      `
      SELECT creator_user_id, solver_user_id
      FROM current_problems
      WHERE problem_id = :id
      `,
      {
        replacements: { id },
        type: QueryTypes.SELECT,
        transaction: t,
      }
    );

    if (!problem) {
      await t.rollback();
      return res.status(404).json({
        message: "Problem not found",
      });
    }

    // ============================
    // CHECK IF REQUESTS EXIST
    // ============================

    const requests = await sequelize.query(
      `
      SELECT problem_id 
      FROM problem_solver_requests
      WHERE problem_id = :id
      `,
      {
        replacements: { id },
        type: QueryTypes.SELECT,
        transaction: t,
      }
    );

    if (requests.length > 0) {
      await t.rollback();

      return res.status(400).json({
        message:
          "Someone has requested to solve this problem. Remove requests first.",
      });
    }

    const { creator_user_id, solver_user_id } = problem;

    // ============================
    // DELETE PROBLEM
    // ============================

    await sequelize.query(
      `
      DELETE FROM current_problems
      WHERE problem_id = :id
      `,
      {
        replacements: { id },
        transaction: t,
      }
    );

    // ============================
    // DELETE CREATOR USER
    // ============================

    await sequelize.query(
      `
      DELETE FROM users
      WHERE user_id = :creator_user_id
      `,
      {
        replacements: { creator_user_id },
        transaction: t,
      }
    );

    // ============================
    // DELETE SOLVER USER (if exists)
    // ============================

    if (solver_user_id) {
      await sequelize.query(
        `
        DELETE FROM users
        WHERE user_id = :solver_user_id
        `,
        {
          replacements: { solver_user_id },
          transaction: t,
        }
      );
    }

    // ============================
    // COMMIT
    // ============================

    await t.commit();

    return res.status(200).json({
      message: "Problem deleted successfully",
    });

  } catch (error) {
    await t.rollback();

    console.error("Delete Problem Error:", error);

    return res.status(500).json({
      message: "Internal Server Error",
      error: error.message,
    });
  }
};