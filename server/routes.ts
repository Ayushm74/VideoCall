import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { insertUserSchema, insertHostSchema, insertTransactionSchema, insertCallSchema } from "@shared/schema";
import { z } from "zod";

export async function registerRoutes(app: Express): Promise<Server> {
  // Auth routes
  app.post("/api/auth/login", async (req, res) => {
    try {
      const { phone } = req.body;
      
      if (!phone) {
        return res.status(400).json({ message: "Phone number is required" });
      }

      let user = await storage.getUserByPhone(phone);
      if (!user) {
        user = await storage.createUser({ 
          phone, 
          username: `User${phone.slice(-4)}`,
          coinBalance: 100 // Welcome bonus
        });
      }

      res.json({ user });
    } catch (error) {
      res.status(500).json({ message: "Login failed" });
    }
  });

  // User routes
  app.get("/api/user/:id", async (req, res) => {
    try {
      const user = await storage.getUser(parseInt(req.params.id));
      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }
      res.json(user);
    } catch (error) {
      res.status(500).json({ message: "Failed to get user" });
    }
  });

  app.post("/api/user/:id/coins", async (req, res) => {
    try {
      const { amount, transactionType } = req.body;
      const userId = parseInt(req.params.id);
      
      const user = await storage.updateUserCoins(userId, amount);
      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }

      await storage.createTransaction({
        userId,
        type: transactionType || 'purchase',
        amount: amount > 0 ? Math.abs(amount) * 1 : 0, // Convert coins to rupees (1 coin = 1 rupee for simplicity)
        coinAmount: amount,
        description: amount > 0 ? 'Coin purchase' : 'Coin deduction'
      });

      res.json(user);
    } catch (error) {
      res.status(500).json({ message: "Failed to update coins" });
    }
  });

  // Host routes
  app.get("/api/hosts", async (req, res) => {
    try {
      const online = req.query.online === 'true' ? true : req.query.online === 'false' ? false : undefined;
      const hosts = await storage.getHosts(online);
      res.json(hosts);
    } catch (error) {
      res.status(500).json({ message: "Failed to get hosts" });
    }
  });

  app.get("/api/host/:id", async (req, res) => {
    try {
      const host = await storage.getHost(parseInt(req.params.id));
      if (!host) {
        return res.status(404).json({ message: "Host not found" });
      }
      res.json(host);
    } catch (error) {
      res.status(500).json({ message: "Failed to get host" });
    }
  });

  app.post("/api/host/:id/status", async (req, res) => {
    try {
      const { isOnline } = req.body;
      const host = await storage.updateHostStatus(parseInt(req.params.id), isOnline);
      if (!host) {
        return res.status(404).json({ message: "Host not found" });
      }
      res.json(host);
    } catch (error) {
      res.status(500).json({ message: "Failed to update host status" });
    }
  });

  // Gift routes
  app.get("/api/gifts", async (req, res) => {
    try {
      const gifts = await storage.getGifts();
      res.json(gifts);
    } catch (error) {
      res.status(500).json({ message: "Failed to get gifts" });
    }
  });

  // Transaction routes
  app.get("/api/user/:id/transactions", async (req, res) => {
    try {
      const transactions = await storage.getUserTransactions(parseInt(req.params.id));
      res.json(transactions);
    } catch (error) {
      res.status(500).json({ message: "Failed to get transactions" });
    }
  });

  // Call routes
  app.post("/api/calls", async (req, res) => {
    try {
      const callData = insertCallSchema.parse(req.body);
      const call = await storage.createCall(callData);
      res.json(call);
    } catch (error) {
      res.status(400).json({ message: "Invalid call data" });
    }
  });

  app.get("/api/user/:id/calls", async (req, res) => {
    try {
      const calls = await storage.getUserCalls(parseInt(req.params.id));
      res.json(calls);
    } catch (error) {
      res.status(500).json({ message: "Failed to get calls" });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}
