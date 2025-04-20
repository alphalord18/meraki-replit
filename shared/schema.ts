import { pgTable, text, serial, timestamp, boolean, jsonb, integer, varchar } from "drizzle-orm/pg-core";
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

// Registration tables for the school registration system
export const schools = pgTable("schools", {
  school_id: varchar("school_id", { length: 10 }).primaryKey(),
  school_name: text("school_name").notNull(),
  address: text("address").notNull(),
  coordinator_name: text("coordinator_name").notNull(),
  coordinator_email: text("coordinator_email").notNull(),
  coordinator_phone: text("coordinator_phone").notNull(),
});

export const festival_events = pgTable("festival_events", {
  event_id: serial("event_id").primaryKey(),
  event_name: text("event_name").notNull(),
});

export const event_categories = pgTable("event_categories", {
  category_id: serial("category_id").primaryKey(),
  category_name: text("category_name").notNull(),
  min_class: integer("min_class").notNull(),
  max_class: integer("max_class").notNull(),
});

export const event_category_links = pgTable("event_category_links", {
  id: serial("id").primaryKey(),
  event_id: integer("event_id").notNull(),
  category_id: integer("category_id").notNull(),
  max_participants: integer("max_participants").notNull(),
});

export const participants = pgTable("participants", {
  s_no: serial("s_no").primaryKey(),
  school_id: varchar("school_id", { length: 10 }).notNull(),
  event_id: integer("event_id").notNull(),
  category_id: integer("category_id").notNull(),
  participant_name: text("participant_name").notNull(),
  class: integer("class").notNull(),
  slot: integer("slot").notNull(),
});

// Insert Schemas
export const insertUserSchema = createInsertSchema(users);
export const insertEventSchema = createInsertSchema(events);
export const insertSpeakerSchema = createInsertSchema(speakers);
export const insertBlogSchema = createInsertSchema(blogs);
export const insertSponsorSchema = createInsertSchema(sponsors);

// Registration Insert Schemas
export const insertSchoolSchema = createInsertSchema(schools);
export const insertFestivalEventSchema = createInsertSchema(festival_events);
export const insertEventCategorySchema = createInsertSchema(event_categories);
export const insertEventCategoryLinkSchema = createInsertSchema(event_category_links);
export const insertParticipantSchema = createInsertSchema(participants);

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

// Registration Types
export type School = typeof schools.$inferSelect;
export type FestivalEvent = typeof festival_events.$inferSelect;
export type EventCategory = typeof event_categories.$inferSelect;
export type EventCategoryLink = typeof event_category_links.$inferSelect;
export type Participant = typeof participants.$inferSelect;

export type InsertSchool = z.infer<typeof insertSchoolSchema>;
export type InsertFestivalEvent = z.infer<typeof insertFestivalEventSchema>;
export type InsertEventCategory = z.infer<typeof insertEventCategorySchema>;
export type InsertEventCategoryLink = z.infer<typeof insertEventCategoryLinkSchema>;
export type InsertParticipant = z.infer<typeof insertParticipantSchema>;
