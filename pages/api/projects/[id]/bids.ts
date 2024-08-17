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
    const { amount, proposal } = req.body

    try {
      const bid = await prisma.bid.create({
        data: {
          amount: parseFloat(amount),
          proposal,
          project: { connect: { id: Number(id) } },
          user: { connect: { id: session.user.id } },
        },
      })

      res.status(201).json(bid)
    } catch (error) {
      res.status(500).json({ error: 'Error creating bid' })
    }
  } else {
    res.setHeader('Allow', ['POST'])
    res.status(405).end(`Method ${req.method} Not Allowed`)
  }
}