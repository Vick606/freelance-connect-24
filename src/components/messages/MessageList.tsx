import { useQuery } from '@tanstack/react-query'
import axios from 'axios'

type Message = {
  id: number
  content: string
  senderId: number
  createdAt: string
}

type MessageListProps = {
  conversationId: number
}

export default function MessageList({ conversationId }: MessageListProps) {
  const { data: messages, isLoading, error } = useQuery<Message[]>({
    queryKey: ['messages', conversationId],
    queryFn: async () => {
      const { data } = await axios.get(`/api/conversations/${conversationId}/messages`)
      return data
    },
  })

  if (isLoading) return <div>Loading messages...</div>
  if (error) return <div>Error loading messages</div>

  return (
    <div className="space-y-4">
      {messages?.map((message) => (
        <div key={message.id} className="bg-white p-4 rounded shadow">
          <p className="text-gray-800">{message.content}</p>
          <p className="text-gray-500 text-sm mt-2">
            Sent by: User {message.senderId} at {new Date(message.createdAt).toLocaleString()}
          </p>
        </div>
      ))}
    </div>
  )
}