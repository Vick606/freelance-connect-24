import { NextApiRequest, NextApiResponse } from 'next';
import { getSession } from 'next-auth/react';
import prisma from '@/lib/prisma';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const session = await getSession({ req });

  if (!session) {
    return res.status(401).json({ error: 'Unauthorized' });
  }

  if (req.method === 'POST') {
    const { projectId, content } = req.body;
    const message = await prisma.message.create({
      data: {
        content,
        projectId,
        userId: session.user.id,
      },
    });
    return res.status(201).json(message);
  } else if (req.method === 'GET') {
    const { projectId } = req.query;
    const messages = await prisma.message.findMany({
      where: { projectId: String(projectId) },
      orderBy: { createdAt: 'asc' },
    });
    return res.status(200).json(messages);
  }

  res.setHeader('Allow', ['GET', 'POST']);
  res.status(405).end(`Method ${req.method} Not Allowed`);
}