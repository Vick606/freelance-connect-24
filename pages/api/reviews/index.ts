// pages/api/reviews/index.ts

import { NextApiRequest, NextApiResponse } from 'next';
import { getSession } from 'next-auth/react';
import prisma from '@/lib/prisma';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const session = await getSession({ req });

  if (!session) {
    return res.status(401).json({ error: 'Unauthorized' });
  }

  if (req.method === 'POST') {
    const { projectId, rating, comment } = req.body;
    const review = await prisma.review.create({
      data: {
        rating,
        comment,
        projectId,
        userId: session.user.id,
      },
    });
    return res.status(201).json(review);
  } else if (req.method === 'GET') {
    const { projectId } = req.query;
    const reviews = await prisma.review.findMany({
      where: { projectId: String(projectId) },
    });
    return res.status(200).json(reviews);
  }

  res.setHeader('Allow', ['GET', 'POST']);
  res.status(405).end(`Method ${req.method} Not Allowed`);
}