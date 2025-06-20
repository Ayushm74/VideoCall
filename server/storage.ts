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
      { name: "Rose", emoji: "🌹", coinCost: 30, animation: "float" },
      { name: "Kiss", emoji: "💋", coinCost: 50, animation: "bounce" },
      { name: "Heart", emoji: "❤️", coinCost: 25, animation: "pulse" },
      { name: "Teddy", emoji: "🧸", coinCost: 100, animation: "wiggle" },
      { name: "Car", emoji: "🏎️", coinCost: 500, animation: "drive" },
      { name: "Ring", emoji: "💍", coinCost: 999, animation: "sparkle" },
      { name: "Fireworks", emoji: "🎆", coinCost: 2000, animation: "explode" },
      { name: "Crown", emoji: "👑", coinCost: 1500, animation: "shine" },
    ];

    mockGifts.forEach(gift => {
      const id = this.currentGiftId++;
      this.gifts.set(id, { ...gift, id });
    });

    // Initialize mock hosts
    const mockHosts = [
      { userId: null, name: "Priya", bio: "Love dancing and movies", rating: "4.9", coinRate: 50, isOnline: true, isVerified: true, totalEarnings: 12500, avatar: "https://images.unsplash.com/photo-1508214751196-bcfd4ca60f91?ixlib=rb-4.0.3&w=400&h=500&fit=crop&crop=face" },
      { userId: null, name: "Ananya", bio: "Friendly and fun conversations", rating: "4.7", coinRate: 40, isOnline: true, isVerified: false, totalEarnings: 8900, avatar: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?ixlib=rb-4.0.3&w=400&h=500&fit=crop&crop=face" },
      { userId: null, name: "Kavya", bio: "Artist and music lover", rating: "4.8", coinRate: 60, isOnline: true, isVerified: true, totalEarnings: 15600, avatar: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?ixlib=rb-4.0.3&w=400&h=500&fit=crop&crop=face" },
      { userId: null, name: "Riya", bio: "Travel enthusiast", rating: "4.6", coinRate: 45, isOnline: true, isVerified: false, totalEarnings: 6700, avatar: "https://images.unsplash.com/photo-1487412720507-e7ab37603c6f?ixlib=rb-4.0.3&w=400&h=500&fit=crop&crop=face" },
      { userId: null, name: "Meera", bio: "Yoga instructor", rating: "4.9", coinRate: 70, isOnline: false, isVerified: true, totalEarnings: 22100, avatar: "https://images.unsplash.com/photo-1506863530036-1efeddceb993?ixlib=rb-4.0.3&w=400&h=500&fit=crop&crop=face" },
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
