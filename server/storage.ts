import { users, hosts, gifts, transactions, calls, type User, type Host, type Gift, type Transaction, type Call, type InsertUser, type InsertHost, type InsertGift, type InsertTransaction, type InsertCall } from "@shared/schema";

export interface IStorage {
  // Users
  getUser(id: number): Promise<User | undefined>;
  getUserByPhone(phone: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  updateUserCoins(id: number, amount: number): Promise<User | undefined>;

  // Hosts
  getHost(id: number): Promise<Host | undefined>;
  getHosts(online?: boolean): Promise<Host[]>;
  createHost(host: InsertHost): Promise<Host>;
  updateHostStatus(id: number, isOnline: boolean): Promise<Host | undefined>;

  // Gifts
  getGifts(): Promise<Gift[]>;
  getGift(id: number): Promise<Gift | undefined>;

  // Transactions
  createTransaction(transaction: InsertTransaction): Promise<Transaction>;
  getUserTransactions(userId: number): Promise<Transaction[]>;

  // Calls
  createCall(call: InsertCall): Promise<Call>;
  getUserCalls(userId: number): Promise<Call[]>;
  getHostCalls(hostId: number): Promise<Call[]>;
}

export class MemStorage implements IStorage {
  private users: Map<number, User>;
  private hosts: Map<number, Host>;
  private gifts: Map<number, Gift>;
  private transactions: Map<number, Transaction>;
  private calls: Map<number, Call>;
  private currentUserId: number;
  private currentHostId: number;
  private currentGiftId: number;
  private currentTransactionId: number;
  private currentCallId: number;

  constructor() {
    this.users = new Map();
    this.hosts = new Map();
    this.gifts = new Map();
    this.transactions = new Map();
    this.calls = new Map();
    this.currentUserId = 1;
    this.currentHostId = 1;
    this.currentGiftId = 1;
    this.currentTransactionId = 1;
    this.currentCallId = 1;

    this.initializeMockData();
  }

