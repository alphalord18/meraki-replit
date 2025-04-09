import { NextApiRequest, NextApiResponse } from 'next';
import nodemailer from 'nodemailer';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  // Only allow POST requests
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  try {
    const { name, email, message } = req.body;
    
    // Validate required fields
    if (!name || !email || !message) {
      return res.status(400).json({ message: 'Name, email, and message are required' });
    }

    // Create email transporter
    // Make sure EMAIL_APP_PASSWORD is properly set in your .env file
    const transporter = nodemailer.createTransport({
      host: 'smtp.gmail.com',
      port: 587,
      secure: false, // true for 465, false for other ports
      auth: {
        user: process.env.EMAIL_USER || 'aaravgarg1812@gmail.com',
        pass: process.env.EMAIL_APP_PASSWORD, // use environment variable
      },
    });

    if (!process.env.EMAIL_APP_PASSWORD) {
      throw new Error('EMAIL_APP_PASSWORD is not set in environment variables');
    }

    // Email content
    const mailOptions = {
      from: `"Contact Form" <${process.env.EMAIL_USER || 'aaravgarg1812@gmail.com'}>`,
      to: process.env.EMAIL_RECIPIENT || 'aaravgarg1812@gmail.com',
      subject: `Contact Form: Message from ${name}`,
      text: `Name: ${name}\nEmail: ${email}\n\nMessage:\n${message}`, // Plain text fallback
      html: `
        <div style="font-family: Arial, sans-serif; padding: 20px; border: 1px solid #eaeaea;">
          <h2 style="color: #2E4A7D;">New Contact Form Submission</h2>
          <p><strong>Name:</strong> ${name}</p>
          <p><strong>Email:</strong> ${email}</p>
          <p><strong>Message:</strong></p>
          <div style="background-color: #f9f9f9; padding: 15px; border-radius: 5px;">
            ${message.replace(/\n/g, '<br>')}
          </div>
        </div>
      `
    };

    // Send email
    await transporter.sendMail(mailOptions);
    
    // Return success
    return res.status(200).json({ message: 'Email sent successfully' });
  } catch (error) {
    console.error('Error sending email:', error);
    
    // Send a proper JSON error response
    return res.status(500).json({ 
      message: 'Failed to send email', 
      error: error instanceof Error ? error.message : 'Unknown error' 
    });
  }
}
