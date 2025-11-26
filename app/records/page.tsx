"use client"

import { useEffect, useState, useCallback, useRef } from "react"
import { useRouter } from "next/navigation"
import { AuthenticatedHeader } from "@/components/authenticated-header"
import { Footer } from "@/components/footer"
import { User, BookOpen, Building, Briefcase, AlertTriangle, Check, RefreshCw, Calendar, Tag, FileText, List, CircleCheck, Eye, X } from "lucide-react"

export default function RecordsPage() {
  const router = useRouter()
  const [user, setUser] = useState<any>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [violations, setViolations] = useState<any[]>([])
  const [isLoadingViolations, setIsLoadingViolations] = useState(true)
  const [selectedViolation, setSelectedViolation] = useState<any>(null)
  const violationsChannelRef = useRef<BroadcastChannel | null>(null)

  // Fetch violations for the logged-in user
  const fetchViolations = useCallback(async () => {
    if (!user?.id) return

    try {
      const response = await fetch(`/api/violations?userId=${user.id}`)
      const data = await response.json()

      if (data.ok && data.violations) {
        setViolations(data.violations)
      } else {
        console.error("Failed to fetch violations:", data.error)
        setViolations([])
      }
    } catch (error) {
      console.error("Error fetching violations:", error)
      setViolations([])
    } finally {
      setIsLoadingViolations(false)
    }
  }, [user?.id])

  useEffect(() => {
    // Check if user is logged in
    const currentUser = localStorage.getItem("currentUser")
    if (!currentUser) {
      router.push("/login")
      return
    }

    const userData = JSON.parse(currentUser)
    setUser(userData)
    setIsLoading(false)
  }, [router])

  useEffect(() => {
    if (user?.id) {
      fetchViolations()
      // Poll for new violations every 10 seconds
      const interval = setInterval(fetchViolations, 10000)
      return () => clearInterval(interval)
    }
  }, [user?.id, fetchViolations])

  // Listen for violation events
  useEffect(() => {
    const handleViolationUpdate = () => {
      fetchViolations()
    }

    window.addEventListener("violationCreated", handleViolationUpdate as EventListener)
    window.addEventListener("violationDeleted", handleViolationUpdate as EventListener)
    window.addEventListener("violationUpdated", handleViolationUpdate as EventListener)

    return () => {
      window.removeEventListener("violationCreated", handleViolationUpdate as EventListener)
      window.removeEventListener("violationDeleted", handleViolationUpdate as EventListener)
      window.removeEventListener("violationUpdated", handleViolationUpdate as EventListener)
    }
  }, [fetchViolations])

  useEffect(() => {
    if (typeof window === "undefined" || typeof BroadcastChannel === "undefined") {
      return
    }
    const channel = new BroadcastChannel("violations-channel")
    const handleMessage = (event: MessageEvent<any>) => {
      const message = event.data
      if (!message || typeof message !== "object") return
      if (message.type !== "violation:status-updated") return
      if (user?.id && message.userId && message.userId !== user.id) return
      fetchViolations()
    }
    channel.addEventListener("message", handleMessage)
    violationsChannelRef.current = channel
    return () => {
      channel.removeEventListener("message", handleMessage)
      channel.close()
      violationsChannelRef.current = null
    }
  }, [fetchViolations, user?.id])

  if (isLoading) {
    return <div className="flex items-center justify-center min-h-screen">Loading...</div>
  }

  const userInitials = (user?.firstName?.[0] || "U") + (user?.lastName?.[0] || "")
  const fullName = `${user?.firstName || ""} ${user?.lastName || ""}`.trim() || "N/A"

  const normalizeStatus = (status?: string | null) => (status ? status.trim().toLowerCase() : "pending")
  const getStatusMeta = (status?: string | null) => {
    const normalized = normalizeStatus(status)
    if (normalized === "resolved") {
      return { label: "Resolved", className: "bg-green-100 text-green-800", icon: "check" as const }
    }
    if (normalized === "warning") {
      return { label: "Warning", className: "bg-yellow-100 text-yellow-800", icon: "alert" as const }
    }
    return { label: "Pending", className: "bg-red-100 text-red-800", icon: "x" as const }
  }
  const renderStatusIcon = (icon: "check" | "alert" | "x") => {
    if (icon === "check") {
      return (
        <svg className="w-3 h-3 mr-1" fill="currentColor" viewBox="0 0 20 20">
          <path
            fillRule="evenodd"
            d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
            clipRule="evenodd"
          ></path>
        </svg>
      )
    }
    if (icon === "alert") {
      return (
        <svg className="w-3 h-3 mr-1" fill="currentColor" viewBox="0 0 20 20">
          <path
            fillRule="evenodd"
            d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l6.518 11.6c.75 1.335-.213 3-1.742 3H3.48c-1.53 0-2.492-1.665-1.742-3l6.519-11.6zM11 13a1 1 0 10-2 0 1 1 0 002 0zm-.25-5.75a.75.75 0 00-1.5 0v3.5a.75.75 0 001.5 0v-3.5z"
            clipRule="evenodd"
          ></path>
        </svg>
      )
    }
    return (
      <svg className="w-3 h-3 mr-1" fill="currentColor" viewBox="0 0 20 20">
        <path
          fillRule="evenodd"
          d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
          clipRule="evenodd"
        ></path>
      </svg>
    )
  }

  // Function to convert year level to college year name
  const getCollegeYearName = (yearLevel: string) => {
    const yearMap: Record<string, string> = {
      "1st Year": "1st Year College",
      "2nd Year": "2nd Year College",
      "3rd Year": "3rd Year College",
      "4th Year": "4th Year College",
    }
    return yearMap[yearLevel] || yearLevel
  }

  return (
    <div className="min-h-screen bg-gray-50" style={{ fontFamily: "'Inter', sans-serif" }}>
      <AuthenticatedHeader userName={user?.firstName} userInitials={userInitials} useLandingPageStylingMobileOnly={true} />

      {/* Main Content */}
      <main className="min-h-screen bg-gray-50">
        <div className="max-w-7xl mx-auto px-3 sm:px-4 md:px-6 pt-2 pb-12">
          {/* Header with gradient background */}
          <div
            className="rounded-lg sm:rounded-xl shadow-lg p-4 sm:p-6 md:p-8 mb-6 sm:mb-8 text-white"
            style={{
              background: "linear-gradient(135deg, #001F54, #004AAD)",
              boxShadow: "0 4px 10px rgba(0, 0, 0, 0.2)",
            }}
          >
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 sm:gap-4">
              <div className="flex-1 min-w-0 w-full sm:w-auto">
                <h1 className="text-lg sm:text-2xl md:text-3xl font-bold mb-1 sm:mb-2">Student Records</h1>
                <p className="text-blue-100 text-xs sm:text-base md:text-lg leading-tight sm:leading-normal">Academic and disciplinary information overview</p>
              </div>
              <div className="flex-shrink-0 w-full sm:w-auto">
                <div className="rounded-lg p-2 sm:p-3 md:p-4" style={{ backgroundColor: "#2B5EA0" }}>
                  <div className="text-center">
                    <p className="text-[10px] sm:text-xs md:text-sm text-blue-100">CCTC</p>
                    <p className="text-xs sm:text-base md:text-xl font-semibold text-white leading-tight sm:leading-normal">Consolatrix College of Toledo City</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Student Information */}
          <div className="bg-white rounded-lg sm:rounded-xl shadow-lg p-4 sm:p-6 md:p-8 mb-6 sm:mb-8" style={{ transition: "all 0.3s ease" }}>
            <div className="flex items-center mb-4 sm:mb-6">
              <div className="w-8 h-8 sm:w-10 sm:h-10 md:w-12 md:h-12 rounded-full flex items-center justify-center mr-2 sm:mr-3 md:mr-4" style={{ backgroundColor: "#041A44" }}>
                <User className="w-4 h-4 sm:w-5 sm:h-5 md:w-6 md:h-6 text-white" />
              </div>
              <h2 className="text-lg sm:text-xl md:text-2xl font-bold text-gray-800">Student Information</h2>
            </div>

            <div className="grid grid-cols-2 gap-2 sm:gap-3 md:gap-6">
              {/* Full Name Card */}
              <div
                className="p-2.5 sm:p-4 md:p-6 rounded-lg"
                style={{
                  background: "linear-gradient(135deg, #f8fafc 0%, #e2e8f0 100%)",
                  borderLeft: "4px solid #041A44",
                }}
              >
                <div className="flex items-center mb-1.5 sm:mb-3">
                  <svg className="w-3.5 h-3.5 sm:w-5 sm:h-5 mr-1 sm:mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" style={{ color: "#475569" }}>
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"></path>
                  </svg>
                  <p className="text-gray-600 font-medium text-[10px] sm:text-sm md:text-base">Full Name</p>
                </div>
                <p className="text-xs sm:text-base md:text-xl font-semibold text-gray-800 leading-tight sm:leading-normal">{fullName}</p>
              </div>

              {/* Year Level Card */}
              <div
                className="p-2.5 sm:p-4 md:p-6 rounded-lg"
                style={{
                  background: "linear-gradient(135deg, #f8fafc 0%, #e2e8f0 100%)",
                  borderLeft: "4px solid #041A44",
                }}
              >
                <div className="flex items-center mb-1.5 sm:mb-3">
                  <svg className="w-3.5 h-3.5 sm:w-5 sm:h-5 mr-1 sm:mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" style={{ color: "#475569" }}>
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"></path>
                  </svg>
                  <p className="text-gray-600 font-medium text-[10px] sm:text-sm md:text-base">Year Level</p>
                </div>
                <p className="text-xs sm:text-base md:text-xl font-semibold text-gray-800 leading-tight sm:leading-normal">{getCollegeYearName(user?.yearLevel || "N/A")}</p>
              </div>

              {/* Department Card */}
              <div
                className="p-2.5 sm:p-4 md:p-6 rounded-lg"
                style={{
                  background: "linear-gradient(135deg, #f8fafc 0%, #e2e8f0 100%)",
                  borderLeft: "4px solid #041A44",
                }}
              >
                <div className="flex items-center mb-1.5 sm:mb-3">
                  <svg className="w-3.5 h-3.5 sm:w-5 sm:h-5 mr-1 sm:mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" style={{ color: "#475569" }}>
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"></path>
                  </svg>
                  <p className="text-gray-600 font-medium text-[10px] sm:text-sm md:text-base">Department</p>
                </div>
                <p className="text-xs sm:text-base md:text-xl font-semibold text-gray-800 leading-tight sm:leading-normal">{user?.department || "N/A"}</p>
              </div>

              {/* CCTC Card */}
              <div
                className="p-2.5 sm:p-4 md:p-6 rounded-lg min-w-0"
                style={{
                  background: "linear-gradient(135deg, #f8fafc 0%, #e2e8f0 100%)",
                  borderLeft: "4px solid #041A44",
                }}
              >
                <div className="flex items-center mb-1.5 sm:mb-3">
                  <svg className="w-3.5 h-3.5 sm:w-5 sm:h-5 mr-1 sm:mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" style={{ color: "#475569" }}>
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 6H5a2 2 0 00-2 2v9a2 2 0 002 2h14a2 2 0 002-2V8a2 2 0 00-2-2h-5m-4 0V5a2 2 0 114 0v1m-4 0a2 2 0 104 0m-5 8a2 2 0 100-4 2 2 0 000 4zm0 0c1.306 0 2.417.835 2.83 2M9 14a3.001 3.001 0 00-2.83 2M15 11h3m-3 4h2"></path>
                  </svg>
                  <p className="text-gray-600 font-medium text-[10px] sm:text-sm md:text-base">School</p>
                </div>
                <p className="text-[9px] sm:text-base md:text-xl font-semibold text-gray-800 leading-tight sm:leading-normal break-words overflow-hidden">Consolatrix College of Toledo City</p>
              </div>
            </div>
          </div>

          {/* Violation Records */}
          <div className="bg-white rounded-lg sm:rounded-xl shadow-lg p-4 sm:p-6 md:p-8 mb-12 sm:mb-20" style={{ transition: "all 0.3s ease" }}>
            <div className="flex items-center mb-4 sm:mb-6">
              <div className="w-8 h-8 sm:w-10 sm:h-10 md:w-12 md:h-12 rounded-full flex items-center justify-center mr-2 sm:mr-3 md:mr-4" style={{ backgroundColor: "#f1f5f9", border: "1px solid #94a3b8" }}>
                <AlertTriangle className="w-4 h-4 sm:w-5 sm:h-5 md:w-6 md:h-6" style={{ color: "#475569" }} strokeWidth={2} fill="none" />
              </div>
              <div>
                <h2 className="text-lg sm:text-xl md:text-2xl font-bold text-gray-800">Violation Records</h2>
                <p className="text-gray-600 mt-0.5 sm:mt-1 text-xs sm:text-sm md:text-base">Disciplinary actions and violations history</p>
              </div>
            </div>

            {/* Violations List */}
            {isLoadingViolations ? (
              <div className="text-center py-6 sm:py-8 md:py-12">
                <RefreshCw className="mx-auto h-8 w-8 sm:h-10 sm:w-10 md:h-12 md:w-12 text-[#041A44] mb-3 sm:mb-4 animate-spin" />
                <p className="text-gray-600 text-sm sm:text-base">Loading violations...</p>
              </div>
            ) : violations.length === 0 ? (
              <div className="text-center py-6 sm:py-8 md:py-12">
                <div className="w-16 h-16 sm:w-20 sm:h-20 md:w-24 md:h-24 rounded-full flex items-center justify-center mx-auto mb-3 sm:mb-4" style={{ backgroundColor: "#f1f5f9" }}>
                  <svg className="w-8 h-8 sm:w-10 sm:h-10 md:w-12 md:h-12" fill="none" stroke="currentColor" viewBox="0 0 24 24" style={{ color: "#475569" }}>
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                  </svg>
                </div>
                <h3 className="text-lg sm:text-xl font-semibold text-gray-800 mb-1.5 sm:mb-2">No Violations Found</h3>
                <p className="text-gray-600 text-sm sm:text-base">You have a clean disciplinary record. Keep up the good work!</p>
              </div>
            ) : (
              <>
                {/* Mobile View - Simplified Table */}
                <div className="block md:hidden">
                  <div className="space-y-3">
                    {violations.map((violation) => {
                      const formatDate = (dateString: string) => {
                        try {
                          const date = new Date(dateString)
                          return date.toLocaleDateString("en-US", {
                            year: "numeric",
                            month: "long",
                            day: "numeric",
                          })
                        } catch {
                          return dateString
                        }
                      }

                      const statusMeta = getStatusMeta(violation.status)

                      return (
                        <div
                          key={violation.id}
                          className="bg-white border border-gray-200 rounded-lg shadow-sm overflow-hidden"
                        >
                          {/* Header */}
                          <div
                            className="px-3 py-2 rounded-t-lg"
                            style={{
                              background: "linear-gradient(135deg, #001F54, #004AAD)",
                              boxShadow: "0 2px 4px rgba(0, 0, 0, 0.1)",
                            }}
                          >
                            <div className="flex items-center">
                              <Calendar className="w-3 h-3 text-white mr-1.5" />
                              <span className="text-[10px] font-medium text-white">
                                {formatDate(violation.date || violation.createdAt || new Date().toISOString())}
                              </span>
                            </div>
                          </div>
                          {/* Content */}
                          <div className="p-3">
                            <div className="flex items-center justify-between gap-2">
                              <div className="flex items-center gap-3 flex-1 min-w-0">
                                <div className="flex-shrink-0">
                                  <p className="text-[10px] text-gray-500 mb-1">Type of Violation</p>
                                  <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-medium bg-orange-100 text-orange-800">
                                    {violation.violationType || "Behavior"}
                                  </span>
                                </div>
                                <div className="h-8 w-px bg-gray-300 flex-shrink-0"></div>
                                <div className="flex-shrink-0">
                                  <p className="text-[10px] text-gray-500 mb-1">Status</p>
                                  <span
                                    className={`inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-semibold ${statusMeta.className}`}
                                  >
                                    {renderStatusIcon(statusMeta.icon)}
                                    {statusMeta.label}
                                  </span>
                                </div>
                              </div>
                              <button
                                onClick={() => setSelectedViolation(violation)}
                                className="ml-2 flex-shrink-0 px-3 py-1.5 rounded-lg text-[10px] font-medium text-white flex items-center gap-1.5"
                                style={{
                                  background: "linear-gradient(135deg, #001F54, #004AAD)",
                                  boxShadow: "0 2px 4px rgba(0, 0, 0, 0.1)",
                                }}
                              >
                                <Eye className="w-3 h-3" />
                                View
                              </button>
                            </div>
                          </div>
                        </div>
                      )
                    })}
                  </div>
                </div>

                {/* Desktop View - Full Table */}
                <div className="hidden md:block overflow-x-auto">
                  <table className="min-w-full">
                    <thead>
                      <tr
                        style={{
                          background: "linear-gradient(135deg, #001F54, #004AAD)",
                          boxShadow: "0 4px 10px rgba(0, 0, 0, 0.2)",
                        }}
                      >
                        <th className="px-6 py-4 text-left text-xs font-bold text-white uppercase tracking-wider rounded-tl-lg">
                          <div className="flex items-center">
                            <Calendar className="w-4 h-4 mr-2" />
                            DATE
                          </div>
                        </th>
                        <th className="px-6 py-4 text-left text-xs font-bold text-white uppercase tracking-wider">
                          <div className="flex items-center">
                            <Tag className="w-4 h-4 mr-2" />
                            TYPE
                          </div>
                        </th>
                        <th className="px-6 py-4 text-left text-xs font-bold text-white uppercase tracking-wider">
                          <div className="flex items-center">
                            <FileText className="w-4 h-4 mr-2" />
                            DESCRIPTION
                          </div>
                        </th>
                        <th className="px-6 py-4 text-left text-xs font-bold text-white uppercase tracking-wider">
                          <div className="flex items-center">
                            <User className="w-4 h-4 mr-2" />
                            MANAGED BY
                          </div>
                        </th>
                        <th className="px-6 py-4 text-left text-xs font-bold text-white uppercase tracking-wider">
                          <div className="flex items-center">
                            <List className="w-4 h-4 mr-2" />
                            ADDITIONAL NOTES
                          </div>
                        </th>
                        <th className="px-6 py-4 text-left text-xs font-bold text-white uppercase tracking-wider rounded-tr-lg">
                          <div className="flex items-center">
                            <CircleCheck className="w-4 h-4 mr-2" />
                            STATUS
                          </div>
                        </th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {violations.map((violation) => {
                        const formatDate = (dateString: string) => {
                          try {
                            const date = new Date(dateString)
                            return date.toLocaleDateString("en-US", {
                              year: "numeric",
                              month: "long",
                              day: "numeric",
                            })
                          } catch {
                            return dateString
                          }
                        }

                        const statusMeta = getStatusMeta(violation.status)

                        return (
                          <tr key={violation.id} className="hover:bg-gray-50 transition-colors duration-200">
                            <td className="px-6 py-4 whitespace-nowrap">
                              <div className="flex items-center">
                                <div className="w-2 h-2 rounded-full mr-3" style={{ backgroundColor: "#041A44" }}></div>
                                <span className="text-sm font-medium text-gray-900">
                                  {formatDate(violation.date || violation.createdAt || new Date().toISOString())}
                                </span>
                              </div>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-orange-100 text-orange-800">
                                {violation.violationType || "Behavior"}
                              </span>
                            </td>
                            <td className="px-6 py-4">
                              <span className="text-sm text-gray-900">{violation.violation || violation.description || "N/A"}</span>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <span className="text-sm text-gray-900">
                                {violation.managedByName || violation.approverName || "N/A"}
                              </span>
                            </td>
                            <td className="px-6 py-4">
                              <span className="text-sm text-gray-900">{violation.notes || violation.additionalNotes || "N/A"}</span>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <span
                                className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-semibold ${statusMeta.className}`}
                              >
                                {renderStatusIcon(statusMeta.icon)}
                                {statusMeta.label}
                              </span>
                            </td>
                          </tr>
                        )
                      })}
                    </tbody>
                  </table>
                </div>

                {/* Mobile Detail Modal */}
                {selectedViolation && (
                  <div
                    className="fixed inset-0 backdrop-blur-md z-50 flex items-center justify-center p-4 md:hidden"
                    onClick={() => setSelectedViolation(null)}
                  >
                    <div
                      className="bg-white rounded-lg shadow-xl w-full max-w-md max-h-[90vh] overflow-y-auto"
                      onClick={(e) => e.stopPropagation()}
                    >
                      <div
                        className="sticky top-0 px-4 py-3 flex items-center justify-between rounded-t-lg"
                        style={{
                          background: "linear-gradient(135deg, #001F54, #004AAD)",
                          boxShadow: "0 2px 8px rgba(0, 0, 0, 0.2)",
                        }}
                      >
                        <h3 className="text-base font-bold text-white">Violation Details</h3>
                        <button
                          onClick={() => setSelectedViolation(null)}
                          className="text-white hover:text-gray-200 transition-colors"
                        >
                          <X className="w-5 h-5" />
                        </button>
                      </div>
                      <div className="p-3 grid grid-cols-2 gap-1.5">
                        {(() => {
                          const formatDate = (dateString: string) => {
                            try {
                              const date = new Date(dateString)
                              return date.toLocaleDateString("en-US", {
                                year: "numeric",
                                month: "long",
                                day: "numeric",
                              })
                            } catch {
                              return dateString
                            }
                          }

                          const statusMeta = getStatusMeta(selectedViolation.status)

                          return (
                            <>
                              <div className="bg-gray-50 rounded-lg p-1.5 border border-gray-200">
                                <p className="text-xs text-gray-500 mb-0.5 flex items-center">
                                  <Calendar className="w-3 h-3 mr-1.5" />
                                  Date
                                </p>
                                <p className="text-sm font-medium text-gray-900">
                                  {formatDate(selectedViolation.date || selectedViolation.createdAt || new Date().toISOString())}
                                </p>
                              </div>
                              <div className="bg-gray-50 rounded-lg p-1.5 border border-gray-200">
                                <p className="text-xs text-gray-500 mb-0.5 flex items-center">
                                  <Tag className="w-3 h-3 mr-1.5" />
                                  Type of Violation
                                </p>
                                <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-orange-100 text-orange-800">
                                  {selectedViolation.violationType || "Behavior"}
                                </span>
                              </div>
                              <div className="bg-gray-50 rounded-lg p-1.5 border border-gray-200 col-span-2">
                                <p className="text-xs text-gray-500 mb-0.5 flex items-center">
                                  <FileText className="w-3 h-3 mr-1.5" />
                                  Description
                                </p>
                                <p className="text-sm text-gray-900">
                                  {selectedViolation.violation || selectedViolation.description || "N/A"}
                                </p>
                              </div>
                              <div className="bg-gray-50 rounded-lg p-1.5 border border-gray-200">
                                <p className="text-xs text-gray-500 mb-0.5 flex items-center">
                                  <User className="w-3 h-3 mr-1.5" />
                                  Managed By
                                </p>
                                <p className="text-sm text-gray-900">
                                  {selectedViolation.managedByName || selectedViolation.approverName || "N/A"}
                                </p>
                              </div>
                              <div className="bg-gray-50 rounded-lg p-1.5 border border-gray-200">
                                <p className="text-xs text-gray-500 mb-0.5 flex items-center">
                                  <CircleCheck className="w-3 h-3 mr-1.5" />
                                  Status
                                </p>
                                <span
                                  className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-semibold ${statusMeta.className}`}
                                >
                                  {renderStatusIcon(statusMeta.icon)}
                                  {statusMeta.label}
                                </span>
                              </div>
                              <div className="bg-gray-50 rounded-lg p-1.5 border border-gray-200 col-span-2">
                                <p className="text-xs text-gray-500 mb-0.5 flex items-center">
                                  <List className="w-3 h-3 mr-1.5" />
                                  Additional Notes
                                </p>
                                <p className="text-sm text-gray-900">
                                  {selectedViolation.notes || selectedViolation.additionalNotes || "N/A"}
                                </p>
                              </div>
                            </>
                          )
                        })()}
                      </div>
                    </div>
                  </div>
                )}
              </>
            )}
          </div>
        </div>
      </main>

      <Footer />
    </div>
  )
}




