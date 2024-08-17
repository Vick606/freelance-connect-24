import type { NextApiRequest, NextApiResponse } from 'next'

type Project = {
  id: number
  title: string
  description: string
}

export default function handler(
  req: NextApiRequest,
  res: NextApiResponse<Project[]>
) {
  // This is placeholder data. In a real application, you would fetch this from a database.
  const projects: Project[] = [
    { id: 1, title: "Web Design Project", description: "Create a responsive website for a local business" },
    { id: 2, title: "Mobile App Development", description: "Develop a cross-platform mobile app for task management" },
    { id: 3, title: "Database Optimization", description: "Optimize database queries for improved performance" },
  ]

  res.status(200).json(projects)
}