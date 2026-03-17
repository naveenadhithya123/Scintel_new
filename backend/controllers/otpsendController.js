import transporter from "../config/mailer.js";

export const otpStore = {};

export const sendOtp = async (req, res) => {

    try {

        const { email } = req.body;

        if (!email) {
            return res.status(400).json({ message: "Email is required" });
        }

        const otp = Math.floor(100000 + Math.random() * 900000).toString();

        otpStore[email] = {
            otp: otp,
            expires: Date.now() + 5 * 60 * 1000
        };

        await transporter.sendMail({
            from: '"Scintel Verification" <yourgmail@gmail.com>',
            to: email,
            subject: "Scintel OTP Verification",
            text: `Your OTP is ${otp}. It expires in 5 minutes.`
        });

        res.json({
            message: "OTP sent successfully"
        });

    } catch (error) {

        console.error("Error sending OTP:", error);
        res.status(500).json({ error: "Internal Server Error" });

    }

};