import sequelize from "../config/database.js";
import Suggestion from "../models/Suggestion.js";
import SuggestionRecoard from "../models/suggestion_recoard.js";

export const resolveSuggestion = async (req, res) => {
  const transaction = await sequelize.transaction();

  try {
    const { id } = req.params;

    const suggestion = await Suggestion.findOne({
      where: {
        suggestion_id: id,
      },
      transaction,
    });

    if (!suggestion) {
      await transaction.rollback();
      return res.status(404).json({
        message: "Suggestion not found",
      });
    }

    await SuggestionRecoard.create(
      {
        title: suggestion.title,
        suggestion: suggestion.description,
        status: "Resolved",
        name: suggestion.name,
        email: suggestion.email,
        phone: suggestion.phone,
        year: suggestion.year,
      },
      { transaction }
    );

    await Suggestion.destroy({
      where: {
        suggestion_id: id,
      },
      transaction,
    });

    await transaction.commit();

    return res.status(200).json({
      message: "Suggestion resolved and moved successfully",
    });
  } catch (error) {
    await transaction.rollback();
    console.error("Resolve Suggestion Error:", error);

    return res.status(500).json({
      message: "Internal Server Error",
      error: error.message,
    });
  }
};
