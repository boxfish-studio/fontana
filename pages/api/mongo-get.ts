import { NextApiRequest, NextApiResponse } from "next";

import { MongoMethods, Query } from "db/lib";

interface Res {
  queryResults?: Query[];
  err?: string;
}
export default async function handler(
  _req: NextApiRequest,
  res: NextApiResponse<Res>
) {
  try {
    const queryResults = await new MongoMethods().queryTokens();
    res.status(200).end(JSON.stringify({ queryResults }));
  } catch (e) {
    console.error(e);
    res.status(500).send({ err: (e as Error).message });
  }
}
