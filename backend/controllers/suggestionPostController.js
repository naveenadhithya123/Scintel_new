import Suggestion from "../models/Suggestion.js";

export const addSuggestion = async (req, res) => {
  try {
    const {
      title,
      description,
      name,
      email,
      phone,
      year,
    } = req.body;

    if (!title || !description || !name || !email || !phone || !year) {
      return res.status(400).json({
        message: "Required fields are missing",
      });
    }

    const suggestion = await Suggestion.create({
      title,
      description,
      status: "unacknowledged",
      name,
      email,
      phone,
      year,
    });

    return res.status(201).json({
      message: "Suggestion submitted successfully",
      data: suggestion,
    });
  } catch (error) {
    console.error("Error adding suggestion:", error);

    return res.status(500).json({
      message: "Internal Server Error",
      error: error.message,
    });
  }
};
