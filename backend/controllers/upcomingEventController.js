import { UpcomingEvent } from "../models/index.js";

export const getUpcomingEvents = async (req, res) => {
  try {

    const events = await UpcomingEvent.findAll();

    res.status(200).json(events);

  } catch (error) {

    res.status(500).json({
      message: "Error fetching upcoming events",
      error: error.message
    });

  }
};