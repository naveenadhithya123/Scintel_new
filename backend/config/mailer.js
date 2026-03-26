import nodemailer from "nodemailer";

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: "lap100gbfree@gmail.com",
    pass: "ehjh nmfh odsb shco"
  }
});

export default transporter;