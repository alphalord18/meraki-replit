import express, { type Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";

export async function registerRoutes(app: Express): Promise<Server> {
  // API route for contact form submission
  app.post('/api/contact', express.json(), async (req, res) => {
    try {
      const { name, email, subject, message } = req.body;

      // Validate request data
      if (!name || !email || !subject || !message) {
        return res.status(400).json({ 
          success: false,
          message: 'All fields are required' 
        });
      }

      // Log successful validation
      console.log('Processing contact form submission for:', email);

      // Import the email function
      const { sendContactEmail } = await import('./email');

      // Send the email
      const emailSent = await sendContactEmail({ name, email, subject, message });

      if (emailSent) {
        res.status(200).json({ 
          success: true,
          message: 'Message received! We will contact you soon.' 
        });
      } else {
        res.status(500).json({ 
          success: false,
          message: 'Failed to send email. Please try again later.' 
        });
      }
    } catch (error) {
      console.error('Contact form error:', error);
      res.status(500).json({ 
        success: false,
        message: 'An error occurred while processing your request' 
      });
    }
  });

  // API route for ticket reservation
  app.post('/api/tickets/reserve', (req, res) => {
    try {
      const { ticketType, quantity, email, name } = req.body;

      // Validate request data
      if (!ticketType || !quantity || !email || !name) {
        return res.status(400).json({ 
          message: 'All fields are required' 
        });
      }

      // In a real application, this would process the reservation
      res.status(200).json({ 
        message: 'Ticket reservation successful!',
        reservationId: `MERAKI-${Date.now()}-${Math.floor(Math.random() * 1000)}`
      });
    } catch (error) {
      res.status(500).json({ 
        message: 'An error occurred while processing your reservation' 
      });
    }
  });

  // API route for newsletter subscription
  app.post('/api/newsletter/subscribe', (req, res) => {
    try {
      const { email } = req.body;

      if (!email) {
        return res.status(400).json({ 
          message: 'Email is required' 
        });
      }

      // In a real application, this would add to a newsletter database
      res.status(200).json({ 
        message: 'Successfully subscribed to the newsletter!' 
      });
    } catch (error) {
      res.status(500).json({ 
        message: 'An error occurred while processing your subscription' 
      });
    }
  });

  // API route for school registration system
  app.post('/api/register', express.json(), async (req, res) => {
    try {
      const { school, participants } = req.body;

      if (!school || !participants || !Array.isArray(participants)) {
        return res.status(400).json({
          success: false,
          message: 'Invalid registration data format'
        });
      }

      // Use the registration service to handle the database operations
      const { school: registeredSchool, participants: registeredParticipants } = 
        await completeRegistration(school, participants);

      res.status(200).json({
        success: true,
        message: 'Registration successful!',
        school: registeredSchool,
        participants: registeredParticipants
      });
    } catch (error) {
      console.error('Registration error:', error);
      res.status(500).json({
        success: false,
        message: error instanceof Error ? error.message : 'Registration failed'
      });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}