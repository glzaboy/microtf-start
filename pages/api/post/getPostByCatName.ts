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
  posts?: Array<Post>;
  catName?: string;
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
  console.log(req.query);
  console.log(req.body);
  const {
    page,
    catName,
    size,
  }: { page: number; size: number; catName: string } = req.body
    ? req.body
    : req.query;
  console.log(catName);
  getLoginUser(req)
    .then(() => {
      prisma.category
        .findFirst({
          select: { id: true },
          where: {
            cat: catName,
          },
        })
        .then((cat) => {
          prisma.post
            .findMany({
              where: { categories: { some: { categoryId: cat?.id } } },
              skip: (page - 1) * size,
              take: size * 1,
              orderBy: [{ updatedAt: 'desc' }],
            })
            .then((data) => {
              res.status(200).json({
                posts: data,
                catName,
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
    })
    .catch((err) => {
      res.status(404).send({ code: -1, msg: '接口出错' + err });
    });
}
