"use client"

import { useEffect, useState, useRef } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { Menu, X } from "lucide-react"

export default function SectionsPage() {
  const router = useRouter()
  const [user, setUser] = useState<any>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [selectedSection, setSelectedSection] = useState<number | null>(1)
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const contentAreaRef = useRef<HTMLDivElement>(null)

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

  // Scroll to top when section changes (matching PHP behavior)
  useEffect(() => {
    if (contentAreaRef.current && selectedSection !== null) {
      contentAreaRef.current.scrollTo({ top: 0, behavior: 'instant' })
    }
  }, [selectedSection])

  if (isLoading) {
    return <div className="flex items-center justify-center min-h-screen">Loading...</div>
  }

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
  
  const sectionTitle = isBasicEducation ? "BASIC EDUCATION SECTIONS" : "COLLEGE SECTIONS"

  const basicEducationSections = [
    { number: "I", title: "Registration and Admission", subtitle: "Enrollment process" },
    { number: "II", title: "Withdrawal and Policy on Refund and Payments of Fees", subtitle: "Refund and payment rules" },
    { number: "III", title: "Scholarships", subtitle: "Financial aid and subject changes" },
    { number: "IV", title: "Instructional Program", subtitle: "Curriculum and fees" },
    { number: "V", title: "Grading System", subtitle: "How grades are given" },
    { number: "VI", title: "Interventions and Remedial", subtitle: "Support for struggling students" },
    { number: "VII", title: "Learner Promotion and Retention", subtitle: "Moving up or repeating" },
    { number: "VIII", title: "Policy On Awards", subtitle: "Academic honors" },
    { number: "IX", title: "Tutorial Policy", subtitle: "Extra academic help" },
    { number: "X", title: "Non- Academic Policies", subtitle: "Other school rules" },
    { number: "XI", title: "Rules of Discipline", subtitle: "Exam and behavior rules" },
    { number: "XII", title: "CCTC Child Protection Policy (Based on Dep Ed Order No. 40. S. 2012)", subtitle: "Safety of students" },
    { number: "XIII", title: "Disciplinary Measures", subtitle: "Punishments for violations" },
    { number: "XIV", title: "Perfect of Discipline, Complaints and Grievances", subtitle: "Handling complaints" },
    { number: "XV", title: "Policy and Guidelines On Social Media Use", subtitle: "Online behavior rules" },
    { number: "XVI", title: "Student Services", subtitle: "Support services offered" },
    { number: "XVII", title: "Data Privacy Act, Notice and Consent Form", subtitle: "How your info is protected" },
  ]

  const collegeSections = [
    { number: "I", title: "Admission Requirements and Procedure of Enrollment", subtitle: "Enrollment Procedures" },
    { number: "II", title: "Student Academic Load", subtitle: "Credit Requirements" },
    { number: "III", title: "Withdrawal, Adding and Dropping of a Subject", subtitle: "Adding/dropping subjects" },
    { number: "IV", title: "Policy On Refund and Payment of Fees", subtitle: "Fee Structure" },
    { number: "V", title: "Scholarships and Financial Aid", subtitle: "Support Programs" },
    { number: "VI", title: "Attendance and Absences", subtitle: "Attendance Policy" },
    { number: "VII", title: "Grading System", subtitle: "Evaluation Methods" },
    { number: "VIII", title: "Retention Policies", subtitle: "Academic Standards" },
    { number: "IX", title: "Instructional Program", subtitle: "Academic Programs" },
    { number: "X", title: "Honorable Dismissal", subtitle: "Exit Procedures" },
    { number: "XI", title: "Examinations /Removal of Incomplete Grades", subtitle: "Examinations" },
    { number: "XII", title: "Graduation Requirements, Honors and Awards", subtitle: "Graduation" },
    { number: "XIII", title: "College Disciplinary Measures", subtitle: "Disciplinary" },
    { number: "XIV", title: "Prefect of Discipline, Complaints and Grievances Section", subtitle: "Complaints" },
    { number: "XV", title: "Learning Resource Center (Library)", subtitle: "Library" },
    { number: "XVI", title: "Student Services and Facilities", subtitle: "Services" },
    { number: "XVII", title: "Students Rights, Duties and Responsibilities", subtitle: "Rights & Duties" },
    { number: "XVIII", title: "Student Organizations - The Augustinian Recollect Student Crusaders (ARSC)", subtitle: "Organizations" },
    { number: "XIX", title: "Co-Curricular and Extra Curricular Activities", subtitle: "Activities" },
    { number: "XX", title: "Policy and Guidelines on Social Media Use", subtitle: "Social Media" },
  ]

  const sections = isBasicEducation ? basicEducationSections : collegeSections

  const currentSection = sections[selectedSection ? selectedSection - 1 : 0]

  return (
    <div className="h-screen flex flex-col overflow-hidden" style={{ backgroundColor: "#C4D7F0" }}>
      {/* Mobile Menu Button */}
      <button
        onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
        className="md:hidden fixed top-4 right-4 z-50 p-2 text-white rounded-lg shadow-lg"
        style={{ backgroundColor: "#041A44", fontFamily: "Inter, sans-serif", fontWeight: 700 }}
        aria-label="Toggle menu"
      >
        {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
      </button>

      <main className="flex flex-1 overflow-hidden h-full">
        {/* Left Sidebar - Desktop */}
        <aside className="hidden md:flex w-80 bg-white border-r border-gray-200 flex-col overflow-hidden">
          <div 
            className="overflow-y-auto h-full"
            style={{ overscrollBehavior: 'contain' }}
            onWheel={(e) => {
              const container = e.currentTarget
              const { scrollTop, scrollHeight, clientHeight } = container
              const isAtTop = scrollTop <= 0
              const isAtBottom = scrollTop + clientHeight >= scrollHeight - 5
              
              // Always prevent page scroll when scrolling inside the container
              // Only allow page scroll if we're at the boundaries and trying to scroll further
              if (!((e.deltaY < 0 && isAtTop) || (e.deltaY > 0 && isAtBottom))) {
                e.stopPropagation()
              }
            }}
          >
            {/* Sidebar Header */}
            <div className="p-4 border-b border-gray-200">
              <div className="flex items-center mb-4">
                <Link
                  href={homeHref}
                  className="text-gray-600 hover:text-gray-800 mr-3"
                >
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7"></path>
                  </svg>
                </Link>
                <h1 className="text-lg font-bold text-[#041A44]" style={{ fontFamily: "Inter, sans-serif", fontWeight: 700 }}>
                  {sectionTitle}
                </h1>
              </div>
              <div className="w-full h-0.5 bg-[#041A44]"></div>
            </div>

            {/* Sections List */}
            <div className="p-3 space-y-2 pb-6">
              {sections.map((section, index) => {
                const isSelected = selectedSection === index + 1
                return (
                  <button
                    key={index}
                    onClick={() => setSelectedSection(index + 1)}
                    className={`w-full text-left p-4 rounded-lg transition-all ${
                      isSelected
                        ? "bg-[#C4D7F0] border-l-4 border-[#041A44] shadow-sm"
                        : "bg-white border border-gray-200 hover:bg-[#f9fafb] hover:shadow-sm"
                    }`}
                    style={{ 
                      boxShadow: isSelected ? "0 2px 4px rgba(0, 0, 0, 0.15)" : "0 1px 3px rgba(0, 0, 0, 0.1)"
                    }}
                  >
                    <div 
                      className="font-semibold text-sm leading-tight mb-1"
                      style={{ 
                        color: "#041A44", 
                        fontFamily: "Inter, sans-serif", 
                        fontWeight: 600, 
                        fontSize: "14px" 
                      }}
                    >
                      Section {section.number}: {section.title}
                    </div>
                    <div 
                      className="text-xs mt-1"
                      style={{ 
                        color: "#041A44", 
                        fontFamily: "Inter, sans-serif", 
                        fontWeight: 400, 
                        fontSize: "12px" 
                      }}
                    >
                      {section.subtitle}
                    </div>
                  </button>
                )
              })}
            </div>
          </div>
        </aside>

        {/* Mobile Menu Overlay */}
        {isMobileMenuOpen && (
          <div className="md:hidden fixed inset-0 z-40 bg-black/50" onClick={() => setIsMobileMenuOpen(false)}>
            <aside
              className="w-80 bg-white h-full overflow-y-auto shadow-xl"
              onClick={(e) => e.stopPropagation()}
            >
              <div 
                className="overflow-y-auto h-full"
                style={{ overscrollBehavior: 'contain' }}
                onWheel={(e) => {
                  const container = e.currentTarget
                  const { scrollTop, scrollHeight, clientHeight } = container
                  const isAtTop = scrollTop <= 0
                  const isAtBottom = scrollTop + clientHeight >= scrollHeight - 5
                  
                  // Always prevent page scroll when scrolling inside the container
                  // Only allow page scroll if we're at the boundaries and trying to scroll further
                  if (!((e.deltaY < 0 && isAtTop) || (e.deltaY > 0 && isAtBottom))) {
                    e.stopPropagation()
                  }
                }}
              >
                {/* Sidebar Header */}
                <div className="p-4 border-b border-gray-200">
                  <div className="flex items-center mb-4">
                    <Link
                      href={homeHref}
                      className="text-gray-600 hover:text-gray-800 mr-3"
                      onClick={() => setIsMobileMenuOpen(false)}
                    >
                      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7"></path>
                      </svg>
                    </Link>
                    <h1 className="text-lg font-bold text-[#041A44]" style={{ fontFamily: "Inter, sans-serif", fontWeight: 700 }}>
                      {sectionTitle}
                    </h1>
                  </div>
                  <div className="w-full h-0.5 bg-[#041A44]"></div>
                </div>

                {/* Sections List */}
                <div className="p-3 space-y-2 pb-6">
                  {sections.map((section, index) => {
                    const isSelected = selectedSection === index + 1
                    return (
                      <button
                        key={index}
                        onClick={() => {
                          setSelectedSection(index + 1)
                          setIsMobileMenuOpen(false)
                        }}
                        className={`w-full text-left p-4 rounded-lg transition-all ${
                          isSelected
                            ? "bg-[#C4D7F0] border-l-4 border-[#041A44] shadow-sm"
                            : "bg-white border border-gray-200 hover:bg-[#f9fafb] hover:shadow-sm"
                        }`}
                        style={{ 
                          boxShadow: isSelected ? "0 2px 4px rgba(0, 0, 0, 0.15)" : "0 1px 3px rgba(0, 0, 0, 0.1)"
                        }}
                      >
                        <div 
                          className="font-semibold text-sm leading-tight mb-1"
                          style={{ 
                            color: "#041A44", 
                            fontFamily: "Inter, sans-serif", 
                            fontWeight: 600, 
                            fontSize: "14px" 
                          }}
                        >
                          Section {section.number}: {section.title}
                        </div>
                        <div 
                          className="text-xs mt-1"
                          style={{ 
                            color: "#041A44", 
                            fontFamily: "Inter, sans-serif", 
                            fontWeight: 400, 
                            fontSize: "12px" 
                          }}
                        >
                          {section.subtitle}
                        </div>
                      </button>
                    )
                  })}
                </div>
              </div>
            </aside>
          </div>
        )}

        {/* Main Content Area */}
        <div className="main-content flex-1 overflow-y-auto" style={{ backgroundColor: "#C4D7F0", fontFamily: "Inter, sans-serif" }}>
          <div ref={contentAreaRef} className="max-w-4xl mx-auto px-2 sm:px-4 md:p-6" style={{ maxWidth: "62.5rem" }}>
          {selectedSection === 1 && (
            <div className="w-full">
              {/* Section Header */}
              <div className="bg-white rounded-lg shadow-sm p-4 sm:p-6 md:p-8 mb-4 sm:mb-6 mt-4 sm:mt-6 md:mt-8" style={{ backgroundColor: "#041A44" }}>
                <div className="text-xs sm:text-sm mb-3 sm:mb-4 px-2 sm:px-3 py-1 bg-blue-100 text-blue-800 rounded-full inline-block" style={{ backgroundColor: "transparent", color: "white", border: "1px solid white" }}>
                  Section I
                </div>
                <h2 className="text-base sm:text-xl md:text-2xl font-bold mb-3 sm:mb-4" style={{ color: "white", fontFamily: "Inter, sans-serif", fontWeight: 700 }}>
                  {isBasicEducation ? "REGISTRATION AND ADMISSION" : "ADMISSION REQUIREMENTS AND PROCEDURE OF ENROLLMENT"}
                </h2>
                <p className="text-gray-600 mb-0 text-[10px] sm:text-sm md:text-base" style={{ color: "white", fontFamily: "Inter, sans-serif", fontWeight: 400 }}>
                  {isBasicEducation ? "Outlines the steps and requirements for successful registration and admission." : "Complete guide to enrollment processes and requirements"}
                </p>
              </div>

              {/* Main White Container with all content */}
              {!isBasicEducation && (
                <div className="rounded-lg shadow-sm p-4 sm:p-6 md:p-8 mb-4 sm:mb-6" style={{ backgroundColor: "#FFFFFF" }}>
                  {/* Main Title */}
                  <div className="mb-4 sm:mb-6 md:mb-8">
                    <h1 className="text-base sm:text-lg md:text-xl font-bold mb-3 sm:mb-4" style={{ color: "#041A44", fontFamily: "Inter, sans-serif", fontWeight: 700, fontSize: "20px" }}>
                      1 Academic entrance requirements
                    </h1>
                    <p className="mb-4 sm:mb-6 text-xs sm:text-sm md:text-base" style={{ color: "#041A44", fontFamily: "Inter, sans-serif", fontWeight: 400, fontSize: "15px", lineHeight: 1.6, textAlign: "justify" }}>
                      Academic entrance requirements vary with the status of the prospective student, the program in which he/she desires to enroll. Consolatrix College reserves the right not to accept any applicant whose qualifications do not meet the standards and requirements of the program in which he/she desires to enroll.
                    </p>
                  </div>
                  {/* Section 1.1 Requirements - Light Blue Container */}
                  <div className="rounded-lg shadow-sm p-3 sm:p-4 md:p-6" style={{ backgroundColor: "#C4D7F0", marginBottom: "2rem" }}>
                    <div className="flex items-center mb-6">
                      <div className="w-8 h-8 rounded-full flex items-center justify-center text-white font-bold text-sm mr-4" style={{ backgroundColor: "#041A44" }}>
                        1.1
                      </div>
                      <h3 className="text-base sm:text-lg font-bold" style={{ color: "#041A44", fontFamily: "Inter, sans-serif", fontWeight: 700 }}>
                        Requirements
                      </h3>
                    </div>
                    <p className="mb-4" style={{ color: "#041A44", fontFamily: "Inter, sans-serif", fontWeight: 400, fontSize: "15px", lineHeight: 1.6, textAlign: "justify" }}>
                      To qualify for admission to a particular Curriculum Program, the following are the requirements:
                    </p>
                    
                    {/* Two white boxes side by side */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {/* Left Box: Senior High School Graduates */}
                      <div className="bg-white rounded-lg shadow-sm p-3 sm:p-4">
                        <h3 className="font-bold mb-1 text-sm sm:text-base" style={{ color: "#041A44", fontFamily: "Inter, sans-serif", fontWeight: 700, fontSize: "16px" }}>
                          SENIOR HIGH SCHOOL GRADUATES
                        </h3>
                        <p className="mb-3 text-xs sm:text-sm md:text-base" style={{ color: "#041A44", fontFamily: "Inter, sans-serif", fontWeight: 400, fontSize: "15px", textAlign: "justify" }}>
                          (New First Years)
                        </p>
                        <ul className="space-y-2">
                          <li className="flex items-start text-xs sm:text-sm md:text-base" style={{ color: "#041A44", fontFamily: "Inter, sans-serif", fontWeight: 400, fontSize: "15px", textAlign: "justify" }}>
                            <span className="w-2 h-2 bg-blue-600 rounded-full mt-2 mr-3 flex-shrink-0"></span>
                            <span>Passing FINAL GRADE in all senior high school subjects</span>
                          </li>
                          <li className="flex items-start text-xs sm:text-sm md:text-base" style={{ color: "#041A44", fontFamily: "Inter, sans-serif", fontWeight: 400, fontSize: "15px", textAlign: "justify" }}>
                            <span className="w-2 h-2 bg-blue-600 rounded-full mt-2 mr-3 flex-shrink-0"></span>
                            <span>Interview with the Department Head</span>
                          </li>
                        </ul>
                      </div>
                      
                      {/* Right Box: Transferees */}
                      <div className="bg-white rounded-lg shadow-sm p-3 sm:p-4">
                        <h3 className="font-bold mb-3" style={{ color: "#041A44", fontFamily: "Inter, sans-serif", fontWeight: 700, fontSize: "16px" }}>
                          Transferees
                        </h3>
                        <p className="mb-3" style={{ color: "#041A44", fontFamily: "Inter, sans-serif", fontWeight: 400, fontSize: "15px", lineHeight: 1.6, textAlign: "justify" }}>
                          Transferees are undergraduate students who wish to enroll in Consolatrix College after having been enrolled in a college course from another institution. Before enrolling transferees vying for honors should review the school's policy on honors and awards.
                        </p>
                        <ul className="space-y-2">
                          <li className="flex items-start text-xs sm:text-sm md:text-base" style={{ color: "#041A44", fontFamily: "Inter, sans-serif", fontWeight: 400, fontSize: "15px", textAlign: "justify" }}>
                            <span className="w-2 h-2 bg-blue-600 rounded-full mt-2 mr-3 flex-shrink-0"></span>
                            <span>Interview with the Department Head</span>
                          </li>
                        </ul>
                      </div>
                    </div>
                  </div>
                  {/* Section 1.2 & 1.3 Combined Container */}
                  <div className="rounded-lg shadow-sm p-3 sm:p-4 md:p-6" style={{ backgroundColor: "#F1F3F8", marginBottom: "2rem" }}>
                    {/* Section 1.2 Academic Requirements */}
                    <div className="mb-4 sm:mb-6 md:mb-8">
                      <div className="flex items-center mb-6">
                        <div className="w-8 h-8 rounded-full flex items-center justify-center text-white font-bold text-sm mr-4" style={{ backgroundColor: "#041A44" }}>
                          1.2
                        </div>
                        <h3 className="text-base sm:text-lg font-bold" style={{ color: "#041A44", fontFamily: "Inter, sans-serif", fontWeight: 700 }}>
                          Academic Requirements:
                        </h3>
                      </div>
                      <p className="mb-4" style={{ color: "#041A44", fontFamily: "Inter, sans-serif", fontWeight: 400, fontSize: "15px", lineHeight: 1.6, textAlign: "justify" }}>
                        Consolatrix College of Toledo City, Inc. is open to any student who wishes to avail of its Christian Augustinian education, provided he/she meets the school's specific requirements and regulations. However, the school reserves the right to admission or re-admission of students under certain conditions:
                      </p>
                      
                      {/* Inner light blue container */}
                      <div className="rounded-lg shadow-sm p-4" style={{ backgroundColor: "#C4D7F0" }}>
                        <h3 className="font-bold mb-3" style={{ color: "#041A44", fontFamily: "Inter, sans-serif", fontWeight: 700, fontSize: "16px" }}>
                          Academic Requirements:
                        </h3>
                        <h4 className="font-bold mb-3" style={{ color: "#041A44", fontFamily: "Inter, sans-serif", fontWeight: 700, fontSize: "15px" }}>
                          New Students
                        </h4>
                        
                        {/* Two-column numbered list with light blue badges */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-3">
                          <div className="space-y-3">
                            <div className="flex items-start" style={{ color: "#041A44", fontFamily: "Inter, sans-serif", fontWeight: 400, fontSize: "15px", textAlign: "justify" }}>
                              <div className="w-6 h-6 rounded-full flex items-center justify-center text-sm font-bold mr-3 mt-0.5 flex-shrink-0" style={{ backgroundColor: "#C4D7F0", color: "#041A44" }}>
                                1
                              </div>
                              <span>Original Copy of Live Birth Certificate - NSO/PSA</span>
                            </div>
                            <div className="flex items-start" style={{ color: "#041A44", fontFamily: "Inter, sans-serif", fontWeight: 400, fontSize: "15px", textAlign: "justify" }}>
                              <div className="w-6 h-6 rounded-full flex items-center justify-center text-sm font-bold mr-3 mt-0.5 flex-shrink-0" style={{ backgroundColor: "#C4D7F0", color: "#041A44" }}>
                                2
                              </div>
                              <span>Original Copy of Baptismal & Confirmation Certificate</span>
                            </div>
                            <div className="flex items-start" style={{ color: "#041A44", fontFamily: "Inter, sans-serif", fontWeight: 400, fontSize: "15px", textAlign: "justify" }}>
                              <div className="w-6 h-6 rounded-full flex items-center justify-center text-sm font-bold mr-3 mt-0.5 flex-shrink-0" style={{ backgroundColor: "#C4D7F0", color: "#041A44" }}>
                                3
                              </div>
                              <span>Report Card - Form 135 duly signed</span>
                            </div>
                          </div>
                          <div className="space-y-3">
                            <div className="flex items-start" style={{ color: "#041A44", fontFamily: "Inter, sans-serif", fontWeight: 400, fontSize: "15px", textAlign: "justify" }}>
                              <div className="w-6 h-6 rounded-full flex items-center justify-center text-sm font-bold mr-3 mt-0.5 flex-shrink-0" style={{ backgroundColor: "#C4D7F0", color: "#041A44" }}>
                                4
                              </div>
                              <span>Certification to Transfer/Good Moral</span>
                            </div>
                            <div className="flex items-start" style={{ color: "#041A44", fontFamily: "Inter, sans-serif", fontWeight: 400, fontSize: "15px", textAlign: "justify" }}>
                              <div className="w-6 h-6 rounded-full flex items-center justify-center text-sm font-bold mr-3 mt-0.5 flex-shrink-0" style={{ backgroundColor: "#C4D7F0", color: "#041A44" }}>
                                5
                              </div>
                              <span>Colored ID pictures - 2 pcs. '1x1'</span>
                            </div>
                            <div className="flex items-start" style={{ color: "#041A44", fontFamily: "Inter, sans-serif", fontWeight: 400, fontSize: "15px", textAlign: "justify" }}>
                              <div className="w-6 h-6 rounded-full flex items-center justify-center text-sm font-bold mr-3 mt-0.5 flex-shrink-0" style={{ backgroundColor: "#C4D7F0", color: "#041A44" }}>
                                6
                              </div>
                              <span>Colored ID pictures of parents/guardian - '1x1'</span>
                            </div>
                          </div>
                        </div>
                        
                        {/* Old Students Bar */}
                        <div className="mt-6 p-4 rounded-lg" style={{ backgroundColor: "#F1F3F8" }}>
                          <p style={{ color: "#041A44", fontFamily: "Inter, sans-serif", fontWeight: 400, fontSize: "15px", lineHeight: 1.6, margin: 0 }}>
                            <strong>Old Students</strong> may not need to submit the aforementioned documentary requirements.
                          </p>
                        </div>
                      </div>
                    </div>
                    {/* Section 1.3 Probation Policy */}
                    <div>
                      <div className="flex items-center mb-6">
                        <div className="w-8 h-8 rounded-full flex items-center justify-center text-white font-bold text-sm mr-4" style={{ backgroundColor: "#041A44" }}>
                          1.3
                        </div>
                        <h3 className="text-base sm:text-lg font-bold" style={{ color: "#041A44", fontFamily: "Inter, sans-serif", fontWeight: 700 }}>
                          Probation Policy
                        </h3>
                      </div>
                      <p style={{ color: "#041A44", fontFamily: "Inter, sans-serif", fontWeight: 400, fontSize: "15px", lineHeight: 1.6, textAlign: "justify" }}>
                        All new enrollees are placed under academic/ behavioral probation. If he/she fails in two or more subjects or does not live up to the standards set by the school rules and regulations he/she be asked to withdraw from the school.
                      </p>
                    </div>
                  </div>
                </div>
              )}
              
              {/* Main White Container for Enrollment Procedures */}
              {!isBasicEducation && (
                <div className="rounded-lg shadow-sm p-4 sm:p-6 md:p-8 mb-4 sm:mb-6" style={{ backgroundColor: "#FFFFFF" }}>
                  {/* Section 2: Enrollment Procedures */}
                  <div className="mb-4 sm:mb-6 md:mb-8">
                    <h1 className="text-xl font-bold mb-6" style={{ color: "#041A44", fontFamily: "Inter, sans-serif", fontWeight: 700, fontSize: "20px" }}>
                      2 Enrollment Procedures
                    </h1>
                    
                    {/* Step 1 */}
                    <div className="rounded-lg shadow-sm p-3 mb-2" style={{ backgroundColor: "#C4D7F0" }}>
                      <div className="flex items-start">
                        <div className="w-6 h-6 rounded-full flex items-center justify-center text-white font-bold text-xs mr-3 mt-0.5 flex-shrink-0" style={{ backgroundColor: "#041A44" }}>
                          1
                        </div>
                        <div>
                          <span className="font-bold" style={{ color: "#041A44", fontFamily: "Inter, sans-serif", fontWeight: 700, fontSize: "15px" }}>
                            STEP 1
                          </span>
                          <span style={{ color: "#041A44", fontFamily: "Inter, sans-serif", fontWeight: 400, fontSize: "15px", textAlign: "justify" }}>
                            {" "}Apply and fill out the application form.
                          </span>
                        </div>
                      </div>
                    </div>
                    {/* Step 2 */}
                    <div className="rounded-lg shadow-sm p-3 mb-2" style={{ backgroundColor: "#C4D7F0" }}>
                      <div className="flex items-start">
                        <div className="w-6 h-6 rounded-full flex items-center justify-center text-white font-bold text-xs mr-3 mt-0.5 flex-shrink-0" style={{ backgroundColor: "#041A44" }}>
                          2
                        </div>
                        <div>
                          <span className="font-bold" style={{ color: "#041A44", fontFamily: "Inter, sans-serif", fontWeight: 700, fontSize: "15px" }}>
                            STEP 2
                          </span>
                          <span style={{ color: "#041A44", fontFamily: "Inter, sans-serif", fontWeight: 400, fontSize: "15px", textAlign: "justify" }}>
                            {" "}Proceed to the Accounting Department for the Assessment of Fees and pay the required amount
                          </span>
                        </div>
                      </div>
                    </div>
                    {/* Step 3 */}
                    <div className="rounded-lg shadow-sm p-3 mb-6" style={{ backgroundColor: "#C4D7F0" }}>
                      <div className="flex items-start">
                        <div className="w-6 h-6 rounded-full flex items-center justify-center text-white font-bold text-xs mr-3 mt-0.5 flex-shrink-0" style={{ backgroundColor: "#041A44" }}>
                          3
                        </div>
                        <div>
                          <span className="font-bold" style={{ color: "#041A44", fontFamily: "Inter, sans-serif", fontWeight: 700, fontSize: "15px" }}>
                            STEP 3
                          </span>
                          <span style={{ color: "#041A44", fontFamily: "Inter, sans-serif", fontWeight: 400, fontSize: "15px", textAlign: "justify" }}>
                            {" "}Submit the required documents in the Registrar's Office
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  {/* Section 2.1: Admission Credentials */}
                  <div className="mb-4 sm:mb-6 md:mb-8">
                    {/* Main Light Gray Container for 2.1 Content */}
                    <div className="rounded-lg shadow-sm p-3 sm:p-4 md:p-6 mb-4 sm:mb-6" style={{ backgroundColor: "#F1F3F8" }}>
                      <h1 className="text-xl font-bold mb-6" style={{ color: "#041A44", fontFamily: "Inter, sans-serif", fontWeight: 700, fontSize: "20px" }}>
                        2.1 These admission credentials are required for enrollment:
                      </h1>
                      
                      {/* Senior High School Graduates */}
                      <div className="rounded-lg shadow-sm p-3 sm:p-4 md:p-6 mb-3 sm:mb-4" style={{ backgroundColor: "#C4D7F0" }}>
                        <h3 className="text-lg font-bold mb-2" style={{ color: "#041A44", fontFamily: "Inter, sans-serif", fontWeight: 700 }}>
                          Senior High School Graduates (New First Years)
                        </h3>
                        <p className="mb-4" style={{ color: "#041A44", fontFamily: "Inter, sans-serif", fontWeight: 400, fontSize: "15px", fontStyle: "italic" }}>
                          (NEW STUDENTS)
                        </p>
                        <ul className="space-y-2">
                          <li className="flex items-start text-xs sm:text-sm md:text-base" style={{ color: "#041A44", fontFamily: "Inter, sans-serif", fontWeight: 400, fontSize: "15px", textAlign: "justify" }}>
                            <span className="w-2 h-2 rounded-full mt-2 mr-3 flex-shrink-0" style={{ backgroundColor: "#041A44" }}></span>
                            <span>Original Form 138 (High School Report Card)</span>
                          </li>
                          <li className="flex items-start text-xs sm:text-sm md:text-base" style={{ color: "#041A44", fontFamily: "Inter, sans-serif", fontWeight: 400, fontSize: "15px", textAlign: "justify" }}>
                            <span className="w-2 h-2 rounded-full mt-2 mr-3 flex-shrink-0" style={{ backgroundColor: "#041A44" }}></span>
                            <span>Original Copy of Birth Certificate from Philippine Statistics Authority</span>
                          </li>
                          <li className="flex items-start text-xs sm:text-sm md:text-base" style={{ color: "#041A44", fontFamily: "Inter, sans-serif", fontWeight: 400, fontSize: "15px", textAlign: "justify" }}>
                            <span className="w-2 h-2 rounded-full mt-2 mr-3 flex-shrink-0" style={{ backgroundColor: "#041A44" }}></span>
                            <span>Original Copy of Baptismal Certificate and Confirmation Certificate</span>
                          </li>
                          <li className="flex items-start text-xs sm:text-sm md:text-base" style={{ color: "#041A44", fontFamily: "Inter, sans-serif", fontWeight: 400, fontSize: "15px", textAlign: "justify" }}>
                            <span className="w-2 h-2 rounded-full mt-2 mr-3 flex-shrink-0" style={{ backgroundColor: "#041A44" }}></span>
                            <span>Certification to Transfer /Good Moral</span>
                          </li>
                          <li className="flex items-start text-xs sm:text-sm md:text-base" style={{ color: "#041A44", fontFamily: "Inter, sans-serif", fontWeight: 400, fontSize: "15px", textAlign: "justify" }}>
                            <span className="w-2 h-2 rounded-full mt-2 mr-3 flex-shrink-0" style={{ backgroundColor: "#041A44" }}></span>
                            <span>Colored ID picture - 2 pcs '1×1'</span>
                          </li>
                          <li className="flex items-start text-xs sm:text-sm md:text-base" style={{ color: "#041A44", fontFamily: "Inter, sans-serif", fontWeight: 400, fontSize: "15px", textAlign: "justify" }}>
                            <span className="w-2 h-2 rounded-full mt-2 mr-3 flex-shrink-0" style={{ backgroundColor: "#041A44" }}></span>
                            <span>Colored ID pictures of parents /guardian '1×1'</span>
                          </li>
                          <li className="flex items-start text-xs sm:text-sm md:text-base" style={{ color: "#041A44", fontFamily: "Inter, sans-serif", fontWeight: 400, fontSize: "15px", textAlign: "justify" }}>
                            <span className="w-2 h-2 rounded-full mt-2 mr-3 flex-shrink-0" style={{ backgroundColor: "#041A44" }}></span>
                            <span>Accomplished students Personal Data Sheet</span>
                          </li>
                        </ul>
                      </div>
                      
                      {/* Old Students Bar - Separate Container */}
                      <div className="rounded-lg shadow-sm p-3 mb-4" style={{ backgroundColor: "#F1F3F8" }}>
                        <p style={{ color: "#041A44", fontFamily: "Inter, sans-serif", fontWeight: 400, fontSize: "15px", lineHeight: 1.4, margin: 0, fontStyle: "italic" }}>
                          <strong>Old Students</strong> may not need to submit the aforementioned documentary requirements.
                        </p>
                      </div>
                      
                      {/* Transferees */}
                      <div className="rounded-lg shadow-sm p-3 sm:p-4 md:p-6 mb-4 sm:mb-6" style={{ backgroundColor: "#C4D7F0" }}>
                        <h3 className="text-lg font-bold mb-2" style={{ color: "#041A44", fontFamily: "Inter, sans-serif", fontWeight: 700 }}>
                          Transferees
                        </h3>
                        <p className="mb-4" style={{ color: "#041A44", fontFamily: "Inter, sans-serif", fontWeight: 400, fontSize: "15px", fontStyle: "italic" }}>
                          Baccalaureate Degree Programs
                        </p>
                        <ul className="space-y-2">
                          <li className="flex items-start text-xs sm:text-sm md:text-base" style={{ color: "#041A44", fontFamily: "Inter, sans-serif", fontWeight: 400, fontSize: "15px", textAlign: "justify" }}>
                            <span className="w-2 h-2 rounded-full mt-2 mr-3 flex-shrink-0" style={{ backgroundColor: "#041A44" }}></span>
                            <span>Certificate of Transfer Credentials (CTC)</span>
                          </li>
                          <li className="flex items-start text-xs sm:text-sm md:text-base" style={{ color: "#041A44", fontFamily: "Inter, sans-serif", fontWeight: 400, fontSize: "15px", textAlign: "justify" }}>
                            <span className="w-2 h-2 rounded-full mt-2 mr-3 flex-shrink-0" style={{ backgroundColor: "#041A44" }}></span>
                            <span>Copy of Transcript of Records</span>
                          </li>
                          <li className="flex items-start text-xs sm:text-sm md:text-base" style={{ color: "#041A44", fontFamily: "Inter, sans-serif", fontWeight: 400, fontSize: "15px", textAlign: "justify" }}>
                            <span className="w-2 h-2 rounded-full mt-2 mr-3 flex-shrink-0" style={{ backgroundColor: "#041A44" }}></span>
                            <span>Original Certificate of Good Moral Character and Clearance from the Student Activity Coordinator after the interview</span>
                          </li>
                          <li className="flex items-start text-xs sm:text-sm md:text-base" style={{ color: "#041A44", fontFamily: "Inter, sans-serif", fontWeight: 400, fontSize: "15px", textAlign: "justify" }}>
                            <span className="w-2 h-2 rounded-full mt-2 mr-3 flex-shrink-0" style={{ backgroundColor: "#041A44" }}></span>
                            <span>Accomplished students Personal Data Sheet</span>
                          </li>
                        </ul>
                      </div>
                    </div>
                  </div>
                  
                  {/* Section 2.2: Other Enrollees */}
                  <div className="mb-4 sm:mb-6 md:mb-8 border-2 p-3 sm:p-4 md:p-6" style={{ borderColor: "#041A44" }}>
                    <h1 className="text-xl font-bold mb-6" style={{ color: "#041A44", fontFamily: "Inter, sans-serif", fontWeight: 700, fontSize: "20px" }}>
                      2.2 Other enrollees and Admission Requirements
                    </h1>
                    
                    {/* 2.2.1 Aliens, Naturalized Filipinos */}
                    <div className="mb-6">
                      <h3 className="text-lg font-bold mb-4" style={{ color: "#041A44", fontFamily: "Inter, sans-serif", fontWeight: 700 }}>
                        2.2.1 Aliens, Naturalized Filipinos and Students With Foreign Names
                      </h3>
                      <p className="mb-3" style={{ color: "#041A44", fontFamily: "Inter, sans-serif", fontWeight: 400, fontSize: "15px", lineHeight: 1.6, textAlign: "justify" }}>
                        Philippine-born alien students must submit a photocopy of their Alien Certificate of Registration (ACR) and Native Born Certificate Registration (CR), certified against the original by the Regional Director, Commission on Higher Education (CHED).
                      </p>
                      <p className="mb-3" style={{ color: "#041A44", fontFamily: "Inter, sans-serif", fontWeight: 400, fontSize: "15px", lineHeight: 1.6, textAlign: "justify" }}>
                        Students whose parents are of naturalized Filipino citizens must submit a copy of Identification Certificate issued by the Commissioner of Immigration, certified against the original by the CHED.
                      </p>
                      <p className="mb-3" style={{ color: "#041A44", fontFamily: "Inter, sans-serif", fontWeight: 400, fontSize: "15px", lineHeight: 1.6, textAlign: "justify" }}>
                        Filipino citizens whose family names are of foreign origin must submit their birth certificates issued by the local Civil Registrar.
                      </p>
                      <p className="mb-3" style={{ color: "#041A44", fontFamily: "Inter, sans-serif", fontWeight: 400, fontSize: "15px", lineHeight: 1.6, textAlign: "justify" }}>
                        Foreign-born alien students must submit a photocopy of their Alien Certificate of Registration (ACR), certified against the original by the Regional Director, CHED.
                      </p>
                    </div>
                    
                    {/* 2.2.2 Overseas Students */}
                    <div className="mb-6">
                      <h3 className="text-lg font-bold mb-4" style={{ color: "#041A44", fontFamily: "Inter, sans-serif", fontWeight: 700 }}>
                        2.2.2 Overseas Students
                      </h3>
                      <p className="mb-3" style={{ color: "#041A44", fontFamily: "Inter, sans-serif", fontWeight: 400, fontSize: "15px", lineHeight: 1.6, textAlign: "justify" }}>
                        Overseas students should apply for admission to the School Registrar.
                      </p>
                      <p className="mb-3" style={{ color: "#041A44", fontFamily: "Inter, sans-serif", fontWeight: 400, fontSize: "15px", lineHeight: 1.6, textAlign: "justify" }}>
                        A complete copy of the official transcript of records (high school and college) should be sent with the application, which will be forwarded to the Commission on Higher Education. A copy of the Certificate of Eligibility for admission (CEA) together with the certificate of Acceptance to the school will be sent to the applicant. Only upon receipt of these documents from the school should an application for a visa be made by an overseas student.
                      </p>
                      <p className="mb-3" style={{ color: "#041A44", fontFamily: "Inter, sans-serif", fontWeight: 400, fontSize: "15px", lineHeight: 1.6, textAlign: "justify" }}>
                        In accordance with the regulations of the CHED and other related government agencies, no foreign student should be allowed to enroll unless he/she submits a valid permit to study and a student's visa to the Registrar's Office, Foreign Student Section.
                      </p>
                    </div>
                    
                    {/* 2.2.3 Returning Students */}
                    <div className="mb-6">
                      <h3 className="text-lg font-bold mb-4" style={{ color: "#041A44", fontFamily: "Inter, sans-serif", fontWeight: 700 }}>
                        2.2.3 Returning Students
                      </h3>
                      <p className="mb-3" style={{ color: "#041A44", fontFamily: "Inter, sans-serif", fontWeight: 400, fontSize: "15px", lineHeight: 1.6, textAlign: "justify" }}>
                        Students who were once enrolled in an A.R. School, and transferred to another school but wanted to come back are considered new students and will have to submit all the requirements for admission.
                      </p>
                      <p className="mb-3" style={{ color: "#041A44", fontFamily: "Inter, sans-serif", fontWeight: 400, fontSize: "15px", lineHeight: 1.6, textAlign: "justify" }}>
                        Every prospective student must enroll during the prescribed registration period. Detailed instructions on enrollment procedures are posted on enrollment time. A student cannot enroll without his/her credentials.
                      </p>
                    </div>
                    
                    {/* 2.2.4 Cross-Enrollment */}
                    <div className="mb-6">
                      <h3 className="text-lg font-bold mb-4" style={{ color: "#041A44", fontFamily: "Inter, sans-serif", fontWeight: 700 }}>
                        2.2.4 Cross-Enrollment
                      </h3>
                      <p className="mb-3" style={{ color: "#041A44", fontFamily: "Inter, sans-serif", fontWeight: 400, fontSize: "15px", lineHeight: 1.6, textAlign: "justify" }}>
                        No student may enroll simultaneously in two schools without the prior approval of the registrar. Violation of this rule may cancel the student's rights to the credit for work done in either school or both.
                      </p>
                      <p className="mb-3" style={{ color: "#041A44", fontFamily: "Inter, sans-serif", fontWeight: 400, fontSize: "15px", lineHeight: 1.6, textAlign: "justify" }}>
                        Permission for cross-enrollment is issued by the Registrar only upon the recommendation of the Dean concerned and only if the applicant is a candidate for graduation during the school year in the school, or has a conflict of schedule in those subjects.
                      </p>
                      <p className="mb-3" style={{ color: "#041A44", fontFamily: "Inter, sans-serif", fontWeight: 400, fontSize: "15px", lineHeight: 1.6, textAlign: "justify" }}>
                        The maximum number of units for which cross-enrollment is ordinarily permitted is six (6) units during regular term, and three (3) units during summer term.
                      </p>
                    </div>
                    
                    {/* 2.2.5 Enrollment Policy */}
                    <div className="mb-6">
                      <h3 className="text-lg font-bold mb-4" style={{ color: "#041A44", fontFamily: "Inter, sans-serif", fontWeight: 700 }}>
                        2.2.5 Enrollment Policy
                      </h3>
                      <ul className="space-y-2">
                        <li className="flex items-start" style={{ color: "#041A44", fontFamily: "Inter, sans-serif", fontWeight: 400, fontSize: "15px", textAlign: "justify" }}>
                          <span className="w-2 h-2 rounded-full mt-2 mr-3 flex-shrink-0" style={{ backgroundColor: "#041A44" }}></span>
                          <span>Enrollment is always on a semestral basis. The enrollment schedule follows the dates in the Academic Calendar issued by the College Registrar's Office.</span>
                        </li>
                        <li className="flex items-start" style={{ color: "#041A44", fontFamily: "Inter, sans-serif", fontWeight: 400, fontSize: "15px", textAlign: "justify" }}>
                          <span className="w-2 h-2 rounded-full mt-2 mr-3 flex-shrink-0" style={{ backgroundColor: "#041A44" }}></span>
                          <span>Only duly registered / officially enrolled students with Original Receipt of Matriculation will be included in the Master List of Students and will be allowed to attend classes. The Registrar's Office will furnish the instructors/professors with a copy of the Master List and will submit the same to the Commission on Higher Education (CHED).</span>
                        </li>
                        <li className="flex items-start" style={{ color: "#041A44", fontFamily: "Inter, sans-serif", fontWeight: 400, fontSize: "15px", textAlign: "justify" }}>
                          <span className="w-2 h-2 rounded-full mt-2 mr-3 flex-shrink-0" style={{ backgroundColor: "#041A44" }}></span>
                          <span>Students who will not push through with their studies are entitled to a refund of part of their tuition fees.</span>
                        </li>
                        <li className="flex items-start ml-6" style={{ color: "#041A44", fontFamily: "Inter, sans-serif", fontWeight: 400, fontSize: "15px", textAlign: "justify" }}>
                          <span className="w-2 h-2 rounded-full mt-2 mr-3 flex-shrink-0" style={{ backgroundColor: "#041A44" }}></span>
                          <span>70% withdraws within 1st week</span>
                        </li>
                        <li className="flex items-start ml-6" style={{ color: "#041A44", fontFamily: "Inter, sans-serif", fontWeight: 400, fontSize: "15px", textAlign: "justify" }}>
                          <span className="w-2 h-2 rounded-full mt-2 mr-3 flex-shrink-0" style={{ backgroundColor: "#041A44" }}></span>
                          <span>50% withdraws within 2nd week</span>
                        </li>
                      </ul>
                    </div>
                  </div>
                </div>
              )}
              
              {isBasicEducation && (
                <div className="rounded-lg shadow-sm p-4 sm:p-6 md:p-8 mb-4 sm:mb-6" style={{ backgroundColor: "#FFFFFF" }}>
                  {/* A Enrollment Section - Inside white container */}
                  <div className="mb-4">
                    <div className="flex items-center mb-4">
                      <div className="w-10 h-10 flex items-center justify-center font-bold text-lg mr-4" style={{ backgroundColor: "#EBF0F8", color: "#041A44", fontFamily: "Inter, sans-serif", fontWeight: 700 }}>A</div>
                      <h2 className="font-bold" style={{ color: "#041A44", fontSize: "20px", fontFamily: "Inter, sans-serif", fontWeight: 700 }}>Enrollment</h2>
                    </div>
                    <p className="text-gray-700 leading-relaxed mb-0" style={{ color: "#041A44 !important", fontFamily: "Inter, sans-serif", fontWeight: 400, lineHeight: 1.6 }}>
                      Consolatrix College of Toledo City, Inc. is open to any student who wishes to avail of its Christian Augustinian education, provided he/she meets the school's specific requirements and regulations. However, the school reserves the right to admission or re-admission of students under certain conditions.
                    </p>
                  </div>
                  
                  {/* 1.1 Age and Academic Requirements - Light Blue Container */}
                  <div className="rounded-lg p-3 sm:p-4 md:p-6 mb-4 sm:mb-6" style={{ backgroundColor: "#C4D7F0" }}>
                    <div className="flex items-center mb-6">
                      <div className="w-10 h-10 rounded-full flex items-center justify-center text-white font-bold text-sm mr-4" style={{ backgroundColor: "#041A44" }}>1.1</div>
                      <h3 className="text-base sm:text-lg font-bold" style={{ color: "#041A44", fontFamily: "Inter, sans-serif", fontWeight: 700 }}>Age and Academic Requirements:</h3>
                    </div>
                    <div className="bg-white rounded-lg p-3 sm:p-4 md:p-6 shadow-sm">
                      <div className="space-y-1 text-gray-700" style={{ color: "#041A44 !important", fontFamily: "Inter, sans-serif", fontWeight: 400, lineHeight: 1.4 }}>
                        <p style={{ color: "#041A44 !important", fontFamily: "Inter, sans-serif", fontWeight: 400, lineHeight: 1.4, marginBottom: "8px" }}><strong>A. KINDER-</strong> The child must be five years old by October.</p>
                        <p style={{ color: "#041A44 !important", fontFamily: "Inter, sans-serif", fontWeight: 400, lineHeight: 1.4, marginBottom: "8px" }}><strong>B. GRADE 1-</strong> The child must have a Learner's Reference Number.</p>
                        <p style={{ color: "#041A44 !important", fontFamily: "Inter, sans-serif", fontWeight: 400, lineHeight: 1.4, marginBottom: "8px" }}><strong>C. NEW STUDENTS</strong></p>
                        <ol className="ml-6 space-y-1" style={{ color: "#041A44 !important", fontFamily: "Inter, sans-serif", fontWeight: 400, lineHeight: 1.4 }}>
                          <li style={{ color: "#041A44 !important", fontFamily: "Inter, sans-serif", fontWeight: 400, lineHeight: 1.4, marginBottom: "4px" }}>1. Must have a Learner's Reference Number</li>
                          <li style={{ color: "#041A44 !important", fontFamily: "Inter, sans-serif", fontWeight: 400, lineHeight: 1.4, marginBottom: "4px" }}>2. Original Copy of Live Birth Certificate</li>
                          <li style={{ color: "#041A44 !important", fontFamily: "Inter, sans-serif", fontWeight: 400, lineHeight: 1.4, marginBottom: "4px" }}>3. Original Copy of Baptismal & Confirmation Certificate</li>
                          <li style={{ color: "#041A44 !important", fontFamily: "Inter, sans-serif", fontWeight: 400, lineHeight: 1.4, marginBottom: "4px" }}>4. Report Card - Form 138 duly signed</li>
                          <li style={{ color: "#041A44 !important", fontFamily: "Inter, sans-serif", fontWeight: 400, lineHeight: 1.4, marginBottom: "4px" }}>5. Certification to Transfer/Good Moral</li>
                          <li style={{ color: "#041A44 !important", fontFamily: "Inter, sans-serif", fontWeight: 400, lineHeight: 1.4, marginBottom: "4px" }}>6. Colored ID pictures -2 pcs. "1x1"</li>
                          <li style={{ color: "#041A44 !important", fontFamily: "Inter, sans-serif", fontWeight: 400, lineHeight: 1.4, marginBottom: "4px" }}>7. Colored ID Pictures of parents/guardian - "1x1"</li>
                        </ol>
                        <p style={{ color: "#041A44 !important", fontFamily: "Inter, sans-serif", fontWeight: 400, lineHeight: 1.4, marginBottom: "8px" }}><strong>D. OLD STUDENTS</strong> may not need to submit the aforementioned documentary requirements.</p>
                      </div>
                    </div>
                  </div>
                  
                  {/* 1.2 Enrollment Procedure - Light Blue Container */}
                  <div className="rounded-lg p-3 sm:p-4 md:p-6 mb-4 sm:mb-6" style={{ backgroundColor: "#C4D7F0" }}>
                    <div className="flex items-center mb-6">
                      <div className="w-10 h-10 rounded-full flex items-center justify-center text-white font-bold text-sm mr-4" style={{ backgroundColor: "#041A44" }}>1.2</div>
                      <h3 className="text-base sm:text-lg font-bold" style={{ color: "#041A44", fontFamily: "Inter, sans-serif", fontWeight: 700 }}>Enrollment Procedure</h3>
                    </div>
                    <div className="bg-white rounded-lg p-3 sm:p-4 md:p-6 shadow-sm">
                      <div className="space-y-3" style={{ color: "#041A44 !important", fontFamily: "Inter, sans-serif", fontWeight: 400, lineHeight: 1.4 }}>
                        {/* STEP 1 */}
                        <div className="flex items-start space-x-4">
                          <div className="px-3 py-1 rounded-full flex items-center justify-center text-xs font-bold flex-shrink-0" style={{ backgroundColor: "#C4D7F0", color: "#041A44", fontFamily: "Inter, sans-serif", fontWeight: 700 }}>
                            STEP 1
                          </div>
                          <p className="text-base font-normal leading-relaxed" style={{ color: "#041A44 !important", fontFamily: "Inter, sans-serif", fontWeight: 400, lineHeight: 1.4, marginBottom: "8px" }}>Apply and fill out the online application form.</p>
                        </div>
                        
                        {/* STEP 2 */}
                        <div className="flex items-start space-x-4">
                          <div className="px-3 py-1 rounded-full flex items-center justify-center text-xs font-bold flex-shrink-0" style={{ backgroundColor: "#C4D7F0", color: "#041A44", fontFamily: "Inter, sans-serif", fontWeight: 700 }}>
                            STEP 2
                          </div>
                          <p className="text-base font-normal leading-relaxed" style={{ color: "#041A44 !important", fontFamily: "Inter, sans-serif", fontWeight: 400, lineHeight: 1.4, marginBottom: "8px" }}>Proceed to the Accounting Department for the Assessment of Fees and pay the required amount.</p>
                        </div>
                        
                        {/* STEP 3 */}
                        <div className="flex items-start space-x-4">
                          <div className="px-3 py-1 rounded-full flex items-center justify-center text-xs font-bold flex-shrink-0" style={{ backgroundColor: "#C4D7F0", color: "#041A44", fontFamily: "Inter, sans-serif", fontWeight: 700 }}>
                            STEP 3
                          </div>
                          <div className="flex-1">
                            <p className="text-base font-normal leading-relaxed mb-2" style={{ color: "#041A44 !important", fontFamily: "Inter, sans-serif", fontWeight: 400, lineHeight: 1.4 }}>For New Students: Present the following documents a month after the enrollment.</p>
                            <div className="ml-6 space-y-1" style={{ color: "#041A44 !important", fontFamily: "Inter, sans-serif", fontWeight: 400, lineHeight: 1.4 }}>
                              <p className="text-base font-normal" style={{ color: "#041A44 !important", fontFamily: "Inter, sans-serif", fontWeight: 400, lineHeight: 1.4, marginBottom: "4px" }}><strong>a.</strong> Certificate of Transfer Credentials</p>
                              <p className="text-base font-normal" style={{ color: "#041A44 !important", fontFamily: "Inter, sans-serif", fontWeight: 400, lineHeight: 1.4, marginBottom: "4px" }}><strong>b.</strong> School Form 9</p>
                              <div className="ml-6" style={{ color: "#041A44 !important", fontFamily: "Inter, sans-serif", fontWeight: 400, lineHeight: 1.4 }}>
                                <p className="text-base font-normal" style={{ color: "#041A44 !important", fontFamily: "Inter, sans-serif", fontWeight: 400, lineHeight: 1.4, marginBottom: "4px" }}>-Learner's Progress Report Card (SF9) - Original</p>
                              </div>
                              <p className="text-base font-normal" style={{ color: "#041A44 !important", fontFamily: "Inter, sans-serif", fontWeight: 400, lineHeight: 1.4, marginBottom: "4px" }}><strong>c.</strong> Certificate of Good Moral Character (Original)</p>
                              <p className="text-base font-normal" style={{ color: "#041A44 !important", fontFamily: "Inter, sans-serif", fontWeight: 400, lineHeight: 1.4, marginBottom: "4px" }}><strong>d.</strong> PSA issued Birth Certificate - Original Copy</p>
                              <p className="text-base font-normal" style={{ color: "#041A44 !important", fontFamily: "Inter, sans-serif", fontWeight: 400, lineHeight: 1.4, marginBottom: "4px" }}><strong>e.</strong> (ESC Processing) and Photocopy (School File)</p>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  {/* 1.3 Returning Pupils/Students - Light Blue Container */}
                  <div className="rounded-lg p-5 mb-6" style={{ backgroundColor: "#C4D7F0" }}>
                    <div className="flex items-center mb-4">
                      <div className="w-10 h-10 rounded-full flex items-center justify-center text-white font-bold text-sm mr-4" style={{ backgroundColor: "#041A44", fontFamily: "Inter, sans-serif", fontWeight: 700 }}>1.3</div>
                      <h3 className="text-base sm:text-lg font-bold" style={{ color: "#041A44", fontFamily: "Inter, sans-serif", fontWeight: 700 }}>Returning Pupils/Students</h3>
                    </div>
                    <div className="bg-white rounded-lg p-3 shadow-sm">
                      <div className="space-y-1 text-gray-700" style={{ color: "#041A44 !important", fontFamily: "Inter, sans-serif", fontWeight: 400, lineHeight: 1.4 }}>
                        <p style={{ color: "#041A44 !important", fontFamily: "Inter, sans-serif", fontWeight: 400, lineHeight: 1.4, marginBottom: "8px" }}>Students who were once enrolled in an A.R. School, who transferred to another but wanted to come back are considered new students and will have to submit themselves to all requirements for admission.</p>
                        <p style={{ color: "#041A44 !important", fontFamily: "Inter, sans-serif", fontWeight: 400, lineHeight: 1.4, marginBottom: "8px" }}><strong>Note:</strong> There will be no re-admission for students who have been advised for a new learning environment from the school for reasonable cause.</p>
                      </div>
                    </div>
                  </div>
                </div>
              )}
              
              {/* Old College content removed - now handled in !isBasicEducation block above */}
            </div>
          )}

          {/* Section II: Withdrawal and Policy on Refund and Payments of Fees / Student Academic Load */}
          {selectedSection === 2 && (
            <div className="w-full">
              {/* Section Header */}
              <div className="bg-white rounded-lg shadow-sm p-4 sm:p-6 md:p-8 mb-4 sm:mb-6 mt-4 sm:mt-6 md:mt-8" style={{ backgroundColor: "#041A44" }}>
                <div className="text-xs sm:text-sm mb-3 sm:mb-4 px-2 sm:px-3 py-1 bg-blue-100 text-blue-800 rounded-full inline-block" style={{ backgroundColor: "transparent", color: "white", border: "1px solid white" }}>
                  Section II
                </div>
                <h2 className="text-base sm:text-xl md:text-2xl font-bold mb-3 sm:mb-4" style={{ color: "white", fontFamily: "Inter, sans-serif", fontWeight: 700 }}>
                  {isBasicEducation ? "WITHDRAWAL AND POLICY ON REFUND AND PAYMENTS OF FEES" : "STUDENT ACADEMIC LOAD"}
                </h2>
                <p className="text-gray-600 mb-0 text-[10px] sm:text-sm md:text-base" style={{ color: "white", fontFamily: "Inter, sans-serif", fontWeight: 400 }}>
                  {isBasicEducation ? "Details the guidelines for student withdrawal, refunds, and fee payments." : "Academic load requirements and guidelines"}
                </p>
              </div>

              {isBasicEducation ? (
                <div className="rounded-lg shadow-sm p-4 sm:p-6 md:p-8 mb-4 sm:mb-6" style={{ backgroundColor: "#FFFFFF" }}>
                  {/* Sub-section 1: Manual of Regulations for Private Schools */}
                  <div className="rounded-lg p-5 mb-6" style={{ backgroundColor: "#C4D7F0" }}>
                    <h3 className="text-lg font-bold mb-4" style={{ color: "#041A44", fontFamily: "Inter, sans-serif", fontWeight: 700, fontSize: "15px" }}>Manual of Regulations for Private Schools</h3>
                    <div className="bg-white rounded-lg p-3 shadow-sm">
                      <p className="text-base font-normal leading-relaxed text-justify" style={{ color: "#041A44 !important", fontFamily: "Inter, sans-serif", fontWeight: 400, lineHeight: 1.6, fontSize: "13px" }}>
                        Manual of Regulations for Private Schools states <strong>"when a student registers in a school, it is understood that he/she is enrolling for the entire semester for College course."</strong> A student who transfers or otherwise withdraws, in writing within two (2) weeks after the beginning of classes and who has already paid the pertinent tuition fees in full or for any length longer than one month may be charged <strong><u>10% of the total amount due to the term if he/she withdraws within the first week of classes, or 20% if within the second week of classes</u></strong>, regardless of whether or not he/she has actually attended classes. The student may be charged of all school fees in full if he/she withdraws any time after the second (2nd) week of classes. However, if the transfer or withdrawal is due to a justifiable reason, the pupil/student shall be charged of the pertinent fees only up to and including the last month.
                      </p>
                    </div>
                  </div>
                  
                  {/* Sub-section 2: Refund of Fees */}
                  <div className="rounded-lg p-5 mb-6" style={{ backgroundColor: "#C4D7F0" }}>
                    <h3 className="text-lg font-bold mb-4" style={{ color: "#041A44", fontFamily: "Inter, sans-serif", fontWeight: 700, fontSize: "15px" }}>Refund of Fees is made in the following conditions:</h3>
                    <div className="bg-white rounded-lg p-3 shadow-sm">
                      <p className="text-base font-normal leading-relaxed" style={{ color: "#041A44 !important", fontFamily: "Inter, sans-serif", fontWeight: 400, lineHeight: 1.6, fontSize: "13px" }}>
                        Should a pupil/student cancels his/her registration after having paid one (1) or more installments, his/her withdrawal from the school does not relieve him/her the responsibility of settling the unpaid balance of his/her fees for the entire term, except when he/she drops out within the first (1st) month of classes.
                      </p>
                    </div>
                  </div>
                  
                  {/* Sub-section 3: Installment Basis Cancellation */}
                  <div className="rounded-lg p-5 mb-6" style={{ backgroundColor: "#C4D7F0" }}>
                    <div className="mb-4">
                      <p className="text-base font-bold" style={{ color: "#041A44", fontFamily: "Inter, sans-serif", fontWeight: 700, fontSize: "15px" }}>If a pupil/student, paying on installment basis, cancels his/her registration, adjustment of fees will be as follows:</p>
                    </div>
                    <div className="space-y-4">
                      {/* Item 1 */}
                      <div className="bg-white rounded-lg p-3 shadow-sm">
                        <div className="flex items-start space-x-4">
                          <div className="w-8 h-8 rounded-full flex items-center justify-center text-white font-bold text-sm flex-shrink-0" style={{ backgroundColor: "#041A44", fontFamily: "Inter, sans-serif", fontWeight: 700 }}>1</div>
                          <p className="text-base font-normal leading-relaxed" style={{ color: "#041A44 !important", fontFamily: "Inter, sans-serif", fontWeight: 400, lineHeight: 1.6, fontSize: "13px" }}>
                            If the pupil/student has never attended classes, even for one (1) day, he/she will pay only the registration fee in full.
                          </p>
                        </div>
                      </div>
                      
                      {/* Item 2 */}
                      <div className="bg-white rounded-lg p-3 shadow-sm">
                        <div className="flex items-start space-x-4">
                          <div className="w-8 h-8 rounded-full flex items-center justify-center text-white font-bold text-sm flex-shrink-0" style={{ backgroundColor: "#041A44", fontFamily: "Inter, sans-serif", fontWeight: 700 }}>2</div>
                          <p className="text-base font-normal leading-relaxed" style={{ color: "#041A44 !important", fontFamily: "Inter, sans-serif", fontWeight: 400, lineHeight: 1.6, fontSize: "13px" }}>
                            If the pupil/student has attended classes, but withdraws in writing within the first (1st) week of classes, he/she will be charged ten (10%) percent of the total amount due for the term, plus the registration fee in full.
                          </p>
                        </div>
                      </div>
                      
                      {/* Item 3 */}
                      <div className="bg-white rounded-lg p-3 shadow-sm">
                        <div className="flex items-start space-x-4">
                          <div className="w-8 h-8 rounded-full flex items-center justify-center text-white font-bold text-sm flex-shrink-0" style={{ backgroundColor: "#041A44", fontFamily: "Inter, sans-serif", fontWeight: 700 }}>3</div>
                          <p className="text-base font-normal leading-relaxed" style={{ color: "#041A44 !important", fontFamily: "Inter, sans-serif", fontWeight: 400, lineHeight: 1.6, fontSize: "13px" }}>
                            If the pupil/student withdraws in writing within the second (2nd) week of classes he/she will be charged twenty (20%) percent of the total amount due for the term, plus the registration fee in full.
                          </p>
                        </div>
                      </div>
                      
                      {/* Item 4 */}
                      <div className="bg-white rounded-lg p-3 shadow-sm">
                        <div className="flex items-start space-x-4">
                          <div className="w-8 h-8 rounded-full flex items-center justify-center text-white font-bold text-sm flex-shrink-0" style={{ backgroundColor: "#041A44", fontFamily: "Inter, sans-serif", fontWeight: 700 }}>4</div>
                          <p className="text-base font-normal leading-relaxed" style={{ color: "#041A44 !important", fontFamily: "Inter, sans-serif", fontWeight: 400, lineHeight: 1.6, fontSize: "13px" }}>
                            If the pupil/student withdraws in writing beyond the second (2nd) week of classes, he/she will be charged fifty (50%) percent of the total amount due for the term plus the registration fee in full.
                          </p>
                        </div>
                      </div>
                      
                      {/* Item 5 */}
                      <div className="bg-white rounded-lg p-3 shadow-sm">
                        <div className="flex items-start space-x-4">
                          <div className="w-8 h-8 rounded-full flex items-center justify-center text-white font-bold text-sm flex-shrink-0" style={{ backgroundColor: "#041A44", fontFamily: "Inter, sans-serif", fontWeight: 700 }}>5</div>
                          <p className="text-base font-normal leading-relaxed" style={{ color: "#041A44 !important", fontFamily: "Inter, sans-serif", fontWeight: 400, lineHeight: 1.6, fontSize: "13px" }}>
                            If the pupil/student withdraws in writing after the fourth (4th) week of classes he/she will be charged the total amount due for the whole year.
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="bg-white rounded-xl p-6 shadow-sm">
                  <div className="space-y-6">
                      {/* Section 1: Student Academic Load */}
                      <div className="mb-4 sm:mb-6 md:mb-8">
                        <h1 className="text-xl font-bold mb-6" style={{ color: "#041A44", fontFamily: "Inter, sans-serif", fontWeight: 700, fontSize: "20px" }}>
                          1 Student Academic Load
                        </h1>
                        <p className="mb-4 sm:mb-6 text-xs sm:text-sm md:text-base" style={{ color: "#041A44", fontFamily: "Inter, sans-serif", fontWeight: 400, fontSize: "15px", lineHeight: 1.6, textAlign: "justify" }}>
                          The semestral load of a regular student shall be based on the number of academic load (units prescribed in the program of each college.)
                        </p>
                        
                        {/* Adding of subjects */}
                        <div className="rounded-lg shadow-sm p-3 sm:p-4 md:p-6 mb-4 sm:mb-6" style={{ backgroundColor: "#C4D7F0" }}>
                          <div className="flex items-start">
                            <div className="w-8 h-8 rounded-full flex items-center justify-center text-white font-bold text-sm mr-4 flex-shrink-0" style={{ backgroundColor: "#041A44" }}>
                              1
                            </div>
                            <div className="flex-1">
                              <h3 className="text-lg font-bold mb-3" style={{ color: "#041A44", fontFamily: "Inter, sans-serif", fontWeight: 700 }}>
                                Adding of subjects
                              </h3>
                              <p style={{ color: "#041A44", fontFamily: "Inter, sans-serif", fontWeight: 400, fontSize: "15px", lineHeight: 1.6, textAlign: "justify" }}>
                                The College shall take care of the adding of subjects. it shall be done during the enrollment period only.
                              </p>
                            </div>
                          </div>
                        </div>

                        {/* Changing of Subjects */}
                        <div className="rounded-lg shadow-sm p-3 sm:p-4 md:p-6 mb-4 sm:mb-6" style={{ backgroundColor: "#C4D7F0" }}>
                          <div className="flex items-start">
                            <div className="w-8 h-8 rounded-full flex items-center justify-center text-white font-bold text-sm mr-4 flex-shrink-0" style={{ backgroundColor: "#041A44" }}>
                              2
                            </div>
                            <div className="flex-1">
                              <h3 className="text-lg font-bold mb-3" style={{ color: "#041A44", fontFamily: "Inter, sans-serif", fontWeight: 700 }}>
                                Changing of Subjects
                              </h3>
                              <p style={{ color: "#041A44", fontFamily: "Inter, sans-serif", fontWeight: 400, fontSize: "15px", lineHeight: 1.6, textAlign: "justify" }}>
                                During the enrollment period, a student may change his/her subjects or curriculum with the approval of the Dean or Department Head. Changes are not permitted after the close of the official enrollment period.
                              </p>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </div>
          )}

          {/* Section III: Scholarships / Withdrawal, Adding and Dropping of a Subject */}
          {selectedSection === 3 && (
            <div className="w-full">
              {/* Section Header */}
              <div className="bg-white rounded-lg shadow-sm p-4 sm:p-6 md:p-8 mb-4 sm:mb-6 mt-4 sm:mt-6 md:mt-8" style={{ backgroundColor: "#041A44" }}>
                <div className="text-xs sm:text-sm mb-3 sm:mb-4 px-2 sm:px-3 py-1 bg-blue-100 text-blue-800 rounded-full inline-block" style={{ backgroundColor: "transparent", color: "white", border: "1px solid white" }}>
                  Section III
                </div>
                <h2 className="text-base sm:text-xl md:text-2xl font-bold mb-3 sm:mb-4" style={{ color: "white", fontFamily: "Inter, sans-serif", fontWeight: 700 }}>
                  {isBasicEducation ? "SCHOLARSHIPS" : "WITHDRAWAL, ADDING AND DROPPING OF A SUBJECT"}
                </h2>
                <p className="text-gray-600 mb-0 text-[10px] sm:text-sm md:text-base" style={{ color: "white", fontFamily: "Inter, sans-serif", fontWeight: 400 }}>
                  {isBasicEducation ? "Guidelines on scholarship and subject changes." : "Procedures for subject modifications and withdrawals"}
                </p>
              </div>

              {isBasicEducation ? (
                <div className="rounded-lg shadow-sm p-4 sm:p-6 md:p-8 mb-4 sm:mb-6" style={{ backgroundColor: "#FFFFFF" }}>
                  {/* A. Academic - Light Blue Container */}
                  <div className="rounded-lg p-5 mb-6" style={{ backgroundColor: "#C4D7F0" }}>
                    <div className="flex items-start mb-4">
                      <div className="w-10 h-10 rounded-full flex items-center justify-center font-bold mr-4 flex-shrink-0" style={{ backgroundColor: "#041A44", fontFamily: "Inter, sans-serif", fontWeight: 700, color: "white", fontSize: "14px" }}>
                        A
                      </div>
                      <h2 className="font-bold flex-1 leading-10" style={{ color: "#041A44", fontSize: "18px", fontFamily: "Inter, sans-serif", fontWeight: 700 }}>
                        Academic
                      </h2>
                    </div>
                    <div className="bg-white rounded-lg p-3 shadow-sm">
                      <p className="text-sm font-normal leading-relaxed mb-4" style={{ color: "#041A44", fontFamily: "Inter, sans-serif", fontWeight: 400, lineHeight: 1.3, fontSize: "13px" }}>
                        <strong>a.1</strong> For Grade levels 2 to 10 Grade School and Junior High School (GS and JHS)
                      </p>
                      <p className="text-sm font-normal leading-relaxed mb-4" style={{ color: "#041A44", fontFamily: "Inter, sans-serif", fontWeight: 400, lineHeight: 1.3, fontSize: "13px" }}>
                        <strong>a.2</strong> This scholarships is given to learners who have obtained academic honors as rank.
                      </p>
                      <p className="text-sm font-normal leading-relaxed mb-4" style={{ color: "#041A44", fontFamily: "Inter, sans-serif", fontWeight: 400, lineHeight: 1.3, fontSize: "13px" }}>
                        First and Second in the Academic Excellence Award or "With Highest Honors" (98-100%) and/or "With High Honors" (95-97%) if there are no qualified "With Highest Honors".
                      </p>
                      <p className="text-sm font-normal leading-relaxed mb-4" style={{ color: "#041A44", fontFamily: "Inter, sans-serif", fontWeight: 400, lineHeight: 1.3, fontSize: "13px" }}>
                        <strong>NB:</strong> Students who got the Academic Excellence Award of "With Honors (90-94%) do not qualify for this scholarship, regardless of the rank.
                      </p>
                      <p className="text-sm font-normal leading-relaxed mb-4" style={{ color: "#041A44", fontFamily: "Inter, sans-serif", fontWeight: 400, lineHeight: 1.3, fontSize: "13px" }}>
                        <strong>a.3</strong> The rank first among "With Highest Honors" (98-100%) and/or "With Hig Honors" (95-97%) will be granted 100% free tuition fee and rank second will be 50% free tuition fee.
                      </p>
                      
                      <div className="bg-gray-50 rounded-lg p-5 mb-6">
                        <h4 className="font-semibold mb-4" style={{ color: "#041A44", fontFamily: "Inter, sans-serif", fontWeight: 700, fontSize: "15px" }}>
                          Examples:
                        </h4>
                        <div className="space-y-1">
                          <div className="flex justify-between">
                            <span className="font-semibold" style={{ color: "#041A44", fontFamily: "Inter, sans-serif", fontWeight: 700 }}>
                              SCHOLAR A:
                            </span>
                            <span style={{ color: "#041A44", fontFamily: "Inter, sans-serif", fontWeight: 400 }}>
                              With Highest Honors Rank 1
                            </span>
                            <span style={{ color: "#041A44", fontFamily: "Inter, sans-serif", fontWeight: 400 }}>
                              100% free tuition fee
                            </span>
                          </div>
                          <div className="border-t border-gray-300 my-2"></div>
                          <div className="flex justify-between">
                            <span className="font-semibold" style={{ color: "#041A44", fontFamily: "Inter, sans-serif", fontWeight: 700 }}>
                              SCHOLAR B:
                            </span>
                            <span style={{ color: "#041A44", fontFamily: "Inter, sans-serif", fontWeight: 400 }}>
                              With High Honors Rank 2
                            </span>
                            <span style={{ color: "#041A44", fontFamily: "Inter, sans-serif", fontWeight: 400 }}>
                              50% free tuition fee
                            </span>
                          </div>
                          <div className="flex justify-between">
                            <span className="font-semibold" style={{ color: "#041A44", fontFamily: "Inter, sans-serif", fontWeight: 700 }}>
                              Or
                            </span>
                            <span style={{ color: "#041A44", fontFamily: "Inter, sans-serif", fontWeight: 400 }}>
                              With High Honors Rank 2
                            </span>
                            <span style={{ color: "#041A44", fontFamily: "Inter, sans-serif", fontWeight: 400 }}>
                              50% free tuition fee
                            </span>
                          </div>
                        </div>
                      </div>
                      
                      <p className="text-base font-normal leading-relaxed" style={{ color: "#041A44", fontFamily: "Inter, sans-serif", fontWeight: 400, lineHeight: 1.3, fontSize: "13px" }}>
                        The applicant should present a certification from the school principal indicating that the student applicant is rank 1 or 2 of the entire graduates and his/ her average grade.
                      </p>
                    </div>
                  </div>
                  
                  {/* B. Sibling Tuition Fee Discount Scheme - Light Blue Container */}
                  <div className="rounded-lg p-5 mb-6" style={{ backgroundColor: "#C4D7F0" }}>
                    <div className="flex items-start mb-4">
                      <div className="w-10 h-10 rounded-full flex items-center justify-center font-bold mr-4 flex-shrink-0" style={{ backgroundColor: "#041A44", fontFamily: "Inter, sans-serif", fontWeight: 700, color: "white", fontSize: "14px" }}>
                        B
                      </div>
                      <h2 className="font-bold flex-1 leading-10" style={{ color: "#041A44", fontSize: "18px", fontFamily: "Inter, sans-serif", fontWeight: 700 }}>
                        Sibling Tuition Fee Discount Scheme
                      </h2>
                    </div>
                    <div className="bg-white rounded-lg p-3 shadow-sm">
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        <div className="bg-gray-100 rounded-lg p-3">
                          <p className="text-sm font-normal leading-relaxed" style={{ color: "#041A44", fontFamily: "Inter, sans-serif", fontWeight: 400, lineHeight: 1.3, fontSize: "13px" }}>
                            <strong>3rd child</strong> – 25% discount on tuition fee
                          </p>
                        </div>
                        <div className="bg-gray-100 rounded-lg p-3">
                          <p className="text-sm font-normal leading-relaxed" style={{ color: "#041A44", fontFamily: "Inter, sans-serif", fontWeight: 400, lineHeight: 1.3, fontSize: "13px" }}>
                            <strong>4th child</strong> – 50% discount on tuition fee
                          </p>
                        </div>
                        <div className="bg-gray-100 rounded-lg p-3">
                          <p className="text-sm font-normal leading-relaxed" style={{ color: "#041A44", fontFamily: "Inter, sans-serif", fontWeight: 400, lineHeight: 1.3, fontSize: "13px" }}>
                            <strong>5th child</strong> – 75% discount on tuition fee
                          </p>
                        </div>
                        <div className="bg-gray-100 rounded-lg p-3">
                          <p className="text-sm font-normal leading-relaxed" style={{ color: "#041A44", fontFamily: "Inter, sans-serif", fontWeight: 400, lineHeight: 1.3, fontSize: "13px" }}>
                            <strong>6th and Last Child</strong> – Free tuition fee
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  {/* C. Talangpaz Scholarship - Light Blue Container */}
                  <div className="rounded-lg p-5 mb-6" style={{ backgroundColor: "#C4D7F0" }}>
                    <div className="flex items-start mb-4">
                      <div className="w-10 h-10 rounded-full flex items-center justify-center font-bold mr-4 flex-shrink-0" style={{ backgroundColor: "#041A44", fontFamily: "Inter, sans-serif", fontWeight: 700, color: "white", fontSize: "14px" }}>
                        C
                      </div>
                      <h2 className="font-bold flex-1 leading-10" style={{ color: "#041A44", fontSize: "18px", fontFamily: "Inter, sans-serif", fontWeight: 700 }}>
                        Talangpaz Scholarship
                      </h2>
                    </div>
                    <div className="bg-white rounded-lg p-5 shadow-sm">
                      <p className="text-sm font-normal leading-relaxed mb-4" style={{ color: "#041A44", fontFamily: "Inter, sans-serif", fontWeight: 400, lineHeight: 1.3, fontSize: "13px" }}>
                        100% discount on Tuition Fee & Books for Junior High School Students only.
                      </p>
                      <div className="bg-gray-50 rounded-lg p-4">
                        <p className="text-sm font-normal leading-relaxed mb-3" style={{ color: "#041A44", fontFamily: "Inter, sans-serif", fontWeight: 400, lineHeight: 1.3, fontSize: "13px" }}>
                          <strong>Requirements:</strong>
                        </p>
                        <ul className="list-disc list-inside space-y-1" style={{ color: "#041A44", fontFamily: "Inter, sans-serif", fontWeight: 400, lineHeight: 1.4 }}>
                          <li className="text-sm font-normal" style={{ marginBottom: "4px", fontSize: "13px" }}>
                            Family background
                          </li>
                          <li className="text-sm font-normal" style={{ marginBottom: "4px", fontSize: "13px" }}>
                            Poor but deserving students
                          </li>
                          <li className="text-sm font-normal" style={{ fontSize: "13px" }}>
                            Academic performance (maintain a grade of 85% or higher)
                          </li>
                          <li className="text-sm font-normal" style={{ fontSize: "13px" }}>
                            Home visitation is encouraged to conduct a final evaluation before acceptance.
                          </li>
                        </ul>
                      </div>
                    </div>
                  </div>
                  
                  {/* D. Education Service Contracting (ESC) - Light Blue Container */}
                  <div className="rounded-lg p-5 mb-6" style={{ backgroundColor: "#C4D7F0" }}>
                    <div className="flex items-start mb-4">
                      <div className="w-10 h-10 rounded-full flex items-center justify-center font-bold mr-4 flex-shrink-0" style={{ backgroundColor: "#041A44", fontFamily: "Inter, sans-serif", fontWeight: 700, color: "white", fontSize: "14px" }}>
                        D
                      </div>
                      <h2 className="font-bold flex-1 leading-10" style={{ color: "#041A44", fontSize: "18px", fontFamily: "Inter, sans-serif", fontWeight: 700 }}>
                        Education Service Contracting (ESC)
                      </h2>
                    </div>
                    <div className="bg-white rounded-lg p-5 shadow-sm">
                      <p className="text-sm font-normal leading-relaxed mb-3" style={{ color: "#041A44", fontFamily: "Inter, sans-serif", fontWeight: 400, lineHeight: 1.3, fontSize: "13px" }}>
                        government assistance extended to Grades 7 to 10 JHS students.
                      </p>
                      <div className="bg-gray-50 rounded-lg p-4">
                        <p className="text-sm font-normal leading-relaxed" style={{ color: "#041A44", fontFamily: "Inter, sans-serif", fontWeight: 400, lineHeight: 1.3, fontSize: "13px" }}>
                          Education Service Contracting (ESC) - This is the financial assistance given by the government to poor but deserving students either from public or private elementary schools who would like to push through with secondary education in selected secondary private institutions. Phil. const. Art. XIV, Sec 1, Sec 2-3.
                        </p>
                      </div>
                    </div>
                  </div>
                  
                  {/* E. CCTC permanent employee's children - Light Blue Container */}
                  <div className="rounded-lg p-5 mb-6" style={{ backgroundColor: "#C4D7F0" }}>
                    <div className="flex items-start mb-4">
                      <div className="w-10 h-10 rounded-full flex items-center justify-center font-bold mr-4 flex-shrink-0" style={{ backgroundColor: "#041A44", fontFamily: "Inter, sans-serif", fontWeight: 700, color: "white", fontSize: "14px" }}>
                        E
                      </div>
                      <h2 className="font-bold flex-1 leading-10" style={{ color: "#041A44", fontSize: "18px", fontFamily: "Inter, sans-serif", fontWeight: 700 }}>
                        CCTC permanent employee's children
                      </h2>
                    </div>
                    <div className="bg-white rounded-lg p-5 shadow-sm">
                      <p className="text-sm font-normal leading-relaxed" style={{ color: "#041A44", fontFamily: "Inter, sans-serif", fontWeight: 400, lineHeight: 1.3, fontSize: "13px" }}>
                        <strong>CCTC permanent employee's children</strong> enjoy 50% tuition fee discount.
                      </p>
                    </div>
                  </div>
                  
                  {/* F. AR Sisters' siblings/nephews/nieces - Light Blue Container */}
                  <div className="rounded-lg p-5 mb-6" style={{ backgroundColor: "#C4D7F0" }}>
                    <div className="flex items-start mb-4">
                      <div className="w-10 h-10 rounded-full flex items-center justify-center font-bold mr-4 flex-shrink-0" style={{ backgroundColor: "#041A44", fontFamily: "Inter, sans-serif", fontWeight: 700, color: "white", fontSize: "14px" }}>
                        F
                      </div>
                      <h2 className="font-bold flex-1 leading-10" style={{ color: "#041A44", fontSize: "18px", fontFamily: "Inter, sans-serif", fontWeight: 700 }}>
                        AR Sisters' siblings/nephews/nieces
                      </h2>
                    </div>
                    <div className="bg-white rounded-lg p-5 shadow-sm">
                      <p className="text-sm font-normal leading-relaxed" style={{ color: "#041A44", fontFamily: "Inter, sans-serif", fontWeight: 400, lineHeight: 1.3, fontSize: "13px" }}>
                        enjoy 100% tuition fee discounts. When two or more nephews/nieces are enrolled, the 100% will be divided to each one.
                      </p>
                    </div>
                  </div>
                  
                  {/* G. Policies On Privileges - Light Blue Container */}
                  <div className="rounded-lg p-5 mb-6" style={{ backgroundColor: "#C4D7F0" }}>
                    <div className="flex items-start mb-4">
                      <div className="w-10 h-10 rounded-full flex items-center justify-center font-bold mr-4 flex-shrink-0" style={{ backgroundColor: "#041A44", fontFamily: "Inter, sans-serif", fontWeight: 700, color: "white", fontSize: "14px" }}>
                        G
                      </div>
                      <h2 className="font-bold flex-1 leading-10" style={{ color: "#041A44", fontSize: "18px", fontFamily: "Inter, sans-serif", fontWeight: 700 }}>
                        Policies On Privileges
                      </h2>
                    </div>
                    <div className="bg-white rounded-lg p-5 shadow-sm">
                      <ol className="list-decimal list-inside space-y-1" style={{ color: "#041A44", fontFamily: "Inter, sans-serif", fontWeight: 400, lineHeight: 1.4 }}>
                        <li className="text-sm font-normal" style={{ marginBottom: "4px", fontSize: "13px" }}>
                          A Student can only avail one scholrship granted by the school.
                        </li>
                        <li className="text-sm font-normal" style={{ marginBottom: "4px", fontSize: "13px" }}>
                          For academic scholarship, the school will send an e-mail to the parents at the end of the school year stating that their son/daughter is qualified as an academic scholar.
                        </li>
                        <li className="text-sm font-normal" style={{ fontSize: "13px" }}>
                          For Brothers & Sisters Tuition Fee Discount, parents will fill-out a form and submit it to the Registrar's Office.
                        </li>
                        <li className="text-sm font-normal" style={{ fontSize: "13px" }}>
                          For Talangpaz Scholarship, an application letter with bio-data is required to those who apply scholarships in triplicate copies.
                        </li>
                        <li className="text-sm font-normal" style={{ fontSize: "13px" }}>
                          For ESC grants, the parents will be accomplishing the ESC Form to be submitted to the Administration office.
                        </li>
                        <li className="text-sm font-normal" style={{ fontSize: "13px" }}>
                          For the Permanent Employee's Children Tuition Fee Discount and AR Sisters siblings/nephews/nieces o Tuition Fee Discount, a form must be accomplished and submitted to the Administration Office.
                        </li>
                      </ol>
                    </div>
                  </div>
                </div>
              ) : (
                <>
                  {/* Main White Container for Withdrawal and Dropping */}
                  <div className="rounded-lg shadow-sm p-4 sm:p-6 md:p-8 mb-4 sm:mb-6" style={{ backgroundColor: "#FFFFFF" }}>
                    {/* Section 1: Authorized Withdrawal */}
                    <div className="mb-4 sm:mb-6 md:mb-8">
                      <div className="flex items-start mb-6">
                        <div className="w-8 h-8 rounded-full flex items-center justify-center text-white font-bold text-sm mr-4 flex-shrink-0" style={{ backgroundColor: "#041A44" }}>
                          1
                        </div>
                        <h1 className="text-xl font-bold flex-1" style={{ color: "#041A44", fontFamily: "Inter, sans-serif", fontWeight: 700, fontSize: "20px" }}>
                          Authorized Withdrawal
                        </h1>
                      </div>
                      <p className="mb-4 sm:mb-6 text-xs sm:text-sm md:text-base" style={{ color: "#041A44", fontFamily: "Inter, sans-serif", fontWeight: 400, fontSize: "15px", lineHeight: 1.6, textAlign: "justify" }}>
                        Students may officially withdraw from their subjects even after the close of the enrollment period upon the recommendation by the Dean and with the approval of the Registrar. Withdrawal of subjects is not usually approved after the midterm examination.
                      </p>
                      
                      {/* Approval Conditions Box */}
                      <div className="rounded-lg shadow-sm p-3 sm:p-4 md:p-6 mb-4 sm:mb-6" style={{ backgroundColor: "#C4D7F0" }}>
                        <h3 className="text-lg font-bold mb-4" style={{ color: "#041A44", fontFamily: "Inter, sans-serif", fontWeight: 700 }}>
                          Approval for withdrawal will not be given in the following cases:
                        </h3>
                        <ul className="space-y-2">
                          <li className="flex items-start text-xs sm:text-sm md:text-base" style={{ color: "#041A44", fontFamily: "Inter, sans-serif", fontWeight: 400, fontSize: "15px", textAlign: "justify" }}>
                            <span className="w-2 h-2 rounded-full mt-2 mr-3 flex-shrink-0" style={{ backgroundColor: "#041A44" }}></span>
                            <span>if the accumulated number of student's absences has exceeded 20% of the prescribed number of class days/periods;</span>
                          </li>
                          <li className="flex items-start text-xs sm:text-sm md:text-base" style={{ color: "#041A44", fontFamily: "Inter, sans-serif", fontWeight: 400, fontSize: "15px", textAlign: "justify" }}>
                            <span className="w-2 h-2 rounded-full mt-2 mr-3 flex-shrink-0" style={{ backgroundColor: "#041A44" }}></span>
                            <span>if the student does not have a written permission to withdraw from his/her parents or guardian.</span>
                          </li>
                        </ul>
                      </div>
                      
                      {/* Consequences of Unofficial Withdrawal Box */}
                      <div className="rounded-lg shadow-sm p-3 sm:p-4 md:p-6 mb-4 sm:mb-6" style={{ backgroundColor: "#C4D7F0" }}>
                        <p className="mb-0" style={{ color: "#041A44", fontFamily: "Inter, sans-serif", fontWeight: 400, fontSize: "15px", lineHeight: 1.6, textAlign: "justify" }}>
                          A student gets a grade of DR (Dropped) if he/she stops attending classes and fails to officially withdraw his/ her subjects. Students who are contemplating withdrawal of subjects should consult with the Dean/ Department Head/ Registrar concerning withdrawal procedures.
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Second White Container for Dropping from Class */}
                  <div className="rounded-lg shadow-sm p-8 pb-4 mb-6" style={{ backgroundColor: "#FFFFFF" }}>
                    {/* Section 2: Dropping from Class */}
                    <div className="mb-0">
                      <div className="flex items-start mb-3 sm:mb-4">
                        <div className="w-8 h-8 rounded-full flex items-center justify-center text-white font-bold text-sm mr-4 flex-shrink-0" style={{ backgroundColor: "#041A44" }}>
                          2
                        </div>
                        <h1 className="text-base sm:text-lg md:text-xl font-bold flex-1" style={{ color: "#041A44", fontFamily: "Inter, sans-serif", fontWeight: 700, fontSize: "20px" }}>
                          Dropping from Class
                        </h1>
                      </div>
                      <p className="mb-0" style={{ color: "#041A44", fontFamily: "Inter, sans-serif", fontWeight: 400, fontSize: "15px", lineHeight: 1.6, textAlign: "justify" }}>
                        A student is automatically dropped (DR) when the number of absences exceeds the maximum number of permitted absences consisting of 20% of the prescribed number of class periods for the course.
                      </p>
                    </div>
                  </div>

                  {/* Main White Container for All Section III Content */}
                  <div className="rounded-lg shadow-sm p-4 sm:p-6 md:p-8 mb-4 sm:mb-6" style={{ backgroundColor: "#FFFFFF" }}>
                    {/* Section 3: Summer Study in Another School */}
                    <div className="flex items-start mb-3 sm:mb-4">
                      <div className="w-8 h-8 rounded-full flex items-center justify-center text-white font-bold text-sm mr-4 flex-shrink-0" style={{ backgroundColor: "#041A44" }}>
                        3
                      </div>
                      <h1 className="text-base sm:text-lg md:text-xl font-bold flex-1" style={{ color: "#041A44", fontFamily: "Inter, sans-serif", fontWeight: 700, fontSize: "20px" }}>
                        Summer Study in Another School
                      </h1>
                    </div>
                    <p className="mb-4 sm:mb-6 text-xs sm:text-sm md:text-base" style={{ color: "#041A44", fontFamily: "Inter, sans-serif", fontWeight: 400, fontSize: "15px", lineHeight: 1.6, textAlign: "justify" }}>
                      Students in the school may enroll in another school during summer session and obtain credit in this school only upon the prior recommendation of the dean and/or department head provided such school is accredited.
                    </p>
                    
                    {/* No Permit Box - Light Blue Container */}
                    <div className="rounded-lg p-3 sm:p-4 md:p-6 mb-4 sm:mb-6" style={{ backgroundColor: "#C4D7F0" }}>
                      <h3 className="text-lg font-bold mb-3" style={{ color: "#041A44", fontFamily: "Inter, sans-serif", fontWeight: 700 }}>
                        No permit to study in another school during summer will be granted for the following:
                      </h3>
                      <ul className="space-y-2">
                        <li className="flex items-start" style={{ color: "#041A44", fontFamily: "Inter, sans-serif", fontWeight: 400, fontSize: "15px", textAlign: "justify" }}>
                          <span className="w-2 h-2 rounded-full mt-2 mr-3 flex-shrink-0" style={{ backgroundColor: "#041A44" }}></span>
                          <span>Any subject in which the student failed or;</span>
                        </li>
                        <li className="flex items-start" style={{ color: "#041A44", fontFamily: "Inter, sans-serif", fontWeight: 400, fontSize: "15px", textAlign: "justify" }}>
                          <span className="w-2 h-2 rounded-full mt-2 mr-3 flex-shrink-0" style={{ backgroundColor: "#041A44" }}></span>
                          <span>Any major, specialized or professional subject, in any year.</span>
                        </li>
                      </ul>
                    </div>

                    {/* Section 3.1: Excess Loads - Light Blue Container */}
                    <div className="rounded-lg p-3 sm:p-4 md:p-6 mb-4 sm:mb-6" style={{ backgroundColor: "#C4D7F0" }}>
                      <div className="flex items-center mb-4">
                        <div className="w-10 h-10 rounded-full flex items-center justify-center text-white font-bold text-sm mr-4" style={{ backgroundColor: "#041A44" }}>
                          3.1
                        </div>
                        <h1 className="text-xl font-bold" style={{ color: "#041A44", fontFamily: "Inter, sans-serif", fontWeight: 700, fontSize: "20px" }}>
                          Excess Loads
                        </h1>
                      </div>
                      <p className="mb-0" style={{ color: "#041A44", fontFamily: "Inter, sans-serif", fontWeight: 400, fontSize: "15px", lineHeight: 1.6, textAlign: "justify" }}>
                        Par, 123 of the Manual of Regulations also states that "Students in the graduating class.. may be permitted a load of three units in college in excess of the regular load without prior approval of the CHED".
                      </p>
                    </div>

                    {/* Section 3.2: Sequence of Subjects - Light Blue Container */}
                    <div className="rounded-lg p-3 sm:p-4 md:p-6 mb-4 sm:mb-6" style={{ backgroundColor: "#C4D7F0" }}>
                      <div className="flex items-center mb-4">
                        <div className="w-10 h-10 rounded-full flex items-center justify-center text-white font-bold text-sm mr-4" style={{ backgroundColor: "#041A44" }}>
                          3.2
                        </div>
                        <h1 className="text-xl font-bold" style={{ color: "#041A44", fontFamily: "Inter, sans-serif", fontWeight: 700, fontSize: "20px" }}>
                          Sequence of Subjects
                        </h1>
                      </div>
                      <p className="mb-0" style={{ color: "#041A44", fontFamily: "Inter, sans-serif", fontWeight: 400, fontSize: "15px", lineHeight: 1.6, textAlign: "justify" }}>
                        Advance subjects should not be assigned to the student unless he has already passed the pre-requisites to these subjects. Par. 154 of the Manual of Regulations for private schools states that 'No student should be permitted to take any subject until he has satisfactorily passed the pre-requisite subject/s.'
                      </p>
                    </div>

                    {/* Section 3.3: Religious Education - Light Blue Container */}
                    <div className="rounded-lg p-3 sm:p-4 md:p-6 mb-4 sm:mb-6" style={{ backgroundColor: "#C4D7F0" }}>
                      <div className="flex items-center mb-4">
                        <div className="w-10 h-10 rounded-full flex items-center justify-center text-white font-bold text-sm mr-4" style={{ backgroundColor: "#041A44" }}>
                          3.3
                        </div>
                        <h1 className="text-xl font-bold" style={{ color: "#041A44", fontFamily: "Inter, sans-serif", fontWeight: 700, fontSize: "20px" }}>
                          Religious Education
                        </h1>
                      </div>
                      <p className="mb-0" style={{ color: "#041A44", fontFamily: "Inter, sans-serif", fontWeight: 400, fontSize: "15px", lineHeight: 1.6, textAlign: "justify" }}>
                        In addition to the regular study load, every student is required to earn fifteen (15) units in Religious Education. Campaigning for other religious beliefs is not allowed.
                      </p>
                    </div>

                    {/* Section 3.4: NSTP - Light Blue Container */}
                    <div className="rounded-lg p-3 sm:p-4 md:p-6 mb-4 sm:mb-6" style={{ backgroundColor: "#C4D7F0" }}>
                      <div className="flex items-center mb-4">
                        <div className="w-10 h-10 rounded-full flex items-center justify-center text-white font-bold text-sm mr-4" style={{ backgroundColor: "#041A44" }}>
                          3.4
                        </div>
                        <h1 className="text-xl font-bold" style={{ color: "#041A44", fontFamily: "Inter, sans-serif", fontWeight: 700, fontSize: "20px" }}>
                          NSTP
                        </h1>
                      </div>
                      <p className="mb-4" style={{ color: "#041A44", fontFamily: "Inter, sans-serif", fontWeight: 400, fontSize: "15px", lineHeight: 1.6, textAlign: "justify" }}>
                        All incoming students, male and female, enrolled in any baccalaureate and in at least two (2)-year technical-vocational or associate courses, are required to complete one (1) of the NSTP components of their choice, as graduation requirement.
                      </p>
                      <p className="mb-0" style={{ color: "#041A44", fontFamily: "Inter, sans-serif", fontWeight: 400, fontSize: "15px", lineHeight: 1.6, textAlign: "justify" }}>
                        Each of the NSTP components is to be taken for an academic period of two (2) semesters or one academic year.
                      </p>
                    </div>
                  </div>
                </>
              )}
            </div>
          )}

          {/* Section IV: Instructional Program / Policy On Refund and Payment of Fees */}
          {selectedSection === 4 && (
            <div className="w-full">
              {/* Section Header */}
              <div className="bg-white rounded-lg shadow-sm p-4 sm:p-6 md:p-8 mb-4 sm:mb-6 mt-4 sm:mt-6 md:mt-8" style={{ backgroundColor: "#041A44" }}>
                <div className="text-xs sm:text-sm mb-3 sm:mb-4 px-2 sm:px-3 py-1 bg-blue-100 text-blue-800 rounded-full inline-block" style={{ backgroundColor: "transparent", color: "white", border: "1px solid white" }}>
                  Section IV
                </div>
                <h2 className="text-base sm:text-xl md:text-2xl font-bold mb-3 sm:mb-4" style={{ color: "white", fontFamily: "Inter, sans-serif", fontWeight: 700 }}>
                  {isBasicEducation ? "INSTRUCTIONAL PROGRAM" : "POLICY ON REFUND AND PAYMENT OF FEES"}
                </h2>
                <p className="text-gray-600 mb-0 text-[10px] sm:text-sm md:text-base" style={{ color: "white", fontFamily: "Inter, sans-serif", fontWeight: 400 }}>
                  {isBasicEducation ? "Covers the curriculum and learning structure" : "Guidelines for fee refunds and payment policies"}
                </p>
              </div>

              {isBasicEducation ? (
                <div className="rounded-lg shadow-sm p-4 sm:p-6 md:p-8 mb-4 sm:mb-6" style={{ backgroundColor: "#FFFFFF" }}>
                  {/* A. Curriculum Overview - Light Blue Container */}
                  <div className="rounded-lg p-5 mb-6" style={{ backgroundColor: "#C4D7F0" }}>
                    <div className="flex items-start">
                      <div className="w-10 h-10 rounded-full flex items-center justify-center font-bold mr-4 flex-shrink-0" style={{ backgroundColor: "#041A44", fontFamily: "Inter, sans-serif", fontWeight: 700, color: "white", fontSize: "14px" }}>
                        A
                      </div>
                      <div className="flex-1">
                        <p className="font-normal leading-relaxed" style={{ color: "#041A44", fontFamily: "Inter, sans-serif", fontWeight: 400, lineHeight: 1.6, fontSize: "13px", textAlign: "justify" }}>
                          Consolatrix College Of Toledo City, Inc. curriculum guided by the Core values of the institution, aims to provide Instructional programs that will transform young men and women to become globally competitive 21st century learners. The curriculum is designed to reinforce the development of the 4Cs of 21st Century (Communication, Collaboration, Critical Thinking and Creativity) among its students with Christian values so that they will become conscientious citizens of this world.<br /><br />
                          
                          Social responsibility and awareness are strong values being emphasized in each area of learning through each practical and real-world application of skills and understanding.<br /><br />
                          
                          The curriculum is geared towards forming the students to become key people of the future who are equipped with media and information technology literacy which is necessary to respond to the globalizing trend of continued development and innovations with strong foundations of Christian Faith, Service, and Communion in Augustinian Recollect Spirituality.<br /><br />
                          
                          However, while the focus is on Christian Living, other disciplines such as Science, Mathematics, English, Filipino, Social Studies, Music & Arts, Physical Education & Health, TLE and Computer are also given ample importance to achieve a holistic and well-rounded formation of the students.<br /><br />
                          
                          The school also provides co-curricular activities to develop the physical, social, and artistic interest of the students. In terms of instruction and assessments, all teachers are enjoined to employ learner-centered and experiential approaches to maximize the potentials of every student. All learning processes shall accord prime focus to having the students learn and inspiring them to yearn for learning and be lifelong learners through discovery learning models and problem-based learning models.<br /><br />
                          
                          The teachers shall have the students engage in authentic assessment processes to aptly gauge their progress and development thus making the entire learning process truly relevant to and reflective of the students' capabilities, interests, and needs as young people even in online distance learning.
                        </p>
                      </div>
                    </div>
                  </div>
                  
                  {/* B. K-12 Curriculum Program - Light Blue Container */}
                  <div className="rounded-lg p-5 mb-6" style={{ backgroundColor: "#C4D7F0" }}>
                    <div className="flex items-start">
                      <div className="w-10 h-10 rounded-full flex items-center justify-center font-bold mr-4 flex-shrink-0" style={{ backgroundColor: "#041A44", fontFamily: "Inter, sans-serif", fontWeight: 700, color: "white", fontSize: "14px" }}>
                        B
                      </div>
                      <div className="flex-1">
                        <p className="font-normal leading-relaxed" style={{ color: "#041A44", fontFamily: "Inter, sans-serif", fontWeight: 400, lineHeight: 1.6, fontSize: "13px", textAlign: "justify" }}>
                          <strong>k-12 Curriculum Program</strong><br /><br />
                          
                          Consolatrix College Of Toledo City, Inc. has adapted the Department of Education's Enhanced Basic Education Curriculum otherwise known as the K-12 Curriculum. The school utilizes the standards and competencies given by DepEd in each learning areas as guide in designing the content, aligning the instructional strategies and assessment methods in accordance to the curriculum.<br /><br />
                          
                          More so, the school also follows the basic education cycle provided by the K-12 curriculum, which includes a universal and mandatory Kindergarten, Grades 1-6 for Elementary, and 4 years of Junior High School, to further enhance the quality of learning in the Philippine educational system and achieve the curriculum exits provided by the K-12 curriculum, namely higher education, employment, entrepreneurship and middle skills development.
                        </p>
                      </div>
                    </div>
                  </div>
                  
                  {/* C. Learning Standards of Augustinian Recollects Curriculum Framework - Light Blue Container */}
                  <div className="rounded-lg p-5 mb-6" style={{ backgroundColor: "#C4D7F0" }}>
                    <div className="flex items-start">
                      <div className="w-10 h-10 rounded-full flex items-center justify-center font-bold mr-4 flex-shrink-0" style={{ backgroundColor: "#041A44", fontFamily: "Inter, sans-serif", fontWeight: 700, color: "white", fontSize: "14px" }}>
                        C
                      </div>
                      <div className="flex-1">
                        <p className="font-normal leading-relaxed" style={{ color: "#041A44", fontFamily: "Inter, sans-serif", fontWeight: 400, lineHeight: 1.6, fontSize: "13px", textAlign: "justify" }}>
                          <strong>Learning Standards of Augustinian Recollects Curriculum Framework</strong><br /><br />
                          
                          The Learning Standards of Augustinian Recollects (LSAR) is a curriculum framework developed by the Congregation of the Augustinian Recollect Sisters. It is based on the "Understanding by Design" model by Wiggins and McTighe. This framework aims to align curriculum standards, assessment methods, and instructional strategies to help learners acquire knowledge, understand meaning, and apply their learning in real-life situations.<br /><br />
                          
                          Consolatrix College of Toledo City (CCTC) uses this framework to integrate its Vision & Mission, Core Values, Graduate Attributes, and Catholic Teachings with the K-12 Curriculum standards. The LSAR serves as the primary desired outcome per quarter, guiding teachers to design authentic assessments through performance tasks and to identify learner-centered activities that support learners in achieving these outcomes.
                        </p>
                      </div>
                    </div>
                  </div>
                  
                  {/* D. Blended Learning Program - Light Blue Container */}
                  <div className="rounded-lg p-5 mb-6" style={{ backgroundColor: "#C4D7F0" }}>
                    <div className="flex items-start">
                      <div className="w-10 h-10 rounded-full flex items-center justify-center font-bold mr-4 flex-shrink-0" style={{ backgroundColor: "#041A44", fontFamily: "Inter, sans-serif", fontWeight: 700, color: "white", fontSize: "14px" }}>
                        D
                      </div>
                      <div className="flex-1">
                        <p className="font-normal leading-relaxed" style={{ color: "#041A44", fontFamily: "Inter, sans-serif", fontWeight: 400, lineHeight: 1.6, fontSize: "13px", textAlign: "justify" }}>
                          <strong>Blended Learning Program</strong><br /><br />
                          
                          The Blended Learning Program at Consolatrix College of Toledo City, Inc. (CCTC) is guided by the LSAR Curriculum Framework. This program enables teachers to engage learners both face-to-face and online. This is facilitated through a Learning Management System and Video Conferencing Tools, supporting both synchronous and asynchronous sessions.<br /><br />
                          
                          Specifically, CCTC learners participate in face-to-face and asynchronous learning with their teachers via the Aralinks Learning Management System. Independent learning activities are scheduled for asynchronous sessions every Friday. Learners have options for completing these activities—online, digitally, or using a textbook—with submissions made through ARALINKS. The duration of asynchronous sessions matches that of synchronous sessions, ensuring teachers are available for consultation and coaching when learners require it.
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              ) : (
                    <>
                      {/* Main White Container for All Section IV Content */}
                      <div className="rounded-lg shadow-sm p-4 sm:p-6 md:p-8 mb-4 sm:mb-6" style={{ backgroundColor: "#FFFFFF" }}>
                        {/* Manual of Regulations Section */}
                        <div className="flex items-start mb-3 sm:mb-4">
                          <div className="w-8 h-8 rounded-full flex items-center justify-center text-white font-bold text-sm mr-4 flex-shrink-0" style={{ backgroundColor: "#041A44" }}>
                            1
                          </div>
                          <h1 className="text-sm sm:text-lg md:text-xl font-bold flex-1" style={{ color: "#041A44", fontFamily: "Inter, sans-serif", fontWeight: 700 }}>Manual of Regulations for Private Schools</h1>
                        </div>
                        <p className="mb-4 sm:mb-6 text-xs sm:text-sm md:text-base" style={{ color: "#041A44", fontFamily: "Inter, sans-serif", fontWeight: 400, fontSize: "15px", lineHeight: 1.6, textAlign: "justify" }}>
                          Manual of Regulations for Private Schools states "when a student registers in a school, it is understood that he/she is enrolling for the entire semester for College course." A student who transfers or otherwise withdraws, in writing within two (2) weeks after the beginning of classes and who has already paid the pertinent tuition fees in full or for any length longer than one month may be charged <strong><u>10% of the total amount due to the term if he/she withdraws within the first week of classes, or 20% if within the second week of classes, regardless of whether or not he/she has actually attended classes.</u></strong> The student may be charged of all school fees in full if he/she withdraws any time after the second (2^*) week of classes. However, if the transfer or withdrawal is due to a justifiable reason, the student shall be charged of the pertinent fees only up to and including the last month.
                        </p>

                        {/* Second Light Blue Container */}
                        <div className="rounded-lg p-3 sm:p-4 md:p-6 mb-4 sm:mb-6" style={{ backgroundColor: "#C4D7F0" }}>
                          <div className="flex items-start mb-4">
                            <div className="rounded-full flex items-center justify-center text-white font-bold text-sm mr-4 flex-shrink-0" style={{ backgroundColor: "#041A44", width: "40px", height: "40px", minWidth: "40px", minHeight: "40px" }}>1.1</div>
                            <h2 className="text-sm sm:text-lg md:text-xl font-bold flex-1" style={{ color: "#041A44", fontFamily: "Inter, sans-serif", fontWeight: 700, textAlign: "justify" }}>Refund of Fees is made in the following conditions:</h2>
                          </div>
                          <p className="mb-0" style={{ color: "#041A44", fontFamily: "Inter, sans-serif", fontWeight: 400, fontSize: "15px", lineHeight: 1.6, textAlign: "justify" }}>
                            Should a student cancels his/her registration after having paid one (1) or more instalment/s, his/her withdrawal from the school does not relieve him/her the responsibility of settling the unpaid balance of his/her fees for the entire term, except when he/she drops out within the first (1) month of classes.
                          </p>
                        </div>

                        {/* Light Gray Container for Items */}
                        <div className="rounded-lg p-6 mb-0" style={{ backgroundColor: "#F1F3F8" }}>
                          {/* Title inside the container */}
                          <div className="flex items-start mb-6">
                            <div className="rounded-full flex items-center justify-center text-white font-bold text-sm mr-4 flex-shrink-0" style={{ backgroundColor: "#041A44", width: "40px", height: "40px", minWidth: "40px", minHeight: "40px" }}>1.1</div>
                            <h2 className="text-sm sm:text-base md:text-lg font-bold flex-1" style={{ color: "#041A44", fontFamily: "Inter, sans-serif", fontWeight: 700 }}>If a student, paying on installment basis, cancels his/her registration, adjustment of fees will be as follows:</h2>
                          </div>
                          
                          {/* Item 1 */}
                          <div className="rounded-lg p-6 mb-4" style={{ backgroundColor: "#C4D7F0" }}>
                            <div className="flex items-start">
                              <div className="rounded-full flex items-center justify-center text-white font-bold text-sm mr-4 flex-shrink-0" style={{ backgroundColor: "#041A44", width: "40px", height: "40px", minWidth: "40px", minHeight: "40px" }}>1</div>
                              <p className="mb-0" style={{ color: "#041A44", fontFamily: "Inter, sans-serif", fontWeight: 400, fontSize: "15px", lineHeight: 1.6, textAlign: "justify" }}>If a student has never attended classes, even for one (1) day, he/she will be charged only the registration fee in full.</p>
                            </div>
                          </div>
                          
                          {/* Item 2 */}
                          <div className="rounded-lg p-6 mb-4" style={{ backgroundColor: "#C4D7F0" }}>
                            <div className="flex items-start">
                              <div className="rounded-full flex items-center justify-center text-white font-bold text-sm mr-4 flex-shrink-0" style={{ backgroundColor: "#041A44", width: "40px", height: "40px", minWidth: "40px", minHeight: "40px" }}>2</div>
                              <p className="mb-0" style={{ color: "#041A44", fontFamily: "Inter, sans-serif", fontWeight: 400, fontSize: "15px", lineHeight: 1.6, textAlign: "justify" }}>If a student has attended classes, but withdraws in writing within the first (1) week of classes, he/she will be charged ten (10%) percent of the total amount due for the term, plus the registration fee in full.</p>
                            </div>
                          </div>
                          
                          {/* Item 3 */}
                          <div className="rounded-lg p-6 mb-4" style={{ backgroundColor: "#C4D7F0" }}>
                            <div className="flex items-start">
                              <div className="rounded-full flex items-center justify-center text-white font-bold text-sm mr-4 flex-shrink-0" style={{ backgroundColor: "#041A44", width: "40px", height: "40px", minWidth: "40px", minHeight: "40px" }}>3</div>
                              <p className="mb-0" style={{ color: "#041A44", fontFamily: "Inter, sans-serif", fontWeight: 400, fontSize: "15px", lineHeight: 1.6, textAlign: "justify" }}>If a student withdraws in writing within the second (2d) week of classes he/she will be charged twenty (20%) percent of the total amount due for the term, plus the registration fee in full</p>
                            </div>
                          </div>
                          
                          {/* Item 4 */}
                          <div className="rounded-lg p-6 mb-4" style={{ backgroundColor: "#C4D7F0" }}>
                            <div className="flex items-start">
                              <div className="rounded-full flex items-center justify-center text-white font-bold text-sm mr-4 flex-shrink-0" style={{ backgroundColor: "#041A44", width: "40px", height: "40px", minWidth: "40px", minHeight: "40px" }}>4</div>
                              <p className="mb-0" style={{ color: "#041A44", fontFamily: "Inter, sans-serif", fontWeight: 400, fontSize: "15px", lineHeight: 1.6, textAlign: "justify" }}>If a student withdraws in writing beyond the second (2) week of classes, he/she will be charged fifty (50%) percent of the total amount due for the term plus the registration fee in full.</p>
                            </div>
                          </div>
                          
                          {/* Item 5 */}
                          <div className="rounded-lg p-6 mb-0" style={{ backgroundColor: "#C4D7F0" }}>
                            <div className="flex items-start">
                              <div className="rounded-full flex items-center justify-center text-white font-bold text-sm mr-4 flex-shrink-0" style={{ backgroundColor: "#041A44", width: "40px", height: "40px", minWidth: "40px", minHeight: "40px" }}>5</div>
                              <p className="mb-0" style={{ color: "#041A44", fontFamily: "Inter, sans-serif", fontWeight: 400, fontSize: "15px", lineHeight: 1.6, textAlign: "justify" }}>If a student withdraws in writing after the fourth (4th) week of classes he/she will be charged the total amount due for the whole year.</p>
                            </div>
                          </div>
                        </div>
                      </div>
                    </>
                  )}
            </div>
          )}

          {/* Section V: Grading System / Scholarships and Financial Aid */}
          {selectedSection === 5 && (
            <div className="w-full">
              <div className="bg-white rounded-lg shadow-sm p-4 sm:p-6 md:p-8 mb-4 sm:mb-6 mt-4 sm:mt-6 md:mt-8" style={{ backgroundColor: "#041A44" }}>
                <div className="text-xs sm:text-sm mb-3 sm:mb-4 px-2 sm:px-3 py-1 bg-blue-100 text-blue-800 rounded-full inline-block" style={{ backgroundColor: "transparent", color: "white", border: "1px solid white" }}>
                  Section V
                </div>
                <h2 className="text-base sm:text-xl md:text-2xl font-bold mb-3 sm:mb-4" style={{ color: "white", fontFamily: "Inter, sans-serif", fontWeight: 700 }}>
                  {isBasicEducation ? "GRADING SYSTEM" : "SCHOLARSHIPS AND FINANCIAL AID"}
                </h2>
                <p className="text-gray-600 mb-0 text-[10px] sm:text-sm md:text-base" style={{ color: "white", fontFamily: "Inter, sans-serif", fontWeight: 400 }}>
                  {isBasicEducation ? "Explains how student performance is assessed" : "Complete guide to enrollment processes and requirements"}
                </p>
              </div>

              {isBasicEducation ? (
                <>
                  {/* Main White Container with all content */}
                  <div className="rounded-lg shadow-sm p-4 sm:p-6 md:p-8 mb-4 sm:mb-6" style={{ backgroundColor: "#FFFFFF" }}>
                    {/* Introduction Paragraphs */}
                    <div className="mb-6">
                      <p className="font-normal leading-relaxed mb-3" style={{ color: "#041A44", fontFamily: "Inter, sans-serif", fontWeight: 400, lineHeight: 1.6, fontSize: "13px" }}>
                        The attainment of learning outcomes as defined in the standards shall be the basis for the quality assurance of learning. It shall also be the focus of the written works and performance task and shall be the basis for the grading at the end of the instruction.
                      </p>
                      <p className="font-normal leading-relaxed mb-3" style={{ color: "#041A44", fontFamily: "Inter, sans-serif", fontWeight: 400, lineHeight: 1.6, fontSize: "13px" }}>
                        This grading system is based on DepEd Order 31, s. 2020 in the Interim Guidelines for Assessment and Grading in line with the Basic Education Learning Continuity Plan and DepEd Order 8, s. 2015.
                      </p>
                    </div>
                    
                    {/* A. Written Works and Performance Tasks - Light Blue Container */}
                    <div className="rounded-lg p-5 mb-6" style={{ backgroundColor: "#C4D7F0" }}>
                      <div className="flex items-start mb-4">
                        <div className="w-10 h-10 rounded-full flex items-center justify-center font-bold mr-4 flex-shrink-0" style={{ backgroundColor: "#041A44", fontFamily: "Inter, sans-serif", fontWeight: 700, color: "white", fontSize: "14px" }}>
                          A
                        </div>
                        <h2 className="font-bold flex-1 leading-10" style={{ color: "#041A44", fontSize: "15px", fontFamily: "Inter, sans-serif", fontWeight: 700 }}>
                          Written Works and Performance Tasks
                        </h2>
                      </div>
                      <div className="bg-white rounded-lg p-3 shadow-sm">
                        <p className="font-normal leading-relaxed mb-4" style={{ color: "#041A44", fontFamily: "Inter, sans-serif", fontWeight: 400, lineHeight: 1.3, fontSize: "13px" }}>
                          Learners are graded on Written Works and Performance tasks every quarter. There are four quarters in a year. There are four (4) minimum written works and articulated performance tasks across different subjects in a quarter.
                        </p>
                        
                        <h3 className="font-bold mb-2" style={{ color: "#041A44", fontFamily: "Inter, sans-serif", fontWeight: 700, fontSize: "15px" }}>
                          1. Written Works
                        </h3>
                        <p className="font-normal leading-relaxed mb-4" style={{ color: "#041A44", fontFamily: "Inter, sans-serif", fontWeight: 400, lineHeight: 1.3, fontSize: "13px" }}>
                          Written works shall be administered to asses acquisition of knowledge and meaning making through written outputs and one quarterly exam. Our Learning Program highlights high-integrity assessment to ensure that the assessment outputs reflect the true performance of the learners.
                        </p>
                        
                        <h3 className="font-bold mb-2" style={{ color: "#041A44", fontFamily: "Inter, sans-serif", fontWeight: 700, fontSize: "15px" }}>
                          2. Performance Task
                        </h3>
                        <p className="font-normal leading-relaxed" style={{ color: "#041A44", fontFamily: "Inter, sans-serif", fontWeight: 400, lineHeight: 1.3, fontSize: "13px" }}>
                          Performance tasks refer to assessment task that allow learners to show what they know and are able to do in diverse ways. They may create or innovate products or do performance-based task (including) skill demonstration, group presentations, oral work, multimedia presentation, and research projects. It is important to note that the written outputs may also be considered as performance task.
                        </p>
                      </div>
                    </div>
                    
                    {/* B. GRADING SYSTEM - Light Blue Container */}
                    <div className="rounded-lg p-5 mb-6" style={{ backgroundColor: "#C4D7F0" }}>
                      <div className="flex items-center mb-4">
                        <div className="w-10 h-10 rounded-full flex items-center justify-center font-bold mr-4 flex-shrink-0" style={{ backgroundColor: "#041A44", fontFamily: "Inter, sans-serif", fontWeight: 700, color: "white", fontSize: "14px" }}>
                          B
                        </div>
                        <h2 className="font-bold flex-1 leading-10" style={{ color: "#041A44", fontSize: "15px", fontFamily: "Inter, sans-serif", fontWeight: 700 }}>
                          GRADING SYSTEM
                        </h2>
                      </div>
                      <div className="ml-14">
                        <div className="font-normal leading-relaxed" style={{ color: "#041A44", fontFamily: "Inter, sans-serif", fontWeight: 400, lineHeight: 1.6, fontSize: "13px" }}>
                          <p className="mb-3">
                            <strong>1. For Kindergarten:</strong><br />
                            a. Checklists and anecdotal records are used instead of numerical grades. This is called Early Childhood Care and Development (ECCD). These is based on learning standards found in the Kindergarten curriculum guide.
                          </p>
                          
                          <p className="mb-4">
                            <strong>2. Grade 1-10:</strong>
                          </p>
                          
                          <div className="bg-white rounded-lg p-4 my-4">
                            <h4 className="font-bold mb-3" style={{ color: "#041A44", fontFamily: "Inter, sans-serif", fontWeight: 700, fontSize: "13px" }}>
                              Table 1: Weight Distribution of the Summative Assessment Components per Learning Area for Grade 1 to grade 10
                            </h4>
                            <div className="overflow-x-auto">
                              <table className="w-full border-collapse" style={{ border: "2px solid #041A44" }}>
                                <thead>
                                  <tr style={{ backgroundColor: "#f8f9fa" }}>
                                    <th className="px-3 py-2 text-left" rowSpan={2} style={{ fontSize: "12px", color: "#041A44", fontFamily: "Inter, sans-serif", fontWeight: 700, border: "1px solid #041A44" }}>
                                      Assessment Components
                                    </th>
                                    <th className="px-3 py-2 text-center" colSpan={3} style={{ fontSize: "12px", color: "#041A44", fontFamily: "Inter, sans-serif", fontWeight: 700, border: "1px solid #041A44" }}>
                                      Weights
                                    </th>
                                  </tr>
                                  <tr style={{ backgroundColor: "#f8f9fa" }}>
                                    <th className="px-3 py-2 text-center" style={{ fontSize: "12px", color: "#041A44", fontFamily: "Inter, sans-serif", fontWeight: 700, border: "1px solid #041A44" }}>
                                      Languages/AP/EsP
                                    </th>
                                    <th className="px-3 py-2 text-center" style={{ fontSize: "12px", color: "#041A44", fontFamily: "Inter, sans-serif", fontWeight: 700, border: "1px solid #041A44" }}>
                                      Science/Math
                                    </th>
                                    <th className="px-3 py-2 text-center" style={{ fontSize: "12px", color: "#041A44", fontFamily: "Inter, sans-serif", fontWeight: 700, border: "1px solid #041A44" }}>
                                      MAPEH/EPP/TLE
                                    </th>
                                  </tr>
                                </thead>
                                <tbody>
                                  <tr>
                                    <td className="px-3 py-2" style={{ fontSize: "12px", color: "#041A44", border: "1px solid #041A44" }}>
                                      Written Works
                                    </td>
                                    <td className="px-3 py-2 text-center" style={{ fontSize: "12px", color: "#041A44", border: "1px solid #041A44" }}>
                                      40%
                                    </td>
                                    <td className="px-3 py-2 text-center" style={{ fontSize: "12px", color: "#041A44", border: "1px solid #041A44" }}>
                                      50%
                                    </td>
                                    <td className="px-3 py-2 text-center" style={{ fontSize: "12px", color: "#041A44", border: "1px solid #041A44" }}>
                                      30%
                                    </td>
                                  </tr>
                                  <tr>
                                    <td className="px-3 py-2" style={{ fontSize: "12px", color: "#041A44", border: "1px solid #041A44" }}>
                                      Performance Tasks
                                    </td>
                                    <td className="px-3 py-2 text-center" style={{ fontSize: "12px", color: "#041A44", border: "1px solid #041A44" }}>
                                      60%
                                    </td>
                                    <td className="px-3 py-2 text-center" style={{ fontSize: "12px", color: "#041A44", border: "1px solid #041A44" }}>
                                      50%
                                    </td>
                                    <td className="px-3 py-2 text-center" style={{ fontSize: "12px", color: "#041A44", border: "1px solid #041A44" }}>
                                      70%
                                    </td>
                                  </tr>
                                </tbody>
                              </table>
                            </div>
                          </div>
                          
                          <p className="mt-4">
                            The transmutation table, which is Appendix B in DepEd Order No. 8, s. 2015 shall still be used in the grading system. The guidelines on learner's progress report, as well as promotion and retention shall likewise follow the previous cited in the said policy. The passing grade in all quarters and in the general weighted average is 75.
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                </>
              ) : (
                    <>
                      {/* Main White Container for All Section V Content */}
                      <div className="rounded-lg shadow-sm p-4 mb-6" style={{ backgroundColor: "#FFFFFF" }}>
                        {/* Section 1: General Scholarship Policies - Outside Blue Container */}
                        <div className="flex items-center mb-3">
                          <div className="rounded-full flex items-center justify-center text-white font-bold text-sm mr-6" style={{ width: "40px", height: "40px", minWidth: "40px", backgroundColor: "#041A44" }}>1</div>
                          <h2 className="text-base sm:text-lg md:text-xl font-bold" style={{ color: "#041A44", fontFamily: "Inter, sans-serif", fontWeight: 700 }}>General Scholarship Policies</h2>
                        </div>
                        <p className="mb-4" style={{ color: "#041A44", fontFamily: "Inter, sans-serif", fontWeight: 400, fontSize: "15px", lineHeight: 1.6, textAlign: "justify" }}>Academic entrance requirements vary with the status of the prospective student, the program in which he/she desires to enroll. Consolatrix College reserves the right not to accept any applicant whose qualifications do not meet the standards and requirements of the program in which he/she desires to enroll.</p>
                        
                        {/* Policy 1 - Individual Blue Container */}
                        <div className="rounded-lg p-4 mb-4" style={{ backgroundColor: "#C4D7F0" }}>
                          <div className="flex items-start">
                            <div className="rounded-full flex items-center justify-center text-white font-bold text-sm mr-4 flex-shrink-0" style={{ width: "40px", height: "40px", minWidth: "40px", backgroundColor: "#041A44" }}>1</div>
                            <p className="mb-0" style={{ color: "#041A44", fontFamily: "Inter, sans-serif", fontWeight: 400, fontSize: "15px", lineHeight: 1.6, textAlign: "justify" }}>A student can only avail one scholarship granted by the school.</p>
                          </div>
                        </div>
                        
                        {/* Policy 2 - Individual Blue Container */}
                        <div className="rounded-lg p-4 mb-4" style={{ backgroundColor: "#C4D7F0" }}>
                          <div className="flex items-start">
                            <div className="rounded-full flex items-center justify-center text-white font-bold text-sm mr-4 flex-shrink-0" style={{ width: "40px", height: "40px", minWidth: "40px", backgroundColor: "#041A44" }}>2</div>
                            <p className="mb-0" style={{ color: "#041A44", fontFamily: "Inter, sans-serif", fontWeight: 400, fontSize: "15px", lineHeight: 1.6, textAlign: "justify" }}>For academic scholarship, the school will send an e-mail to the parents at the end of the school year stating that their son/daughter is qualified as an academic scholar.</p>
                          </div>
                        </div>
                        
                        {/* Policy 3 - Individual Blue Container */}
                        <div className="rounded-lg p-4 mb-4" style={{ backgroundColor: "#C4D7F0" }}>
                          <div className="flex items-start">
                            <div className="rounded-full flex items-center justify-center text-white font-bold text-sm mr-4 flex-shrink-0" style={{ width: "40px", height: "40px", minWidth: "40px", backgroundColor: "#041A44" }}>3</div>
                            <p className="mb-0" style={{ color: "#041A44", fontFamily: "Inter, sans-serif", fontWeight: 400, fontSize: "15px", lineHeight: 1.6, textAlign: "justify" }}>For brothers & sisters Tuition Fee Discount, parents will fill-out a form and submit it to the Registrar's Office.</p>
                          </div>
                        </div>
                        
                        {/* Policy 4 - Individual Blue Container */}
                        <div className="rounded-lg p-4 mb-4" style={{ backgroundColor: "#C4D7F0" }}>
                          <div className="flex items-start">
                            <div className="rounded-full flex items-center justify-center text-white font-bold text-sm mr-4 flex-shrink-0" style={{ width: "40px", height: "40px", minWidth: "40px", backgroundColor: "#041A44" }}>4</div>
                            <p className="mb-0" style={{ color: "#041A44", fontFamily: "Inter, sans-serif", fontWeight: 400, fontSize: "15px", lineHeight: 1.6, textAlign: "justify" }}>For Talangpaz Scholarship, an application with resume is required to those who apply scholarship grants in triplicate copies.</p>
                          </div>
                        </div>
                        
                        {/* Policy 5 - Individual Blue Container */}
                        <div className="rounded-lg p-4 mb-0" style={{ backgroundColor: "#C4D7F0" }}>
                          <div className="flex items-start">
                            <div className="rounded-full flex items-center justify-center text-white font-bold text-sm mr-4 flex-shrink-0" style={{ width: "40px", height: "40px", minWidth: "40px", backgroundColor: "#041A44" }}>5</div>
                            <p className="mb-0" style={{ color: "#041A44", fontFamily: "Inter, sans-serif", fontWeight: 400, fontSize: "15px", lineHeight: 1.6, textAlign: "justify" }}>For the Permanent Employee's Children Tuition Fee Discount and AR Sister's siblings nephews/nieces Tuition Fee Discount, a form must be accomplished and submitted to the Administration Office.</p>
                          </div>
                        </div>
                      </div>

                      {/* Second White Container for Academic Scholarship */}
                      <div className="rounded-lg shadow-sm p-4 mb-6" style={{ backgroundColor: "#FFFFFF" }}>
                        {/* Section 1: Academic Scholarship - Outside Blue Container */}
                        <div className="flex items-center mb-3">
                          <div className="rounded-full flex items-center justify-center text-white font-bold text-sm mr-6" style={{ width: "40px", height: "40px", minWidth: "40px", backgroundColor: "#041A44" }}>1</div>
                          <h2 className="text-xl font-bold" style={{ color: "#041A44", fontFamily: "Inter, sans-serif", fontWeight: 700, fontSize: "20px" }}>Academic Scholarship</h2>
                        </div>
                        
                        {/* Light Blue Container for Content */}
                        <div className="rounded-lg p-4 mb-3" style={{ backgroundColor: "#C4D7F0" }}>
                          <h3 className="text-lg font-bold mb-3" style={{ color: "#041A44", fontFamily: "Inter, sans-serif", fontWeight: 700, fontSize: "18px" }}>For Freshmen</h3>
                          <p className="mb-3" style={{ color: "#041A44", fontFamily: "Inter, sans-serif", fontWeight: 400, fontSize: "15px", lineHeight: 1.6, textAlign: "justify" }}>This scholarship is given to freshmen who have obtained honors as rank:</p>
                          <p className="mb-3" style={{ color: "#041A44", fontFamily: "Inter, sans-serif", fontWeight: 400, fontSize: "15px", lineHeight: 1.6, textAlign: "justify" }}>a. First and Second in the Academic Excellence Award or <strong>"With Highest Honors" (98-100%)</strong> and/or</p>
                          <p className="mb-3" style={{ color: "#041A44", fontFamily: "Inter, sans-serif", fontWeight: 400, fontSize: "15px", lineHeight: 1.6, textAlign: "justify" }}>b. <strong>"With High Honors" (95-97%)</strong> if there are no qualified "With Highest Honors".</p>
                          <p className="mb-3 italic" style={{ color: "#041A44", fontFamily: "Inter, sans-serif", fontWeight: 400, fontSize: "15px", lineHeight: 1.6, textAlign: "justify" }}>*NB: Students who got the Academic Excellence Award of <strong>"With Honors (90-94%)</strong> do <strong>not qualify</strong> for this scholarship, regardless of the rank.</p>
                          <p className="mb-0" style={{ color: "#041A44", fontFamily: "Inter, sans-serif", fontWeight: 400, fontSize: "15px", lineHeight: 1.6, textAlign: "justify" }}>The rank first among <strong>"With Highest Honors" (98-100%)</strong> and/or <strong>"With High Honors" (95-97%)</strong> will be granted <strong>100% free tuition fee</strong> and rank second will be <strong>50% free tuition fee</strong>.</p>
                        </div>

                        {/* Examples Section - White Container */}
                        <div className="rounded-lg p-4 mb-3" style={{ backgroundColor: "#FFFFFF", border: "1px solid #E5E7EB" }}>
                          <h3 className="text-sm sm:text-lg font-bold mb-3" style={{ color: "#041A44", fontFamily: "Inter, sans-serif", fontWeight: 700 }}>Examples:</h3>
                          <div className="space-y-2">
                            <div className="border-b border-gray-300 pb-2">
                              <div className="grid grid-cols-3 gap-2 sm:gap-3 md:gap-4">
                                <div className="font-bold text-xs sm:text-sm md:text-base" style={{ color: "#041A44", fontFamily: "Inter, sans-serif", fontWeight: 700 }}>SCHOLAR A:</div>
                                <div className="text-center text-xs sm:text-sm md:text-base" style={{ color: "#4B5563", fontFamily: "Inter, sans-serif", fontWeight: 400 }}>With Highest Honors <strong style={{ color: "#041A44" }}>Rank 1</strong></div>
                                <div className="text-right text-xs sm:text-sm md:text-base" style={{ color: "#4B5563", fontFamily: "Inter, sans-serif", fontWeight: 400 }}>100% free tuition fee</div>
                              </div>
                            </div>
                            <div className="border-b border-gray-300 pb-2">
                              <div className="grid grid-cols-3 gap-2 sm:gap-3 md:gap-4">
                                <div className="font-bold text-xs sm:text-sm md:text-base" style={{ color: "#041A44", fontFamily: "Inter, sans-serif", fontWeight: 700 }}>SCHOLAR B:</div>
                                <div className="text-center text-xs sm:text-sm md:text-base" style={{ color: "#4B5563", fontFamily: "Inter, sans-serif", fontWeight: 400 }}>With Highest Honors <strong style={{ color: "#041A44" }}>Rank 2</strong></div>
                                <div className="text-right text-xs sm:text-sm md:text-base" style={{ color: "#4B5563", fontFamily: "Inter, sans-serif", fontWeight: 400 }}>50% free tuition fee or</div>
                              </div>
                              <div className="grid grid-cols-3 gap-2 sm:gap-3 md:gap-4 mt-1">
                                <div></div>
                                <div className="text-center text-xs sm:text-sm md:text-base" style={{ color: "#4B5563", fontFamily: "Inter, sans-serif", fontWeight: 400 }}>With High Honors <strong style={{ color: "#041A44" }}>Rank 2</strong></div>
                                <div className="text-right text-xs sm:text-sm md:text-base" style={{ color: "#4B5563", fontFamily: "Inter, sans-serif", fontWeight: 400 }}>50% free tuition fee</div>
                              </div>
                            </div>
                            <div className="border-b border-gray-300 pb-2">
                              <div className="grid grid-cols-3 gap-2 sm:gap-3 md:gap-4">
                                <div className="font-bold text-xs sm:text-sm md:text-base" style={{ color: "#041A44", fontFamily: "Inter, sans-serif", fontWeight: 700 }}>SCHOLAR A:</div>
                                <div className="text-center text-xs sm:text-sm md:text-base" style={{ color: "#4B5563", fontFamily: "Inter, sans-serif", fontWeight: 400 }}>With High Honors <strong style={{ color: "#041A44" }}>Rank 1</strong></div>
                                <div className="text-right text-xs sm:text-sm md:text-base" style={{ color: "#4B5563", fontFamily: "Inter, sans-serif", fontWeight: 400 }}>100% free tuition fee</div>
                              </div>
                            </div>
                            <div className="pb-0">
                              <div className="grid grid-cols-3 gap-2 sm:gap-3 md:gap-4">
                                <div className="font-bold text-xs sm:text-sm md:text-base" style={{ color: "#041A44", fontFamily: "Inter, sans-serif", fontWeight: 700 }}>SCHOLAR B:</div>
                                <div className="text-center text-xs sm:text-sm md:text-base" style={{ color: "#4B5563", fontFamily: "Inter, sans-serif", fontWeight: 400 }}>With High Honors <strong style={{ color: "#041A44" }}>Rank 2</strong></div>
                                <div className="text-right text-xs sm:text-sm md:text-base" style={{ color: "#4B5563", fontFamily: "Inter, sans-serif", fontWeight: 400 }}>50% free tuition fee</div>
                              </div>
                            </div>
                          </div>
                        </div>

                        {/* Certification Requirement Box - Light Blue Container */}
                        <div className="rounded-lg p-4 mb-0" style={{ backgroundColor: "#C4D7F0" }}>
                          <p className="mb-0" style={{ color: "#041A44", fontFamily: "Inter, sans-serif", fontWeight: 400, fontSize: "15px", lineHeight: 1.6, textAlign: "justify" }}>The applicant should present a certification from the school principal indicating that the student applicant is rank 1 or 2 of the entire graduates and his/her average grade.</p>
                        </div>
                      </div>

                      {/* Third White Container for Sibling Tuition Fee Discount */}
                      <div className="rounded-lg shadow-sm p-2 sm:p-4 mb-4 sm:mb-6" style={{ backgroundColor: "#FFFFFF" }}>
                        {/* Section 1.1: Sibling Tuition Fee Discount Scheme */}
                        <div className="flex items-center mb-3 sm:mb-4">
                          <div className="rounded-full flex items-center justify-center text-white font-bold text-xs sm:text-sm mr-3 sm:mr-6" style={{ width: "40px", height: "40px", minWidth: "40px", backgroundColor: "#041A44" }}>1.1</div>
                          <h2 className="text-base sm:text-lg md:text-xl font-bold" style={{ color: "#041A44", fontFamily: "Inter, sans-serif", fontWeight: 700 }}>Sibling Tuition Fee Discount Scheme</h2>
                        </div>
                        
                        {/* Two Column Layout for Discounts */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-2 sm:gap-3">
                          {/* Left Column */}
                          <div className="space-y-1.5 sm:space-y-2">
                            <div className="rounded-lg p-2 sm:p-3" style={{ backgroundColor: "#C4D7F0" }}>
                              <div className="flex items-start">
                                <span className="w-2 h-2 rounded-full mt-1.5 sm:mt-2 mr-2 sm:mr-3 flex-shrink-0" style={{ backgroundColor: "#041A44" }}></span>
                                <p className="mb-0 text-xs sm:text-sm md:text-base" style={{ color: "#041A44", fontFamily: "Inter, sans-serif", fontWeight: 400, lineHeight: 1.6, textAlign: "justify" }}>3rd child - 25% discount on tuition fee</p>
                              </div>
                            </div>
                            <div className="rounded-lg p-2 sm:p-3" style={{ backgroundColor: "#C4D7F0" }}>
                              <div className="flex items-start">
                                <span className="w-2 h-2 rounded-full mt-1.5 sm:mt-2 mr-2 sm:mr-3 flex-shrink-0" style={{ backgroundColor: "#041A44" }}></span>
                                <p className="mb-0 text-xs sm:text-sm md:text-base" style={{ color: "#041A44", fontFamily: "Inter, sans-serif", fontWeight: 400, lineHeight: 1.6, textAlign: "justify" }}>4th child - 50% discount on tuition fee</p>
                              </div>
                            </div>
                          </div>
                          
                          {/* Right Column */}
                          <div className="space-y-1.5 sm:space-y-2">
                            <div className="rounded-lg p-2 sm:p-3" style={{ backgroundColor: "#C4D7F0" }}>
                              <div className="flex items-start">
                                <span className="w-2 h-2 rounded-full mt-1.5 sm:mt-2 mr-2 sm:mr-3 flex-shrink-0" style={{ backgroundColor: "#041A44" }}></span>
                                <p className="mb-0 text-xs sm:text-sm md:text-base" style={{ color: "#041A44", fontFamily: "Inter, sans-serif", fontWeight: 400, lineHeight: 1.6, textAlign: "justify" }}>5th child - 75% discount on tuition fee</p>
                              </div>
                            </div>
                            <div className="rounded-lg p-2 sm:p-3" style={{ backgroundColor: "#C4D7F0" }}>
                              <div className="flex items-start">
                                <span className="w-2 h-2 rounded-full mt-1.5 sm:mt-2 mr-2 sm:mr-3 flex-shrink-0" style={{ backgroundColor: "#041A44" }}></span>
                                <p className="mb-0 text-xs sm:text-sm md:text-base" style={{ color: "#041A44", fontFamily: "Inter, sans-serif", fontWeight: 400, lineHeight: 1.6, textAlign: "justify" }}>6th and Last Child - Free tuition fee</p>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* Fourth White Container for Talangpaz and Service Scholarship */}
                      <div className="rounded-lg shadow-sm p-4 mb-6" style={{ backgroundColor: "#FFFFFF" }}>
                        {/* Section 1.2: Talangpaz and Service Scholarship */}
                        <div className="flex items-center mb-3">
                          <div className="rounded-full flex items-center justify-center text-white font-bold text-sm mr-6" style={{ width: "40px", height: "40px", minWidth: "40px", backgroundColor: "#041A44" }}>1.2</div>
                          <h2 className="text-xl font-bold" style={{ color: "#041A44", fontFamily: "Inter, sans-serif", fontWeight: 700, fontSize: "20px" }}>Talangpaz and Service Scholarship</h2>
                        </div>
                        <p className="mb-4" style={{ color: "#041A44", fontFamily: "Inter, sans-serif", fontWeight: 400, fontSize: "15px", lineHeight: 1.6, textAlign: "justify" }}>100% discount on Tuition Fee & Books for freshmen only.</p>
                        
                        <h3 className="text-lg font-bold mb-3" style={{ color: "#041A44", fontFamily: "Inter, sans-serif", fontWeight: 700, fontSize: "18px" }}>Requirements:</h3>
                        <div className="rounded-lg p-4" style={{ backgroundColor: "#C4D7F0" }}>
                          <ul className="space-y-2">
                            <li className="flex items-start text-xs sm:text-sm md:text-base" style={{ color: "#041A44", fontFamily: "Inter, sans-serif", fontWeight: 400, fontSize: "15px", textAlign: "justify" }}>
                              <span className="w-2 h-2 rounded-full mt-2 mr-3 flex-shrink-0" style={{ backgroundColor: "#041A44" }}></span>
                              <span>Poor but deserving student</span>
                            </li>
                            <li className="flex items-start text-xs sm:text-sm md:text-base" style={{ color: "#041A44", fontFamily: "Inter, sans-serif", fontWeight: 400, fontSize: "15px", textAlign: "justify" }}>
                              <span className="w-2 h-2 rounded-full mt-2 mr-3 flex-shrink-0" style={{ backgroundColor: "#041A44" }}></span>
                              <span>Academic performance (maintain a grade of 85% or higher)</span>
                            </li>
                            <li className="flex items-start text-xs sm:text-sm md:text-base" style={{ color: "#041A44", fontFamily: "Inter, sans-serif", fontWeight: 400, fontSize: "15px", textAlign: "justify" }}>
                              <span className="w-2 h-2 rounded-full mt-2 mr-3 flex-shrink-0" style={{ backgroundColor: "#041A44" }}></span>
                              <span>Home visitation is encouraged for validation before acceptance.</span>
                            </li>
                          </ul>
                        </div>
                      </div>

                      {/* Fifth White Container for CCTC Employee's Children */}
                      <div className="rounded-lg shadow-sm p-4 mb-6" style={{ backgroundColor: "#FFFFFF" }}>
                        {/* Section 1.3: CCTC permanent employee's children */}
                        <div className="flex items-center mb-4">
                          <div className="rounded-full flex items-center justify-center text-white font-bold text-sm mr-6" style={{ width: "40px", height: "40px", minWidth: "40px", backgroundColor: "#041A44" }}>1.3</div>
                          <h2 className="text-xl font-bold" style={{ color: "#041A44", fontFamily: "Inter, sans-serif", fontWeight: 700, fontSize: "20px" }}>CCTC permanent employee's children</h2>
                        </div>
                        
                        <div className="rounded-lg p-4" style={{ backgroundColor: "#C4D7F0" }}>
                          <p className="mb-0 text-center" style={{ color: "#041A44", fontFamily: "Inter, sans-serif", fontWeight: 400, fontSize: "15px", lineHeight: 1.6, textAlign: "justify" }}><strong>CCTC permanent employee's children</strong> enjoy 50% tuition fee discount</p>
                        </div>
                      </div>

                      {/* Sixth White Container for AR Sisters' siblings/nephews/nieces */}
                      <div className="rounded-lg shadow-sm p-4 mb-6" style={{ backgroundColor: "#FFFFFF" }}>
                        {/* Section 1.4: AR Sisters' siblings/nephews/nieces */}
                        <div className="flex items-center mb-4">
                          <div className="rounded-full flex items-center justify-center text-white font-bold text-sm mr-6" style={{ width: "40px", height: "40px", minWidth: "40px", backgroundColor: "#041A44" }}>1.4</div>
                          <h2 className="text-xl font-bold" style={{ color: "#041A44", fontFamily: "Inter, sans-serif", fontWeight: 700, fontSize: "20px" }}>AR Sisters' siblings/nephews/nieces</h2>
                        </div>
                        
                        <div className="rounded-lg p-4" style={{ backgroundColor: "#C4D7F0" }}>
                          <p className="mb-0 text-center" style={{ color: "#041A44", fontFamily: "Inter, sans-serif", fontWeight: 400, fontSize: "15px", lineHeight: 1.6, textAlign: "justify" }}><strong>AR Sisters' siblings/nephews/nieces</strong> enjoy 100% tuition fee discounts. when two or more nephews nieces are enrolled, the 100% will be divided to each one.</p>
                        </div>
                      </div>
                    </>
                  )}
            </div>
          )}

          {/* Section VI: Interventions and Remedial / Attendance and Absences */}
          {selectedSection === 6 && (
            <div className="w-full">
              {isBasicEducation ? (
                <>
                  {/* Section Header */}
                  <div className="bg-white rounded-lg shadow-sm p-4 sm:p-6 md:p-8 mb-4 sm:mb-6 mt-4 sm:mt-6 md:mt-8" style={{ backgroundColor: "#041A44" }}>
                    <div className="text-xs sm:text-sm mb-3 sm:mb-4 px-2 sm:px-3 py-1 bg-blue-100 text-blue-800 rounded-full inline-block" style={{ backgroundColor: "transparent", color: "white", border: "1px solid white" }}>
                      Section VI
                    </div>
                    <h2 className="text-base sm:text-xl md:text-2xl font-bold mb-3 sm:mb-4" style={{ color: "white", fontFamily: "Inter, sans-serif", fontWeight: 700 }}>
                      INTERVENTIONS AND REMEDIAL
                    </h2>
                    <p className="text-gray-600 mb-6" style={{ color: "white", fontSize: "15px", fontFamily: "Inter, sans-serif", fontWeight: 700 }}>
                      Assistance for academic improvement
                    </p>
                  </div>

                  {/* Main White Container with all content */}
                  <div className="rounded-lg shadow-sm p-4 sm:p-6 md:p-8 mb-4 sm:mb-6" style={{ backgroundColor: "#FFFFFF" }}>
                    {/* Light Blue Container for content */}
                    <div className="rounded-lg p-5 mb-6" style={{ backgroundColor: "#C4D7F0" }}>
                      <div className="space-y-1">
                        <p className="font-normal leading-relaxed" style={{ color: "#041A44", fontFamily: "Inter, sans-serif", fontWeight: 400, lineHeight: 1.4, fontSize: "13px", marginBottom: "12px" }}>
                          A learner who fails a set of competencies must immediately be given remedial classes. The learner must obtain a passing Remedial Class Mark (RCM) to be promoted to the next grade level if the learner fails the remedial classes, he/she must take the summer for subject/s failed.
                        </p>
                        
                        <p className="font-normal leading-relaxed" style={{ color: "#041A44", fontFamily: "Inter, sans-serif", fontWeight: 400, lineHeight: 1.6, fontSize: "13px", marginBottom: "12px" }}>
                          Written Works and Performance Tasks are also given during the remedial classes.
                        </p>
                        
                        <p className="font-normal leading-relaxed" style={{ color: "#041A44", fontFamily: "Inter, sans-serif", fontWeight: 400, lineHeight: 1.6, fontSize: "13px", marginBottom: "12px" }}>
                          These are recorded, computed, weighted, and transmuted in the same way as the Quarterly Grade. The equivalent of the Final Grade for remedial classes is the Remedial Class Mark (RCM). The final Grade at the end of the school year and the Remedial Class Mark are averaged. This results in the Recomputed Final Grade. If the Recomputed Final Grade is 75 or higher, the student is promoted to the next grade level. However, students will be retained in the grade level if their Recomputed Final Grade is below 75.
                        </p>
                        
                        <p className="font-normal leading-relaxed" style={{ color: "#041A44", fontFamily: "Inter, sans-serif", fontWeight: 400, lineHeight: 1.6, fontSize: "13px", marginBottom: "12px" }}>
                          The teacher of the remedial class issues the Certificate of Recomputed Final Grade, which is noted by the school principal. This is submitted to the division office and must be attached to both Form 137 and School Farm Number 5.
                        </p>
                        
                        <p className="font-normal leading-relaxed" style={{ color: "#041A44", fontFamily: "Inter, sans-serif", fontWeight: 400, lineHeight: 1.6, fontSize: "13px" }}>
                          The Learner con enroll in the next grade level for Grades 1-10 upon presentation of the Certificate of recomputed Final Grade. This certificate can be verified in the division offices as needed.
                        </p>
                      </div>
                    </div>
                  </div>
                </>
              ) : (
                <>
                  {/* Section Header */}
                  <div className="bg-white rounded-lg shadow-sm p-4 sm:p-6 md:p-8 mb-4 sm:mb-6 mt-4 sm:mt-6 md:mt-8" style={{ backgroundColor: "#041A44" }}>
                    <div className="text-xs sm:text-sm mb-3 sm:mb-4 px-2 sm:px-3 py-1 bg-blue-100 text-blue-800 rounded-full inline-block" style={{ backgroundColor: "transparent", color: "white", border: "1px solid white" }}>
                      Section VI
                    </div>
                    <h2 className="text-base sm:text-xl md:text-2xl font-bold mb-3 sm:mb-4" style={{ color: "white", fontFamily: "Inter, sans-serif", fontWeight: 700 }}>
                      ATTENDANCE AND ABSENCES
                    </h2>
                    <p className="text-gray-600 mb-0 text-[10px] sm:text-sm md:text-base" style={{ color: "white", fontFamily: "Inter, sans-serif", fontWeight: 400 }}>
                      Policies regarding attendance and absence management
                    </p>
                  </div>

                  {/* Main White Container for All Section VI Content */}
                  <div className="rounded-lg shadow-sm p-4 sm:p-6 md:p-8 mb-4 sm:mb-6" style={{ backgroundColor: "#FFFFFF" }}>
                    {/* Section 1: Attendance */}
                    <div className="rounded-lg p-3 sm:p-4 md:p-6 mb-4 sm:mb-6" style={{ backgroundColor: "#C4D7F0" }}>
                      <div className="flex items-center mb-4">
                        <div className="rounded-full flex items-center justify-center text-white font-bold text-sm mr-4" style={{ width: "40px", height: "40px", minWidth: "40px", backgroundColor: "#041A44" }}>1</div>
                        <h2 className="text-xl font-bold" style={{ color: "#041A44", fontFamily: "Inter, sans-serif", fontWeight: 700, fontSize: "20px" }}>Attendance</h2>
                      </div>
                      <p className="mb-0" style={{ color: "#041A44", fontFamily: "Inter, sans-serif", fontWeight: 400, fontSize: "15px", lineHeight: 1.6, textAlign: "justify" }}>Regular attendance and diligence in studies are vital for success. Therefore, students are expected to attend classes regularly or by answering on time the digital activities provided by the teacher.</p>
                    </div>

                    {/* Section 2: Absences */}
                    <div className="rounded-lg p-3 sm:p-4 md:p-6 mb-4 sm:mb-6" style={{ backgroundColor: "#C4D7F0" }}>
                      <div className="flex items-center mb-4">
                        <div className="rounded-full flex items-center justify-center text-white font-bold text-sm mr-4" style={{ width: "40px", height: "40px", minWidth: "40px", backgroundColor: "#041A44" }}>2</div>
                        <h2 className="text-xl font-bold" style={{ color: "#041A44", fontFamily: "Inter, sans-serif", fontWeight: 700, fontSize: "20px" }}>Absences</h2>
                      </div>
                      <p className="mb-0" style={{ color: "#041A44", fontFamily: "Inter, sans-serif", fontWeight: 400, fontSize: "15px", lineHeight: 1.6, textAlign: "justify" }}>The student who was not able to complete the tasks on time should be marked as absent although his/her work shall still be accepted within reasonable parameters. For the student not to be marked absent, she/he should send a excuse letter with reasons signed by the parents to the class adviser/subject teacher via email, chat, or via the learning management or sending a hard copy to the school.</p>
                    </div>

                    {/* Section 3: Absences from Class */}
                    <div className="rounded-lg p-3 sm:p-4 md:p-6 mb-4 sm:mb-6" style={{ backgroundColor: "#C4D7F0" }}>
                      <div className="flex items-center mb-4">
                        <div className="rounded-full flex items-center justify-center text-white font-bold text-sm mr-4" style={{ width: "40px", height: "40px", minWidth: "40px", backgroundColor: "#041A44" }}>3</div>
                        <h2 className="text-xl font-bold" style={{ color: "#041A44", fontFamily: "Inter, sans-serif", fontWeight: 700, fontSize: "20px" }}>Absences from Class</h2>
                      </div>
                      <p className="mb-0" style={{ color: "#041A44", fontFamily: "Inter, sans-serif", fontWeight: 400, fontSize: "15px", lineHeight: 1.6, textAlign: "justify" }}>The maximum of permitted absences from class consists of 11 absences from either a three-unit lecture course or a one-unit laboratory course.</p>
                    </div>
                  </div>
                </>
              )}
            </div>
          )}

          {/* Section VII: Learner Promotion and Retention / Grading System */}
          {selectedSection === 7 && (
            <div className="w-full">
              {isBasicEducation ? (
                <>
                  {/* Section Header */}
                  <div className="bg-white rounded-lg shadow-sm p-4 sm:p-6 md:p-8 mb-4 sm:mb-6 mt-4 sm:mt-6 md:mt-8" style={{ backgroundColor: "#041A44" }}>
                    <div className="text-xs sm:text-sm mb-3 sm:mb-4 px-2 sm:px-3 py-1 bg-blue-100 text-blue-800 rounded-full inline-block" style={{ backgroundColor: "transparent", color: "white", border: "1px solid white" }}>
                      Section VII
                    </div>
                    <h2 className="text-base sm:text-xl md:text-2xl font-bold mb-3 sm:mb-4" style={{ color: "white", fontFamily: "Inter, sans-serif", fontWeight: 700 }}>
                      LEARNER PROMOTION AND RETENTION
                    </h2>
                    <p className="text-gray-600 mb-6" style={{ color: "white", fontSize: "15px", fontFamily: "Inter, sans-serif", fontWeight: 700 }}>
                      Academic grading policies and evaluation methods
                    </p>
                  </div>

                  {/* Main White Container with all content */}
                  <div className="rounded-lg shadow-sm p-4 sm:p-6 md:p-8 mb-4 sm:mb-6" style={{ backgroundColor: "#FFFFFF" }}>
                    {/* Introduction Paragraph */}
                    <div className="mb-6">
                      <p className="font-normal leading-relaxed" style={{ color: "#041A44", fontFamily: "Inter, sans-serif", fontWeight: 400, lineHeight: 1.6, fontSize: "13px" }}>
                        The school expects the learners to meet the minimum academic grade requirement in all subject areas in order to be promoted to the next level. The following guidelines have been set by DepEd Order No. 8, s. 2015.
                      </p>
                    </div>

                    {/* Guidelines Table - Light Blue Container */}
                    <div className="rounded-lg p-5 mb-6" style={{ backgroundColor: "#C4D7F0" }}>
                      <div className="overflow-x-auto">
                        <table className="w-full border-collapse" style={{ border: "2px solid #041A44" }}>
                          <thead>
                            <tr style={{ backgroundColor: "#f8f9fa" }}>
                              <th className="px-3 py-2 text-center" style={{ fontSize: "12px", color: "#041A44", fontFamily: "Inter, sans-serif", fontWeight: 700, border: "1px solid #041A44" }}>Requirements</th>
                              <th className="px-3 py-2 text-center" style={{ fontSize: "12px", color: "#041A44", fontFamily: "Inter, sans-serif", fontWeight: 700, border: "1px solid #041A44" }}>Decision</th>
                            </tr>
                          </thead>
                          <tbody>
                            {/* For Grades 1-3 */}
                            <tr style={{ backgroundColor: "#f8f9fa" }}>
                              <td className="px-3 py-2 font-bold text-center" colSpan={2} style={{ fontSize: "12px", color: "#041A44", fontFamily: "Inter, sans-serif", fontWeight: 700, border: "1px solid #041A44" }}>For Grades 1-3</td>
                            </tr>
                            <tr>
                              <td className="px-3 py-2" style={{ fontSize: "12px", color: "#041A44", border: "1px solid #041A44" }}>1. Final Grade of at least 75 in all learning areas</td>
                              <td className="px-3 py-2" style={{ fontSize: "12px", color: "#041A44", border: "1px solid #041A44" }}>Promoted to the next grade level</td>
                            </tr>
                            <tr>
                              <td className="px-3 py-2" style={{ fontSize: "12px", color: "#041A44", border: "1px solid #041A44" }}>2. Did not Meet Expectations in not more than two learning areas Must pass remedial classes for learning areas</td>
                              <td className="px-3 py-2" style={{ fontSize: "12px", color: "#041A44", border: "1px solid #041A44" }}>Must pass remedial classes for learning areas with failing mark to be promoted to the next grade level. Otherwise the learner is retained in the same grade level.</td>
                            </tr>
                            <tr>
                              <td className="px-3 py-2" style={{ fontSize: "12px", color: "#041A44", border: "1px solid #041A44" }}>3. Did Not Meet Expectations in three or more learning areas</td>
                              <td className="px-3 py-2" style={{ fontSize: "12px", color: "#041A44", border: "1px solid #041A44" }}>Retained in the same grade level</td>
                            </tr>

                            {/* For Grades 4-10 */}
                            <tr style={{ backgroundColor: "#f8f9fa" }}>
                              <td className="px-3 py-2 font-bold text-center" colSpan={2} style={{ fontSize: "12px", color: "#041A44", fontFamily: "Inter, sans-serif", fontWeight: 700, border: "1px solid #041A44" }}>For Grades 4-10</td>
                            </tr>
                            <tr>
                              <td className="px-3 py-2" style={{ fontSize: "12px", color: "#041A44", border: "1px solid #041A44" }}>1. Final Grade of at least 75 in all learning areas</td>
                              <td className="px-3 py-2" style={{ fontSize: "12px", color: "#041A44", border: "1px solid #041A44" }}>Promoted to the same grade level</td>
                            </tr>
                            <tr>
                              <td className="px-3 py-2" style={{ fontSize: "12px", color: "#041A44", border: "1px solid #041A44" }}>2. Did Not Meet Expectations in not more than two learning areas</td>
                              <td className="px-3 py-2" style={{ fontSize: "12px", color: "#041A44", border: "1px solid #041A44" }}>Must pass remedial classes for learning areas with failing mark to be promoted to the next grade level. Otherwise, the learner is retained in the same grade level.</td>
                            </tr>
                            <tr>
                              <td className="px-3 py-2" style={{ fontSize: "12px", color: "#041A44", border: "1px solid #041A44" }}>3. Did Not Meet Expectations in three or more learning areas</td>
                              <td className="px-3 py-2" style={{ fontSize: "12px", color: "#041A44", border: "1px solid #041A44" }}>Retained in the same grade level</td>
                            </tr>
                            <tr>
                              <td className="px-3 py-2" style={{ fontSize: "12px", color: "#041A44", border: "1px solid #041A44" }}>4. Must pass all learning areas in the elementary</td>
                              <td className="px-3 py-2" style={{ fontSize: "12px", color: "#041A44", border: "1px solid #041A44" }}>1. Earn the Elementary Certificate<br />2. Promoted to Junior High School</td>
                            </tr>
                            <tr>
                              <td className="px-3 py-2" style={{ fontSize: "12px", color: "#041A44", border: "1px solid #041A44" }}>5. Must pass all learning areas in the Junior High School</td>
                              <td className="px-3 py-2" style={{ fontSize: "12px", color: "#041A44", border: "1px solid #041A44" }}>1. Earn the Junior High School Certificate<br />2. Promoted to Senior High School</td>
                            </tr>

                            {/* For Grades 11-12 */}
                            <tr style={{ backgroundColor: "#f8f9fa" }}>
                              <td className="px-3 py-2 font-bold text-center" colSpan={2} style={{ fontSize: "12px", color: "#041A44", fontFamily: "Inter, sans-serif", fontWeight: 700, border: "1px solid #041A44" }}>For Grades 11-12</td>
                            </tr>
                            <tr>
                              <td className="px-3 py-2" style={{ fontSize: "12px", color: "#041A44", border: "1px solid #041A44" }}>1. Final Grade of at least 75 in all learning areas in a semester</td>
                              <td className="px-3 py-2" style={{ fontSize: "12px", color: "#041A44", border: "1px solid #041A44" }}>Can proceed to the next semester</td>
                            </tr>
                            <tr>
                              <td className="px-3 py-2" style={{ fontSize: "12px", color: "#041A44", border: "1px solid #041A44" }}>2. Did Not Meet Expectations in a prerequisite subject in a learning area</td>
                              <td className="px-3 py-2" style={{ fontSize: "12px", color: "#041A44", border: "1px solid #041A44" }}>Must pass remedial classes for failed competencies in the subject before being allowed to enroll in the higher-level subject</td>
                            </tr>
                            <tr>
                              <td className="px-3 py-2" style={{ fontSize: "12px", color: "#041A44", border: "1px solid #041A44" }}>3. Did Not Meet Expectations in any subject or learning area at the end of the semester</td>
                              <td className="px-3 py-2" style={{ fontSize: "12px", color: "#041A44", border: "1px solid #041A44" }}>Must pass remedial classes for failed competencies in the subjects or learning areas to be allowed to enroll in the next semester. Otherwise, the learner must retake the subjects failed.</td>
                            </tr>
                            <tr>
                              <td className="px-3 py-2" style={{ fontSize: "12px", color: "#041A44", border: "1px solid #041A44" }}>4. Must pass all subjects or learning areas in Senior High School</td>
                              <td className="px-3 py-2" style={{ fontSize: "12px", color: "#041A44", border: "1px solid #041A44" }}>Earn the Senior High School Certificate</td>
                            </tr>
                          </tbody>
                        </table>
                      </div>
                    </div>

                    {/* Additional Paragraphs */}
                    <div className="space-y-1">
                      <p className="font-normal leading-relaxed" style={{ color: "#041A44", fontFamily: "Inter, sans-serif", fontWeight: 400, lineHeight: 1.4, fontSize: "13px", marginBottom: "8px" }}>
                        For Grades 1-10, a learner who Did Not Meet Expectations in at most two learning areas must take remedial classes. Remedial classes are conducted after the Final Grades have been computed. The learner must pass the remedial classes to be promoted to the next grade level.
                      </p>

                      <p className="font-normal leading-relaxed" style={{ color: "#041A44", fontFamily: "Inter, sans-serif", fontWeight: 400, lineHeight: 1.6, fontSize: "13px" }}>
                        Summative assessments are also given during remedial classes. These are recorded, computed, weighted, and transmuted in the same way as the Quarterly Grade. The equivalent of the Final Grade for remedial classes is the Remedial Class Mark (RCM). The final grade at the end of the school year and the Remedial Class Mark are averaged. This results in the Recomputed Final Grade. If the Recomputed Final Grade is 75 or higher, the student is promoted to the next grade level. However, students will be retained in the grade level if their Recomputed Final Grade is below 75.
                      </p>

                      <p className="font-normal leading-relaxed" style={{ color: "#041A44", fontFamily: "Inter, sans-serif", fontWeight: 400, lineHeight: 1.6, fontSize: "13px" }}>
                        The teacher of the remedial class issues the Certificate of Recomputed Final Grade, which is noted by the school principal. This is submitted to the division office and must be attached to both Form 137 and School Form Number 5.
                      </p>

                      <p className="font-normal leading-relaxed" style={{ color: "#041A44", fontFamily: "Inter, sans-serif", fontWeight: 400, lineHeight: 1.6, fontSize: "13px" }}>
                        The Learner can enroll in the next grade level for Grades 1-10 upon presentation of the Certificate of Recomputed Final Grade. This certificate can be verified in the division offices as needed.
                      </p>
                    </div>
                  </div>
                </>
              ) : (
                <>
                  {/* Section Header */}
                  <div className="bg-white rounded-lg shadow-sm p-4 sm:p-6 md:p-8 mb-4 sm:mb-6 mt-4 sm:mt-6 md:mt-8" style={{ backgroundColor: "#041A44" }}>
                    <div className="text-xs sm:text-sm mb-3 sm:mb-4 px-2 sm:px-3 py-1 bg-blue-100 text-blue-800 rounded-full inline-block" style={{ backgroundColor: "transparent", color: "white", border: "1px solid white" }}>
                      Section VII
                    </div>
                    <h2 className="text-base sm:text-xl md:text-2xl font-bold mb-3 sm:mb-4" style={{ color: "white", fontFamily: "Inter, sans-serif", fontWeight: 700 }}>
                      GRADING SYSTEM AND PROMOTION
                    </h2>
                    <p className="text-gray-600 mb-0 text-[10px] sm:text-sm md:text-base" style={{ color: "white", fontFamily: "Inter, sans-serif", fontWeight: 400 }}>
                      Academic grading policies and evaluation methods
                    </p>
                  </div>

                  {/* Main White Container for Grading System Overview */}
                  <div className="rounded-lg shadow-sm p-4 mb-6" style={{ backgroundColor: "#FFFFFF" }}>
                    {/* Section Title with Badge */}
                    <div className="flex items-center mb-4">
                      <div className="rounded-full flex items-center justify-center text-white font-bold text-sm mr-4" style={{ width: "40px", height: "40px", minWidth: "40px", backgroundColor: "#041A44" }}>1</div>
                      <h2 className="text-xl font-bold" style={{ color: "#041A44", fontFamily: "Inter, sans-serif", fontWeight: 700, fontSize: "20px" }}>Grading System Overview</h2>
                    </div>
                    {/* Description */}
                    <p className="mb-4" style={{ color: "#041A44", fontFamily: "Inter, sans-serif", fontWeight: 400, fontSize: "15px", lineHeight: 1.6, textAlign: "justify" }}>The intellectual progress and achievement of students shall be rated at the end of the semester in accordance with the following system:</p>
                    {/* Light Gray Container for Table */}
                    <div className="rounded-lg p-4 mb-4" style={{ backgroundColor: "#F1F3F8" }}>
                      {/* Grading Table */}
                      <div className="overflow-x-auto">
                        <table className="w-full border-collapse" style={{ border: "3px solid #333" }}>
                          <thead>
                            <tr style={{ backgroundColor: "#E8EBF0" }}>
                              <th className="border px-3 py-2 text-left font-bold" style={{ border: "1px solid #666", borderLeft: "3px solid #333", borderRight: "3px solid #333", color: "#1a1a1a", fontFamily: "Inter, sans-serif", fontWeight: 700, fontSize: "13px" }}>Grade</th>
                              <th className="border px-3 py-2 text-left font-bold" style={{ border: "1px solid #666", borderRight: "3px solid #333", color: "#1a1a1a", fontFamily: "Inter, sans-serif", fontWeight: 700, fontSize: "13px" }}>Equivalent</th>
                              <th className="border px-3 py-2 text-center font-bold" style={{ border: "3px solid #333", borderLeft: "3px solid #333", borderRight: "3px solid #333", color: "#1a1a1a", fontFamily: "Inter, sans-serif", fontWeight: 700, fontSize: "13px" }}>Meaning</th>
                            </tr>
                          </thead>
                          <tbody style={{ backgroundColor: "#FFFFFF" }}>
                            {/* Excellent Section */}
                            <tr>
                              <td className="border px-3 py-2" style={{ border: "1px solid #ddd", borderLeft: "3px solid #333", borderRight: "3px solid #333", color: "#1a1a1a", fontFamily: "Inter, sans-serif", fontWeight: 700, fontSize: "13px" }}>1.0</td>
                              <td className="border px-3 py-2" style={{ border: "1px solid #ddd", borderRight: "3px solid #333", color: "#1a1a1a", fontFamily: "Inter, sans-serif", fontWeight: 700, fontSize: "13px" }}>95%</td>
                              <td className="border px-3 py-2 text-center font-bold" rowSpan={3} style={{ border: "3px solid #333", borderLeft: "3px solid #333", color: "#1a1a1a", fontFamily: "Inter, sans-serif", fontWeight: 700, fontSize: "15px", verticalAlign: "middle", backgroundColor: "#FFFFFF" }}>Excellent</td>
                            </tr>
                            <tr>
                              <td className="border px-3 py-2" style={{ border: "1px solid #ddd", borderLeft: "3px solid #333", borderRight: "3px solid #333", color: "#1a1a1a", fontFamily: "Inter, sans-serif", fontWeight: 700, fontSize: "13px" }}>1.1</td>
                              <td className="border px-3 py-2" style={{ border: "1px solid #ddd", borderRight: "3px solid #333", color: "#1a1a1a", fontFamily: "Inter, sans-serif", fontWeight: 700, fontSize: "13px" }}>94%</td>
                            </tr>
                            <tr>
                              <td className="border px-3 py-2" style={{ border: "1px solid #ddd", borderLeft: "3px solid #333", borderRight: "3px solid #333", color: "#1a1a1a", fontFamily: "Inter, sans-serif", fontWeight: 700, fontSize: "13px" }}>1.2</td>
                              <td className="border px-3 py-2" style={{ border: "1px solid #ddd", borderRight: "3px solid #333", color: "#1a1a1a", fontFamily: "Inter, sans-serif", fontWeight: 700, fontSize: "13px" }}>93%</td>
                            </tr>
                            {/* Very Good Section */}
                            <tr>
                              <td className="border px-3 py-2" style={{ border: "1px solid #ddd", borderLeft: "3px solid #333", borderRight: "3px solid #333", borderBottom: "3px solid #333", color: "#1a1a1a", fontFamily: "Inter, sans-serif", fontWeight: 700, fontSize: "13px" }}>1.3</td>
                              <td className="border px-3 py-2" style={{ border: "1px solid #ddd", borderRight: "3px solid #333", borderBottom: "3px solid #333", color: "#1a1a1a", fontFamily: "Inter, sans-serif", fontWeight: 700, fontSize: "13px" }}>92%</td>
                              <td className="border px-3 py-2 text-center font-bold" rowSpan={7} style={{ border: "3px solid #333", borderLeft: "3px solid #333", color: "#1a1a1a", fontFamily: "Inter, sans-serif", fontWeight: 700, fontSize: "15px", verticalAlign: "middle", backgroundColor: "#FFFFFF" }}>Very Good</td>
                            </tr>
                            <tr>
                              <td className="border px-3 py-2" style={{ border: "1px solid #ddd", borderLeft: "3px solid #333", borderTop: "3px solid #333", borderRight: "3px solid #333", color: "#1a1a1a", fontFamily: "Inter, sans-serif", fontWeight: 700, fontSize: "13px" }}>1.4</td>
                              <td className="border px-3 py-2" style={{ border: "1px solid #ddd", borderTop: "3px solid #333", borderRight: "3px solid #333", color: "#1a1a1a", fontFamily: "Inter, sans-serif", fontWeight: 700, fontSize: "13px" }}>91%</td>
                            </tr>
                            <tr>
                              <td className="border px-3 py-2" style={{ border: "1px solid #ddd", borderLeft: "3px solid #333", borderRight: "3px solid #333", color: "#1a1a1a", fontFamily: "Inter, sans-serif", fontWeight: 700, fontSize: "13px" }}>1.5</td>
                              <td className="border px-3 py-2" style={{ border: "1px solid #ddd", borderRight: "3px solid #333", color: "#1a1a1a", fontFamily: "Inter, sans-serif", fontWeight: 700, fontSize: "13px" }}>90%</td>
                            </tr>
                            <tr>
                              <td className="border px-3 py-2" style={{ border: "1px solid #ddd", borderLeft: "3px solid #333", borderRight: "3px solid #333", borderBottom: "3px solid #333", color: "#1a1a1a", fontFamily: "Inter, sans-serif", fontWeight: 700, fontSize: "13px" }}>1.6</td>
                              <td className="border px-3 py-2" style={{ border: "1px solid #ddd", borderRight: "3px solid #333", borderBottom: "3px solid #333", color: "#1a1a1a", fontFamily: "Inter, sans-serif", fontWeight: 700, fontSize: "13px" }}>89%</td>
                            </tr>
                            <tr>
                              <td className="border px-3 py-2" style={{ border: "1px solid #ddd", borderLeft: "3px solid #333", borderTop: "3px solid #333", borderRight: "3px solid #333", color: "#1a1a1a", fontFamily: "Inter, sans-serif", fontWeight: 700, fontSize: "13px" }}>1.7</td>
                              <td className="border px-3 py-2" style={{ border: "1px solid #ddd", borderTop: "3px solid #333", borderRight: "3px solid #333", color: "#1a1a1a", fontFamily: "Inter, sans-serif", fontWeight: 700, fontSize: "13px" }}>88%</td>
                            </tr>
                            <tr>
                              <td className="border px-3 py-2" style={{ border: "1px solid #ddd", borderLeft: "3px solid #333", borderRight: "3px solid #333", color: "#1a1a1a", fontFamily: "Inter, sans-serif", fontWeight: 700, fontSize: "13px" }}>1.8</td>
                              <td className="border px-3 py-2" style={{ border: "1px solid #ddd", borderRight: "3px solid #333", color: "#1a1a1a", fontFamily: "Inter, sans-serif", fontWeight: 700, fontSize: "13px" }}>87%</td>
                            </tr>
                            <tr>
                              <td className="border px-3 py-2" style={{ border: "1px solid #ddd", borderLeft: "3px solid #333", borderRight: "3px solid #333", borderBottom: "3px solid #333", color: "#1a1a1a", fontFamily: "Inter, sans-serif", fontWeight: 700, fontSize: "13px" }}>1.9</td>
                              <td className="border px-3 py-2" style={{ border: "1px solid #ddd", borderRight: "3px solid #333", borderBottom: "3px solid #333", color: "#1a1a1a", fontFamily: "Inter, sans-serif", fontWeight: 700, fontSize: "13px" }}>86%</td>
                            </tr>
                            {/* Good Section */}
                            <tr>
                              <td className="border px-3 py-2" style={{ border: "1px solid #ddd", borderLeft: "3px solid #333", borderTop: "3px solid #333", borderRight: "3px solid #333", color: "#1a1a1a", fontFamily: "Inter, sans-serif", fontWeight: 700, fontSize: "13px" }}>2.0</td>
                              <td className="border px-3 py-2" style={{ border: "1px solid #ddd", borderTop: "3px solid #333", borderRight: "3px solid #333", color: "#1a1a1a", fontFamily: "Inter, sans-serif", fontWeight: 700, fontSize: "13px" }}>85%</td>
                              <td className="border px-3 py-2 text-center font-bold" rowSpan={6} style={{ border: "3px solid #333", borderLeft: "3px solid #333", color: "#1a1a1a", fontFamily: "Inter, sans-serif", fontWeight: 700, fontSize: "15px", verticalAlign: "middle", backgroundColor: "#FFFFFF" }}>Good</td>
                            </tr>
                            <tr>
                              <td className="border px-3 py-2" style={{ border: "1px solid #ddd", borderLeft: "3px solid #333", borderRight: "3px solid #333", color: "#1a1a1a", fontFamily: "Inter, sans-serif", fontWeight: 700, fontSize: "13px" }}>2.1</td>
                              <td className="border px-3 py-2" style={{ border: "1px solid #ddd", borderRight: "3px solid #333", color: "#1a1a1a", fontFamily: "Inter, sans-serif", fontWeight: 700, fontSize: "13px" }}>84%</td>
                            </tr>
                            <tr>
                              <td className="border px-3 py-2" style={{ border: "1px solid #ddd", borderLeft: "3px solid #333", borderRight: "3px solid #333", borderBottom: "3px solid #333", color: "#1a1a1a", fontFamily: "Inter, sans-serif", fontWeight: 700, fontSize: "13px" }}>2.2</td>
                              <td className="border px-3 py-2" style={{ border: "1px solid #ddd", borderRight: "3px solid #333", borderBottom: "3px solid #333", color: "#1a1a1a", fontFamily: "Inter, sans-serif", fontWeight: 700, fontSize: "13px" }}>83%</td>
                            </tr>
                            <tr>
                              <td className="border px-3 py-2" style={{ border: "1px solid #ddd", borderLeft: "3px solid #333", borderTop: "3px solid #333", borderRight: "3px solid #333", color: "#1a1a1a", fontFamily: "Inter, sans-serif", fontWeight: 700, fontSize: "13px" }}>2.3</td>
                              <td className="border px-3 py-2" style={{ border: "1px solid #ddd", borderTop: "3px solid #333", borderRight: "3px solid #333", color: "#1a1a1a", fontFamily: "Inter, sans-serif", fontWeight: 700, fontSize: "13px" }}>82%</td>
                            </tr>
                            <tr>
                              <td className="border px-3 py-2" style={{ border: "1px solid #ddd", borderLeft: "3px solid #333", borderRight: "3px solid #333", color: "#1a1a1a", fontFamily: "Inter, sans-serif", fontWeight: 700, fontSize: "13px" }}>2.4</td>
                              <td className="border px-3 py-2" style={{ border: "1px solid #ddd", borderRight: "3px solid #333", color: "#1a1a1a", fontFamily: "Inter, sans-serif", fontWeight: 700, fontSize: "13px" }}>81%</td>
                            </tr>
                            <tr>
                              <td className="border px-3 py-2" style={{ border: "1px solid #ddd", borderLeft: "3px solid #333", borderRight: "3px solid #333", color: "#1a1a1a", fontFamily: "Inter, sans-serif", fontWeight: 700, fontSize: "13px" }}>2.5</td>
                              <td className="border px-3 py-2" style={{ border: "1px solid #ddd", borderRight: "3px solid #333", color: "#1a1a1a", fontFamily: "Inter, sans-serif", fontWeight: 700, fontSize: "13px" }}>80%</td>
                            </tr>
                            {/* Fair Section */}
                            <tr>
                              <td className="border px-3 py-2" style={{ border: "1px solid #ddd", borderLeft: "3px solid #333", borderTop: "3px solid #333", borderRight: "3px solid #333", color: "#1a1a1a", fontFamily: "Inter, sans-serif", fontWeight: 700, fontSize: "13px" }}>2.6</td>
                              <td className="border px-3 py-2" style={{ border: "1px solid #ddd", borderTop: "3px solid #333", borderRight: "3px solid #333", color: "#1a1a1a", fontFamily: "Inter, sans-serif", fontWeight: 700, fontSize: "13px" }}>79%</td>
                              <td className="border px-3 py-2 text-center font-bold" rowSpan={5} style={{ border: "3px solid #333", borderLeft: "3px solid #333", color: "#1a1a1a", fontFamily: "Inter, sans-serif", fontWeight: 700, fontSize: "15px", verticalAlign: "middle", backgroundColor: "#FFFFFF" }}>Fair</td>
                            </tr>
                            <tr>
                              <td className="border px-3 py-2" style={{ border: "1px solid #ddd", borderLeft: "3px solid #333", borderRight: "3px solid #333", color: "#1a1a1a", fontFamily: "Inter, sans-serif", fontWeight: 700, fontSize: "13px" }}>2.7</td>
                              <td className="border px-3 py-2" style={{ border: "1px solid #ddd", borderRight: "3px solid #333", color: "#1a1a1a", fontFamily: "Inter, sans-serif", fontWeight: 700, fontSize: "13px" }}>78%</td>
                            </tr>
                            <tr>
                              <td className="border px-3 py-2" style={{ border: "1px solid #ddd", borderLeft: "3px solid #333", borderRight: "3px solid #333", borderBottom: "3px solid #333", color: "#1a1a1a", fontFamily: "Inter, sans-serif", fontWeight: 700, fontSize: "13px" }}>2.8</td>
                              <td className="border px-3 py-2" style={{ border: "1px solid #ddd", borderRight: "3px solid #333", borderBottom: "3px solid #333", color: "#1a1a1a", fontFamily: "Inter, sans-serif", fontWeight: 700, fontSize: "13px" }}>77%</td>
                            </tr>
                            <tr>
                              <td className="border px-3 py-2" style={{ border: "1px solid #ddd", borderLeft: "3px solid #333", borderTop: "3px solid #333", borderRight: "3px solid #333", color: "#1a1a1a", fontFamily: "Inter, sans-serif", fontWeight: 700, fontSize: "13px" }}>2.9</td>
                              <td className="border px-3 py-2" style={{ border: "1px solid #ddd", borderTop: "3px solid #333", borderRight: "3px solid #333", color: "#1a1a1a", fontFamily: "Inter, sans-serif", fontWeight: 700, fontSize: "13px" }}>76%</td>
                            </tr>
                            <tr>
                              <td className="border px-3 py-2" style={{ border: "1px solid #ddd", borderLeft: "3px solid #333", borderRight: "3px solid #333", borderBottom: "3px solid #333", color: "#1a1a1a", fontFamily: "Inter, sans-serif", fontWeight: 700, fontSize: "13px" }}>3.0</td>
                              <td className="border px-3 py-2" style={{ border: "1px solid #ddd", borderRight: "3px solid #333", borderBottom: "3px solid #333", color: "#1a1a1a", fontFamily: "Inter, sans-serif", fontWeight: 700, fontSize: "13px" }}>75%</td>
                            </tr>
                            {/* Conditional Section */}
                            <tr>
                              <td className="border px-3 py-2" style={{ border: "1px solid #ddd", borderLeft: "3px solid #333", borderRight: "3px solid #333", color: "#1a1a1a", fontFamily: "Inter, sans-serif", fontWeight: 700, fontSize: "13px" }}>4.0</td>
                              <td className="border px-3 py-2" style={{ border: "1px solid #ddd", borderRight: "3px solid #333", color: "#1a1a1a", fontFamily: "Inter, sans-serif", fontWeight: 700, fontSize: "13px" }}></td>
                              <td className="border px-3 py-2 text-center font-bold" style={{ border: "1px solid #ddd", borderLeft: "3px solid #333", borderRight: "3px solid #333", color: "#1a1a1a", fontFamily: "Inter, sans-serif", fontWeight: 700, fontSize: "15px", backgroundColor: "#FFFFFF" }}>Conditional</td>
                            </tr>
                            {/* Failed Section */}
                            <tr>
                              <td className="border px-3 py-2" style={{ border: "1px solid #ddd", borderLeft: "3px solid #333", borderRight: "3px solid #333", borderBottom: "3px solid #333", color: "#1a1a1a", fontFamily: "Inter, sans-serif", fontWeight: 700, fontSize: "13px" }}>5.0</td>
                              <td className="border px-3 py-2" style={{ border: "1px solid #ddd", borderRight: "3px solid #333", borderBottom: "3px solid #333", color: "#1a1a1a", fontFamily: "Inter, sans-serif", fontWeight: 700, fontSize: "13px" }}></td>
                              <td className="border px-3 py-2 text-center font-bold" style={{ border: "1px solid #ddd", borderLeft: "3px solid #333", borderRight: "3px solid #333", borderBottom: "3px solid #333", color: "#1a1a1a", fontFamily: "Inter, sans-serif", fontWeight: 700, fontSize: "15px", backgroundColor: "#FFFFFF" }}>Failed</td>
                            </tr>
                          </tbody>
                        </table>
                      </div>
                    </div>
                  </div>

                  {/* Second White Container: Qualitative Grades */}
                  <div className="rounded-lg shadow-sm p-4 mb-6" style={{ backgroundColor: "#FFFFFF" }}>
                    <div className="flex items-center mb-3">
                      <div className="rounded-full flex items-center justify-center text-white font-bold text-sm mr-4" style={{ width: "40px", height: "40px", minWidth: "40px", backgroundColor: "#041A44" }}>2</div>
                      <h2 className="text-xl font-bold" style={{ color: "#041A44", fontFamily: "Inter, sans-serif", fontWeight: 700, fontSize: "20px" }}>Qualitative Grades</h2>
                    </div>
                    <p className="mb-0" style={{ color: "#041A44", fontFamily: "Inter, sans-serif", fontWeight: 400, fontSize: "15px", lineHeight: 1.6, textAlign: "justify" }}>The qualitative grades will not be used in computing General Weighted Average or GWA, but will be used only to break a tie in the ranking of students.</p>
                  </div>

                  {/* Third White Container: Incomplete Grades (INC) */}
                  <div className="rounded-lg shadow-sm p-4 mb-6" style={{ backgroundColor: "#FFFFFF" }}>
                    <div className="flex items-center mb-3">
                      <div className="rounded-full flex items-center justify-center text-white font-bold text-sm mr-4" style={{ width: "40px", height: "40px", minWidth: "40px", backgroundColor: "#041A44" }}>3</div>
                      <h2 className="text-xl font-bold" style={{ color: "#041A44", fontFamily: "Inter, sans-serif", fontWeight: 700, fontSize: "20px" }}>Incomplete Grades (INC)</h2>
                    </div>
                    <p className="mb-0" style={{ color: "#041A44", fontFamily: "Inter, sans-serif", fontWeight: 400, fontSize: "15px", lineHeight: 1.6, textAlign: "justify" }}>The grade of "INC" is given to a student who fails to take the final examination or fails to complete other requirements of the subject due to illness or other valid reasons.</p>
                  </div>

                  {/* Fourth White Container: Removal of Incomplete Grades */}
                  <div className="rounded-lg shadow-sm p-4 mb-6" style={{ backgroundColor: "#FFFFFF" }}>
                    <div className="flex items-center mb-3">
                      <div className="rounded-full flex items-center justify-center text-white font-bold text-sm mr-4" style={{ width: "40px", height: "40px", minWidth: "40px", backgroundColor: "#041A44" }}>4</div>
                      <h2 className="text-xl font-bold" style={{ color: "#041A44", fontFamily: "Inter, sans-serif", fontWeight: 700, fontSize: "20px" }}>Removal of Incomplete Grades</h2>
                    </div>
                    <p className="mb-0" style={{ color: "#041A44", fontFamily: "Inter, sans-serif", fontWeight: 400, fontSize: "15px", lineHeight: 1.6, textAlign: "justify" }}>Removal of the "INC" must be done within the prescribed time [within one (1) academic year where there are three (3) regular removal periods] by passing an examination or meeting all the requirements of the course after which the student shall be given a final grade based on his/her overall performance.</p>
                  </div>

                  {/* Fifth White Container: Grade Conversion Policy */}
                  <div className="rounded-lg shadow-sm p-4 mb-6" style={{ backgroundColor: "#FFFFFF" }}>
                    <div className="flex items-center mb-3">
                      <div className="rounded-full flex items-center justify-center text-white font-bold text-sm mr-4" style={{ width: "40px", height: "40px", minWidth: "40px", backgroundColor: "#041A44" }}>5</div>
                      <h2 className="text-xl font-bold" style={{ color: "#041A44", fontFamily: "Inter, sans-serif", fontWeight: 700, fontSize: "20px" }}>Grade Conversion Policy</h2>
                    </div>
                    <p className="mb-0" style={{ color: "#041A44", fontFamily: "Inter, sans-serif", fontWeight: 400, fontSize: "15px", lineHeight: 1.6, textAlign: "justify" }}>The grade of "4" is automatically changed to "5" when the one-year grace period for removal has lapsed. The Office of the School Registrar (OSR) will generate a list of un-removed grades of "4" and send the list to the Department Heads for feedback. The Department Heads will return the signed and updated list to the OSR and the School Registrar will change the grades from "4 to 5" based on the list.</p>
                  </div>

                  {/* Sixth White Container: Re-enrolment Policy */}
                  <div className="rounded-lg shadow-sm p-4 mb-6" style={{ backgroundColor: "#FFFFFF" }}>
                    <div className="flex items-center mb-3">
                      <div className="rounded-full flex items-center justify-center text-white font-bold text-sm mr-4" style={{ width: "40px", height: "40px", minWidth: "40px", backgroundColor: "#041A44" }}>6</div>
                      <h2 className="text-xl font-bold" style={{ color: "#041A44", fontFamily: "Inter, sans-serif", fontWeight: 700, fontSize: "20px" }}>Re-enrolment Policy</h2>
                    </div>
                    <p className="mb-0" style={{ color: "#041A44", fontFamily: "Inter, sans-serif", fontWeight: 400, fontSize: "15px", lineHeight: 1.6, textAlign: "justify" }}>A grade of "4" if not removed within one (1) academic year must be re-enrolled within the prescribed enrollment period.</p>
                  </div>

                  {/* Seventh White Container: Grade Solicitation Policy */}
                  <div className="rounded-lg shadow-sm p-4 mb-6" style={{ backgroundColor: "#FFFFFF" }}>
                    <div className="flex items-center mb-3">
                      <div className="rounded-full flex items-center justify-center text-white font-bold text-sm mr-4" style={{ width: "40px", height: "40px", minWidth: "40px", backgroundColor: "#041A44" }}>7</div>
                      <h2 className="text-xl font-bold" style={{ color: "#041A44", fontFamily: "Inter, sans-serif", fontWeight: 700, fontSize: "20px" }}>Grade Solicitation Policy</h2>
                    </div>
                    <p className="mb-0" style={{ color: "#041A44", fontFamily: "Inter, sans-serif", fontWeight: 400, fontSize: "15px", lineHeight: 1.6, textAlign: "justify" }}>No student of the school shall solicit directly or indirectly any grade from his/her professor. Any student violating this rule shall lose credit in the subject(s) regardless which such solicitation is made and may be subjected to the filing of a case for disciplinary action.</p>
                  </div>
                </>
              )}
            </div>
          )}

          {/* Section VIII: Policy On Awards / Retention Policies */}
          {selectedSection === 8 && (
            <div className="w-full">
              {isBasicEducation ? (
                <>
                  {/* Section Header */}
                  <div className="bg-white rounded-lg shadow-sm p-4 sm:p-6 md:p-8 mb-4 sm:mb-6 mt-4 sm:mt-6 md:mt-8" style={{ backgroundColor: "#041A44" }}>
                    <div className="text-xs sm:text-sm mb-3 sm:mb-4 px-2 sm:px-3 py-1 bg-blue-100 text-blue-800 rounded-full inline-block" style={{ backgroundColor: "transparent", color: "white", border: "1px solid white" }}>
                      Section VIII
                    </div>
                    <h2 className="text-2xl font-semibold mb-4" style={{ color: "white", fontSize: "25px", fontFamily: "Inter, sans-serif", fontWeight: 700 }}>
                      POLICY ON AWARDS
                    </h2>
                    <p className="text-gray-600 mb-0 text-[10px] sm:text-sm md:text-base" style={{ color: "white", fontFamily: "Inter, sans-serif", fontWeight: 400 }}>
                      Guidelines for student recognition and honors
                    </p>
                  </div>

                  {/* Main White Container with all content */}
                  <div className="rounded-lg shadow-sm p-4 sm:p-6 md:p-8 mb-4 sm:mb-6" style={{ backgroundColor: "#FFFFFF" }}>
                    {/* Note Block */}
                    <div className="rounded-lg p-5 mb-6" style={{ backgroundColor: "#C4D7F0" }}>
                      <p className="font-normal leading-relaxed" style={{ color: "#041A44", fontFamily: "Inter, sans-serif", fontWeight: 400, lineHeight: 1.6, fontSize: "13px" }}>
                        <strong>Note:</strong> Criteria for determining of honors is aligned with DepEd Order No. 30, s. 2015 (Policy Guidelines on Awards and Recognition for the K to 12 Basic Education Program)
                      </p>
                    </div>

                    {/* Classroom Awards Block */}
                    <div className="rounded-lg p-5 mb-6" style={{ backgroundColor: "#C4D7F0" }}>
                      <h3 className="font-bold mb-3" style={{ color: "#041A44", fontFamily: "Inter, sans-serif", fontWeight: 700, fontSize: "15px" }}>Classroom Awards</h3>
                      <p className="font-normal leading-relaxed" style={{ color: "#041A44", fontSize: "13px" }}>
                        A student who fails to meet requirement (no. 1) may request admission and upon approval of the Dean, shall be placed on probation with reduced load.
                      </p>
                    </div>

                    {/* Grade-Level Awards Block */}
                    <div className="rounded-lg p-5 mb-6" style={{ backgroundColor: "#C4D7F0" }}>
                      <h3 className="font-bold mb-3" style={{ color: "#041A44", fontFamily: "Inter, sans-serif", fontWeight: 700, fontSize: "15px" }}>Grade-Level Awards</h3>
                      <p className="font-normal leading-relaxed" style={{ color: "#041A44", fontSize: "13px" }}>
                        are given to qualified learners for every grade level at the end of the school year. Candidates for the awards are deliberated by the Awards Committee (AC) if they have met the given criteria.
                      </p>
                    </div>

                    {/* Awards Section - Light Blue Container */}
                    <div className="rounded-lg p-5 mb-6" style={{ backgroundColor: "#C4D7F0" }}>
                      <div className="flex items-start mb-4">
                        <div className="w-10 h-10 rounded-full flex items-center justify-center mr-3 flex-shrink-0" style={{ backgroundColor: "#041A44", fontFamily: "Inter, sans-serif", fontWeight: 700, color: "white", fontSize: "14px" }}>
                          A
                        </div>
                        <h2 className="font-bold leading-10" style={{ color: "#041A44", fontSize: "20px", fontFamily: "Inter, sans-serif", fontWeight: 700 }}>Awards</h2>
                      </div>

                      {/* 1. Performance Awards for Kindergarten */}
                      <div className="mb-6">
                        <h3 className="font-bold mb-3" style={{ color: "#041A44", fontFamily: "Inter, sans-serif", fontWeight: 700, fontSize: "15px" }}>1. Performance Awards for Kindergarten</h3>
                        <p className="font-normal leading-relaxed" style={{ color: "#041A44", fontSize: "13px" }}>
                          This recognition is given to kindergarten learners who are performing well in the different domains of learning and are showing improvement throughout the school year. Since kindergarten learners are not given numerical grades, the recognition is based on their abilities and improvement.
                        </p>
                      </div>

                      {/* 2. Academic Excellence Award */}
                      <div className="mb-6">
                        <h3 className="font-bold mb-3" style={{ color: "#041A44", fontFamily: "Inter, sans-serif", fontWeight: 700, fontSize: "15px" }}>2. Academic Excellence Award</h3>
                        <p className="font-normal leading-relaxed mb-4" style={{ color: "#041A44", fontSize: "13px" }}>
                          This award is given to learners from Grades 1 to 10 who have attained an average of 90.00 and above and have passed all learning areas. The average grade per quarter is reported as a whole number following DepEd Order No. 8, s. 2015.
                        </p>

                        {/* Academic Excellence Award Table */}
                        <div className="rounded-lg p-5 mb-4" style={{ backgroundColor: "#C4D7F0" }}>
                          <h4 className="font-bold mb-3" style={{ color: "#041A44", fontFamily: "Inter, sans-serif", fontWeight: 700, fontSize: "15px" }}>Table 1. Academic Excellence Award</h4>
                          <div className="overflow-x-auto">
                            <table className="w-full border-collapse" style={{ border: "2px solid #041A44" }}>
                              <thead>
                                <tr style={{ backgroundColor: "#f8f9fa" }}>
                                  <th className="px-3 py-2 text-left" style={{ fontSize: "12px", color: "#041A44", fontFamily: "Inter, sans-serif", fontWeight: 700, border: "1px solid #041A44" }}>Academic Excellence Award</th>
                                  <th className="px-3 py-2 text-center" style={{ fontSize: "12px", color: "#041A44", fontFamily: "Inter, sans-serif", fontWeight: 700, border: "1px solid #041A44" }}>Average Grade per Quarter</th>
                                </tr>
                              </thead>
                              <tbody>
                                <tr>
                                  <td className="px-3 py-2" style={{ fontSize: "12px", color: "#041A44", border: "1px solid #041A44" }}>1. With Highest Honor/May Pinakamataas na Karangalan</td>
                                  <td className="px-3 py-2 text-center" style={{ fontSize: "12px", color: "#041A44", border: "1px solid #041A44" }}>98 - 100</td>
                                </tr>
                                <tr>
                                  <td className="px-3 py-2" style={{ fontSize: "12px", color: "#041A44", border: "1px solid #041A44" }}>2. With High Honors/ May Mataas na Karangalan</td>
                                  <td className="px-3 py-2 text-center" style={{ fontSize: "12px", color: "#041A44", border: "1px solid #041A44" }}>95 - 97</td>
                                </tr>
                                <tr>
                                  <td className="px-3 py-2" style={{ fontSize: "12px", color: "#041A44", border: "1px solid #041A44" }}>3. With Honors/ May Karangalan</td>
                                  <td className="px-3 py-2 text-center" style={{ fontSize: "12px", color: "#041A44", border: "1px solid #041A44" }}>90 - 94</td>
                                </tr>
                              </tbody>
                            </table>
                          </div>
                        </div>
                      </div>

                      {/* 3. Loyalty Award */}
                      <div className="mb-6">
                        <h3 className="font-bold mb-3" style={{ color: "#041A44", fontFamily: "Inter, sans-serif", fontWeight: 700, fontSize: "15px" }}>3. Loyalty Award</h3>
                        <p className="font-normal leading-relaxed mb-3" style={{ color: "#041A44", fontSize: "13px" }}>
                          This award is granted to graduating students ONLY who meets the following requirements:
                        </p>
                        <div className="space-y-1" style={{ color: "#041A44", fontSize: "13px" }}>
                          <div style={{ marginBottom: "4px" }}>a. Residence from Kindergarten/Grade 1 until graduation from Senior High School.</div>
                          <div style={{ marginBottom: "4px" }}>b. Values Orientation</div>
                          <div className="ml-4 mt-2 space-y-1">
                            <div style={{ marginBottom: "2px" }}>* Consistent and unswerving in one's allegiance to and defending the good name of his/her Alma Mater</div>
                            <div style={{ marginBottom: "2px" }}>* Constant in his/her respect for the Rules and Regulations, practices, customs/ traditions of his/her Alma Mater</div>
                            <div>* Faithful in upholding the Christian ideals and principles and the noble cause and objectives of his/her Alma Mater</div>
                            <div>* Students with suspension records are disqualified from receiving this recognition despite their years of residence.</div>
                          </div>
                        </div>
                      </div>

                      {/* 4. Leadership Award */}
                      <div className="mb-6">
                        <h3 className="font-bold mb-3" style={{ color: "#041A44", fontFamily: "Inter, sans-serif", fontWeight: 700, fontSize: "13px" }}>4. LEADERSHIP AWARD</h3>
                        <div className="space-y-2" style={{ color: "#041A44", fontSize: "13px" }}>
                          <div>a. Competence in doing any task assigned</div>
                          <div>b. Ability to mobilize and motivate one's group</div>
                          <div>c. Is respectful and respectable and could command respect</div>
                          <div>d. An example of selfless dedication to any task assigned</div>
                          <div>e. Constancy and consistency in one's fulfillment of duties</div>
                          <div>f. Fidelity and conscientiousness in being a leader of one's group</div>
                          <div>g. Is an active leader of not less than two (2) Co-Curricular Clubs</div>
                          <div>h. Regularity and punctuality in reporting to and about the task/s one is assigned</div>
                          <div>i. Good academic standing of at least 87.00% or higher.</div>
                        </div>
                      </div>

                      {/* 5. Service Award */}
                      <div className="mb-6">
                        <h3 className="font-bold mb-3" style={{ color: "#041A44", fontFamily: "Inter, sans-serif", fontWeight: 700, fontSize: "13px" }}>5. SERVICE AWARD</h3>
                        <p className="font-normal leading-relaxed mb-3" style={{ color: "#041A44", fontSize: "13px" }}>
                          This award is granted to students who meet the following criteria:
                        </p>
                        <div className="space-y-2" style={{ color: "#041A44", fontSize: "13px" }}>
                          <div>a. Generous availability of one's time and effort in serving the school/community.</div>
                          <div>b. Spirit of dedication in one's work/duty.</div>
                          <div>c. Heartfelt cooperation in any activity one is called/requested to do.</div>
                          <div>d. Humble fidelity in carrying out instructions/rules.</div>
                          <div>e. Trustworthiness and sincerity in fulfilling any assigned task.</div>
                          <div>f. Goodwill to volunteer work (where one does not wait to be asked) with no other motive than to serve.</div>
                          <div>g. Cheerfulness in performing any task one is asked/requested to do.</div>
                        </div>
                      </div>
                    </div>

                    {/* NOTA BENE Block */}
                    <div className="rounded-lg p-5 mb-6" style={{ backgroundColor: "#C4D7F0" }}>
                      <h3 className="font-bold mb-3" style={{ color: "#041A44", fontFamily: "Inter, sans-serif", fontWeight: 700, fontSize: "13px" }}>NOTA BENE:</h3>
                      <p className="font-bold italic leading-relaxed" style={{ color: "#041A44", fontSize: "13px" }}>
                        All candidates for honors must be of good moral character and have not been subjected to any disciplinary actions within the current school year.
                      </p>
                    </div>
                  </div>
                </>
              ) : (
                <>
                  {/* Section Header */}
                  <div className="bg-white rounded-lg shadow-sm p-4 sm:p-6 md:p-8 mb-4 sm:mb-6 mt-4 sm:mt-6 md:mt-8" style={{ backgroundColor: "#041A44" }}>
                    <div className="text-xs sm:text-sm mb-3 sm:mb-4 px-2 sm:px-3 py-1 bg-blue-100 text-blue-800 rounded-full inline-block" style={{ backgroundColor: "transparent", color: "white", border: "1px solid white" }}>
                      Section VIII
                    </div>
                    <h2 className="text-base sm:text-xl md:text-2xl font-bold mb-3 sm:mb-4" style={{ color: "white", fontFamily: "Inter, sans-serif", fontWeight: 700 }}>
                      RETENTION POLICIES
                    </h2>
                    <p className="text-gray-600 mb-0 text-[10px] sm:text-sm md:text-base" style={{ color: "white", fontFamily: "Inter, sans-serif", fontWeight: 400 }}>
                      Rules on attendance and absence handling
                    </p>
                  </div>

                  {/* Main White Container */}
                  <div className="rounded-lg shadow-sm p-2 sm:p-4 md:p-6 mb-4 sm:mb-6" style={{ backgroundColor: "#FFFFFF" }}>
                    {/* First Blue Container: Attendance */}
                    <div className="rounded-lg p-2 sm:p-4 md:p-6 mb-3 sm:mb-6" style={{ backgroundColor: "#C4D7F0" }}>
                      <div className="flex items-center mb-3 sm:mb-4">
                        <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-full flex items-center justify-center text-white font-bold text-xs sm:text-sm" style={{ minWidth: "32px", backgroundColor: "#041A44", marginRight: "12px" }}>1</div>
                        <h2 className="text-base sm:text-lg md:text-xl font-bold" style={{ color: "#041A44", fontFamily: "Inter, sans-serif", fontWeight: 700 }}>Attendance</h2>
                      </div>
                      <p className="mb-0 text-xs sm:text-sm md:text-base" style={{ color: "#041A44", fontFamily: "Inter, sans-serif", fontWeight: 400, lineHeight: 1.6, textAlign: "justify" }}>A student to remain in good standing, must have passed at least 67% of the units he has enrolled in during a semester.</p>
                    </div>

                    {/* Second Blue Container: Absences */}
                    <div className="rounded-lg p-2 sm:p-4 md:p-6 mb-3 sm:mb-6" style={{ backgroundColor: "#C4D7F0" }}>
                      <div className="flex items-center mb-3 sm:mb-4">
                        <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-full flex items-center justify-center text-white font-bold text-xs sm:text-sm" style={{ minWidth: "32px", backgroundColor: "#041A44", marginRight: "12px" }}>2</div>
                        <h2 className="text-base sm:text-lg md:text-xl font-bold" style={{ color: "#041A44", fontFamily: "Inter, sans-serif", fontWeight: 700 }}>Absences</h2>
                      </div>
                      <p className="mb-0 text-xs sm:text-sm md:text-base" style={{ color: "#041A44", fontFamily: "Inter, sans-serif", fontWeight: 400, lineHeight: 1.6, textAlign: "justify" }}>A student who fails to meet requirement (no. 1) may request admission and upon approval of the Dean shall be placed on probation with reduced load.</p>
                    </div>

                    {/* Third Blue Container: Absences from Class */}
                    <div className="rounded-lg p-2 sm:p-4 md:p-6 mb-0" style={{ backgroundColor: "#C4D7F0" }}>
                      <div className="flex items-center mb-3 sm:mb-4">
                        <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-full flex items-center justify-center text-white font-bold text-xs sm:text-sm" style={{ minWidth: "32px", backgroundColor: "#041A44", marginRight: "12px" }}>3</div>
                        <h2 className="text-base sm:text-lg md:text-xl font-bold" style={{ color: "#041A44", fontFamily: "Inter, sans-serif", fontWeight: 700 }}>Absences from Class</h2>
                      </div>
                      <p className="mb-0 text-xs sm:text-sm md:text-base" style={{ color: "#041A44", fontFamily: "Inter, sans-serif", fontWeight: 400, lineHeight: 1.6, textAlign: "justify" }}>A student who fails at least 67% he has enrolled in shall be dropped from the college. Such a student may apply for admission to another college upon recommendation of the College Dean to the school which he/she is seeking admission.</p>
                    </div>
                  </div>
                </>
              )}
            </div>
          )}

          {/* Section IX: Instructional Program */}
          {selectedSection === 9 && (
            <div className="w-full">
              {isBasicEducation ? (
                <>
                  {/* Section Header */}
                  <div className="bg-white rounded-lg shadow-sm p-4 sm:p-6 md:p-8 mb-4 sm:mb-6 mt-4 sm:mt-6 md:mt-8" style={{ backgroundColor: "#041A44" }}>
                    <div className="text-xs sm:text-sm mb-3 sm:mb-4 px-2 sm:px-3 py-1 bg-blue-100 text-blue-800 rounded-full inline-block" style={{ backgroundColor: "transparent", color: "white", border: "1px solid white" }}>
                      Section IX
                    </div>
                    <h2 className="text-base sm:text-xl md:text-2xl font-bold mb-3 sm:mb-4" style={{ color: "white", fontFamily: "Inter, sans-serif", fontWeight: 700 }}>
                      TUTORIAL POLICY
                    </h2>
                    <p className="text-gray-600 mb-0 text-[10px] sm:text-sm md:text-base" style={{ color: "white", fontFamily: "Inter, sans-serif", fontWeight: 400 }}>
                      Guidelines for academic tutoring support
                    </p>
                  </div>

                  {/* Main White Container */}
                  <div className="rounded-lg shadow-sm p-4 mb-6" style={{ backgroundColor: "#FFFFFF" }}>
                    {/* Tutorial Policy Content - Light Blue Container */}
                    <div className="rounded-lg p-4 mb-4" style={{ backgroundColor: "#C4D7F0" }}>
                      <div className="space-y-4">
                        <p className="font-normal leading-relaxed" style={{ color: "#041A44", fontFamily: "Inter, sans-serif", fontWeight: 400, fontSize: "13px" }}>
                          Tutoring shall be given only to those pupils/students who are in need of extra aid in the accomplishment of their studies. It shall only be considered as "follow-up" to support the pupil/student and if/she can be on his/her own, tutoring shall be stopped. No teacher is allowed to tutor his/her own pupil/student.
                        </p>

                        <p className="font-normal leading-relaxed" style={{ color: "#041A44", fontFamily: "Inter, sans-serif", fontWeight: 400, fontSize: "13px" }}>
                          Parents shall be requested to check frequently with tutors on the progress of their child/children.
                        </p>

                        <p className="font-normal leading-relaxed" style={{ color: "#041A44", fontFamily: "Inter, sans-serif", fontWeight: 400, fontSize: "13px" }}>
                          However, they shall not be permitted to confer with tutors before or during class hours. The school teaching personnel, who is employed to tutor shall see to it that he/she does not use any time he/she is supposed to render service to the school in tutoring.
                        </p>

                        <h3 className="font-bold mb-3" style={{ color: "#041A44", fontFamily: "Inter, sans-serif", fontWeight: 700, fontSize: "15px" }}>• Transfer</h3>

                        <p className="font-normal leading-relaxed" style={{ color: "#041A44", fontFamily: "Inter, sans-serif", fontWeight: 400, fontSize: "13px" }}>
                          Students/pupil seeking transfer or leave the school must settle their financial and property obligations before their transfer credentials will be released. Withholding of credentials due to financial obligation may be imposed on the student/pupil (see Dep.Ed Order #88, s. 2010, p, 67.)
                        </p>
                      </div>
                    </div>
                  </div>
                </>
              ) : (
                <>
                  {/* Section Header */}
                  <div className="bg-white rounded-lg shadow-sm p-4 sm:p-6 md:p-8 mb-4 sm:mb-6 mt-4 sm:mt-6 md:mt-8" style={{ backgroundColor: "#041A44" }}>
                    <div className="text-xs sm:text-sm mb-3 sm:mb-4 px-2 sm:px-3 py-1 bg-blue-100 text-blue-800 rounded-full inline-block" style={{ backgroundColor: "transparent", color: "white", border: "1px solid white" }}>
                      Section IX
                    </div>
                    <h2 className="text-base sm:text-xl md:text-2xl font-bold mb-3 sm:mb-4" style={{ color: "white", fontFamily: "Inter, sans-serif", fontWeight: 700 }}>
                      INSTRUCTIONAL PROGRAM
                    </h2>
                    <p className="text-gray-600 mb-0 text-[10px] sm:text-sm md:text-base" style={{ color: "white", fontFamily: "Inter, sans-serif", fontWeight: 400 }}>
                      Overview of academic structure and delivery methods
                    </p>
                  </div>

                  {/* Main White Container */}
                  <div className="rounded-lg shadow-sm p-4 sm:p-4 md:p-6 mb-4" style={{ backgroundColor: "#FFFFFF" }}>
                    {/* Overview Header */}
                    <div className="flex items-center mb-3 sm:mb-4">
                      <div className="w-6 h-6 sm:w-8 sm:h-8 rounded-full flex items-center justify-center text-white font-bold text-xs sm:text-sm mr-2 sm:mr-3" style={{ backgroundColor: "#041A44" }}>A.</div>
                      <h3 className="font-bold mb-0 text-sm sm:text-base md:text-lg" style={{ color: "#041A44", fontFamily: "Inter, sans-serif", fontWeight: 700 }}>OVERVIEW</h3>
                    </div>

                    {/* First Blue Container */}
                    <div className="rounded-lg p-3 sm:p-3 md:p-4 mb-3 sm:mb-4" style={{ backgroundColor: "#C4D7F0" }}>
                      <div className="flex items-start mb-2 sm:mb-3">
                        <span className="font-bold mr-2 sm:mr-3 text-sm sm:text-base md:text-lg" style={{ color: "#041A44", fontFamily: "Inter, sans-serif" }}>1</span>
                      </div>
                      <p className="mb-0 text-sm sm:text-sm md:text-base" style={{ color: "#041A44", fontFamily: "Inter, sans-serif", fontWeight: 400, lineHeight: 1.6, textAlign: "justify" }}>
                        Consolatrix College of Toledo City, Inc. curriculum, guided by the Core values of the institution, aims to provide instructional programs that will transform young men and women to become globally competitive, 21st century learners. The curriculum is designed to reinforce the development of the 4Cs of 21st Century (Communication, Collaboration, Critical Thinking and Creativity) among its students with Christian values so that they will become conscientious citizens of this world.
                      </p>
                    </div>

                    {/* Second Blue Container */}
                    <div className="rounded-lg p-3 sm:p-3 md:p-4 mb-3 sm:mb-4" style={{ backgroundColor: "#C4D7F0" }}>
                      <div className="flex items-start mb-2 sm:mb-3">
                        <span className="font-bold mr-2 sm:mr-3 text-sm sm:text-base md:text-lg" style={{ color: "#041A44", fontFamily: "Inter, sans-serif" }}>2</span>
                      </div>
                      <p className="mb-0 text-sm sm:text-sm md:text-base" style={{ color: "#041A44", fontFamily: "Inter, sans-serif", fontWeight: 400, lineHeight: 1.6, textAlign: "justify" }}>
                        Social responsibility and awareness are strong values being emphasized in each area of learning through lived practice and real-world application of skills and understanding. The curriculum is geared toward forming the students to become key people of the future who are equipped with media and information technology literacy which is necessary to respond to the global trend of continued development and innovations with strong foundations of Christian Faith, Service, and Communion in Augustinian Recollect Spirituality. However, while the focus is on Theology, other disciplines are also given ample importance to achieve a holistic and well-rounded formation of the students.
                      </p>
                    </div>

                    {/* Third Blue Container */}
                    <div className="rounded-lg p-3 sm:p-3 md:p-4 mb-3 sm:mb-4" style={{ backgroundColor: "#C4D7F0" }}>
                      <div className="flex items-start mb-2 sm:mb-3">
                        <span className="font-bold mr-2 sm:mr-3 text-sm sm:text-base md:text-lg" style={{ color: "#041A44", fontFamily: "Inter, sans-serif" }}>3</span>
                      </div>
                      <p className="mb-0 text-sm sm:text-sm md:text-base" style={{ color: "#041A44", fontFamily: "Inter, sans-serif", fontWeight: 400, lineHeight: 1.6, textAlign: "justify" }}>
                        The school also provides co- curricular activities to develop the physical, social, and artistic interest of the students. In terms of instruction and assessments, all teachers are enjoined to employ a learner-centered and experiential approaches to maximize the potentials of every student.
                      </p>
                    </div>

                    {/* Fourth Blue Container */}
                    <div className="rounded-lg p-3 sm:p-3 md:p-4 mb-0" style={{ backgroundColor: "#C4D7F0" }}>
                      <div className="flex items-start mb-2 sm:mb-3">
                        <span className="font-bold mr-2 sm:mr-3 text-sm sm:text-base md:text-lg" style={{ color: "#041A44", fontFamily: "Inter, sans-serif" }}>4</span>
                      </div>
                      <p className="mb-0 text-sm sm:text-sm md:text-base" style={{ color: "#041A44", fontFamily: "Inter, sans-serif", fontWeight: 400, lineHeight: 1.6, textAlign: "justify" }}>
                        All learning processes shall accord prime focus to having the students learn and, inspiring them to yearn for learning and lifelong learners through discovery and problem-based learning models. The teachers shall have the students engage in authentic assessment processes to aptly gauge their progress and development - making the entire learning process truly relevant to and reflective of the students' capacities, interests, and needs as young people in the blended learning.
                      </p>
                    </div>
                  </div>
                </>
              )}
            </div>
          )}

          {/* Section X: Honorable Dismissal */}
          {selectedSection === 10 && (
            <div className="w-full">
              {isBasicEducation ? (
                <>
                  {/* Section Header */}
                  <div className="bg-white rounded-lg shadow-sm p-4 sm:p-6 md:p-8 mb-4 sm:mb-6 mt-4 sm:mt-6 md:mt-8" style={{ backgroundColor: "#041A44" }}>
                    <div className="text-xs sm:text-sm mb-3 sm:mb-4 px-2 sm:px-3 py-1 bg-blue-100 text-blue-800 rounded-full inline-block" style={{ backgroundColor: "transparent", color: "white", border: "1px solid white" }}>
                      Section X
                    </div>
                    <h2 className="text-base sm:text-xl md:text-2xl font-bold mb-3 sm:mb-4" style={{ color: "white", fontFamily: "Inter, sans-serif", fontWeight: 700 }}>
                      NON-ACADEMIC POLICIES
                    </h2>
                    <p className="text-gray-600 mb-0 text-[10px] sm:text-sm md:text-base" style={{ color: "white", fontFamily: "Inter, sans-serif", fontWeight: 400 }}>
                      Guidelines beyond academics
                    </p>
                  </div>

                  {/* Main White Container */}
                  <div className="rounded-lg shadow-sm p-4 sm:p-6 md:p-8 mb-4 sm:mb-6" style={{ backgroundColor: "#FFFFFF" }}>
                    {/* Policy A: ID Cards */}
                    <div className="rounded-lg p-5 mb-6" style={{ backgroundColor: "#C4D7F0" }}>
                      <div className="flex items-start mb-4">
                        <div className="w-10 h-10 rounded-full flex items-center justify-center mr-3 flex-shrink-0" style={{ backgroundColor: "#041A44", fontFamily: "Inter, sans-serif", fontWeight: 700, color: "white", fontSize: "14px" }}>
                          A
                        </div>
                        <h2 className="font-bold leading-10" style={{ color: "#041A44", fontSize: "15px", fontFamily: "Inter, sans-serif", fontWeight: 700 }}>ID Cards</h2>
                      </div>
                      <p className="font-normal leading-relaxed" style={{ color: "#041A44", fontFamily: "Inter, sans-serif", fontWeight: 400, fontSize: "13px" }}>
                        Each student is required to secure the official student ID card. This ID card is to be worn upon entering and while inside the school premises or when visiting the school for school transaction purposes.
                      </p>
                      <p className="font-normal leading-relaxed ml-4" style={{ color: "#041A44", fontFamily: "Inter, sans-serif", fontWeight: 400, fontSize: "13px" }}>
                        For security reasons, a parent, relative, guardian or any authorized representative or fetcher of a pupil should secure a validated ID from the Accounting Office.
                      </p>
                    </div>

                    {/* Policy B: Lost IDs */}
                    <div className="rounded-lg p-5 mb-6" style={{ backgroundColor: "#C4D7F0" }}>
                      <div className="flex items-start mb-4">
                        <div className="w-10 h-10 rounded-full flex items-center justify-center mr-3 flex-shrink-0" style={{ backgroundColor: "#041A44", fontFamily: "Inter, sans-serif", fontWeight: 700, color: "white", fontSize: "14px" }}>
                          B
                        </div>
                        <h2 className="font-bold leading-10" style={{ color: "#041A44", fontSize: "15px", fontFamily: "Inter, sans-serif", fontWeight: 700 }}>Lost IDs</h2>
                      </div>
                      <p className="font-normal leading-relaxed" style={{ color: "#041A44", fontFamily: "Inter, sans-serif", fontWeight: 400, fontSize: "13px" }}>
                        The loss of an ID should be promptly reported to the Office of the Principal. The report, whether written or verbal must be accompanied with an Affidavit of Loss. Pending the acquisition of a new ID, the student is issued a provisional ID duly signed by the Guidance facilitator.
                      </p>
                    </div>

                    {/* Policy C: Uniforms */}
                    <div className="rounded-lg p-5 mb-6" style={{ backgroundColor: "#C4D7F0" }}>
                      <div className="flex items-start mb-4">
                        <div className="w-10 h-10 rounded-full flex items-center justify-center mr-3 flex-shrink-0" style={{ backgroundColor: "#041A44", fontFamily: "Inter, sans-serif", fontWeight: 700, color: "white", fontSize: "14px" }}>
                          C
                        </div>
                        <h2 className="font-bold leading-10" style={{ color: "#041A44", fontSize: "15px", fontFamily: "Inter, sans-serif", fontWeight: 700 }}>Uniforms</h2>
                      </div>
                      <p className="font-normal leading-relaxed" style={{ color: "#041A44", fontFamily: "Inter, sans-serif", fontWeight: 400, fontSize: "13px" }}>
                        All students are required to wear their complete uniform required by the school.
                      </p>
                    </div>
                  </div>
                </>
              ) : (
                <>
                  {/* Section Header */}
                  <div className="bg-white rounded-lg shadow-sm p-4 sm:p-6 md:p-8 mb-4 sm:mb-6 mt-4 sm:mt-6 md:mt-8" style={{ backgroundColor: "#041A44" }}>
                    <div className="text-xs sm:text-sm mb-3 sm:mb-4 px-2 sm:px-3 py-1 bg-blue-100 text-blue-800 rounded-full inline-block" style={{ backgroundColor: "transparent", color: "white", border: "1px solid white" }}>
                      Section X
                    </div>
                    <h2 className="text-base sm:text-xl md:text-2xl font-bold mb-3 sm:mb-4" style={{ color: "white", fontFamily: "Inter, sans-serif", fontWeight: 700 }}>
                      HONORABLE DISMISSAL
                    </h2>
                    <p className="text-gray-600 mb-0 text-[10px] sm:text-sm md:text-base" style={{ color: "white", fontFamily: "Inter, sans-serif", fontWeight: 400 }}>
                      Certificate for cleared students transferring to another school
                    </p>
                  </div>

                  {/* Main White Container */}
                  <div className="rounded-lg shadow-sm p-3 sm:p-4 mb-4 sm:mb-6" style={{ backgroundColor: "#FFFFFF" }}>
                    {/* First Blue Container */}
                    <div className="rounded-lg p-2 sm:p-3 mb-2 sm:mb-3" style={{ backgroundColor: "#C4D7F0" }}>
                      <div className="flex items-start">
                        <div className="w-2 h-2 rounded-full flex-shrink-0 mt-1.5 sm:mt-2 mr-2 sm:mr-3" style={{ backgroundColor: "#041A44" }}></div>
                        <p className="mb-0 text-xs sm:text-sm md:text-base" style={{ color: "#041A44", fontFamily: "Inter, sans-serif", fontWeight: 400, lineHeight: 1.6, textAlign: "justify" }}>
                          A certificate of an Honorable Dismissal is issued by the School Registrar, when student voluntarily withdraw from the College to transfer to another school.
                        </p>
                      </div>
                    </div>

                    {/* Second Blue Container */}
                    <div className="rounded-lg p-2 sm:p-3 mb-0" style={{ backgroundColor: "#C4D7F0" }}>
                      <div className="flex items-start">
                        <div className="w-2 h-2 rounded-full flex-shrink-0 mt-1.5 sm:mt-2 mr-2 sm:mr-3" style={{ backgroundColor: "#041A44" }}></div>
                        <p className="mb-0 text-xs sm:text-sm md:text-base" style={{ color: "#041A44", fontFamily: "Inter, sans-serif", fontWeight: 400, lineHeight: 1.6, textAlign: "justify" }}>
                          Students applying for a Certificate of Honorable Dismissal must be cleared of all accountabilities before the certificate is issued.
                        </p>
                      </div>
                    </div>
                  </div>
                </>
              )}
            </div>
          )}

          {/* Section XI: Rules of Discipline (Basic Education) / Examinations (College) */}
          {selectedSection === 11 && (
            <div className="w-full">
              {isBasicEducation ? (
                <>
                  {/* Section Header */}
                  <div className="bg-white rounded-lg shadow-sm p-4 sm:p-6 md:p-8 mb-4 sm:mb-6 mt-4 sm:mt-6 md:mt-8" style={{ backgroundColor: "#041A44" }}>
                    <div className="text-xs sm:text-sm mb-3 sm:mb-4 px-2 sm:px-3 py-1 bg-blue-100 text-blue-800 rounded-full inline-block" style={{ backgroundColor: "transparent", color: "white", border: "1px solid white" }}>
                      Section XI
                    </div>
                    <h2 className="text-base sm:text-xl md:text-2xl font-bold mb-3 sm:mb-4" style={{ color: "white", fontFamily: "Inter, sans-serif", fontWeight: 700 }}>
                      RULES OF DISCIPLINE
                    </h2>
                    <p className="text-gray-600 mb-0 text-[10px] sm:text-sm md:text-base" style={{ color: "white", fontFamily: "Inter, sans-serif", fontWeight: 400 }}>
                      Policies regarding final assessments and removal of incomplete academic records
                    </p>
                  </div>

                  {/* Main White Container */}
                  <div className="rounded-lg shadow-sm p-4 sm:p-6 md:p-8 mb-4 sm:mb-6" style={{ backgroundColor: "#FFFFFF" }}>
                    {/* Introduction Paragraphs in Light Blue Container */}
                    <div className="rounded-lg p-8 mb-6" style={{ backgroundColor: "#C4D7F0", boxShadow: "0 2px 4px rgba(0, 0, 0, 0.1)" }}>
                      <div className="space-y-4">
                        <p className="font-normal leading-relaxed" style={{ color: "#041A44", fontFamily: "Inter, sans-serif", fontWeight: 400, fontSize: "13px" }}>
                          CCTC promulgates a discipline program constituting a clear set of rules and regulations to institute order and to develop the sense of obedience, responsibility, and commitment among the students. This program is geared towards making every student participate meaningfully in the community. The chief goals of which are: education of values, promotion of self-awareness and self-understanding, and development of moral courage and imagination.
                        </p>

                        <p className="font-normal leading-relaxed" style={{ color: "#041A44", fontFamily: "Inter, sans-serif", fontWeight: 400, fontSize: "13px" }}>
                          As students discover their membership in a wider community, it is hoped that they will grow in respect and concern for others, appreciation for the role of authority; understanding the true spirit of the regulations; and charity and consideration in their actions towards others.
                        </p>

                        <p className="font-normal leading-relaxed" style={{ color: "#041A44", fontFamily: "Inter, sans-serif", fontWeight: 400, fontSize: "13px" }}>
                          The regulations prescribed in this handbook applies to students during the entire duration of their residency in the school including vacations/ breaks, or any period of intermission regardless of one's registration status.
                        </p>
                      </div>
                    </div>

                    {/* Section A: Persons in Authority */}
                    <div className="rounded-lg p-5 mb-6" style={{ backgroundColor: "#C4D7F0" }}>
                      <div className="flex items-start mb-4">
                        <div className="w-10 h-10 rounded-full flex items-center justify-center mr-3 flex-shrink-0" style={{ backgroundColor: "#041A44", fontFamily: "Inter, sans-serif", fontWeight: 700, color: "white", fontSize: "14px" }}>
                          A
                        </div>
                        <h2 className="font-bold leading-10" style={{ color: "#041A44", fontSize: "15px", fontFamily: "Inter, sans-serif", fontWeight: 700 }}>Persons in Authority</h2>
                      </div>
                      <p className="font-normal leading-relaxed mb-3" style={{ color: "#041A44", fontFamily: "Inter, sans-serif", fontWeight: 400, fontSize: "13px" }}>
                        The administrators, faculty members, and authorized school personnel including non-teaching staff, maintenance and security personnel are recognized persons in authority and are duty-bound to enforce the school's policies and rules of discipline.
                      </p>
                      <p className="font-normal leading-relaxed" style={{ color: "#041A44", fontFamily: "Inter, sans-serif", fontWeight: 400, fontSize: "13px" }}>
                        When authorized, these personnel may direct and supervise the good order of student activities. They shall have the right to call the attention and/or refer any student violating the school rules and regulations to proper school authority for appropriate action.
                      </p>
                    </div>

                    {/* Section B: Student Discipline Committee */}
                    <div className="rounded-lg p-5 mb-6" style={{ backgroundColor: "#C4D7F0" }}>
                      <div className="flex items-start mb-4">
                        <div className="w-10 h-10 rounded-full flex items-center justify-center mr-3 flex-shrink-0" style={{ backgroundColor: "#041A44", fontFamily: "Inter, sans-serif", fontWeight: 700, color: "white", fontSize: "14px" }}>
                          B
                        </div>
                        <h2 className="font-bold leading-10" style={{ color: "#041A44", fontSize: "15px", fontFamily: "Inter, sans-serif", fontWeight: 700 }}>STUDENT DISCIPLINE COMMITTEE (SDC)</h2>
                      </div>
                      <p className="font-normal leading-relaxed mb-3" style={{ color: "#041A44", fontFamily: "Inter, sans-serif", fontWeight: 400, fontSize: "13px" }}>
                        A separate committee is created by the school to handle cases concerning child protection as specified by the policy. The Student Discipline Committee will take charge in all investigations, summons, information and recommend sanctions to any student violating the rules and regulations of the school.
                      </p>
                      <p className="font-normal leading-relaxed mb-3" style={{ color: "#041A44", fontFamily: "Inter, sans-serif", fontWeight: 400, fontSize: "13px" }}>
                        The Student Discipline Committee is comprised of the following:
                      </p>
                      <div className="space-y-2" style={{ color: "#041A44", fontFamily: "Inter, sans-serif", fontWeight: 400, fontSize: "13px" }}>
                        <div>a. Chairperson - School Head / Principal</div>
                        <div>b. Vice-Chairperson - Student Formation Coordinator (SFC)</div>
                        <div>c. Members:</div>
                        <div className="ml-4 space-y-1">
                          <div>c.1 Representatives of the teachers as designated by the SAB</div>
                          <div>c.2 Representative of the Community (chosen by the SAB) or Barangay official preferably, a PTA member</div>
                          <div>c.3 Representative of the Student Council (ARSC President)</div>
                        </div>
                      </div>
                    </div>

                    {/* NB Note Section */}
                    <div className="rounded-lg p-5 mb-6" style={{ backgroundColor: "#C4D7F0", boxShadow: "0 2px 4px rgba(0, 0, 0, 0.1)" }}>
                      <p className="font-normal leading-relaxed italic" style={{ color: "#041A44", fontFamily: "Inter, sans-serif", fontWeight: 400, fontSize: "13px" }}>
                        <strong>NB:</strong> During deliberation of <strong>case/s,</strong> <strong>utmost prudence and discernment must be exercised</strong> <strong>before the student representative will be allowed to attend the case proceedings;</strong> the decision rests upon the vote of the <strong>SAB (due diligence will be exercised by the SAB) and special permit by the student's parents should be obtained beforehand.</strong>
                      </p>
                    </div>
                  </div>
                </>
              ) : (
                <>
                  {/* Section Header */}
                  <div className="bg-white rounded-lg shadow-sm p-4 sm:p-6 md:p-8 mb-4 sm:mb-6 mt-4 sm:mt-6 md:mt-8" style={{ backgroundColor: "#041A44" }}>
                    <div className="text-xs sm:text-sm mb-3 sm:mb-4 px-2 sm:px-3 py-1 bg-blue-100 text-blue-800 rounded-full inline-block" style={{ backgroundColor: "transparent", color: "white", border: "1px solid white" }}>
                      Section XI
                    </div>
                    <h2 className="text-base sm:text-xl md:text-2xl font-bold mb-3 sm:mb-4" style={{ color: "white", fontFamily: "Inter, sans-serif", fontWeight: 700 }}>
                      EXAMINATIONS /REMOVAL OF INCOMPLETE GRADES
                    </h2>
                    <p className="text-gray-600 mb-0 text-[10px] sm:text-sm md:text-base" style={{ color: "white", fontFamily: "Inter, sans-serif", fontWeight: 400 }}>
                      Policies regarding final assessments and removal of incomplete academic records
                    </p>
                  </div>

                  {/* Main White Container */}
                  <div className="rounded-lg shadow-sm p-6 mb-4" style={{ backgroundColor: "#FFFFFF" }}>
                    {/* First Section: Examinations */}
                    <div className="rounded-lg p-4 mb-4" style={{ backgroundColor: "#C4D7F0" }}>
                      <div className="flex items-center mb-3">
                        <div className="w-8 h-8 rounded-full flex items-center justify-center text-white font-bold text-sm mr-3" style={{ backgroundColor: "#041A44" }}>1</div>
                        <h3 className="font-bold mb-0" style={{ color: "#041A44", fontFamily: "Inter, sans-serif", fontWeight: 700, fontSize: "18px" }}>Examinations</h3>
                      </div>
                      <p className="mb-3" style={{ color: "#041A44", fontFamily: "Inter, sans-serif", fontWeight: 400, fontSize: "15px", lineHeight: 1.6, textAlign: "justify" }}>
                        The schedule of examinations as specified in the school calendar for the school year, shall be observed unless otherwise changed to another date as authorized by the College Dean.
                      </p>
                      <p className="mb-3" style={{ color: "#041A44", fontFamily: "Inter, sans-serif", fontWeight: 400, fontSize: "15px", lineHeight: 1.6, textAlign: "justify" }}>
                        The maximum period for each examination is one and a half hours. An examination permit must be secured by the student from the Accounting Office and he must present this to the faculty/proctor before taking the examination.
                      </p>
                      <p className="mb-0" style={{ color: "#041A44", fontFamily: "Inter, sans-serif", fontWeight: 400, fontSize: "15px", lineHeight: 1.6, textAlign: "justify" }}>
                        Any form of cheating during an examination results to an automatic failure for that particular examination.
                      </p>
                    </div>

                    {/* Second Section: Removal of Incomplete Grades */}
                    <div className="rounded-lg p-4 mb-0" style={{ backgroundColor: "#C4D7F0" }}>
                      <div className="flex items-center mb-3">
                        <div className="w-8 h-8 rounded-full flex items-center justify-center text-white font-bold text-sm mr-3" style={{ backgroundColor: "#041A44" }}>2</div>
                        <h3 className="font-bold mb-0" style={{ color: "#041A44", fontFamily: "Inter, sans-serif", fontWeight: 700, fontSize: "18px" }}>Removal of Incomplete Grades</h3>
                      </div>
                      <p className="mb-3" style={{ color: "#041A44", fontFamily: "Inter, sans-serif", fontWeight: 400, fontSize: "15px", lineHeight: 1.6, textAlign: "justify" }}>
                        A student must complete an INC within one academic year. Failure to do so within the prescribed period results in an automatic failure or a grade of 5.0.
                      </p>
                      <p className="mb-3" style={{ color: "#041A44", fontFamily: "Inter, sans-serif", fontWeight: 400, fontSize: "15px", lineHeight: 1.6, textAlign: "justify" }}>
                        A student shall secure a Completion Form from the Registrar's Office and furnish a copy for the College Dean and Instructor.
                      </p>
                      <p className="mb-0" style={{ color: "#041A44", fontFamily: "Inter, sans-serif", fontWeight: 400, fontSize: "15px", lineHeight: 1.6, textAlign: "justify" }}>
                        A student should pay the corresponding fee for the completion of grades and in turn, present the Completion Form to the professor concerned who will ask the student to complete the requirements such as taking an examination and/or submission of a term paper. After having satisfactorily complied with the requirements, the professor shall complete the grades of the student and submits them immediately to the Registrar's Office.
                      </p>
                    </div>
                  </div>
                </>
              )}
            </div>
          )}

          {/* Section XII: Graduation Requirements, Honors and Awards */}
          {selectedSection === 12 && (
            <div className="w-full">
              {isBasicEducation ? (
                <>
                  {/* Section Header */}
                  <div className="bg-white rounded-lg shadow-sm p-4 sm:p-6 md:p-8 mb-4 sm:mb-6 mt-4 sm:mt-6 md:mt-8" style={{ backgroundColor: "#041A44" }}>
                    <div className="text-xs sm:text-sm mb-3 sm:mb-4 px-2 sm:px-3 py-1 bg-blue-100 text-blue-800 rounded-full inline-block" style={{ backgroundColor: "transparent", color: "white", border: "1px solid white" }}>
                      Section XII
                    </div>
                    <h2 className="text-base sm:text-xl md:text-2xl font-bold mb-3 sm:mb-4" style={{ color: "white", fontFamily: "Inter, sans-serif", fontWeight: 700 }}>
                      CCTC CHILD PROTECTION POLICY
                    </h2>
                    <p style={{ fontFamily: "Inter, sans-serif", fontSize: "15px", fontWeight: 400, color: "white", marginBottom: "4px" }}>
                      (Based on Deped Order No 40. S. 2012)
                    </p>
                    <p style={{ fontFamily: "Inter, sans-serif", fontSize: "15px", fontWeight: 400, color: "white", marginBottom: 0 }}>
                      Policy for student safety and rights
                    </p>
                  </div>

                  {/* Main White Container */}
                  <div className="rounded-lg shadow-sm p-4 sm:p-6 md:p-8 mb-4 sm:mb-6" style={{ backgroundColor: "#FFFFFF" }}>
                    {/* Numbered Policy Points in Light Blue Container */}
                    <div className="rounded-lg p-8 mb-6" style={{ backgroundColor: "#C4D7F0", boxShadow: "0 2px 4px rgba(0, 0, 0, 0.1)" }}>
                      <div className="space-y-4">
                        <div className="font-normal leading-relaxed" style={{ color: "#041A44", fontFamily: "Inter, sans-serif", fontWeight: 400, fontSize: "13px" }}>
                          <strong>1.</strong> Foremost of all considerations, CCTC teachers and learning facilitators shall act as substitute parents. They are empowered to exercise the special parental authority and responsibility over the child under their supervision, instruction, care and adhere to a positive and non-violent discipline of children.
                        </div>

                        <div className="font-normal leading-relaxed" style={{ color: "#041A44", fontFamily: "Inter, sans-serif", fontWeight: 400, fontSize: "13px" }}>
                          <strong>2.</strong> The school adopts a zero-tolerance policy for any act of child abuse, exploitation, violence, discrimination, bullying and other forms of abuse.
                        </div>

                        <div className="font-normal leading-relaxed" style={{ color: "#041A44", fontFamily: "Inter, sans-serif", fontWeight: 400, fontSize: "13px" }}>
                          <strong>3.</strong> Pursuant to the Charter on the Rights of Children (CRC), our school is committed to protect pupils and students from all forms of physical or mental violence, injury and abuse, neglect or negligent treatment, maltreatment and exploitation. Violations of which by any pupil/student will subject one to the procedures outlined in the Students Handbook and any personnel will be subjected to the procedures in the Operational Handbook.
                        </div>

                        <div className="font-normal leading-relaxed" style={{ color: "#041A44", fontFamily: "Inter, sans-serif", fontWeight: 400, fontSize: "13px" }}>
                          <strong>4.</strong> Furthermore, in the spirit of the nation's Constitutions, the school shall: inculcate in the pupils and students patriotism and nationalism, foster love of humanity, respect for human rights, appreciation for the role of national heroes in the historical development of the country, teach the rights and duties of citizenship, strengthen ethical and spiritual values, develop moral character and personal discipline, encourage critical and creative thinking, broaden scientific and technological knowledge, promote vocational efficiency in accordance with the individual pupil's/student's capacity and goodwill.
                        </div>
                      </div>
                    </div>

                    {/* Procedures Section */}
                    <div className="rounded-lg p-5 mb-6" style={{ backgroundColor: "#C4D7F0" }}>
                      <h2 className="font-bold mb-4" style={{ color: "#041A44", fontFamily: "Inter, sans-serif", fontWeight: 700, fontSize: "15px" }}>PROCEDURES:</h2>
                      <h3 className="font-bold mb-3" style={{ color: "#041A44", fontFamily: "Inter, sans-serif", fontWeight: 700, fontSize: "15px" }}>1. Documentation:</h3>
                      <div className="space-y-2 mb-4" style={{ color: "#041A44", fontFamily: "Inter, sans-serif", fontWeight: 400, fontSize: "13px" }}>
                        <div>a. Gather the facts (information, situations, evidences etc.)</div>
                        <div>b. Identify what kind of case and establish the system for notification, referral and assistance for hearing.</div>
                        <div>c. Dialogue with the Student Formation Coordinator (involves the composition of human resources involved and the case)</div>
                        <div>d. Ensure that proper disciplinary measures be applied in accordance to Gospel values and school's policies</div>
                      </div>
                      <p className="font-normal leading-relaxed" style={{ color: "#041A44", fontFamily: "Inter, sans-serif", fontWeight: 400, fontSize: "13px" }}>
                        <strong>Note:</strong> Everything is done in prayerful mode, proper documentation and proper signatures of witness/es and authorities involved in the Child Protection Committee (CPC).
                      </p>
                    </div>

                    {/* Bullying Section */}
                    <div className="rounded-lg p-5 mb-6" style={{ backgroundColor: "#C4D7F0" }}>
                      <h2 className="font-bold mb-3" style={{ color: "#041A44", fontFamily: "Inter, sans-serif", fontWeight: 700, fontSize: "15px" }}>Bullying</h2>
                      <p className="font-normal leading-relaxed" style={{ color: "#041A44", fontFamily: "Inter, sans-serif", fontWeight: 400, fontSize: "13px" }}>
                        means systematically and chronically inflicting physical hurt or psychological distress on one or more students. It is further defined as any unwanted purposeful gesture or written, verbal, graphic, or physical act (including electronically transmitted acts. It may include cyber-bullying (willful harassment and intimidation of a person through the use of digital technologies) and cyber-stalking.
                      </p>
                    </div>

                    {/* Section 2: Reporting */}
                    <div className="rounded-lg p-5 mb-6" style={{ backgroundColor: "#C4D7F0" }}>
                      <h2 className="font-bold mb-3" style={{ color: "#041A44", fontFamily: "Inter, sans-serif", fontWeight: 700, fontSize: "15px" }}>2. Reporting</h2>
                      <p className="font-normal leading-relaxed mb-3" style={{ color: "#041A44", fontFamily: "Inter, sans-serif", fontWeight: 400, fontSize: "13px" }}>
                        Reports of child abuse/bullying should be made as soon as possible after the alleged act or knowledge of it. Failure to report promptly may impair the Child Protection Committee's (CPC) ability to investigate.
                      </p>
                      <p className="font-normal leading-relaxed" style={{ color: "#041A44", fontFamily: "Inter, sans-serif", fontWeight: 400, fontSize: "13px" }}>
                        Any child who believes they have experienced or witnessed abuse/bullying should immediately report the acts to a teacher, counselor, principal, or employee. A report can be made orally or in writing.
                      </p>
                    </div>

                    {/* Section 3: Notice of Report */}
                    <div className="rounded-lg p-5 mb-6" style={{ backgroundColor: "#C4D7F0" }}>
                      <h2 className="font-bold mb-3" style={{ color: "#041A44", fontFamily: "Inter, sans-serif", fontWeight: 700, fontSize: "15px" }}>3. Notice of Report</h2>
                      <p className="font-normal leading-relaxed" style={{ color: "#041A44", fontFamily: "Inter, sans-serif", fontWeight: 400, fontSize: "13px" }}>
                        Any employee or fellow student who receives notice or information about a child experiencing abuse/bullying shall immediately notify the SFC (School Formulation Coordinator) or the Principal.
                      </p>
                    </div>

                    {/* Section 4: Investigation of Report */}
                    <div className="rounded-lg p-5 mb-6" style={{ backgroundColor: "#C4D7F0" }}>
                      <h2 className="font-bold mb-3" style={{ color: "#041A44", fontFamily: "Inter, sans-serif", fontWeight: 700, fontSize: "15px" }}>4. Investigation of Report</h2>
                      <p className="font-normal leading-relaxed mb-3" style={{ color: "#041A44", fontFamily: "Inter, sans-serif", fontWeight: 400, fontSize: "13px" }}>
                        If a report is made orally, the SFC shall reduce it to written form and conduct an appropriate investigation based on the allegations. The SFC then submits the initial report to the Principal for action from the CPC.
                      </p>
                      <p className="font-normal leading-relaxed" style={{ color: "#041A44", fontFamily: "Inter, sans-serif", fontWeight: 400, fontSize: "13px" }}>
                        The Principal shall convene the CPC to develop a plan of action/interventions for the victim and/or perpetrator. Proper prevention and intervention steps will be taken based on the severity of the infraction as outlined in the Student Handbook/Operational Handbook.
                      </p>
                    </div>

                    {/* Section 5: Concluding The Investigation */}
                    <div className="rounded-lg p-5 mb-6" style={{ backgroundColor: "#C4D7F0" }}>
                      <h2 className="font-bold mb-3" style={{ color: "#041A44", fontFamily: "Inter, sans-serif", fontWeight: 700, fontSize: "15px" }}>5. Concluding The Investigation</h2>
                      <p className="font-normal leading-relaxed mb-3" style={{ color: "#041A44", fontFamily: "Inter, sans-serif", fontWeight: 400, fontSize: "13px" }}>
                        In the absence of extenuating circumstances, the investigation should be completed within ten school days from the report date. However, the CPC may take additional time if a thorough investigation is necessary.
                      </p>
                      <p className="font-normal leading-relaxed mb-3" style={{ color: "#041A44", fontFamily: "Inter, sans-serif", fontWeight: 400, fontSize: "13px" }}>
                        *** SFC: School Formulation Coordinator (in charge of school discipline)
                      </p>
                      <p className="font-normal leading-relaxed" style={{ color: "#041A44", fontFamily: "Inter, sans-serif", fontWeight: 400, fontSize: "13px" }}>
                        The Child Protection Committee (CPC) shall prepare a written report of the investigation, including a determination of whether child abuse/bullying occurred, and submit a copy to the Office of the Principal for data collection and reporting purposes.
                      </p>
                    </div>

                    {/* Section 6: School Action */}
                    <div className="rounded-lg p-5 mb-6" style={{ backgroundColor: "#C4D7F0" }}>
                      <h2 className="font-bold mb-3" style={{ color: "#041A44", fontFamily: "Inter, sans-serif", fontWeight: 700, fontSize: "15px" }}>6. School Action</h2>
                      <p className="font-normal leading-relaxed mb-3" style={{ color: "#041A44", fontFamily: "Inter, sans-serif", fontWeight: 400, fontSize: "13px" }}>
                        The CPC will promptly recommend disciplinary or corrective action in accordance with the Student Handbook if an investigation confirms child abuse/bullying.
                      </p>
                      <p className="font-normal leading-relaxed mb-3" style={{ color: "#041A44", fontFamily: "Inter, sans-serif", fontWeight: 400, fontSize: "13px" }}>
                        Victims will be offered counseling services and other interventions, ranging from school counselors to family counsel referrals.
                      </p>
                      <p className="font-normal leading-relaxed mb-3" style={{ color: "#041A44", fontFamily: "Inter, sans-serif", fontWeight: 400, fontSize: "13px" }}>
                        Consequences and remedial actions for students committing harassment or bullying can range from positive behavioral interventions to suspension or expulsion.
                      </p>
                      <p className="font-normal leading-relaxed" style={{ color: "#041A44", fontFamily: "Inter, sans-serif", fontWeight: 400, fontSize: "13px" }}>
                        Consequences for harassment or bullying will be unique to each incident, varying based on the behavior's nature, the student's developmental age, and their history of problem behaviors and performance. The CPC's action will be based on investigation results.
                      </p>
                    </div>

                    {/* Section 7: Confidentiality */}
                    <div className="rounded-lg p-5 mb-6" style={{ backgroundColor: "#C4D7F0" }}>
                      <h2 className="font-bold mb-3" style={{ color: "#041A44", fontFamily: "Inter, sans-serif", fontWeight: 700, fontSize: "15px" }}>7. Confidentiality</h2>
                      <p className="font-normal leading-relaxed" style={{ color: "#041A44", fontFamily: "Inter, sans-serif", fontWeight: 400, fontSize: "13px" }}>
                        School officials shall respect the privacy of the complainant, persons against whom a report is filed, and witnesses to the greatest extent possible. Limited disclosures may be necessary for a thorough investigation.
                      </p>
                    </div>

                    {/* Dangerous Drugs Policy Section */}
                    <div className="rounded-lg p-5 mb-6" style={{ backgroundColor: "#C4D7F0" }}>
                      <h2 className="font-bold mb-3" style={{ color: "#041A44", fontFamily: "Inter, sans-serif", fontWeight: 700, fontSize: "15px" }}>Dangerous Drugs Policy</h2>
                      <p className="font-normal leading-relaxed" style={{ color: "#041A44", fontFamily: "Inter, sans-serif", fontWeight: 400, fontSize: "13px" }}>
                        In compliance with DepEd Order No. 40, s. 2017, the school, with the help of Local Government Units (LGUs) and other agencies, is obligated to provide a healthy, drug-free environment. As a means of intervention and prevention, the school may organize symposia on the potential harm of smoking, alcohol, and illegal drugs.
                      </p>
                    </div>
                  </div>
                </>
              ) : (
                <>
                  {/* Section Header */}
                  <div className="bg-white rounded-lg shadow-sm p-4 sm:p-6 md:p-8 mb-4 sm:mb-6 mt-4 sm:mt-6 md:mt-8" style={{ backgroundColor: "#041A44" }}>
                    <div className="text-xs sm:text-sm mb-3 sm:mb-4 px-2 sm:px-3 py-1 bg-blue-100 text-blue-800 rounded-full inline-block" style={{ backgroundColor: "transparent", color: "white", border: "1px solid white" }}>Section XII</div>
                    <h2 className="text-base sm:text-xl md:text-2xl font-bold mb-3 sm:mb-4" style={{ color: "white", fontFamily: "Inter, sans-serif", fontWeight: 700 }}>
                      GRADUATION REQUIREMENTS, HONORS AND AWARDS
                    </h2>
                    <p className="text-gray-600 mb-0 text-[10px] sm:text-sm md:text-base" style={{ color: "white", fontFamily: "Inter, sans-serif", fontWeight: 400 }}>
                      Policies outlining criteria for graduation, academic honors, and student recognition
                    </p>
                  </div>

              {/* Main White Container for Graduation */}
              <div className="rounded-lg shadow-sm p-6 mb-4" style={{ backgroundColor: "#FFFFFF" }}>
                {/* Graduation Header */}
                <div className="flex items-center mb-4">
                  <div className="rounded-full flex items-center justify-center text-white font-bold text-sm mr-3" style={{ width: "32px", height: "32px", minWidth: "32px", minHeight: "32px", backgroundColor: "#041A44" }}>1</div>
                  <h3 className="font-bold mb-0" style={{ color: "#041A44", fontFamily: "Inter, sans-serif", fontWeight: 700, fontSize: "16px" }}>Graduation</h3>
                </div>
                {/* Blue Container with Bullets */}
                <div className="rounded-lg p-4 mb-0" style={{ backgroundColor: "#C4D7F0" }}>
                  <ul className="mb-0" style={{ listStyleType: "disc", paddingLeft: "20px", color: "#041A44", fontFamily: "Inter, sans-serif", fontWeight: 400, fontSize: "15px", lineHeight: 1.6 }}>
                    <li className="mb-2">During the First Semester of the School Year, the Senior students shall fill out form requesting for the evaluation of their subjects/grades from the Office of the Registrar.</li>
                    <li className="mb-0">Exit Interview</li>
                  </ul>
                </div>
              </div>

              {/* 2. Honors and Awards White Container */}
              <div className="rounded-lg shadow-sm p-6 mb-4" style={{ backgroundColor: "#FFFFFF" }}>
                {/* Honors and Awards Header */}
                <div className="flex items-center mb-4">
                  <div className="rounded-full flex items-center justify-center text-white font-bold text-sm mr-3" style={{ width: "32px", height: "32px", minWidth: "32px", minHeight: "32px", backgroundColor: "#041A44" }}>2</div>
                  <h3 className="font-bold mb-0" style={{ color: "#041A44", fontFamily: "Inter, sans-serif", fontWeight: 700, fontSize: "16px" }}>Honors and Awards</h3>
                </div>
                {/* Blue Container for General Guidelines */}
                <div className="rounded-lg p-4 mb-4" style={{ backgroundColor: "#C4D7F0" }}>
                  <p className="mb-3" style={{ color: "#041A44", fontFamily: "Inter, sans-serif", fontWeight: 700, fontSize: "15px", lineHeight: 1.6 }}>The following are the guidelines set for determining honors and awards:</p>
                  <ul className="mb-0" style={{ listStyleType: "disc", paddingLeft: "20px", color: "#041A44", fontFamily: "Inter, sans-serif", fontWeight: 400, fontSize: "15px", lineHeight: 1.6 }}>
                    <li className="mb-2">After concluding the midterm examination of second semester, the Office of the Registrar issues the list of candidates who have met the criteria for honors.</li>
                    <li className="mb-2">The Registrar and the College Dean must conduct the initial deliberation and the result will be forwarded to the Program Heads.</li>
                    <li className="mb-0">The Deliberating body composed of the Program Heads, subject instructors, College Dean, Academic & Activity Coordinators will conduct the final deliberation of the honors and awardees.</li>
                  </ul>
                </div>

                {/* Summa Cum Laude Sub-section */}
                <div className="rounded-lg p-4 mb-0" style={{ backgroundColor: "#C4D7F0" }}>
                  <div className="flex items-center mb-3">
                    <div className="rounded-full flex items-center justify-center text-white font-bold mr-3" style={{ backgroundColor: "#041A44", width: "40px", height: "40px", minWidth: "40px", minHeight: "40px", fontSize: "11px" }}>2.1</div>
                    <h4 className="font-bold mb-0" style={{ color: "#041A44", fontFamily: "Inter, sans-serif", fontWeight: 700, fontSize: "15px" }}>SUMMA CUM LAUDE (Gold medal with inscription and certificate of merit)</h4>
                  </div>
                  <p className="mb-2" style={{ color: "#041A44", fontFamily: "Inter, sans-serif", fontWeight: 700, fontSize: "14px", lineHeight: 1.6 }}>Criteria:</p>
                  <ul className="mb-0" style={{ listStyleType: "disc", paddingLeft: "20px", color: "#041A44", fontFamily: "Inter, sans-serif", fontWeight: 400, fontSize: "14px", lineHeight: 1.6, textAlign: "justify" }}>
                    <li className="mb-1">The student maintains his/her place in the honor roll throughout the course;</li>
                    <li className="mb-1">He/ She shall have obtained a general weighted average of 1.1 or higher at the end of the course;</li>
                    <li className="mb-1">He/ She shall not have any final subject grade lower than 1.4 within the course;</li>
                    <li className="mb-1">He/ She shall have been rated as OUTSTANDING (1.0-1.5 or 95%-91% for participation in student activity program consistently;</li>
                    <li className="mb-1">He/ She shall have been rated as OUTSTANDING (1.0-1.5 or 95%-91%) in Theology;</li>
                    <li className="mb-1">He/ She shall have been rated as OUTSTANDING (1.0-1.5 or 95%-91%) in conduct/moral character (exemplary in nature), consistently, throughout the course;</li>
                    <li className="mb-1">He/ She shall have completed the entire course taking the regular subject loads of each semester each time in not more than the number of curricular year required for the course;</li>
                    <li className="mb-1">He/ She shall belong to a graduating class of at least one hundred fifty (150) candidates for graduation in the course he/she is taking;</li>
                    <li className="mb-0">He/ She shall have taken the whole course in the same A.R. School.</li>
                  </ul>
                </div>

                {/* Magna Cum Laude Sub-section */}
                <div className="rounded-lg p-4 mb-4 mt-4" style={{ backgroundColor: "#C4D7F0" }}>
                  <div className="flex items-center mb-3">
                    <div className="rounded-full flex items-center justify-center text-white font-bold mr-3" style={{ backgroundColor: "#041A44", width: "40px", height: "40px", minWidth: "40px", minHeight: "40px", fontSize: "11px" }}>2.2</div>
                    <h4 className="font-bold mb-0" style={{ color: "#041A44", fontFamily: "Inter, sans-serif", fontWeight: 700, fontSize: "15px" }}>MAGNA CUM LAUDE (Gold medal with inscription and certificate of merit)</h4>
                  </div>
                  <p className="mb-2" style={{ color: "#041A44", fontFamily: "Inter, sans-serif", fontWeight: 700, fontSize: "14px", lineHeight: 1.6 }}>Criteria:</p>
                  <ul className="mb-0" style={{ listStyleType: "disc", paddingLeft: "20px", color: "#041A44", fontFamily: "Inter, sans-serif", fontWeight: 400, fontSize: "14px", lineHeight: 1.6, textAlign: "justify" }}>
                    <li className="mb-1">The student shall have maintained his/her place in the honor roll throughout the course;</li>
                    <li className="mb-1">He/ She shall have obtained a general weighted average of 1.3 or higher at the end of the course;</li>
                    <li className="mb-1">He/ She shall not have any final subject grade lower than 1.6 within the course;</li>
                    <li className="mb-1">He/ She shall have been rated as OUTSTANDING (1.0 - 1.5 or 95% - 91%) for participation in student activity program, consistently;</li>
                    <li className="mb-1">He/ She shall have been rated as OUTSTANDING (1.0 - 1.5 or 95%-91%) in Theology;</li>
                    <li className="mb-1">He/ She shall have been rated as OUTSTANDING (Original) (1.0-1.5 or 95%-91%) in conduct/moral character (exemplary in nature) consistently throughout the course;</li>
                    <li className="mb-1">He/ She shall have completed the entire course taking the regular subject loads of each semester in not more than the number of curricular year required for the course;</li>
                    <li className="mb-1">He/ She shall belong to a graduating class of at least of one hundred (100) candidates for graduation in the course he/she is taking, and;</li>
                    <li className="mb-0">He/ She shall have taken the whole course in the same A.R. School/s.</li>
                  </ul>
                </div>

                {/* Cum Laude Sub-section */}
                <div className="rounded-lg p-4 mb-0" style={{ backgroundColor: "#C4D7F0" }}>
                  <div className="flex items-center mb-3">
                    <div className="rounded-full flex items-center justify-center text-white font-bold mr-3" style={{ backgroundColor: "#041A44", width: "40px", height: "40px", minWidth: "40px", minHeight: "40px", fontSize: "11px" }}>2.3</div>
                    <h4 className="font-bold mb-0" style={{ color: "#041A44", fontFamily: "Inter, sans-serif", fontWeight: 700, fontSize: "15px" }}>CUM LAUDE (Gold medal with inscription and certificate of merit)</h4>
                  </div>
                  <p className="mb-2" style={{ color: "#041A44", fontFamily: "Inter, sans-serif", fontWeight: 700, fontSize: "14px", lineHeight: 1.6 }}>Criteria:</p>
                  <ul className="mb-0" style={{ listStyleType: "disc", paddingLeft: "20px", color: "#041A44", fontFamily: "Inter, sans-serif", fontWeight: 400, fontSize: "14px", lineHeight: 1.6, textAlign: "justify" }}>
                    <li className="mb-1">The student shall have maintained his/her place in the honor roll throughout the course;</li>
                    <li className="mb-1">He/ She shall have obtained a general weighted average of 1.4 and 1.5 at the end of the course;</li>
                    <li className="mb-1">He/ She shall not have any final subject grade lower than 1.8 within the course;</li>
                    <li className="mb-1">He/ She shall not have any final subject grade lower than (1.0-1.5 or 95%-91%) for participation in student activity program, consistently;</li>
                    <li className="mb-0">He/ She shall have been rated as OUTSTANDING (1.0- 1.5 r 95%-91%) in Theology.</li>
                  </ul>
                </div>

                {/* Academic Distinction Sub-section */}
                <div className="rounded-lg p-4 mb-4 mt-4" style={{ backgroundColor: "#C4D7F0" }}>
                  <div className="flex items-center mb-3">
                    <div className="rounded-full flex items-center justify-center text-white font-bold mr-3" style={{ backgroundColor: "#041A44", width: "40px", height: "40px", minWidth: "40px", minHeight: "40px", fontSize: "11px" }}>2.4</div>
                    <h4 className="font-bold mb-0" style={{ color: "#041A44", fontFamily: "Inter, sans-serif", fontWeight: 700, fontSize: "15px" }}>ACADEMIC DISTINCTION (Silver medal with inscription and certificate of merit)</h4>
                  </div>
                  <p className="mb-2" style={{ color: "#041A44", fontFamily: "Inter, sans-serif", fontWeight: 700, fontSize: "14px", lineHeight: 1.6 }}>Criteria:</p>
                  <ul className="mb-0" style={{ listStyleType: "disc", paddingLeft: "20px", color: "#041A44", fontFamily: "Inter, sans-serif", fontWeight: 400, fontSize: "14px", lineHeight: 1.6, textAlign: "justify" }}>
                    <li className="mb-1">The student shall have maintained his/her place in the honor roll, at least two (2) years of the course;</li>
                    <li className="mb-1">He/ She shall have obtained a general weighted average of 1.8 or higher in the last two years of the course;</li>
                    <li className="mb-1">He/ She shall not have any final subject grade lower than 2.0 within the course;</li>
                    <li className="mb-1">He/ She shall have been rated as VERY GOOD (1.6-2.0 or 86%-90%) for participation in student activity program consistently;</li>
                    <li className="mb-1">He/ She shall have been rated as OUTSTANDING (1.0-1.5 or 95%-91%) in conduct/moral character (exemplary in nature) consistently throughout the course.</li>
                    <li className="mb-0">He/ She shall have taken the regular subject loads each semester during the school year.</li>
                  </ul>
                </div>

                {/* Policy on Special Awards Sub-section */}
                <div className="rounded-lg p-4 mb-4" style={{ backgroundColor: "#C4D7F0" }}>
                  <div className="flex items-center mb-3">
                    <div className="rounded-full flex items-center justify-center text-white font-bold mr-3" style={{ backgroundColor: "#041A44", width: "40px", height: "40px", minWidth: "40px", minHeight: "40px", fontSize: "11px" }}>2.5</div>
                    <h4 className="font-bold mb-0" style={{ color: "#041A44", fontFamily: "Inter, sans-serif", fontWeight: 700, fontSize: "15px" }}>POLICY ON SPECIAL AWARDS</h4>
                  </div>
                  <p className="mb-0" style={{ color: "#041A44", fontFamily: "Inter, sans-serif", fontWeight: 400, fontSize: "14px", lineHeight: 1.6 }}>(Granted to deserving students at the end of the school year)</p>
                </div>

                {/* CARS Gold Medal Award Sub-section */}
                <div className="rounded-lg p-4 mb-0" style={{ backgroundColor: "#C4D7F0" }}>
                  <div className="flex items-center mb-3">
                    <div className="rounded-full flex items-center justify-center text-white font-bold mr-3" style={{ backgroundColor: "#041A44", width: "40px", height: "40px", minWidth: "40px", minHeight: "40px", fontSize: "11px" }}>2.6</div>
                    <h4 className="font-bold mb-0" style={{ color: "#041A44", fontFamily: "Inter, sans-serif", fontWeight: 700, fontSize: "15px" }}>CARS GOLD MEDAL AWARD and Citation to the Most Outstanding student. This award is granted ONLY to a graduating student who meets the following criteria:</h4>
                  </div>
                  <ul className="mb-0" style={{ listStyleType: "disc", paddingLeft: "20px", color: "#041A44", fontFamily: "Inter, sans-serif", fontWeight: 400, fontSize: "14px", lineHeight: 1.6, textAlign: "justify" }}>
                    <li className="mb-2">Academic Excellence in all the curriculum years of the course-consistently in the honor roll;</li>
                    <li className="mb-0">Consistently exemplary and has been rated 91.00% or higher in the following:
                      <ul style={{ listStyleType: "disc", paddingLeft: "20px", marginTop: "8px" }}>
                        <li className="mb-1">Religion with Values Education</li>
                        <li className="mb-0">Leadership</li>
                      </ul>
                    </li>
                  </ul>
                </div>

                {/* Leadership Award Sub-section */}
                <div className="rounded-lg p-4 mb-4 mt-4" style={{ backgroundColor: "#C4D7F0" }}>
                  <div className="flex items-center mb-3">
                    <div className="rounded-full flex items-center justify-center text-white font-bold mr-3" style={{ backgroundColor: "#041A44", width: "40px", height: "40px", minWidth: "40px", minHeight: "40px", fontSize: "11px" }}>2.7</div>
                    <h4 className="font-bold mb-0" style={{ color: "#041A44", fontFamily: "Inter, sans-serif", fontWeight: 700, fontSize: "15px" }}>LEADERSHIP AWARD is given to a student who manifests the following:</h4>
                  </div>
                  <ul className="mb-0" style={{ listStyleType: "disc", paddingLeft: "20px", color: "#041A44", fontFamily: "Inter, sans-serif", fontWeight: 400, fontSize: "14px", lineHeight: 1.6, textAlign: "justify" }}>
                    <li className="mb-1">Competence in doing any task assigned</li>
                    <li className="mb-1">Ability to mobilize and motivate one's group</li>
                    <li className="mb-1">Is respectful and respectable and could command respect</li>
                    <li className="mb-1">An example of selfless dedication to any task assigned</li>
                    <li className="mb-1">Constancy and consistency in one's fulfillment of duties</li>
                    <li className="mb-1">Fidelity and conscientiousness in being a leader of one's group</li>
                    <li className="mb-1">Is an active leader of not less than two (2) co-curricular activities</li>
                    <li className="mb-1">Regularity and punctuality in reporting about the tasks one is assigned</li>
                    <li className="mb-0">Has good academic standing of at least 87.00% or higher</li>
                  </ul>
                </div>

                {/* Loyalty Award Sub-section */}
                <div className="rounded-lg p-4 mb-0" style={{ backgroundColor: "#C4D7F0" }}>
                  <div className="flex items-center mb-3">
                    <div className="rounded-full flex items-center justify-center text-white font-bold mr-3" style={{ backgroundColor: "#041A44", width: "40px", height: "40px", minWidth: "40px", minHeight: "40px", fontSize: "11px" }}>2.8</div>
                    <h4 className="font-bold mb-0" style={{ color: "#041A44", fontFamily: "Inter, sans-serif", fontWeight: 700, fontSize: "15px" }}>LOYALTY AWARD</h4>
                  </div>
                  <p className="mb-0" style={{ color: "#041A44", fontFamily: "Inter, sans-serif", fontWeight: 400, fontSize: "14px", lineHeight: 1.6 }}>Loyalty award is given to a graduating student who has studied in CCTC since Grade 7 Junior High School.</p>
                </div>
              </div>
                </>
              )}
            </div>
          )}

          {/* Section XIII: Disciplinary Measures */}
          {selectedSection === 13 && (
            <div className="w-full">
              {isBasicEducation ? (
                <>
                  {/* Section Header */}
                  <div className="bg-white rounded-lg shadow-sm p-4 sm:p-6 md:p-8 mb-4 sm:mb-6 mt-4 sm:mt-6 md:mt-8" style={{ backgroundColor: "#041A44" }}>
                    <div className="text-xs sm:text-sm mb-3 sm:mb-4 px-2 sm:px-3 py-1 bg-blue-100 text-blue-800 rounded-full inline-block" style={{ backgroundColor: "transparent", color: "white", border: "1px solid white" }}>
                      Section XIII
                    </div>
                    <h2 className="text-base sm:text-xl md:text-2xl font-bold mb-3 sm:mb-4" style={{ color: "white", fontFamily: "Inter, sans-serif", fontWeight: 700 }}>
                      DISCIPLINARY MEASURES
                    </h2>
                    <p className="text-gray-600 mb-0 text-[10px] sm:text-sm md:text-base" style={{ color: "white", fontFamily: "Inter, sans-serif", fontWeight: 400 }}>
                      Policies governing student conduct, violations, and corresponding disciplinary actions
                    </p>
                  </div>

                  {/* Main White Container */}
                  <div className="rounded-lg shadow-sm p-4 sm:p-6 md:p-8 mb-4 sm:mb-6" style={{ backgroundColor: "#FFFFFF" }}>
                    {/* The Students Code of Conduct */}
                    <div className="rounded-lg p-5 mb-6" style={{ backgroundColor: "#C4D7F0" }}>
                      <h2 className="font-bold mb-3" style={{ color: "#041A44", fontFamily: "Inter, sans-serif", fontWeight: 700, fontSize: "15px" }}>The Students Code of Conduct</h2>
                      <p className="font-normal leading-relaxed" style={{ color: "#041A44", fontFamily: "Inter, sans-serif", fontWeight: 400, fontSize: "13px" }}>
                        All students of Consolatrix College of Toledo City, Inc. are expected to conduct themselves properly, to respect the rights of their fellow students, faculty members, school administrators, school authorities and employees. They must preserve the human dignity and uphold the name of the school at all times.
                      </p>
                    </div>

                    {/* DRESS CODE */}
                    <div className="rounded-lg p-5 mb-6" style={{ backgroundColor: "#C4D7F0" }}>
                      <h2 className="font-bold mb-3" style={{ color: "#041A44", fontFamily: "Inter, sans-serif", fontWeight: 700, fontSize: "15px" }}>DRESS CODE</h2>
                      <p className="font-normal leading-relaxed mb-3" style={{ color: "#041A44", fontFamily: "Inter, sans-serif", fontWeight: 400, fontSize: "13px" }}>
                        All students shall wear the prescribed proper school uniform in coming to school. Wearing inappropriate attire is subject to disciplinary actions.
                      </p>
                      <div className="space-y-1" style={{ color: "#041A44", fontFamily: "Inter, sans-serif", fontWeight: 400, fontSize: "13px" }}>
                        <div>• Wearing of PE uniform is on Wednesdays and during PE classes only</div>
                      </div>
                    </div>

                    {/* IMPROPER ATTIRE */}
                    <div className="rounded-lg p-5 mb-6" style={{ backgroundColor: "#C4D7F0", boxShadow: "0 2px 4px rgba(0, 0, 0, 0.1)" }}>
                      <div className="rounded-lg p-5" style={{ backgroundColor: "#FFFFFF" }}>
                        <h2 className="font-bold mb-3" style={{ color: "#041A44", fontFamily: "Inter, sans-serif", fontWeight: 700, fontSize: "15px" }}>IMPROPER ATTIRE</h2>
                        <p className="font-normal leading-relaxed mb-3" style={{ color: "#041A44", fontFamily: "Inter, sans-serif", fontWeight: 400, fontSize: "13px" }}>
                          Anyone wearing any of these listed below is not allowed to enter the school.
                        </p>
                        <div className="space-y-1" style={{ color: "#041A44", fontFamily: "Inter, sans-serif", fontWeight: 400, fontSize: "13px" }}>
                          <div>• Leggings, mini- skirts and short pants</div>
                          <div>• Backless, strapless, plunging neckline or spaghetti strap dresses</div>
                          <div>• See-through clothing</div>
                          <div>• Slippers, Flip flops, open/jelly shoes or barefooted</div>
                          <div>• Tokong</div>
                          <div>• Clothing that shows gang membership, or printed with obscene messages that depict racial discord or promote illegal activities, drugs, and alcohol or tobacco product</div>
                        </div>
                      </div>
                    </div>

                    {/* OFFENSES AND SANCTIONS */}
                    <div className="rounded-lg p-5 mb-6" style={{ backgroundColor: "#C4D7F0" }}>
                      <h2 className="font-bold mb-4" style={{ color: "#041A44", fontFamily: "Inter, sans-serif", fontWeight: 700, fontSize: "15px" }}>OFFENSES AND SANCTIONS</h2>
                      
                      <h3 className="font-bold mb-3" style={{ color: "#041A44", fontFamily: "Inter, sans-serif", fontWeight: 700, fontSize: "15px" }}>Corrective Measures for Minor Offenses:</h3>
                      
                      {/* White Container for Table */}
                      <div className="rounded-lg p-4 mb-4" style={{ backgroundColor: "#FFFFFF", border: "1px solid #E5E7EB" }}>
                        {/* Table for Corrective Measures */}
                        <table className="w-full" style={{ borderCollapse: "collapse", width: "100%", border: "1px solid #DEE2E6" }}>
                          <tbody>
                            <tr>
                              <td className="px-3 py-2" style={{ color: "#041A44", fontFamily: "Inter, sans-serif", fontWeight: 400, fontSize: "13px", border: "1px solid #DEE2E6", backgroundColor: "#FFFFFF", verticalAlign: "top" }}>First Offense</td>
                              <td className="px-3 py-2" style={{ color: "#041A44", fontFamily: "Inter, sans-serif", fontWeight: 400, fontSize: "13px", border: "1px solid #DEE2E6", backgroundColor: "#FFFFFF", verticalAlign: "top" }}>Verbal Reprimand & Counselling</td>
                            </tr>
                            <tr>
                              <td className="px-3 py-2" style={{ color: "#041A44", fontFamily: "Inter, sans-serif", fontWeight: 400, fontSize: "13px", border: "1px solid #DEE2E6", backgroundColor: "#FFFFFF", verticalAlign: "top" }}>Second Offense</td>
                              <td className="px-3 py-2" style={{ color: "#041A44", fontFamily: "Inter, sans-serif", fontWeight: 400, fontSize: "13px", border: "1px solid #DEE2E6", backgroundColor: "#FFFFFF", verticalAlign: "top" }}>Counselling or administrative service (8)hours</td>
                            </tr>
                            <tr>
                              <td className="px-3 py-2" style={{ color: "#041A44", fontFamily: "Inter, sans-serif", fontWeight: 400, fontSize: "13px", border: "1px solid #DEE2E6", backgroundColor: "#FFFFFF", verticalAlign: "top" }}>Third Offense</td>
                              <td className="px-3 py-2" style={{ color: "#041A44", fontFamily: "Inter, sans-serif", fontWeight: 400, fontSize: "13px", border: "1px solid #DEE2E6", backgroundColor: "#FFFFFF", verticalAlign: "top" }}>Considered as first offense on major violations, therefore, transformative intervention will be imposed (written summon for parents or guardian of the students will be issued by the guidance counselor. The presence of parent or legal guardian is required for those with major violations).</td>
                            </tr>
                          </tbody>
                        </table>
                      </div>
                      
                      <h3 className="font-bold mb-3" style={{ color: "#041A44", fontFamily: "Inter, sans-serif", fontWeight: 700, fontSize: "15px" }}>a. The following are considered as Minor Offenses:</h3>
                      
                      <div className="space-y-1" style={{ color: "#041A44", fontFamily: "Inter, sans-serif", fontWeight: 400, fontSize: "13px" }}>
                        <div>• Not wearing the proper uniform</div>
                        <div>• Not following the hair code</div>
                        <div>• Not wearing the proper ID or wearing the ID of someone else or lending out one's ID</div>
                        <div>• Wearing a cap or hat inside the classroom during classes</div>
                        <div>• Piercing the tongue, the nose and other parts of the body and putting earrings or pins</div>
                        <div>• Wearing of earrings among male students</div>
                        <div>• Disturbing the normal flow of the school activities</div>
                        <div>• Littering within the school premises</div>
                        <div>• Using or charging of electronic equipment, toys, games, or other disruptive items during class or school activities such as cellphones, MP3 players, video games and portable electronic devices and the like</div>
                        <div>• Using of gadgets during school programs</div>
                        <div>• Not using comfort rooms properly, such as throwing of napkins inside the toilet bowl, not flushing the toilet and stepping on the bowl, etc.</div>
                        <div>• Loitering</div>
                        <div>• Unauthorized using of school facilities</div>
                        <div>• Misbehaving</div>
                        <div>• Unjust vexation or pestering</div>
                        <div>• Possessing of obscene or pornographic materials within the school premises</div>
                        <div>• Possessing of any gambling paraphernalia</div>
                        <div>• Selling, collecting unauthorized payments and contributions, soliciting and raising funds without permission/approval from the school authorities;</div>
                        <div>• Unauthorized posting of school/class materials like activity sheets/forms/documents/ instructions, quizzes and answers on social networking sites;</div>
                        <div>• Forging, tampering or falsifying official documents like school records, student's and parent's permit, excuse letters, official receipts, school ID, official notices, clearances, and letters to and from parents;</div>
                        <div>• Using the name of the school, the school seal, or the school logo without due permission from the school authorities;</div>
                        <div>• Practicing dishonesty in dealing with any person connected with the school and its client;</div>
                        <div>• Circulating false and/or malicious information and/or accusations against the institution or its authorities, school personnel or other students in any form</div>
                        <div>• Cutting classes</div>
                      </div>
                    </div>

                    {/* Major Offenses Sanctions */}
                    <div className="rounded-lg p-5 mb-6" style={{ backgroundColor: "#C4D7F0" }}>
                      <div className="flex items-start mb-4">
                        <div className="w-10 h-10 rounded-full flex items-center justify-center mr-3 flex-shrink-0" style={{ backgroundColor: "#041A44", fontFamily: "Inter, sans-serif", fontWeight: 700, color: "white", fontSize: "14px" }}>
                          6.2
                        </div>
                        <h2 className="font-bold leading-10" style={{ color: "#041A44", fontSize: "15px", fontFamily: "Inter, sans-serif", fontWeight: 700 }}>Major Offenses Sanctions</h2>
                      </div>
                      <p className="font-normal leading-relaxed mb-4" style={{ color: "#041A44", fontFamily: "Inter, sans-serif", fontWeight: 400, fontSize: "13px" }}>
                        Any student who has been found guilty of the following violations shall be meted the corresponding sanctions after due process, to wit: (Major Offense)
                      </p>
                      
                      {/* Table for Major Offenses Sanctions */}
                      <div className="overflow-x-auto mb-4">
                        <table className="w-full border-collapse" style={{ border: "1px solid white" }}>
                          <tbody>
                            <tr>
                              <td className="px-3 py-2 font-bold" style={{ color: "#041A44", fontFamily: "Inter, sans-serif", fontWeight: 400, fontSize: "13px", border: "1px solid white" }}>First Offense</td>
                              <td className="px-3 py-2" style={{ color: "#041A44", fontFamily: "Inter, sans-serif", fontWeight: 400, fontSize: "13px", border: "1px solid white" }}>
                                <strong>Suspension</strong><br />
                                The school will temporarily disallow the errant student from entering his/her class for a number of days depending on the gravity of his/her offense which should not exceed 20% of the prescribed school days in a school year.
                              </td>
                            </tr>
                            <tr>
                              <td className="px-3 py-2 font-bold" style={{ color: "#041A44", fontFamily: "Inter, sans-serif", fontWeight: 400, fontSize: "13px", border: "1px solid white" }}>Second Offense</td>
                              <td className="px-3 py-2" style={{ color: "#041A44", fontFamily: "Inter, sans-serif", fontWeight: 400, fontSize: "13px", border: "1px solid white" }}>
                                <strong>Suspension</strong><br />
                                The school refuses a student admission to the school due to the violation of a major offense which is still subject to review and evaluation (1 year suspension)
                              </td>
                            </tr>
                            <tr>
                              <td className="px-3 py-2 font-bold" style={{ color: "#041A44", fontFamily: "Inter, sans-serif", fontWeight: 400, fontSize: "13px", border: "1px solid white" }}>Third Offense</td>
                              <td className="px-3 py-2" style={{ color: "#041A44", fontFamily: "Inter, sans-serif", fontWeight: 400, fontSize: "13px", border: "1px solid white" }}>
                                <strong>Non-Re Admission</strong><br />
                                The school denied Admission or enrolment of the erring student for the academic year immediately following the semester when the resolution or decision finding the student guilty of offense charged and imposing the penalty of non-re admission was promulgated.
                              </td>
                            </tr>
                          </tbody>
                        </table>
                      </div>
                    </div>

                    {/* Major Offenses List */}
                    <div className="rounded-lg p-5 mb-6" style={{ backgroundColor: "#C4D7F0" }}>
                      <h2 className="font-bold mb-2" style={{ color: "#041A44", fontFamily: "Inter, sans-serif", fontWeight: 700, fontSize: "15px" }}>The following are considered as Major Offenses:</h2>
                      <p className="mb-4" style={{ color: "#041A44", fontFamily: "Inter, sans-serif", fontWeight: 400, fontSize: "13px" }}>(Violations of these major offenses may result to dismissal from the CCTC)</p>
                      
                      {/* Table for Major Offenses */}
                      <div className="overflow-x-auto mb-4">
                        <table className="w-full border-collapse" style={{ border: "1px solid white" }}>
                          <thead>
                            <tr style={{ backgroundColor: "#041A44", fontFamily: "Inter, sans-serif", fontWeight: 700 }}>
                              <th className="px-3 py-2 text-left text-white font-bold" style={{ fontSize: "13px", border: "1px solid white" }}>Offenses</th>
                              <th className="px-3 py-2 text-left text-white font-bold" style={{ fontSize: "13px", border: "1px solid white" }}>Meaning</th>
                            </tr>
                          </thead>
                          <tbody>
                            <tr>
                              <td className="px-3 py-2" style={{ color: "#041A44", fontFamily: "Inter, sans-serif", fontWeight: 400, fontSize: "13px", border: "1px solid white" }}>Inflicting harm physically and emotionally especially using profane or obscene language</td>
                              <td className="px-3 py-2" style={{ color: "#041A44", fontFamily: "Inter, sans-serif", fontWeight: 400, fontSize: "13px", border: "1px solid white" }}>Such as hitting, kicking and other similar acts.</td>
                            </tr>
                            <tr>
                              <td className="px-3 py-2" style={{ color: "#041A44", fontFamily: "Inter, sans-serif", fontWeight: 400, fontSize: "13px", border: "1px solid white" }}>Public Display of Affection (PDA)</td>
                              <td className="px-3 py-2" style={{ color: "#041A44", fontFamily: "Inter, sans-serif", fontWeight: 400, fontSize: "13px", border: "1px solid white" }}>Such as petting, necking and other sexual acts.</td>
                            </tr>
                            <tr>
                              <td className="px-3 py-2" style={{ color: "#041A44", fontFamily: "Inter, sans-serif", fontWeight: 400, fontSize: "13px", border: "1px solid white" }}>Verbal Abuse</td>
                              <td className="px-3 py-2" style={{ color: "#041A44", fontFamily: "Inter, sans-serif", fontWeight: 400, fontSize: "13px", border: "1px solid white" }}>Inflicting verbal harm on another person.</td>
                            </tr>
                            <tr>
                              <td className="px-3 py-2" style={{ color: "#041A44", fontFamily: "Inter, sans-serif", fontWeight: 400, fontSize: "13px", border: "1px solid white" }}>Unauthorized possession of deadly weapons (in CCTC)</td>
                              <td className="px-3 py-2" style={{ color: "#041A44", fontFamily: "Inter, sans-serif", fontWeight: 400, fontSize: "13px", border: "1px solid white" }}></td>
                            </tr>
                            <tr>
                              <td className="px-3 py-2" style={{ color: "#041A44", fontFamily: "Inter, sans-serif", fontWeight: 400, fontSize: "13px", border: "1px solid white" }}>Possession or use of drugs, alcohol or any controlled substance inside the school premises</td>
                              <td className="px-3 py-2" style={{ color: "#041A44", fontFamily: "Inter, sans-serif", fontWeight: 400, fontSize: "13px", border: "1px solid white" }}>Illegal possession, distribution or use of drugs, chemical, alcohol or any intoxicant, marijuana, shabu, ecstasy, cocaine, solvent, rugby, pills and hallucinogenic drugs, intoxicants such as cigars, e-cigarettes, and the like.</td>
                            </tr>
                            <tr>
                              <td className="px-3 py-2" style={{ color: "#041A44", fontFamily: "Inter, sans-serif", fontWeight: 400, fontSize: "13px", border: "1px solid white" }}>Plagiarism</td>
                              <td className="px-3 py-2" style={{ color: "#041A44", fontFamily: "Inter, sans-serif", fontWeight: 400, fontSize: "13px", border: "1px solid white" }}>Using the work of another student or any other person without proper acknowledgement or credit given. The RA 8293 otherwise known as the Intellectual Property Code of the Philippines must be enforced.</td>
                            </tr>
                            <tr>
                              <td className="px-3 py-2" style={{ color: "#041A44", fontFamily: "Inter, sans-serif", fontWeight: 400, fontSize: "13px", border: "1px solid white" }}>Fabrication of school documents</td>
                              <td className="px-3 py-2" style={{ color: "#041A44", fontFamily: "Inter, sans-serif", fontWeight: 400, fontSize: "13px", border: "1px solid white" }}>Engaging in forgery of persons in authority, school officers, faculty, heads and staff and falsification of school documents and school records.</td>
                            </tr>
                            <tr>
                              <td className="px-3 py-2" style={{ color: "#041A44", fontFamily: "Inter, sans-serif", fontWeight: 400, fontSize: "13px", border: "1px solid white" }}>Theft and Stealing</td>
                              <td className="px-3 py-2" style={{ color: "#041A44", fontFamily: "Inter, sans-serif", fontWeight: 400, fontSize: "13px", border: "1px solid white" }}>Illegal or unauthorized reproduction of school materials and other pertinent documents.</td>
                            </tr>
                            <tr>
                              <td className="px-3 py-2" style={{ color: "#041A44", fontFamily: "Inter, sans-serif", fontWeight: 400, fontSize: "13px", border: "1px solid white" }}>Malicious mischief</td>
                              <td className="px-3 py-2" style={{ color: "#041A44", fontFamily: "Inter, sans-serif", fontWeight: 400, fontSize: "13px", border: "1px solid white" }}>Taking of any item which belongs to another person without the latter's consent.</td>
                            </tr>
                            <tr>
                              <td className="px-3 py-2" style={{ color: "#041A44", fontFamily: "Inter, sans-serif", fontWeight: 400, fontSize: "13px", border: "1px solid white" }}>Bullying</td>
                              <td className="px-3 py-2" style={{ color: "#041A44", fontFamily: "Inter, sans-serif", fontWeight: 400, fontSize: "13px", border: "1px solid white" }}>Intentionally damaging the personal property of other person (institution is required).</td>
                            </tr>
                            <tr>
                              <td className="px-3 py-2" style={{ color: "#041A44", fontFamily: "Inter, sans-serif", fontWeight: 400, fontSize: "13px", border: "1px solid white" }}>Organizing that are contrary to the objectives of the college</td>
                              <td className="px-3 py-2" style={{ color: "#041A44", fontFamily: "Inter, sans-serif", fontWeight: 400, fontSize: "13px", border: "1px solid white" }}>Any form of bullying within the school premises or within school equipment.</td>
                            </tr>
                            <tr>
                              <td className="px-3 py-2" style={{ color: "#041A44", fontFamily: "Inter, sans-serif", fontWeight: 400, fontSize: "13px", border: "1px solid white" }}>Disrespect, disobedience or defiance of school authorities</td>
                              <td className="px-3 py-2" style={{ color: "#041A44", fontFamily: "Inter, sans-serif", fontWeight: 400, fontSize: "13px", border: "1px solid white" }}>Non-compliance with the instruction of persons in authority or defiance of school rules and regulations. (e.g. faculty, staff, maintenance personnel, student and visitor).</td>
                            </tr>
                            <tr>
                              <td className="px-3 py-2" style={{ color: "#041A44", fontFamily: "Inter, sans-serif", fontWeight: 400, fontSize: "13px", border: "1px solid white" }}>Arson</td>
                              <td className="px-3 py-2" style={{ color: "#041A44", fontFamily: "Inter, sans-serif", fontWeight: 400, fontSize: "13px", border: "1px solid white" }}>Setting other properties of damage to school property.</td>
                            </tr>
                            <tr>
                              <td className="px-3 py-2" style={{ color: "#041A44", fontFamily: "Inter, sans-serif", fontWeight: 400, fontSize: "13px", border: "1px solid white" }}>Sexual Assault / Rape / Harassment</td>
                              <td className="px-3 py-2" style={{ color: "#041A44", fontFamily: "Inter, sans-serif", fontWeight: 400, fontSize: "13px", border: "1px solid white" }}>Refers to RA 9262 otherwise known as Anti-Sexual Harassment Law RA 7877 otherwise known as Anti-Rape Law of 1997. Violation of Safe Space Act.</td>
                            </tr>
                            <tr>
                              <td className="px-3 py-2" style={{ color: "#041A44", fontFamily: "Inter, sans-serif", fontWeight: 400, fontSize: "13px", border: "1px solid white" }}>Bullying/Cyber Bullying</td>
                              <td className="px-3 py-2" style={{ color: "#041A44", fontFamily: "Inter, sans-serif", fontWeight: 400, fontSize: "13px", border: "1px solid white" }}>Refers to the provisions in Anti-Bullying Act of 2013. Using the internet and social networks to bully or harass a student or person in authority.</td>
                            </tr>
                            <tr>
                              <td className="px-3 py-2" style={{ color: "#041A44", fontFamily: "Inter, sans-serif", fontWeight: 400, fontSize: "13px", border: "1px solid white" }}>Malversation of funds</td>
                              <td className="px-3 py-2" style={{ color: "#041A44", fontFamily: "Inter, sans-serif", fontWeight: 400, fontSize: "13px", border: "1px solid white" }}>Using organization funds for personal use/ tampering of receipts / using funds without consultation with the member and advisor of the organization.</td>
                            </tr>
                            <tr>
                              <td className="px-3 py-2" style={{ color: "#041A44", fontFamily: "Inter, sans-serif", fontWeight: 400, fontSize: "13px", border: "1px solid white" }}>Hazing</td>
                              <td className="px-3 py-2" style={{ color: "#041A44", fontFamily: "Inter, sans-serif", fontWeight: 400, fontSize: "13px", border: "1px solid white" }}>Refers to the provision in Anti-Hazing Law of 2018 otherwise known as RA 8049.</td>
                            </tr>
                            <tr>
                              <td className="px-3 py-2" style={{ color: "#041A44", fontFamily: "Inter, sans-serif", fontWeight: 400, fontSize: "13px", border: "1px solid white" }}>Failure or refusal to comply with school safety rules and regulations</td>
                              <td className="px-3 py-2" style={{ color: "#041A44", fontFamily: "Inter, sans-serif", fontWeight: 400, fontSize: "13px", border: "1px solid white" }}>Includes, inasmuch public health standards and other school safety and health regulation.</td>
                            </tr>
                            <tr>
                              <td className="px-3 py-2" style={{ color: "#041A44", fontFamily: "Inter, sans-serif", fontWeight: 400, fontSize: "13px", border: "1px solid white" }}>Threatening, coercing, harassing, black mailing, disturbing school administration, faculty members, and fellow students</td>
                              <td className="px-3 py-2" style={{ color: "#041A44", fontFamily: "Inter, sans-serif", fontWeight: 400, fontSize: "13px", border: "1px solid white" }}></td>
                            </tr>
                            <tr>
                              <td className="px-3 py-2" style={{ color: "#041A44", fontFamily: "Inter, sans-serif", fontWeight: 400, fontSize: "13px", border: "1px solid white" }}>Engaging in lewd acts, prostitution and the like</td>
                              <td className="px-3 py-2" style={{ color: "#041A44", fontFamily: "Inter, sans-serif", fontWeight: 400, fontSize: "13px", border: "1px solid white" }}></td>
                            </tr>
                            <tr>
                              <td className="px-3 py-2" style={{ color: "#041A44", fontFamily: "Inter, sans-serif", fontWeight: 400, fontSize: "13px", border: "1px solid white" }}>Acts, omission, commission or circumstance tending towards illicit practices such as but not limited to abortion, contraception and the like.</td>
                              <td className="px-3 py-2" style={{ color: "#041A44", fontFamily: "Inter, sans-serif", fontWeight: 400, fontSize: "13px", border: "1px solid white" }}></td>
                            </tr>
                            <tr>
                              <td className="px-3 py-2" style={{ color: "#041A44", fontFamily: "Inter, sans-serif", fontWeight: 400, fontSize: "13px", border: "1px solid white" }}>Bomb threat</td>
                              <td className="px-3 py-2" style={{ color: "#041A44", fontFamily: "Inter, sans-serif", fontWeight: 400, fontSize: "13px", border: "1px solid white" }}></td>
                            </tr>
                            <tr>
                              <td className="px-3 py-2" style={{ color: "#041A44", fontFamily: "Inter, sans-serif", fontWeight: 400, fontSize: "13px", border: "1px solid white" }}>Engaging in cult or similar concerted activities resulting in disruption of classes without permission from proper authorities</td>
                              <td className="px-3 py-2" style={{ color: "#041A44", fontFamily: "Inter, sans-serif", fontWeight: 400, fontSize: "13px", border: "1px solid white" }}></td>
                            </tr>
                            <tr>
                              <td className="px-3 py-2" style={{ color: "#041A44", fontFamily: "Inter, sans-serif", fontWeight: 400, fontSize: "13px", border: "1px solid white" }}>Entering the campus while under the influence of alcohol, drugs or any illicit substance</td>
                              <td className="px-3 py-2" style={{ color: "#041A44", fontFamily: "Inter, sans-serif", fontWeight: 400, fontSize: "13px", border: "1px solid white" }}></td>
                            </tr>
                            <tr>
                              <td className="px-3 py-2" style={{ color: "#041A44", fontFamily: "Inter, sans-serif", fontWeight: 400, fontSize: "13px", border: "1px solid white" }}>Cheating in any form</td>
                              <td className="px-3 py-2" style={{ color: "#041A44", fontFamily: "Inter, sans-serif", fontWeight: 400, fontSize: "13px", border: "1px solid white" }}></td>
                            </tr>
                            <tr>
                              <td className="px-3 py-2" style={{ color: "#041A44", fontFamily: "Inter, sans-serif", fontWeight: 400, fontSize: "13px", border: "1px solid white" }}>Data Privacy Act of 2012</td>
                              <td className="px-3 py-2" style={{ color: "#041A44", fontFamily: "Inter, sans-serif", fontWeight: 400, fontSize: "13px", border: "1px solid white" }}></td>
                            </tr>
                            <tr>
                              <td className="px-3 py-2" style={{ color: "#041A44", fontFamily: "Inter, sans-serif", fontWeight: 400, fontSize: "13px", border: "1px solid white" }}>Damage to school property (includes direct damage to school property)</td>
                              <td className="px-3 py-2" style={{ color: "#041A44", fontFamily: "Inter, sans-serif", fontWeight: 400, fontSize: "13px", border: "1px solid white" }}></td>
                            </tr>
                            <tr>
                              <td className="px-3 py-2" style={{ color: "#041A44", fontFamily: "Inter, sans-serif", fontWeight: 400, fontSize: "13px", border: "1px solid white" }}>Smoking/Vaping</td>
                              <td className="px-3 py-2" style={{ color: "#041A44", fontFamily: "Inter, sans-serif", fontWeight: 400, fontSize: "13px", border: "1px solid white" }}></td>
                            </tr>
                            <tr>
                              <td className="px-3 py-2" style={{ color: "#041A44", fontFamily: "Inter, sans-serif", fontWeight: 400, fontSize: "13px", border: "1px solid white" }}>Creating religious and/or cult groups to harass students and other persons</td>
                              <td className="px-3 py-2" style={{ color: "#041A44", fontFamily: "Inter, sans-serif", fontWeight: 400, fontSize: "13px", border: "1px solid white" }}>City Ordinance (creating offensive, vulgar, rude or obscene gestures).</td>
                            </tr>
                            <tr>
                              <td className="px-3 py-2" style={{ color: "#041A44", fontFamily: "Inter, sans-serif", fontWeight: 400, fontSize: "13px", border: "1px solid white" }}>Vandalism</td>
                              <td className="px-3 py-2" style={{ color: "#041A44", fontFamily: "Inter, sans-serif", fontWeight: 400, fontSize: "13px", border: "1px solid white" }}></td>
                            </tr>
                            <tr>
                              <td className="px-3 py-2" style={{ color: "#041A44", fontFamily: "Inter, sans-serif", fontWeight: 400, fontSize: "13px", border: "1px solid white" }}>Debt, Cyber libel</td>
                              <td className="px-3 py-2" style={{ color: "#041A44", fontFamily: "Inter, sans-serif", fontWeight: 400, fontSize: "13px", border: "1px solid white" }}></td>
                            </tr>
                            <tr>
                              <td className="px-3 py-2" style={{ color: "#041A44", fontFamily: "Inter, sans-serif", fontWeight: 400, fontSize: "13px", border: "1px solid white" }}>INDECENT BEHAVIOR</td>
                              <td className="px-3 py-2" style={{ color: "#041A44", fontFamily: "Inter, sans-serif", fontWeight: 400, fontSize: "13px", border: "1px solid white" }}></td>
                            </tr>
                          </tbody>
                        </table>
                      </div>
                    </div>

                    {/* Additional Policies */}
                    <div className="rounded-lg p-5 mb-6" style={{ backgroundColor: "#C4D7F0" }}>
                      <div className="space-y-3" style={{ color: "#041A44", fontFamily: "Inter, sans-serif", fontWeight: 400, fontSize: "13px" }}>
                        <p>• Teenage pregnancy will be handled through a specific intervention by the school authorities to address the sensitive nature of the case.</p>
                        <p>• The Prefect of Discipline and the Student Discipline Committee shall have the power to determine whether or not the offense herein shall be considered minor or major depending on the gravity of the offense.</p>
                        <p>Sanctions to be imposed on offenses not covered in this handbook shall be recommended by the prefect of discipline and student discipline committee to the Directress without prejudice to the rights of students to due process.</p>
                        <p>Sanctions for all offenses are subject to appropriate disciplinary measures commensurate to the gravity of the offense committed.</p>
                        <p>The sanction for offenses where there are properties damaged or person/s injured shall include replacement/ restoration/ compensation without prejudice to other sanctions. The same rule applies to when there are stolen properties not returned have been substantially damaged or when money itself is stolen.</p>
                        <p>Students who have been sanctioned or have undergone disciplinary action are required to issue a written apology.</p>
                        <p>Violations of rules and regulations promulgated by the Department of Higher Education (CHED) duly implemented by the school shall be evaluated based on the above. All disciplinary measures are applicable during face to face class, seamless blended learning or virtual activities.</p>
                      </div>
                    </div>
                  </div>
                </>
              ) : (
                <>
                  {/* Section Header */}
                  <div className="bg-white rounded-lg shadow-sm p-4 sm:p-6 md:p-8 mb-4 sm:mb-6 mt-4 sm:mt-6 md:mt-8" style={{ backgroundColor: "#041A44" }}>
                    <div className="text-xs sm:text-sm mb-3 sm:mb-4 px-2 sm:px-3 py-1 bg-blue-100 text-blue-800 rounded-full inline-block" style={{ backgroundColor: "transparent", color: "white", border: "1px solid white" }}>
                      Section XIII
                    </div>
                    <h2 className="text-base sm:text-xl md:text-2xl font-bold mb-3 sm:mb-4" style={{ color: "white", fontFamily: "Inter, sans-serif", fontWeight: 700 }}>
                      COLLEGE DISCIPLINARY MEASURES
                    </h2>
                    <p className="text-gray-600 mb-0 text-[10px] sm:text-sm md:text-base" style={{ color: "white", fontFamily: "Inter, sans-serif", fontWeight: 400 }}>
                      Policies governing student conduct, violations, and corresponding disciplinary actions
                    </p>
                  </div>

              {/* Main White Container */}
              <div className="rounded-lg shadow-sm p-6 mb-4" style={{ backgroundColor: "#FFFFFF" }}>
                {/* Introduction Paragraphs */}
                <p className="mb-4" style={{ color: "#041A44", fontFamily: "Inter, sans-serif", fontWeight: 400, fontSize: "15px", lineHeight: 1.6, textAlign: "justify" }}>
                  CCTC promulgates a discipline program constituting a clear set of rules and regulations to institute order and to develop the sense of obedience, responsibility, and commitment among the students. This program is geared toward making every student participates meaningfully in the community. The chief goals of which are: education of values; promotion of self-awareness and self-understanding, and development of moral courage and imagination.
                </p>

                <p className="mb-4" style={{ color: "#041A44", fontFamily: "Inter, sans-serif", fontWeight: 400, fontSize: "15px", lineHeight: 1.6, textAlign: "justify" }}>
                  As students discover their membership in a wider community, it is hoped that they will grow in respect and concern for others; appreciation for the role of authority; understanding the true spirit of the regulations; and charity and consideration in their actions towards others.
                </p>

                <p className="mb-6" style={{ color: "#041A44", fontFamily: "Inter, sans-serif", fontWeight: 400, fontSize: "15px", lineHeight: 1.6, textAlign: "justify" }}>
                  The regulations prescribed in this handbook apply to students during the entire duration of their residency in the school including vocational breaks, or any period of intermission regardless of their registration status.
                </p>

                {/* Blue Container: Persons in Authority */}
                <div className="rounded-lg p-4 mb-0" style={{ backgroundColor: "#C4D7F0" }}>
                  <div className="flex items-start mb-3">
                    <span className="font-bold mr-3" style={{ color: "#041A44", fontFamily: "Inter, sans-serif", fontSize: "16px" }}>1</span>
                    <h3 className="font-bold" style={{ color: "#041A44", fontFamily: "Inter, sans-serif", fontWeight: 700, fontSize: "16px" }}>PERSONS IN AUTHORITY</h3>
                  </div>
                  <p className="mb-0" style={{ color: "#041A44", fontFamily: "Inter, sans-serif", fontWeight: 400, fontSize: "15px", lineHeight: 1.6, textAlign: "justify" }}>
                    The administrators, faculty members, and authorized school personnel including non-teaching staff, maintenance and security personnel are recognized persons in authority and are duty-bound to enforce the school's policies and rules of discipline. When authorized, these personnel may direct and supervise the good order of student activities. They shall have the right to call the attention and/or refer any violation of school rules and regulations to proper school authority for appropriate action.
                  </p>
                </div>

                {/* Blue Container: Student Discipline Committee */}
                <div className="rounded-lg p-4 mb-4 mt-4" style={{ backgroundColor: "#C4D7F0" }}>
                  <div className="flex items-start mb-3">
                    <span className="font-bold mr-3" style={{ color: "#041A44", fontFamily: "Inter, sans-serif", fontSize: "16px" }}>2</span>
                    <h3 className="font-bold" style={{ color: "#041A44", fontFamily: "Inter, sans-serif", fontWeight: 700, fontSize: "16px" }}>STUDENT DISCIPLINE COMMITTEE</h3>
                  </div>
                  
                  <p className="mb-3" style={{ color: "#041A44", fontFamily: "Inter, sans-serif", fontWeight: 400, fontSize: "15px", lineHeight: 1.6, textAlign: "justify" }}>
                    The Student Discipline Committee will take charge of all investigations, summons, information and recommend sanctions to any student charged of violating the rules and regulations of the school.
                  </p>
                  
                  {/* White Container for List */}
                  <div className="rounded-lg p-4 mb-3" style={{ backgroundColor: "#FFFFFF" }}>
                    <p className="mb-2" style={{ color: "#041A44", fontFamily: "Inter, sans-serif", fontWeight: 700, fontSize: "15px", lineHeight: 1.6 }}>The Student Discipline Committee is composed of the following:</p>
                    <ul className="mb-0" style={{ listStyleType: "disc", paddingLeft: "20px", color: "#041A44", fontFamily: "Inter, sans-serif", fontWeight: 400, fontSize: "15px", lineHeight: 1.6 }}>
                      <li className="mb-1">Chairperson -Directress/ Dean of College</li>
                      <li className="mb-1">Vice-Chairperson -Student Formation Coordinator (SFC) Member</li>
                      <li className="mb-1">Prefect of Discipline Student Activity Coordinator</li>
                      <li className="mb-1">Head of Guidance Office for referral and counseling</li>
                      <li className="mb-0">ARSC Local President</li>
                    </ul>
                  </div>

                  {/* White Container for Note */}
                  <div className="rounded-lg p-3" style={{ backgroundColor: "#FFFFFF" }}>
                    <p className="mb-0" style={{ color: "#041A44", fontFamily: "Inter, sans-serif", fontWeight: 400, fontSize: "14px", lineHeight: 1.6, textAlign: "justify" }}>
                      <strong>NB:</strong> <strong>During deliberation of case/s, utmost prudence and discernment must be exercised before the student representative will be allowed to attend the case proceedings;</strong> the decision rests upon the vote of the SAB (due diligence will be exercised by the SAB) and special permit by the student's parents should be obtained beforehand.
                    </p>
                  </div>
                </div>

                {/* Blue Container: General Norms of Conduct */}
                <div className="rounded-lg p-4 mb-0" style={{ backgroundColor: "#C4D7F0" }}>
                  <div className="flex items-start mb-3">
                    <span className="font-bold mr-3" style={{ color: "#041A44", fontFamily: "Inter, sans-serif", fontSize: "16px" }}>3</span>
                    <h3 className="font-bold" style={{ color: "#041A44", fontFamily: "Inter, sans-serif", fontWeight: 700, fontSize: "16px" }}>GENERAL NORMS OF CONDUCT</h3>
                  </div>
                  
                  <p className="mb-3" style={{ color: "#041A44", fontFamily: "Inter, sans-serif", fontWeight: 700, fontSize: "15px", lineHeight: 1.6 }}>Behavioral Expectations from Students</p>
                  
                  {/* White Container for Content */}
                  <div className="rounded-lg p-4" style={{ backgroundColor: "#FFFFFF" }}>
                    <p className="mb-0" style={{ color: "#041A44", fontFamily: "Inter, sans-serif", fontWeight: 400, fontSize: "15px", lineHeight: 1.6, textAlign: "justify" }}>
                      All students are expected to manifest the traits and values of CCTC exude the Expected Graduate Attributes which flow from the CCTC's Core Values.
                    </p>
                  </div>
                </div>

                {/* Blue Container: General Norms of Conduct (4) */}
                <div className="rounded-lg p-4 mb-0 mt-4" style={{ backgroundColor: "#C4D7F0" }}>
                  <div className="flex items-start mb-4">
                    <span className="font-bold mr-3" style={{ color: "#041A44", fontFamily: "Inter, sans-serif", fontSize: "16px" }}>4</span>
                    <h3 className="font-bold" style={{ color: "#041A44", fontFamily: "Inter, sans-serif", fontWeight: 700, fontSize: "16px" }}>GENERAL NORMS OF CONDUCT</h3>
                  </div>
                  
                  {/* Student Code of Conduct Section */}
                  <div className="mb-4">
                    <p className="mb-2" style={{ color: "#041A44", fontFamily: "Inter, sans-serif", fontWeight: 700, fontSize: "15px", lineHeight: 1.6 }}>The Student Code of Conduct</p>
                    <p className="mb-0 px-3" style={{ color: "#041A44", fontFamily: "Inter, sans-serif", fontWeight: 400, fontSize: "15px", lineHeight: 1.6, textAlign: "justify" }}>
                      All students of Consolatrix College of Toledo City, Inc. are expected to conduct themselves properly, to respect the rights of their fellow students, faculty members, school administrators, school authorities and employees. They must preserve the human dignity and uphold the name of the school at all times.
                    </p>
                  </div>

                  {/* Dress Code Section */}
                  <div className="mb-4">
                    <p className="mb-2" style={{ color: "#041A44", fontFamily: "Inter, sans-serif", fontWeight: 700, fontSize: "15px", lineHeight: 1.6 }}>DRESS CODE</p>
                    <p className="mb-3 px-3" style={{ color: "#041A44", fontFamily: "Inter, sans-serif", fontWeight: 400, fontSize: "15px", lineHeight: 1.6, textAlign: "justify" }}>
                      All students shall wear the prescribed proper school uniform in coming to school. Wearing inappropriate attire is subject to disciplinary actions.
                    </p>
                    
                    {/* White Container for Proper Attire */}
                    <div className="rounded-lg p-4 mx-3" style={{ backgroundColor: "#FFFFFF" }}>
                      <p className="mb-2" style={{ color: "#041A44", fontFamily: "Inter, sans-serif", fontWeight: 700, fontSize: "15px", lineHeight: 1.6 }}>The Proper School Attire</p>
                      <ul className="mb-0" style={{ listStyleType: "disc", paddingLeft: "20px", color: "#041A44", fontFamily: "Inter, sans-serif", fontWeight: 400, fontSize: "15px", lineHeight: 1.6 }}>
                        <li className="mb-1">The prescribed College uniform must be worn upon entering the school premises.</li>
                        <li className="mb-1">The College departmental shirt and organizational shirt may be worn only on the agreed days.</li>
                        <li className="mb-0">Students wearing PE/NSTP uniform will be allowed to enter the school premises provided that they have PE/NSTP class on that particular day.</li>
                      </ul>
                    </div>
                  </div>

                  {/* Improper Attire Section */}
                  <div className="mb-0">
                    <p className="mb-2" style={{ color: "#041A44", fontFamily: "Inter, sans-serif", fontWeight: 700, fontSize: "15px", lineHeight: 1.6 }}>IMPROPER ATTIRE</p>
                    
                    {/* White Container for Improper Attire */}
                    <div className="rounded-lg p-4 mx-3" style={{ backgroundColor: "#FFFFFF" }}>
                      <p className="mb-2" style={{ color: "#041A44", fontFamily: "Inter, sans-serif", fontWeight: 700, fontSize: "15px", lineHeight: 1.6 }}>Anyone wearing any of these listed below is not allowed to enter the school.</p>
                      <ul className="mb-0" style={{ listStyleType: "disc", paddingLeft: "20px", color: "#041A44", fontFamily: "Inter, sans-serif", fontWeight: 400, fontSize: "15px", lineHeight: 1.6 }}>
                        <li className="mb-1">*Leggings, mini- skirts and short pants</li>
                        <li className="mb-1">*Backless, strapless, plunging neckline or spaghetti strap dresses</li>
                        <li className="mb-1">*See - through clothing</li>
                        <li className="mb-1">*Slippers, Flip flops, open/jelly shoes or barefooted</li>
                        <li className="mb-1">*Tokong</li>
                        <li className="mb-0">* Clothing that shows gang membership, or printed with obscene messages that depict racial discord or promote illegal activities, drugs, and alcohol or tobacco product</li>
                      </ul>
                    </div>
                  </div>
                </div>

                {/* Blue Container: Disciplinary Probation Scheme (5) */}
                <div className="rounded-lg p-4 mb-0 mt-4" style={{ backgroundColor: "#C4D7F0" }}>
                  <div className="flex items-start mb-4">
                    <span className="font-bold mr-3" style={{ color: "#041A44", fontFamily: "Inter, sans-serif", fontSize: "16px" }}>5</span>
                    <h3 className="font-bold" style={{ color: "#041A44", fontFamily: "Inter, sans-serif", fontWeight: 700, fontSize: "16px" }}>DISCIPLINARY PROBATION SCHEME</h3>
                  </div>
                  
                  {/* Introduction Paragraph */}
                  <p className="mb-4 px-3" style={{ color: "#041A44", fontFamily: "Inter, sans-serif", fontWeight: 400, fontSize: "15px", lineHeight: 1.6, textAlign: "justify" }}>
                    Disciplinary Probation (DP) is a restraining measure imposed on a student who has been found guilty of constant misbehavior. It is primarily meant to help the student develop self-discipline and improve conduct. A student shall be under Disciplinary Probation status when:
                  </p>

                  {/* White Container for Probation Status */}
                  <div className="rounded-lg p-4 mx-3" style={{ backgroundColor: "#FFFFFF" }}>
                    <p className="mb-2" style={{ color: "#041A44", fontFamily: "Inter, sans-serif", fontWeight: 700, fontSize: "15px", lineHeight: 1.6 }}>A student shall be under Disciplinary Probation status when:</p>
                    <ul className="mb-0" style={{ listStyleType: "disc", paddingLeft: "20px", color: "#041A44", fontFamily: "Inter, sans-serif", fontWeight: 400, fontSize: "15px", lineHeight: 1.6 }}>
                      <li className="mb-1">he/she has acquired a conduct grade of 3.0 during the 1st and/or 2nd semesters.</li>
                      <li className="mb-1">he/she has 3 or more 3.0 on his/her Behavioral Indicator from 1st to 20d semesters.</li>
                      <li className="mb-0">he/she has signed an agreement during the current and/or the previous school year.</li>
                    </ul>
                  </div>
                </div>

                {/* Blue Container: Offenses and Sanctions (6) */}
                <div className="rounded-lg p-4 mb-0 mt-4" style={{ backgroundColor: "#C4D7F0" }}>
                  <div className="flex items-start mb-4">
                    <span className="font-bold mr-3" style={{ color: "#041A44", fontFamily: "Inter, sans-serif", fontSize: "16px" }}>6</span>
                    <h3 className="font-bold" style={{ color: "#041A44", fontFamily: "Inter, sans-serif", fontWeight: 700, fontSize: "16px" }}>OFFENSES AND SANCTIONS</h3>
                  </div>
                  
                  {/* White Container for Table (6.1) */}
                  <div className="rounded-lg p-0 sm:p-4 mx-0 sm:mx-3 mb-4" style={{ backgroundColor: "#FFFFFF" }}>
                    <div className="flex items-start mb-3 px-2 sm:px-0 pt-2 sm:pt-0">
                      <span className="font-bold mr-3" style={{ color: "white", backgroundColor: "#041A44", fontFamily: "Inter, sans-serif", fontSize: "12px", width: "32px", height: "32px", borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>6.1</span>
                      <h4 className="font-bold" style={{ color: "#041A44", fontFamily: "Inter, sans-serif", fontWeight: 700, fontSize: "15px" }}>Corrective Measures for Minor Offenses:</h4>
                    </div>
                    
                    <div className="overflow-x-auto">
                      <table className="w-full" style={{ borderCollapse: "collapse", fontFamily: "Inter, sans-serif" }}>
                        <thead>
                          <tr style={{ backgroundColor: "#F8F9FA" }}>
                            <th className="text-xs sm:text-sm md:text-base" style={{ border: "1px solid #DEE2E6", padding: "8px 12px", textAlign: "left", fontWeight: 600, color: "#041A44", width: "30%" }}>Offense Type</th>
                            <th className="text-xs sm:text-sm md:text-base" style={{ border: "1px solid #DEE2E6", padding: "8px 12px", textAlign: "left", fontWeight: 600, color: "#041A44", width: "70%" }}>Corrective Measure</th>
                          </tr>
                        </thead>
                      <tbody>
                        <tr>
                          <td className="text-xs sm:text-sm md:text-base" style={{ border: "1px solid #DEE2E6", padding: "8px 12px", color: "#041A44", verticalAlign: "top" }}>First Offense</td>
                          <td className="text-xs sm:text-sm md:text-base" style={{ border: "1px solid #DEE2E6", padding: "8px 12px", color: "#041A44", verticalAlign: "top" }}>Verbal Reprimand & Counseling</td>
                        </tr>
                        <tr>
                          <td className="text-xs sm:text-sm md:text-base" style={{ border: "1px solid #DEE2E6", padding: "8px 12px", color: "#041A44", verticalAlign: "top" }}>Second Offense</td>
                          <td className="text-xs sm:text-sm md:text-base" style={{ border: "1px solid #DEE2E6", padding: "8px 12px", color: "#041A44", verticalAlign: "top" }}>Counseling or administrative service (8)hours</td>
                        </tr>
                        <tr>
                          <td className="text-xs sm:text-sm md:text-base" style={{ border: "1px solid #DEE2E6", padding: "8px 12px", color: "#041A44", verticalAlign: "top" }}>Third Offense</td>
                          <td className="text-xs sm:text-sm md:text-base" style={{ border: "1px solid #DEE2E6", padding: "8px 12px", color: "#041A44", verticalAlign: "top", textAlign: "justify" }}>Considered as first offense on major violations, therefore, transformative intervention will be implemented and if the student is a minor, the guardian of the students will be issued by the guidance counselor. The presence of parent or guardian is required for the implementation of said intervention/transformative intervention(s).</td>
                        </tr>
                      </tbody>
                      </table>
                    </div>
                  </div>

                  {/* White Container for Minor Offenses List */}
                  <div className="rounded-lg p-0 sm:p-4 mx-0 sm:mx-3" style={{ backgroundColor: "#FFFFFF" }}>
                    <div className="flex items-start mb-3 px-2 sm:px-0 pt-2 sm:pt-0">
                      <span className="mr-2" style={{ color: "#041A44", fontFamily: "Inter, sans-serif", fontSize: "15px", fontWeight: 700 }}>a.</span>
                      <h4 className="font-bold" style={{ color: "#041A44", fontFamily: "Inter, sans-serif", fontWeight: 700, fontSize: "15px" }}>The following are considered as Minor Offenses:</h4>
                    </div>
                    
                    <ul className="mb-0 px-2 sm:px-0 pb-2 sm:pb-0" style={{ listStyleType: "disc", paddingLeft: "20px", color: "#041A44", fontFamily: "Inter, sans-serif", fontWeight: 400, fontSize: "14px", lineHeight: 1.8 }}>
                      <li className="mb-1">Not wearing the proper uniform</li>
                      <li className="mb-1">Not following the hair code</li>
                      <li className="mb-1">Not wearing the proper P.E or wearing the ID of someone else or lending out one's ID</li>
                      <li className="mb-1">Wearing a cap or hat inside the classroom during classes</li>
                      <li className="mb-1">Impaling the name tag, the worn out and other parts of the body and putting earrings or pins</li>
                      <li className="mb-1">Wearing of earrings among male students</li>
                      <li className="mb-1">Disturbing the normal flow of the school activities</li>
                      <li className="mb-1">Littering</li>
                      <li className="mb-1">Idling or charging of electronic equipment, toys, games, or other disruptive items during class or school activities such as cellphones, MP3 players, video games and portable electronic devices and the like</li>
                      <li className="mb-1">Idling or engaging using school programs</li>
                      <li className="mb-1">Not using comfort rooms properly, such as throwing of napkins inside the toilet bowl, not flushing the toilet and stepping on the bowl, etc.</li>
                      <li className="mb-1">Defacing</li>
                      <li className="mb-1">Unauthorized using of school facilities</li>
                      <li className="mb-1">Misbehaving</li>
                      <li className="mb-1">Unjust vexation or pestering</li>
                      <li className="mb-1">Possessing of obscene or pornographic materials within the school premises</li>
                      <li className="mb-1">Possessing of any gambling paraphernalia</li>
                      <li className="mb-1">Selling, acquiring, and/or making contributions, soliciting and raising funds without permission/approval from the school authorities;</li>
                      <li className="mb-1">Unauthorized posting of school/government issued sheets/forms/documents/ instructions, quizzes and answers on social networking sites;</li>
                      <li className="mb-1">Forging, tampering, unauthorized official documents (ie school records, student's and employee's credentials, payment receipts, official receipts, school ID, official notices, clearances, and letters to and from parents;</li>
                      <li className="mb-1">Using the name of the school, the school seal, or the school logo without due permission from the school authorities;</li>
                      <li className="mb-1">Practicing dishonesty in dealing with any person connected with the school and its clients;</li>
                      <li className="mb-1">Circulating false and/or malicious information and/or accusations against the institution or its authorities, school personnel or other students in any form</li>
                      <li className="mb-0">Cutting classes</li>
                    </ul>
                  </div>

                  {/* White Container: Major Offenses Sanctions (6.2) */}
                  <div className="rounded-lg p-0 sm:p-4 mx-0 sm:mx-3 mt-4" style={{ backgroundColor: "#FFFFFF" }}>
                    <div className="flex items-start mb-3 px-2 sm:px-0 pt-2 sm:pt-0">
                      <span className="mr-2" style={{ color: "#041A44", fontFamily: "Inter, sans-serif", fontSize: "15px", fontWeight: 700 }}>6.2</span>
                      <h4 className="font-bold" style={{ color: "#041A44", fontFamily: "Inter, sans-serif", fontWeight: 700, fontSize: "15px" }}>Major Offenses Sanctions</h4>
                    </div>
                    
                    {/* Introduction Paragraph */}
                    <p className="mb-3 px-2 sm:px-0" style={{ color: "#041A44", fontFamily: "Inter, sans-serif", fontWeight: 400, fontSize: "14px", lineHeight: 1.6 }}>
                      Any student who has been found guilty of the following violations shall be meted the corresponding sanctions after due process, to wit: (Major Offense)
                    </p>

                    {/* Table */}
                    <div className="overflow-x-auto">
                      <table className="w-full" style={{ borderCollapse: "collapse", fontFamily: "Inter, sans-serif" }}>
                        <tbody>
                          <tr>
                            <td className="text-xs sm:text-sm md:text-base" style={{ border: "1px solid #DEE2E6", padding: "8px 12px", color: "#041A44", verticalAlign: "top", width: "30%" }}>First Offense</td>
                            <td className="text-xs sm:text-sm md:text-base" style={{ border: "1px solid #DEE2E6", padding: "8px 12px", color: "#041A44", verticalAlign: "top" }}>
                              <p style={{ margin: "0 0 6px 0", fontWeight: 700 }}>Suspension</p>
                              <p style={{ margin: 0, textAlign: "justify" }}>A penalty allowed by Commission on Higher Education (CHED) The College penalizes a students who violates a major offense with suspension which does not exceed twenty percent(20%) of non-attendance in class for the entire semester.</p>
                            </td>
                          </tr>
                          <tr>
                            <td className="text-xs sm:text-sm md:text-base" style={{ border: "1px solid #DEE2E6", padding: "8px 12px", color: "#041A44", verticalAlign: "top" }}>Second Offense</td>
                            <td className="text-xs sm:text-sm md:text-base" style={{ border: "1px solid #DEE2E6", padding: "8px 12px", color: "#041A44", verticalAlign: "top" }}>
                              <p style={{ margin: "0 0 6px 0", fontWeight: 700 }}>Suspension</p>
                              <p style={{ margin: 0, textAlign: "justify" }}>The College refuses a student admission to the school due to the violations of a major offense which is still subject to review and evaluation(1 year suspension).</p>
                            </td>
                          </tr>
                          <tr>
                            <td className="text-xs sm:text-sm md:text-base" style={{ border: "1px solid #DEE2E6", padding: "8px 12px", color: "#041A44", verticalAlign: "top" }}>Third Offense</td>
                            <td className="text-xs sm:text-sm md:text-base" style={{ border: "1px solid #DEE2E6", padding: "8px 12px", color: "#041A44", verticalAlign: "top" }}>
                              <p style={{ margin: "0 0 6px 0", fontWeight: 700 }}>Non-Re Admission</p>
                              <p style={{ margin: 0, textAlign: "justify" }}>The school denied Admission or enrolment of the erring student for the academic year immediately following the semester when the resolution or decision finding the student guilty of offense charged and imposing the penalty of non-re admission was promulgated.</p>
                            </td>
                          </tr>
                        </tbody>
                      </table>
                    </div>
                  </div>

                  {/* White Container: Major Offenses Table (6.3) */}
                  <div className="rounded-lg p-0 sm:p-4 mx-0 sm:mx-3 mt-4" style={{ backgroundColor: "#FFFFFF" }}>
                    <div className="flex items-start mb-3 px-2 sm:px-0 pt-2 sm:pt-0">
                      <span className="font-bold mr-3" style={{ color: "white", backgroundColor: "#041A44", fontFamily: "Inter, sans-serif", fontSize: "12px", width: "32px", height: "32px", borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>6.3</span>
                      <div>
                        <p style={{ color: "#041A44", fontFamily: "Inter, sans-serif", fontWeight: 700, fontSize: "15px", margin: "0 0 4px 0" }}>The following are considered as Major Offenses:</p>
                        <p style={{ color: "#041A44", fontFamily: "Inter, sans-serif", fontWeight: 400, fontSize: "13px", margin: 0, textAlign: "justify" }}>(Violations of these major offenses may result to dismissal from the College)</p>
                      </div>
                    </div>
                    
                    {/* Offenses Table */}
                    <div className="overflow-x-auto">
                      <table className="w-full" style={{ borderCollapse: "collapse", fontFamily: "Inter, sans-serif" }}>
                        <thead>
                          <tr style={{ backgroundColor: "#F8F9FA" }}>
                            <th className="text-xs sm:text-sm md:text-base" style={{ border: "1px solid #DEE2E6", padding: "8px 12px", textAlign: "left", fontWeight: 600, color: "#041A44", width: "35%" }}>Offenses</th>
                            <th className="text-xs sm:text-sm md:text-base" style={{ border: "1px solid #DEE2E6", padding: "8px 12px", textAlign: "left", fontWeight: 600, color: "#041A44", width: "65%" }}>Meaning</th>
                          </tr>
                        </thead>
                      <tbody>
                        <tr>
                          <td className="text-xs sm:text-sm md:text-base" style={{ border: "1px solid #DEE2E6", padding: "8px 12px", color: "#041A44", verticalAlign: "top" }}>Inflicting harm physically and emotionally especially using profane obscene language</td>
                          <td className="text-xs sm:text-sm md:text-base" style={{ border: "1px solid #DEE2E6", padding: "8px 12px", color: "#041A44", verticalAlign: "top" }}></td>
                        </tr>
                        <tr>
                          <td className="text-xs sm:text-sm md:text-base" style={{ border: "1px solid #DEE2E6", padding: "8px 12px", color: "#041A44", verticalAlign: "top" }}>Public Display of Affection (PDA)</td>
                          <td className="text-xs sm:text-sm md:text-base" style={{ border: "1px solid #DEE2E6", padding: "8px 12px", color: "#041A44", verticalAlign: "top" }}>Such as petting,necking, and other sexual acts</td>
                        </tr>
                        <tr>
                          <td className="text-xs sm:text-sm md:text-base" style={{ border: "1px solid #DEE2E6", padding: "8px 12px", color: "#041A44", verticalAlign: "top" }}>Verbal Abuse</td>
                          <td className="text-xs sm:text-sm md:text-base" style={{ border: "1px solid #DEE2E6", padding: "8px 12px", color: "#041A44", verticalAlign: "top" }}>inflicting verbal harm on another person</td>
                        </tr>
                        <tr>
                          <td className="text-xs sm:text-sm md:text-base" style={{ border: "1px solid #DEE2E6", padding: "8px 12px", color: "#041A44", verticalAlign: "top" }}>Unauthorized possession of deadly weapons or (PD 1866)</td>
                          <td className="text-xs sm:text-sm md:text-base" style={{ border: "1px solid #DEE2E6", padding: "8px 12px", color: "#041A44", verticalAlign: "top" }}></td>
                        </tr>
                        <tr>
                          <td className="text-xs sm:text-sm md:text-base" style={{ border: "1px solid #DEE2E6", padding: "8px 12px", color: "#041A44", verticalAlign: "top" }}>Possession or use of drugs, alcohol, or any controlled substance inside the school premises</td>
                          <td className="text-xs sm:text-sm md:text-base" style={{ border: "1px solid #DEE2E6", padding: "8px 12px", color: "#041A44", verticalAlign: "top" }}>Illegal possession, distribution or use of drugs, chemicals, alcohol or any controlled substance such as marijuana, shabu, LSD, heroine, ecstasy pill and inhalants/organic drugs, inhalants such as rugby, acetone or thinner and the like.</td>
                        </tr>
                        <tr>
                          <td className="text-xs sm:text-sm md:text-base" style={{ border: "1px solid #DEE2E6", padding: "8px 12px", color: "#041A44", verticalAlign: "top" }}>Plagiarism</td>
                          <td className="text-xs sm:text-sm md:text-base" style={{ border: "1px solid #DEE2E6", padding: "8px 12px", color: "#041A44", verticalAlign: "top" }}>Using the work of another student or any work of other persons without proper acknowledgement or credits given. The RA 8393 otherwise known as the Intellectual Property Code of the philippines must be adhered to.</td>
                        </tr>
                        <tr>
                          <td className="text-xs sm:text-sm md:text-base" style={{ border: "1px solid #DEE2E6", padding: "8px 12px", color: "#041A44", verticalAlign: "top" }}>Falsification of school documents</td>
                          <td className="text-xs sm:text-sm md:text-base" style={{ border: "1px solid #DEE2E6", padding: "8px 12px", color: "#041A44", verticalAlign: "top" }}>Engaging in forgery of persons in authority; school officials, faculty, heads and staff and falsification of official documents and school records. This also includes but not illegal or unauthorized reproduction of school materials and other pertinent documents.</td>
                        </tr>
                        <tr>
                          <td className="text-xs sm:text-sm md:text-base" style={{ border: "1px solid #DEE2E6", padding: "8px 12px", color: "#041A44", verticalAlign: "top" }}>Theft and Stealing</td>
                          <td className="text-xs sm:text-sm md:text-base" style={{ border: "1px solid #DEE2E6", padding: "8px 12px", color: "#041A44", verticalAlign: "top" }}>Taking of any item which belongs to another person without the latter's consent</td>
                        </tr>
                        <tr>
                          <td className="text-xs sm:text-sm md:text-base" style={{ border: "1px solid #DEE2E6", padding: "8px 12px", color: "#041A44", verticalAlign: "top" }}>Malicious mischief</td>
                          <td className="text-xs sm:text-sm md:text-base" style={{ border: "1px solid #DEE2E6", padding: "8px 12px", color: "#041A44", verticalAlign: "top" }}>intentionally damaging the personal property of other person (restitution is required)</td>
                        </tr>
                        <tr>
                          <td className="text-xs sm:text-sm md:text-base" style={{ border: "1px solid #DEE2E6", padding: "8px 12px", color: "#041A44", verticalAlign: "top" }}>Gambling</td>
                          <td className="text-xs sm:text-sm md:text-base" style={{ border: "1px solid #DEE2E6", padding: "8px 12px", color: "#041A44", verticalAlign: "top" }}>Any form of gambling within 15m. radius distance from the College premises</td>
                        </tr>
                        <tr>
                          <td className="text-xs sm:text-sm md:text-base" style={{ border: "1px solid #DEE2E6", padding: "8px 12px", color: "#041A44", verticalAlign: "top" }}>Organization that are contrary to the objectives of the college</td>
                          <td className="text-xs sm:text-sm md:text-base" style={{ border: "1px solid #DEE2E6", padding: "8px 12px", color: "#041A44", verticalAlign: "top" }}>Formation, membership, recruitment or affiliation with prohibited organization. These are fraternities and sororities which aims and objectives and its rules, regulations and behavioral patterns are contrary to the adhered values and norms of the College</td>
                        </tr>
                        <tr>
                          <td className="text-xs sm:text-sm md:text-base" style={{ border: "1px solid #DEE2E6", padding: "8px 12px", color: "#041A44", verticalAlign: "top" }}>Disrespect, Disobedience, or defiance of school authorities</td>
                          <td className="text-xs sm:text-sm md:text-base" style={{ border: "1px solid #DEE2E6", padding: "8px 12px", color: "#041A44", verticalAlign: "top" }}>Non- compliance with the instruction of persons in authority Acts o disrespect in words or in deed committed against teachers, parents, school administrators, teaching personnel, security guards, maintenance personnel, student and visitor</td>
                        </tr>
                        <tr>
                          <td className="text-xs sm:text-sm md:text-base" style={{ border: "1px solid #DEE2E6", padding: "8px 12px", color: "#041A44", verticalAlign: "top" }}>Arson</td>
                          <td className="text-xs sm:text-sm md:text-base" style={{ border: "1px solid #DEE2E6", padding: "8px 12px", color: "#041A44", verticalAlign: "top" }}>Starting a fire regardless of damage to school property</td>
                        </tr>
                        <tr>
                          <td className="text-xs sm:text-sm md:text-base" style={{ border: "1px solid #DEE2E6", padding: "8px 12px", color: "#041A44", verticalAlign: "top" }}>Sexual Assault / Rape/ Harassment</td>
                          <td className="text-xs sm:text-sm md:text-base" style={{ border: "1px solid #DEE2E6", padding: "8px 12px", color: "#041A44", verticalAlign: "top" }}>Refers to RA 7877 otherwise known as Anti-Sexual Harassment Law, RA 8353 otherwise known and Anti Rape Law of 1997, Violation of Safe Space Act.</td>
                        </tr>
                        <tr>
                          <td className="text-xs sm:text-sm md:text-base" style={{ border: "1px solid #DEE2E6", padding: "8px 12px", color: "#041A44", verticalAlign: "top" }}>Bullying/Cyber Bullying</td>
                          <td className="text-xs sm:text-sm md:text-base" style={{ border: "1px solid #DEE2E6", padding: "8px 12px", color: "#041A44", verticalAlign: "top" }}>Refers to the provision in Revised  Penal Code Using the internet and Social Network to malign co-students and person/s in authority</td>
                        </tr>
                        <tr>
                          <td className="text-xs sm:text-sm md:text-base" style={{ border: "1px solid #DEE2E6", padding: "8px 12px", color: "#041A44", verticalAlign: "top" }}>Malversation of funds</td>
                          <td className="text-xs sm:text-sm md:text-base" style={{ border: "1px solid #DEE2E6", padding: "8px 12px", color: "#041A44", verticalAlign: "top" }}>Using organization funds for personal use/ take and keep school fees / using funds without consultation  with the members and adviser of the organization</td>
                        </tr>
                        <tr>
                          <td className="text-xs sm:text-sm md:text-base" style={{ border: "1px solid #DEE2E6", padding: "8px 12px", color: "#041A44", verticalAlign: "top" }}>Hazing</td>
                          <td className="text-xs sm:text-sm md:text-base" style={{ border: "1px solid #DEE2E6", padding: "8px 12px", color: "#041A44", verticalAlign: "top" }}>Refers to the provision mandated in Anti-hazing Law or otherwise known as RA 8049</td>
                        </tr>
                        <tr>
                          <td className="text-xs sm:text-sm md:text-base" style={{ border: "1px solid #DEE2E6", padding: "8px 12px", color: "#041A44", verticalAlign: "top" }}>Failure or refusal to comply with school safety rules and or regulation</td>
                          <td className="text-xs sm:text-sm md:text-base" style={{ border: "1px solid #DEE2E6", padding: "8px 12px", color: "#041A44", verticalAlign: "top" }}>Includes minimum public health standards and other safety and health regulation</td>
                        </tr>
                        <tr>
                          <td className="text-xs sm:text-sm md:text-base" style={{ border: "1px solid #DEE2E6", padding: "8px 12px", color: "#041A44", verticalAlign: "top" }}>Threatening, coercing, harassing, black mailing, assaulting school administrators, lay mission partners, and fellow students</td>
                          <td className="text-xs sm:text-sm md:text-base" style={{ border: "1px solid #DEE2E6", padding: "8px 12px", color: "#041A44", verticalAlign: "top" }}></td>
                        </tr>
                        <tr>
                          <td className="text-xs sm:text-sm md:text-base" style={{ border: "1px solid #DEE2E6", padding: "8px 12px", color: "#041A44", verticalAlign: "top" }}>Indulging in illicit relationships and lifestyle as in the case of prostitution</td>
                          <td className="text-xs sm:text-sm md:text-base" style={{ border: "1px solid #DEE2E6", padding: "8px 12px", color: "#041A44", verticalAlign: "top" }}></td>
                        </tr>
                        <tr>
                          <td className="text-xs sm:text-sm md:text-base" style={{ border: "1px solid #DEE2E6", padding: "8px 12px", color: "#041A44", verticalAlign: "top" }}>Acts, omission, conditions or circumstances tending toward anti-life practices such as but not limited to abortion, contraception, and the like</td>
                          <td className="text-xs sm:text-sm md:text-base" style={{ border: "1px solid #DEE2E6", padding: "8px 12px", color: "#041A44", verticalAlign: "top" }}></td>
                        </tr>
                        <tr>
                          <td className="text-xs sm:text-sm md:text-base" style={{ border: "1px solid #DEE2E6", padding: "8px 12px", color: "#041A44", verticalAlign: "top" }}>Bomb threat</td>
                          <td className="text-xs sm:text-sm md:text-base" style={{ border: "1px solid #DEE2E6", padding: "8px 12px", color: "#041A44", verticalAlign: "top" }}></td>
                        </tr>
                        <tr>
                          <td className="text-xs sm:text-sm md:text-base" style={{ border: "1px solid #DEE2E6", padding: "8px 12px", color: "#041A44", verticalAlign: "top" }}>Instigate or lead strikes or similar concerted activities resulting in disruption of classes without permission from proper authorities</td>
                          <td className="text-xs sm:text-sm md:text-base" style={{ border: "1px solid #DEE2E6", padding: "8px 12px", color: "#041A44", verticalAlign: "top" }}></td>
                        </tr>
                        <tr>
                          <td className="text-xs sm:text-sm md:text-base" style={{ border: "1px solid #DEE2E6", padding: "8px 12px", color: "#041A44", verticalAlign: "top" }}>Entering the campus while under the influence of alcohol, drugs or any illicit substance</td>
                          <td className="text-xs sm:text-sm md:text-base" style={{ border: "1px solid #DEE2E6", padding: "8px 12px", color: "#041A44", verticalAlign: "top" }}></td>
                        </tr>
                        <tr>
                          <td className="text-xs sm:text-sm md:text-base" style={{ border: "1px solid #DEE2E6", padding: "8px 12px", color: "#041A44", verticalAlign: "top" }}>Cheating in any form</td>
                          <td className="text-xs sm:text-sm md:text-base" style={{ border: "1px solid #DEE2E6", padding: "8px 12px", color: "#041A44", verticalAlign: "top" }}></td>
                        </tr>
                        <tr>
                          <td className="text-xs sm:text-sm md:text-base" style={{ border: "1px solid #DEE2E6", padding: "8px 12px", color: "#041A44", verticalAlign: "top" }}>Data Privacy</td>
                          <td className="text-xs sm:text-sm md:text-base" style={{ border: "1px solid #DEE2E6", padding: "8px 12px", color: "#041A44", verticalAlign: "top" }}></td>
                        </tr>
                        <tr>
                          <td className="text-xs sm:text-sm md:text-base" style={{ border: "1px solid #DEE2E6", padding: "8px 12px", color: "#041A44", verticalAlign: "top" }}>Damage to school property</td>
                          <td className="text-xs sm:text-sm md:text-base" style={{ border: "1px solid #DEE2E6", padding: "8px 12px", color: "#041A44", verticalAlign: "top" }}></td>
                        </tr>
                        <tr>
                          <td className="text-xs sm:text-sm md:text-base" style={{ border: "1px solid #DEE2E6", padding: "8px 12px", color: "#041A44", verticalAlign: "top" }}>Smoking/vaping</td>
                          <td className="text-xs sm:text-sm md:text-base" style={{ border: "1px solid #DEE2E6", padding: "8px 12px", color: "#041A44", verticalAlign: "top" }}></td>
                        </tr>
                        <tr>
                          <td className="text-xs sm:text-sm md:text-base" style={{ border: "1px solid #DEE2E6", padding: "8px 12px", color: "#041A44", verticalAlign: "top" }}>Creating intrigues and malicious gossips to fellow students and other persons</td>
                          <td className="text-xs sm:text-sm md:text-base" style={{ border: "1px solid #DEE2E6", padding: "8px 12px", color: "#041A44", verticalAlign: "top" }}></td>
                        </tr>
                        <tr>
                          <td className="text-xs sm:text-sm md:text-base" style={{ border: "1px solid #DEE2E6", padding: "8px 12px", color: "#041A44", verticalAlign: "top" }}>Vandalism</td>
                          <td className="text-xs sm:text-sm md:text-base" style={{ border: "1px solid #DEE2E6", padding: "8px 12px", color: "#041A44", verticalAlign: "top" }}></td>
                        </tr>
                        <tr>
                          <td className="text-xs sm:text-sm md:text-base" style={{ border: "1px solid #DEE2E6", padding: "8px 12px", color: "#041A44", verticalAlign: "top" }}>Libel, Cyber Libel</td>
                          <td className="text-xs sm:text-sm md:text-base" style={{ border: "1px solid #DEE2E6", padding: "8px 12px", color: "#041A44", verticalAlign: "top" }}></td>
                        </tr>
                        <tr>
                          <td className="text-xs sm:text-sm md:text-base" style={{ border: "1px solid #DEE2E6", padding: "8px 12px", color: "#041A44", verticalAlign: "top" }}>Dishonesty in all forms</td>
                          <td className="text-xs sm:text-sm md:text-base" style={{ border: "1px solid #DEE2E6", padding: "8px 12px", color: "#041A44", verticalAlign: "top" }}></td>
                        </tr>
                      </tbody>
                      </table>
                    </div>

                    {/* Additional Policies Below Table */}
                    <ul className="mt-4 mb-4" style={{ listStyleType: "disc", paddingLeft: "20px", color: "#041A44", fontFamily: "Inter, sans-serif", fontWeight: 400, fontSize: "14px", lineHeight: 1.8 }}>
                      <li className="mb-2">Teenage pregnancy will be handled through a specific intervention by the school authorities to address the sensitive nature of the case.</li>
                      <li className="mb-0">The Prefect of Discipline and the Student Discipline Committee shall have the  power to determine whether or not the offense herein shall be considered minor or major depending on the gravity of the offense.</li>
                    </ul>

                    <p className="mb-4" style={{ color: "#041A44", fontFamily: "Inter, sans-serif", fontWeight: 400, fontSize: "14px", lineHeight: 1.8, textAlign: "justify" }}>
                      Sanctions to be imposed on offenses not covered in this handbook shall be recommended by the prefect of discipline and student discipline committee to the Directress without prejudice to the rights of students tc due process.
                    </p>

                    {/* Desktop: Second and third paragraphs in same container - always visible, no conditional classes */}
                    <p className="mb-4 sm:mb-4 hidden sm:block" style={{ color: "#041A44", fontFamily: "Inter, sans-serif", fontWeight: 400, fontSize: "14px", lineHeight: 1.8, textAlign: "justify" }}>
                      Sanctions for all offenses are subject to appropriate disciplinary measures commensurate to the gravity of the offense committed. The sanction for offenses where there are properties damaged or person/: injured shall include replacement/ restoration / compensation without prejudice to other sanctions. The same rule applies to stolen money/ wher there are stolen properties not returned have been substantially damager upon return. Students who have been sanctioned or have undergone disciplinary action are required to issue a written apology. Violations of rules and regulations promulgated by the Commissior on Higher Education (CHED) duly implemented by the College shall be evaluated based on the above.
                    </p>

                    <p className="mb-0 sm:mb-0 hidden sm:block" style={{ color: "#041A44", fontFamily: "Inter, sans-serif", fontWeight: 400, fontSize: "14px", lineHeight: 1.8, textAlign: "justify" }}>
                      All disciplinary measures are applicable during face to face class, seamless blended learning or virtual activities.
                    </p>
                  </div>

                  {/* Mobile only: Second paragraph in separate white container */}
                  <div className="block sm:hidden rounded-lg p-0 sm:p-4 mx-0 sm:mx-3 mt-4" style={{ backgroundColor: "#FFFFFF" }}>
                    <p className="mb-0 px-2 sm:px-0 pt-2 sm:pt-0 pb-2 sm:pb-0" style={{ color: "#041A44", fontFamily: "Inter, sans-serif", fontWeight: 400, fontSize: "14px", lineHeight: 1.8, textAlign: "justify" }}>
                      Sanctions for all offenses are subject to appropriate disciplinary measures commensurate to the gravity of the offense committed. The sanction for offenses where there are properties damaged or person/: injured shall include replacement/ restoration / compensation without prejudice to other sanctions. The same rule applies to stolen money/ wher there are stolen properties not returned have been substantially damager upon return. Students who have been sanctioned or have undergone disciplinary action are required to issue a written apology. Violations of rules and regulations promulgated by the Commissior on Higher Education (CHED) duly implemented by the College shall be evaluated based on the above.
                    </p>
                  </div>

                  {/* Mobile only: Third paragraph in separate white container */}
                  <div className="block sm:hidden rounded-lg p-0 sm:p-4 mx-0 sm:mx-3 mt-4" style={{ backgroundColor: "#FFFFFF" }}>
                    <p className="mb-0 px-2 sm:px-0 pt-2 sm:pt-0 pb-2 sm:pb-0" style={{ color: "#041A44", fontFamily: "Inter, sans-serif", fontWeight: 400, fontSize: "14px", lineHeight: 1.8, textAlign: "justify" }}>
                      All disciplinary measures are applicable during face to face class, seamless blended learning or virtual activities.
                    </p>
                  </div>
                </div>
              </div>
                </>
              )}
            </div>
          )}

          {/* Section XIV: Prefect of Discipline, Complaints and Grievances */}
          {selectedSection === 14 && (
            <div className="w-full">
              {isBasicEducation ? (
                <>
                  {/* Section Header */}
                  <div className="bg-white rounded-lg shadow-sm p-4 sm:p-6 md:p-8 mb-4 sm:mb-6 mt-4 sm:mt-6 md:mt-8" style={{ backgroundColor: "#041A44" }}>
                    <div className="text-xs sm:text-sm mb-3 sm:mb-4 px-2 sm:px-3 py-1 bg-blue-100 text-blue-800 rounded-full inline-block" style={{ backgroundColor: "transparent", color: "white", border: "1px solid white" }}>
                      Section XIV
                    </div>
                    <h2 className="text-base sm:text-xl md:text-2xl font-bold mb-3 sm:mb-4" style={{ color: "white", fontFamily: "Inter, sans-serif", fontWeight: 700 }}>
                      PREFECT OF DISCIPLINE, COMPLAINTS AND GRIEVANCES
                    </h2>
                    <p className="text-gray-600 mb-0 text-[10px] sm:text-sm md:text-base" style={{ color: "white", fontFamily: "Inter, sans-serif", fontWeight: 400 }}>
                      Handles student concerns and discipline issues.
                    </p>
                  </div>

                  {/* Main White Container */}
                  <div className="rounded-lg shadow-sm p-6 mb-6" style={{ backgroundColor: "#FFFFFF" }}>
                    {/* Introduction Paragraph */}
                    <p className="font-normal leading-relaxed mb-4" style={{ color: "#041A44", fontFamily: "Inter, sans-serif", fontWeight: 400, fontSize: "13px" }}>
                      The Prefect of Discipline ensures that the ideal learning environment is observed by the students where Gospel and Filipino values are integrated in their daily stay in the campus and act according to professional standard of the school. The Prefect of Discipline shall do the following duties and responsibilities:
                    </p>

                    {/* Duties and Responsibilities - Light Blue Container */}
                    <div className="rounded-lg p-5" style={{ backgroundColor: "#C4D7F0" }}>
                      <ul className="space-y-2" style={{ color: "#041A44", fontFamily: "Inter, sans-serif", fontWeight: 400, fontSize: "13px" }}>
                        <li>• Oversee the over-all maintenance of proper decorum and discipline of all students in their respective departments</li>
                        <li>• Make daily rounds to ensure prompt start and end of classes</li>
                        <li>• Call the attention of the class to maintain room cleanliness</li>
                        <li>• Check on classrooms which are noisy while waiting for the teacher</li>
                        <li>• Direct students who sit along the stairs to go to the library instead</li>
                        <li>• Check the behaviour of students who stay in the college lounges to do worthwhile activities while waiting for the class</li>
                        <li>• Ensure that students participate in important/required activities of their respective departments</li>
                        <li>• Make a report to the School Directress regarding important observations/findings in aid of policy-formulation relative to teacher and student discipline and decorum</li>
                        <li>• Impose/recommend violations for further action of the authorities</li>
                        <li>• Do related tasks as requested by the OSA/School Directress</li>
                      </ul>
                    </div>
                  </div>
                </>
              ) : (
                <>
                  {/* Section Header */}
                  <div className="bg-white rounded-lg shadow-sm p-4 sm:p-6 md:p-8 mb-4 sm:mb-6 mt-4 sm:mt-6 md:mt-8" style={{ backgroundColor: "#041A44" }}>
                    <div className="text-xs sm:text-sm mb-3 sm:mb-4 px-2 sm:px-3 py-1 bg-blue-100 text-blue-800 rounded-full inline-block" style={{ backgroundColor: "transparent", color: "white", border: "1px solid white" }}>
                      Section XIV
                    </div>
                    <h2 className="text-base sm:text-xl md:text-2xl font-bold mb-3 sm:mb-4" style={{ color: "white", fontFamily: "Inter, sans-serif", fontWeight: 700 }}>
                      PREFECT OF DISCIPLINE, COMPLAINTS AND GRIEVANCES SECTION
                    </h2>
                    <p className="text-gray-600 mb-0 text-[10px] sm:text-sm md:text-base" style={{ color: "white", fontFamily: "Inter, sans-serif", fontWeight: 400 }}>
                      Procedures for addressing student concerns, complaints and disciplinary oversight
                    </p>
                  </div>

                  {/* Main White Container */}
                  <div className="rounded-lg shadow-sm p-3 sm:p-4 md:p-6 mb-4" style={{ backgroundColor: "#FFFFFF" }}>
                    {/* Introduction - Text Only */}
                    <p className="mb-3 sm:mb-4 text-xs sm:text-sm md:text-base" style={{ color: "#041A44", fontFamily: "Inter, sans-serif", fontWeight: 400, lineHeight: 1.6, textAlign: "left" }}>
                      The Prefect of Discipline ensures that the ideal learning environment is observed by the students where proper and Hispano values are integrated in their daily stay in the campus and act according to professional standard of the school.
                    </p>

                    {/* Duties and Responsibilities - Light Blue Container */}
                    <div className="rounded-lg p-2 sm:p-3 md:p-4 mb-3 sm:mb-4" style={{ backgroundColor: "#C4D7F0" }}>
                      <h2 className="text-sm sm:text-base md:text-lg font-bold mb-2 sm:mb-3" style={{ color: "#041A44", fontFamily: "Inter, sans-serif", fontWeight: 700 }}>
                        The Prefect of Discipline shall do the following duties and responsibilities:
                      </h2>
                      <ul className="space-y-1.5 sm:space-y-2 mb-0" style={{ listStyleType: "disc", paddingLeft: "20px", color: "#041A44", fontFamily: "Inter, sans-serif", fontWeight: 400, lineHeight: 1.6 }}>
                        <li className="mb-1 text-xs sm:text-sm md:text-base">Oversee the over-all maintenance of proper decorum and discipline of all students in their respective departments;</li>
                        <li className="mb-1 text-xs sm:text-sm md:text-base">Make daily rounds to ensure prompt start and end of classes</li>
                        <li className="mb-1 text-xs sm:text-sm md:text-base">Check on every classroom in case of absences</li>
                        <li className="mb-1 text-xs sm:text-sm md:text-base">Check on classrooms where are noisy while waiting for the professor</li>
                        <li className="mb-1 text-xs sm:text-sm md:text-base">Direct students who sit along the stairs to go to the forms' parlour</li>
                        <li className="mb-1 text-xs sm:text-sm md:text-base">Check the whereabouts of students who stay in the college lounges or do worthwhile activities while waiting for the class</li>
                        <li className="mb-1 text-xs sm:text-sm md:text-base">Review the students' participation in important /required activities of their respective departments</li>
                        <li className="mb-1 text-xs sm:text-sm md:text-base">Make a report to the College Dean regarding important observations / findings in aid of policy-formulation relative to teacher and student discipline and decorum</li>
                        <li className="mb-1 text-xs sm:text-sm md:text-base">Itemized recommended further action of the authorities</li>
                        <li className="mb-0 text-xs sm:text-sm md:text-base">Do needed tasks as requested by the OSA / College Dean</li>
                      </ul>
                    </div>

                    {/* Procedure for Complaints and Grievances - Light Blue Container */}
                    <div className="rounded-lg p-2 sm:p-3 md:p-4 mb-3 sm:mb-4" style={{ backgroundColor: "#C4D7F0" }}>
                      <h2 className="text-sm sm:text-base md:text-lg font-bold mb-2 sm:mb-3" style={{ color: "#041A44", fontFamily: "Inter, sans-serif", fontWeight: 700 }}>
                        Procedure for Complaints and Grievances
                      </h2>
                      <ul className="space-y-1.5 sm:space-y-2 mb-0" style={{ listStyleType: "disc", paddingLeft: "20px", color: "#041A44", fontFamily: "Inter, sans-serif", fontWeight: 400, lineHeight: 1.6 }}>
                        <li className="mb-1 text-xs sm:text-sm md:text-base">A complaint against student/s should be made in writing duly signed and addressed to the Prefect of Discipline.</li>
                        <li className="mb-1 text-xs sm:text-sm md:text-base">The initial investigation may be conducted by the Office of Student Activity.</li>
                        <li className="mb-1 text-xs sm:text-sm md:text-base">The College Dean shall forward the Prefect of Discipline to investigate the case and to make necessary recommendation to the Student Discipline Committee (SDC).</li>
                        <li className="mb-1 text-xs sm:text-sm md:text-base">The Student Discipline Committee (SDC) shall deliberate on the merits of the case, meet with parties concerned, and recommend the appropriate sanction to the Office of the Dean.</li>
                        <li className="mb-1 text-xs sm:text-sm md:text-base">The SDC shall make the appropriate recommendation of the decision to the Office of the Directress. The Directress shall immediately implement the decision made.</li>
                        <li className="mb-0 text-xs sm:text-sm md:text-base">As much as possible SDC which already settle the determination on the case, shall amicably settle the conflict between the parties. If the parties plead, the case is to be appealed and forwarded to the School Directress. The Decision of the School Directress shall be final and executory.</li>
                      </ul>
                    </div>

                    {/* Dangerous Drugs Policy - Light Blue Container */}
                    <div className="rounded-lg p-2 sm:p-3 md:p-4 mb-0" style={{ backgroundColor: "#C4D7F0" }}>
                      <h2 className="text-sm sm:text-base md:text-lg font-bold mb-2 sm:mb-3" style={{ color: "#041A44", fontFamily: "Inter, sans-serif", fontWeight: 700 }}>
                        DANGEROUS DRUGS POLICY
                      </h2>
                      <p className="mb-0 text-xs sm:text-sm md:text-base" style={{ color: "#041A44", fontFamily: "Inter, sans-serif", fontWeight: 400, lineHeight: 1.6, textAlign: "justify" }}>
                        In compliance with DANGEROUS DRUGS ACT (CADA) No. III. R. 2016, the school, with the assistance of the Local Government Units (LGUs) and other agencies where the school is located, has the obligation to employ every reasonable means to provide a healthy, drug free environment for its purpose. Thus, as a means of intervention and prevention, the school may organize symposia on potential harm of smoking, alcohol, and the use of illegal drugs.
                      </p>
                    </div>
                  </div>
                </>
              )}
            </div>
          )}

          {/* Section XV: Policy and Guidelines On Social Media Use / Learning Resource Center (Library) */}
          {selectedSection === 15 && (
            <div className="w-full">
              {isBasicEducation ? (
                <>
                  {/* Section Header */}
                  <div className="bg-white rounded-lg shadow-sm p-4 sm:p-6 md:p-8 mb-4 sm:mb-6 mt-4 sm:mt-6 md:mt-8" style={{ backgroundColor: "#041A44" }}>
                    <div className="text-xs sm:text-sm mb-3 sm:mb-4 px-2 sm:px-3 py-1 bg-blue-100 text-blue-800 rounded-full inline-block" style={{ backgroundColor: "transparent", color: "white", border: "1px solid white" }}>
                      Section XV
                    </div>
                    <h2 className="text-base sm:text-xl md:text-2xl font-bold mb-3 sm:mb-4" style={{ color: "white", fontFamily: "Inter, sans-serif", fontWeight: 700 }}>
                      POLICY AND GUIDELINES ON SOCIAL MEDIA USE
                    </h2>
                    <p className="text-gray-600 mb-6" style={{ color: "white", fontSize: "15px", fontFamily: "Inter, sans-serif", fontWeight: 400 }}>
                      Guidelines for using social media properly
                    </p>
                  </div>

                  {/* Single White Container for All Content */}
                  <div className="bg-white rounded-lg shadow-sm p-6 mb-6" style={{ backgroundColor: "#FFFFFF" }}>
                    {/* Purpose Section */}
                    <div className="rounded-lg p-5 mb-6" style={{ backgroundColor: "#C4D7F0" }}>
                      <h2 className="font-bold mb-4" style={{ color: "#041A44", fontSize: "15px", fontFamily: "Inter, sans-serif", fontWeight: 700 }}>I. Purpose</h2>
                      <p className="font-normal leading-relaxed mb-3" style={{ color: "#041A44", fontFamily: "Inter, sans-serif", fontWeight: 400, fontSize: "13px" }}>
                        These policy and guidelines formulated to assure that data and information released or shared by Consolatrix College of Toledo City, Inc. are timely, accurate, comprehensive, authoritative, and relevant to all aspects of the school's system. In accordance with CCTC's conviction that there must be a clear alignment in curriculum, instructional practice and assessment, these policy and guidelines will provide the framework to facilitate the timely dissemination of data and information.
                      </p>
                      <p className="font-normal leading-relaxed" style={{ color: "#041A44", fontFamily: "Inter, sans-serif", fontWeight: 400, fontSize: "13px" }}>
                        Adherence to these policy and guidelines will reinforce its current nondiscriminatory practices on sex, race, color, national origin, religion, weight, marital status, disability, age, political affiliation, sexual orientation, or any other status covered by local law.
                      </p>
                    </div>

                    {/* Scope Section */}
                    <div className="rounded-lg p-5 mb-6" style={{ backgroundColor: "#C4D7F0" }}>
                      <h2 className="font-bold mb-4" style={{ color: "#041A44", fontSize: "15px", fontFamily: "Inter, sans-serif", fontWeight: 700 }}>II. Scope</h2>
                      <p className="font-normal leading-relaxed" style={{ color: "#041A44", fontFamily: "Inter, sans-serif", fontWeight: 400, fontSize: "13px" }}>
                        These policy and guidelines on social media use apply to all CCTC employees, teachers, students, and auxiliary personnel. These cover all social media networks and platforms, blogs, photo/image sharing, wikis, online forums, and video sharing.
                      </p>
                    </div>

                    {/* Definitions Section */}
                    <div className="rounded-lg p-5 mb-6" style={{ backgroundColor: "#C4D7F0" }}>
                      <h2 className="font-bold mb-4" style={{ color: "#041A44", fontFamily: "Inter, sans-serif", fontWeight: 700, fontSize: "15px" }}>Definitions</h2>

                      <div className="space-y-4">
                        <div className="bg-white rounded-lg p-4 shadow-sm">
                          <h3 className="font-bold mb-2" style={{ color: "#041A44", fontFamily: "Inter, sans-serif", fontWeight: 700, fontSize: "15px" }}>Social Media Account</h3>
                          <p className="font-normal leading-relaxed" style={{ color: "#041A44", fontFamily: "Inter, sans-serif", fontWeight: 400, fontSize: "13px" }}>
                            Any and all accounts, profiles, pages, feeds, registrations, and connection with any social networking website or social media (such as YouTube, Twitter, Facebook, Instagram, SnapChat, and other social networking platforms) enable users to sign up with their personal social media account, which can be used to connect, communicate, and exchange content and status update. When a user communicates through a social media account, their disclosures are attributed to their User Profile.
                          </p>
                        </div>

                        <div className="bg-white rounded-lg p-4 shadow-sm">
                          <h3 className="font-bold mb-2" style={{ color: "#041A44", fontFamily: "Inter, sans-serif", fontWeight: 700, fontSize: "15px" }}>Social Media Channels</h3>
                          <p className="font-normal leading-relaxed" style={{ color: "#041A44", fontFamily: "Inter, sans-serif", fontWeight: 400, fontSize: "13px" }}>
                            These can be any forms of electronic communication through which users create online communities to share information, ideas, personal messages, and other contents such as blogs, micro-blogs, wikis, social networks, social bookmarking services, user rating services, whether accessed through the web, a cellular device, text messaging, e-mail, or other existing or emerging communications platforms.
                          </p>
                        </div>

                        <div className="bg-white rounded-lg p-4 shadow-sm">
                          <h3 className="font-bold mb-2" style={{ color: "#041A44", fontFamily: "Inter, sans-serif", fontWeight: 700, fontSize: "15px" }}>Professional Social Media</h3>
                          <p className="font-normal leading-relaxed mb-2" style={{ color: "#041A44", fontFamily: "Inter, sans-serif", fontWeight: 400, fontSize: "13px" }}>
                            Professional social media is a work-related social media activity that is either school-based (e.g., CCTC principal establishing a Facebook page for his/her school, or school department, or CCTC teacher establishing a blog for his/her class).
                          </p>
                          <p className="font-normal leading-relaxed" style={{ color: "#041A44", fontFamily: "Inter, sans-serif", fontWeight: 400, fontSize: "13px" }}>
                            Professional social media can be in a form of blog posts, blog comments, status update, text messages, posts via email, images, audio recordings, video recordings, or any other information made available through a social media channel. Social media disclosures are the actual communications a user discloses through a social media channel, usually by means of their social media account.
                          </p>
                        </div>

                        <div className="bg-white rounded-lg p-4 shadow-sm">
                          <h3 className="font-bold mb-2" style={{ color: "#041A44", fontFamily: "Inter, sans-serif", fontWeight: 700, fontSize: "15px" }}>Controversial Issues</h3>
                          <p className="font-normal leading-relaxed" style={{ color: "#041A44", fontFamily: "Inter, sans-serif", fontWeight: 400, fontSize: "13px" }}>
                            These are topics or issues that result in a dispute and a disagreement on the basis of a difference of opinion which are frequently debated in political campaigns as controversial or divisive in nature that provoke a strong emotional response. Topics may include political views, health care reform, education reform, and gun control.
                          </p>
                        </div>

                        <div className="bg-white rounded-lg p-4 shadow-sm">
                          <h3 className="font-bold mb-2" style={{ color: "#041A44", fontFamily: "Inter, sans-serif", fontWeight: 700, fontSize: "15px" }}>Inbound Links</h3>
                          <p className="font-normal leading-relaxed mb-2" style={{ color: "#041A44", fontFamily: "Inter, sans-serif", fontWeight: 400, fontSize: "13px" }}>
                            To define an Inbound Link, a clear definition of what a hyperlink is necessary. A hyperlink is defined as a hypertext file or document to another location or file, typically activated by clicking on a highlighted word or image on the screen. Uniform Resource Locator (URL) is commonly known as website addresses, examples of which are 'Google.com', 'Yahoo.com', 'Youtube.com' etc.
                          </p>
                          <p className="font-normal leading-relaxed mb-2" style={{ color: "#041A44", fontFamily: "Inter, sans-serif", fontWeight: 400, fontSize: "13px" }}>
                            Inbound links are terms, or words use in searching the net as well as searching for specific websites or Domain Names, an example of which is using common search engines and the address bar of our browsers. These words, terminologies, or URLs are then sent forth from your PCs, laptops, or any handheld devices that has internet access, to the corresponding website that 'holds or contains' those pieces of information you are 'looking/searching for' and these became the 'inbound links'.
                          </p>
                          <p className="font-normal leading-relaxed" style={{ color: "#041A44", fontFamily: "Inter, sans-serif", fontWeight: 400, fontSize: "13px" }}>
                            In a sense it is the process of sending-receiving (devices to search engines), then sending and receiving again (search engines-various domain sources) and back to users' devices.
                          </p>
                        </div>

                        <div className="bg-white rounded-lg p-4 shadow-sm">
                          <h3 className="font-bold mb-2" style={{ color: "#041A44", fontFamily: "Inter, sans-serif", fontWeight: 700, fontSize: "15px" }}>Hosted Content</h3>
                          <p className="font-normal leading-relaxed mb-2" style={{ color: "#041A44", fontFamily: "Inter, sans-serif", fontWeight: 400, fontSize: "13px" }}>
                            Hosted contents refer to the contents of various websites in the internet, which can be text, images, audio, video, or documents of various formats that were uploaded and are stored in various websites as well as social media sites.
                          </p>
                          <p className="font-normal leading-relaxed mb-2" style={{ color: "#041A44", fontFamily: "Inter, sans-serif", fontWeight: 400, fontSize: "13px" }}>
                            The term 'Hosted' refers to the owner of the contents mentioned above that is protected by copyright laws. Such contents are normally stored in online servers such as web hosting sites (like hostgator.com, hostinger.com, godaddy.com, wix.com, etc.). Though some prefer to host their own website contents, such will require having their own servers in their respective companies and institutions. These servers have their own specific functions from website hosting, file server, and data server.
                          </p>
                          <p className="font-normal leading-relaxed" style={{ color: "#041A44", fontFamily: "Inter, sans-serif", fontWeight: 400, fontSize: "13px" }}>
                            Hosted contents as prior mentioned is subject to copyright protection in order to prevent plagiarism and ensure the maker or creator of videos, images, documents, and audio recordings are not abused online.
                          </p>
                        </div>

                        <div className="bg-white rounded-lg p-4 shadow-sm">
                          <h3 className="font-bold mb-2" style={{ color: "#041A44", fontFamily: "Inter, sans-serif", fontWeight: 700, fontSize: "15px" }}>Copyrights</h3>
                          <p className="font-normal leading-relaxed" style={{ color: "#041A44", fontFamily: "Inter, sans-serif", fontWeight: 400, fontSize: "13px" }}>
                            Copyright refers to the right to the owner of intellectual property which protects him/her to control the reproduction and use of any creative expression that has been fixed in tangible form, such as literary works, graphical works, photographic works, audio visual works, electronic works, and musical works. Copyright is the right to copy in simpler terms. This ensures that the original designers/creators of the goods/products and anyone allowed to do so are the only ones with the exclusive right to replicate/ reproduce the work.
                          </p>
                        </div>

                        <div className="bg-white rounded-lg p-4 shadow-sm">
                          <h3 className="font-bold mb-2" style={{ color: "#041A44", fontFamily: "Inter, sans-serif", fontWeight: 700, fontSize: "15px" }}>Official Content</h3>
                          <p className="font-normal leading-relaxed" style={{ color: "#041A44", fontFamily: "Inter, sans-serif", fontWeight: 400, fontSize: "13px" }}>
                            Official content is a publicly available online content, created and made public by Consolatrix College of Toledo City, Inc. verified by virtue of the fact that it is accessible through its Facebook pages.
                          </p>
                        </div>

                        <div className="bg-white rounded-lg p-4 shadow-sm">
                          <h3 className="font-bold mb-2" style={{ color: "#041A44", fontFamily: "Inter, sans-serif", fontWeight: 700, fontSize: "15px" }}>Blog</h3>
                          <p className="font-normal leading-relaxed" style={{ color: "#041A44", fontFamily: "Inter, sans-serif", fontWeight: 400, fontSize: "13px" }}>
                            A blog is a regularly updated website where new content is often released, usually written in an informal or conversational style - often with the intention of attracting readers and achieving some kind of purpose, whether community building or business development.
                          </p>
                        </div>

                        <div className="bg-white rounded-lg p-4 shadow-sm">
                          <h3 className="font-bold mb-2" style={{ color: "#041A44", fontFamily: "Inter, sans-serif", fontWeight: 700, fontSize: "15px" }}>Microblogging</h3>
                          <p className="font-normal leading-relaxed" style={{ color: "#041A44", fontFamily: "Inter, sans-serif", fontWeight: 400, fontSize: "13px" }}>
                            Microblogging is a hybrid of blogging and instant messaging that allows users to create short messages that can be posted and exchanged with online audiences. Social networks like Twitter have become the most common ways of this new type of blogging, particularly on the mobile web - making it much easier to connect with people compared to the days of web surfing.
                          </p>
                        </div>

                        <div className="bg-white rounded-lg p-4 shadow-sm">
                          <h3 className="font-bold mb-2" style={{ color: "#041A44", fontFamily: "Inter, sans-serif", fontWeight: 700, fontSize: "15px" }}>Cyberbullying</h3>
                          <p className="font-normal leading-relaxed" style={{ color: "#041A44", fontFamily: "Inter, sans-serif", fontWeight: 400, fontSize: "13px" }}>
                            Cyberbullying is the use of digital media (such as the internet and mobile phones) to make someone else repeatedly feel mad, sad, or afraid. Examples of cyberbullying involve sending hurtful text or instant messages, sharing compromising images or videos on social media, and spreading or circulating negative rumors online or via mobile phone.
                          </p>
                        </div>
                      </div>
                    </div>

                    {/* Policy on Social Media Use Section */}
                    <div className="rounded-lg p-5 mb-6" style={{ backgroundColor: "#C4D7F0" }}>
                      <h2 className="font-bold mb-4" style={{ color: "#041A44", fontFamily: "Inter, sans-serif", fontWeight: 700, fontSize: "15px" }}>POLICY ON SOCIAL MEDIA USE</h2>

                      <p className="font-normal leading-relaxed mb-3" style={{ color: "#041A44", fontFamily: "Inter, sans-serif", fontWeight: 400, fontSize: "13px" }}>
                        Following the dissemination of information on RA 10173 otherwise known as Data Privacy Act of 1992, Consolatrix College of Toledo City, Inc. formulates policies that shall promote responsible use of social media, thus:
                      </p>

                      <p className="font-normal leading-relaxed mb-4" style={{ color: "#041A44", fontFamily: "Inter, sans-serif", fontWeight: 400, fontSize: "13px" }}>
                        Greater responsibility and tact should be observed in the sharing of all forms of social media. Online learners must be responsible in sharing social media contents.
                      </p>

                      <div className="bg-white rounded-lg p-4 shadow-sm">
                        <p className="font-normal leading-relaxed mb-4" style={{ color: "#041A44", fontFamily: "Inter, sans-serif", fontWeight: 400, fontSize: "13px" }}>
                          The following acts in line with social media use shall be under disciplinary actions (Sanctions are also imposed based on <strong>Data Privacy Act or RA 10173</strong>):
                        </p>
                        <ol className="space-y-2 list-decimal list-inside" style={{ color: "#041A44", fontFamily: "Inter, sans-serif", fontWeight: 400, fontSize: "13px" }}>
                          <li>Posting illegal actions such as experimenting with alcohol and prohibited substances.</li>
                          <li>Bullying: Using social media to use as a forum for hurtful speech (RA 10627: <strong>Anti-bullying Act of 2013</strong>).</li>
                          <li>Trashing teachers and other school personnel; speaking poorly of teachers and/or other school officials and personnel (RA 10627: <strong>Anti-bullying Act of 2013, Section 3</strong>).</li>
                          <li>Posting objectionable content from school computers or networks (RA 10175: <strong>Cybercrime Prevention Act of 2012</strong>).</li>
                          <li>Posting confidential information (Chapter V-<strong>Security of Personal Information, RA 10173</strong>).</li>
                          <li>Ignoring School-specific Policies (e.g, posting of opinions on sensitive issues like abortion, homosexuality, euthanasia, and birth control or divorce).</li>
                        </ol>
                      </div>
                    </div>

                    {/* Reporting Section */}
                    <div className="rounded-lg p-5 mb-6" style={{ backgroundColor: "#C4D7F0" }}>
                      <div className="bg-white rounded-lg p-5 shadow-sm">
                        <h2 className="font-bold mb-4" style={{ color: "#041A44", fontFamily: "Inter, sans-serif", fontWeight: 700, fontSize: "15px" }}>Reporting</h2>

                        <p className="font-normal leading-relaxed mb-3" style={{ color: "#041A44", fontFamily: "Inter, sans-serif", fontWeight: 400, fontSize: "13px" }}>
                          Reports of irresponsible use of social media should be made as soon as possible after the alleged act or acknowledgement of irresponsible social media conduct. The failure to promptly report may impair the Guidance Counselor or the Discipline Committee's ability to investigate and address the prohibited conduct.
                        </p>

                        <p className="font-normal leading-relaxed mb-4" style={{ color: "#041A44", fontFamily: "Inter, sans-serif", fontWeight: 400, fontSize: "13px" }}>
                          Any student who observed and have personally seen and experienced violations against responsible use of social media should immediately report the alleged act to a teacher, clinical instructor, counsellor, or adviser. A report may be submitted to the Adviser or to the Discipline Committee.
                        </p>

                        <ol className="space-y-2 list-decimal list-inside" style={{ color: "#041A44", fontFamily: "Inter, sans-serif", fontWeight: 400, fontSize: "13px" }}>
                          <li><strong>Notice of Report.</strong> The Adviser who receives a notice that a student has committed the prohibited conduct shall immediately notify the Discipline Committee/Guidance Counselor.</li>
                          <li><strong>Investigation Report.</strong> The Discipline Committee shall conduct an appropriate investigation based on the allegations in the report. The committee shall then decide on the action or disciplinary measure based on the level of severity of infraction as outlined in this policy or as stipulated in the Student Handbook (Student Handbook should have included the School Action on reports of irresponsible use of social media).</li>
                          <li><strong>Concluding The Report.</strong> The investigation should be completed in five days. The Discipline Committee shall prepare a written report of the investigation and shall provide a copy to the Office of the Directress.</li>
                          <li><strong>School Action.</strong> If the results of the investigation indicate that the prohibited act was committed, the Discipline committee shall recommend to the Directress/Principal appropriate disciplinary or corrective action reasonably calculated to address the conduct in accordance with the current Student Handbook guidelines on discipline.</li>
                          <li><strong>Confidentiality.</strong> To the greatest extent possible, school officials shall also respect the privacy of the complaint, the person against whom the report is filed, and witnesses. Limited disclosure may be necessary in order to conduct a thorough investigation, (Chapter V Security of Personal Information, RA 10173).</li>
                        </ol>
                      </div>
                    </div>

                    {/* Guidelines on Posting Section */}
                    <div className="rounded-lg p-5 mb-6" style={{ backgroundColor: "#C4D7F0" }}>
                      <h2 className="font-bold mb-4" style={{ color: "#041A44", fontFamily: "Inter, sans-serif", fontWeight: 700, fontSize: "15px" }}>Guidelines On Posting or Sharing Media Contents</h2>

                      <ul className="space-y-2 list-disc list-inside" style={{ color: "#041A44", fontFamily: "Inter, sans-serif", fontWeight: 400, fontSize: "13px" }}>
                        <li>Each learner/student is personally responsible for the hosted content she/he publishes online. Published or hosted content on social media channels will be public for a long time. Contents published online represent you and everything about you. Online behavior should reflect the same standards of honesty, respect, and consideration that students use face-to-face.</li>
                        <li>Blogs, wikis, virtual conferences, and podcasts are an extension of our classrooms and are considered official content. Contents considered inappropriate in the classroom are also deemed inappropriate online.</li>
                        <li>Posting photos or videos of your fellow students without their permission is prohibited. Photos or videos taken at school without permission must not be posted or used for any purpose without the owner's permission. Photos and videos that are participated in or are involving fellow students must not be posted without the owner's permission written or verbally expressed.</li>
                        <li>Posting or sharing videos with disturbing content are strongly discouraged.</li>
                        <li>All information or data are considered confidential and should not be posted without their consent or those of their parents or guardians.</li>
                        <li>Personal use of social networking site, including Facebook, Twitter, and Instagram as a means to cause embarrassment or humiliation to any person must not be tolerated. Any incidence of cyberbullying should be reported to the School Authorities/Officials immediately.</li>
                        <li>Students/Learners are personally responsible for all comments/information and hosted content they publish/post online.</li>
                        <li>Comment and other posts in social media sites such as Facebook, Instagram, and Twitter should be done with discretion. Comments expressed via social networking pages under the impression of a 'private conversation' may still end up being shared into a more public domain even under private settings.</li>
                        <li>Prudence shall be exercised in posting comments related to Consolatrix College Of Toledo City, Inc., employees, staff and school-related events or activities. It is important to remember that when posting, even on the private settings, all posted contents are made public.</li>
                        <li>Permission should be sought from the subject/owner where possible before posting/sharing photographs and videos online.</li>
                      </ul>
                    </div>

                    {/* Social Networking Section */}
                    <div className="rounded-lg p-5 mb-6" style={{ backgroundColor: "#C4D7F0" }}>
                      <h2 className="font-bold mb-4" style={{ color: "#041A44", fontFamily: "Inter, sans-serif", fontWeight: 700, fontSize: "15px" }}>Social Networking</h2>

                      {/* The Role of Parents */}
                      <div className="bg-white rounded-lg p-4 shadow-sm mb-6">
                        <h3 className="font-bold mb-3" style={{ color: "#041A44", fontFamily: "Inter, sans-serif", fontWeight: 700, fontSize: "15px" }}>The Role of Parents</h3>
                        <ol className="space-y-2 list-decimal list-inside" style={{ color: "#041A44", fontFamily: "Inter, sans-serif", fontWeight: 400, fontSize: "13px" }}>
                          <li>Parents/guardians are highly encouraged to talk to their children regarding social media and provide guidance in their use of social media and the internet.</li>
                          <li>Parents/guardians must ensure that their children use/visit sites which deliver/provide appropriate contents.</li>
                          <li>Parents/guardians are expected to guide their children in providing personal information and data in sites visited or viewed.</li>
                          <li>Parents/guardians are encouraged to become role models in treating with respect and confidentiality other persons' personal information or data.</li>
                        </ol>
                      </div>

                      {/* The Role of Teachers */}
                      <div className="bg-white rounded-lg p-4 shadow-sm">
                        <h3 className="font-bold mb-3" style={{ color: "#041A44", fontFamily: "Inter, sans-serif", fontWeight: 700, fontSize: "15px" }}>The Role of Teachers</h3>
                        <ol className="space-y-2 list-decimal list-inside" style={{ color: "#041A44", fontFamily: "Inter, sans-serif", fontWeight: 400, fontSize: "13px" }}>
                          <li>Social media use and networking should be a way for teachers to become leaders and models with their fellow teachers and students/learners. Teachers are expected to communicate and provide knowledge in a way that is worthy of their profession.</li>
                          <li>Since technology is a convenient way of communicating and providing information, teachers are expected to practice professional digital communication with their fellow teachers as well as with their students/learners.</li>
                          <li>Teachers must be role models to their students/learners in using social media. Use of social media such as Instagram, Twitter, Personal blogs, and other apps should be in line with school policy. Teachers should remind students/learners that school-related assignments and issues are dealt with within reasonable time bounds (office hours) and are not "exclusive" forms of communication.</li>
                          <li>Teachers should help their students/learners to connect and collaborate in a deeper level using the internet or social media and enhance students' interaction and classroom activities through the use of different internet applications.</li>
                          <li>Teachers must safeguard students' interaction and behavior with their fellow students to avoid misconduct or abuse of the use of social media by students.</li>
                          <li>Teachers should encourage students to use reflective conversations and maintain a standard of decorum in their own public profiles.</li>
                        </ol>
                      </div>
                    </div>
                  </div>
                </>
              ) : (
                <>
                  {/* Section Header */}
                  <div className="bg-white rounded-lg shadow-sm p-4 sm:p-6 md:p-8 mb-4 sm:mb-6 mt-4 sm:mt-6 md:mt-8" style={{ backgroundColor: "#041A44" }}>
                    <div className="text-xs sm:text-sm mb-3 sm:mb-4 px-2 sm:px-3 py-1 bg-blue-100 text-blue-800 rounded-full inline-block" style={{ backgroundColor: "transparent", color: "white", border: "1px solid white" }}>
                      Section XV
                    </div>
                    <h2 className="text-base sm:text-xl md:text-2xl font-bold mb-3 sm:mb-4" style={{ color: "white", fontFamily: "Inter, sans-serif", fontWeight: 700 }}>
                      LEARNING RESOURCE CENTER (LIBRARY)
                    </h2>
                    <p className="text-gray-600 mb-0 text-[10px] sm:text-sm md:text-base" style={{ color: "white", fontFamily: "Inter, sans-serif", fontWeight: 400 }}>
                      Guidelines on library services, resources, and user responsibilities
                    </p>
                  </div>

                  {/* Main White Container */}
                  <div className="rounded-lg shadow-sm p-6 mb-4" style={{ backgroundColor: "#FFFFFF" }}>
                    {/* Introduction Paragraph */}
                    <p className="mb-4" style={{ color: "#041A44", fontFamily: "Inter, sans-serif", fontWeight: 400, fontSize: "15px", lineHeight: 1.8, textAlign: "justify" }}>
                      The library offers academic library resources and services to support the school community's instructional, curricular, research, and extension programs. The library strives to provide an adequate and stimulating learning environment through organized, relevant and fast delivery of information services and excellent facilities.
                    </p>

                    {/* Blue Container: Online Public Access Catalog */}
                    <div className="rounded-lg p-4 mb-4" style={{ backgroundColor: "#C4D7F0" }}>
                      <p className="mb-3" style={{ color: "#041A44", fontFamily: "Inter, sans-serif", fontWeight: 700, fontSize: "15px" }}>ONLINE PUBLIC ACCESS CATALOG</p>
                      <p className="mb-3" style={{ color: "#041A44", fontFamily: "Inter, sans-serif", fontWeight: 400, fontSize: "14px", lineHeight: 1.8 }}>
                        Students are given individual account for the library. They can access the OPAC where they can search the available books in the library and schedule to get the book at school and take it home with the following guidelines:
                      </p>
                      <ol className="mb-0" style={{ listStyleType: "decimal", paddingLeft: "20px", color: "#041A44", fontFamily: "Inter, sans-serif", fontWeight: 400, fontSize: "14px", lineHeight: 1.8 }}>
                        <li className="mb-1">The school ID is required for all transactions in the library;</li>
                        <li className="mb-1">The student should have an OPAC account;</li>
                        <li className="mb-1">The student has reserved the book in advance via messaging the library in-charge in the LMS;</li>
                        <li className="mb-1">The student can borrow with a maximum of 5 books for 1 week.</li>
                        <li className="mb-1">A book must be returned to the library in a specified due date.</li>
                        <li className="mb-0">Overdue, lost books and damaged materials will incur payment.</li>
                      </ol>
                    </div>

                    {/* Blue Container: World Book Online */}
                    <div className="rounded-lg p-4 mb-4" style={{ backgroundColor: "#C4D7F0" }}>
                      <div className="flex items-center mb-3">
                        <span className="font-bold mr-3" style={{ color: "white", backgroundColor: "#041A44", fontFamily: "Inter, sans-serif", fontSize: "12px", width: "24px", height: "24px", borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>A</span>
                        <p className="mb-0" style={{ color: "#041A44", fontFamily: "Inter, sans-serif", fontWeight: 700, fontSize: "15px" }}>WORLD BOOK ONLINE</p>
                      </div>
                      <p className="mb-0" style={{ color: "#041A44", fontFamily: "Inter, sans-serif", fontWeight: 400, fontSize: "14px", lineHeight: 1.8 }}>
                        Students can access online encyclopedia and enjoy other activities via World Book Online.
                      </p>
                    </div>

                    {/* Blue Container: Online Public Access Catalog (B) */}
                    <div className="rounded-lg p-4 mb-0" style={{ backgroundColor: "#C4D7F0" }}>
                      <div className="flex items-center mb-3">
                        <span className="font-bold mr-3" style={{ color: "white", backgroundColor: "#041A44", fontFamily: "Inter, sans-serif", fontSize: "12px", width: "24px", height: "24px", borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>B</span>
                        <p className="mb-0" style={{ color: "#041A44", fontFamily: "Inter, sans-serif", fontWeight: 700, fontSize: "15px" }}>ONLINE PUBLIC ACCESS CATALOG</p>
                      </div>
                      <p className="mb-3" style={{ color: "#041A44", fontFamily: "Inter, sans-serif", fontWeight: 400, fontSize: "14px", lineHeight: 1.8 }}>
                        Students are given individual account for the library. They can access the OPAC where they can search the available books in the library and schedule to get the book and take it home with the following guidelines.
                      </p>
                      <ol className="mb-0" style={{ listStyleType: "decimal", paddingLeft: "20px", color: "#041A44", fontFamily: "Inter, sans-serif", fontWeight: 400, fontSize: "14px", lineHeight: 1.8 }}>
                        <li className="mb-1">The school ID is required for all transactions in the library;</li>
                        <li className="mb-0">The student should have an OPAC account</li>
                      </ol>
                    </div>
                  </div>
                </>
              )}
            </div>
          )}

          {/* Section XVI: Student Services */}
          {selectedSection === 16 && (
            <div className="w-full">
              {isBasicEducation ? (
                <>
                  {/* Section Header */}
                  <div className="bg-white rounded-lg shadow-sm p-4 sm:p-6 md:p-8 mb-4 sm:mb-6 mt-4 sm:mt-6 md:mt-8" style={{ backgroundColor: "#041A44" }}>
                    <div className="text-xs sm:text-sm mb-3 sm:mb-4 px-2 sm:px-3 py-1 bg-blue-100 text-blue-800 rounded-full inline-block" style={{ backgroundColor: "transparent", color: "white", border: "1px solid white" }}>
                      Section XVI
                    </div>
                    <h2 className="text-base sm:text-xl md:text-2xl font-bold mb-3 sm:mb-4" style={{ color: "white", fontFamily: "Inter, sans-serif", fontWeight: 700 }}>
                      STUDENT SERVICES
                    </h2>
                    <p className="text-gray-600 mb-0 text-[10px] sm:text-sm md:text-base" style={{ color: "white", fontFamily: "Inter, sans-serif", fontWeight: 400 }}>
                      Support services available to students.
                    </p>
                  </div>

                  {/* Main White Container with all content */}
                  <div className="bg-white rounded-lg shadow-sm p-6 mb-6" style={{ backgroundColor: "#FFFFFF" }}>
                    {/* Introduction Section */}
                    <div className="rounded-lg p-5 mb-6" style={{ backgroundColor: "#C4D7F0" }}>
                      <p className="font-normal leading-relaxed mb-4" style={{ color: "#041A44", fontFamily: "Inter, sans-serif", fontWeight: 400, fontSize: "13px" }}>
                        Consolatrix College of Toledo City, Inc. works toward synergizing its efforts to realize the school's vision-mission of bridging faith in the service of society, especially the poor and marginalized.
                      </p>
                      <p className="font-normal leading-relaxed" style={{ color: "#041A44", fontFamily: "Inter, sans-serif", fontWeight: 400, fontSize: "13px" }}>
                        CCTC's student services are responsible for the formulation of holistic and spiritual formation programs that respond to the needs of students, administrators, faculty, and co-academic personnel of the community. These services are also structured to complement the academic potentials of the students by promoting integrity and creating synergy in its programs and activities. They are the prime movers, caretakers and catalysts of change entrusted in leading the community to reach their full potentials and living fully the core values.
                      </p>
                    </div>

                    {/* 1. Student Development and Placement Center */}
                    <h3 className="font-bold mb-4" style={{ color: "#041A44", fontFamily: "Inter, sans-serif", fontWeight: 700, fontSize: "15px" }}>1. Student Development and Placement Center</h3>

                    {/* Counselling Service */}
                    <div className="rounded-lg p-5 mb-4" style={{ backgroundColor: "#C4D7F0" }}>
                      <div className="flex items-start mb-3">
                        <div className="w-8 h-8 rounded-full flex items-center justify-center mr-3 flex-shrink-0" style={{ backgroundColor: "#041A44", fontFamily: "Inter, sans-serif", fontWeight: 700, color: "white", fontSize: "14px" }}>1</div>
                        <h4 className="font-bold" style={{ color: "#041A44", fontFamily: "Inter, sans-serif", fontWeight: 700, fontSize: "15px" }}>Counselling Service</h4>
                      </div>
                      <p className="font-normal leading-relaxed" style={{ color: "#041A44", fontFamily: "Inter, sans-serif", fontWeight: 400, fontSize: "13px" }}>
                        This provided for the students who are in need of professional help as life circumstances made it difficult for them to thrive and therefore affecting their psychological well-being. The process itself given institute as ethical practice in counseling is ensured with effective interventions and helping techniques that are given to the students when needed. Students in need of counseling service may voluntarily visit Office of the Guidance Counselor for more assessment while other cases may be referred by concerned significant others in the students' life.
                      </p>
                    </div>

                    {/* Career Development and Placement */}
                    <div className="rounded-lg p-5 mb-4" style={{ backgroundColor: "#C4D7F0" }}>
                      <div className="flex items-start mb-3">
                        <div className="w-8 h-8 rounded-full flex items-center justify-center mr-3 flex-shrink-0" style={{ backgroundColor: "#041A44", fontFamily: "Inter, sans-serif", fontWeight: 700, color: "white", fontSize: "14px" }}>2</div>
                        <h4 className="font-bold" style={{ color: "#041A44", fontFamily: "Inter, sans-serif", fontWeight: 700, fontSize: "15px" }}>Career Development and Placement</h4>
                      </div>
                      <p className="font-normal leading-relaxed" style={{ color: "#041A44", fontFamily: "Inter, sans-serif", fontWeight: 400, fontSize: "13px" }}>
                        This is designed for all integrated School students from Kindergarten to Grade 12. This aims to provide them with carefully crafted career exploration activities that will help them clarify thoughts and feelings about career choices. Customary assistance given to students included, but not limited to career assessment, career symposia and exhibits, career counseling, assistance to school admission, and small group learning sessions on career-life development.
                      </p>
                    </div>

                    {/* Program Development */}
                    <div className="rounded-lg p-5 mb-4" style={{ backgroundColor: "#C4D7F0" }}>
                      <div className="flex items-start mb-3">
                        <div className="w-8 h-8 rounded-full flex items-center justify-center mr-3 flex-shrink-0" style={{ backgroundColor: "#041A44", fontFamily: "Inter, sans-serif", fontWeight: 700, color: "white", fontSize: "14px" }}>3</div>
                        <h4 className="font-bold" style={{ color: "#041A44", fontFamily: "Inter, sans-serif", fontWeight: 700, fontSize: "15px" }}>Program Development</h4>
                      </div>
                      <p className="font-normal leading-relaxed" style={{ color: "#041A44", fontFamily: "Inter, sans-serif", fontWeight: 400, fontSize: "13px" }}>
                        This activity is provided for students in response to the emergent collective needs and issues experienced due to complexity of living. It aims to target the specific population or group of students that may need extensive assistance.
                      </p>
                    </div>

                    {/* Research Engagement */}
                    <div className="rounded-lg p-5 mb-4" style={{ backgroundColor: "#C4D7F0" }}>
                      <div className="flex items-start mb-3">
                        <div className="w-8 h-8 rounded-full flex items-center justify-center mr-3 flex-shrink-0" style={{ backgroundColor: "#041A44", fontFamily: "Inter, sans-serif", fontWeight: 700, color: "white", fontSize: "14px" }}>4</div>
                        <h4 className="font-bold" style={{ color: "#041A44", fontFamily: "Inter, sans-serif", fontWeight: 700, fontSize: "15px" }}>Research Engagement</h4>
                      </div>
                      <p className="font-normal leading-relaxed" style={{ color: "#041A44", fontFamily: "Inter, sans-serif", fontWeight: 400, fontSize: "13px" }}>
                        This is considered as an indirect service that affects students' life and success. But research engagement at the office of the Guidance staff will contribute largely in the continuous development of the culture of care at the school as a whole. Common activities that are covered within this service include student population profiling, cumulative inventory analysis, assessment surveying, and conceptualization of research agenda.
                      </p>
                    </div>

                    {/* Psychological Testing Service */}
                    <div className="rounded-lg p-5 mb-4" style={{ backgroundColor: "#C4D7F0" }}>
                      <div className="flex items-start mb-3">
                        <div className="w-8 h-8 rounded-full flex items-center justify-center mr-3 flex-shrink-0" style={{ backgroundColor: "#041A44", fontFamily: "Inter, sans-serif", fontWeight: 700, color: "white", fontSize: "14px" }}>5</div>
                        <h4 className="font-bold" style={{ color: "#041A44", fontFamily: "Inter, sans-serif", fontWeight: 700, fontSize: "15px" }}>Psychological Testing Service</h4>
                      </div>
                      <p className="font-normal leading-relaxed" style={{ color: "#041A44", fontFamily: "Inter, sans-serif", fontWeight: 400, fontSize: "13px" }}>
                        This is guided by the current office of the Guidance Counselor testing program that includes assessment, testing of new assessment, testing materials are purposively selected according to the needs of the institution and the necessary feedback on individual school progress made by students and parents. Exclusive or isolated need for other psychological testing (i.e. mental ability assessment and personality testing) may be arranged and coordinated through this service as need arises.
                      </p>
                    </div>

                    {/* Counselors Professional Development and Ethical Practice */}
                    <div className="rounded-lg p-5 mb-6" style={{ backgroundColor: "#C4D7F0" }}>
                      <div className="flex items-start mb-3">
                        <div className="w-8 h-8 rounded-full flex items-center justify-center mr-3 flex-shrink-0" style={{ backgroundColor: "#041A44", fontFamily: "Inter, sans-serif", fontWeight: 700, color: "white", fontSize: "14px" }}>6</div>
                        <h4 className="font-bold" style={{ color: "#041A44", fontFamily: "Inter, sans-serif", fontWeight: 700, fontSize: "15px" }}>Counselors Professional Development and Ethical Practice</h4>
                      </div>
                      <p className="font-normal leading-relaxed" style={{ color: "#041A44", fontFamily: "Inter, sans-serif", fontWeight: 400, fontSize: "13px" }}>
                        This is considered as an indirect service that affects students' well-being. As the School Counselling practice and Guidance Program management constantly improve, the need for Counselors Professional development among the Guidance staff is necessary. Effective and efficient delivery of services and programs are ensured when providers are equipped with professional credibility and possess enhanced self-care practice.
                      </p>
                    </div>

                    {/* 2. Student Discipline and Formation Office */}
                    <h3 className="font-bold mb-4" style={{ color: "#041A44", fontFamily: "Inter, sans-serif", fontWeight: 700, fontSize: "15px" }}>2. STUDENT DISCIPLINE AND FORMATION OFFICE</h3>

                    <div className="rounded-lg p-5 mb-4" style={{ backgroundColor: "#C4D7F0" }}>
                      <p className="font-normal leading-relaxed" style={{ color: "#041A44", fontFamily: "Inter, sans-serif", fontWeight: 400, fontSize: "13px" }}>
                        The Student Discipline and Formation Office (SDFO) is a unit in the Integrated School tasked to promote, supervise, and ensure the overall safety and discipline of the students while on campus, and in special cases, outside the campus. It is headed by the Student Formation Coordinator.
                      </p>
                    </div>

                    <div className="rounded-lg p-5 mb-6" style={{ backgroundColor: "#C4D7F0" }}>
                      <p className="font-normal leading-relaxed mb-4" style={{ color: "#041A44", fontFamily: "Inter, sans-serif", fontWeight: 400, fontSize: "13px" }}>
                        The office envisions itself to be the leading unit assisting the student community in the exercise of self-control, discipline and good conduct while embodying the virtues of a true Consolatarian. It offers the following programs and services:
                      </p>
                      <ol className="space-y-2 list-decimal list-inside" style={{ color: "#041A44", fontFamily: "Inter, sans-serif", fontWeight: 400, fontSize: "13px" }}>
                        <li>An orientation on School Rules and Regulation an orientation for teachers, parents and students are conducted at the start of the school year. A re-orientation is likewise done in the middle of the school year for reinforcement and reminders.</li>
                        <li>Seminars/Webinars Students, parents and faculty are given seminars to assist all stakeholders in proper handling of common discipline issues and concerns.</li>
                      </ol>
                    </div>

                    {/* 3. Health Services */}
                    <div className="rounded-lg p-5 mb-6" style={{ backgroundColor: "#C4D7F0" }}>
                      <h3 className="font-bold mb-4" style={{ color: "#041A44", fontFamily: "Inter, sans-serif", fontWeight: 700, fontSize: "15px" }}>3. Health Services</h3>
                      <p className="font-normal leading-relaxed mb-3" style={{ color: "#041A44", fontFamily: "Inter, sans-serif", fontWeight: 400, fontSize: "13px" }}>
                        Health Services primarily plan and implement all activities and procedure designed to improve the current health status of all students. They assure the implementation of the health standards in the campus. health services also include health orientation and follow up of the students while they are at home.
                      </p>
                      <p className="font-normal leading-relaxed" style={{ color: "#041A44", fontFamily: "Inter, sans-serif", fontWeight: 400, fontSize: "13px" }}>
                        Health services also include keeping of the student health wellness record even if they are at home.
                      </p>
                    </div>

                    {/* 4. Library */}
                    <div className="rounded-lg p-5 mb-6" style={{ backgroundColor: "#C4D7F0" }}>
                      <h3 className="font-bold mb-4" style={{ color: "#041A44", fontFamily: "Inter, sans-serif", fontWeight: 700, fontSize: "15px" }}>4. Library</h3>
                      <p className="font-normal leading-relaxed mb-4" style={{ color: "#041A44", fontFamily: "Inter, sans-serif", fontWeight: 400, fontSize: "13px" }}>
                        The Libraries offer academic library resources and services to support the community's instructional, curricular, research, and extension programs. The Libraries strive to provide an adequate and stimulating learning environment through organized, relevant and fast delivery of information services and excellent facilities.
                      </p>
                      <div className="space-y-4">
                        <div className="bg-white rounded-lg p-4 shadow-sm">
                          <div className="flex items-center mb-3">
                            <div className="w-8 h-8 rounded-full flex items-center justify-center mr-3" style={{ backgroundColor: "#041A44", color: "white", fontFamily: "Inter, sans-serif", fontWeight: 700, fontSize: "14px" }}>A</div>
                            <h4 className="font-bold" style={{ color: "#041A44", fontFamily: "Inter, sans-serif", fontWeight: 700, fontSize: "15px" }}>World Book Online</h4>
                          </div>
                          <p className="font-normal leading-relaxed" style={{ color: "#041A44", fontFamily: "Inter, sans-serif", fontWeight: 400, fontSize: "13px" }}>
                            Student can access entire encyclopedic and enjoy other activities via World Book Online.
                          </p>
                        </div>
                        <div className="bg-white rounded-lg p-4 shadow-sm">
                          <div className="flex items-center mb-3">
                            <div className="w-8 h-8 rounded-full flex items-center justify-center mr-3" style={{ backgroundColor: "#041A44", color: "white", fontFamily: "Inter, sans-serif", fontWeight: 700, fontSize: "14px" }}>B</div>
                            <h4 className="font-bold" style={{ color: "#041A44", fontFamily: "Inter, sans-serif", fontWeight: 700, fontSize: "15px" }}>Online Public Access Catalog</h4>
                          </div>
                          <p className="font-normal leading-relaxed mb-3" style={{ color: "#041A44", fontFamily: "Inter, sans-serif", fontWeight: 400, fontSize: "13px" }}>
                            Students will be given individual account for the library. They can access the OPAC where they can search the available books in the library and schedule to get the book in school and take it home with the following book loan rules:
                          </p>
                          <ol className="space-y-2 list-decimal list-inside" style={{ color: "#041A44", fontFamily: "Inter, sans-serif", fontWeight: 400, fontSize: "13px" }}>
                            <li>The school ID is required for all transactions in the library.</li>
                            <li>The student should have an OPAC account.</li>
                            <li>The student has reserved the book in advance via messaging the library in-charge in the LMS.</li>
                            <li>The student can borrow 3 books for 1 week.</li>
                            <li>A book must be returned to the library in a specified due date.</li>
                            <li>Overdue, lost books and damage materials will incur payment.</li>
                          </ol>
                        </div>
                      </div>
                    </div>

                    {/* 5. The Learning Management System */}
                    <div className="rounded-lg p-5 mb-6" style={{ backgroundColor: "#C4D7F0" }}>
                      <h3 className="font-bold mb-4" style={{ color: "#041A44", fontFamily: "Inter, sans-serif", fontWeight: 700, fontSize: "15px" }}>5. The Learning Management System</h3>
                      <div className="bg-white rounded-lg p-4 shadow-sm">
                        <div className="flex items-center mb-3">
                          <div className="w-8 h-8 rounded-full flex items-center justify-center mr-3" style={{ backgroundColor: "#041A44", color: "white", fontFamily: "Inter, sans-serif", fontWeight: 700, fontSize: "14px" }}>A</div>
                          <h4 className="font-bold" style={{ color: "#041A44", fontFamily: "Inter, sans-serif", fontWeight: 700, fontSize: "15px" }}>1. ARALINKS</h4>
                        </div>
                        <p className="font-normal leading-relaxed" style={{ color: "#041A44", fontFamily: "Inter, sans-serif", fontWeight: 400, fontSize: "13px" }}>
                          CCTC uses ARALINKS, powered by Phoenix Publishing Inc. as its main Learning Management System (LMS) is a software application that administers, documents, track and reports the delivery on an online course. All learning activities will be done (posted) in the LMS, as well as important announcements and notices. However, we teachers can also use back-up LMS Application available, just in case that there are issues in using the preferred LMS.
                        </p>
                      </div>
                    </div>

                    {/* 6. The Augustinian Recollect Student Crusaders (ARSC) */}
                    <div className="rounded-lg p-5 mb-6" style={{ backgroundColor: "#C4D7F0" }}>
                      <h3 className="font-bold mb-4" style={{ color: "#041A44", fontFamily: "Inter, sans-serif", fontWeight: 700, fontSize: "15px" }}>6. The Augustinian Recollect Student Crusaders (ARSC)</h3>
                      <p className="font-normal leading-relaxed mb-3" style={{ color: "#041A44", fontFamily: "Inter, sans-serif", fontWeight: 400, fontSize: "13px" }}>
                        The Augustinian Recollect Student Crusaders (ARSC) is the Supreme Student Council of all Augustinian Recollect Sisters Schools in the Philippines.
                      </p>
                      <p className="font-normal leading-relaxed" style={{ color: "#041A44", fontFamily: "Inter, sans-serif", fontWeight: 400, fontSize: "13px" }}>
                        It is an official Organization of which, all clubs and other organizations are under its supervision and coordination in the studentry level only. It is governed by its Constitution and By-Laws duly recognized by the Securities and Exchange Commission (SEC). The purpose of which, is to continue the work of evangelization in all AR schools as commanded to us by our Lord himself. It is carried out through Ministries on Liturgy, Academics, Arts, Sports, Discipline and Community Involvement and other related ministries to present the youth from the infiltration of any militant group of our country today. Under its ministries are the different clubs that the students can join even they are at the comfort of their homes. The ARSC has clubs by which students are free to join.
                      </p>
                    </div>
                  </div>
                </>
              ) : (
                <>
                  {/* Section Header */}
                  <div className="bg-white rounded-lg shadow-sm p-4 sm:p-6 md:p-8 mb-4 sm:mb-6 mt-4 sm:mt-6 md:mt-8" style={{ backgroundColor: "#041A44" }}>
                    <div className="text-xs sm:text-sm mb-3 sm:mb-4 px-2 sm:px-3 py-1 bg-blue-100 text-blue-800 rounded-full inline-block" style={{ backgroundColor: "transparent", color: "white", border: "1px solid white" }}>
                      Section XVI
                    </div>
                    <h2 className="text-base sm:text-xl md:text-2xl font-bold mb-3 sm:mb-4" style={{ color: "white", fontFamily: "Inter, sans-serif", fontWeight: 700 }}>
                      STUDENT SERVICES AND FACILITIES
                    </h2>
                    <p className="text-gray-600 mb-0 text-[10px] sm:text-sm md:text-base" style={{ color: "white", fontFamily: "Inter, sans-serif", fontWeight: 400 }}>
                      Policies outlining criteria for graduation, academic honors, and student recognition
                    </p>
                  </div>

              {/* Main White Container */}
              <div className="rounded-lg shadow-sm p-6 mb-4" style={{ backgroundColor: "#FFFFFF" }}>
                {/* Blue Container: Introduction */}
                <div className="rounded-lg p-4 mb-4" style={{ backgroundColor: "#C4D7F0" }}>
                  <p className="mb-3" style={{ color: "#041A44", fontFamily: "Inter, sans-serif", fontWeight: 400, fontSize: "14px", lineHeight: 1.8, textAlign: "justify" }}>
                    Consolatrix College of Toledo City, Inc. works toward synergizing its efforts to realize the school's vision-mission of bringing forth in the service of society, especially the poor and marginalized
                  </p>
                  <p className="mb-0" style={{ color: "#041A44", fontFamily: "Inter, sans-serif", fontWeight: 400, fontSize: "14px", lineHeight: 1.8, textAlign: "justify" }}>
                    CCTC's student services are responsible for the formulation of holistic and spiritual formation programs that respond to the needs of students, administrators, faculty, and co-academic personnel of the community. These services are also structured to complement the academic potentials of the students by promoting integrity and creating synergy in its programs and activities. They are the prime movers, conciliators and catalysts of change entrusted in leading the community to reach their full potentials for its core values.
                  </p>
                </div>

                {/* Section Title: Student Development and Placement Center */}
                <div className="flex items-start mb-4">
                  <span className="font-bold mr-3" style={{ color: "#041A44", fontFamily: "Inter, sans-serif", fontSize: "16px" }}>1</span>
                  <h3 className="font-bold" style={{ color: "#041A44", fontFamily: "Inter, sans-serif", fontWeight: 700, fontSize: "15px" }}>STUDENT DEVELOPMENT AND PLACEMENT CENTER</h3>
                </div>

                {/* Blue Container 1.1: Counseling Service */}
                <div className="rounded-lg p-4 mb-4" style={{ backgroundColor: "#C4D7F0" }}>
                  <div className="flex items-center mb-2">
                    <span className="font-bold mr-3" style={{ color: "white", backgroundColor: "#041A44", fontFamily: "Inter, sans-serif", fontSize: "10px", width: "28px", height: "28px", borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>1.1</span>
                    <p className="mb-0" style={{ color: "#041A44", fontFamily: "Inter, sans-serif", fontWeight: 700, fontSize: "14px" }}>Counseling Service</p>
                  </div>
                  <p className="mb-0" style={{ paddingLeft: "36px", color: "#041A44", fontFamily: "Inter, sans-serif", fontWeight: 400, fontSize: "14px", lineHeight: 1.8, textAlign: "justify" }}>
                    This is provided for the students who are in need of professional help as life circumstances made it difficult for them to thrive and thereby affecting their psycho-social well-being. The process itself gives skillfully as ethical practice in counseling is ensured while effective interventions and helping techniques are given as supported by documented studies. Students in need of counseling service may voluntarily visit Office of the Guidance Counselor for intake assessment while other cases may be referred by concerned significant others in the students' life.
                  </p>
                </div>

                {/* Blue Container 1.2: Program Development */}
                <div className="rounded-lg p-4 mb-4" style={{ backgroundColor: "#C4D7F0" }}>
                  <div className="flex items-center mb-2">
                    <span className="font-bold mr-3" style={{ color: "white", backgroundColor: "#041A44", fontFamily: "Inter, sans-serif", fontSize: "10px", width: "28px", height: "28px", borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>1.2</span>
                    <p className="mb-0" style={{ color: "#041A44", fontFamily: "Inter, sans-serif", fontWeight: 700, fontSize: "14px" }}>Program Development</p>
                  </div>
                  <p className="mb-0" style={{ paddingLeft: "36px", color: "#041A44", fontFamily: "Inter, sans-serif", fontWeight: 400, fontSize: "14px", lineHeight: 1.8, textAlign: "justify" }}>
                    This activity is provided for students in response to the emergent collective needs and issues experienced due to complexity of living. It aims to target the specific population or group of students that may need extensive assistance.
                  </p>
                </div>

                {/* Blue Container 1.3: Research Engagement */}
                <div className="rounded-lg p-4 mb-4" style={{ backgroundColor: "#C4D7F0" }}>
                  <div className="flex items-center mb-2">
                    <span className="font-bold mr-3" style={{ color: "white", backgroundColor: "#041A44", fontFamily: "Inter, sans-serif", fontSize: "10px", width: "28px", height: "28px", borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>1.3</span>
                    <p className="mb-0" style={{ color: "#041A44", fontFamily: "Inter, sans-serif", fontWeight: 700, fontSize: "14px" }}>Research Engagement</p>
                  </div>
                  <p className="mb-0" style={{ paddingLeft: "36px", color: "#041A44", fontFamily: "Inter, sans-serif", fontWeight: 400, fontSize: "14px", lineHeight: 1.8, textAlign: "justify" }}>
                    This is considered as an indirect service that affects students'  life and success. But research engagement of the Office of the Guidance staff will contribute largely in the continuous development of the "culture of care" of the unit and the school as a whole. Common activities that are clustered in this service include student population profiling, cumulative inventory analysis, assessment surveying, and conceptualization of research agenda.
                  </p>
                </div>

                {/* Blue Container 1.4: Counselors Professional Development */}
                <div className="rounded-lg p-4 mb-0" style={{ backgroundColor: "#C4D7F0" }}>
                  <div className="flex items-center mb-2">
                    <span className="font-bold mr-3" style={{ color: "white", backgroundColor: "#041A44", fontFamily: "Inter, sans-serif", fontSize: "10px", width: "28px", height: "28px", borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>1.4</span>
                    <p className="mb-0" style={{ color: "#041A44", fontFamily: "Inter, sans-serif", fontWeight: 700, fontSize: "14px" }}>Counselors Professional Development and Ethical Practice</p>
                  </div>
                  <p className="mb-0" style={{ paddingLeft: "36px", color: "#041A44", fontFamily: "Inter, sans-serif", fontWeight: 400, fontSize: "14px", lineHeight: 1.8, textAlign: "justify" }}>
                    This is considered an indirect service that affects students' well-being. As the School Counseling practice and Students' Program management constantly improve, the need to continuous professional development among Professional Counselor is necessary. Effective and efficient delivery of services and programs are ensured when providers are equipped  with professional credibility and possess enhanced self- core practice.
                  </p>
                </div>
              </div>

              {/* Separate White Container 2: Student Discipline and Formation Office */}
              <div className="rounded-lg shadow-sm p-6 mb-4" style={{ backgroundColor: "#FFFFFF" }}>
                {/* Section Title: Student Discipline and Formation Office */}
                <div className="flex items-start mb-4">
                  <span className="font-bold mr-3" style={{ color: "#041A44", fontFamily: "Inter, sans-serif", fontSize: "16px" }}>2</span>
                  <h3 className="font-bold" style={{ color: "#041A44", fontFamily: "Inter, sans-serif", fontWeight: 700, fontSize: "15px" }}>STUDENT DISCIPLINE AND FORMATION OFFICE</h3>
                </div>

                {/* Blue Container 2.1: Introduction */}
                <div className="rounded-lg p-4 mb-4" style={{ backgroundColor: "#C4D7F0" }}>
                  <div className="flex items-start mb-0">
                    <span className="font-bold mr-3" style={{ color: "white", backgroundColor: "#041A44", fontFamily: "Inter, sans-serif", fontSize: "10px", width: "28px", height: "28px", borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0, marginTop: "2px" }}>2.1</span>
                    <p className="mb-0" style={{ color: "#041A44", fontFamily: "Inter, sans-serif", fontWeight: 400, fontSize: "14px", lineHeight: 1.8 }}>
                      The Student Discipline and Formation Office (SDFO) is a unit in the Integrated School tasked to promote, supervise, and ensure the overall safety and discipline of the students while on campus, and in special cases, outside the campus. It is headed by the Student Formation Coordinator.
                    </p>
                  </div>
                </div>

                {/* Blue Container 2.2: Office Functions with Sub-items */}
                <div className="rounded-lg p-4 mb-0" style={{ backgroundColor: "#C4D7F0" }}>
                  <div className="flex items-start mb-4">
                    <span className="font-bold mr-3" style={{ color: "white", backgroundColor: "#041A44", fontFamily: "Inter, sans-serif", fontSize: "10px", width: "28px", height: "28px", borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0, marginTop: "2px" }}>2.2</span>
                    <p className="mb-0" style={{ color: "#041A44", fontFamily: "Inter, sans-serif", fontWeight: 400, fontSize: "14px", lineHeight: 1.8 }}>
                      The office envisions itself to be the leading unit assisting the student community in the exercise of self-control, discipline and good conduct while embodying the virtues of a true Consolatricien. It offers the following programs and services:
                    </p>
                  </div>

                  {/* Sub-item 2.2.1: Orientation */}
                  <div className="flex items-start mb-4" style={{ marginLeft: "40px" }}>
                    <span className="font-bold mr-3" style={{ color: "white", backgroundColor: "#041A44", fontFamily: "Inter, sans-serif", fontSize: "9px", width: "32px", height: "24px", borderRadius: "12px", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0, marginTop: "2px" }}>2.2.1</span>
                    <p className="mb-0" style={{ color: "#041A44", fontFamily: "Inter, sans-serif", fontWeight: 400, fontSize: "14px", lineHeight: 1.8 }}>
                      An orientation on School Rules and Regulation an orientation for teachers, parents and students are conducted at the start of the school year. A re-orientation is likewise done in the middle of the school year for reinforcement and reminders.
                    </p>
                  </div>

                  {/* Sub-item 2.2.2: Seminars/Webinars */}
                  <div className="flex items-start mb-0" style={{ marginLeft: "40px" }}>
                    <span className="font-bold mr-3" style={{ color: "white", backgroundColor: "#041A44", fontFamily: "Inter, sans-serif", fontSize: "9px", width: "32px", height: "24px", borderRadius: "12px", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0, marginTop: "2px" }}>2.2.2</span>
                    <p className="mb-0" style={{ color: "#041A44", fontFamily: "Inter, sans-serif", fontWeight: 400, fontSize: "14px", lineHeight: 1.8 }}>
                      Seminars/Webinars Students, parents and faculty are given seminars to assist all stakeholders in proper handling of common discipline issues and concerns.
                    </p>
                  </div>
                </div>
              </div>

              {/* Separate White Container 3: Health Services */}
              <div className="rounded-lg shadow-sm p-6 mb-4" style={{ backgroundColor: "#FFFFFF" }}>
                {/* Section Title: Health Services */}
                <div className="flex items-start mb-4">
                  <span className="font-bold mr-3" style={{ color: "#041A44", fontFamily: "Inter, sans-serif", fontSize: "16px" }}>3</span>
                  <h3 className="font-bold" style={{ color: "#041A44", fontFamily: "Inter, sans-serif", fontWeight: 700, fontSize: "15px" }}>HEALTH SERVICES</h3>
                </div>

                {/* Blue Container 3.1: Health Services Overview */}
                <div className="rounded-lg p-4 mb-4" style={{ backgroundColor: "#C4D7F0" }}>
                  <div className="flex items-start mb-0">
                    <span className="font-bold mr-3" style={{ color: "white", backgroundColor: "#041A44", fontFamily: "Inter, sans-serif", fontSize: "10px", width: "28px", height: "28px", borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0, marginTop: "2px" }}>3.1</span>
                    <p className="mb-0" style={{ color: "#041A44", fontFamily: "Inter, sans-serif", fontWeight: 400, fontSize: "14px", lineHeight: 1.8 }}>
                      Health Services primarily plan and implement all activities and procedure designed to improve the current health status of all students. They assure the implementation of the health standards in the campus. Health services also include health orientation and follow up of the students while they are at home.
                    </p>
                  </div>
                </div>

                {/* Blue Container 3.2: Additional Health Services */}
                <div className="rounded-lg p-4 mb-0" style={{ backgroundColor: "#C4D7F0" }}>
                  <div className="flex items-start mb-0">
                    <span className="font-bold mr-3" style={{ color: "white", backgroundColor: "#041A44", fontFamily: "Inter, sans-serif", fontSize: "10px", width: "28px", height: "28px", borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0, marginTop: "2px" }}>3.2</span>
                    <p className="mb-0" style={{ color: "#041A44", fontFamily: "Inter, sans-serif", fontWeight: 400, fontSize: "14px", lineHeight: 1.8 }}>
                      Health services also include keeping of the student health wellness record even if they are at home.
                    </p>
                  </div>
                </div>
              </div>

              {/* Separate White Container 4: ID Cards */}
              <div className="rounded-lg shadow-sm p-6 mb-4" style={{ backgroundColor: "#FFFFFF" }}>
                {/* Section Title: ID Cards */}
                <div className="flex items-start mb-4">
                  <span className="font-bold mr-3" style={{ color: "#041A44", fontFamily: "Inter, sans-serif", fontSize: "16px" }}>4</span>
                  <h3 className="font-bold" style={{ color: "#041A44", fontFamily: "Inter, sans-serif", fontWeight: 700, fontSize: "15px" }}>ID CARDS</h3>
                </div>

                {/* Blue Container 4.1: ID CARDS */}
                <div className="rounded-lg p-4 mb-4" style={{ backgroundColor: "#C4D7F0" }}>
                  <div className="flex items-center sm:items-start mb-4">
                    <span className="font-bold mr-3 flex-shrink-0" style={{ color: "white", backgroundColor: "#041A44", fontFamily: "Inter, sans-serif", fontSize: "10px", width: "28px", height: "28px", borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center" }}>4.1</span>
                    <h4 className="font-bold mb-0" style={{ color: "#041A44", fontFamily: "Inter, sans-serif", fontWeight: 700, fontSize: "14px" }}>ID CARDS</h4>
                  </div>
                  <p className="mb-2" style={{ color: "#041A44", fontFamily: "Inter, sans-serif", fontWeight: 400, fontSize: "14px", lineHeight: 1.8, textAlign: "justify" }}>
                    Each student is required to secure the official student ID card. This ID card is to be worn upon entering or while in the school premises during face to face classes when visiting the school for school transaction purposes.
                  </p>
                  <p className="mb-0" style={{ color: "#041A44", fontFamily: "Inter, sans-serif", fontWeight: 400, fontSize: "14px", lineHeight: 1.8, textAlign: "justify", textIndent: "2em" }}>
                    For security reasons, a parent, relative, guardian or any authorized representative or fetcher of a student should secure a validated ID from the Accounting Office.
                  </p>
                </div>

                {/* Blue Container 4.2: LOST IDs */}
                <div className="rounded-lg p-4 mb-0" style={{ backgroundColor: "#C4D7F0" }}>
                  <div className="flex items-center sm:items-start mb-4">
                    <span className="font-bold mr-3 flex-shrink-0" style={{ color: "white", backgroundColor: "#041A44", fontFamily: "Inter, sans-serif", fontSize: "10px", width: "28px", height: "28px", borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center" }}>4.2</span>
                    <h4 className="font-bold mb-0" style={{ color: "#041A44", fontFamily: "Inter, sans-serif", fontWeight: 700, fontSize: "14px" }}>LOST IDs</h4>
                  </div>
                  <p className="mb-0" style={{ color: "#041A44", fontFamily: "Inter, sans-serif", fontWeight: 400, fontSize: "14px", lineHeight: 1.8, textAlign: "justify" }}>
                    The loss of an ID should be promptly reported to the Office of the Dean of College. The report, whether written or verbal must be accompanied with an Affidavit of Loss. Pending the acquisition of a new ID, the student is issued a provisional ID duly signed by the Guidance facilitator.
                  </p>
                </div>
              </div>
                </>
              )}
            </div>
          )}

          {/* Section XVII: Data Privacy Notice and Consent Form */}
          {selectedSection === 17 && (
            <div className="w-full">
              {isBasicEducation ? (
                <>
                  {/* Section Header */}
                  <div className="bg-white rounded-lg shadow-sm p-4 sm:p-6 md:p-8 mb-4 sm:mb-6 mt-4 sm:mt-6 md:mt-8" style={{ backgroundColor: "#041A44" }}>
                    <div className="text-xs sm:text-sm mb-3 sm:mb-4 px-2 sm:px-3 py-1 bg-blue-100 text-blue-800 rounded-full inline-block" style={{ backgroundColor: "transparent", color: "white", border: "1px solid white" }}>
                      Section XVII
                    </div>
                    <h2 className="text-base sm:text-xl md:text-2xl font-bold mb-3 sm:mb-4" style={{ color: "white", fontFamily: "Inter, sans-serif", fontWeight: 700 }}>
                      DATA PRIVACY NOTICE AND CONSENT FORM
                    </h2>
                    <p className="text-gray-600 mb-0 text-[10px] sm:text-sm md:text-base" style={{ color: "white", fontFamily: "Inter, sans-serif", fontWeight: 400 }}>
                      Informs and seeks consent on data use
                    </p>
                  </div>

                  {/* Main White Container with all content */}
                  <div className="bg-white rounded-lg shadow-sm p-6 mb-6" style={{ backgroundColor: "#FFFFFF" }}>
                    {/* Privacy Notice Section */}
                    <div className="rounded-lg p-5 mb-6" style={{ backgroundColor: "#C4D7F0" }}>
                      <p className="font-normal leading-relaxed mb-4" style={{ color: "#041A44", fontFamily: "Inter, sans-serif", fontWeight: 400, fontSize: "13px" }}>
                        Consolatrix College of Toledo City, Inc. (CCTC) is compliant with the Data Privacy Act (DPA) of 2012, and its Implementing Rules and Regulations (IRR) effective since September 8, 2016 and ensures full cooperation with the National Privacy Commission (NPC). At usual respects the privacy of its data subjects with utmost importance and is committed to protecting it and ensuring the safety and security of personal data under its control and custody.
                      </p>
                      <p className="font-normal leading-relaxed mb-4" style={{ color: "#041A44", fontFamily: "Inter, sans-serif", fontWeight: 400, fontSize: "13px" }}>
                        This policy also aims to inform its Applicants, Students and Alumni of their rights under the Act.
                      </p>
                      <p className="font-normal leading-relaxed" style={{ color: "#041A44", fontFamily: "Inter, sans-serif", fontWeight: 400, fontSize: "13px" }}>
                        This Data Privacy Notice and Consent Form may be amended at any time without prior notice, and such amendments will be notified to you via CCTC's website or by email.
                      </p>
                    </div>

                    {/* A. Collection of Information */}
                    <div className="rounded-lg p-5 mb-6" style={{ backgroundColor: "#C4D7F0" }}>
                      <div className="flex items-center mb-4">
                        <div className="w-8 h-8 rounded-full flex items-center justify-center mr-3 flex-shrink-0" style={{ backgroundColor: "#041A44", fontFamily: "Inter, sans-serif", fontWeight: 700, color: "white", fontSize: "14px" }}>A</div>
                        <h3 className="font-bold" style={{ color: "#041A44", fontFamily: "Inter, sans-serif", fontWeight: 700, fontSize: "15px" }}>Collection of Information</h3>
                      </div>
                      <p className="font-normal leading-relaxed mb-4" style={{ color: "#041A44", fontFamily: "Inter, sans-serif", fontWeight: 400, fontSize: "13px" }}>
                        CCTC collects, stores, and processes personal data from its current, past, and prospective students that include application for admission, information acquired or generated upon enrollment and during the course of stay with CCTC. This will include, but not limited to:
                      </p>
                      <ol className="space-y-2 list-decimal list-inside" style={{ color: "#041A44", fontFamily: "Inter, sans-serif", fontWeight: 400, fontSize: "13px" }}>
                        <li>Personal information, such as name, address, telephone number, email address and other contact details, date and place of birth, nationality, immigration status, religion, civil status, student ID, government-issued IDs, web information, recommendations and assessment forms from previous schools attended, etc.</li>
                        <li>Family background, including information on parents, guardians, and siblings</li>
                        <li>Photographic and biometric data, such as, photos, CCTV videos, fingerprints, handwriting and signature specimens. Student's</li>
                        <li>Health records, psychological evaluation results, disciplinary records, and physical fitness information</li>
                        <li>Student Guidance Records, which includes interviews, entrance exam results, guidance assessments, special needs, exclusions/behavioral information, as well as information in connection with any disciplinary incident and its corresponding sanctions</li>
                        <li>Permanent Student Academic Records, including transcript of records and the academic history of the student</li>
                        <li>Student records for processing scholarship applications, grants, and other forms of assistance</li>
                        <li>Student programs résumés, job interview forms as well as records of membership in student organizations, leadership positions and participation, and attendance in seminars and competitions</li>
                        <li>Financial and billing information</li>
                      </ol>
                    </div>

                    {/* B. Use of Information */}
                    <div className="rounded-lg p-5 mb-6" style={{ backgroundColor: "#C4D7F0" }}>
                      <div className="flex items-center mb-4">
                        <div className="w-8 h-8 rounded-full flex items-center justify-center mr-3 flex-shrink-0" style={{ backgroundColor: "#041A44", fontFamily: "Inter, sans-serif", fontWeight: 700, color: "white", fontSize: "14px" }}>B</div>
                        <h3 className="font-bold" style={{ color: "#041A44", fontFamily: "Inter, sans-serif", fontWeight: 700, fontSize: "15px" }}>Use of Information</h3>
                      </div>
                      <p className="font-normal leading-relaxed mb-4" style={{ color: "#041A44", fontFamily: "Inter, sans-serif", fontWeight: 400, fontSize: "13px" }}>
                        The collected personal data is used solely for the following purposes:
                      </p>
                      <ol className="space-y-2 list-decimal list-inside" style={{ color: "#041A44", fontFamily: "Inter, sans-serif", fontWeight: 400, fontSize: "13px" }}>
                        <li>Evaluation and processing of admission application and student selection</li>
                        <li>Verification of the authenticity of student records and documents</li>
                        <li>Processing of scholarship applications</li>
                        <li>Recording, generating and maintaining student records of academic, co-curricular and extra-curricular progress</li>
                        <li>Establishing and maintaining student management systems as well as learning management system</li>
                        <li>Providing services such as health, counselling, information technology, library, sports/recreation, transportation, safety and security</li>
                        <li>Processing and generating statements of accounts</li>
                        <li>Investigating incidents that relate to student behavior and implementing disciplinary measures</li>
                        <li>Managing and controlling access to campus facilities and equipment</li>
                        <li>Official school announcements, marketing and promotional materials regarding school-related functions, events, projects and activities</li>
                        <li>Participation in research and non-commercial surveys</li>
                        <li>Compilation and generation of reports for statistical and research purposes</li>
                      </ol>
                    </div>

                    {/* C. Sharing of Information */}
                    <div className="rounded-lg p-5 mb-6" style={{ backgroundColor: "#C4D7F0" }}>
                      <div className="flex items-center mb-4">
                        <div className="w-8 h-8 rounded-full flex items-center justify-center mr-3 flex-shrink-0" style={{ backgroundColor: "#041A44", fontFamily: "Inter, sans-serif", fontWeight: 700, color: "white", fontSize: "14px" }}>C</div>
                        <h3 className="font-bold" style={{ color: "#041A44", fontFamily: "Inter, sans-serif", fontWeight: 700, fontSize: "15px" }}>Sharing of Information</h3>
                      </div>
                      <p className="font-normal leading-relaxed mb-4" style={{ color: "#041A44", fontFamily: "Inter, sans-serif", fontWeight: 400, fontSize: "13px" }}>
                        Personal data in the custody of CCTC shall be disclosed only to authorized recipients. Sharing of personal data with third parties, other than parents and/or guardians on record for minors, shall necessitate the individual or parents' consent, or when required or permitted by our policies and applicable law.
                      </p>
                      <p className="font-normal leading-relaxed mb-4" style={{ color: "#041A44", fontFamily: "Inter, sans-serif", fontWeight: 400, fontSize: "13px" }}>
                        Your personal information may be disclosed / shared in the following manner:
                      </p>
                      <ol className="space-y-2 list-decimal list-inside" style={{ color: "#041A44", fontFamily: "Inter, sans-serif", fontWeight: 400, fontSize: "13px" }}>
                        <li>Posting or displaying of academic and non-academic achievements within the CCTC's premises and/or its official website and social media accounts</li>
                        <li>Sharing information to potential donors, funders or benefactors for purposes of scholarship, grants and other forms of assistance</li>
                        <li>Processing of application for graduation and distribution of the list of graduates and awardees during commencement exercises</li>
                        <li>Disclosure of information to the NPC and other government bodies or agencies (e.g. Commission on Higher Education, Department of Education)</li>
                        <li>Sharing information for accreditation and university ranking purposes, professional development of teachers and staff, and research (e.g. Philippine Accrediting Association of Schools, Colleges and Universities)</li>
                        <li>Disclosure with academic institutions, companies, government agencies, private or public corporations, upon their request, scholastic ranking information or certification of good moral character for purposes of admission</li>
                        <li>Marketing or advertising to promote the school, including its activities and events, through photos, videos, brochures, website posting, newspaper advertisements, physical and electronic bulletin boards, and other media</li>
                        <li>Conducting research or surveys for purposes of institutional development and marketing or advertising to promote the school, including its activities and events, through photos, videos, brochures, website posting, newspaper advertisements, physical and electronic bulletin boards, and other media</li>
                        <li>Sharing your information to the school's Learning Management System Provider</li>
                        <li>Sharing your directory information to the school's alumni association</li>
                      </ol>
                    </div>

                    {/* D. Data Retention */}
                    <div className="rounded-lg p-5 mb-6" style={{ backgroundColor: "#C4D7F0" }}>
                      <div className="flex items-center mb-4">
                        <div className="w-8 h-8 rounded-full flex items-center justify-center mr-3 flex-shrink-0" style={{ backgroundColor: "#041A44", fontFamily: "Inter, sans-serif", fontWeight: 700, color: "white", fontSize: "14px" }}>D</div>
                        <h3 className="font-bold" style={{ color: "#041A44", fontFamily: "Inter, sans-serif", fontWeight: 700, fontSize: "15px" }}>Data Retention</h3>
                      </div>
                      <p className="font-normal leading-relaxed mb-4" style={{ color: "#041A44", fontFamily: "Inter, sans-serif", fontWeight: 400, fontSize: "13px" }}>
                        CCTC shall keep your records only for as long as necessary.
                      </p>
                      <ol className="space-y-2 list-decimal list-inside" style={{ color: "#041A44", fontFamily: "Inter, sans-serif", fontWeight: 400, fontSize: "13px" }}>
                        <li>The Permanent Student Academic Records are kept by the Registrar's Office.</li>
                        <li>Admission files are kept for five years.</li>
                        <li>Application forms and documents of unsuccessful applicants are kept in the Directress' Office for one year.</li>
                        <li>Scholarship application forms and supporting documentation are kept by the Office of Student Services until the scholar graduates.</li>
                        <li>The Student Cumulative Guidance Folders are kept in the Student Placement Center Office for five years after graduation.</li>
                        <li>Student school works are kept for one school year.</li>
                        <li>Student disciplinary records are kept in the Student Placement Center Office for five years after graduation.</li>
                        <li>Class records are kept for three years.</li>
                        <li>Non-academic records are kept for five years.</li>
                        <li>Financial and billing information are kept by the Accounting Office for five years if the student has paid in full. Otherwise, these will be kept until settled.</li>
                        <li>Health records are kept by the Clinic for three years after graduation.</li>
                        <li>CCTV camera recording are kept for one month from date of recording unless there is a need for it to be kept for a longer period.</li>
                      </ol>
                    </div>

                    {/* E. Data Protection */}
                    <div className="rounded-lg p-5 mb-6" style={{ backgroundColor: "#C4D7F0" }}>
                      <h3 className="font-bold mb-4" style={{ color: "#041A44", fontFamily: "Inter, sans-serif", fontWeight: 700, fontSize: "15px" }}>Data Protection</h3>
                      <p className="font-normal leading-relaxed" style={{ color: "#041A44", fontFamily: "Inter, sans-serif", fontWeight: 400, fontSize: "13px" }}>
                        We continue to implement organizational, administrative, technical, and physical security measures to safeguard your personal data. Only authorized personnel have access to your personal data. CCTC's security measures are aimed to maintain the availability, integrity, and confidentiality of personal data and are intended for the protection of personal data against any accidental or unlawful destruction, alteration, disclosure, and unlawful processing.
                      </p>
                    </div>
                  </div>
                </>
              ) : (
                <>
                  {/* Section Header */}
                  <div className="bg-white rounded-lg shadow-sm p-4 sm:p-6 md:p-8 mb-4 sm:mb-6 mt-4 sm:mt-6 md:mt-8" style={{ backgroundColor: "#041A44" }}>
                    <div className="text-xs sm:text-sm mb-3 sm:mb-4 px-2 sm:px-3 py-1 bg-blue-100 text-blue-800 rounded-full inline-block" style={{ backgroundColor: "transparent", color: "white", border: "1px solid white" }}>
                      Section XVII
                    </div>
                    <h2 className="text-base sm:text-xl md:text-2xl font-bold mb-3 sm:mb-4" style={{ color: "white", fontFamily: "Inter, sans-serif", fontWeight: 700 }}>
                      STUDENTS RIGHTS, DUTIES AND RESPONSIBILITIES
                    </h2>
                    <p className="text-gray-600 mb-2" style={{ color: "white", fontSize: "15px", fontFamily: "Inter, sans-serif", fontWeight: 600 }}>
                      (Education Act of 1982, Section 15)
                    </p>
                    <p className="text-gray-600 mb-0 text-[10px] sm:text-sm md:text-base" style={{ color: "white", fontFamily: "Inter, sans-serif", fontWeight: 400 }}>
                      Based on the Education Act of 1982, outlining student entitlements, obligations, and conduct expectations
                    </p>
                  </div>

                  <div className="rounded-lg shadow-sm p-6 mb-4" style={{ backgroundColor: "#FFFFFF" }}>
                    {/* Blue Container */}
                    <div className="rounded-lg p-4 mb-0" style={{ backgroundColor: "#C4D7F0" }}>
                      <p className="mb-3" style={{ color: "#041A44", fontFamily: "Inter, sans-serif", fontWeight: 700, fontSize: "15px" }}>
                        Duties and Responsibilities of students in addition to those provided by the existing laws that every student shall:
                      </p>
                      
                      <ul className="mb-0" style={{ listStyleType: "disc", paddingLeft: "20px", color: "#041A44", fontFamily: "Inter, sans-serif", fontWeight: 400, fontSize: "14px", lineHeight: 1.8 }}>
                        <li className="mb-1">Exert his utmost to develop his potentialities for service, particularly by undergoing an education suited to his abilities, in order that he may become an asset to his family and to society.</li>
                        <li className="mb-1">Uphold the academic integrity of the school, endeavour to achieve academic excellence and able to follow the rules and regulations governing his academic responsibilities and moral integrity.</li>
                        <li className="mb-1">Promote and maintain the peace and tranquility of the school by observing the rules and discipline, and exerting efforts to attain harmonious relationships with fellow students, the teaching and other school personnel.</li>
                        <li className="mb-1">Participate actively in the academic affairs and in the promotion of the general welfare, particularly in the socio- economic, and cultural development of his community and in the attainment of a just, compassionate and orderly society.</li>
                        <li className="mb-0">Exercise his right responsibly in the knowledge that he is answerable for any infringement or violation of the public welfare and of the rights of others.</li>
                      </ul>
                    </div>
                  </div>
                </>
              )}
            </div>
          )}

          {/* Section XVIII: Student Organizations */}
          {selectedSection === 18 && (
            <div className="w-full">
              <div className="bg-white rounded-lg shadow-sm p-4 sm:p-6 md:p-8 mb-4 sm:mb-6 mt-4 sm:mt-6 md:mt-8" style={{ backgroundColor: "#041A44" }}>
                <div className="text-xs sm:text-sm mb-3 sm:mb-4 px-2 sm:px-3 py-1 bg-blue-100 text-blue-800 rounded-full inline-block" style={{ backgroundColor: "transparent", color: "white", border: "1px solid white" }}>
                  Section XVIII
                </div>
                <h2 className="text-base sm:text-xl md:text-2xl font-bold mb-3 sm:mb-4" style={{ color: "white", fontFamily: "Inter, sans-serif", fontWeight: 700 }}>
                  STUDENT ORGANIZATIONS
                </h2>
                <p className="text-gray-600 mb-0 text-[10px] sm:text-sm md:text-base" style={{ color: "white", fontFamily: "Inter, sans-serif", fontWeight: 400 }}>
                  Policies on formation, recognition, and regulation of student-led groups and activities
                </p>
              </div>

              <div className="rounded-lg shadow-sm p-6 mb-4" style={{ backgroundColor: "#FFFFFF" }}>
                {/* Blue Container */}
                <div className="rounded-lg p-4 mb-0" style={{ backgroundColor: "#C4D7F0" }}>
                  <p className="mb-0" style={{ color: "#041A44", fontFamily: "Inter, sans-serif", fontWeight: 400, fontSize: "14px", lineHeight: 1.8, textAlign: "justify" }}>
                    The <strong>Augustinian Recollect Student Crusaders (ARSC)</strong> is the Supreme Student Council of all Augustinian Recollect Sisters Schools in the Philippines. It is an official organization of which, all clubs and other organizations are under its supervision and coordination in the students'+ level only. It is governed by its Constitution and By-Laws duly recognized by the Securities and Exchange Commission (SEC). The purpose of which, is to continue the work of Evangelization in all A.R. schools. It is carried out through Ministries on Liturgy, Academies, Arts, Sports, Discipline and Community Involvement through the various elubs under each ministries where students are free to join.
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* Section XIX: Co-Curricular and Extra Curricular Activities */}
          {selectedSection === 19 && (
            <div className="w-full">
              <div className="bg-white rounded-lg shadow-sm p-4 sm:p-6 md:p-8 mb-4 sm:mb-6 mt-4 sm:mt-6 md:mt-8" style={{ backgroundColor: "#041A44" }}>
                <div className="text-xs sm:text-sm mb-3 sm:mb-4 px-2 sm:px-3 py-1 bg-blue-100 text-blue-800 rounded-full inline-block" style={{ backgroundColor: "transparent", color: "white", border: "1px solid white" }}>
                  Section XIX
                </div>
                <h2 className="text-base sm:text-xl md:text-2xl font-bold mb-3 sm:mb-4" style={{ color: "white", fontFamily: "Inter, sans-serif", fontWeight: 700 }}>
                  CO-CURRICULAR AND EXTRA CURRICULAR ACTIVITIES
                </h2>
                <ul className="mb-0 text-xs sm:text-base" style={{ color: "white", fontFamily: "Inter, sans-serif", fontWeight: 400, listStyleType: "disc", paddingLeft: "20px" }}>
                  <li className="whitespace-nowrap">Co-Curricular Activities (Academic related Activities)</li>
                  <li className="whitespace-nowrap">Extra-Curricular Activities (Non-Academic Activities)</li>
                </ul>
              </div>

              <div className="rounded-lg shadow-sm p-6 mb-4" style={{ backgroundColor: "#FFFFFF" }}>
                {/* Blue Container */}
                <div className="rounded-lg p-4 mb-0" style={{ backgroundColor: "#C4D7F0" }}>
                  <p className="mb-4" style={{ color: "#041A44", fontFamily: "Inter, sans-serif", fontWeight: 700, fontSize: "14px", lineHeight: 1.8, textAlign: "justify" }}>
                    The College provides students with the opportunity to participate in properly coordinated and well-balanced co-curricular program with the following guidelines:
                  </p>
                  
                  <ul style={{ listStyleType: "disc", paddingLeft: "20px", color: "#041A44", fontFamily: "Inter, sans-serif", fontWeight: 400, fontSize: "14px", lineHeight: 1.8 }}>
                    <li className="mb-2">Action plan for one year or semester shall be submitted to the Office of the Student Affairs by all Student organizations.</li>
                    <li className="mb-2">No student activity shall be held two (2) weeks before the final examination to enable students enough time to review for their final exam. <strong>As much as possible there shall be no disruption of classes.</strong></li>
                    <li className="mb-2">All intra and co-curricular activities then wil be held inside the College must be registered in the Office of the Student Affairs as follows:
                      <ul style={{ listStyleType: "disc", paddingLeft: "20px", marginTop: "8px" }}>
                        <li className="mb-1">Submit a letter and secure permit form the Office of Student Affairs to host an activity.</li>
                        <li className="mb-1">Indicate the nature of the activity and ways to implement the same, in consultation with the faculty adviser</li>
                        <li className="mb-1">Have the application letter signed by the Student Activity Coordinator and endorsed by the faculty Adviser</li>
                        <li className="mb-0">Submit the letter in duplicate at least five (5) working days prior to the said activity to the Dean and Student Activity Coordinator for approval.</li>
                      </ul>
                    </li>
                    <li className="mb-2">For the co curricular activities to be held outside the College, the following procedures shall apply:
                      <ul style={{ listStyleType: "disc", paddingLeft: "20px", marginTop: "8px" }}>
                        <li className="mb-1">The written consent or organization secures permit from the Office of the Student Affairs.</li>
                        <li className="mb-1">Submit letter in duplicate copies.</li>
                        <li className="mb-0">Written/ Parent's consent is also required of students who wish to join the activities</li>
                      </ul>
                    </li>
                    <li className="mb-0">College recognized activities or gatherings sponsored /conducted by students and held within the College premises must be attended by the faculty adviser.</li>
                  </ul>

                  <p className="mt-3 mb-0" style={{ color: "#041A44", fontFamily: "Inter, sans-serif", fontWeight: 400, fontSize: "14px", lineHeight: 1.8, textAlign: "justify" }}>• No activities allowed during Sunday and Holidays</p>

                  <p className="mt-4 mb-0" style={{ color: "#041A44", fontFamily: "Inter, sans-serif", fontWeight: 400, fontSize: "14px", lineHeight: 1.8, textAlign: "justify" }}>
                    Materials or written announcements on bulletin boards shall be approved by the Office of Student Affairs. Remove posters when the activity is over. Avoid posting materials on walls. Evaluation shall always be a part of an activity.
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* Section XX: Policy and Guidelines on Social Media Use */}
          {selectedSection === 20 && (
            <div className="w-full">
              <div className="bg-white rounded-lg shadow-sm p-4 sm:p-6 md:p-8 mb-4 sm:mb-6 mt-4 sm:mt-6 md:mt-8" style={{ backgroundColor: "#041A44" }}>
                <div className="text-xs sm:text-sm mb-3 sm:mb-4 px-2 sm:px-3 py-1 bg-blue-100 text-blue-800 rounded-full inline-block" style={{ backgroundColor: "transparent", color: "white", border: "1px solid white" }}>
                  Section XX
                </div>
                <h2 className="text-base sm:text-xl md:text-2xl font-bold mb-3 sm:mb-4" style={{ color: "white", fontFamily: "Inter, sans-serif", fontWeight: 700 }}>
                  POLICY AND GUIDELINES ON SOCIAL MEDIA USE
                </h2>
                <p className="text-gray-600 mb-0 text-[10px] sm:text-sm md:text-base" style={{ color: "white", fontFamily: "Inter, sans-serif", fontWeight: 400 }}>
                  Standards for responsible online behavior and official use of social media platforms
                </p>
              </div>

              {/* Main White Container */}
              <div className="rounded-lg shadow-sm p-6 mb-4" style={{ backgroundColor: "#FFFFFF" }}>
                {/* Blue Container 1: PURPOSE */}
                <div className="rounded-lg p-4 mb-4" style={{ backgroundColor: "#C4D7F0" }}>
                  <div className="flex items-center mb-3">
                    <div className="rounded-full flex items-center justify-center mr-3" style={{ width: "32px", height: "32px", minWidth: "32px", backgroundColor: "#041A44", color: "white", fontFamily: "Inter, sans-serif", fontWeight: 700, fontSize: "14px" }}>1</div>
                    <h4 className="font-bold" style={{ color: "#041A44", fontFamily: "Inter, sans-serif", fontWeight: 700, fontSize: "15px" }}>PURPOSE</h4>
                  </div>
                  
                  <p className="mb-3" style={{ color: "#041A44", fontFamily: "Inter, sans-serif", fontWeight: 400, fontSize: "14px", lineHeight: 1.8, textAlign: "justify" }}>
                    These policy and guidelines have been formulated to ensure that data and information released or shared by Consolatrix College of Toledo City, Inc. are timely, accurate, comprehensive, authoritative, and relevant to all aspects of the school's system. In accordance with CCTC's conviction that there are important personal and organizational benefits on the use of social media sites, these policy and guidelines will provide the framework to facilitate the timely dissemination of data and information.
                  </p>
                  
                  <p className="mb-0" style={{ color: "#041A44", fontFamily: "Inter, sans-serif", fontWeight: 400, fontSize: "14px", lineHeight: 1.8, textAlign: "justify" }}>
                    Adherence to these policy and guidelines will reinforce its current nondiscriminatory practices on sex, race, color, national origin, religion, weight, marital status, disability, age, political affiliation, sexual orientation or any other status deemed by law.
                  </p>
                </div>

                {/* Blue Container 2: SCOPE */}
                <div className="rounded-lg p-4 mb-4" style={{ backgroundColor: "#C4D7F0" }}>
                  <div className="flex items-center mb-3">
                    <div className="rounded-full flex items-center justify-center mr-3" style={{ width: "32px", height: "32px", minWidth: "32px", backgroundColor: "#041A44", color: "white", fontFamily: "Inter, sans-serif", fontWeight: 700, fontSize: "14px" }}>2</div>
                    <h4 className="font-bold" style={{ color: "#041A44", fontFamily: "Inter, sans-serif", fontWeight: 700, fontSize: "15px" }}>SCOPE</h4>
                  </div>
                  
                  <p className="mb-0" style={{ color: "#041A44", fontFamily: "Inter, sans-serif", fontWeight: 400, fontSize: "14px", lineHeight: 1.8, textAlign: "justify" }}>
                    These policy and guidelines on social media use apply to all CCTC employees, teachers, students, and auxiliary personnel. These cover all media networks. Its acceptance with CCTC extends beyond working rules, establishes and uses sharing.
                  </p>
                </div>

                {/* Blue Container 3: DEFINITIONS */}
                <div className="rounded-lg p-4 mb-0" style={{ backgroundColor: "#C4D7F0" }}>
                  <div className="flex items-center mb-3">
                    <div className="rounded-full flex items-center justify-center mr-3" style={{ width: "32px", height: "32px", minWidth: "32px", backgroundColor: "#041A44", color: "white", fontFamily: "Inter, sans-serif", fontWeight: 700, fontSize: "14px" }}>3</div>
                    <h4 className="font-bold" style={{ color: "#041A44", fontFamily: "Inter, sans-serif", fontWeight: 700, fontSize: "15px" }}>DEFINITIONS</h4>
                  </div>
                  
                  {/* Definition 3.1: Social Media Account */}
                  <div className="mb-4">
                    <div className="flex items-center sm:items-start mb-2">
                      <div className="rounded-full flex items-center justify-center mr-2 flex-shrink-0" style={{ width: "32px", height: "32px", minWidth: "32px", backgroundColor: "#041A44", color: "white", fontFamily: "Inter, sans-serif", fontWeight: 700, fontSize: "10px" }}>3.1</div>
                      <h5 className="font-bold" style={{ color: "#041A44", fontFamily: "Inter, sans-serif", fontWeight: 700, fontSize: "14px" }}>Social Media Account</h5>
                    </div>
                    <p className="mb-0" style={{ color: "#041A44", fontFamily: "Inter, sans-serif", fontWeight: 400, fontSize: "14px", lineHeight: 1.8, textAlign: "justify", paddingLeft: "40px" }}>
                      Any and all accounts, profiles, pages, feeds, registrations, and other connection with any social networking website or social media such as YouTube, Twitter, Facebook, Instagram, SnapChat, and other social networking platforms enable users to sign up with their personal social media account, which can be used to connect, communicate, and exchange content and status update. When a user communicated through a social media account, their disclosures are attributed to their User Profile.
                    </p>
                  </div>
                  
                  {/* Definition 3.2: Social Media Channels */}
                  <div className="mb-4">
                    <div className="flex items-center sm:items-start mb-2">
                      <div className="rounded-full flex items-center justify-center mr-2 flex-shrink-0" style={{ width: "32px", height: "32px", minWidth: "32px", backgroundColor: "#041A44", color: "white", fontFamily: "Inter, sans-serif", fontWeight: 700, fontSize: "10px" }}>3.2</div>
                      <h5 className="font-bold" style={{ color: "#041A44", fontFamily: "Inter, sans-serif", fontWeight: 700, fontSize: "14px" }}>Social Media Channels</h5>
                    </div>
                    <p className="mb-0" style={{ color: "#041A44", fontFamily: "Inter, sans-serif", fontWeight: 400, fontSize: "14px", lineHeight: 1.8, textAlign: "justify", paddingLeft: "40px" }}>
                      These can be any forms of electronic communication through which users create online communities to share information, ideas, personal messages, and other contents such as Blogs, micro-blogs, wikis, social networks, social bookmarking services, user rating services, whether accessed through the web, a cellular device, text messaging, e-mail, or other existing or emerging communications platforms.
                    </p>
                  </div>
                  
                  {/* Definition 3.3: Professional Social Media */}
                  <div className="mb-4">
                    <div className="flex items-center sm:items-start mb-2">
                      <div className="rounded-full flex items-center justify-center mr-2 flex-shrink-0" style={{ width: "32px", height: "32px", minWidth: "32px", backgroundColor: "#041A44", color: "white", fontFamily: "Inter, sans-serif", fontWeight: 700, fontSize: "10px" }}>3.3</div>
                      <h5 className="font-bold" style={{ color: "#041A44", fontFamily: "Inter, sans-serif", fontWeight: 700, fontSize: "14px" }}>Professional Social Media</h5>
                    </div>
                    <p className="mb-0" style={{ color: "#041A44", fontFamily: "Inter, sans-serif", fontWeight: 400, fontSize: "14px", lineHeight: 1.8, textAlign: "justify", paddingLeft: "40px" }}>
                      Professional social media is a work-related social media activity that is either school-based(e.g., CCTC Dean of College establishing a Facebook page for his/her school, or school departments or Divisions member establishing a blog for his/her class). Professional social media can be in a form of blog posts, blog comments, status update, text messages, posts via email, images, audio recordings, video recordings, or any other information made available through a social media channel. Social media disclosures are the actual communication a user distributes through a social media channel, usually by means of their social media account.
                    </p>
                  </div>
                  
                  {/* Definition 3.4: Controversial Issues */}
                  <div className="mb-4">
                    <div className="flex items-center sm:items-start mb-2">
                      <div className="rounded-full flex items-center justify-center mr-2 flex-shrink-0" style={{ width: "32px", height: "32px", minWidth: "32px", backgroundColor: "#041A44", color: "white", fontFamily: "Inter, sans-serif", fontWeight: 700, fontSize: "10px" }}>3.4</div>
                      <h5 className="font-bold" style={{ color: "#041A44", fontFamily: "Inter, sans-serif", fontWeight: 700, fontSize: "14px" }}>Controversial Issues</h5>
                    </div>
                    <p className="mb-0" style={{ color: "#041A44", fontFamily: "Inter, sans-serif", fontWeight: 400, fontSize: "14px", lineHeight: 1.8, textAlign: "justify", paddingLeft: "40px" }}>
                      These are topics or issue that result in a dispute and a disagreement on the basis of a difference of opinion which are frequently described in political campaigns as controversial or divisive in nature that provoke a strong emotional response. Topics may include political views, health care reform, education reform, and gun control.
                    </p>
                  </div>
                  
                  {/* Definition 3.5: Inbound Links */}
                  <div className="mb-4">
                    <div className="flex items-center sm:items-start mb-2">
                      <div className="rounded-full flex items-center justify-center mr-2 flex-shrink-0" style={{ width: "32px", height: "32px", minWidth: "32px", backgroundColor: "#041A44", color: "white", fontFamily: "Inter, sans-serif", fontWeight: 700, fontSize: "10px" }}>3.5</div>
                      <h5 className="font-bold" style={{ color: "#041A44", fontFamily: "Inter, sans-serif", fontWeight: 700, fontSize: "14px" }}>Inbound Links</h5>
                    </div>
                    <p className="mb-3" style={{ color: "#041A44", fontFamily: "Inter, sans-serif", fontWeight: 400, fontSize: "14px", lineHeight: 1.8, textAlign: "justify", paddingLeft: "40px" }}>
                      To define an Inbound Link, a clear definition of what a hyperlink is necessary. A hyperlink is defined as a hypertext file or document to another location or file, typically activated by clicking on a highlighted word or image on the screen. Unlike Hotlinks and Outbound Links shown on our website addresses, examples of which are "Google.com", "Yahoo.com", "Youtube.com" etc.
                    </p>
                    <p className="mb-0" style={{ color: "#041A44", fontFamily: "Inter, sans-serif", fontWeight: 400, fontSize: "14px", lineHeight: 1.8, textAlign: "justify", paddingLeft: "40px" }}>
                      Inbound links are terms, or words use in searching the net as well as searching for specific websites or Domain Names, an example of which is using common search engines and the address bar of our browsers. These words, terminologies, or URLs are then sent forth from your PCs, laptops, or any handheld devices that has Internet access. So, when we type in a corresponding website containing those pieces of information you are "looking/searching for" these become the "Inbound Links" In a sense, it is the process of sending out one's search queries on the Internet and receiving again (search engines-various domain sources) and back to user's devices.
                    </p>
                  </div>
                  
                  {/* Definition 3.6: Hosted Content */}
                  <div className="mb-4">
                    <div className="flex items-center sm:items-start mb-2">
                      <div className="rounded-full flex items-center justify-center mr-2 flex-shrink-0" style={{ width: "32px", height: "32px", minWidth: "32px", backgroundColor: "#041A44", color: "white", fontFamily: "Inter, sans-serif", fontWeight: 700, fontSize: "10px" }}>3.6</div>
                      <h5 className="font-bold" style={{ color: "#041A44", fontFamily: "Inter, sans-serif", fontWeight: 700, fontSize: "14px" }}>Hosted Content</h5>
                    </div>
                    <p className="mb-3" style={{ color: "#041A44", fontFamily: "Inter, sans-serif", fontWeight: 400, fontSize: "14px", lineHeight: 1.8, textAlign: "justify", paddingLeft: "40px" }}>
                      Hosted contents refer to the contents of various websites in the Internet, which can be text, images, audio, video, or documents of various formats that were uploaded and are stored in various websites as well as social media sites. The term "hosted" refers to the owner of the contents (also sometimes called as providers) from their own website contents, such will require hosting their own servers (such as own web hosting sites like Hostgator.com, Hostinger.com, godaddy.com, wix.com, etc.). Through some prefer to rent their own website contents, such will require hosting their own servers in their respective companies and instances. These servers have their own specific functions from well-dedicated servers and data server.
                    </p>
                    <p className="mb-0" style={{ color: "#041A44", fontFamily: "Inter, sans-serif", fontWeight: 400, fontSize: "14px", lineHeight: 1.8, textAlign: "justify", paddingLeft: "40px" }}>
                      Hosted contents as prior mentioned is subject to copyright protection in order to prevent plagiarism and ensure the maker or creator of videos, images, documents, and audio recordings are not abused online.
                    </p>
                  </div>
                  
                  {/* Definition 3.7: Copyrights */}
                  <div className="mb-4">
                    <div className="flex items-center sm:items-start mb-2">
                      <div className="rounded-full flex items-center justify-center mr-2 flex-shrink-0" style={{ width: "32px", height: "32px", minWidth: "32px", backgroundColor: "#041A44", color: "white", fontFamily: "Inter, sans-serif", fontWeight: 700, fontSize: "10px" }}>3.7</div>
                      <h5 className="font-bold" style={{ color: "#041A44", fontFamily: "Inter, sans-serif", fontWeight: 700, fontSize: "14px" }}>Copyrights</h5>
                    </div>
                    <p className="mb-0" style={{ color: "#041A44", fontFamily: "Inter, sans-serif", fontWeight: 400, fontSize: "14px", lineHeight: 1.8, textAlign: "justify", paddingLeft: "40px" }}>
                      Copyright refers to the right of the owner of intellectual property which protects him/her to control the reproduction and use of any creative expression which has been fixed in tangible form and conveys the owner's work of authorship. This ownership applies only in literature (books, journals), and musical works. Copyright is the right to copy in simpler terms. This ensures that the original creator or author of a work are the only person who has the right to choose any special products and anyone allowed to do so are the only ones with the exclusive right to replicate/reproduce the work.
                    </p>
                  </div>
                  
                  {/* Definition 3.8: Official Content */}
                  <div className="mb-4">
                    <div className="flex items-center sm:items-start mb-2">
                      <div className="rounded-full flex items-center justify-center mr-2 flex-shrink-0" style={{ width: "32px", height: "32px", minWidth: "32px", backgroundColor: "#041A44", color: "white", fontFamily: "Inter, sans-serif", fontWeight: 700, fontSize: "10px" }}>3.8</div>
                      <h5 className="font-bold" style={{ color: "#041A44", fontFamily: "Inter, sans-serif", fontWeight: 700, fontSize: "14px" }}>Official Content</h5>
                    </div>
                    <p className="mb-0" style={{ color: "#041A44", fontFamily: "Inter, sans-serif", fontWeight: 400, fontSize: "14px", lineHeight: 1.8, textAlign: "justify", paddingLeft: "40px" }}>
                      Official content is a publicly available online content created and made public by Consolatrix College of Toledo City, Inc. verified by virtue of the fact that it is accessible through its Facebook pages.
                    </p>
                  </div>
                  
                  {/* Definition 3.9: Blog */}
                  <div className="mb-4">
                    <div className="flex items-center sm:items-start mb-2">
                      <div className="rounded-full flex items-center justify-center mr-2 flex-shrink-0" style={{ width: "36px", height: "36px", minWidth: "36px", backgroundColor: "#041A44", color: "white", fontFamily: "Inter, sans-serif", fontWeight: 700, fontSize: "9px" }}>3.9</div>
                      <h5 className="font-bold" style={{ color: "#041A44", fontFamily: "Inter, sans-serif", fontWeight: 700, fontSize: "14px" }}>Blog</h5>
                    </div>
                    <p className="mb-0" style={{ color: "#041A44", fontFamily: "Inter, sans-serif", fontWeight: 400, fontSize: "14px", lineHeight: 1.8, textAlign: "justify", paddingLeft: "44px" }}>
                      A blog is a regularly updated website where new content is often released, usually written in an informal or conversational style often with the intention of attracting readers and achieving some kind of purpose, whether education, building or brand promotion.
                    </p>
                  </div>
                  
                  {/* Definition 3.10: Microblogging */}
                  <div className="mb-4">
                    <div className="flex items-center sm:items-start mb-2">
                      <div className="rounded-full flex items-center justify-center mr-2 flex-shrink-0" style={{ width: "36px", height: "36px", minWidth: "36px", backgroundColor: "#041A44", color: "white", fontFamily: "Inter, sans-serif", fontWeight: 700, fontSize: "9px" }}>3.10</div>
                      <h5 className="font-bold" style={{ color: "#041A44", fontFamily: "Inter, sans-serif", fontWeight: 700, fontSize: "14px" }}>Microblogging</h5>
                    </div>
                    <p className="mb-0" style={{ color: "#041A44", fontFamily: "Inter, sans-serif", fontWeight: 400, fontSize: "14px", lineHeight: 1.8, textAlign: "justify", paddingLeft: "44px" }}>
                      Microblogging is a hybrid of blogging and instant messaging that allows users to create short messages that can be posted and exchanged with online audiences. Social networks like Twitter and Facebook are the most common microblogging platforms, particularly on the social media, making it much easier to connect with people compared to the days of web surfing.
                    </p>
                  </div>
                  
                  {/* Definition 3.11: Cyberbullying */}
                  <div className="mb-0">
                    <div className="flex items-center sm:items-start mb-2">
                      <div className="rounded-full flex items-center justify-center mr-2 flex-shrink-0" style={{ width: "36px", height: "36px", minWidth: "36px", backgroundColor: "#041A44", color: "white", fontFamily: "Inter, sans-serif", fontWeight: 700, fontSize: "9px" }}>3.11</div>
                      <h5 className="font-bold" style={{ color: "#041A44", fontFamily: "Inter, sans-serif", fontWeight: 700, fontSize: "14px" }}>Cyberbullying</h5>
                    </div>
                    <p className="mb-0" style={{ color: "#041A44", fontFamily: "Inter, sans-serif", fontWeight: 400, fontSize: "14px", lineHeight: 1.8, textAlign: "justify", paddingLeft: "44px" }}>
                      Cyberbullying is the use of digital media (such as social media, text messages, instant) to make someone else repeatedly feel mad, sad or afraid. Examples of cyberbullying involve sending hurtful text or instant messages, posting compromising images or videos on social media, and spreading or circulating negative rumors via SMS or email.
                    </p>
                  </div>
                </div>

                {/* Blue Container 4: POLICY ON SOCIAL MEDIA USE */}
                <div className="rounded-lg p-4 mb-0 mt-4" style={{ backgroundColor: "#C4D7F0" }}>
                  <div className="flex items-center mb-3">
                    <div className="rounded-full flex items-center justify-center mr-3" style={{ width: "32px", height: "32px", minWidth: "32px", backgroundColor: "#041A44", color: "white", fontFamily: "Inter, sans-serif", fontWeight: 700, fontSize: "14px" }}>4</div>
                    <h4 className="font-bold" style={{ color: "#041A44", fontFamily: "Inter, sans-serif", fontWeight: 700, fontSize: "15px" }}>POLICY ON SOCIAL MEDIA USE</h4>
                  </div>
                  <p className="mb-3" style={{ color: "#041A44", fontFamily: "Inter, sans-serif", fontWeight: 400, fontSize: "14px", lineHeight: 1.8, textAlign: "justify" }}>
                    Following the dissemination of information on RA 10173 otherwise known as Data privacy Act of 1992, Consolatrix College of Toledo City, Inc. formulates policies that shall promote responsible use of social media, thus:
                  </p>
                  {/* White Container Inside */}
                  <div className="rounded-lg p-4" style={{ backgroundColor: "#FFFFFF" }}>
                    <p className="mb-3" style={{ color: "#041A44", fontFamily: "Inter, sans-serif", fontWeight: 400, fontSize: "14px", lineHeight: 1.8, textAlign: "justify" }}>
                      Greater responsibility and tact should be observed in the sharing of all forms of social media Online learners must be responsible in sharing socialmedia contents.
                    </p>
                    <ul style={{ listStyleType: "disc", paddingLeft: "20px", color: "#041A44", fontFamily: "Inter, sans-serif", fontWeight: 400, fontSize: "14px", lineHeight: 1.8, marginBottom: "12px" }}>
                      <li>The following acts in line with social media use shall be under disciplinary actions:<br /><strong>(Sanctions are also imposed based on Data Privacy Act or RA 10173)</strong></li>
                    </ul>
                    <ol style={{ listStyleType: "decimal", paddingLeft: "20px", color: "#041A44", fontFamily: "Inter, sans-serif", fontWeight: 400, fontSize: "14px", lineHeight: 1.8 }}>
                      <li className="mb-2">Posting illegal actions such as experimenting with alcohol and prohibited substances</li>
                      <li className="mb-2">Bullying: Using social media to use as a forum for hurtful speech<br /><strong>(RA 10627: Anti-bullying Act of 2013)</strong></li>
                      <li className="mb-2">Trashing teachers and other school personnel; speaking poorly of teachers and/or other school officials and personnel <strong>(RA 10627: Anti-bullying Act of 2013, Section 3)</strong></li>
                      <li className="mb-2">Posting objectionable content from school computers or networks<br /><strong>(RA 10175: Cybercrime Prevention Act of 2012)</strong></li>
                      <li className="mb-2">Posting confidential information<br /><strong>(Chapter V-Security of Personal Information, RA 10173)</strong></li>
                      <li className="mb-0">Ignoring School-specific Policies (e.g., posting of opinions on sensitive issues like abortion, homosexuality, euthanasia, and birth control or divorce)</li>
                    </ol>
                  </div>
                </div>

                {/* Blue Container 5: REPORTING */}
                <div className="rounded-lg p-4 mb-0 mt-4" style={{ backgroundColor: "#C4D7F0" }}>
                  <div className="flex items-center mb-3">
                    <div className="rounded-full flex items-center justify-center mr-3" style={{ width: "32px", height: "32px", minWidth: "32px", backgroundColor: "#041A44", color: "white", fontFamily: "Inter, sans-serif", fontWeight: 700, fontSize: "14px" }}>5</div>
                    <h4 className="font-bold" style={{ color: "#041A44", fontFamily: "Inter, sans-serif", fontWeight: 700, fontSize: "15px" }}>REPORTING</h4>
                  </div>
                  <p className="mb-3" style={{ color: "#041A44", fontFamily: "Inter, sans-serif", fontWeight: 400, fontSize: "14px", lineHeight: 1.8, textAlign: "justify" }}>
                    Reports of irresponsible use of social media should be made as soon as possible after the alleged act or acknowledgment of irresponsible social media conduct. The failure to promptly report may impair the Discipline Counsellor or the Discipline Committee's ability to investigate and redress the prohibited conduct.
                  </p>
                  <p className="mb-3" style={{ color: "#041A44", fontFamily: "Inter, sans-serif", fontWeight: 400, fontSize: "14px", lineHeight: 1.8, textAlign: "justify" }}>
                    Any student who has observed and has personally seen and experienced violations against irresponsible use of social media should immediately report the alleged act to a teacher, clinical instructor, counsellor, or adviser. A report may be submitted to the Adviser or to one Discipline Committee.
                  </p>
                  
                  {/* White Container 5.1: Notice of Report */}
                  <div className="rounded-lg p-4 mb-3" style={{ backgroundColor: "#FFFFFF" }}>
                    <div className="flex items-start mb-2">
                      <div className="rounded-full flex items-center justify-center mr-2" style={{ width: "32px", height: "32px", minWidth: "32px", backgroundColor: "#041A44", color: "white", fontFamily: "Inter, sans-serif", fontWeight: 700, fontSize: "10px" }}>5.1</div>
                      <h5 className="font-bold" style={{ color: "#041A44", fontFamily: "Inter, sans-serif", fontWeight: 700, fontSize: "14px" }}>NOTICE OF REPORT</h5>
                    </div>
                    <p className="mb-0" style={{ color: "#041A44", fontFamily: "Inter, sans-serif", fontWeight: 400, fontSize: "14px", lineHeight: 1.8, textAlign: "justify", paddingLeft: "40px" }}>
                      The Adviser who receives a notice that a student has committed the prohibited conduct shall immediately notify the Discipline Committee/Guidance Counsellor or Dean.
                    </p>
                  </div>
                  
                  {/* White Container 5.2: Investigation Report */}
                  <div className="rounded-lg p-4 mb-3" style={{ backgroundColor: "#FFFFFF" }}>
                    <div className="flex items-start mb-2">
                      <div className="rounded-full flex items-center justify-center mr-2" style={{ width: "32px", height: "32px", minWidth: "32px", backgroundColor: "#041A44", color: "white", fontFamily: "Inter, sans-serif", fontWeight: 700, fontSize: "10px" }}>5.2</div>
                      <h5 className="font-bold" style={{ color: "#041A44", fontFamily: "Inter, sans-serif", fontWeight: 700, fontSize: "14px" }}>INVESTIGATION REPORT</h5>
                    </div>
                    <p className="mb-0" style={{ color: "#041A44", fontFamily: "Inter, sans-serif", fontWeight: 400, fontSize: "14px", lineHeight: 1.8, textAlign: "justify", paddingLeft: "40px" }}>
                      The Discipline Committee shall conduct an appropriate investigation based on the allegations in the report. The Committee shall then decide on the action or disciplinary measure based on the level of severity of infraction as outlined in this policy or as stipulated in the Student Handbook (Student Handbook should have included the School Action on reports of irresponsible use of social media).
                    </p>
                  </div>
                  
                  {/* White Container 5.3: Concluding the Report */}
                  <div className="rounded-lg p-4 mb-3" style={{ backgroundColor: "#FFFFFF" }}>
                    <div className="flex items-start mb-2">
                      <div className="rounded-full flex items-center justify-center mr-2" style={{ width: "32px", height: "32px", minWidth: "32px", backgroundColor: "#041A44", color: "white", fontFamily: "Inter, sans-serif", fontWeight: 700, fontSize: "10px" }}>5.3</div>
                      <h5 className="font-bold" style={{ color: "#041A44", fontFamily: "Inter, sans-serif", fontWeight: 700, fontSize: "14px" }}>CONCLUDING THE REPORT</h5>
                    </div>
                    <p className="mb-0" style={{ color: "#041A44", fontFamily: "Inter, sans-serif", fontWeight: 400, fontSize: "14px", lineHeight: 1.8, textAlign: "justify", paddingLeft: "40px" }}>
                      <em>The investigation should be completed in five days.</em> The Discipline Committee shall prepare a written report of the investigation and shall provide a copy to the Office of the Dean.
                    </p>
                  </div>
                  
                  {/* White Container 5.4: School Action */}
                  <div className="rounded-lg p-4 mb-0" style={{ backgroundColor: "#FFFFFF" }}>
                    <div className="flex items-start mb-2">
                      <div className="rounded-full flex items-center justify-center mr-2" style={{ width: "32px", height: "32px", minWidth: "32px", backgroundColor: "#041A44", color: "white", fontFamily: "Inter, sans-serif", fontWeight: 700, fontSize: "10px" }}>5.4</div>
                      <h5 className="font-bold" style={{ color: "#041A44", fontFamily: "Inter, sans-serif", fontWeight: 700, fontSize: "14px" }}>SCHOOL ACTION</h5>
                    </div>
                    <p className="mb-0" style={{ color: "#041A44", fontFamily: "Inter, sans-serif", fontWeight: 400, fontSize: "14px", lineHeight: 1.8, textAlign: "justify", paddingLeft: "40px" }}>
                      If the results of the investigation indicate that the prohibited act was committed, the Discipline committee shall recommend to the Directress/ Dean of College appropriate disciplinary or corrective action reasonably calculated to address the conduct in accordance with the current Student Handbook guidelines on discipline.
                    </p>
                  </div>
                </div>

                {/* Blue Container 6: CONFIDENTIALITY */}
                <div className="rounded-lg p-4 mb-4 mt-4" style={{ backgroundColor: "#C4D7F0" }}>
                  <div className="flex items-center mb-3">
                    <div className="rounded-full flex items-center justify-center mr-3" style={{ width: "32px", height: "32px", minWidth: "32px", backgroundColor: "#041A44", color: "white", fontFamily: "Inter, sans-serif", fontWeight: 700, fontSize: "14px" }}>6</div>
                    <h4 className="font-bold" style={{ color: "#041A44", fontFamily: "Inter, sans-serif", fontWeight: 700, fontSize: "15px" }}>CONFIDENTIALITY</h4>
                  </div>
                  <p className="mb-0" style={{ color: "#041A44", fontFamily: "Inter, sans-serif", fontWeight: 400, fontSize: "14px", lineHeight: 1.8, textAlign: "justify" }}>
                    To the greatest extent possible, school officials shall also respect the privacy of the complaint, the person against whom the report is filed, and witnesses.Limited disclosure may be necessary in order to conduct a thorough investigation. <strong>(Chapter V Security of Personal Information, RA 10173)</strong>
                  </p>
                </div>

                {/* Blue Container 7: GUIDELINES ON POSTING OR SHARING MEDIA CONTENTS */}
                <div className="rounded-lg p-4 mb-0" style={{ backgroundColor: "#C4D7F0" }}>
                  <div className="flex items-center mb-3">
                    <div className="rounded-full flex items-center justify-center mr-3" style={{ width: "32px", height: "32px", minWidth: "32px", backgroundColor: "#041A44", color: "white", fontFamily: "Inter, sans-serif", fontWeight: 700, fontSize: "14px" }}>7</div>
                    <h4 className="font-bold" style={{ color: "#041A44", fontFamily: "Inter, sans-serif", fontWeight: 700, fontSize: "15px" }}>GUIDELINES ON POSTING OR SHARING MEDIA CONTENTS</h4>
                  </div>
                  {/* White Container */}
                  <div className="rounded-lg p-4" style={{ backgroundColor: "#FFFFFF" }}>
                    <ul className="mb-0" style={{ color: "#041A44", fontFamily: "Inter, sans-serif", fontWeight: 400, fontSize: "14px", lineHeight: 1.8, textAlign: "justify", listStyleType: "disc", paddingLeft: "20px" }}>
                      <li className="mb-3">Each student is personally responsible for the hosted content she/he publishes online. Published or hosted content on social media channels will be public for a long time. Contents published online represent you and everything about you. Online behavior should reflect the same standards of honesty, respect, and consideration that students use face to face.</li>
                      
                      <li className="mb-3">Blogs, wikis, virtual conferences, and podcasts are an extension of our classrooms and are considered official content. Contents considered inappropriate in the classroom are also deemed inappropriate online.</li>
                      
                      <li className="mb-3">Posting photos or videos of your fellow students without their permission is prohibited. Photos or videos taken at school without permission must not be posted or used for any purpose without the owner's permission. Photos and videos that are participated in, note that photos of fellow students must not be posted without the owner's permission written or verbally expressed.</li>
                      
                      <li className="mb-3">Posting or sharing videos with disturbing content is strongly discouraged.</li>
                      
                      <li className="mb-3">All information or data are considered confidential and should not be posted without their consent or those of their parents or guardians.</li>
                      
                      <li className="mb-3">Personal use of social networking site, including Facebook, Twitter, and Instagram as a means to cause embarrassment or humiliation to any person must not be tolerated. Any incidence of cyberbullying should be reported to the School Authorities/Officials immediately.</li>
                      
                      <li className="mb-3">Students are personally responsible for all comments/information and hosted content they publish/post online.</li>
                      
                      <li className="mb-3">Comment and other posts in social media sites such as Facebook, Instagram, and Twitter should be done with discretion. Comments expressed via social networking pages under the impression of a private conversation may still end up being shared into a more public domain even under private settings.</li>
                      
                      <li className="mb-3">Prudence shall be exercised in posting comments related to Consolatrix College of Toledo City, Inc., employees, staff and school-related events or activities. It is important to remember that when posting, even on the private settings, all posted contents are made public.</li>
                      
                      <li className="mb-0">Permission should be sought from the subject/owner before posting/sharing photographs and videos online.</li>
                    </ul>
                  </div>
                </div>

                {/* Blue Container 8: SOCIAL NETWORKING */}
                <div className="rounded-lg p-4 mb-0 mt-4" style={{ backgroundColor: "#C4D7F0" }}>
                  <div className="flex items-center mb-3">
                    <div className="rounded-full flex items-center justify-center mr-3" style={{ width: "32px", height: "32px", minWidth: "32px", backgroundColor: "#041A44", color: "white", fontFamily: "Inter, sans-serif", fontWeight: 700, fontSize: "14px" }}>8</div>
                    <h4 className="font-bold" style={{ color: "#041A44", fontFamily: "Inter, sans-serif", fontWeight: 700, fontSize: "15px" }}>SOCIAL NETWORKING</h4>
                  </div>
                  
                  {/* White Container 8.1: The Roles of Parents */}
                  <div className="rounded-lg p-4 mb-3" style={{ backgroundColor: "#FFFFFF" }}>
                    <div className="flex items-center mb-3">
                      <div className="rounded-full flex items-center justify-center mr-3" style={{ width: "32px", height: "32px", minWidth: "32px", backgroundColor: "#041A44", color: "white", fontFamily: "Inter, sans-serif", fontWeight: 700, fontSize: "10px" }}>8.1</div>
                      <h5 className="font-bold" style={{ color: "#041A44", fontFamily: "Inter, sans-serif", fontWeight: 700, fontSize: "14px" }}>The Roles of Parents</h5>
                    </div>
                    <ul className="mb-0" style={{ color: "#041A44", fontFamily: "Inter, sans-serif", fontWeight: 400, fontSize: "14px", lineHeight: 1.8, textAlign: "justify", listStyleType: "disc", paddingLeft: "20px" }}>
                      <li className="mb-2">Parents/guardians are highly encouraged to talk to their children regarding social media and provide guidance in their use of social media and the internet.</li>
                      <li className="mb-2">Parents/guardians must ensure that their children use/visit sites which deliver/provide appropriate contents.</li>
                      <li className="mb-2">Parents/guardians are expected to guide their children in providing personal information and are concern about what is personal or viewed.</li>
                      <li className="mb-0">Parents/guardians are encouraged to become role models in treating with respect confidentiality other person's personal information or data.</li>
                    </ul>
                  </div>
                  
                  {/* White Container 8.2: The Roles of Parents (Note: Title says "Parents" but content is about Teachers) */}
                  <div className="rounded-lg p-4 mb-0" style={{ backgroundColor: "#FFFFFF" }}>
                    <div className="flex items-center mb-3">
                      <div className="rounded-full flex items-center justify-center mr-3" style={{ width: "32px", height: "32px", minWidth: "32px", backgroundColor: "#041A44", color: "white", fontFamily: "Inter, sans-serif", fontWeight: 700, fontSize: "10px" }}>8.2</div>
                      <h5 className="font-bold" style={{ color: "#041A44", fontFamily: "Inter, sans-serif", fontWeight: 700, fontSize: "14px" }}>The Roles of Parents</h5>
                    </div>
                    <ul className="mb-0" style={{ color: "#041A44", fontFamily: "Inter, sans-serif", fontWeight: 400, fontSize: "14px", lineHeight: 1.8, textAlign: "justify", listStyleType: "disc", paddingLeft: "20px" }}>
                      <li className="mb-2">Social media use and networking should be a way for teachers to become leaders and models with their fellow teachers and students. Teachers are expected to communicate and provide knowledge in a way that is worthy of their profession.</li>
                      <li className="mb-2">Since technology is a convenient way of communicating and providing information, teachers are expected to practice professional digital communication with their fellow teachers as well as with their students.</li>
                      <li className="mb-2">Teachers must be role models to their students in using social media. Use of social media such as Instagram, Twitter, Personal blogs, and other apps should be in line with school policy. Teachers should remind students that school-related assignments and issues are dealt with within reasonable time bounds (office hours) and are not exclusive forms of communication.</li>
                      <li className="mb-2">Teachers should help their students to connect and collaborate in deeper level using the internet or social media and enhance students' interaction and classroom activities through the use of different internet applications.</li>
                      <li className="mb-2">Teachers must safeguard students' interaction and behavior with their fellow students to avoid misconduct or abuse in the use of social media by students.</li>
                      <li className="mb-0">Teachers should encourage students to use reflective conversations and maintain decorum in their public profiles.</li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Other sections placeholder */}
          {selectedSection !== 1 &&
            selectedSection !== 2 &&
            selectedSection !== 3 &&
            selectedSection !== 4 &&
            selectedSection !== 5 &&
            selectedSection !== 6 &&
            selectedSection !== 7 &&
            selectedSection !== 8 &&
            selectedSection !== 9 &&
            selectedSection !== 10 &&
            selectedSection !== 11 &&
            selectedSection !== 12 &&
            selectedSection !== 13 &&
            selectedSection !== 14 &&
            selectedSection !== 15 &&
            selectedSection !== 16 &&
            selectedSection !== 17 &&
            selectedSection !== 18 &&
            selectedSection !== 19 &&
            selectedSection !== 20 && (
              <div className="w-full">
                <div className="bg-[#001F3F] rounded-t-xl p-6 mb-6">
                  <div className="mb-4">
                    <span className="inline-block px-3 py-1 bg-white text-[#001F3F] rounded-full text-xs font-semibold border-2 border-[#001F3F]">
                      Section {currentSection.number}
                    </span>
                  </div>
                  <h1 className="text-2xl sm:text-3xl font-bold text-white mb-2">{currentSection.title.toUpperCase()}</h1>
                  <p className="text-white/80 text-sm">{currentSection.subtitle}</p>
                </div>
                <div className="bg-white rounded-xl p-6 shadow-sm">
                  <p className="text-gray-600">Content for this section will be added later.</p>
                </div>
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  )
}

