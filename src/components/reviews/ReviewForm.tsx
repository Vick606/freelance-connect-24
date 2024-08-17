import { useState } from 'react'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import axios from 'axios'

type ReviewFormProps = {
  projectId: number
  revieweeId: number
}

export default function ReviewForm({ projectId, revieweeId }: ReviewFormProps) {
  const [content, setContent] = useState('')
  const [rating, setRating] = useState(5)
  const queryClient = useQueryClient()

  const createReviewMutation = useMutation({
    mutationFn: (newReview: { content: string; rating: number }) =>
      axios.post(`/api/projects/${projectId}/reviews`, { ...newReview, revieweeId }),
    onSuccess: () => {
      queryClient.invalidateQueries(['project', projectId])
      setContent('')
      setRating(5)
    },
  })

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    createReviewMutation.mutate({ content, rating })
  }

  return (
    <form onSubmit={handleSubmit} className="mt-4">
      <textarea
        className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
        placeholder="Write your review"
        value={content}
        onChange={(e) => setContent(e.target.value)}
        required
      />
      <div className="mt-2">
        <label className="block text-gray-700 text-sm font-bold mb-2">
          Rating:
          <select
            value={rating}
            onChange={(e) => setRating(parseInt(e.target.value))}
            className="ml-2 shadow border rounded py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
          >
            {[1, 2, 3, 4, 5].map((value) => (
              <option key={value} value={value}>
                {value}
              </option>
            ))}
          </select>
        </label>
      </div>
      <button
        type="submit"
        className="mt-2 bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
        disabled={createReviewMutation.isLoading}
      >
        {createReviewMutation.isLoading ? 'Submitting...' : 'Submit Review'}
      </button>
    </form>
  )
}