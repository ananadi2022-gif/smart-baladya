import { db } from "./db";
import { users, requests, reports, type User, type InsertUser, type Request, type InsertRequest, type Report, type InsertReport } from "@shared/schema";
import { eq, desc } from "drizzle-orm";

export interface IStorage {
  // User
  getUser(id: number): Promise<User | undefined>;
  getUserByCin(cin: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;

  // Requests
  getRequests(userId?: number): Promise<Request[]>; // Optional userId filter
  getAllRequests(): Promise<Request[]>; // For admin
  createRequest(request: InsertRequest): Promise<Request>;
  updateRequestStatus(id: number, status: string): Promise<Request | undefined>;

  // Reports
  getReports(userId?: number): Promise<Report[]>;
  getAllReports(): Promise<Report[]>;
  createReport(report: InsertReport): Promise<Report>;
  updateReportStatus(id: number, status: string): Promise<Report | undefined>;
}

export class DatabaseStorage implements IStorage {
  async getUser(id: number): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.id, id));
    return user;
  }

  async getUserByCin(cin: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.cin, cin));
    return user;
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const [user] = await db.insert(users).values(insertUser).returning();
    return user;
  }

  async getRequests(userId?: number): Promise<Request[]> {
    if (userId) {
      return await db.select().from(requests).where(eq(requests.userId, userId)).orderBy(desc(requests.createdAt));
    }
    return await db.select().from(requests).orderBy(desc(requests.createdAt));
  }

  async getAllRequests(): Promise<Request[]> {
    return await db.select().from(requests).orderBy(desc(requests.createdAt));
  }

  async createRequest(request: InsertRequest): Promise<Request> {
    const [newRequest] = await db.insert(requests).values(request).returning();
    return newRequest;
  }

  async updateRequestStatus(id: number, status: string): Promise<Request | undefined> {
    // @ts-ignore - Valid status checked by Zod in route
    const [updated] = await db.update(requests).set({ status }).where(eq(requests.id, id)).returning();
    return updated;
  }

  async getReports(userId?: number): Promise<Report[]> {
     if (userId) {
      return await db.select().from(reports).where(eq(reports.userId, userId)).orderBy(desc(reports.createdAt));
    }
    return await db.select().from(reports).orderBy(desc(reports.createdAt));
  }

  async getAllReports(): Promise<Report[]> {
    return await db.select().from(reports).orderBy(desc(reports.createdAt));
  }

  async createReport(report: InsertReport): Promise<Report> {
    const [newReport] = await db.insert(reports).values(report).returning();
    return newReport;
  }

  async updateReportStatus(id: number, status: string): Promise<Report | undefined> {
    // @ts-ignore
    const [updated] = await db.update(reports).set({ status }).where(eq(reports.id, id)).returning();
    return updated;
  }
}

export const storage = new DatabaseStorage();
