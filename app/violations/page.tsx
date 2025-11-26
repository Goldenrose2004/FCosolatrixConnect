"use client"

import { useEffect, useState, useCallback, useRef } from "react"
import { useRouter } from "next/navigation"
import { AuthenticatedHeader } from "@/components/authenticated-header"
import { AlertCircle, CheckCircle2, Calendar, RefreshCw } from "lucide-react"

export default function ViolationsPage() {
  const router = useRouter()
  const [user, setUser] = useState<any>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [violations, setViolations] = useState<any[]>([])
  const [isLoadingViolations, setIsLoadingViolations] = useState(true)
  const violationsChannelRef = useRef<BroadcastChannel | null>(null)

  useEffect(() => {
    // Check if user is logged in
    const currentUser = localStorage.getItem("currentUser")
    if (!currentUser) {
      router.push("/login")
      return
    }

    const userData = JSON.parse(currentUser)
    setUser(userData)
    setIsLoading(false)
  }, [router])

  // Fetch violations for the logged-in user
  const fetchViolations = useCallback(async () => {
    if (!user?.id) return

    try {
      const response = await fetch(`/api/violations?userId=${user.id}`)
      const data = await response.json()

      if (data.ok && data.violations) {
        setViolations(data.violations)
      } else {
        console.error("Failed to fetch violations:", data.error)
        setViolations([])
      }
    } catch (error) {
      console.error("Error fetching violations:", error)
      setViolations([])
    } finally {
      setIsLoadingViolations(false)
    }
  }, [user?.id])

  useEffect(() => {
    if (user?.id) {
      fetchViolations()
      // Poll for new violations every 10 seconds
      const interval = setInterval(fetchViolations, 10000)
      return () => clearInterval(interval)
    }
  }, [user?.id, fetchViolations])

  // Listen for violation events
  useEffect(() => {
    const handleViolationUpdate = () => {
      fetchViolations()
    }

    window.addEventListener("violationCreated", handleViolationUpdate as EventListener)
    window.addEventListener("violationDeleted", handleViolationUpdate as EventListener)

    return () => {
      window.removeEventListener("violationCreated", handleViolationUpdate as EventListener)
      window.removeEventListener("violationDeleted", handleViolationUpdate as EventListener)
    }
  }, [fetchViolations])

  useEffect(() => {
    if (typeof window === "undefined" || typeof BroadcastChannel === "undefined") {
      return
    }
    const channel = new BroadcastChannel("violations-channel")
    const handleMessage = (event: MessageEvent<any>) => {
      const message = event.data
      if (!message || typeof message !== "object") return
      if (message.type !== "violation:status-updated") return
      if (user?.id && message.userId && message.userId !== user.id) return
      fetchViolations()
    }
    channel.addEventListener("message", handleMessage)
    violationsChannelRef.current = channel
    return () => {
      channel.removeEventListener("message", handleMessage)
      channel.close()
      violationsChannelRef.current = null
    }
  }, [fetchViolations, user?.id])

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen" style={{ fontFamily: "'Inter', sans-serif" }}>
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#041A44] mx-auto mb-4"></div>
          <p>Loading...</p>
        </div>
      </div>
    )
  }

  const userInitials = (user?.firstName?.[0] || "U") + (user?.lastName?.[0] || "")

  return (
    <div className="min-h-screen bg-gray-50" style={{ fontFamily: "'Inter', sans-serif" }}>
      <AuthenticatedHeader userName={user?.firstName} userInitials={userInitials} />

      {/* Header Section */}
      <div
        className="text-white py-12 px-6"
        style={{
          background: "linear-gradient(135deg, #001F54, #004AAD)",
          boxShadow: "0 4px 10px rgba(0, 0, 0, 0.2)",
          borderRadius: "0 0 1rem 1rem",
          marginBottom: "2rem",
          fontFamily: "'Inter', sans-serif",
        }}
      >
        <div className="max-w-7xl mx-auto text-center">
          <h1 className="text-4xl md:text-5xl font-bold mb-4" style={{ fontFamily: "'Inter', sans-serif" }}>
            ⚠️ My Violations
          </h1>
          <p className="text-xl opacity-90 max-w-2xl mx-auto" style={{ fontFamily: "'Inter', sans-serif" }}>
            View your violation records and status
          </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 pb-12">
        {isLoadingViolations ? (
          <div className="text-center py-12">
            <RefreshCw className="mx-auto h-16 w-16 text-[#041A44] mb-4 animate-spin" />
            <p className="text-lg font-semibold text-gray-700">Loading violations...</p>
          </div>
        ) : violations.length === 0 ? (
          <div className="text-center py-12 bg-white rounded-lg shadow-md p-8">
            <CheckCircle2 className="mx-auto h-16 w-16 text-green-500 mb-4" />
            <h3 className="text-2xl font-semibold text-gray-800 mb-2">No Violations</h3>
            <p className="text-gray-600">You have no violation records. Keep up the good work!</p>
          </div>
        ) : (
          <div className="space-y-6">
            {violations.map((violation) => (
              <div
                key={violation.id}
                className="bg-white rounded-lg shadow-md overflow-hidden"
                style={{
                  borderLeft: `4px solid ${
                    violation.status === "resolved"
                      ? "#10b981"
                      : violation.status === "warning"
                      ? "#f59e0b"
                      : "#ef4444"
                  }`,
                }}
              >
                <div className="p-6 md:p-8">
                  {/* Violation Header */}
                  <div className="flex flex-col md:flex-row md:items-start md:justify-between mb-4">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <AlertCircle
                          className={`h-6 w-6 ${
                            violation.status === "resolved"
                              ? "text-green-500"
                              : violation.status === "warning"
                              ? "text-yellow-500"
                              : "text-red-500"
                          }`}
                        />
                        <h2
                          className="text-xl md:text-2xl"
                          style={{
                            fontFamily: "'Inter', sans-serif",
                            color: "#1f2937",
                            fontWeight: 600,
                          }}
                        >
                          {violation.violation}
                        </h2>
                      </div>
                      {violation.violationType && (
                        <p className="text-sm text-gray-500 ml-9">Type: {violation.violationType}</p>
                      )}
                    </div>
                    <div className="mt-4 md:mt-0 md:ml-4">
                      <span
                        className={`inline-flex items-center px-4 py-2 rounded-full text-sm font-medium ${
                          violation.status === "resolved"
                            ? "bg-green-100 text-green-800"
                            : violation.status === "warning"
                            ? "bg-yellow-100 text-yellow-800"
                            : "bg-red-100 text-red-800"
                        }`}
                      >
                        {violation.status.charAt(0).toUpperCase() + violation.status.slice(1)}
                      </span>
                    </div>
                  </div>

                  {/* Violation Details */}
                  <div
                    className="mb-4"
                    style={{
                      fontFamily: "'Inter', sans-serif",
                      color: "#4b5563",
                      lineHeight: "1.6",
                    }}
                  >
                    {violation.notes && (
                      <div className="mb-3">
                        <p className="text-sm font-medium text-gray-700 mb-1">Notes:</p>
                        <p className="text-sm text-gray-600">{violation.notes}</p>
                      </div>
                    )}
                  </div>

                  {/* Violation Footer */}
                  <div className="mt-4 pt-4 border-t" style={{ borderTopColor: "#e5e7eb" }}>
                    <div className="flex flex-col md:flex-row md:items-center md:justify-between text-sm" style={{ color: "#6b7280", fontFamily: "'Inter', sans-serif" }}>
                      <div className="flex items-center gap-4 mb-2 md:mb-0">
                        <div className="flex items-center gap-2">
                          <Calendar className="w-4 h-4" />
                          <span>Date: {violation.date}</span>
                        </div>
                        {violation.resolvedAt && (
                          <div className="flex items-center gap-2">
                            <CheckCircle2 className="w-4 h-4 text-green-500" />
                            <span>Resolved: {new Date(violation.resolvedAt).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}</span>
                          </div>
                        )}
                      </div>
                      <div>
                        <span className="text-sm">Managed by: {violation.managedByName}</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

