import { useRouter } from 'next/router'
import { useQuery } from '@tanstack/react-query'
import axios from 'axios'
import MessageList from '../../../src/components/messages/MessageList'
import MessageForm from '../../../src/components/messages/MessageForm'

export default function ProjectMessages() {
  const router = useRouter()
  const { id } = router.query

  const { data: conversation, isLoading, error } = useQuery({
    queryKey: ['conversation', id],
    queryFn: async () => {
      const { data } = await axios.get(`/api/projects/${id}/conversation`)
      return data
    },
    enabled: !!id,
  })

  if (isLoading) return <div>Loading...</div>
  if (error) return <div>Error loading conversation</div>

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-4">Project Messages</h1>
      {conversation ? (
        <>
          <MessageList conversationId={conversation.id} />
          <MessageForm conversationId={conversation.id} />
        </>
      ) : (
        <p>No conversation found for this project.</p>
      )}
    </div>
  )
}