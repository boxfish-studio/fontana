import { NextApiRequest, NextApiResponse } from "next";

import { dbConnect } from "db/lib";
import { Token } from "db/model";
import { createMint } from "lib/create-token";

export type UnwrapPromise<T> = T extends Promise<infer Return> ? Return : T;

interface Res {
  token?: string;
  owner?: string;
  err?: string;
}
export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<Res>
) {
  try {
    const body = JSON.parse(req.body) as UnwrapPromise<
      ReturnType<typeof createMint>
    >;
    if (!body) throw new Error("No token");
    await dbConnect();
    await Token.create(body);
    res.status(200).end();
  } catch (e) {
    console.error(e);
    res.status(500).end(JSON.stringify({ err: (e as Error).message }));
  }
}
