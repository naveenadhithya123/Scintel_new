import sequelize from "../config/database.js";
import { QueryTypes } from "sequelize";
import transporter from "../config/mailer.js";

export const denyProblemCreationRequest = async (req, res) => {
  try {
    const { id } = req.params;

    // ============================
    // FETCH REQUEST (to get email)
    // ============================

    const [request] = await sequelize.query(
      `
      SELECT email, title, name
      FROM problem_creation_requests
      WHERE problem_creation_request_id = :id
      `,
      {
        replacements: { id },
        type: QueryTypes.SELECT,
      }
    );

    if (!request) {
      return res.status(404).json({
        message: "Problem request not found",
      });
    }

    const { email, title, name } = request;

    // ============================
    // SEND MAIL
    // ============================

    await transporter.sendMail({
      from: '"Scintel Team" <yourrealemail@gmail.com>',
      to: email,
      subject: "Problem Request Update - Scintel",
      html: `
        <div style="font-family: Arial, sans-serif; background-color: #f4f4f4; padding: 20px;">
            
            <div style="max-width: 500px; margin: auto; background: #ffffff; padding: 30px; border-radius: 10px;">
                
                <h2 style="color: #333; text-align: center;">Scintel Notification</h2>
                
                <p style="color: #555; font-size: 16px;">
                    Hello ${name || "User"},
                </p>

                <p style="color: #555; font-size: 15px;">
                    Thank you for submitting your problem titled:
                </p>

                <p style="font-weight: bold; color: #333;">
                    "${title}"
                </p>

                <p style="color: #555; font-size: 15px;">
                    After review, we regret to inform you that your problem request has not been approved at this time.
                </p>

                <p style="color: #555; font-size: 15px;">
                    You are encouraged to refine your idea and submit again.
                </p>

                <p style="color: #777; font-size: 13px; margin-top: 20px;">
                    — Scintel Team
                </p>

            </div>
        </div>
      `,
    });

    // ============================
    // DELETE REQUEST
    // ============================

    await sequelize.query(
      `
      DELETE FROM problem_creation_requests
      WHERE problem_creation_request_id = :id
      `,
      {
        replacements: { id },
      }
    );

    // ============================
    // RESPONSE
    // ============================

    return res.status(200).json({
      message: "Problem request denied, email sent, and deleted successfully",
    });

  } catch (error) {
    console.error("Deny Problem Request Error:", error);

    return res.status(500).json({
      message: "Internal Server Error",
      error: error.message,
    });
  }
};