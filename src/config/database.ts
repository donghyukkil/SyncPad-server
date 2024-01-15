import mongoose from "mongoose";

import { CONFIG } from "../constants/config";

class Database {
  private static instance: Database;

  private constructor() {}

  public static getInstance(): Database {
    if (!Database.instance) {
      Database.instance = new Database();
    }

    return Database.instance;
  }

  public async connect(): Promise<void> {
    if (mongoose.connection.readyState === 0) {
      try {
        if (CONFIG.MONGODB_URI !== undefined) {
          await mongoose.connect(CONFIG.MONGODB_URI);
          console.log("MongoDB connected");
        }
      } catch (error) {
        console.error("MongoDB connection failed:", error);
      }
    }
  }
}

export default Database;
