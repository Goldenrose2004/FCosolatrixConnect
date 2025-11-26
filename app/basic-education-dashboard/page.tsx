"use client"

import { useEffect, useState, useCallback } from "react"
import { useRouter } from "next/navigation"
import { Bell, Shield, Heart, Users, Eye } from "lucide-react"
import { AuthenticatedHeader } from "@/components/authenticated-header"
import { Footer } from "@/components/footer"
import Link from "next/link"

// Custom SVG Icon Components
function GraduationCapIcon({ size = 28, className = "" }: { size?: number; className?: string }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
    >
      <path d="M22 10v6M2 10l10-5 10 5-10 5z" />
      <path d="M6 12v5c3 3 9 3 12 0v-5" />
    </svg>
  )
}

function TargetIcon({ size = 28, className = "" }: { size?: number; className?: string }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
    >
      <circle cx="12" cy="12" r="10" />
      <circle cx="12" cy="12" r="6" />
      <circle cx="12" cy="12" r="2" />
    </svg>
  )
}

function BuildingIcon({ size = 28, className = "" }: { size?: number; className?: string }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
    >
      <path d="M3 21h18" />
      <path d="M5 21V7l8-4v18" />
      <path d="M19 21V11l-6-4" />
      <path d="M9 9v0" />
      <path d="M9 12v0" />
      <path d="M9 15v0" />
      <path d="M9 18v0" />
    </svg>
  )
}

function BookOpenIcon({ size = 28, className = "" }: { size?: number; className?: string }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
    >
      <path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z" />
      <path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z" />
    </svg>
  )
}

const getDashboardCards = (announcementCount: number) => [
  {
    icon: Bell,
    title: "Announcements",
    description: "Official Updates and Administrative Notices",
    link: "/announcements",
    badge: announcementCount > 0 ? announcementCount.toString() : undefined,
    badgeColor: "bg-red-600",
  },
  {
    icon: Shield,
    title: "The School Seal",
    description: "Understand the symbolism behind our school seal",
    link: "/school-seal",
  },
  {
    icon: Eye,
    title: "CCTC Vision and Mission",
    description: "Our guiding principles and aspirations",
    link: "/vision-mission",
  },
  {
    icon: GraduationCapIcon,
    title: "ARSC Core Values",
    description: "The fundamental values that guide our institution",
    link: "/core-values",
  },
  {
    icon: Heart,
    title: "Consolatrician Core Values",
    description: "Values that define a true Consolatrician",
    link: "/consolarician-values",
  },
  {
    icon: TargetIcon,
    title: "Institutional Objectives",
    description: "Our goals and objectives as an institution",
    link: "/institutional-objectives",
  },
  {
    icon: BuildingIcon,
    title: "Basic Education Department",
    description: "Information about our basic education department",
    link: "/basic-education-department",
  },
  {
    icon: BookOpenIcon,
    title: "Historical Background",
    description: "Learning about school's rich history and foundation",
    link: "/history",
  },
  {
    icon: Users,
    title: "Basic Education Sections",
    description: "View the different sections and class divisions",
    link: "/sections",
  },
]

export default function BasicEducationDashboardPage() {
  const router = useRouter()
  const [user, setUser] = useState<any>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [announcementCount, setAnnouncementCount] = useState(0)

  // Fetch announcement notification count
  const fetchAnnouncementCount = useCallback(async () => {
    try {
      const response = await fetch(`/api/announcements?sort=desc`)
      const data = await response.json()
      if (data.ok && Array.isArray(data.announcements)) {
        setAnnouncementCount(data.announcements.length)
      } else {
        setAnnouncementCount(0)
      }
    } catch (error) {
      console.error("Error fetching announcement count:", error)
      setAnnouncementCount(0)
    }
  }, [])

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

    // Fetch announcement count immediately
    fetchAnnouncementCount()
  }, [router, fetchAnnouncementCount])

  // Poll for new announcement notifications every 5 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      fetchAnnouncementCount()
    }, 5000)

    // Listen for custom events
    const handleAnnouncementChange = () => fetchAnnouncementCount()

    window.addEventListener("announcementCreated", handleAnnouncementChange)
    window.addEventListener("announcementUpdated", handleAnnouncementChange)
    window.addEventListener("announcementDeleted", handleAnnouncementChange)

    return () => {
      clearInterval(interval)
      window.removeEventListener("announcementCreated", handleAnnouncementChange)
      window.removeEventListener("announcementUpdated", handleAnnouncementChange)
      window.removeEventListener("announcementDeleted", handleAnnouncementChange)
    }
  }, [fetchAnnouncementCount])

  if (isLoading) {
    return <div className="flex items-center justify-center min-h-screen" style={{ fontFamily: "'Inter', sans-serif" }}>Loading...</div>
  }

  const userInitials = (user?.firstName?.[0] || "U") + (user?.lastName?.[0] || "")

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <AuthenticatedHeader userName={user?.firstName} userInitials={userInitials} />

      {/* Main Content */}
      <main className="flex-1">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 pb-32">
          {/* Header Section */}
          <div className="text-center mb-12">
            <h1 className="text-4xl font-bold mb-4" style={{ fontFamily: "'Inter', sans-serif", color: "#041A44" }}>Basic Education Dashboard</h1>
            <p className="mb-2" style={{ fontFamily: "'Inter', sans-serif", color: "#041A44" }}>
              Access all the important information about our school's policies, values, and structure.
            </p>
            <p className="font-medium" style={{ fontFamily: "'Inter', sans-serif", color: "#041A44" }}>Consolatrix College of Toledo Inc. - Toledo City, Cebu</p>
          </div>

          {/* Cards Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-8 mb-4 md:mb-6">
            {getDashboardCards(announcementCount).map((card, index) => {
              const IconComponent = card.icon
              return (
                <Link
                  key={index}
                  href={card.link}
                  className="relative rounded-lg text-white transition-colors cursor-pointer group flex flex-col items-center justify-center text-center"
                  style={{ 
                    backgroundColor: "#041A44",
                    minHeight: "200px",
                    padding: "1.5rem",
                    fontFamily: "'Inter', sans-serif"
                  }}
                  onMouseEnter={(e) => e.currentTarget.style.backgroundColor = "#041A44"}
                  onMouseLeave={(e) => e.currentTarget.style.backgroundColor = "#041A44"}
                >
                  <div className="relative inline-block">
                    {card.badge && (
                      <span
                        className={`${card.badgeColor} text-white text-xs font-bold rounded-full absolute -top-2 -right-2 w-5 h-5 flex items-center justify-center border-2 border-white shadow-lg z-10`}
                        style={{ fontFamily: "'Inter', sans-serif" }}
                      >
                        {card.badge}
                      </span>
                    )}
                    <IconComponent 
                      size={28} 
                      className="mb-3 group-hover:scale-110 transition-transform"
                      style={{ marginLeft: "auto", marginRight: "auto" }}
                    />
                  </div>
                  <h3 className="text-xl font-semibold mb-2 mt-3" style={{ fontFamily: "'Inter', sans-serif", fontSize: "20px", fontWeight: 600 }}>{card.title}</h3>
                  <p className="text-white text-xs leading-relaxed" style={{ fontFamily: "'Inter', sans-serif", fontSize: "12px", fontWeight: 500, lineHeight: "1.5", opacity: 0.9 }}>{card.description}</p>
                </Link>
              )
            })}
          </div>
        </div>
      </main>

      <Footer />
    </div>
  )
}

