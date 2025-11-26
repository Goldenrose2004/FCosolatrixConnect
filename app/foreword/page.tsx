"use client"

import { useRouter } from "next/navigation"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { ChevronLeft } from "lucide-react"
import Link from "next/link"

export default function ForewordPage() {
  const router = useRouter()

  return (
    <div className="min-h-screen flex flex-col bg-gray-100">
      <Header />

      {/* Main Content */}
      <main className="container mx-auto px-4 sm:px-6 pt-8 sm:pt-12 lg:pt-16 pb-8 sm:pb-12 mb-12 sm:mb-16 min-h-[70vh] flex items-start lg:items-center flex-1">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-start lg:items-center w-full">
          {/* Left Column - Title with Back Button */}
          <div className="lg:col-span-5">
            {/* Back Button */}
            <div className="mt-2 sm:mt-6 lg:mt-8 mb-4 sm:mb-6">
              <Link 
                href="/" 
                className="text-gray-600 hover:text-gray-800 transition-colors inline-flex items-center"
              >
                <ChevronLeft className="w-6 h-6" />
              </Link>
            </div>

            {/* Title Section */}
            <div className="text-center lg:text-left">
              <div className="inline-block mx-auto lg:mx-0">
                <h1 
                  className="text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-wide leading-tight drop-shadow-sm"
                  style={{ 
                    color: "#0B234A",
                    fontFamily: "'Inter', sans-serif"
                  }}
                >
                  FOREWORD
                </h1>
                <div 
                  className="h-[3px] mt-2 sm:mt-3"
                  style={{ backgroundColor: "#0B234A" }}
                ></div>
              </div>
              <p 
                className="text-sm sm:text-base mt-2"
                style={{ 
                  color: "rgba(11, 35, 74, 0.8)",
                  fontFamily: "'Inter', sans-serif"
                }}
              >
                STUDENT HANDBOOK
              </p>
            </div>
          </div>

          {/* Right Column - Content */}
          <div className="lg:col-span-7">
            <div 
              className="text-white p-5 sm:p-8 lg:p-10 rounded-xl sm:rounded-2xl shadow-lg sm:shadow-xl max-w-full lg:max-w-[880px] w-full mt-2 sm:mt-4 lg:mt-0 lg:ml-auto"
              style={{ backgroundColor: "#041A44" }}
            >
              <p className="mb-6 sm:mb-8 leading-relaxed text-justify text-sm sm:text-base" style={{ fontFamily: "'Inter', sans-serif" }}>
                This Student Handbook covers the policies, rules and regulations of Consolatrix 
                College of Toledo City, Inc. All students are hereby mandated to know and be guided 
                accordingly. Policies issued by the School Administrative Board that are not included 
                in this Handbook shall be part of the set guidelines.
              </p>
              <p className="leading-relaxed text-justify text-sm sm:text-base" style={{ fontFamily: "'Inter', sans-serif" }}>
                Consolatrix College of Toledo City, Inc. reserves the right to admit, refuse admission, 
                suspend, or dismiss student on the basis of his/her academic performance, 
                behavioral conduct, criminal offense and non-conformity with the school rules and 
                regulations.
              </p>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  )
}

