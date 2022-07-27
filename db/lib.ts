import mongoose, { connect } from "mongoose";
import { Token } from "./model";
import { NewToken } from "types";

declare module globalThis {
  var mongoose: any;
}

interface Mongo {
  queryKeypair: (token: string) => Promise<string>;
  queryTokens: () => Promise<Query[]>;
  createToken: (token: NewToken) => Promise<void>;
}

export interface Query {
  token: string;
  owner: string;
}

export class Database implements Mongo {
  private async dbconnect() {
    try {
      const MONGO_URI = process.env.NEXT_PUBLIC_DATABASE_URL;
      if (!MONGO_URI) throw new Error("Database url not found");
      let cached = globalThis.mongoose;
      if (!cached) {
        cached = globalThis.mongoose = { conn: null, promise: null };
      }
      if (!cached.promise) {
        const opts = {
          bufferCommands: false,
        };

        cached.promise = mongoose.connect(MONGO_URI, opts).then((mongoose) => {
          return mongoose;
        });
      }
      cached.conn = await cached.promise;
      return cached.conn;
    } catch (e) {
      console.error(e);
    }
  }

  async queryKeypair(token: string) {
    await this.dbconnect();
    const { keypair } = await Token.findOne({ token });
    return keypair as string;
  }

  async queryTokens() {
    await this.dbconnect();
    const queryResults: Query[] = (await Token.find()).map(
      ({ token, owner }) => {
        return {
          token,
          owner,
        };
      }
    );
    return queryResults;
  }

  async createToken(token: NewToken) {
    await this.dbconnect();
    await Token.create(token);
  }
}
