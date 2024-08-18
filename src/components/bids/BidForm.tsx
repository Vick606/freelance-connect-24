import { useState } from 'react'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import axios from 'axios'

type BidFormProps = {
  projectId: string
}

export default function BidForm({ projectId }: BidFormProps) {
  const [amount, setAmount] = useState('')
  const [proposal, setProposal] = useState('')
  const queryClient = useQueryClient()

  const bidMutation = useMutation({
    mutationFn: (newBid: { amount: number; proposal: string }) =>
      axios.post(`/api/bids`, { ...newBid, projectId }),
    onSuccess: () => {
      queryClient.invalidateQueries(['bids', projectId])
      setAmount('')
      setProposal('')
    },
  })

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    bidMutation.mutate({ amount: parseFloat(amount), proposal })
  }

  return (
    <form onSubmit={handleSubmit} className="bg-white shadow-md rounded px-8 pt-6 pb-8 mb-4">
      <div className="mb-4">
        <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="amount">
          Bid Amount
        </label>
        <input
          className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
          id="amount"
          type="number"
          placeholder="Enter bid amount"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
          required
        />
      </div>
      <div className="mb-6">
        <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="proposal">
          Proposal
        </label>
        <textarea
          className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 mb-3 leading-tight focus:outline-none focus:shadow-outline"
          id="proposal"
          placeholder="Enter your proposal"
          value={proposal}
          onChange={(e) => setProposal(e.target.value)}
          required
        />
      </div>
      {bidMutation.isError && (
        <div className="text-red-500 mb-4">
          Error submitting bid: {bidMutation.error.message}
        </div>
      )}
      <div className="flex items-center justify-between">
        <button
          className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
          type="submit"
          disabled={bidMutation.isLoading}
        >
          {bidMutation.isLoading ? 'Submitting...' : 'Submit Bid'}
        </button>
      </div>
    </form>
  )
}