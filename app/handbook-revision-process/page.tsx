"use client"

import { useRouter } from "next/navigation"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { ChevronLeft } from "lucide-react"
import Link from "next/link"

export default function HandbookRevisionProcessPage() {
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
                  className="text-3xl sm:text-4xl lg:text-4xl font-extrabold tracking-wide leading-tight drop-shadow-sm"
                  style={{ 
                    color: "#0B234A",
                    fontFamily: "'Inter', sans-serif"
                  }}
                >
                  HANDBOOK
                </h1>
                <h1 
                  className="text-3xl lg:text-4xl font-extrabold tracking-wide leading-none drop-shadow-sm"
                  style={{ 
                    color: "#0B234A",
                    fontFamily: "'Inter', sans-serif"
                  }}
                >
                  REVISION PROCESS
                </h1>
                <div 
                  className="h-[3px] mt-3"
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
                REVIEW PROCESS
              </p>
            </div>
          </div>

          {/* Right Column - Content */}
          <div className="lg:col-span-7">
            <div 
              className="text-white p-5 sm:p-8 lg:p-10 rounded-xl sm:rounded-2xl shadow-lg sm:shadow-xl max-w-full lg:max-w-[880px] w-full mt-2 sm:mt-4 lg:mt-0 lg:ml-auto"
              style={{ backgroundColor: "#041A44" }}
            >
              <div className="text-center mb-8">
                <h2 
                  className="text-lg sm:text-xl font-normal mb-3 sm:mb-4"
                  style={{ fontFamily: "'Inter', sans-serif" }}
                >
                  Important Matters about the Handbook
                </h2>
                <p 
                  className="text-white mb-6 sm:mb-8 text-sm sm:text-base"
                  style={{ fontFamily: "'Inter', sans-serif" }}
                >
                  The Handbook was revised through the following stages:
                </p>
              </div>

              <div className="space-y-5 sm:space-y-6 text-left">
                <div className="flex items-start space-x-3 sm:space-x-4">
                  <span 
                    className="text-xl sm:text-2xl font-normal text-white flex-shrink-0"
                    style={{ fontFamily: "'Inter', sans-serif" }}
                  >
                    1.
                  </span>
                  <p className="leading-relaxed text-justify text-sm sm:text-base" style={{ fontFamily: "'Inter', sans-serif" }}>
                    <span className="font-normal">First stage:</span> The gathering of data from student organizations, Faculty, Staff, Administration and 
                    Colleges to be added to the existing provisions.
                  </p>
                </div>

                <div className="flex items-start space-x-3 sm:space-x-4">
                  <span 
                    className="text-xl sm:text-2xl font-normal text-white flex-shrink-0"
                    style={{ fontFamily: "'Inter', sans-serif" }}
                  >
                    2.
                  </span>
                  <p className="leading-relaxed text-justify text-sm sm:text-base" style={{ fontFamily: "'Inter', sans-serif" }}>
                    <span className="font-normal">Second stage:</span> The review and checking of data which was done by the English Professors and Dean 
                    of College.
                  </p>
                </div>

                <div className="flex items-start space-x-3 sm:space-x-4">
                  <span 
                    className="text-xl sm:text-2xl font-normal text-white flex-shrink-0"
                    style={{ fontFamily: "'Inter', sans-serif" }}
                  >
                    3.
                  </span>
                  <p className="leading-relaxed text-justify text-sm sm:text-base" style={{ fontFamily: "'Inter', sans-serif" }}>
                    <span className="font-normal">Third stage:</span> Focused on the review of Minor and Major Offenses which was done by the Prefect of 
                    Discipline and Guidance Counselor.
                  </p>
                </div>

                <div className="flex items-start space-x-3 sm:space-x-4">
                  <span 
                    className="text-xl sm:text-2xl font-normal text-white flex-shrink-0"
                    style={{ fontFamily: "'Inter', sans-serif" }}
                  >
                    4.
                  </span>
                  <p className="leading-relaxed text-justify text-sm sm:text-base" style={{ fontFamily: "'Inter', sans-serif" }}>
                    <span className="font-normal">Fourth stage:</span> Was done by the Planning and Executive Committee to review in details the 
                    terminologies, entries, definitions, policies, grammar and the consistencies and synchronization of 
                    the provisions and other existing policies and laws pertaining that of other manuals e.g Library, 
                    Registrar, Treasurer and other existing policies and laws pertaining to education.
                  </p>
                </div>

                <div className="flex items-start space-x-3 sm:space-x-4">
                  <span 
                    className="text-xl sm:text-2xl font-normal text-white flex-shrink-0"
                    style={{ fontFamily: "'Inter', sans-serif" }}
                  >
                    5.
                  </span>
                  <p className="leading-relaxed text-justify text-sm sm:text-base" style={{ fontFamily: "'Inter', sans-serif" }}>
                    <span className="font-normal">Fifth stage:</span> Was the approval of the School Administrative Board.
                  </p>
                </div>

                <div className="flex items-start space-x-3 sm:space-x-4">
                  <span 
                    className="text-xl sm:text-2xl font-normal text-white flex-shrink-0"
                    style={{ fontFamily: "'Inter', sans-serif" }}
                  >
                    6.
                  </span>
                  <p className="leading-relaxed text-justify text-sm sm:text-base" style={{ fontFamily: "'Inter', sans-serif" }}>
                    <span className="font-normal">Sixth stage:</span> The copy was then sent for printing.
                  </p>
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

