import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { billCheckRequestSchema, type BillCheckRequest } from "@shared/schema";
import { LescoScraper } from "./services/lesco-scraper";
import { z } from "zod";

export async function registerRoutes(app: Express): Promise<Server> {
  
  // Get all bill services
  app.get("/api/services", async (req, res) => {
    try {
      const services = await storage.getBillServices();
      res.json(services);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch services" });
    }
  });

  // Get single service by ID
  app.get("/api/services/:id", async (req, res) => {
    try {
      const { id } = req.params;
      const service = await storage.getBillService(id);
      if (!service) {
        return res.status(404).json({ error: "Service not found" });
      }
      res.json(service);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch service" });
    }
  });

  // Get services by category
  app.get("/api/services/category/:category", async (req, res) => {
    try {
      const { category } = req.params;
      const services = await storage.getBillServicesByCategory(category);
      res.json(services);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch services by category" });
    }
  });

  // Check bill
  app.post("/api/bills/check", async (req, res) => {
    try {
      const validatedData = billCheckRequestSchema.parse(req.body);
      const { serviceId, billNumber, customerReference } = validatedData;

      // Get service details
      const service = await storage.getBillService(serviceId);
      if (!service) {
        return res.status(404).json({ error: "Service not found" });
      }

      // Check if this is a LESCO bill - use real scraping
      let billData = null;
      let status = "not_found";

      if (service.name === "LESCO") {
        console.log(`Checking LESCO bill: ${billNumber}`);
        try {
          const lescoResult = await LescoScraper.checkBill(billNumber, customerReference);
          
          if (lescoResult.success) {
            status = "found";
            billData = {
              billNumber: lescoResult.billNumber,
              customerReference: lescoResult.customerReference,
              customerName: lescoResult.customerName || "LESCO Customer",
              billingMonth: lescoResult.billingMonth || new Date().toLocaleDateString('en-US', { month: 'long', year: 'numeric' }),
              amount: lescoResult.amount || 0,
              dueDate: lescoResult.dueDate || new Date(Date.now() + 15 * 24 * 60 * 60 * 1000).toLocaleDateString('en-GB'),
              issueDate: lescoResult.issueDate,
              status: lescoResult.status === 'unpaid' ? 'unpaid' : 'paid',
              serviceProvider: lescoResult.serviceProvider,
              address: lescoResult.address,
              units: lescoResult.units,
              tariff: lescoResult.tariff,
            };
          } else {
            status = "not_found";
            console.log('LESCO bill not found:', lescoResult.error);
          }
        } catch (error) {
          console.error('LESCO scraping failed:', error);
          status = "error";
        }
      } else {
        // For other services, use mock data for now
        if (billNumber.length >= 10) {
          status = "found";
          billData = {
            billNumber,
            customerReference,
            customerName: "Sample Customer",
            billingMonth: new Date().toLocaleDateString('en-US', { month: 'long', year: 'numeric' }),
            amount: Math.floor(Math.random() * 10000) + 1000,
            dueDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toLocaleDateString(),
            status: "unpaid",
            serviceProvider: service.provider,
          };
        }
      }

      // Store bill check record
      const billCheck = await storage.createBillCheck({
        serviceId,
        billNumber,
        customerReference,
        billData,
        status,
        userAgent: req.headers['user-agent'] || '',
        ipAddress: req.ip || req.connection.remoteAddress || '',
      });

      res.json({
        success: status === "found",
        billData,
        status,
        service: service.name,
        checkId: billCheck.id,
      });

    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ error: "Invalid request data", details: error.errors });
      }
      res.status(500).json({ error: "Failed to check bill" });
    }
  });

  // Get recent bill checks
  app.get("/api/bills/recent", async (req, res) => {
    try {
      const limit = parseInt(req.query.limit as string) || 10;
      const recentChecks = await storage.getRecentBillChecks(limit);
      
      // Enhance with service information
      const enhancedChecks = await Promise.all(
        recentChecks.map(async (check) => {
          const service = check.serviceId ? await storage.getBillService(check.serviceId) : null;
          return {
            ...check,
            serviceName: service?.name || 'Unknown',
            serviceProvider: service?.provider || 'Unknown',
          };
        })
      );

      res.json(enhancedChecks);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch recent bill checks" });
    }
  });

  // Create bill reminder
  app.post("/api/reminders", async (req, res) => {
    try {
      const reminderData = req.body;
      const reminder = await storage.createBillReminder(reminderData);
      res.json(reminder);
    } catch (error) {
      res.status(500).json({ error: "Failed to create reminder" });
    }
  });

  // Get all reminders
  app.get("/api/reminders", async (req, res) => {
    try {
      const reminders = await storage.getBillReminders();
      res.json(reminders);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch reminders" });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}
