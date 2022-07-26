import { NextApiRequest, NextApiResponse } from "next";

import { dbConnect } from "db/lib";
import { Token } from "db/model";

interface Query {
  token: string;
  owner: string;
}
interface Res {
  queryResults?: Query[];
  err?: string;
}
export default async function handler(
  _req: NextApiRequest,
  res: NextApiResponse<Res>
) {
  try {
    await dbConnect();
    const queryResults: Query[] = (await Token.find()).map((x) => {
      return {
        token: x.token,
        owner: x.owner,
      };
    });
    res.status(200).end(JSON.stringify({ queryResults }));
  } catch (e) {
    console.error(e);
    res.status(500).send({ err: (e as Error).message });
  }
}
