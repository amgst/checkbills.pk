import { type BillService, type InsertBillService, type BillCheck, type InsertBillCheck, type BillReminder, type InsertBillReminder } from "@shared/schema";
import { randomUUID } from "crypto";

export interface IStorage {
  // Bill Services
  getBillServices(): Promise<BillService[]>;
  getBillServicesByCategory(category: string): Promise<BillService[]>;
  getBillService(id: string): Promise<BillService | undefined>;
  createBillService(service: InsertBillService): Promise<BillService>;
  
  // Bill Checks
  createBillCheck(billCheck: InsertBillCheck): Promise<BillCheck>;
  getRecentBillChecks(limit?: number): Promise<BillCheck[]>;
  getBillChecksByService(serviceId: string): Promise<BillCheck[]>;
  
  // Bill Reminders
  createBillReminder(reminder: InsertBillReminder): Promise<BillReminder>;
  getBillReminders(): Promise<BillReminder[]>;
  updateBillReminder(id: string, updates: Partial<BillReminder>): Promise<BillReminder | undefined>;
}

export class MemStorage implements IStorage {
  private billServices: Map<string, BillService> = new Map();
  private billChecks: Map<string, BillCheck> = new Map();
  private billReminders: Map<string, BillReminder> = new Map();

  constructor() {
    this.initializeServices();
  }

  private initializeServices() {
    const services: InsertBillService[] = [
      // Electricity Services
      {
        name: "LESCO",
        category: "electricity",
        provider: "Lahore Electric Supply Company",
        icon: "fas fa-bolt",
        description: "Check your LESCO electricity bill online instantly",
        apiEndpoint: "/api/bills/lesco",
        isActive: true,
      },
      {
        name: "FESCO",
        category: "electricity",
        provider: "Faisalabad Electric Supply Company",
        icon: "fas fa-bolt",
        description: "Check your FESCO electricity bill online instantly",
        apiEndpoint: "/api/bills/fesco",
        isActive: true,
      },
      {
        name: "MEPCO",
        category: "electricity",
        provider: "Multan Electric Power Company",
        icon: "fas fa-bolt",
        description: "Check your MEPCO electricity bill online instantly",
        apiEndpoint: "/api/bills/mepco",
        isActive: true,
      },
      {
        name: "IESCO",
        category: "electricity",
        provider: "Islamabad Electric Supply Company",
        icon: "fas fa-bolt",
        description: "Check your IESCO electricity bill online instantly",
        apiEndpoint: "/api/bills/iesco",
        isActive: true,
      },
      {
        name: "GEPCO",
        category: "electricity",
        provider: "Gujranwala Electric Power Company",
        icon: "fas fa-bolt",
        description: "Check your GEPCO electricity bill online instantly",
        apiEndpoint: "/api/bills/gepco",
        isActive: true,
      },
      {
        name: "HESCO",
        category: "electricity",
        provider: "Hyderabad Electric Supply Company",
        icon: "fas fa-bolt",
        description: "Check your HESCO electricity bill online instantly",
        apiEndpoint: "/api/bills/hesco",
        isActive: true,
      },
      {
        name: "SEPCO",
        category: "electricity",
        provider: "Sukkur Electric Power Company",
        icon: "fas fa-bolt",
        description: "Check your SEPCO electricity bill online instantly",
        apiEndpoint: "/api/bills/sepco",
        isActive: true,
      },
      {
        name: "TESCO",
        category: "electricity",
        provider: "Tribal Electric Supply Company",
        icon: "fas fa-bolt",
        description: "Check your TESCO electricity bill online instantly",
        apiEndpoint: "/api/bills/tesco",
        isActive: true,
      },
      // Gas Services
      {
        name: "SNGPL",
        category: "gas",
        provider: "Sui Northern Gas Pipelines Limited",
        icon: "fas fa-fire",
        description: "Check your SNGPL gas bill online instantly",
        apiEndpoint: "/api/bills/sngpl",
        isActive: true,
      },
      {
        name: "SSGCL",
        category: "gas",
        provider: "Sui Southern Gas Company Limited",
        icon: "fas fa-fire",
        description: "Check your SSGCL gas bill online instantly",
        apiEndpoint: "/api/bills/ssgcl",
        isActive: true,
      },
      // Mobile Services
      {
        name: "Jazz",
        category: "mobile",
        provider: "Jazz Pakistan",
        icon: "fas fa-mobile-alt",
        description: "Check your Jazz mobile bill online instantly",
        apiEndpoint: "/api/bills/jazz",
        isActive: true,
      },
      {
        name: "Telenor",
        category: "mobile",
        provider: "Telenor Pakistan",
        icon: "fas fa-mobile-alt",
        description: "Check your Telenor mobile bill online instantly",
        apiEndpoint: "/api/bills/telenor",
        isActive: true,
      },
      {
        name: "Zong",
        category: "mobile",
        provider: "Zong 4G Pakistan",
        icon: "fas fa-mobile-alt",
        description: "Check your Zong mobile bill online instantly",
        apiEndpoint: "/api/bills/zong",
        isActive: true,
      },
      {
        name: "Ufone",
        category: "mobile",
        provider: "Ufone Pakistan",
        icon: "fas fa-mobile-alt",
        description: "Check your Ufone mobile bill online instantly",
        apiEndpoint: "/api/bills/ufone",
        isActive: true,
      },
      // Internet Services
      {
        name: "PTCL",
        category: "internet",
        provider: "Pakistan Telecommunication Company Limited",
        icon: "fas fa-wifi",
        description: "Check your PTCL internet bill online instantly",
        apiEndpoint: "/api/bills/ptcl",
        isActive: true,
      },
      // Water Services
      {
        name: "WASA Lahore",
        category: "water",
        provider: "Water and Sanitation Agency Lahore",
        icon: "fas fa-tint",
        description: "Check your WASA Lahore water bill online instantly",
        apiEndpoint: "/api/bills/wasa-lahore",
        isActive: true,
      },
      {
        name: "WASA Karachi",
        category: "water",
        provider: "Water and Sanitation Agency Karachi",
        icon: "fas fa-tint",
        description: "Check your WASA Karachi water bill online instantly",
        apiEndpoint: "/api/bills/wasa-karachi",
        isActive: true,
      },
      // Other Services
      {
        name: "Vehicle Registration",
        category: "other",
        provider: "Government of Pakistan",
        icon: "fas fa-car",
        description: "Check vehicle registration and verification status",
        apiEndpoint: "/api/bills/vehicle-registration",
        isActive: true,
      },
      {
        name: "Traffic Challan",
        category: "other",
        provider: "Traffic Police",
        icon: "fas fa-exclamation-triangle",
        description: "Check traffic violations and e-challan status",
        apiEndpoint: "/api/bills/traffic-challan",
        isActive: true,
      },
    ];

    services.forEach(service => {
      const id = randomUUID();
      const billService: BillService = {
        ...service,
        id,
        apiEndpoint: service.apiEndpoint || null,
        isActive: service.isActive ?? true,
        createdAt: new Date(),
      };
      this.billServices.set(id, billService);
    });
  }

