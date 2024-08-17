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
      const user = await prisma.user.findUnique({
        where: { id: session.user.id },
        select: { id: true, name: true, email: true },
      })

      if (!user) {
        return res.status(404).json({ error: 'User not found' })
      }

      res.status(200).json(user)
    } catch (error) {
      res.status(500).json({ error: 'Error fetching user' })
    }
  } else if (req.method === 'PUT') {
    const { name } = req.body

    try {
      const updatedUser = await prisma.user.update({
        where: { id: session.user.id },
        data: { name },
        select: { id: true, name: true, email: true },
      })

      res.status(200).json(updatedUser)
    } catch (error) {
      res.status(500).json({ error: 'Error updating user' })
    }
  } else {
    res.setHeader('Allow', ['GET', 'PUT'])
    res.status(405).end(`Method ${req.method} Not Allowed`)
  }
}