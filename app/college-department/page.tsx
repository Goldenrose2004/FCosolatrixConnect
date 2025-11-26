"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { AuthenticatedHeader } from "@/components/authenticated-header"
import { Footer } from "@/components/footer"

export default function CollegeDepartmentPage() {
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
    "To help students adjust from smaller family to a larger family;",
    "To awaken in each student a sense of one's purpose in life through prayer and knowledge of God;",
    "To quench the students' thirst for truth through the different subjects, and develop their cognitive, affective and psychomotor skills;",
    "To instill in each student self- discipline and control, make decision, and acquire wholesome attitudes and values;",
    "To strive for intimacy with God through prayer and good works in the attainment of one's ultimate goal;",
    "To gain knowledge from daily experience and seek the truth through academic study and research;",
    "To control over one's emotions, arrived at principled decisions and value integration;",
    "To contribute to the common welfare of the society through religious and civic activities and involvement",
    "To equip the students with the necessary thinking, speaking and writing skills, and with the ability to react intelligently and creatively to life situation;",
    "To guide the students to acquire the basic principles of Christian life and to assist them in their physical, social, emotional, intellectual, moral and spiritual growth;",
    "To cultivate in the students a desirable attitude and an appreciation of our cultural heritage: an understanding of themselves, their family and other people;",
    "To promote worthwhile participation in various religious, cultural, vocational, sports and recreational programs in the community and encourage proper utilization of available resources;",
    "To imbue the students with the essential educational foundation needed for college work and to guide them in their choice of occupation or career;",
    "To provide the occupational skills, knowledge and information needed for employment;",
    "To train the students to be responsible citizens, and to become committed leaders in the community.",
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
            <h1 className="text-xl sm:text-2xl md:text-3xl font-bold tracking-wide px-2 md:px-0" style={{ fontFamily: "'Inter', sans-serif" }}>COLLEGE DEPARTMENT</h1>
            <div className="mt-2 w-32 sm:w-40 md:w-48 h-1 bg-white mx-auto"></div>
          </div>

          {/* Content Section */}
          <div className="mx-2 sm:mx-4 md:mx-8 my-4 md:my-8 rounded-lg p-3 sm:p-4 md:p-8 mobile-reading-card" style={{ backgroundColor: "#1A355F" }}>
            {/* Department Goals */}
            <div className="space-y-3 md:space-y-4 text-white text-xs sm:text-sm leading-relaxed" style={{ textAlign: "justify" }}>
              {objectives.map((objective, index) => (
                <div key={index} className="flex items-start space-x-2 md:space-x-3">
                  <div className="text-white font-bold min-w-[1.25rem] sm:min-w-[1.5rem] flex-shrink-0 text-xs sm:text-sm">{index + 1}.</div>
                  <div className="flex-1" style={{ fontFamily: "'Inter', sans-serif" }}>
                    {objective}
                  </div>
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

