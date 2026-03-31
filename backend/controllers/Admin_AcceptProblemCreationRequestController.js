import sequelize from "../config/database.js";
import { QueryTypes } from "sequelize";
import transporter, { teamMailFrom } from "../config/mailer.js";

export const acceptProblemCreationRequest = async (req, res) => {
  const t = await sequelize.transaction();

  try {
    const { id } = req.params;

    // ============================
    // FETCH REQUEST
    // ============================

    const [request] = await sequelize.query(
      `
      SELECT *
      FROM problem_creation_requests
      WHERE problem_creation_request_id = :id
      `,
      {
        replacements: { id },
        type: QueryTypes.SELECT,
        transaction: t,
      }
    );

    if (!request) {
      await t.rollback();
      return res.status(404).json({
        message: "Problem request not found",
      });
    }

    const {
      name,
      email,
      phone_number,
      year,
      section,
      title,
      category,
      short_description,
      detailed_description,
    } = request;

    // ============================
    // SEND APPROVAL MAIL
    // ============================

    await transporter.sendMail({
      from: teamMailFrom,
      to: email,
      subject: "Problem Request Approved - Scintel",
      html: `
        <div style="font-family: Arial, sans-serif; background-color: #f4f4f4; padding: 20px;">
            
            <div style="max-width: 500px; margin: auto; background: #ffffff; padding: 30px; border-radius: 10px;">
                
                <h2 style="color: #333; text-align: center;">Scintel Notification</h2>
                
                <p style="color: #555;">Hello ${name},</p>

                <p style="color: #555;">
                    Your problem request has been successfully approved and added to the platform.
                </p>

                <p style="color: #333; font-weight: bold;">
                    "${title}"
                </p>

                <p style="color: #555;">
                    Our community can now view and start working on your problem.
                </p>

                <p style="color: #777; margin-top: 20px;">
                    Thank you for contributing to Scintel!
                </p>

            </div>
        </div>
      `,
    });

    // ============================
    // CREATE USER
    // ============================

    const [userResult] = await sequelize.query(
      `
      INSERT INTO users
      (name, email, phone_number, year, section)
      VALUES (:name, :email, :phone, :year, :section)
      RETURNING user_id
      `,
      {
        replacements: {
          name,
          email,
          phone: phone_number,
          year,
          section,
        },
        type: QueryTypes.INSERT,
        transaction: t,
      }
    );

    const creator_user_id = userResult[0].user_id;

    // ============================
    // INSERT INTO CURRENT PROBLEMS
    // ============================

    await sequelize.query(
      `
      INSERT INTO current_problems
      (
        title,
        category,
        short_description,
        detailed_description,
        creator_user_id
      )
      VALUES
      (
        :title,
        :category,
        :short_description,
        :detailed_description,
        :creator_user_id
      )
      `,
      {
        replacements: {
          title,
          category,
          short_description,
          detailed_description,
          creator_user_id,
        },
        transaction: t,
      }
    );

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
        transaction: t,
      }
    );

    // ============================
    // COMMIT
    // ============================

    await t.commit();

    return res.status(200).json({
      message: "Problem accepted, email sent, and moved successfully",
    });

  } catch (error) {
    await t.rollback();

    console.error("Accept Problem Request Error:", error);

    return res.status(500).json({
      message: "Internal Server Error",
      error: error.message,
    });
  }
};
