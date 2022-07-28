import { Schema, model, models } from "mongoose";

const tokenSchema = new Schema({
  token: String,
  owner: String,
  keypair: String,
  network: String,
});

export const Token = models.Token ||  model("Token", tokenSchema);
