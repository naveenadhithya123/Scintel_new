import SuggestionRecoard from "../models/suggestion_recoard.js";

export const fetchSpecficSuggestionFromsuggestioRecoard = async (req, res) => {
  try {
    const { id } = req.params;

    const suggestion = await SuggestionRecoard.findOne({
      where: {
        record_id: id,
      },
    });

    if (!suggestion) {
      return res.status(404).json({
        message: "Suggestion record not found",
      });
    }

    return res.status(200).json({
      data: suggestion,
    });
  } catch (error) {
    console.error("Fetch Specific Suggestion From Suggestion Record Error:", error);

    return res.status(500).json({
      message: "Internal Server Error",
      error: error.message,
    });
  }
};
