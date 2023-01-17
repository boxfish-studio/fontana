/* eslint-disable @typescript-eslint/no-unsafe-argument */
/* eslint-disable @typescript-eslint/explicit-module-boundary-types */
import { NextApiRequest, NextApiResponse } from 'next';
import { Database } from 'db/lib';
import { NewToken } from 'types';

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
    const body = JSON.parse(req.body) as NewToken | undefined;
    if (!body) throw new Error('No token');
    await new Database().createToken(body);
    res.status(200).end();
  } catch (e) {
    console.error(e);
    res.status(500).end(JSON.stringify({ err: (e as Error).message }));
  }
}
