import "dotenv/config";
import nodemailer from "nodemailer";

const smtpHost = process.env.BREVO_SMTP_HOST || process.env.SMTP_HOST || "smtp-relay.brevo.com";
const smtpPort = Number(process.env.BREVO_SMTP_PORT || process.env.SMTP_PORT || 587);
const smtpUser = process.env.BREVO_SMTP_LOGIN || process.env.SMTP_USER;
const smtpPass =
  process.env.BREVO_SMTP_PASSWORD ||
  process.env.SMTP_PASS ||
  process.env.BREVO_API_KEY;

if (!smtpUser || !smtpPass) {
  console.warn(
    "Mail transporter is not fully configured. Set BREVO_SMTP_LOGIN and BREVO_SMTP_PASSWORD (or BREVO_API_KEY)."
  );
}

const transporter = nodemailer.createTransport({
  host: smtpHost,
  port: smtpPort,
  secure: smtpPort === 465,
  auth: {
    user: smtpUser,
    pass: smtpPass
  }
});

const mailFromAddress =
  process.env.MAIL_FROM_ADDRESS ||
  process.env.BREVO_SENDER_EMAIL ||
  smtpUser ||
  "no-reply@scintel.local";

export const teamMailFrom = `"${process.env.MAIL_FROM_NAME || "Scintel Team"}" <${mailFromAddress}>`;
export const verificationMailFrom = `"${process.env.MAIL_FROM_VERIFICATION_NAME || "Scintel Verification"}" <${mailFromAddress}>`;

export default transporter;
