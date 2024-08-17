import { useState } from 'react'
import { useQuery } from '@tanstack/react-query'
import axios from 'axios'
import Link from 'next/link'

type Project = {
  id: number
  title: string
  description: string
  budget: number
  owner: {
    name: string
  }
}

export default function Home() {
  const [searchTerm, setSearchTerm] = useState('')
  const [minBudget, setMinBudget] = useState('')
  const [maxBudget, setMaxBudget] = useState('')

  const { data: projects, isLoading, error } = useQuery<Project[]>({
    queryKey: ['projects', searchTerm, minBudget, maxBudget],
    queryFn: async () => {
      const { data } = await axios.get('/api/projects', {
        params: { search: searchTerm, minBudget, maxBudget },
      })
      return data
    },
  })

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    // The query will automatically refetch due to the queryKey change
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-4">Available Projects</h1>
      <form onSubmit={handleSearch} className="mb-8">
        <div className="flex flex-wrap -mx-2 mb-4">
          <div className="w-full md:w-1/3 px-2 mb-4 md:mb-0">
            <input
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              type="text"
              placeholder="Search projects"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <div className="w-full md:w-1/3 px-2 mb-4 md:mb-0">
            <input
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              type="number"
              placeholder="Min Budget"
              value={minBudget}
              onChange={(e) => setMinBudget(e.target.value)}
            />
          </div>
          <div className="w-full md:w-1/3 px-2">
            <input
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              type="number"
              placeholder="Max Budget"
              value={maxBudget}
              onChange={(e) => setMaxBudget(e.target.value)}
            />
          </div>
        </div>
        <button
          className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
          type="submit"
        >
          Search
        </button>
      </form>
      {isLoading && <div>Loading projects...</div>}
      {error && <div>Error loading projects</div>}
      {projects && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {projects.map((project) => (
            <div key={project.id} className="bg-white p-4 rounded shadow">
              <h2 className="text-xl font-semibold mb-2">{project.title}</h2>
              <p className="text-gray-600 mb-2">{project.description}</p>
              <p className="text-gray-800 font-bold mb-2">Budget: ${project.budget}</p>
              <p className="text-gray-600 mb-4">Posted by: {project.owner.name}</p>
              <Link href={`/projects/${project.id}`} className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">
                View Details
              </Link>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}