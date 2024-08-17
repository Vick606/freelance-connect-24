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
      let conversation = await prisma.conversation.findFirst({
        where: { projectId: Number(id) },
      })

      if (!conversation) {
        // If no conversation exists, create one
        conversation = await prisma.conversation.create({
          data: { projectId: Number(id) },
        })
      }

      res.status(200).json(conversation)
    } catch (error) {
      res.status(500).json({ error: 'Error fetching or creating conversation' })
    }
  } else {
    res.setHeader('Allow', ['GET'])
    res.status(405).end(`Method ${req.method} Not Allowed`)
  }
}