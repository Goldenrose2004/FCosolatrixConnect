"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { AuthenticatedHeader } from "@/components/authenticated-header"
import { Footer } from "@/components/footer"

export default function CoursesPage() {
  const router = useRouter()
  const [user, setUser] = useState<any>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const currentUser = localStorage.getItem("currentUser")
    if (!currentUser) {
      router.push("/login")
      return
    }

    const userData = JSON.parse(currentUser)
    setUser(userData)
    setIsLoading(false)
  }, [router])

  if (isLoading) {
    return <div className="flex items-center justify-center min-h-screen">Loading...</div>
  }

  const userInitials = (user?.firstName?.[0] || "U") + (user?.lastName?.[0] || "")
  const isBasicEducation = 
    user?.department === "Elementary" ||
    user?.department === "Junior High School" ||
    user?.department === "Senior High School"
  const homeHref = user?.department === "College" 
    ? "/college-dashboard" 
    : isBasicEducation 
    ? "/basic-education-dashboard" 
    : "/basic-education-dashboard"

  return (
    <div className="min-h-screen bg-gray-50" style={{ fontFamily: "'Inter', sans-serif" }}>
      <AuthenticatedHeader userName={user?.firstName} userInitials={userInitials} useLandingPageStylingMobileOnly={true} />

      <main className="max-w-4xl mx-auto px-2 sm:px-4 md:p-6 pb-16 md:pb-32">
        {/* Back to Dashboard Button */}
        <div className="mb-4 mt-8 md:mt-16">
          <Link
            href={homeHref}
            className="inline-flex items-center text-gray-800 transition-colors text-sm md:text-base"
            style={{ fontFamily: "'Inter', sans-serif" }}
          >
            <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7"></path>
            </svg>
            Back to Dashboard
          </Link>
        </div>

        {/* Main Container */}
        <div className="rounded-lg shadow-xl overflow-hidden" style={{ backgroundColor: "#001E4D" }}>
          {/* Title Section */}
          <div className="text-white text-center py-4 md:py-8" style={{ backgroundColor: "#001E4D" }}>
            <h1 className="text-xl sm:text-2xl md:text-4xl font-bold tracking-wide mb-3 md:mb-4 px-2 md:px-0" style={{ fontFamily: "'Inter', sans-serif" }}>COLLEGE COURSES OFFERED</h1>
            <div className="mt-2 w-32 sm:w-40 md:w-48 h-1 mx-auto" style={{ backgroundColor: "#60A5FA" }}></div>
          </div>

          {/* Content Section */}
          <div className="mx-2 sm:mx-4 md:mx-8 my-4 md:my-8 rounded-lg p-3 sm:p-4 md:p-8 mobile-reading-card" style={{ backgroundColor: "#1A355F" }}>
            {/* Course List */}
            <div className="space-y-2 md:space-y-3 text-white">
              <div className="flex items-start space-x-2 md:space-x-3">
                <div className="text-white font-bold min-w-[1rem] sm:min-w-[1.25rem] md:min-w-[1.5rem] text-base sm:text-lg flex-shrink-0">•</div>
                <div className="text-xs sm:text-sm leading-relaxed flex-1" style={{ fontFamily: "'Inter', sans-serif" }}>
                  <strong>Bachelor of Elementary Education (BEED)</strong>
                </div>
              </div>

              <div className="flex items-start space-x-2 md:space-x-3">
                <div className="text-white font-bold min-w-[1rem] sm:min-w-[1.25rem] md:min-w-[1.5rem] text-base sm:text-lg flex-shrink-0">•</div>
                <div className="text-xs sm:text-sm leading-relaxed flex-1" style={{ fontFamily: "'Inter', sans-serif" }}>
                  <strong>Bachelor of Secondary Education (BSED)</strong>
                  <div className="ml-2 sm:ml-3 md:ml-4 mt-1 space-y-0.5 md:space-y-1">
                    <div className="text-[10px] sm:text-xs text-white" style={{ fontFamily: "'Inter', sans-serif" }}>Major in: English</div>
                    <div className="text-[10px] sm:text-xs text-white" style={{ fontFamily: "'Inter', sans-serif" }}>Math</div>
                    <div className="text-[10px] sm:text-xs text-white" style={{ fontFamily: "'Inter', sans-serif" }}>Science</div>
                  </div>
                </div>
              </div>

              <div className="flex items-start space-x-2 md:space-x-3">
                <div className="text-white font-bold min-w-[1rem] sm:min-w-[1.25rem] md:min-w-[1.5rem] text-base sm:text-lg flex-shrink-0">•</div>
                <div className="text-xs sm:text-sm leading-relaxed flex-1" style={{ fontFamily: "'Inter', sans-serif" }}>
                  <strong>Bachelor of Science in Hospitality Management (BSHM)</strong>
                </div>
              </div>

              <div className="flex items-start space-x-2 md:space-x-3">
                <div className="text-white font-bold min-w-[1rem] sm:min-w-[1.25rem] md:min-w-[1.5rem] text-base sm:text-lg flex-shrink-0">•</div>
                <div className="text-xs sm:text-sm leading-relaxed flex-1" style={{ fontFamily: "'Inter', sans-serif" }}>
                  <strong>Bachelor of Science in Information Technology (BSIT)</strong>
                </div>
              </div>

              <div className="flex items-start space-x-2 md:space-x-3">
                <div className="text-white font-bold min-w-[1rem] sm:min-w-[1.25rem] md:min-w-[1.5rem] text-base sm:text-lg flex-shrink-0">•</div>
                <div className="text-xs sm:text-sm leading-relaxed flex-1" style={{ fontFamily: "'Inter', sans-serif" }}>
                  <strong>Bachelor of Science in Entrepreneurship (BSENTREP)</strong>
                </div>
              </div>

              <div className="flex items-start space-x-2 md:space-x-3">
                <div className="text-white font-bold min-w-[1rem] sm:min-w-[1.25rem] md:min-w-[1.5rem] text-base sm:text-lg flex-shrink-0">•</div>
                <div className="text-xs sm:text-sm leading-relaxed flex-1" style={{ fontFamily: "'Inter', sans-serif" }}>
                  <strong>Bachelor in Physical Education (BPED)</strong>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  )
}

