"use client"

import { useEffect, useState, useCallback } from "react"
import { useRouter } from "next/navigation"
import { AuthenticatedHeader } from "@/components/authenticated-header"
import { Search } from "lucide-react"

type AnnouncementData = {
  id: string
  title: string
  content: string
  [key: string]: any
}

type AnnouncementChannelMessage =
  | { type: "created"; announcements: AnnouncementData[] }
  | { type: "updated"; announcement: AnnouncementData }
  | { type: "deleted"; id: string }

export default function AnnouncementsPage() {
  const router = useRouter()
  const [user, setUser] = useState<any>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState("")

  const [announcements, setAnnouncements] = useState<AnnouncementData[]>([])
  const [isLoadingAnnouncements, setIsLoadingAnnouncements] = useState(true)

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

  const userInitials = (user?.firstName?.[0] || "U") + (user?.lastName?.[0] || "")

  // Fetch announcements from database
  const fetchAnnouncements = useCallback(async () => {
    try {
      const response = await fetch("/api/announcements?sort=desc")
      const data = await response.json()

      if (data.ok && data.announcements) {
        setAnnouncements(data.announcements)
      } else {
        console.error("Failed to fetch announcements:", data.error)
        setAnnouncements([])
      }
    } catch (error) {
      console.error("Error fetching announcements:", error)
      setAnnouncements([])
    } finally {
      setIsLoadingAnnouncements(false)
    }
  }, [])

  useEffect(() => {
    fetchAnnouncements()

    // Poll for new announcements every 5 seconds
    const interval = setInterval(fetchAnnouncements, 5000)
    return () => clearInterval(interval)
  }, [fetchAnnouncements])

  const mergeAnnouncements = useCallback((incoming: AnnouncementData[]) => {
    if (!incoming || incoming.length === 0) return
    setAnnouncements((prev) => {
      const map = new Map<string, AnnouncementData>()
      incoming.forEach((ann) => {
        if (ann?.id) {
          map.set(ann.id, ann)
        }
      })
      prev.forEach((ann) => {
        if (ann?.id && !map.has(ann.id)) {
          map.set(ann.id, ann)
        }
      })
      const sortByDate = (record: AnnouncementData) => new Date(record.createdAt || record.date || 0).getTime()
      return Array.from(map.values()).sort((a, b) => sortByDate(b) - sortByDate(a))
    })
  }, [])

  const removeAnnouncementById = useCallback((id?: string) => {
    if (!id) return
    setAnnouncements((prev) => prev.filter((ann) => ann.id !== id))
  }, [])

  // Listen for new announcement events
  useEffect(() => {
    const handleCreated = (event: Event) => {
      const detail = (event as CustomEvent<AnnouncementData[] | undefined>).detail
      if (Array.isArray(detail) && detail.length) {
        mergeAnnouncements(detail)
      } else {
        fetchAnnouncements()
      }
    }

    const handleUpdated = (event: Event) => {
      const detail = (event as CustomEvent<AnnouncementData | AnnouncementData[] | undefined>).detail
      if (Array.isArray(detail) && detail.length) {
        mergeAnnouncements(detail)
      } else if (detail && !Array.isArray(detail)) {
        mergeAnnouncements([detail])
      } else {
        fetchAnnouncements()
      }
    }

    const handleDeleted = (event: Event) => {
      const detail = (event as CustomEvent<string | undefined>).detail
      if (typeof detail === "string") {
        removeAnnouncementById(detail)
      } else {
        fetchAnnouncements()
      }
    }

    window.addEventListener("announcementCreated", handleCreated as EventListener)
    window.addEventListener("announcementUpdated", handleUpdated as EventListener)
    window.addEventListener("announcementDeleted", handleDeleted as EventListener)

    return () => {
      window.removeEventListener("announcementCreated", handleCreated as EventListener)
      window.removeEventListener("announcementUpdated", handleUpdated as EventListener)
      window.removeEventListener("announcementDeleted", handleDeleted as EventListener)
    }
  }, [fetchAnnouncements, mergeAnnouncements, removeAnnouncementById])

  useEffect(() => {
    if (typeof window === "undefined" || typeof BroadcastChannel === "undefined") {
      return
    }
    const channel = new BroadcastChannel("announcements-channel")
    const handleMessage = (event: MessageEvent<AnnouncementChannelMessage>) => {
      const payload = event.data
      if (!payload) return
      if (payload.type === "created" && payload.announcements?.length) {
        mergeAnnouncements(payload.announcements)
      } else if (payload.type === "updated" && payload.announcement) {
        mergeAnnouncements([payload.announcement])
      } else if (payload.type === "deleted" && payload.id) {
        removeAnnouncementById(payload.id)
      }
    }
    channel.addEventListener("message", handleMessage)
    return () => {
      channel.removeEventListener("message", handleMessage)
      channel.close()
    }
  }, [mergeAnnouncements, removeAnnouncementById])

  const filteredAnnouncements = announcements.filter((ann) => {
    const query = searchQuery.toLowerCase()
    return ann.title.toLowerCase().includes(query) || ann.content.toLowerCase().includes(query)
  })
  const totalAnnouncements = announcements.length

  return (
    <div className="min-h-screen bg-gray-50" style={{ fontFamily: "'Inter', sans-serif" }}>
      <AuthenticatedHeader userName={user?.firstName} userInitials={userInitials} useLandingPageStylingMobileOnly={true} />

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
          <h1 className="text-3xl md:text-4xl font-bold mb-4" style={{ fontFamily: "'Inter', sans-serif" }}>
            📢 Announcements
          </h1>
          <p className="text-sm sm:text-xl opacity-90 max-w-2xl mx-auto" style={{ fontFamily: "'Inter', sans-serif" }}>
            Stay updated with important announcements and updates from the school administration
          </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 pb-12">
        {/* Search Box */}
        <div className="relative max-w-md sm:max-w-md mx-auto mb-6 sm:mb-8 px-2 sm:px-0">
          <div className="absolute left-3 top-1/2 transform -translate-y-1/2" style={{ color: "#9ca3af" }}>
            <svg width="20" height="20" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z" clipRule="evenodd"/>
            </svg>
          </div>
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search announcements..."
            className="w-full pl-10 pr-4 py-2 sm:py-3 border-2 rounded-lg text-sm sm:text-base transition-all duration-300"
            style={{
              fontFamily: "'Inter', sans-serif",
              borderColor: "#e5e7eb",
              paddingLeft: "2.5rem",
            }}
            onFocus={(e) => {
              e.target.style.borderColor = "#3b82f6"
              e.target.style.boxShadow = "0 0 0 3px rgba(59, 130, 246, 0.1)"
            }}
            onBlur={(e) => {
              e.target.style.borderColor = "#e5e7eb"
              e.target.style.boxShadow = "none"
            }}
          />
        </div>

        {/* Announcements Container */}
        <div>
          {isLoadingAnnouncements ? (
            <div className="text-center py-12 px-4" style={{ color: "#6b7280", fontFamily: "'Inter', sans-serif" }}>
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#041A44] mx-auto mb-4"></div>
              <h3 className="text-lg font-medium mb-2" style={{ color: "#111827", fontFamily: "'Inter', sans-serif" }}>Loading announcements...</h3>
            </div>
          ) : filteredAnnouncements.length === 0 ? (
            <div className="text-center py-12 px-4" style={{ color: "#6b7280", fontFamily: "'Inter', sans-serif" }}>
              <svg className="mx-auto h-16 w-16 mb-4" style={{ color: "#9ca3af" }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
              <h3 className="text-sm sm:text-lg font-medium mb-2" style={{ color: "#111827", fontFamily: "'Inter', sans-serif" }}>No announcements found</h3>
              <p className="text-xs sm:text-base" style={{ color: "#6b7280", fontFamily: "'Inter', sans-serif" }}>Try adjusting your search terms or check back later.</p>
            </div>
          ) : (
            <div className="grid gap-4 md:gap-12">
              {filteredAnnouncements.map((announcement) => {
                return (
                  <div
                    key={announcement.id}
                className="mx-auto mb-8 max-sm:mb-6 w-full max-w-[92vw] sm:max-w-[85vw] md:max-w-none rounded-2xl bg-gradient-to-br from-white to-[#f5f8ff] shadow-[0_18px_35px_rgba(4,26,68,0.08)] ring-1 ring-[#e0e7ff] overflow-hidden transition duration-300 max-sm:rounded-xl max-sm:border-l-4 max-sm:border-[#041A44] md:rounded-lg md:bg-white md:shadow-md md:ring-0 md:border-l-4 md:border-[#041A44]"
                  >
                <div className="p-6 max-sm:p-4 md:p-8">
                    {/* Announcement Header */}
                    <div className="flex flex-col gap-3 md:flex-row md:items-start md:justify-between mb-4">
                      <div className="flex items-center justify-between gap-3 md:flex-1 md:items-start md:justify-between">
                    <h2
                      className="text-xl max-sm:text-base md:text-2xl flex-1 md:mr-4"
                          style={{
                            fontFamily: "'Inter', sans-serif",
                            color: "#1f2937",
                            fontWeight: 600,
                          }}
                        >
                          {announcement.title}
                        </h2>
                    <div className="text-sm max-sm:text-xs font-medium text-[#1e40af] md:ml-4" aria-label={`Published on ${announcement.date}`}></div>
                      </div>
                    </div>

                    {/* Announcement Content */}
                    <div
                      className="break-words whitespace-pre-wrap"
                      style={{
                        fontFamily: "'Inter', sans-serif",
                        color: "#4b5563",
                        lineHeight: "1.7",
                        textAlign: "justify",
                        textJustify: "inter-word",
                        hyphens: "auto",
                        overflowWrap: "anywhere",
                      }}
                    >
                      <p className="m-0 text-base max-sm:text-[12px] max-sm:leading-[1.5]">{announcement.content}</p>
                    </div>

                    {/* Announcement Footer */}
                    <div className="mt-4 pt-4 border-t" style={{ borderTopColor: "#e5e7eb" }}>
                      <div className="flex items-center justify-between text-sm max-sm:text-[11px]" style={{ color: "#6b7280", fontFamily: "'Inter', sans-serif" }}>
                        <span>Published on {announcement.date}</span>
                        {announcement.isImportant && (
                          <span className="flex items-center">
                            <svg className="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
                              <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd"/>
                            </svg>
                            Important
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                  </div>
                )
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

