import { NextApiRequest, NextApiResponse } from "next";

import { dbConnect } from "db/lib";
import { Token } from "db/model";

interface Res {
  queryResults?: any;
  err?: string;
}
export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<Res>
) {
  try {
    await dbConnect();
    const queryResults = (await Token.find()).map((x) => {
      return {
        token: x.token,
        owner: x.owner,
      };
    });
    res.status(200).json({ queryResults: queryResults });
  } catch (e) {
    console.error(e);
    res.status(500).json({ err: (e as Error).message });
  }
}
