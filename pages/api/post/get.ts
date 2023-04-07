// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import { response } from '@/components/server/dto/response';
import prisma from '@/components/server/utils/prisma';
import type { NextApiRequest, NextApiResponse } from 'next';

export type Data = {
  title?: string;
  content?: string;
  categories?: { categoryId: number }[];
  id?: number;
} & response;

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<Data>
) {
  const { id } = req.query;
  if (typeof id == 'string') {
    const post = await prisma.post.findUnique({
      where: { id: parseInt(id) },
      select: {
        title: true,
        postContent: { select: { content: true } },
        id: true,
        categories: {
          select: {
            categoryId: true,
          },
        },
      },
    });
    // console.log(post);
    if (post) {
      res.status(200).json({
        title: post?.title,
        content: post?.postContent?.content,
        id: post?.id ? parseInt(post.id.toString()) : undefined,
        categories: post.categories,
        code: 0,
      });
    } else {
      res.status(404).send({ code: -1, msg: 'error' });
    }
  } else {
    res.status(404).send({ code: -1, msg: 'error' });
  }
}
