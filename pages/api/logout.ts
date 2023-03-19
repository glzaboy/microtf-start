// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from 'next';
import { response } from '@/components/server/dto/response';
import { deleteCookie } from '@/components/server/utils/cookie';

export default async function handler(
  _req: NextApiRequest,
  res: NextApiResponse<response>
) {
  deleteCookie(res, 'auth', { path: '/', httpOnly: true });
  res.send({ code: 0, msg: 'ok' });
}
