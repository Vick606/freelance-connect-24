import type { NextApiRequest, NextApiResponse } from 'next'
import prisma from '../../../src/lib/prisma'
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
      const project = await prisma.project.findUnique({
        where: { id: Number(id) },
        include: {
          owner: {
            select: {
              name: true,
              email: true,
            },
          },
          bids: {
            include: {
              user: {
                select: {
                  name: true,
                },
              },
            },
          },
        },
      })

      if (!project) {
        return res.status(404).json({ error: 'Project not found' })
      }

      res.status(200).json(project)
    } catch (error) {
      res.status(500).json({ error: 'Error fetching project' })
    }
  } else {
    res.setHeader('Allow', ['GET'])
    res.status(405).end(`Method ${req.method} Not Allowed`)
  }
}