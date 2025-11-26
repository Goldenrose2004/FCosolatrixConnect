import Link from "next/link"

export function HandbookExploreSection() {
  const sections = [
    {
      title: "Student Handbook Foreword",
      description:
        "The official foreword establishes the authority and purpose of the handbook. All students are mandated to know and...",
      href: "/foreword",
    },
    {
      title: "Letter to Students",
      description:
        "A personal message from the School Administrative Board to students about the importance of following the...",
      href: "/letter-to-students",
    },
    {
      title: "AR Foundresses",
      description: "Information about the Augustinian Recollect Foundresses who established the congregation.",
      href: "/ar-foundresses",
    },
    {
      title: "Handbook Revision Process",
      description: "Details about the meticulous six-stage process used to revise and update the student handbook.",
      href: "/handbook-revision-process",
    },
  ]

  return (
    <section className="pt-8 sm:pt-10 md:pt-12 lg:pt-16 pb-12 sm:pb-16 md:pb-20 lg:pb-28 xl:pb-36 bg-gray-50">
      <div className="container mx-auto px-3 sm:px-4 md:px-6">
        <div className="text-center mb-6 sm:mb-8 md:mb-12">
          <h3 className="font-bold text-gray-900 mb-2 text-xl sm:text-2xl md:text-3xl lg:text-4xl px-2" style={{ fontFamily: "'Inter', sans-serif" }}>Explore the Digital Handbook</h3>
          <p className="text-gray-600 max-w-2xl mx-auto text-xs sm:text-sm md:text-base px-2" style={{ fontFamily: "'Inter', sans-serif" }}>
            Browse key sections of our official student handbook to stay informed and guided by our values, rules, and
            policies.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 md:gap-5 lg:gap-6">
          {sections.map((section, index) => (
            <div
              key={index}
              className="bg-[#041A44] text-white p-4 sm:p-5 md:p-6 rounded-2xl transition-transform duration-300 hover:scale-105 hover:shadow-xl flex flex-col h-full"
            >
              <h4 className="text-lg sm:text-xl font-bold mb-2 sm:mb-3" style={{ fontFamily: "'Inter', sans-serif" }}>{section.title}</h4>
              <p className="text-gray-300 text-xs sm:text-sm mb-4 sm:mb-5 md:mb-6 flex-grow" style={{ fontFamily: "'Inter', sans-serif" }}>{section.description}</p>
              <Link
                href={section.href || "#"}
                className="text-blue-400 hover:text-blue-300 font-medium inline-flex items-center mt-auto text-sm sm:text-base touch-manipulation"
                style={{ fontFamily: "'Inter', sans-serif" }}
              >
                Learn More
                <svg className="w-3.5 h-3.5 sm:w-4 sm:h-4 ml-1.5 sm:ml-2" fill="currentColor" viewBox="0 0 20 20">
                  <path
                    fillRule="evenodd"
                    d="M10.293 3.293a1 1 0 011.414 0l6 6a1 1 0 010 1.414l-6 6a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-4.293-4.293a1 1 0 010-1.414z"
                    clipRule="evenodd"
                  />
                </svg>
              </Link>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
