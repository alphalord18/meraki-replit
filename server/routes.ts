import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { insertUserSchema, insertEventSchema, insertSpeakerSchema, insertBlogSchema, insertSponsorSchema } from "@shared/schema";

export async function registerRoutes(app: Express): Promise<Server> {

  // Events routes
  app.get("/api/events", async (_req, res) => {
    const events = await storage.getEvents();
    res.json(events);
  });

  app.get("/api/events/:id", async (req, res) => {
    const event = await storage.getEvent(Number(req.params.id));
    if (!event) return res.status(404).json({ message: "Event not found" });
    res.json(event);
  });

  app.post("/api/events", async (req, res) => {
    const parsed = insertEventSchema.safeParse(req.body);
    if (!parsed.success) {
      return res.status(400).json({ errors: parsed.error.errors });
    }
    const event = await storage.createEvent(parsed.data);
    res.json(event);
  });

  // Speakers routes
  app.get("/api/speakers", async (_req, res) => {
    const speakers = await storage.getSpeakers();
    res.json(speakers);
  });

  app.get("/api/speakers/:id", async (req, res) => {
    const speaker = await storage.getSpeaker(Number(req.params.id));
    if (!speaker) return res.status(404).json({ message: "Speaker not found" });
    res.json(speaker);
  });

  app.post("/api/speakers", async (req, res) => {
    const parsed = insertSpeakerSchema.safeParse(req.body);
    if (!parsed.success) {
      return res.status(400).json({ errors: parsed.error.errors });
    }
    const speaker = await storage.createSpeaker(parsed.data);
    res.json(speaker);
  });

  // Blogs routes
  app.get("/api/blogs", async (_req, res) => {
    const blogs = await storage.getBlogs();
    res.json(blogs);
  });

  app.get("/api/blogs/:id", async (req, res) => {
    const blog = await storage.getBlog(Number(req.params.id));
    if (!blog) return res.status(404).json({ message: "Blog not found" });
    res.json(blog);
  });

  app.post("/api/blogs", async (req, res) => {
    const parsed = insertBlogSchema.safeParse(req.body);
    if (!parsed.success) {
      return res.status(400).json({ errors: parsed.error.errors });
    }
    const blog = await storage.createBlog(parsed.data);
    res.json(blog);
  });

  // Sponsors routes
  app.get("/api/sponsors", async (_req, res) => {
    const sponsors = await storage.getSponsors();
    res.json(sponsors);
  });

  app.get("/api/sponsors/:id", async (req, res) => {
    const sponsor = await storage.getSponsor(Number(req.params.id));
    if (!sponsor) return res.status(404).json({ message: "Sponsor not found" });
    res.json(sponsor);
  });

  app.post("/api/sponsors", async (req, res) => {
    const parsed = insertSponsorSchema.safeParse(req.body);
    if (!parsed.success) {
      return res.status(400).json({ errors: parsed.error.errors });
    }
    const sponsor = await storage.createSponsor(parsed.data);
    res.json(sponsor);
  });

  const httpServer = createServer(app);
  return httpServer;
}
