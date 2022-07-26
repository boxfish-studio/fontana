import { connect } from "mongoose";
import { Token } from "./model";
export async function dbConnect() {
  try {
    const MONGO_URI = process.env.NEXT_PUBLIC_DATABASE_URL;
    if (!MONGO_URI) throw new Error("Database url not found");
    await connect(MONGO_URI);
    console.log("connected to db");
  } catch (e) {
    console.error(e);
  }
}

export async function getKeypair(token: string) {
  await dbConnect();
  const { keypair } = await Token.findOne({ token });
  return keypair as string;
}
