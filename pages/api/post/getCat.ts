import { response } from '@/components/server/dto/response';
import prisma from '@/components/server/utils/prisma';
import { getLoginUser } from '@/components/server/login';
import { Category, Post } from '@prisma/client';
import type { NextApiRequest, NextApiResponse } from 'next';
type category = { post: Post };
export type apiCategory = {
  posts: category[];
} & Category;

export type Data = {
  categories?: Array<apiCategory>;
} & response;

/**
 * 方法用于前台页面
 * @param req
 * @param res
 */
export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<Data>
) {
  getLoginUser(req)
    .then((user) => {
      prisma.category
        .findMany({
          select: {
            id: true,
            cat: true,
            createAt: true,
            updatedAt: true,
            reqLogin: true,
            posts: {
              select: { post: true },
              take: 10,
              orderBy: [{ assignedAt: 'desc' }],
            },
          },
          where: {
            OR: [{ reqLogin: false }, { reqLogin: user.login }],
          },
        })
        .then((categories) => {
          res.status(200).json({
            categories,
            code: 0,
          });
        })
        .catch((err) => {
          res.status(404).send({ code: -1, msg: '接口出错' + err });
        });
    })
    .catch((err) => {
      res.status(404).send({ code: -1, msg: '接口出错' + err });
    });
}
