import { NextApiRequest, NextApiResponse } from 'next';
import { getSession } from 'next-auth/react';
import prisma from '@/lib/prisma';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const session = await getSession({ req });

  if (!session) {
    return res.status(401).json({ error: 'Unauthorized' });
  }

  if (req.method === 'POST') {
    const { projectId, amount, proposal } = req.body;
    const bid = await prisma.bid.create({
      data: {
        amount,
        proposal,
        projectId,
        userId: session.user.id,
      },
    });
    return res.status(201).json(bid);
  } else if (req.method === 'GET') {
    const { projectId } = req.query;
    const bids = await prisma.bid.findMany({
      where: { projectId: String(projectId) },
    });
    return res.status(200).json(bids);
  }

  res.setHeader('Allow', ['GET', 'POST']);
  res.status(405).end(`Method ${req.method} Not Allowed`);
}