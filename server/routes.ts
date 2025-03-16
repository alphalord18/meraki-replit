import { collection, addDoc, getFirestore } from "firebase/firestore";
import { initializeApp } from "firebase/app";
import { Express } from "express";

const firebaseConfig = {
  apiKey: process.env.FIREBASE_API_KEY, // Fixed issue with VITE_ prefix
  authDomain: process.env.FIREBASE_AUTH_DOMAIN,
  projectId: process.env.FIREBASE_PROJECT_ID,
  storageBucket: process.env.FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.FIREBASE_APP_ID
};

const firebaseApp = initializeApp(firebaseConfig);
const db = getFirestore(firebaseApp); // Ensure Firestore is properly initialized

import {
  users,
  events,
  speakers,
  blogs,
  sponsors,
  type User,
  type Event,
  type Speaker,
  type Blog,
  type Sponsor,
  type InsertUser,
  type InsertEvent,
  type InsertSpeaker,
  type InsertBlog,
  type InsertSponsor,
} from "@shared/schema";

export interface IStorage {
  getUser(id: number): Promise<User | undefined>;
  getUserByEmail(email: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;

  getEvents(): Promise<Event[]>;
  getEvent(id: number): Promise<Event | undefined>;
  createEvent(event: InsertEvent): Promise<Event>;
  updateEvent(id: number, event: Partial<InsertEvent>): Promise<Event>;

  getSpeakers(): Promise<Speaker[]>;
  getSpeaker(id: number): Promise<Speaker | undefined>;
  createSpeaker(speaker: InsertSpeaker): Promise<Speaker>;
  updateSpeaker(id: number, speaker: Partial<InsertSpeaker>): Promise<Speaker>;

  getBlogs(): Promise<Blog[]>;
  getBlog(id: number): Promise<Blog | undefined>;
  createBlog(blog: InsertBlog): Promise<Blog>;

  getSponsors(): Promise<Sponsor[]>;
  getSponsor(id: number): Promise<Sponsor | undefined>;
  createSponsor(sponsor: InsertSponsor): Promise<Sponsor>;

  createRegistration(registration: any): Promise<void>;
}

export class MemStorage implements IStorage {
  private users: Map<number, User>;
  private events: Map<number, Event>;
  private speakers: Map<number, Speaker>;
  private blogs: Map<number, Blog>;
  private sponsors: Map<number, Sponsor>;
  private currentId: { [key: string]: number };

  constructor() {
    this.users = new Map();
    this.events = new Map();
    this.speakers = new Map();
    this.blogs = new Map();
    this.sponsors = new Map();
    this.currentId = { users: 1, events: 1, speakers: 1, blogs: 1, sponsors: 1 };
  }

  async getUser(id: number): Promise<User | undefined> {
    return this.users.get(id);
  }

  async getUserByEmail(email: string): Promise<User | undefined> {
    return Array.from(this.users.values()).find((user) => user.email === email);
  }

  async createUser(user: InsertUser): Promise<User> {
    const id = this.currentId.users++;
    const newUser = { ...user, id };
    this.users.set(id, newUser);
    return newUser;
  }

  async getEvents(): Promise<Event[]> {
    return Array.from(this.events.values());
  }

  async getEvent(id: number): Promise<Event | undefined> {
    return this.events.get(id);
  }

  async createEvent(event: InsertEvent): Promise<Event> {
    const id = this.currentId.events++;
    const newEvent = { ...event, id };
    this.events.set(id, newEvent);
    return newEvent;
  }

  async updateEvent(id: number, event: Partial<InsertEvent>): Promise<Event> {
    const existing = await this.getEvent(id);
    if (!existing) throw new Error("Event not found");
    const updated = { ...existing, ...event };
    this.events.set(id, updated);
    return updated;
  }

  async getSpeakers(): Promise<Speaker[]> {
    return Array.from(this.speakers.values());
  }

  async getSpeaker(id: number): Promise<Speaker | undefined> {
    return this.speakers.get(id);
  }

  async createSpeaker(speaker: InsertSpeaker): Promise<Speaker> {
    const id = this.currentId.speakers++;
    const newSpeaker = { ...speaker, id };
    this.speakers.set(id, newSpeaker);
    return newSpeaker;
  }

  async updateSpeaker(id: number, speaker: Partial<InsertSpeaker>): Promise<Speaker> {
    const existing = await this.getSpeaker(id);
    if (!existing) throw new Error("Speaker not found");
    const updated = { ...existing, ...speaker };
    this.speakers.set(id, updated);
    return updated;
  }

  async getBlogs(): Promise<Blog[]> {
    return Array.from(this.blogs.values());
  }

  async getBlog(id: number): Promise<Blog | undefined> {
    return this.blogs.get(id);
  }

  async createBlog(blog: InsertBlog): Promise<Blog> {
    const id = this.currentId.blogs++;
    const newBlog = { ...blog, id, createdAt: new Date() };
    this.blogs.set(id, newBlog);
    return newBlog;
  }

  async getSponsors(): Promise<Sponsor[]> {
    return Array.from(this.sponsors.values());
  }

  async getSponsor(id: number): Promise<Sponsor | undefined> {
    return this.sponsors.get(id);
  }

  async createSponsor(sponsor: InsertSponsor): Promise<Sponsor> {
    const id = this.currentId.sponsors++;
    const newSponsor = { ...sponsor, id };
    this.sponsors.set(id, newSponsor);
    return newSponsor;
  }

  async createRegistration(registration: any): Promise<void> {
    try {
      const registrationsRef = collection(db, "registrations");
      await addDoc(registrationsRef, registration);
      console.log("Registration added successfully!");
    } catch (error) {
      console.error("Error adding registration: ", error);
      throw new Error("Failed to register user.");
    }
  }
}

export const storage = new MemStorage();

export const registerRoutes = (app: Express) => {
  app.post('/api/register', async (req, res) => {
    try {
      const registrationData = req.body;
      
      if (!registrationData.email || !registrationData.name) {
        return res.status(400).json({ message: "Missing required fields" });
      }

      const registrationsRef = collection(db, "registrations");
      await addDoc(registrationsRef, registrationData);
      
      res.status(200).json({ message: "Registration successful" });
    } catch (error) {
      console.error("Error in registration:", error);
      res.status(500).json({ message: "Registration failed" });
    }
  });

  return app;
};
