"use client"

import { useEffect, useState } from "react"
import { AuthenticatedHeader } from "@/components/authenticated-header"
import { Footer } from "@/components/footer"
import Image from "next/image"

export default function AboutUsPage() {
  const [user, setUser] = useState<any>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const currentUser = localStorage.getItem("currentUser")
    if (currentUser) {
      const userData = JSON.parse(currentUser)
      setUser(userData)
    }
    setIsLoading(false)
  }, [])

  const userInitials = (user?.firstName?.[0] || "U") + (user?.lastName?.[0] || "")

  return (
    <div className="min-h-screen bg-gray-100">
      <AuthenticatedHeader userName={user?.firstName} userInitials={userInitials} useLandingPageStylingMobileOnly={true} />
      <main className="px-3 sm:px-4 md:px-6" style={{ paddingTop: "1rem", paddingBottom: "60px" }}>
        <div className="max-w-6xl mx-auto">
          {/* Header Section with School Seal */}
          <div className="text-center mb-6 sm:mb-8 md:mb-10">
            {/* School Seal/Logo */}
            <div className="inline-flex items-center justify-center w-24 h-24 sm:w-28 sm:h-28 md:w-32 md:h-32 rounded-full bg-white shadow-lg ring-2 sm:ring-4 ring-blue-100 mx-auto mb-2 sm:mb-3">
              <Image
                src="/images/Logo2.png"
                alt="School Logo"
                width={112}
                height={112}
                className="w-20 h-20 sm:w-24 sm:h-24 md:w-28 md:h-28 rounded-full object-cover"
                priority
                unoptimized
              />
            </div>

            {/* Main Title */}
            <h1 className="text-xl sm:text-2xl md:text-3xl font-bold text-gray-800 mb-1 whitespace-nowrap">About Consolatrix College</h1>

            {/* Subtitle */}
            <p className="text-xs sm:text-lg text-gray-600 px-2 whitespace-nowrap">Consolatrix College of Toledo Inc. - Toledo City, Cebu</p>
          </div>

          {/* Central content panel (dark blue card) */}
          <div className="mx-auto bg-[#041A44] text-white rounded-lg sm:rounded-xl shadow-lg p-4 sm:p-6 md:p-12 lg:p-14" style={{ maxWidth: "1100px" }}>
            <div className="space-y-4 sm:space-y-5 md:space-y-6 leading-relaxed text-xs sm:text-base md:text-lg" style={{ textAlign: "justify" }}>
              <p>
                At Consolatrix College , our mission is to bridge technology and education by providing a digital platform that simplifies student access to school policies, promotes discipline, and enhances communication within our community. This digital handbook was created to eliminate the hassle of carrying a physical copy and to make it easier for students to access important information anytime, anywhere.
              </p>

              <p>
                Through Consolatrix Connect, students can conveniently browse school rules and regulations, engage in discussions through an interactive chat system, and ensure transparency and accountability with our violation tracking module. This system was proudly developed by IT students of Consolatrix College of Toledo City, Inc., with the goal of fostering student engagement, responsibility, and efficiency within the school.
              </p>

              <p>
                Beyond convenience and cost-efficiency, this initiative also reduces the need for printed copies, helping the school save resources while promoting environmental sustainability. Moving forward, we envision Consolatrix Connect as a stepping stone toward a more connected, paperless, and responsible educational environment—where technology strengthens collaboration between students, teachers, and administrators.
              </p>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  )
}

