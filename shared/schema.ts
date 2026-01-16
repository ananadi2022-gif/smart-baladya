import { pgTable, text, serial, integer, boolean, timestamp, varchar } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";
import { relations } from "drizzle-orm";

export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  fullName: text("full_name").notNull(),
  cin: text("cin").notNull().unique(), // National ID
  password: text("password").notNull(),
  role: text("role", { enum: ["citizen", "admin"] }).default("citizen").notNull(),
  createdAt: timestamp("created_at").defaultNow(),
});

export const requests = pgTable("requests", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").notNull(),
  type: text("type").notNull(), // e.g., "Birth Certificate", "Residence Certificate"
  status: text("status", { enum: ["Pending", "Approved", "Ready", "Rejected"] }).default("Pending").notNull(),
  createdAt: timestamp("created_at").defaultNow(),
});

export const reports = pgTable("reports", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").notNull(),
  category: text("category").notNull(), // Road, Trash, Lighting, Water
  location: text("location").notNull(),
  description: text("description"),
  imageUrl: text("image_url"),
  status: text("status", { enum: ["Pending", "In Progress", "Resolved"] }).default("Pending").notNull(),
  createdAt: timestamp("created_at").defaultNow(),
});

// Relations
export const requestsRelations = relations(requests, ({ one }) => ({
  user: one(users, {
    fields: [requests.userId],
    references: [users.id],
  }),
}));

export const reportsRelations = relations(reports, ({ one }) => ({
  user: one(users, {
    fields: [reports.userId],
    references: [users.id],
  }),
}));

// Schemas
export const insertUserSchema = createInsertSchema(users).omit({ id: true, createdAt: true });
export const insertRequestSchema = createInsertSchema(requests).omit({ id: true, createdAt: true, status: true });
export const insertReportSchema = createInsertSchema(reports).omit({ id: true, createdAt: true, status: true });

// Types
export type User = typeof users.$inferSelect;
export type InsertUser = z.infer<typeof insertUserSchema>;
export type Request = typeof requests.$inferSelect;
export type InsertRequest = z.infer<typeof insertRequestSchema>;
export type Report = typeof reports.$inferSelect;
export type InsertReport = z.infer<typeof insertReportSchema>;
