import Suggestion from "../models/Suggestion.js";

export const fetchAllSuggestionWithAcknowledged = async (req, res) => {
  try {
    const suggestions = await Suggestion.findAll({
      attributes: ["suggestion_id", "title", "name", "year"],
      where: {
        status: "acknowledged",
      },
      order: [["suggestion_id", "DESC"]],
    });

    return res.status(200).json({
      data: suggestions,
    });
  } catch (error) {
    console.error("Fetch Acknowledged Suggestions Error:", error);

    return res.status(500).json({
      message: "Internal Server Error",
      error: error.message,
    });
  }
};
