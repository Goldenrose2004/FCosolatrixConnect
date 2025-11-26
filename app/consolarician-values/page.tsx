"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { AuthenticatedHeader } from "@/components/authenticated-header"
import { Footer } from "@/components/footer"

export default function ConsolaricianValuesPage() {
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
            <h1 className="text-lg sm:text-xl md:text-3xl font-bold tracking-wide px-2 md:px-0" style={{ fontFamily: "'Inter', sans-serif" }}>THE CONSOLATRICIAN CORE VALUES are:</h1>
            <div className="mt-2 h-1 mx-auto w-20 sm:w-24" style={{ backgroundColor: "#60A5FA" }}></div>
          </div>

          {/* Content Section */}
          <div className="mx-2 sm:mx-4 md:mx-8 my-4 md:my-8 rounded-lg p-4 sm:p-6 md:p-8 mobile-reading-card" style={{ backgroundColor: "#1A355F" }}>
            {/* Core Values Section */}
            <div style={{ backgroundColor: "#1A355F" }}>
              <div className="text-white text-center space-y-4 md:space-y-6" style={{ textAlign: "justify" }}>
                <div className="flex justify-center items-center space-x-2 md:space-x-4">
                  <div className="text-white font-bold text-base sm:text-lg md:text-xl flex-shrink-0">•</div>
                  <div className="text-lg sm:text-xl md:text-2xl font-medium tracking-wide" style={{ fontFamily: "'Inter', sans-serif" }}>Charity</div>
                </div>
                <div className="flex justify-center items-center space-x-2 md:space-x-4">
                  <div className="text-white font-bold text-base sm:text-lg md:text-xl flex-shrink-0">•</div>
                  <div className="text-lg sm:text-xl md:text-2xl font-medium tracking-wide" style={{ fontFamily: "'Inter', sans-serif" }}>Compassion</div>
                </div>
                <div className="flex justify-center items-center space-x-2 md:space-x-4">
                  <div className="text-white font-bold text-base sm:text-lg md:text-xl flex-shrink-0">•</div>
                  <div className="text-lg sm:text-xl md:text-2xl font-medium tracking-wide" style={{ fontFamily: "'Inter', sans-serif" }}>Tenacity</div>
                </div>
                <div className="flex justify-center items-center space-x-2 md:space-x-4">
                  <div className="text-white font-bold text-base sm:text-lg md:text-xl flex-shrink-0">•</div>
                  <div className="text-lg sm:text-xl md:text-2xl font-medium tracking-wide" style={{ fontFamily: "'Inter', sans-serif" }}>Commitment</div>
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

