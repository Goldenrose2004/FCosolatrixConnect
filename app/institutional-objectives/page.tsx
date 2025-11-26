"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { AuthenticatedHeader } from "@/components/authenticated-header"
import { Footer } from "@/components/footer"

export default function InstitutionalObjectivesPage() {
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

  const objectives = [
    "To develop a self-directed Filipino who is committed to building the community where he/she lives, promoting Christ's love to attain the Ultimate Goal- God;",
    "To acquire fundamental knowledge, values and attitudes, habits and skills in language and arts, science, health, social studies, mathematics, music, technology and livelihood education and their intelligent application in appropriate life situations;",
    "To promote harmonious development of one's powers and talents, for the realization of a pure, faithful, inviolate conscience and hence lead a holy life;",
    "To foster in the academic community a sound spiritual life through religious instruction, personal guidance, encouragement to frequent the Sacraments and regular participation at Holy Mass;",
    "To train the citizens in the exercise of their rights, duties, and responsibilities in a democratic society and for active participation in a progressive and productive home and community life by providing a situation for a well-rounded development of a man as a person and as a member of society, to develop moral character, personal discipline, civic conscience, vocational efficiency and to teach the duties of citizenship;",
    "To provide an environment that will help the academic community develop into well-balanced citizens who are prepared to take their place as individuals and as members of their respective social groups or community in a democratic society;",
    "To develop basic understanding about Philippine culture, the desirable traditions and virtues of our people as essential requisite in attaining national consciousness and solidarity.",
  ]

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
            <h1 className="text-xl sm:text-2xl md:text-4xl font-bold tracking-wide mb-2 px-2 md:px-0" style={{ fontFamily: "'Inter', sans-serif" }}>INSTITUTIONAL OBJECTIVES</h1>
            <div className="w-20 sm:w-24 h-1 mx-auto mt-3 md:mt-4 rounded" style={{ backgroundColor: "#93C5FD" }}></div>
          </div>

          {/* Content Sections */}
          <div className="mx-2 sm:mx-4 md:mx-8 my-4 md:my-8 rounded-lg p-3 sm:p-4 md:p-8 text-white mobile-reading-card" style={{ backgroundColor: "#1A355F" }}>
            {/* Objectives List */}
            <div className="space-y-4 md:space-y-6 text-xs sm:text-sm leading-relaxed" style={{ textAlign: "justify" }}>
              {objectives.map((objective, index) => (
                <div key={index} className="flex items-start">
                  <span className="font-bold mr-2 sm:mr-3 md:mr-4 flex-shrink-0 w-6 h-6 sm:w-7 sm:h-7 md:w-8 md:h-8 rounded-full flex items-center justify-center text-white text-xs sm:text-sm md:text-base" style={{ backgroundColor: "#1D4ED8" }}>
                    {index + 1}
                  </span>
                  <p className="flex-1" style={{ fontFamily: "'Inter', sans-serif" }}>{objective}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  )
}

