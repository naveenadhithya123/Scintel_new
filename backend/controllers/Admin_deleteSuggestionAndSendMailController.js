import sequelize from "../config/database.js";
import Suggestion from "../models/Suggestion.js";
import SuggestionRecoard from "../models/suggestion_recoard.js";
import transporter, { teamMailFrom } from "../config/mailer.js";

export const deleteSuggestionAndSendMail = async (req, res) => {
  const transaction = await sequelize.transaction();

  try {
    const { suggestion_id, mail_content } = req.body || {};

    if (!suggestion_id || !mail_content) {
      await transaction.rollback();
      return res.status(400).json({
        message: "suggestion_id and mail_content are required",
      });
    }

    const suggestion = await Suggestion.findOne({
      where: {
        suggestion_id,
      },
      transaction,
    });

    if (!suggestion) {
      await transaction.rollback();
      return res.status(404).json({
        message: "Suggestion not found",
      });
    }

    await transporter.sendMail({
      from: teamMailFrom,
      to: suggestion.email,
      subject: "Regarding Your Suggestion",
      html: `
        <div style="font-family: Arial, sans-serif; padding: 20px;">
          <p>${mail_content}</p>
        </div>
      `,
    });

    await SuggestionRecoard.create(
      {
        title: suggestion.title,
        suggestion: suggestion.description,
        status: "Unresolved",
        name: suggestion.name,
        email: suggestion.email,
        phone: suggestion.phone,
        year: suggestion.year,
      },
      { transaction }
    );

    await Suggestion.destroy({
      where: {
        suggestion_id,
      },
      transaction,
    });

    await transaction.commit();

    return res.status(200).json({
      message: "Suggestion deleted, mail sent, and record moved successfully",
    });
  } catch (error) {
    await transaction.rollback();
    console.error("Delete Suggestion And Send Mail Error:", error);

    return res.status(500).json({
      message: "Internal Server Error",
      error: error.message,
    });
  }
};
