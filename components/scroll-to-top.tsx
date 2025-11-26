"use client"

import { useState, useEffect } from "react"

export function ScrollToTop() {
  const [isVisible, setIsVisible] = useState(false)

  useEffect(() => {
    const toggleVisibility = () => {
      if (typeof window !== "undefined") {
        setIsVisible(window.pageYOffset > 300)
      }
    }

    if (typeof window !== "undefined") {
      window.addEventListener("scroll", toggleVisibility)
      return () => window.removeEventListener("scroll", toggleVisibility)
    }
  }, [])

  const scrollToTop = () => {
    if (typeof window !== "undefined") {
      window.scrollTo({ top: 0, behavior: "smooth" })
    }
  }

  if (!isVisible) return null

  return (
    <button
      onClick={scrollToTop}
      className="fixed bottom-8 right-8 z-40 w-12 h-12 bg-[#0066FF] text-white rounded-full shadow-lg hover:bg-blue-700 transition-colors duration-200 flex items-center justify-center"
      aria-label="Scroll to top"
    >
      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 10l7-7m0 0l7 7m-7-7v18" />
      </svg>
    </button>
  )
}
