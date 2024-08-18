import { NextApiRequest, NextApiResponse } from 'next';
import { getSession } from 'next-auth/react';
import prisma from '@/lib/prisma';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const session = await getSession({ req });

  if (!session) {
    return res.status(401).json({ error: 'Unauthorized' });
  }

  const { id } = req.query;

  if (req.method === 'GET') {
    const bid = await prisma.bid.findUnique({
      where: { id: String(id) },
    });
    if (bid) {
      return res.status(200).json(bid);
    }
    return res.status(404).json({ error: 'Bid not found' });
  } else if (req.method === 'PUT') {
    const { amount, proposal, status } = req.body;
    const updatedBid = await prisma.bid.update({
      where: { id: String(id) },
      data: { amount, proposal, status },
    });
    return res.status(200).json(updatedBid);
  } else if (req.method === 'DELETE') {
    await prisma.bid.delete({
      where: { id: String(id) },
    });
    return res.status(204).end();
  }

  res.setHeader('Allow', ['GET', 'PUT', 'DELETE']);
  res.status(405).end(`Method ${req.method} Not Allowed`);
}