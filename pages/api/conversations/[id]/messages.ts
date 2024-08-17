import type { NextApiRequest, NextApiResponse } from 'next'
import prisma from '../../../../src/lib/prisma'
import { getSession } from 'next-auth/react'

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const session = await getSession({ req })

  if (!session) {
    return res.status(401).json({ error: 'Unauthorized' })
  }

  const { id } = req.query

  if (req.method === 'GET') {
    try {
      const messages = await prisma.message.findMany({
        where: { conversationId: Number(id) },
        orderBy: { createdAt: 'asc' },
      })
      res.status(200).json(messages)
    } catch (error) {
      res.status(500).json({ error: 'Error fetching messages' })
    }
  } else if (req.method === 'POST') {
    const { content } = req.body

    try {
      const message = await prisma.message.create({
        data: {
          content,
          conversationId: Number(id),
          senderId: session.user.id,
        },
      })
      res.status(201).json(message)
    } catch (error) {
      res.status(500).json({ error: 'Error creating message' })
    }
  } else {
    res.setHeader('Allow', ['GET', 'POST'])
    res.status(405).end(`Method ${req.method} Not Allowed`)
  }
}