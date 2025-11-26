export function Footer() {
  return (
    <footer className="text-white py-4 sm:py-5 md:py-6 lg:py-8" style={{ backgroundColor: "#041A44", minHeight: "120px", fontFamily: "'Inter', sans-serif" }}>
      <div className="mx-auto px-4 sm:px-4 md:px-6 lg:px-[1in]" style={{ maxWidth: "calc(100% - 1rem)", marginLeft: "auto", marginRight: "auto" }}>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 sm:gap-5 md:gap-6 lg:gap-8">
          {/* Brand Section */}
          <div className="text-center md:text-left">
            <h3 className="text-white text-base sm:text-lg md:text-xl font-bold mb-2 sm:mb-2">
              ConsolatrixConnect
            </h3>
            <p className="text-white text-xs sm:text-sm md:text-base leading-relaxed">
              A Catholic Institution committed to excellence in education and service.
            </p>
          </div>

          {/* Legal Section */}
          <div className="text-center md:text-left">
            <h4 className="text-white text-base sm:text-lg md:text-xl font-bold mb-2 sm:mb-2">
              Legal
            </h4>
            <ul className="m-0 p-0 list-none">
              <li>
                <a
                  href="#"
                  className="text-white hover:text-gray-300 transition-colors text-xs sm:text-sm md:text-base touch-manipulation no-underline block mb-1.5"
                >
                  Privacy Policy
                </a>
              </li>
              <li>
                <a
                  href="#"
                  className="text-white hover:text-gray-300 transition-colors text-xs sm:text-sm md:text-base touch-manipulation no-underline block"
                >
                  Terms of Service
                </a>
              </li>
            </ul>
          </div>

          {/* Contact Section */}
          <div className="text-center md:text-left">
            <h4 className="text-white text-base sm:text-lg md:text-xl font-bold mb-2 sm:mb-2">
              Contact Us
            </h4>
            <div className="text-white text-xs sm:text-sm md:text-base leading-relaxed">
              <p className="mb-1.5 break-words hyphens-auto">Email: consolatrixcollegetoledo2005@gmail.com</p>
              <p className="mb-1.5">Phone: (032) 466 1690</p>
              <p className="break-words hyphens-auto">Address: Magsaysay Hills, Poblacion, Toledo City, Cebu, Philippines, 6038</p>
            </div>
          </div>
        </div>

        {/* Divider and bottom copyright row */}
        <div className="border-t mt-6 sm:mt-5 md:mt-6 pt-4 sm:pt-3.5 md:pt-4" style={{ borderTop: "1px solid rgba(255, 255, 255, 0.2)" }}>
          <p className="text-white text-xs sm:text-sm md:text-base text-center md:text-left" style={{ margin: 0 }}>
            © 2025 ConsolatrixConnect. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  )
}
