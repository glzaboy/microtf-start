import { response } from '@/components/server/dto/response';
import prisma from '@/components/server/utils/prisma';
import type { Category } from '@prisma/client';
import type { NextApiRequest, NextApiResponse } from 'next';

export type Data = {
  category?: Category;
} & response;

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<Data>
) {
  const cat: Category = { ...req.body };
  if (cat.id > 0) {
    await prisma.category
      .findFirstOrThrow({ where: { id: cat.id } })
      .then(() => {
        prisma.category
          .update({
            data: { cat: cat.cat, reqLogin: cat.reqLogin },
            where: { id: cat.id },
          })
          .then((data) => {
            res.status(200).json({ code: 0, msg: '更新成功', category: data });
          });
      })
      .catch((err) => {
        console.error('查询出错{}' + err);
        res.status(200).json({ code: -1, msg: '' });
      });
  } else {
    prisma.category
      .create({ data: { cat: cat.cat, reqLogin: cat.reqLogin } })
      .then((_) => {
        res.status(200).json({ code: 0, msg: '', category: _ });
      })
      .catch((err) => {
        console.error(err);
        res.status(200).json({ code: -1, msg: '出错' + err });
      });
  }
}
