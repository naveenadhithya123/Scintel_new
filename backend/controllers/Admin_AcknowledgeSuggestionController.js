import Suggestion from "../models/Suggestion.js";
import transporter from "../config/mailer.js";

export const acknowledgeSuggestion = async (req, res) => {
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

    suggestion.status = "acknowledged";
    await suggestion.save();

    await transporter.sendMail({
      from: '"Scintel Team" <lap100gbfree@gmail.com>',
      to: suggestion.email,
      subject: "Your Suggestion Has Been Acknowledged",
      html: `
        <div style="font-family: Arial, sans-serif; background-color: #f4f4f4; padding: 20px;">
          <div style="max-width: 560px; margin: auto; background: #ffffff; padding: 30px; border-radius: 10px;">
            <h2 style="color: #333; text-align: center; margin-bottom: 20px;">
              Scintel Notification
            </h2>

            <p style="color: #555; font-size: 16px;">Hello ${suggestion.name},</p>

            <p style="color: #555; font-size: 16px;">
              Thank you for taking the time to share your suggestion with us.
              We would like to let you know that your submission has been acknowledged by our team.
            </p>

            <p style="color: #555; font-size: 16px;">
              Your suggestion titled <b>${suggestion.title}</b> is now under review,
              and it will be considered as part of our ongoing efforts to improve the Scintel platform and experience.
            </p>

            <p style="color: #555; font-size: 16px;">
              We truly value your input and appreciate your contribution.
              Feedback like yours helps us identify opportunities to make meaningful improvements.
            </p>

            <p style="margin-top: 30px; color: #777; font-size: 16px;">
              Regards,<br/>
              <b>Scintel Team</b>
            </p>
          </div>
        </div>
      `,
    });

    return res.status(200).json({
      message: "Suggestion acknowledged successfully",
      data: suggestion,
    });
  } catch (error) {
    console.error("Acknowledge Suggestion Error:", error);

    return res.status(500).json({
      message: "Internal Server Error",
      error: error.message,
    });
  }
};
