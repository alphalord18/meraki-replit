
import nodemailer from 'nodemailer';

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: 'firebase-adminsdk-fbsvc@merakifest-d9822.iam.gserviceaccount.com',
    pass: process.env.EMAIL_PASSWORD
  }
});

export async function sendEmail(emailData: { to: string, subject: string, html: string }) {
  try {
    await transporter.sendMail({
      from: 'firebase-adminsdk-fbsvc@merakifest-d9822.iam.gserviceaccount.com',
      ...emailData
    });
  } catch (error) {
    console.error('Email sending failed:', error);
    throw error;
  }
}
