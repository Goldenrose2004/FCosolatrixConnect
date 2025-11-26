import { useEffect, useRef } from "react"

export function usePresence() {
  const intervalRef = useRef<NodeJS.Timeout | null>(null)

  useEffect(() => {
    // Get current user from localStorage
    const currentUser = localStorage.getItem("currentUser")
    if (!currentUser) {
      return
    }

    try {
      const userData = JSON.parse(currentUser)
      // Handle both string and ObjectId formats
      const userId = userData.id || userData._id

      if (!userId) {
        return
      }

      // Convert to string if it's an ObjectId
      const userIdString = typeof userId === 'object' ? userId.toString() : String(userId)

      // Send initial presence update
      const updatePresence = async () => {
        try {
          const response = await fetch("/api/users/presence", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({ userId: userIdString }),
          })
          
          // Check if response is ok before processing
          if (!response.ok) {
            // Silently fail for non-critical presence updates
            return
          }
        } catch (error) {
          // Silently fail - don't interrupt user experience
          // Network errors are expected if the server is temporarily unavailable
        }
      }

      // Send initial update
      updatePresence()

      // Set up interval to send heartbeat every 30 seconds
      intervalRef.current = setInterval(() => {
        updatePresence()
      }, 30000) // 30 seconds

      // Also update on user activity (mouse movement, clicks, keyboard)
      const handleActivity = () => {
        updatePresence()
      }

      // Throttle activity updates to avoid too many requests
      let activityTimeout: NodeJS.Timeout | null = null
      const throttledActivity = () => {
        if (activityTimeout) {
          clearTimeout(activityTimeout)
        }
        activityTimeout = setTimeout(handleActivity, 5000) // Wait 5 seconds after last activity
      }

      window.addEventListener("mousemove", throttledActivity)
      window.addEventListener("click", throttledActivity)
      window.addEventListener("keydown", throttledActivity)

      return () => {
        if (intervalRef.current) {
          clearInterval(intervalRef.current)
        }
        window.removeEventListener("mousemove", throttledActivity)
        window.removeEventListener("click", throttledActivity)
        window.removeEventListener("keydown", throttledActivity)
        if (activityTimeout) {
          clearTimeout(activityTimeout)
        }
      }
    } catch (error) {
      console.error("Error setting up presence:", error)
    }
  }, [])
}

