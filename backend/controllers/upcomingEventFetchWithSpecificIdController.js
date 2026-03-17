import { UpcomingEvent } from "../models/index.js";

export const getUpcomingEventWithSpecificId = async (req, res) => {

  try {

    const { id } = req.params;

    const event = await UpcomingEvent.findByPk(id);

    if (!event) {
      return res.status(404).json({
        message: "Event not found"
      });
    }

    res.json(event);

  } catch (error) {

    res.status(500).json({
      message: "Error fetching event",
      error: error.message
    });

  }

};