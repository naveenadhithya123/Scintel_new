import transporter, { isMailerConfigured, verificationMailFrom } from "../config/mailer.js";

export const otpStore = {};

export const sendOtp = async (req, res) => {

    try {

        const { email } = req.body;

        if (!email) {
            return res.status(400).json({ message: "Email is required" });
        }

        if (!isMailerConfigured) {
            return res.status(503).json({
                message: "OTP email service is not configured on the server. Add SMTP credentials in backend/.env and restart the backend."
            });
        }

        const otp = Math.floor(100000 + Math.random() * 900000).toString();

        otpStore[email] = {
            otp: otp,
            expires: Date.now() + 5 * 60 * 1000
        };

await transporter.sendMail({
    from: verificationMailFrom,
    to: email,
    subject: "Scintel OTP Verification",
    html: `
        <div style="font-family: Arial, sans-serif; background-color: #f4f4f4; padding: 20px;">
            
            <div style="max-width: 500px; margin: auto; background: #ffffff; padding: 30px; border-radius: 10px; text-align: center;">
                
                <h2 style="color: #333;">Scintel Verification</h2>
                
                <p style="color: #555; font-size: 16px;">
                    Use the OTP below to verify your email address
                </p>
                
                <div style="margin: 20px 0;">
                    <span style="
                        display: inline-block;
                        padding: 15px 25px;
                        font-size: 24px;
                        letter-spacing: 5px;
                        background: #4CAF50;
                        color: #ffffff;
                        border-radius: 8px;
                        font-weight: bold;
                    ">
                        ${otp}
                    </span>
                </div>
                
                <p style="color: #777; font-size: 14px;">
                    This OTP is valid for <b>5 minutes</b>.
                </p>

                <p style="color: #aaa; font-size: 12px; margin-top: 20px;">
                    If you didn’t request this, you can safely ignore this email.
                </p>

            </div>
        </div>
    `
});

        res.json({
            message: "OTP sent successfully"
        });

    } catch (error) {

        console.error("Error sending OTP:", error);
        res.status(500).json({
            message: error?.message || "Unable to send OTP right now."
        });

    }

};
