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

  if (req.method === 'POST') {
    const { content, rating, revieweeId } = req.body

    try {
      const project = await prisma.project.findUnique({
        where: { id: Number(id) },
      })

      if (!project) {
        return res.status(404).json({ error: 'Project not found' })
      }

      if (project.status !== 'COMPLETED') {
        return res.status(400).json({ error: 'Project is not completed' })
      }

      if (project.ownerId !== session.user.id) {
        return res.status(403).json({ error: 'Only the project owner can leave a review' })
      }

      const review = await prisma.review.create({
        data: {
          content,
          rating,
          projectId: Number(id),
          reviewerId: session.user.id,
          revieweeId: Number(revieweeId),
        },
      })

      res.status(201).json(review)
    } catch (error) {
      res.status(500).json({ error: 'Error creating review' })
    }
  } else {
    res.setHeader('Allow', ['POST'])
    res.status(405).end(`Method ${req.method} Not Allowed`)
  }
}