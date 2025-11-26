"use client"

import { useRouter } from "next/navigation"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { ChevronLeft } from "lucide-react"
import Link from "next/link"
import Image from "next/image"

export default function ARFoundressesPage() {
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
                  className="text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-wide leading-tight drop-shadow-sm"
                  style={{ 
                    color: "#0B234A",
                    fontFamily: "'Inter', sans-serif"
                  }}
                >
                  AR FOUNDRESSES
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
                FOUNDING MOTHERS
              </p>
            </div>
          </div>

          {/* Right Column - Content */}
          <div className="lg:col-span-7">
            <div 
              className="text-white p-5 sm:p-8 lg:p-10 rounded-xl sm:rounded-2xl shadow-lg sm:shadow-xl max-w-full lg:max-w-[880px] w-full mt-2 sm:mt-4 lg:mt-0 lg:ml-auto"
              style={{ backgroundColor: "#041A44" }}
            >
              {/* Image */}
              <div className="bg-white rounded-lg p-4 mb-6 sm:mb-8">
                <p 
                  className="text-center mb-4 text-gray-800 text-sm"
                  style={{ fontFamily: "'Inter', sans-serif" }}
                >
                  Foundresses of the CONGREGATION of the Augustinian Recollect Sisters
                </p>
                <Image
                  src="/images/ARsisters.jpg"
                  alt="AR Sisters"
                  width={800}
                  height={400}
                  className="w-full h-auto max-h-52 sm:max-h-60 object-contain mx-auto rounded-md"
                />
              </div>

              {/* Content */}
              <div className="text-center">
                <h2 
                  className="text-lg sm:text-xl font-semibold mb-2"
                  style={{ fontFamily: "'Inter', sans-serif" }}
                >
                  AR Foundresses
                </h2>
                <p 
                  className="text-white mb-6 sm:mb-8 text-sm sm:text-base"
                  style={{ fontFamily: "'Inter', sans-serif" }}
                >
                  (blood sisters)
                </p>

                <div className="space-y-6">
                  <div>
                    <h3 
                      className="font-semibold text-base sm:text-lg mb-2 text-white"
                      style={{ fontFamily: "'Inter', sans-serif" }}
                    >
                      Mother Dionicia Talangpaz de Sta. María
                    </h3>
                    <p 
                      className="text-white text-sm sm:text-base"
                      style={{ fontFamily: "'Inter', sans-serif" }}
                    >
                      Born: March 12, 1691 - Calumpit, Bulacan
                    </p>
                    <p 
                      className="text-white text-sm sm:text-base"
                      style={{ fontFamily: "'Inter', sans-serif" }}
                    >
                      Died: October 12, 1732 - Manila
                    </p>
                  </div>

                  <div>
                    <h3 
                      className="font-semibold text-base sm:text-lg mb-2 text-white"
                      style={{ fontFamily: "'Inter', sans-serif" }}
                    >
                      Mother Cecilia Rossa Talangpaz
                    </h3>
                    <p 
                      className="text-white text-sm sm:text-base"
                      style={{ fontFamily: "'Inter', sans-serif" }}
                    >
                      Born: July 16, 1693 - Calumpit, Bulacan
                    </p>
                    <p 
                      className="text-white text-sm sm:text-base"
                      style={{ fontFamily: "'Inter', sans-serif" }}
                    >
                      Died: July 31, 1731 - Manila
                    </p>
                  </div>
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

