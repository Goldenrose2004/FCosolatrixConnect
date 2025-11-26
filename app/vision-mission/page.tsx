"use client"

import { useEffect, useState, useRef } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { AuthenticatedHeader } from "@/components/authenticated-header"
import { Footer } from "@/components/footer"

export default function VisionMissionPage() {
  const router = useRouter()
  const [user, setUser] = useState<any>(null)
  const [isLoading, setIsLoading] = useState(true)
  const textContainerRef = useRef<HTMLDivElement>(null)

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

  useEffect(() => {
    if (isLoading || typeof window === 'undefined') return

    const adjustTextJustification = () => {
      if (window.innerWidth > 767) {
        // Reset to default on desktop
        const container = textContainerRef.current
        if (container) {
          const textElements = container.querySelectorAll<HTMLElement>('p, .mission-item-text')
          textElements.forEach((element) => {
            element.style.textAlign = ''
            ;(element.style as any).textJustify = ''
          })
        }
        return
      }

      const container = textContainerRef.current
      if (!container) return

      // Use requestAnimationFrame to ensure DOM is ready
      requestAnimationFrame(() => {
        const textElements = container.querySelectorAll<HTMLElement>('p, .mission-item-text')
        
        textElements.forEach((element) => {
          // Force justify on mobile with normal word spacing to prevent stretching
          // CSS !important will handle the override, but we set inline styles as backup
            element.style.textAlign = 'justify'
          element.style.textAlignLast = 'justify'
          ;(element.style as any).textJustify = 'inter-word'
          element.style.wordSpacing = 'normal'
          element.style.letterSpacing = 'normal'
        })
      })
    }

    // Run on mount with a delay to ensure DOM is ready, and also after a short delay
    const timeoutId = setTimeout(() => {
      adjustTextJustification()
      // Run again after a short delay to ensure styles are applied
      setTimeout(adjustTextJustification, 50)
    }, 150)
    window.addEventListener('resize', adjustTextJustification)
    
    return () => {
      clearTimeout(timeoutId)
      window.removeEventListener('resize', adjustTextJustification)
    }
  }, [isLoading])

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
      <style dangerouslySetInnerHTML={{__html: `
        @media (max-width: 767px) {
          .vision-mission-text p {
            text-align: justify !important;
            text-align-last: justify !important;
            text-justify: inter-word !important;
            word-spacing: normal !important;
            letter-spacing: normal !important;
            hyphens: auto;
            -webkit-hyphens: auto;
            -moz-hyphens: auto;
            -ms-hyphens: auto;
            word-break: break-word;
            overflow-wrap: break-word;
            line-height: 1.6;
          }
          .vision-mission-text .mission-item-text {
            text-align: justify !important;
            text-align-last: justify !important;
            text-justify: inter-word !important;
            word-spacing: normal !important;
            letter-spacing: normal !important;
            hyphens: auto;
            -webkit-hyphens: auto;
            -moz-hyphens: auto;
            -ms-hyphens: auto;
            word-break: break-word;
            overflow-wrap: break-word;
            line-height: 1.6;
          }
        }
      `}} />
      <AuthenticatedHeader userName={user?.firstName} userInitials={userInitials} useLandingPageStylingMobileOnly={true} />

      <main className="max-w-6xl mx-auto px-2 sm:px-6 pb-16 md:pb-32">
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
            <h1 className="text-xl sm:text-2xl md:text-4xl font-bold tracking-wide relative px-2 md:px-0" style={{ fontFamily: "'Inter', sans-serif" }}>
              CCTC VISION-MISSION STATEMENT
              <div className="w-48 sm:w-64 md:w-80 h-1 mx-auto mt-2" style={{ backgroundColor: "#60A5FA" }}></div>
            </h1>
          </div>

          {/* Content Sections */}
          <div ref={textContainerRef} className="mx-2 sm:mx-6 md:mx-10 mt-3 md:mt-5 mb-4 md:mb-8 rounded-lg p-3 sm:p-6 md:p-8 vision-mission-text mobile-reading-card" style={{ backgroundColor: "#1A355F" }}>
            {/* Vision Section */}
            <div className="text-center mb-6 md:mb-8" style={{ fontFamily: "'Inter', sans-serif" }}>
              <h2 className="text-xl md:text-2xl font-bold text-white mb-3 md:mb-4 mobile-centered-title">VISION</h2>
              <p className="text-white text-sm sm:text-base leading-relaxed md:text-left">
                Consolatrix College of Toledo City, Inc. envisions a life-giving and innovating education ministry committed to transforming community of learners into Christ-centered Augustinian Recollect Stewards.
              </p>
            </div>

            {/* Mission Section */}
            <div style={{ fontFamily: "'Inter', sans-serif" }}>
              <h2 className="text-xl md:text-2xl font-bold text-white text-center mb-4 md:mb-6 mobile-centered-title">MISSION</h2>
              <div className="text-white text-sm sm:text-base leading-relaxed space-y-3 md:space-y-4 md:text-left">
                <div className="flex items-start space-x-2 md:space-x-3">
                  <div className="text-white font-bold text-base md:text-lg flex-shrink-0">•</div>
                  <div className="mission-item-text">
                    Strengthen fraternal charity through God-filled friendship and renewed evangelization;
                  </div>
                </div>
                <div className="flex items-start space-x-2 md:space-x-3">
                  <div className="text-white font-bold text-base md:text-lg flex-shrink-0">•</div>
                  <div className="mission-item-text">
                    Facilitate the integral development of the learners toward transformation through current researches, relevant curricular offerings and responsive community extension services;
                  </div>
                </div>
                <div className="flex items-start space-x-2 md:space-x-3">
                  <div className="text-white font-bold text-base md:text-lg flex-shrink-0">•</div>
                  <div className="mission-item-text">
                    Fortify leadership and professional development of stakeholders through continuing education and intensive Augustinian Recollect Spirituality;
                  </div>
                </div>
                <div className="flex items-start space-x-2 md:space-x-3">
                  <div className="text-white font-bold text-base md:text-lg flex-shrink-0">•</div>
                  <div className="mission-item-text">
                    Develop a community of Christ-centered Augustinian Recollect Stewards who are environmentally caring and global leaders;
                  </div>
                </div>
                <div className="flex items-start space-x-2 md:space-x-3">
                  <div className="text-white font-bold text-base md:text-lg flex-shrink-0">•</div>
                  <div className="mission-item-text">
                    Nurture one another in the shared mission for the sustainability of the AR schools and social relevance of programs and service.
                  </div>
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

