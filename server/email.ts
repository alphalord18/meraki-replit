import nodemailer from 'nodemailer';

// Define the contact email data type
interface ContactEmailData {
  name: string;
  email: string;
  subject: string;
  message: string;
}

// Create a nodemailer transport with Gmail credentials
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: 'aaravgarg1812@gmail.com', // Sender email
    pass: process.env.GMAIL_APP_PASSWORD // App password from Gmail
  }
});

/**
 * Sends an email from the contact form
 * @param contactData The data from the contact form
 * @returns A boolean indicating if the email was sent successfully
 */
export async function sendContactEmail(contactData: ContactEmailData): Promise<boolean> {
  const { name, email, subject, message } = contactData;
  
  try {
    // Create mail options
    const mailOptions = {
      from: 'aaravgarg1812@gmail.com', // Sender address
      to: 'aaravgarg649@gmail.com', // Recipient address
      subject: `MerakiFest Contact Form: ${subject}`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #06D6A0;">New Contact Form Submission</h2>
          <p><strong>Name:</strong> ${name}</p>
          <p><strong>Email:</strong> ${email}</p>
          <p><strong>Subject:</strong> ${subject}</p>
          <h3>Message:</h3>
          <div style="background-color: #f9f9f9; padding: 15px; border-radius: 5px;">
            ${message.replace(/\n/g, '<br>')}
          </div>
          <p style="margin-top: 20px; font-size: 12px; color: #666;">This message was sent from the MerakiFest contact form.</p>
        </div>
      `,
      text: `
        New Contact Form Submission
        
        Name: ${name}
        Email: ${email}
        Subject: ${subject}
        
        Message:
        ${message}
        
        This message was sent from the MerakiFest contact form.
      `
    };
    
    // Send the email
    const info = await transporter.sendMail(mailOptions);
    console.log('Email sent successfully:', info.messageId);
    return true;
  } catch (error) {
    console.error('Error sending email:', error);
    return false;
  }
}