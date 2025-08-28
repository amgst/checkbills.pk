import { z } from "zod";

// Zod schemas for validation
export const billCheckRequestSchema = z.object({
  serviceId: z.string(),
  billNumber: z.string().min(1, "Bill number is required"),
  customerReference: z.string().optional(),
});

export const insertBillServiceSchema = z.object({
  name: z.string(),
  category: z.string(),
  provider: z.string(),
  icon: z.string(),
  description: z.string(),
  apiEndpoint: z.string().optional(),
  isActive: z.boolean().default(true),
});

export const insertBillCheckSchema = z.object({
  serviceId: z.string().optional(),
  billNumber: z.string(),
  customerReference: z.string().optional(),
  billData: z.any().optional(),
  status: z.string(),
  userAgent: z.string().optional(),
  ipAddress: z.string().optional(),
});

export const insertBillReminderSchema = z.object({
  serviceId: z.string().optional(),
  billNumber: z.string(),
  customerReference: z.string().optional(),
  email: z.string().optional(),
  phone: z.string().optional(),
  reminderDay: z.string(),
  isActive: z.boolean().default(true),
});

// TypeScript types
export type BillService = {
  id: string;
  name: string;
  category: string;
  provider: string;
  icon: string;
  description: string;
  apiEndpoint?: string;
  isActive: boolean;
  createdAt: Date;
};

export type BillCheck = {
  id: string;
  serviceId?: string;
  billNumber: string;
  customerReference?: string;
  billData?: any;
  status: string;
  checkedAt: Date;
  userAgent?: string;
  ipAddress?: string;
};

export type BillReminder = {
  id: string;
  serviceId?: string;
  billNumber: string;
  customerReference?: string;
  email?: string;
  phone?: string;
  reminderDay: string;
  isActive: boolean;
  createdAt: Date;
};

// Inferred types from Zod schemas
export type InsertBillService = z.infer<typeof insertBillServiceSchema>;
export type InsertBillCheck = z.infer<typeof insertBillCheckSchema>;
export type InsertBillReminder = z.infer<typeof insertBillReminderSchema>;
export type BillCheckRequest = z.infer<typeof billCheckRequestSchema>;