  async getBillServices(): Promise<BillService[]> {
    return Array.from(this.billServices.values());
  }

  async getBillServicesByCategory(category: string): Promise<BillService[]> {
    return Array.from(this.billServices.values()).filter(
      service => service.category === category && service.isActive
    );
  }

  async getBillService(id: string): Promise<BillService | undefined> {
    return this.billServices.get(id);
  }

  async createBillService(insertService: InsertBillService): Promise<BillService> {
    const id = randomUUID();
    const billService: BillService = {
      ...insertService,
      id,
      apiEndpoint: insertService.apiEndpoint || null,
      isActive: insertService.isActive ?? true,
      createdAt: new Date(),
    };
    this.billServices.set(id, billService);
    return billService;
  }

  async createBillCheck(insertBillCheck: InsertBillCheck): Promise<BillCheck> {
    const id = randomUUID();
    const billCheck: BillCheck = {
      ...insertBillCheck,
      id,
      serviceId: insertBillCheck.serviceId || null,
      customerReference: insertBillCheck.customerReference || null,
      billData: insertBillCheck.billData || null,
      userAgent: insertBillCheck.userAgent || null,
      ipAddress: insertBillCheck.ipAddress || null,
      checkedAt: new Date(),
    };
    this.billChecks.set(id, billCheck);
    return billCheck;
  }

  async getRecentBillChecks(limit: number = 10): Promise<BillCheck[]> {
    const checks = Array.from(this.billChecks.values())
      .sort((a, b) => b.checkedAt!.getTime() - a.checkedAt!.getTime())
      .slice(0, limit);
    return checks;
  }

  async getBillChecksByService(serviceId: string): Promise<BillCheck[]> {
    return Array.from(this.billChecks.values()).filter(
      check => check.serviceId === serviceId
    );
  }

  async createBillReminder(insertReminder: InsertBillReminder): Promise<BillReminder> {
    const id = randomUUID();
    const reminder: BillReminder = {
      ...insertReminder,
      id,
      serviceId: insertReminder.serviceId || null,
      customerReference: insertReminder.customerReference || null,
      email: insertReminder.email || null,
      phone: insertReminder.phone || null,
      isActive: insertReminder.isActive ?? true,
      createdAt: new Date(),
    };
    this.billReminders.set(id, reminder);
    return reminder;
  }

  async getBillReminders(): Promise<BillReminder[]> {
    return Array.from(this.billReminders.values());
  }

  async updateBillReminder(id: string, updates: Partial<BillReminder>): Promise<BillReminder | undefined> {
    const reminder = this.billReminders.get(id);
    if (!reminder) return undefined;

    const updatedReminder = { ...reminder, ...updates };
    this.billReminders.set(id, updatedReminder);
    return updatedReminder;
  }
}

export const storage = new MemStorage();
