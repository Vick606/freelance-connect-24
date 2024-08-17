import { useRouter } from 'next/router'
import { useQuery } from '@tanstack/react-query'
import axios from 'axios'
import { useSession } from 'next-auth/react'
import BidForm from '../../src/components/bids/BidForm'
import ReviewForm from '../../src/components/reviews/ReviewForm'

type Project = {
  id: number
  title: string
  description: string
  budget: number
  owner: {
    name: string
    email: string
  }
  bids: Bid[]
}

type Bid = {
  id: number
  amount: number
  proposal: string
  user: {
    name: string
  }
}

type Review = {
  id: number
  content: string
  rating: number
  reviewer: {
    name: string
  }
}

export default function ProjectDetails() {
  const router = useRouter()
  const { id } = router.query
  const { data: session } = useSession()

  const { data: project, isLoading, error } = useQuery<Project>({
    queryKey: ['project', id],
    queryFn: async () => {
      const { data } = await axios.get(`/api/projects/${id}`)
      return data
    },
    enabled: !!id,
  })

  if (isLoading) return <div>Loading...</div>
  if (error) return <div>Error loading project</div>
  if (!project) return <div>Project not found</div>

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-4">{project.title}</h1>
      <div className="bg-white shadow-md rounded px-8 pt-6 pb-8 mb-4">
        <p className="text-gray-700 text-base mb-4">{project.description}</p>
        <p className="text-gray-700 text-base mb-4">Budget: ${project.budget}</p>
        <p className="text-gray-700 text-base mb-4">Posted by: {project.owner.name}</p>
      </div>

      <h2 className="text-2xl font-bold mb-4">Bids</h2>
      {project.bids.length > 0 ? (
        <div className="space-y-4">
          {project.bids.map((bid) => (
            <div key={bid.id} className="bg-white shadow-md rounded px-8 pt-6 pb-8">
              <p className="text-gray-700 text-base mb-2">Bid Amount: ${bid.amount}</p>
              <p className="text-gray-700 text-base mb-2">Proposal: {bid.proposal}</p>
              <p className="text-gray-700 text-base">Bidder: {bid.user.name}</p>
            </div>
          ))}
        </div>
      ) : (
        <p>No bids yet.</p>
      )}

      {session && session.user.id !== project.owner.id && (
        <div className="mt-8">
          <h2 className="text-2xl font-bold mb-4">Place a Bid</h2>
          <BidForm projectId={project.id} />
        </div>
      )}

{project.status === 'COMPLETED' && (
  <div className="mt-8">
    <h2 className="text-2xl font-bold mb-4">Project Review</h2>
    {project.review ? (
      <div className="bg-white shadow-md rounded px-8 pt-6 pb-8">
        <p className="text-gray-700 text-base mb-2">{project.review.content}</p>
        <p className="text-gray-700 text-base mb-2">Rating: {project.review.rating}/5</p>
        <p className="text-gray-500 text-sm">
          Reviewed by: {project.review.reviewer.name}
        </p>
      </div>
    ) : session?.user?.id === project.owner.id ? (
      <ReviewForm projectId={project.id} revieweeId={project.assignedTo.id} />
    ) : (
      <p>No review yet.</p>
    )}
  </div>
)}
    </div>
  )
}