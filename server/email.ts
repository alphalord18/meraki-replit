import nodemailer from "nodemailer";

// App password should be replaced with your actual app password from Google Account
// This is a more secure way than using your actual password
const APP_PASSWORD = "YOUR_APP_PASSWORD_HERE"; // Replace this with the actual app password

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: "aaravgarg1812@gmail.com",
    pass: APP_PASSWORD,
  },
});

interface ContactEmailData {
  name: string;
  email: string;
  subject: string;
  message: string;
}

export async function sendContactEmail(contactData: ContactEmailData): Promise<boolean> {
  const { name, email, subject, message } = contactData;
  
  const htmlContent = `
    <h2>New Contact Form Submission</h2>
    <p><strong>From:</strong> ${name} (${email})</p>
    <p><strong>Subject:</strong> ${subject}</p>
    <h3>Message:</h3>
    <p>${message}</p>
  `;
  
  try {
    await transporter.sendMail({
      from: "aaravgarg1812@gmail.com",
      to: "aaravgarg649@gmail.com",
      subject: `Contact Form: ${subject}`,
      html: htmlContent,
    });
    return true;
  } catch (error) {
    console.error("Email sending failed:", error);
    return false;
  }
}
