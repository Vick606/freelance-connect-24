import { useState } from 'react'
import { useQuery } from '@tanstack/react-query'
import axios from 'axios'

type Project = {
  id: number
  title: string
  description: string
}

export default function Projects() {
  const [projects, setProjects] = useState<Project[]>([])

  const { isLoading, error } = useQuery({
    queryKey: ['projects'],
    queryFn: async () => {
      const { data } = await axios.get('/api/projects')
      setProjects(data)
      return data
    },
  })

  if (isLoading) return <div>Loading...</div>
  if (error) return <div>An error occurred: {error.toString()}</div>

  return (
    <div>
      <h1 className="text-3xl font-bold mb-4">Projects</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {projects.map((project) => (
          <div key={project.id} className="bg-white p-4 rounded shadow">
            <h2 className="text-xl font-semibold">{project.title}</h2>
            <p className="mt-2">{project.description}</p>
          </div>
        ))}
      </div>
    </div>
  )
}