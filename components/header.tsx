"use client"

import { useState } from "react"
import Link from "next/link"
import { Menu, X } from "lucide-react"
import Image from "next/image"

export function Header() {
  const [isOpen, setIsOpen] = useState(false)

  return (
    <header className="sticky top-0 z-50 w-full bg-[#041A44]">
      <div className="w-full px-4 sm:px-6 lg:px-12">
        <div className="h-16 sm:h-[4.5rem] md:h-20 flex items-center justify-between" suppressHydrationWarning>
          {/* Logo and Brand */}
          <div className="flex items-center gap-0 ml-0 sm:ml-2 md:ml-12 lg:ml-32 xl:ml-40 min-w-0 flex-1">
            <Image
              src="/images/logo-icon.png"
              alt="ConsolatrixConnect"
              width={115}
              height={115}
              className="flex-shrink-0 w-[72px] h-[72px] sm:w-16 sm:h-16 md:w-20 md:h-20 lg:w-24 lg:h-24 xl:w-24 xl:h-24 object-contain"
            />
            <span className="text-white font-bold text-base sm:text-base md:text-xl lg:text-2xl whitespace-nowrap truncate -ml-1 sm:-ml-1.5 md:-ml-2">ConsolatrixConnect</span>
          </div>

          {/* Desktop Action Buttons */}
          <div className="hidden md:flex items-center gap-3 mr-40 lg:mr-40">
            <Link href="/login">
              <button className="px-5 py-2.5 border border-white text-white hover:bg-white hover:text-[#041A44] transition-colors duration-200 rounded font-medium text-sm">
                Login
              </button>
            </Link>
            <Link href="/signup">
              <button className="px-5 py-2.5 border border-white text-white hover:bg-white hover:text-[#041A44] transition-colors duration-200 rounded font-medium text-sm">
                Sign Up
              </button>
            </Link>
          </div>

          {/* Mobile Hamburger Menu */}
          <button onClick={() => setIsOpen(!isOpen)} className="md:hidden text-white p-1.5 sm:p-2 touch-manipulation flex-shrink-0" aria-label="Toggle menu">
            {isOpen ? <X size={20} className="sm:w-6 sm:h-6" /> : <Menu size={20} className="sm:w-6 sm:h-6" />}
          </button>
        </div>

        {/* Mobile Menu */}
        {isOpen && (
          <div className="md:hidden pb-3 sm:pb-4 flex justify-center gap-2 sm:gap-2.5">
            <Link href="/login">
              <button className="min-w-[120px] px-4 py-1.5 border border-white text-white hover:bg-white hover:text-[#041A44] transition-colors duration-200 rounded font-medium text-xs sm:text-sm touch-manipulation">
                Login
              </button>
            </Link>
            <Link href="/signup">
              <button className="min-w-[120px] px-4 py-1.5 border border-white text-white hover:bg-white hover:text-[#041A44] transition-colors duration-200 rounded font-medium text-xs sm:text-sm touch-manipulation">
                Sign Up
              </button>
            </Link>
          </div>
        )}
      </div>
    </header>
  )
}
