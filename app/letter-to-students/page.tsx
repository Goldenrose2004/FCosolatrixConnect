"use client"

import { useRouter } from "next/navigation"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { ChevronLeft } from "lucide-react"
import Link from "next/link"

export default function LetterToStudentsPage() {
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
                  className="text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-wide leading-snug drop-shadow-sm"
                  style={{ 
                    color: "#0B234A",
                    fontFamily: "'Inter', sans-serif"
                  }}
                >
                  LETTER TO STUDENTS
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
                WELCOME MESSAGE
              </p>
            </div>
          </div>

          {/* Right Column - Content */}
          <div className="lg:col-span-7">
            <div 
              className="text-white p-5 sm:p-8 lg:p-10 rounded-xl sm:rounded-2xl shadow-lg sm:shadow-xl max-w-full lg:max-w-[880px] w-full mt-2 sm:mt-4 lg:mt-0 lg:ml-auto"
              style={{ backgroundColor: "#041A44" }}
            >
              <p className="mb-6 leading-relaxed text-justify text-sm sm:text-base" style={{ fontFamily: "'Inter', sans-serif" }}>
                <span className="font-semibold">Dear Students,</span>
              </p>

              <p className="mb-6 leading-relaxed text-justify text-sm sm:text-base" style={{ fontFamily: "'Inter', sans-serif" }}>
                These student guidelines are expressions of the concern your educators have for the continuous 
                development of your personality. They are meant to help you strengthen your character through 
                responsible and self-disciplined life and guarantee a school atmosphere of order, cooperation and 
                peace, which are necessary for your moral and intellectual formation. By your enrollment in Consolatrix 
                College, you express willingness to abide by its rules and regulations. We exhort you, therefore, to read 
                them carefully, to understand them and to put them into practice at all times so that harmony may 
                exist among all in the school.
              </p>

              <p className="mb-6 leading-relaxed text-justify text-sm sm:text-base" style={{ fontFamily: "'Inter', sans-serif" }}>
                These guidelines are likewise expressions of the beautiful family Spirit, the life-blood of every 
                Augustinian Recollect School. Accept them therefore as coming from the hearts of your educators who 
                love you. Look to and follow the Blessed Virgin Mary, who lived a life of obedience to the Father's will, 
                diligently teaching her Son how to become a good Son of God in her lowly home at Nazareth. Under her 
                mantle of protection, we are all her children. She wants us to become faithful followers of her Son Jesus, 
                to be honest and productive citizens of our country.
              </p>

              <div className="text-left sm:text-right">
                <p className="font-semibold mb-1 text-sm sm:text-base" style={{ fontFamily: "'Inter', sans-serif" }}>Sincerely yours,</p>
                <p className="text-white text-sm sm:text-base" style={{ fontFamily: "'Inter', sans-serif" }}>The School Administrative Board</p>
              </div>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  )
}

