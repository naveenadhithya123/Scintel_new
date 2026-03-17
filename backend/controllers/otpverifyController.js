import { otpStore } from "./otpsendController.js";

export const verifyOtp = async (req, res) => {

    try {

        const { email, otp } = req.body;

        if (!email || !otp) {
            return res.status(400).json({ message: "Email and OTP are required" });
        }

        const storedOtpData = otpStore[email];

        if (!storedOtpData) {
            return res.status(400).json({ message: "OTP not found. Please request OTP again." });
        }

        if (Date.now() > storedOtpData.expires) {
            delete otpStore[email];
            return res.status(400).json({ message: "OTP expired" });
        }

        if (storedOtpData.otp !== otp) {
            return res.status(400).json({ message: "Invalid OTP" });
        }

        delete otpStore[email];

        res.json({
            verified: true,
            message: "OTP verified successfully"
        });

    } catch (error) {

        console.error("Error verifying OTP:", error);
        res.status(500).json({ error: "Internal Server Error" });

    }

};