import { useSession } from 'next-auth/react'
import { useQuery } from '@tanstack/react-query'
import axios from 'axios'
import Link from 'next/link'

type Project = {
  id: number
  title: string
  description: string
  budget: number
}

export default function Dashboard() {
  const { data: session, status } = useSession()
  const { data: projects, isLoading, error } = useQuery<Project[]>({
    queryKey: ['projects'],
    queryFn: async () => {
      const { data } = await axios.get('/api/projects')
      return data
    },
    enabled: !!session,
  })

  if (status === 'loading') return <div>Loading...</div>
  if (status === 'unauthenticated') return <div>Access Denied</div>

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-4">Dashboard</h1>
      <Link href="/projects/create" className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">
        Create New Project
      </Link>
      <div className="mt-8">
        <h2 className="text-2xl font-semibold mb-4">Your Projects</h2>
        {isLoading && <div>Loading projects...</div>}
        {error && <div>Error loading projects</div>}
        {projects && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {projects.map((project) => (
              <div key={project.id} className="bg-white p-4 rounded shadow">
                <h3 className="text-xl font-semibold">{project.title}</h3>
                <p className="mt-2">{project.description}</p>
                <p className="mt-2 font-bold">Budget: ${project.budget}</p>
                <Link href={`/projects/${project.id}`} className="mt-4 inline-block bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded">
                  View Details
                </Link>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}