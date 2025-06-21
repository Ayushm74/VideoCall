import { pgTable, text, serial, integer, boolean, timestamp, decimal } from "drizzle-orm/pg-core";
import { sqliteTable, text as sqliteText, integer as sqliteInteger, real } from "drizzle-orm/sqlite-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

// Use SQLite tables if DATABASE_URL is not provided (development mode)
const isSQLite = !process.env.DATABASE_URL || process.env.DATABASE_URL.startsWith("file:");

const users = isSQLite 
  ? sqliteTable("users", {
      id: sqliteInteger("id").primaryKey({ autoIncrement: true }),
      phone: sqliteText("phone").notNull().unique(),
      username: sqliteText("username"),
      coinBalance: sqliteInteger("coin_balance").default(0),
      isVip: sqliteInteger("is_vip", { mode: "boolean" }).default(false),
      avatar: sqliteText("avatar"),
      createdAt: sqliteInteger("created_at", { mode: "timestamp" }).defaultNow(),
    })
  : pgTable("users", {
      id: serial("id").primaryKey(),
      phone: text("phone").notNull().unique(),
      username: text("username"),
      coinBalance: integer("coin_balance").default(0),
      isVip: boolean("is_vip").default(false),
      avatar: text("avatar"),
      createdAt: timestamp("created_at").defaultNow(),
    });

const hosts = isSQLite
  ? sqliteTable("hosts", {
      id: sqliteInteger("id").primaryKey({ autoIncrement: true }),
      userId: sqliteInteger("user_id").references(() => users.id),
      name: sqliteText("name").notNull(),
      bio: sqliteText("bio"),
      rating: real("rating").default(0.00),
      coinRate: sqliteInteger("coin_rate").default(50),
      isOnline: sqliteInteger("is_online", { mode: "boolean" }).default(false),
      isVerified: sqliteInteger("is_verified", { mode: "boolean" }).default(false),
      totalEarnings: sqliteInteger("total_earnings").default(0),
      avatar: sqliteText("avatar"),
      createdAt: sqliteInteger("created_at", { mode: "timestamp" }).defaultNow(),
    })
  : pgTable("hosts", {
      id: serial("id").primaryKey(),
      userId: integer("user_id").references(() => users.id),
      name: text("name").notNull(),
      bio: text("bio"),
      rating: decimal("rating", { precision: 3, scale: 2 }).default("0.00"),
      coinRate: integer("coin_rate").default(50),
      isOnline: boolean("is_online").default(false),
      isVerified: boolean("is_verified").default(false),
      totalEarnings: integer("total_earnings").default(0),
      avatar: text("avatar"),
      createdAt: timestamp("created_at").defaultNow(),
    });

const gifts = isSQLite
  ? sqliteTable("gifts", {
      id: sqliteInteger("id").primaryKey({ autoIncrement: true }),
      name: sqliteText("name").notNull(),
      emoji: sqliteText("emoji").notNull(),
      coinCost: sqliteInteger("coin_cost").notNull(),
      animation: sqliteText("animation"),
    })
  : pgTable("gifts", {
      id: serial("id").primaryKey(),
      name: text("name").notNull(),
      emoji: text("emoji").notNull(),
      coinCost: integer("coin_cost").notNull(),
      animation: text("animation"),
    });

const transactions = isSQLite
  ? sqliteTable("transactions", {
      id: sqliteInteger("id").primaryKey({ autoIncrement: true }),
      userId: sqliteInteger("user_id").references(() => users.id),
      type: sqliteText("type").notNull(), // 'purchase', 'call', 'gift'
      amount: sqliteInteger("amount").notNull(),
      coinAmount: sqliteInteger("coin_amount"),
      description: sqliteText("description"),
      createdAt: sqliteInteger("created_at", { mode: "timestamp" }).defaultNow(),
    })
  : pgTable("transactions", {
      id: serial("id").primaryKey(),
      userId: integer("user_id").references(() => users.id),
      type: text("type").notNull(), // 'purchase', 'call', 'gift'
      amount: integer("amount").notNull(),
      coinAmount: integer("coin_amount"),
      description: text("description"),
      createdAt: timestamp("created_at").defaultNow(),
    });

const calls = isSQLite
  ? sqliteTable("calls", {
      id: sqliteInteger("id").primaryKey({ autoIncrement: true }),
      userId: sqliteInteger("user_id").references(() => users.id),
      hostId: sqliteInteger("host_id").references(() => hosts.id),
      duration: sqliteInteger("duration"), // in seconds
      coinCost: sqliteInteger("coin_cost"),
      status: sqliteText("status").notNull(), // 'active', 'ended', 'declined'
      createdAt: sqliteInteger("created_at", { mode: "timestamp" }).defaultNow(),
    })
  : pgTable("calls", {
      id: serial("id").primaryKey(),
      userId: integer("user_id").references(() => users.id),
      hostId: integer("host_id").references(() => hosts.id),
      duration: integer("duration"), // in seconds
      coinCost: integer("coin_cost"),
      status: text("status").notNull(), // 'active', 'ended', 'declined'
      createdAt: timestamp("created_at").defaultNow(),
    });

export { users, hosts, gifts, transactions, calls };

export const insertUserSchema = createInsertSchema(users).omit({
  id: true,
  createdAt: true,
});

export const insertHostSchema = createInsertSchema(hosts).omit({
  id: true,
  createdAt: true,
});

export const insertGiftSchema = createInsertSchema(gifts).omit({
  id: true,
});

export const insertTransactionSchema = createInsertSchema(transactions).omit({
  id: true,
  createdAt: true,
});

export const insertCallSchema = createInsertSchema(calls).omit({
  id: true,
  createdAt: true,
});

export type User = typeof users.$inferSelect;
export type Host = typeof hosts.$inferSelect;
export type Gift = typeof gifts.$inferSelect;
export type Transaction = typeof transactions.$inferSelect;
export type Call = typeof calls.$inferSelect;

export type InsertUser = z.infer<typeof insertUserSchema>;
export type InsertHost = z.infer<typeof insertHostSchema>;
export type InsertGift = z.infer<typeof insertGiftSchema>;
export type InsertTransaction = z.infer<typeof insertTransactionSchema>;
export type InsertCall = z.infer<typeof insertCallSchema>;
