import { useState } from 'react'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import axios from 'axios'
import { useRouter } from 'next/router'

export default function CreateProject() {
  const [title, setTitle] = useState('')
  const [description, setDescription] = useState('')
  const [budget, setBudget] = useState('')
  const router = useRouter()
  const queryClient = useQueryClient()

  const createProjectMutation = useMutation({
    mutationFn: (newProject: { title: string; description: string; budget: number }) =>
      axios.post('/api/projects', newProject),
    onSuccess: () => {
      queryClient.invalidateQueries(['projects'])
      router.push('/dashboard')
    },
  })

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    createProjectMutation.mutate({ title, description, budget: parseFloat(budget) })
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-4">Create New Project</h1>
      <form onSubmit={handleSubmit} className="bg-white shadow-md rounded px-8 pt-6 pb-8 mb-4">
        <div className="mb-4">
          <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="title">
            Project Title
          </label>
          <input
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            id="title"
            type="text"
            placeholder="Enter project title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
          />
        </div>
        <div className="mb-4">
          <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="description">
            Project Description
          </label>
          <textarea
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 mb-3 leading-tight focus:outline-none focus:shadow-outline"
            id="description"
            placeholder="Enter project description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            required
          />
        </div>
        <div className="mb-6">
          <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="budget">
            Budget
          </label>
          <input
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            id="budget"
            type="number"
            placeholder="Enter project budget"
            value={budget}
            onChange={(e) => setBudget(e.target.value)}
            required
          />
        </div>
        <div className="flex items-center justify-between">
          <button
            className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
            type="submit"
            disabled={createProjectMutation.isLoading}
          >
            {createProjectMutation.isLoading ? 'Creating...' : 'Create Project'}
          </button>
        </div>
      </form>
    </div>
  )
}