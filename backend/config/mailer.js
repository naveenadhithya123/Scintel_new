import nodemailer from "nodemailer";

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: "lap100gbfree@gmail.com",
    pass: "siej higr uxtw bdlr"
  }
});

export default transporter;