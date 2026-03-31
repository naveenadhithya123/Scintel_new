import transporter, { teamMailFrom } from "../config/mailer.js";

export const sendAcceptanceMail = async (req, res) => {
  try {
    const { email } = req.body;

    // ============================
    // VALIDATION
    // ============================

    if (!email) {
      return res.status(400).json({
        message: "Email is required",
      });
    }

    // ============================
    // SEND MAIL
    // ============================

    await transporter.sendMail({
      from: teamMailFrom,
      to: email,
      subject: "Your Suggestion Has Been Accepted",
      html: `
        <div style="font-family: Arial, sans-serif; background-color: #f4f4f4; padding: 20px;">
            
            <div style="max-width: 500px; margin: auto; background: #ffffff; padding: 30px; border-radius: 10px;">
                
                <h2 style="color: #333; text-align: center;">
                    Scintel Notification
                </h2>
                
                <p style="color: #555; font-size: 16px;">
                    Hello,
                </p>

                <p style="color: #555; font-size: 16px;">
                    We’re happy to inform you that your suggestion/complaint has been 
                    reviewed and is now under consideration by our team.
                </p>

                <p style="color: #555; font-size: 16px;">
                    Our team will take the necessary actions and keep improving based on your input.
                </p>

                <p style="color: #555; font-size: 16px;">
                    Thank you for contributing and helping us improve Scintel.
                </p>

                <p style="margin-top: 30px; color: #777;">
                    Regards,<br/>
                    <b>Scintel Team</b>
                </p>

            </div>
        </div>
      `
    });

    // ============================
    // RESPONSE
    // ============================

    return res.status(200).json({
      message: "Acceptance email sent successfully",
    });

  } catch (error) {
    console.error("Send Acceptance Mail Error:", error);

    return res.status(500).json({
      message: "Internal Server Error",
      error: error.message,
    });
  }
};
