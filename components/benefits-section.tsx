function CostIcon() {
  return (
    <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20">
      <path d="M8.433 7.418c.155-.103.346-.196.567-.267v1.698a2.305 2.305 0 01-.567-.267C8.07 8.34 8 8.114 8 8c0-.114.07-.34.433-.582zM11 12.849v-1.698c.22.071.412.164.567.267.364.243.433.468.433.582 0 .114-.07.34-.433.582a2.305 2.305 0 01-.567.267z" />
      <path
        fillRule="evenodd"
        d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-13a1 1 0 10-2 0v.092a4.535 4.535 0 00-1.676.662C6.602 6.234 6 7.009 6 8c0 .99.602 1.765 1.324 2.246.48.32 1.054.545 1.676.662v1.941c-.391-.127-.68-.317-.843-.504a1 1 0 10-1.51 1.31c.562.649 1.413 1.076 2.353 1.253V15a1 1 0 102 0v-.092a4.535 4.535 0 001.676-.662C13.398 13.766 14 12.991 14 12c0-.99-.602-1.765-1.324-2.246A4.535 4.535 0 0011 9.092V7.151c.391.127.68.317.843.504a1 1 0 101.511-1.31c-.563-.649-1.413-1.076-2.354-1.253V5z"
        clipRule="evenodd"
      />
    </svg>
  )
}

function UpdateIcon() {
  return (
    <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20">
      <path
        fillRule="evenodd"
        d="M6 2a1 1 0 00-1 1v1H4a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2h-1V3a1 1 0 10-2 0v1H7V3a1 1 0 00-1-1zm0 5a1 1 0 000 2h8a1 1 0 100-2H6z"
        clipRule="evenodd"
      />
    </svg>
  )
}

function AccessIcon() {
  return (
    <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20">
      <path
        fillRule="evenodd"
        d="M3 4a1 1 0 011-1h4a1 1 0 010 2H6.414l2.293 2.293a1 1 0 01-1.414 1.414L5 6.414V8a1 1 0 01-2 0V4zm9 1a1 1 0 010-2h4a1 1 0 011 1v4a1 1 0 01-2 0V6.414l-2.293 2.293a1 1 0 11-1.414-1.414L13.586 5H12zm-9 7a1 1 0 012 0v1.586l2.293-2.293a1 1 0 111.414 1.414L6.414 15H8a1 1 0 010 2H4a1 1 0 01-1-1v-4zm13-1a1 1 0 011 1v4a1 1 0 01-1 1h-4a1 1 0 010-2h1.586l-2.293-2.293a1 1 0 111.414-1.414L15 13.586V12a1 1 0 011-1z"
        clipRule="evenodd"
      />
    </svg>
  )
}

export function BenefitsSection() {
  return (
    <section className="py-8 sm:py-10 md:py-12 lg:py-16 bg-white">
      <div className="container mx-auto px-3 sm:px-4 md:px-6">
        <div className="text-center mb-6 sm:mb-8 md:mb-12">
          <button className="bg-slate-800 text-white px-4 sm:px-5 md:px-6 py-1.5 sm:py-2 rounded-full text-xs sm:text-sm font-medium mb-3 sm:mb-4 md:mb-6 transition-transform duration-300 hover:scale-105 hover:shadow-xl touch-manipulation" style={{ fontFamily: "'Inter', sans-serif" }}>
            Benefits
          </button>
          <h3 className="font-bold text-gray-900 mb-2 text-xl sm:text-2xl md:text-3xl lg:text-4xl" style={{ fontFamily: "'Inter', sans-serif" }}>Why Go Digital?</h3>
          <p className="text-gray-600 max-w-2xl mx-auto text-xs sm:text-sm md:text-base px-2" style={{ fontFamily: "'Inter', sans-serif" }}>
            Transforming traditional systems into smarter, more connected experiences
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 sm:gap-5 md:gap-6 lg:gap-8">
          <div className="bg-[#041A44] text-white p-5 sm:p-6 md:p-8 rounded-2xl transition-transform duration-300 hover:scale-105 hover:shadow-xl text-center flex flex-col items-center">
            <div className="w-10 h-10 sm:w-12 sm:h-12 bg-blue-600 rounded-lg flex items-center justify-center mb-4 sm:mb-5 md:mb-6">
              <CostIcon />
            </div>
            <h4 className="text-lg sm:text-xl font-bold mb-2 sm:mb-3" style={{ fontFamily: "'Inter', sans-serif" }}>Cost-Effective</h4>
            <p className="text-gray-300 text-sm sm:text-base" style={{ fontFamily: "'Inter', sans-serif" }}>Save on printing and distribution costs with our digital solution.</p>
          </div>

          <div className="bg-[#041A44] text-white p-5 sm:p-6 md:p-8 rounded-2xl transition-transform duration-300 hover:scale-105 hover:shadow-xl text-center flex flex-col items-center">
            <div className="w-10 h-10 sm:w-12 sm:h-12 bg-blue-600 rounded-lg flex items-center justify-center mb-4 sm:mb-5 md:mb-6">
              <UpdateIcon />
            </div>
            <h4 className="text-lg sm:text-xl font-bold mb-2 sm:mb-3" style={{ fontFamily: "'Inter', sans-serif" }}>Always Up-to-Date</h4>
            <p className="text-gray-300 text-sm sm:text-base" style={{ fontFamily: "'Inter', sans-serif" }}>Instantly update policies and ensure everyone has the latest information.</p>
          </div>

          <div className="bg-[#041A44] text-white p-5 sm:p-6 md:p-8 rounded-2xl transition-transform duration-300 hover:scale-105 hover:shadow-xl text-center flex flex-col items-center">
            <div className="w-10 h-10 sm:w-12 sm:h-12 bg-blue-600 rounded-lg flex items-center justify-center mb-4 sm:mb-5 md:mb-6">
              <AccessIcon />
            </div>
            <h4 className="text-lg sm:text-xl font-bold mb-2 sm:mb-3" style={{ fontFamily: "'Inter', sans-serif" }}>Accessible Anywhere</h4>
            <p className="text-gray-300 text-sm sm:text-base" style={{ fontFamily: "'Inter', sans-serif" }}>Access your handbook from any device, anytime, anywhere.</p>
          </div>
        </div>
      </div>
    </section>
  )
}
