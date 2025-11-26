"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { AuthenticatedHeader } from "@/components/authenticated-header"
import { Footer } from "@/components/footer"

export default function HistoryPage() {
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
            <h1 className="text-xl sm:text-2xl md:text-4xl font-bold tracking-wide mb-2 px-2 md:px-0" style={{ fontFamily: "'Inter', sans-serif" }}>HISTORICAL BACKGROUND</h1>
            <div className="w-20 sm:w-24 h-1 mx-auto mt-3 md:mt-4 rounded" style={{ backgroundColor: "#93C5FD" }}></div>
          </div>

          {/* Content Section */}
          <div className="mx-2 sm:mx-4 md:mx-8 my-4 md:my-8 rounded-lg p-3 sm:p-4 md:p-8 text-white mobile-reading-card" style={{ backgroundColor: "#1A355F" }}>
            {/* Introduction */}
            <div className="mb-4 md:mb-6" style={{ textAlign: "justify" }}>
              <p className="text-xs sm:text-sm leading-relaxed mb-3 md:mb-4" style={{ fontFamily: "'Inter', sans-serif" }}>
                Consolatrix College of Toledo City, Inc., formerly known as Consolatrix Academy is a Catholic institution owned and managed by the Congregation of the Augustinian Recollect Sisters. Its aspiration for quality education since its foundation proves its willingness to move forward as a whole school community and makes innovations in its teaching apostolate. It continually strives to provide excellent service to all its clientele.
              </p>
              <p className="text-xs sm:text-sm leading-relaxed" style={{ fontFamily: "'Inter', sans-serif" }}>
                The school was founded as a humble response to the need of the Church through an invitation of the parish priest and of the bishop of the diocese encouraged by the parishioners to open a school for the religious and moral development of the youth in Toledo City.
              </p>
            </div>

            {/* Early Years */}
            <div className="mb-4 md:mb-6" style={{ textAlign: "justify" }}>
              <h2 className="text-base sm:text-lg font-bold mb-2 md:mb-3" style={{ fontFamily: "'Inter', sans-serif" }}>Early Years</h2>
              <p className="text-xs sm:text-sm leading-relaxed mb-3 md:mb-4" style={{ fontFamily: "'Inter', sans-serif" }}>
                In 1958, Fr. Leonardo Amiba through the advice and guidance of Most Rev. Julio Rosales, Archbishop of Cebu, requested the Congregation of the Augustinian Recollect Sisters to undertake this noble task.
              </p>
              <p className="text-xs sm:text-sm leading-relaxed" style={{ fontFamily: "'Inter', sans-serif" }}>
                After complying with all the requirements of the Bureau of Private Schools, classes started in June 1961, with 120 high school students. The first Superior / Principal was Sor Dolores De Sagrado Corazon, A.R.M. The school began to operate, serving the local community with the goal "To carry out the religious and moral upliftment of the youth".
              </p>
            </div>

            {/* College Development */}
            <div className="mb-4 md:mb-6" style={{ textAlign: "justify" }}>
              <h2 className="text-base sm:text-lg font-bold mb-2 md:mb-3" style={{ fontFamily: "'Inter', sans-serif" }}>College Development</h2>
              <p className="text-xs sm:text-sm leading-relaxed mb-3 md:mb-4" style={{ fontFamily: "'Inter', sans-serif" }}>
                In 1998, Consolatrix Academy changed its name to Consolatrix College of Toledo City, Inc. having opened the College Department with the following courses with permits and recognitions: Bachelor of Elementary Education (BEED) - GR No.042 s. of 2001, Bachelor of Secondary Education (BSED) major in English and Mathematics - GR No. 043 s. of 2001) and two-year course in Associate in Computer Secretarial (ACS) GR. No 279 s. of 2000).
              </p>
              <p className="text-xs sm:text-sm leading-relaxed" style={{ fontFamily: "'Inter', sans-serif" }}>
                The following year, the ACS program was realigned to Associate in Computer Technology (ACT), which has a ladderized curriculum leading to a Bachelor of Science in Computer Science (BSCS) and Information Technology (BSIT) - GR. No 010 s. of 2011.
              </p>
            </div>

            {/* Program Expansion */}
            <div className="mb-4 md:mb-6" style={{ textAlign: "justify" }}>
              <h2 className="text-base sm:text-lg font-bold mb-2 md:mb-3" style={{ fontFamily: "'Inter', sans-serif" }}>Program Expansion</h2>
              <p className="text-xs sm:text-sm leading-relaxed mb-3 md:mb-4" style={{ fontFamily: "'Inter', sans-serif" }}>
                Government Recognitions (GR) were likewise granted to the following courses: Bachelor of Science in Hospitality Management (BSHM) - GR. No.028 series of 2012 Major in Hotel & Restaurant Management, Bachelor of Science in Office Administration (BSOA) - GR No. DOI series of 2015 and Bachelor of Science in Entrepreneurship (BSEntrep - GR No. 004 series of 2020.
              </p>
              <p className="text-xs sm:text-sm leading-relaxed mb-3 md:mb-4" style={{ fontFamily: "'Inter', sans-serif" }}>
                Considering the demand for teachers in Physical Education, the school offered the Bachelor of Physical education (BPED) - GR No.004, series of 2022.
              </p>
              <p className="text-xs sm:text-sm leading-relaxed" style={{ fontFamily: "'Inter', sans-serif" }}>
                In school year 2022-2023, Science was added as one of the majors for those who are taking BSED aside from English and Mathematics. The institution being K to 12 ready, was granted the Provisional Government Permit to operate Senior High School Program in 2016 offering Academic Track - ABM, STEM, HUMSS as well as Technical Vocational Livelihood Track major HE and ICT. It had its first Commencement Exercises in April 2016 with 97 graduates.
              </p>
            </div>

            {/* Mission & Philosophy */}
            <div className="mb-4 md:mb-6" style={{ textAlign: "justify" }}>
              <h2 className="text-base sm:text-lg font-bold mb-2 md:mb-3" style={{ fontFamily: "'Inter', sans-serif" }}>Mission & Philosophy</h2>
              <p className="text-xs sm:text-sm leading-relaxed mb-3 md:mb-4" style={{ fontFamily: "'Inter', sans-serif" }}>
                Counting the years of its existence, the school contributes to the country's educative goal. The extent of its contribution, however, is still in the process of evaluation. To fulfill its own educational goals, it has taken seriously the situation of the Philippine Education System by blending human culture with the message of salvation. As proclaimers of the Good News of Salvation, the school and its constituents identify themselves with the less fortunate ones and distinctively witness to their charism.
              </p>
              <p className="text-xs sm:text-sm leading-relaxed" style={{ fontFamily: "'Inter', sans-serif" }}>
                The school, as a Catholic institution, follows the Christian philosophy of education that is based on the Catholic philosophy of life and at the same time subscribes to the beliefs, the inspiration, and the educational thoughts of its founders and its institutional goals.
              </p>
            </div>

            {/* Accreditations */}
            <div className="mb-4 md:mb-6" style={{ textAlign: "justify" }}>
              <h2 className="text-base sm:text-lg font-bold mb-2 md:mb-3" style={{ fontFamily: "'Inter', sans-serif" }}>Accreditations</h2>
              <p className="text-xs sm:text-sm leading-relaxed mb-3 md:mb-4" style={{ fontFamily: "'Inter', sans-serif" }}>
                With the efforts of the A.R. Sisters and lay personnel, the Basic Education Department earned the certificate from the Philippine Accrediting Association of Schools Colleges and Universities (PAASCU) in March, 2011 for the Level I Accreditation Status.
              </p>
              <p className="text-xs sm:text-sm leading-relaxed" style={{ fontFamily: "'Inter', sans-serif" }}>
                On May 16, 2015, the school was granted PAASCU Level II Re-accreditation status, and in September, 2022 after undergoing a resurvey, the school continues to be PAASCU Level II Accredited institution. The school continues to equip its students holistically to be competitive and socially responsive individuals.
              </p>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  )
}

