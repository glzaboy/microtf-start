// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import { response } from '@/components/server/dto/response';
import { getLoginUser } from '@/components/server/login';
import { User } from '@prisma/client';
import type { NextApiRequest, NextApiResponse } from 'next';

export type Data = {
  name?: User;
} & response;

export default function handler(
  req: NextApiRequest,
  res: NextApiResponse<Data>
) {
  getLoginUser(req, { reqLogin: true })
    .then((data) => {
      res.status(200).json(data);
    })
    .catch((err) => {
      res.status(200).json({ code: -1, msg: err });
    });
}
