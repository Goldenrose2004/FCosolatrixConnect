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

function DocumentIcon({ size = 28, className = "" }: { size?: number; className?: string }) {
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
      <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
      <path d="M14 2v6h6" />
      <path d="M16 13H8" />
      <path d="M16 17H8" />
      <path d="M10 9H8" />
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
    title: "Consolarician Core Values",
    description: "Values that define a true Consolarician",
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
    title: "College Department",
    description: "Information about our college department",
    link: "/college-department",
  },
  {
    icon: DocumentIcon,
    title: "College Courses Offered",
    description: "Explore our range of academic programs",
    link: "/courses",
  },
  {
    icon: BookOpenIcon,
    title: "Historical Background",
    description: "Learning about school's rich history and foundation",
    link: "/history",
  },
]

export default function CollegeDashboardPage() {
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
      <AuthenticatedHeader userName={user?.firstName} userInitials={userInitials} useLandingPageStyling={true} />

      {/* Main Content */}
      <main className="flex-1">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8 lg:py-12">
          {/* Header Section */}
          <div className="text-center mb-8 sm:mb-10 lg:mb-12">
            <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold mb-3 sm:mb-4 px-2" style={{ fontFamily: "'Inter', sans-serif", color: "#041A44" }}>College Dashboard</h1>
            <p className="text-sm sm:text-base mb-2 px-4" style={{ fontFamily: "'Inter', sans-serif", color: "#041A44" }}>
              Access all the important information about our school's policies, values, and structure.
            </p>
            <p className="text-sm sm:text-base font-medium px-4" style={{ fontFamily: "'Inter', sans-serif", color: "#041A44" }}>Consolatrix College of Toledo Inc. - Toledo City, Cebu</p>
          </div>

          {/* Cards Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 md:gap-8 mb-4 sm:mb-6">
            {getDashboardCards(announcementCount).slice(0, 9).map((card, index) => {
              const IconComponent = card.icon
              return (
                <Link
                  key={index}
                  href={card.link}
                  className="relative text-white transition-all cursor-pointer group flex flex-col items-center justify-center text-center"
                  style={{ 
                    backgroundColor: "#041A44",
                    minHeight: "200px",
                    borderRadius: "12px",
                    padding: "1.5rem",
                    fontFamily: "'Inter', sans-serif"
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.backgroundColor = "#041A44"
                    e.currentTarget.style.transform = "translateY(-4px)"
                    e.currentTarget.style.boxShadow = "0 10px 25px rgba(0,0,0,0.2)"
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.backgroundColor = "#041A44"
                    e.currentTarget.style.transform = "translateY(0)"
                    e.currentTarget.style.boxShadow = "none"
                  }}
                >
                  <div className="relative inline-block mb-3">
                    {card.badge && (
                      <span
                        className={`${card.badgeColor} text-white text-xs font-bold rounded-full absolute -top-2 -right-2 w-6 h-6 flex items-center justify-center border-2 border-white shadow-lg z-10`}
                        style={{ fontFamily: "'Inter', sans-serif" }}
                      >
                        {card.badge}
                      </span>
                    )}
                    <IconComponent 
                      size={28} 
                      className="group-hover:scale-110 transition-transform"
                      style={{ marginLeft: "auto", marginRight: "auto" }}
                    />
                  </div>
                  <h3 className="font-semibold" style={{ fontFamily: "'Inter', sans-serif", fontSize: "20px", fontWeight: 600, marginBottom: "8px", marginTop: "12px" }}>{card.title}</h3>
                  <p className="text-white" style={{ fontFamily: "'Inter', sans-serif", fontSize: "12px", fontWeight: 500, lineHeight: "1.5", opacity: 0.9 }}>{card.description}</p>
                </Link>
              )
            })}
          </div>

          {/* Centered Bottom Card */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 md:gap-8 mb-12 md:mb-16">
            <div className="sm:col-start-1 sm:col-end-2 lg:col-start-2 lg:col-end-3">
              <Link
                href="/sections"
                className="relative text-white transition-all cursor-pointer group flex flex-col items-center justify-center text-center"
                style={{ 
                  backgroundColor: "#041A44",
                  minHeight: "200px",
                  borderRadius: "12px",
                  padding: "1.5rem",
                  fontFamily: "'Inter', sans-serif"
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.backgroundColor = "#041A44"
                  e.currentTarget.style.transform = "translateY(-4px)"
                  e.currentTarget.style.boxShadow = "0 10px 25px rgba(0,0,0,0.2)"
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.backgroundColor = "#041A44"
                  e.currentTarget.style.transform = "translateY(0)"
                  e.currentTarget.style.boxShadow = "none"
                }}
              >
                <Users 
                  size={28} 
                  className="mb-3 group-hover:scale-110 transition-transform"
                  style={{ marginLeft: "auto", marginRight: "auto" }}
                />
                <h3 className="font-semibold" style={{ fontFamily: "'Inter', sans-serif", fontSize: "20px", fontWeight: 600, marginBottom: "8px", marginTop: "12px" }}>College Sections</h3>
                <p className="text-white" style={{ fontFamily: "'Inter', sans-serif", fontSize: "12px", fontWeight: 500, lineHeight: "1.5", opacity: 0.9 }}>
                  View the different sections and class divisions
                </p>
              </Link>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  )
}
