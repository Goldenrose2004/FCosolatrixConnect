"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { AuthenticatedHeader } from "@/components/authenticated-header"
import { Footer } from "@/components/footer"
import Image from "next/image"

export default function SchoolSealPage() {
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
    <div className="min-h-screen bg-gray-100" style={{ fontFamily: "'Inter', sans-serif" }}>
      <AuthenticatedHeader userName={user?.firstName} userInitials={userInitials} useLandingPageStylingMobileOnly={true} />

      <main className="max-w-6xl mx-auto px-2 sm:px-6 pb-8 md:pb-16">
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
        <div className="rounded-lg shadow-xl overflow-hidden mb-16 md:mb-32" style={{ backgroundColor: "#001E4D" }}>
          {/* Title Section */}
          <div className="text-white text-center py-4 md:py-8" style={{ backgroundColor: "#001E4D" }}>
            <h1 className="text-xl sm:text-3xl md:text-4xl font-bold tracking-wide relative px-2 md:px-4" style={{ fontFamily: "'Inter', sans-serif" }}>
              THE SCHOOL SEAL
              <div className="w-32 sm:w-40 md:w-56 h-1 mx-auto mt-2" style={{ backgroundColor: "#60A5FA" }}></div>
            </h1>
          </div>

          {/* Content Section */}
          <div className="mx-2 sm:mx-6 md:mx-10 mt-3 md:mt-5 mb-4 md:mb-8 rounded-lg p-3 sm:p-6 md:p-8 mobile-reading-card" style={{ backgroundColor: "#1A355F" }}>
            {/* School Seal Image */}
            <div className="flex justify-center mb-4 md:mb-8">
              <div className="relative">
                <Image
                  src="/images/logo.jpg"
                  alt="School Seal"
                  width={256}
                  height={256}
                  className="w-28 h-28 sm:w-40 sm:h-40 md:w-64 md:h-64 rounded-full border-4 border-white object-cover"
                  priority
                  unoptimized
                />
              </div>
            </div>

            {/* Explanation text */}
            <div className="text-white text-xs sm:text-sm mb-3 md:mb-6 no-justify" style={{ fontFamily: "'Inter', sans-serif", textAlign: "center" }}>
              (Explanation of the Seal)
            </div>

            {/* Seal Elements Explanation */}
            <div className="space-y-3 md:space-y-4 text-white text-xs sm:text-sm leading-relaxed" style={{ fontFamily: "'Inter', sans-serif", textAlign: "justify" }}>
              <div className="flex items-start space-x-2 md:space-x-3">
                <div className="text-white font-bold text-base md:text-lg flex-shrink-0">+</div>
                <div>
                  <span className="font-bold" style={{ color: "#FCD34D" }}>THE SHIELD</span> - bears the national colors: red, white and blue, an indication that the institution is genuinely Filipino and to express "PATRIA" field of the shield.
                </div>
              </div>
              <div className="flex items-start space-x-2 md:space-x-3">
                <div className="text-white font-bold text-base md:text-lg flex-shrink-0">+</div>
                <div>
                  <span className="font-bold" style={{ color: "#FCD34D" }}>THE CROSS</span> - occupies the center of the shield, to make it the most important position in the field. It symbolizes the missionary character of the Congregation of the Augustinian Recollect Sisters.
                </div>
              </div>
              <div className="flex items-start space-x-2 md:space-x-3">
                <div className="text-white font-bold text-base md:text-lg flex-shrink-0">+</div>
                <div>
                  <span className="font-bold" style={{ color: "#FCD34D" }}>THE BIBLE AND THE FLAMING HEART</span> - on the right side of the shield is the EMBLEM of the Congregation of the Augustinian Recollect Sisters.
                </div>
              </div>
              <div className="flex items-start space-x-2 md:space-x-3">
                <div className="text-white font-bold text-base md:text-lg flex-shrink-0">+</div>
                <div>
                  <span className="font-bold" style={{ color: "#FCD34D" }}>THE ROSE</span> - on the left side of the shield are the attributes of the Blessed Virgin Mary.
                </div>
              </div>
              <div className="flex items-start space-x-2 md:space-x-3">
                <div className="text-white font-bold text-base md:text-lg flex-shrink-0">+</div>
                <div>
                  <span className="font-bold" style={{ color: "#FCD34D" }}>VIRTUS AND SCIENTIA</span> - indicates the two-fold objectives of the school: Virtue and knowledge which characterize a true Catholic Education
                </div>
              </div>
              <div className="flex items-start space-x-2 md:space-x-3">
                <div className="text-white font-bold text-base md:text-lg flex-shrink-0">+</div>
                <div>
                  <span className="font-bold" style={{ color: "#FCD34D" }}>THE OUTER RIM</span> - contains the school's name and location
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

