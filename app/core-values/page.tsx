"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { AuthenticatedHeader } from "@/components/authenticated-header"
import { Footer } from "@/components/footer"

export default function CoreValuesPage() {
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
            <h1 className="text-xl sm:text-2xl md:text-3xl font-bold tracking-wide px-2 md:px-0" style={{ fontFamily: "'Inter', sans-serif" }}>ARSC CORE VALUES</h1>
            <div className="mt-2 h-1 mx-auto w-20 sm:w-24" style={{ backgroundColor: "#60A5FA" }}></div>
          </div>

          {/* Content Section */}
          <div className="mx-2 sm:mx-4 md:mx-8 my-4 md:my-8 rounded-lg p-3 sm:p-4 md:p-8" style={{ backgroundColor: "#1A355F" }}>
            {/* Augustinian Recollect Core Values Section */}
            <div className="mb-4 md:mb-6" style={{ backgroundColor: "#1A355F" }}>
                <h2 className="text-base sm:text-lg md:text-xl font-bold text-white text-center mb-3 md:mb-4" style={{ fontFamily: "'Inter', sans-serif" }}>AUGUSTINIAN RECOLLECT CORE VALUES:</h2>
                <p className="text-white text-sm sm:text-base text-center mobile-no-bottom-margin" style={{ fontFamily: "'Inter', sans-serif" }}>
                Christ-centered, Augustinian Recollect Steward (CARS)
              </p>
            </div>

            {/* Graduate Attributes Section */}
            <div style={{ backgroundColor: "#1A355F" }}>
              <h2 className="text-base sm:text-lg md:text-xl font-bold text-white text-center mb-4 md:mb-6" style={{ fontFamily: "'Inter', sans-serif" }}>A.R./CONSOLATRICIANS GRADUATE ATTRIBUTES</h2>
              <div className="text-white text-sm sm:text-base leading-relaxed space-y-2 md:space-y-3" style={{ textAlign: "justify" }}>
                <div className="flex items-start space-x-2 md:space-x-3">
                  <div className="text-white font-bold mt-1 flex-shrink-0">*</div>
                  <div style={{ fontFamily: "'Inter', sans-serif" }}>Christ-centered</div>
                </div>
                <div className="flex items-start space-x-2 md:space-x-3">
                  <div className="text-white font-bold mt-1 flex-shrink-0">*</div>
                  <div style={{ fontFamily: "'Inter', sans-serif" }}>Persistent in searching for the truth</div>
                </div>
                <div className="flex items-start space-x-2 md:space-x-3">
                  <div className="text-white font-bold mt-1 flex-shrink-0">*</div>
                  <div style={{ fontFamily: "'Inter', sans-serif" }}>Life-giving communicator of truth and love</div>
                </div>
                <div className="flex items-start space-x-2 md:space-x-3">
                  <div className="text-white font-bold mt-1 flex-shrink-0">*</div>
                  <div style={{ fontFamily: "'Inter', sans-serif" }}>Creator of communion</div>
                </div>
                <div className="flex items-start space-x-2 md:space-x-3">
                  <div className="text-white font-bold mt-1 flex-shrink-0">*</div>
                  <div style={{ fontFamily: "'Inter', sans-serif" }}>Transformative servant-leader</div>
                </div>
                <div className="flex items-start space-x-2 md:space-x-3">
                  <div className="text-white font-bold mt-1 flex-shrink-0">*</div>
                  <div style={{ fontFamily: "'Inter', sans-serif" }}>Creative steward of God's creation</div>
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

