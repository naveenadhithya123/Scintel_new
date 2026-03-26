import SuggestionRecoard from "../models/suggestion_recoard.js";

export const fetchAllUnresolvedSuggestionFromSuggestionRecoard = async (
  req,
  res
) => {
  try {
    const suggestions = await SuggestionRecoard.findAll({
      attributes: ["record_id", "title", "name", "year"],
      where: {
        status: "Unresolved",
      },
      order: [["record_id", "DESC"]],
    });

    return res.status(200).json({
      data: suggestions,
    });
  } catch (error) {
    console.error("Fetch All Unresolved Suggestion Record Error:", error);

    return res.status(500).json({
      message: "Internal Server Error",
      error: error.message,
    });
  }
};
