import { NextApiRequest, NextApiResponse } from "next";
import { Database, Query } from "db/lib";
import type { Network } from "contexts";

interface Res {
  queryResults?: Query[];
  err?: string;
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<Res>
) {
  try {
    const { network } = JSON.parse(req.body) as { network: Network };
    if (!network) throw new Error("No token");
    const queryResults = await new Database().queryTokens(network);
    res.status(200).end(JSON.stringify({ queryResults }));
  } catch (e) {
    console.error(e);
    res.status(500).send({ err: (e as Error).message });
  }
}
