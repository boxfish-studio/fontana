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
  req: NextApiRequest,
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
    console.log("queryResults", queryResults);
    return res.status(200).json({ queryResults });
  } catch (e) {
    console.error(e);
    return res.status(500).json({ err: (e as Error).message });
  }
}
