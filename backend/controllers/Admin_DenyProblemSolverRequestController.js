import sequelize from "../config/database.js";
import { QueryTypes } from "sequelize";
import transporter from "../config/mailer.js";

export const denyProblemSolverRequest = async (req, res) => {
  try {
    const { id } = req.params;

    // ============================
    // FETCH REQUEST
    // ============================

    const [request] = await sequelize.query(
      `
      SELECT *
      FROM problem_solver_requests
      WHERE problem_solver_request_id = :id
      `,
      {
        replacements: { id },
        type: QueryTypes.SELECT,
      }
    );

    if (!request) {
      return res.status(404).json({
        message: "Solver request not found",
      });
    }

    const { name, email } = request;

    // ============================
    // SEND DENIAL MAIL
    // ============================

    await transporter.sendMail({
      from: '"Scintel Team" <yourrealemail@gmail.com>',
      to: email,
      subject: "Problem Solver Request Update",
      html: `
        <div style="font-family: Arial; padding: 20px;">
          <h2>Hello ${name},</h2>
          <p>We appreciate your interest in solving the problem.</p>
          <p>Unfortunately, your request has been <b>declined</b> at this time.</p>
          <p>Don't worry — you can apply for other problems.</p>
          <p>Thank you for being part of Scintel 🙌</p>
        </div>
      `,
    });

    // ============================
    // DELETE REQUEST
    // ============================

    await sequelize.query(
      `
      DELETE FROM problem_solver_requests
      WHERE problem_solver_request_id = :id
      `,
      {
        replacements: { id },
      }
    );

    // ============================
    // RESPONSE
    // ============================

    return res.status(200).json({
      message: "Solver request denied and email sent",
    });

  } catch (error) {
    console.error("Deny Solver Request Error:", error);

    return res.status(500).json({
      message: "Internal Server Error",
      error: error.message,
    });
  }
};