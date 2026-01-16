import type { Express } from "express";
import type { Server } from "http";
import { storage } from "./storage";
import { api } from "@shared/routes";
import { z } from "zod";
import session from "express-session";
import passport from "passport";
import { Strategy as LocalStrategy } from "passport-local";
import { type User } from "@shared/schema";

export async function registerRoutes(
  httpServer: Server,
  app: Express
): Promise<Server> {
  // Auth Setup
  app.use(session({
    secret: process.env.SESSION_SECRET || "secret",
    resave: false,
    saveUninitialized: false,
    cookie: { secure: app.get("env") === "production" }
  }));
  app.use(passport.initialize());
  app.use(passport.session());

  passport.use(new LocalStrategy({ usernameField: "cin" }, async (cin, password, done) => {
    try {
      const user = await storage.getUserByCin(cin);
      if (!user) return done(null, false, { message: "Incorrect CIN." });
      // In a real app, compare hashed passwords. Here we compare plaintext for simplicity/mock.
      if (user.password !== password) return done(null, false, { message: "Incorrect password." });
      return done(null, user);
    } catch (err) {
      return done(err);
    }
  }));

  passport.serializeUser((user: any, done) => done(null, user.id));
  passport.deserializeUser(async (id: number, done) => {
    try {
      const user = await storage.getUser(id);
      done(null, user);
    } catch (err) {
      done(err);
    }
  });

  // Auth Routes
  app.post(api.auth.register.path, async (req, res) => {
    try {
      const input = api.auth.register.input.parse(req.body);
      const existing = await storage.getUserByCin(input.cin);
      if (existing) return res.status(400).json({ message: "CIN already exists" });
      const user = await storage.createUser(input);
      req.login(user, (err) => {
        if (err) return res.status(500).json({ message: "Login failed after register" });
        res.status(201).json(user);
      });
    } catch (err) {
      if (err instanceof z.ZodError) {
        res.status(400).json({ message: err.errors[0].message });
      } else {
        res.status(500).json({ message: "Internal server error" });
      }
    }
  });

  app.post(api.auth.login.path, passport.authenticate("local"), (req, res) => {
    res.status(200).json(req.user);
  });

  app.post(api.auth.logout.path, (req, res) => {
    req.logout(() => {
      res.status(200).send();
    });
  });

  app.get(api.auth.me.path, (req, res) => {
    if (!req.isAuthenticated()) return res.status(401).send();
    res.json(req.user);
  });

  // Requests
  app.get(api.requests.list.path, async (req, res) => {
    if (!req.isAuthenticated()) return res.status(401).send();
    const user = req.user as User;
    const requests = user.role === 'admin' 
      ? await storage.getAllRequests() 
      : await storage.getRequests(user.id);
    res.json(requests);
  });

  app.post(api.requests.create.path, async (req, res) => {
    if (!req.isAuthenticated()) return res.status(401).send();
    try {
      const input = api.requests.create.input.parse(req.body);
      const user = req.user as User;
      const request = await storage.createRequest({ 
        ...input, 
        userId: user.id 
      });
      res.status(201).json(request);
    } catch (err) {
        if (err instanceof z.ZodError) {
            res.status(400).json({ message: err.errors[0].message });
        } else {
            res.status(500).send();
        }
    }
  });

  app.patch(api.requests.updateStatus.path, async (req, res) => {
    if (!req.isAuthenticated()) return res.status(401).send();
    // In real app, check if admin
    const id = parseInt(req.params.id);
    const updated = await storage.updateRequestStatus(id, req.body.status);
    if (!updated) return res.status(404).send();
    res.json(updated);
  });

  // Reports
  app.get(api.reports.list.path, async (req, res) => {
    if (!req.isAuthenticated()) return res.status(401).send();
    const user = req.user as User;
    const reports = user.role === 'admin'
      ? await storage.getAllReports()
      : await storage.getReports(user.id);
    res.json(reports);
  });

  app.post(api.reports.create.path, async (req, res) => {
    if (!req.isAuthenticated()) return res.status(401).send();
     try {
      const input = api.reports.create.input.parse(req.body);
      // Force userId from session
      const report = await storage.createReport({ ...input, userId: (req.user as User).id });
      res.status(201).json(report);
    } catch (err) {
        if (err instanceof z.ZodError) {
            res.status(400).json({ message: err.errors[0].message });
        } else {
            res.status(500).send();
        }
    }
  });

   app.patch(api.reports.updateStatus.path, async (req, res) => {
    if (!req.isAuthenticated()) return res.status(401).send();
    const id = parseInt(req.params.id);
    const updated = await storage.updateReportStatus(id, req.body.status);
    if (!updated) return res.status(404).send();
    res.json(updated);
  });

  // Seed Data
  await seedDatabase();

  return httpServer;
}

async function seedDatabase() {
    const existingUsers = await storage.getUserByCin("admin");
    if (!existingUsers) {
        await storage.createUser({
            fullName: "Admin User",
            cin: "admin",
            password: "admin",
            role: "admin"
        });
        await storage.createUser({
            fullName: "Ahmed Citizen",
            cin: "AB123456",
            password: "password",
            role: "citizen"
        });
    }
}
