import { connect } from "mongoose";
import { Token } from "./model";
export async function dbConnect() {
  try {
    const db = await connect(
      process.env.NEXT_PUBLIC_DATABASE_URL ||
        "mongodb://localhost:27017/fontana"
    );
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
