"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { AuthenticatedHeader } from "@/components/authenticated-header"
import { Footer } from "@/components/footer"

export default function BasicEducationDepartmentPage() {
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
  
  // Determine home href based on department
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
    "To awaken in each child a sense of one's purpose in life through prayer and knowledge of God",
    "To quench a child's thirst for truth through the different subjects, and develop their cognitive, affective and psychomotor skills",
    "To instill in each child self-discipline and control, make simple decision, and acquire wholesome attitude and values",
    "To gradually introduce the child to a larger community by relating, associating, and working for the common good",
    "To strive for intimacy with God through prayer and good works in the attainment of one's ultimate goal",
    "To gain knowledge from daily experience and seek the truth through academic study and simple research",
    "To control over one's emotions, arrived at principled decisions and value integration",
    "To contribute to the common welfare of the society through religious and civic activities and involvement",
    "To equip the students with the necessary thinking, speaking and writing skills, and with the ability to react intelligently to life situation;",
    "To guide the students to acquire the basic principles of Christian life and to assist him in his/her physical, social, emotional, intellectual, moral and spiritual growth;",
    "To cultivate in the students a desirable attitude and an appreciation of our cultural heritage: an understanding of themselves, their family and other people;",
    "To promote worthwhile participation in various religious, cultural, vocational, sports and recreational programs in the community and encourage proper utilization of available resources in it",
    "To imbue the students with the essential educational foundation needed for college work and to guide them in their choice of occupation or career",
    "To provide the occupational skills, knowledge and information needed for initial employment",
    "To train the students to be responsible citizens, and to become committed leaders in the community.",
  ]

  return (
    <div className="min-h-screen bg-gray-50" style={{ fontFamily: "'Inter', sans-serif" }}>
      <AuthenticatedHeader userName={user?.firstName} userInitials={userInitials} />

      <main className="max-w-4xl mx-auto p-6 mb-20 pb-12">
        {/* Back to Dashboard Button */}
        <div className="mb-4 mt-16">
          <Link
            href={homeHref}
            className="inline-flex items-center text-gray-800 transition-colors"
            style={{ fontFamily: "'Inter', sans-serif" }}
          >
            <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7"></path>
            </svg>
            Back to Dashboard
          </Link>
        </div>

        {/* Main Container */}
        <div className="bg-[#001E4D] rounded-lg shadow-xl overflow-hidden">
          {/* Title Section */}
          <div className="bg-[#001E4D] text-white text-center py-8">
            <h1 className="text-3xl font-bold tracking-wide" style={{ fontFamily: "'Inter', sans-serif" }}>
              BASIC EDUCATION DEPARTMENT
            </h1>
            <div className="mt-2 h-1 bg-blue-400 mx-auto w-24"></div>
          </div>

          {/* Content Section */}
          <div className="bg-[#1A355F] mx-8 my-8 rounded-lg p-8 mobile-reading-card">
            {/* Department Goals */}
            <div className="space-y-4 text-white text-sm leading-relaxed">
              {objectives.map((objective, index) => (
                <div key={index} className="flex items-start space-x-3">
                  <div className="text-white font-bold min-w-[1.5rem]" style={{ fontFamily: "'Inter', sans-serif" }}>
                    {index + 1}.
                  </div>
                  <div style={{ fontFamily: "'Inter', sans-serif" }}>
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

