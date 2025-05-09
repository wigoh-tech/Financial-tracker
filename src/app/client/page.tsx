'use client'
import { useAuth } from '@clerk/nextjs'

export default function Page() {
  const { isLoaded, userId, sessionId,sessionClaims } = useAuth()

  if (!isLoaded || !userId) {
    return null
  }

  return (
    <div>
      Hello, {userId} your current active session is {sessionId} 
      json: {JSON.stringify(sessionClaims)}
    </div>
  )
}