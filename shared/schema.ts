import { pgTable, text, serial, timestamp, boolean, jsonb } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  email: text("email").notNull().unique(),
  password: text("password").notNull(),
  isAdmin: boolean("is_admin").default(false),
});

export const events = pgTable("events", {
  id: serial("id").primaryKey(),
  title: text("title").notNull(),
  description: text("description").notNull(),
  rules: text("rules").notNull(),
  date: timestamp("date").notNull(),
  venue: text("venue").notNull(),
  category: text("category").notNull(),
  registrationOpen: boolean("registration_open").default(true),
});

export const speakers = pgTable("speakers", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  bio: text("bio").notNull(),
  designation: text("designation").notNull(),
  imageUrl: text("image_url").notNull(),
  socialLinks: jsonb("social_links").$type<{
    linkedin?: string;
    twitter?: string;
    website?: string;
  }>(),
});

export const blogs = pgTable("blogs", {
  id: serial("id").primaryKey(),
  title: text("title").notNull(),
  content: text("content").notNull(),
  author: text("author").notNull(),
  imageUrl: text("image_url"),
  createdAt: timestamp("created_at").defaultNow(),
});

export const sponsors = pgTable("sponsors", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  tier: text("tier").notNull(),
  logoUrl: text("logo_url").notNull(),
  website: text("website"),
});

// Insert Schemas
export const insertUserSchema = createInsertSchema(users);
export const insertEventSchema = createInsertSchema(events);
export const insertSpeakerSchema = createInsertSchema(speakers);
export const insertBlogSchema = createInsertSchema(blogs);
export const insertSponsorSchema = createInsertSchema(sponsors);

// Types
export type User = typeof users.$inferSelect;
export type Event = typeof events.$inferSelect;
export type Speaker = typeof speakers.$inferSelect;
export type Blog = typeof blogs.$inferSelect;
export type Sponsor = typeof sponsors.$inferSelect;

export type InsertUser = z.infer<typeof insertUserSchema>;
export type InsertEvent = z.infer<typeof insertEventSchema>;
export type InsertSpeaker = z.infer<typeof insertSpeakerSchema>;
export type InsertBlog = z.infer<typeof insertBlogSchema>;
export type InsertSponsor = z.infer<typeof insertSponsorSchema>;
