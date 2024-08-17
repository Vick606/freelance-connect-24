import type { NextApiRequest, NextApiResponse } from 'next'
import prisma from '../../../src/lib/prisma'

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method === 'GET') {
    const { search, minBudget, maxBudget } = req.query

    try {
      const projects = await prisma.project.findMany({
        where: {
          AND: [
            search
              ? {
                  OR: [
                    { title: { contains: search as string, mode: 'insensitive' } },
                    { description: { contains: search as string, mode: 'insensitive' } },
                  ],
                }
              : {},
            minBudget ? { budget: { gte: parseFloat(minBudget as string) } } : {},
            maxBudget ? { budget: { lte: parseFloat(maxBudget as string) } } : {},
          ],
        },
        include: {
          owner: {
            select: {
              name: true,
            },
          },
        },
        orderBy: {
          createdAt: 'desc',
        },
      })

      res.status(200).json(projects)
    } catch (error) {
      res.status(500).json({ error: 'Error fetching projects' })
    }
  } else if (req.method === 'POST') {
    // ... (keep the existing POST logic)
  } else {
    res.setHeader('Allow', ['GET', 'POST'])
    res.status(405).end(`Method ${req.method} Not Allowed`)
  }
}