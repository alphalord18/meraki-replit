import nodemailer from "nodemailer";

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: "aaravgarg1812@gmail.com",
    pass: process.env.EMAIL_PASSWORD,
  },
});

export async function sendEmail(emailData: {
  to: string;
  subject: string;
  html: string;
}) {
  try {
    await transporter.sendMail({
      from: "aaravgarg1812@gmail.com",
      ...emailData,
    });
  } catch (error) {
    console.error("Email sending failed:", error);
    throw error;
  }
}
