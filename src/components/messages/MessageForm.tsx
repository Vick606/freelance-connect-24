import { useState } from 'react'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import axios from 'axios'

type MessageFormProps = {
  conversationId: number
}

export default function MessageForm({ conversationId }: MessageFormProps) {
  const [content, setContent] = useState('')
  const queryClient = useQueryClient()

  const sendMessageMutation = useMutation({
    mutationFn: (newMessage: { content: string }) =>
      axios.post(`/api/conversations/${conversationId}/messages`, newMessage),
    onSuccess: () => {
      queryClient.invalidateQueries(['messages', conversationId])
      setContent('')
    },
  })

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    sendMessageMutation.mutate({ content })
  }

  return (
    <form onSubmit={handleSubmit} className="mt-4">
      <textarea
        className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
        placeholder="Type your message"
        value={content}
        onChange={(e) => setContent(e.target.value)}
        required
      />
      <button
        type="submit"
        className="mt-2 bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
        disabled={sendMessageMutation.isLoading}
      >
        {sendMessageMutation.isLoading ? 'Sending...' : 'Send Message'}
      </button>
    </form>
  )
}