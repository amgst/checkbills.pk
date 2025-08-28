import { sql } from "drizzle-orm";
import { pgTable, text, varchar, timestamp, jsonb, boolean } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const billServices = pgTable("bill_services", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  name: text("name").notNull(),
  category: text("category").notNull(), // electricity, gas, mobile, internet, water, etc.
  provider: text("provider").notNull(), // LESCO, FESCO, Jazz, etc.
  icon: text("icon").notNull(),
  description: text("description").notNull(),
  apiEndpoint: text("api_endpoint"),
  isActive: boolean("is_active").default(true),
  createdAt: timestamp("created_at").defaultNow(),
});

export const billChecks = pgTable("bill_checks", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  serviceId: varchar("service_id").references(() => billServices.id),
  billNumber: text("bill_number").notNull(),
  customerReference: text("customer_reference"),
  billData: jsonb("bill_data"), // Store the bill details as JSON
  status: text("status").notNull(), // found, not_found, error
  checkedAt: timestamp("checked_at").defaultNow(),
  userAgent: text("user_agent"),
  ipAddress: text("ip_address"),
});

export const billReminders = pgTable("bill_reminders", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  serviceId: varchar("service_id").references(() => billServices.id),
  billNumber: text("bill_number").notNull(),
  customerReference: text("customer_reference"),
  email: text("email"),
  phone: text("phone"),
  reminderDay: text("reminder_day").notNull(), // day of month (1-31)
  isActive: boolean("is_active").default(true),
  createdAt: timestamp("created_at").defaultNow(),
});

export const insertBillServiceSchema = createInsertSchema(billServices).omit({
  id: true,
  createdAt: true,
});

export const insertBillCheckSchema = createInsertSchema(billChecks).omit({
  id: true,
  checkedAt: true,
});

export const insertBillReminderSchema = createInsertSchema(billReminders).omit({
  id: true,
  createdAt: true,
});

export const billCheckRequestSchema = z.object({
  serviceId: z.string(),
  billNumber: z.string().min(1, "Bill number is required"),
  customerReference: z.string().optional(),
});

export type BillService = typeof billServices.$inferSelect;
export type InsertBillService = z.infer<typeof insertBillServiceSchema>;
export type BillCheck = typeof billChecks.$inferSelect;
export type InsertBillCheck = z.infer<typeof insertBillCheckSchema>;
export type BillReminder = typeof billReminders.$inferSelect;
export type InsertBillReminder = z.infer<typeof insertBillReminderSchema>;
export type BillCheckRequest = z.infer<typeof billCheckRequestSchema>;