  private initializeMockData() {
    // Initialize mock gifts
    const mockGifts = [
      { name: "Coffee", emoji: "☕", coinCost: 15, animation: "float" },
      { name: "Pizza slice", emoji: "🍕", coinCost: 25, animation: "bounce" },
      { name: "Sunflower", emoji: "🌻", coinCost: 35, animation: "pulse" },
      { name: "Book", emoji: "📚", coinCost: 40, animation: "wiggle" },
      { name: "Concert ticket", emoji: "🎵", coinCost: 85, animation: "drive" },
      { name: "Nice dinner", emoji: "🍽️", coinCost: 120, animation: "sparkle" },
      { name: "Weekend trip", emoji: "✈️", coinCost: 300, animation: "explode" },
      { name: "Surprise gift", emoji: "🎁", coinCost: 200, animation: "shine" },
    ];

    mockGifts.forEach(gift => {
      const id = this.currentGiftId++;
      this.gifts.set(id, { ...gift, id });
    });

    // Initialize mock hosts
    const mockHosts = [
      { userId: null, name: "Emma", bio: "Psychology student who loves deep talks about life", rating: "4.8", coinRate: 35, isOnline: true, isVerified: true, totalEarnings: 12500, avatar: "https://images.unsplash.com/photo-1494790108755-2616b612b830?ixlib=rb-4.0.3&w=400&h=500&fit=crop&crop=face" },
      { userId: null, name: "Sofia", bio: "Coffee addict & bookworm from Barcelona", rating: "4.6", coinRate: 28, isOnline: true, isVerified: false, totalEarnings: 8900, avatar: "https://images.unsplash.com/photo-1524504388940-b1c1722653e1?ixlib=rb-4.0.3&w=400&h=500&fit=crop&crop=face" },
      { userId: null, name: "Maya", bio: "Digital artist working from Bali", rating: "4.9", coinRate: 42, isOnline: true, isVerified: true, totalEarnings: 15600, avatar: "https://images.unsplash.com/photo-1517841905240-472988babdf9?ixlib=rb-4.0.3&w=400&h=500&fit=crop&crop=face" },
      { userId: null, name: "Chloe", bio: "Just moved to NYC, exploring the city", rating: "4.5", coinRate: 32, isOnline: true, isVerified: false, totalEarnings: 6700, avatar: "https://images.unsplash.com/photo-1529626455594-4ff0802cfb7e?ixlib=rb-4.0.3&w=400&h=500&fit=crop&crop=face" },
      { userId: null, name: "Lily", bio: "Med student taking a break from studying", rating: "4.7", coinRate: 25, isOnline: true, isVerified: false, totalEarnings: 3200, avatar: "https://images.unsplash.com/photo-1544725176-7c40e5a71c5e?ixlib=rb-4.0.3&w=400&h=500&fit=crop&crop=face" },
      { userId: null, name: "Nina", bio: "Marketing manager working remote from Mexico", rating: "4.8", coinRate: 38, isOnline: true, isVerified: true, totalEarnings: 9800, avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?ixlib=rb-4.0.3&w=400&h=500&fit=crop&crop=face" },
      { userId: null, name: "Alex", bio: "Freelance photographer documenting city life", rating: "4.6", coinRate: 30, isOnline: true, isVerified: false, totalEarnings: 5400, avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?ixlib=rb-4.0.3&w=400&h=500&fit=crop&crop=face" },
      { userId: null, name: "Zara", bio: "Fashion design student from London", rating: "4.9", coinRate: 45, isOnline: false, isVerified: true, totalEarnings: 14200, avatar: "https://images.unsplash.com/photo-1493666438817-866a91353ca9?ixlib=rb-4.0.3&w=400&h=500&fit=crop&crop=face" },
      { userId: null, name: "Kate", bio: "Weekend chef who loves trying new recipes", rating: "4.4", coinRate: 22, isOnline: false, isVerified: false, totalEarnings: 2100, avatar: "https://images.unsplash.com/photo-1502323777036-f29e3972d82f?ixlib=rb-4.0.3&w=400&h=500&fit=crop&crop=face" },
    ];

    mockHosts.forEach(host => {
      const id = this.currentHostId++;
      this.hosts.set(id, { ...host, id, createdAt: new Date() });
    });
  }

  async getUser(id: number): Promise<User | undefined> {
    return this.users.get(id);
  }

  async getUserByPhone(phone: string): Promise<User | undefined> {
    return Array.from(this.users.values()).find(user => user.phone === phone);
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const id = this.currentUserId++;
    const user: User = { 
      ...insertUser, 
      id, 
      coinBalance: insertUser.coinBalance || 0,
      isVip: insertUser.isVip || false,
      createdAt: new Date() 
    };
    this.users.set(id, user);
    return user;
  }

  async updateUserCoins(id: number, amount: number): Promise<User | undefined> {
    const user = this.users.get(id);
    if (user) {
      const updatedUser = { ...user, coinBalance: (user.coinBalance || 0) + amount };
      this.users.set(id, updatedUser);
      return updatedUser;
    }
    return undefined;
  }

  async getHost(id: number): Promise<Host | undefined> {
    return this.hosts.get(id);
  }

  async getHosts(online?: boolean): Promise<Host[]> {
    const allHosts = Array.from(this.hosts.values());
    if (online === undefined) return allHosts;
    return allHosts.filter(host => host.isOnline === online);
  }

  async createHost(insertHost: InsertHost): Promise<Host> {
    const id = this.currentHostId++;
    const host: Host = { 
      ...insertHost, 
      id, 
      rating: insertHost.rating || "0.00",
      coinRate: insertHost.coinRate || 50,
      isOnline: insertHost.isOnline || false,
      isVerified: insertHost.isVerified || false,
      totalEarnings: insertHost.totalEarnings || 0,
      createdAt: new Date() 
    };
    this.hosts.set(id, host);
    return host;
  }

  async updateHostStatus(id: number, isOnline: boolean): Promise<Host | undefined> {
    const host = this.hosts.get(id);
    if (host) {
      const updatedHost = { ...host, isOnline };
      this.hosts.set(id, updatedHost);
      return updatedHost;
    }
    return undefined;
  }

  async getGifts(): Promise<Gift[]> {
    return Array.from(this.gifts.values());
  }

  async getGift(id: number): Promise<Gift | undefined> {
    return this.gifts.get(id);
  }

  async createTransaction(insertTransaction: InsertTransaction): Promise<Transaction> {
    const id = this.currentTransactionId++;
    const transaction: Transaction = { 
      ...insertTransaction, 
      id, 
      createdAt: new Date() 
    };
    this.transactions.set(id, transaction);
    return transaction;
  }

  async getUserTransactions(userId: number): Promise<Transaction[]> {
    return Array.from(this.transactions.values())
      .filter(transaction => transaction.userId === userId)
      .sort((a, b) => (b.createdAt?.getTime() || 0) - (a.createdAt?.getTime() || 0));
  }

  async createCall(insertCall: InsertCall): Promise<Call> {
    const id = this.currentCallId++;
    const call: Call = { 
      ...insertCall, 
      id, 
      createdAt: new Date() 
    };
    this.calls.set(id, call);
    return call;
  }

  async getUserCalls(userId: number): Promise<Call[]> {
    return Array.from(this.calls.values())
      .filter(call => call.userId === userId)
      .sort((a, b) => (b.createdAt?.getTime() || 0) - (a.createdAt?.getTime() || 0));
  }

  async getHostCalls(hostId: number): Promise<Call[]> {
    return Array.from(this.calls.values())
      .filter(call => call.hostId === hostId)
      .sort((a, b) => (b.createdAt?.getTime() || 0) - (a.createdAt?.getTime() || 0));
  }
}

export const storage = new MemStorage();
