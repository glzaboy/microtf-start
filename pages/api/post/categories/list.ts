import { response } from '@/components/server/dto/response';
import prisma from '@/components/server/utils/prisma';
import type { Category } from '@prisma/client';
import type { NextApiRequest, NextApiResponse } from 'next';

export type Data = {
  categories?: Array<Category>;
  total?: number;
} & response;

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<Data>
) {
  console.log(req.body);
  const { page, size }: { page: number; size: number } = req.body;
  const categories = await prisma.category.findMany({
    orderBy: [{ id: 'desc' }],
    select: {
      id: true,
      cat: true,
      createAt: true,
      updatedAt: true,
      reqLogin: true,
    },
    take: size ?? 10,
    skip: ((page ?? 1) - 1) * (size ?? 10),
  });
  const total = await prisma.category.count();
  if (categories) {
    res.status(200).json({
      categories,
      total,
      code: 0,
    });
  } else {
    res.status(404).send({ code: -1, msg: 'error' });
  }
}
