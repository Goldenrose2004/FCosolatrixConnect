export function HeroSection() {
  return (
    <section
      className="relative w-full min-h-[300px] sm:min-h-[360px] md:min-h-[450px] lg:min-h-[650px] flex items-center justify-start px-3 sm:px-4 md:px-6 lg:px-12 bg-cover bg-[position:80%_center] md:bg-center"
      style={{
        backgroundImage: "url(/images/hero-building.jpg)",
      }}
    >
      {/* Overlay for better text readability */}
      <div className="absolute inset-0 bg-black/40" />

      {/* Content */}
      <div className="relative z-10 max-w-xl w-full ml-0 sm:ml-2 md:ml-12 lg:ml-32 xl:ml-40 px-2 sm:px-3 md:px-0">
        <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold text-white mb-3 sm:mb-4 md:mb-5 leading-tight text-balance" style={{ fontFamily: "'Inter', sans-serif" }}>
          Your School Policy Handbook, Digitized
        </h1>
        <p className="text-sm sm:text-base md:text-base lg:text-lg text-white/95 mb-4 sm:mb-4 md:mb-5 leading-relaxed" style={{ fontFamily: "'Inter', sans-serif" }}>
          <span className="block sm:inline">ConsolatrixConnect brings school information, resources, and</span>
          <span className="block sm:inline"> student chat together in one easy-to-use platform. Stay informed,</span>
          <span className="block sm:inline"> stay engaged, and make campus life simpler.</span> 
        </p>
        <button className="px-5 sm:px-6 md:px-8 py-2 sm:py-2.5 md:py-3 bg-white text-blue-600 hover:bg-gray-100 transition-colors duration-200 rounded font-semibold text-sm sm:text-base whitespace-nowrap touch-manipulation" style={{ fontFamily: "'Inter', sans-serif" }}>
          Access Handbook
        </button>
      </div>
    </section>
  )
}
