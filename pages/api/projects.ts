import type { NextApiRequest, NextApiResponse } from 'next'
import prisma from '../../src/lib/prisma'
import { getSession } from 'next-auth/react'

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const session = await getSession({ req })

  if (!session) {
    return res.status(401).json({ error: 'Unauthorized' })
  }

  if (req.method === 'GET') {
    try {
      const projects = await prisma.project.findMany({
        include: {
          owner: {
            select: {
              name: true,
              email: true,
            },
          },
        },
      })
      res.status(200).json(projects)
    } catch (error) {
      res.status(500).json({ error: 'Error fetching projects' })
    }
  } else if (req.method === 'POST') {
    const { title, description, budget } = req.body
    try {
      const project = await prisma.project.create({
        data: {
          title,
          description,
          budget: parseFloat(budget),
          ownerId: session.user.id,
        },
      })
      res.status(201).json(project)
    } catch (error) {
      res.status(500).json({ error: 'Error creating project' })
    }
  } else {
    res.setHeader('Allow', ['GET', 'POST'])
    res.status(405).end(`Method ${req.method} Not Allowed`)
  }
}