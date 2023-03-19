import { response } from '@/components/server/dto/response';
import prisma from '@/components/server/utils/prisma';
import type { NextApiRequest, NextApiResponse } from 'next';
import { getLoginUser } from '@/components/server/login';

export type Data = response;

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<Data>
) {
  getLoginUser(req, { reqLogin: true })
    .then(() => {
      const { id }: { id: number } = { ...req.body };
      if (id > 0) {
        prisma
          .$transaction(async (tx) => {
            await tx.postContent.deleteMany({
              where: { postId: id },
            });
            await tx.categoriesOnPosts.deleteMany({
              where: { postId: id },
            });
            await tx.post.delete({
              where: { id },
            });
          })
          .then(() => {
            res.status(200).json({ code: 0, msg: '操作成功' });
          })
          .catch((err) => {
            res.status(200).json({ code: -1, msg: '操作失败' + err });
          });
      } else {
        res.status(200).json({ code: -1, msg: '操作失败 ID 不为空' });
      }
    })
    .catch((err) => {
      res.status(200).json({ code: -1, msg: err });
    });
}
