import Suggestion from "../models/Suggestion.js";

export const fetchSpecificSuggestionWithId = async (req, res) => {
  try {
    const { id } = req.params;

    const suggestion = await Suggestion.findOne({
      where: {
        suggestion_id: id,
      },
    });

    if (!suggestion) {
      return res.status(404).json({
        message: "Suggestion not found",
      });
    }

    return res.status(200).json({
      data: suggestion,
    });
  } catch (error) {
    console.error("Fetch Specific Suggestion With Id Error:", error);

    return res.status(500).json({
      message: "Internal Server Error",
      error: error.message,
    });
  }
};
