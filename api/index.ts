import express, { type Request, Response, NextFunction } from "express";
import { storage } from "../server/storage";

const app = express();

// Add CORS headers for Vercel
app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, Authorization');
  
  if (req.method === 'OPTIONS') {
    res.sendStatus(200);
  } else {
    next();
  }
});

app.use(express.json());
app.use(express.urlencoded({ extended: false }));

// Health check endpoint
app.get("/api/health", (req, res) => {
  res.json({ status: "ok", timestamp: new Date().toISOString() });
});

// Test endpoint to check storage
app.get("/api/test", async (req, res) => {
  try {
    const services = await storage.getBillServices();
    res.json({ 
      message: "Storage test successful", 
      serviceCount: services.length,
      firstService: services[0]?.name || "No services found"
    });
  } catch (error) {
    res.status(500).json({ error: "Storage test failed", details: error.message });
  }
});

// Get all bill services
app.get("/api/services", async (req, res) => {
  try {
    console.log('Fetching services from storage...');
    const services = await storage.getBillServices();
    console.log('Services fetched:', services.length);
    res.json(services);
  } catch (error) {
    console.error('Error fetching services:', error);
    res.status(500).json({ error: "Failed to fetch services", details: error.message });
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

app.use((err: any, _req: Request, res: Response, _next: NextFunction) => {
  const status = err.status || err.statusCode || 500;
  const message = err.message || "Internal Server Error";
  res.status(status).json({ message });
  console.error(err);
});

// Export the Express app for Vercel
export default app;