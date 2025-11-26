"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { AuthenticatedHeader } from "@/components/authenticated-header"
import { Footer } from "@/components/footer"
import { FileText, Lock, Edit, LogOut, Calendar, BookOpen } from "lucide-react"
import Image from "next/image"

export default function ProfilePage() {
  const router = useRouter()
  const [user, setUser] = useState<any>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [joinDate, setJoinDate] = useState<string>("")
  const [lastLogin, setLastLogin] = useState<string>("")

  useEffect(() => {
    // Check if user is logged in
    const currentUser = localStorage.getItem("currentUser")
    if (!currentUser) {
      router.push("/login")
      return
    }

    const userData = JSON.parse(currentUser)
    
    // Fetch fresh user data from database to ensure we have the latest profile
    const fetchFreshUserData = async () => {
      try {
        const response = await fetch(`/api/users/${userData.id}`)
        const data = await response.json()
        
        if (data.ok && data.user) {
          // Update localStorage with fresh data
          localStorage.setItem("currentUser", JSON.stringify(data.user))
          setUser(data.user)
        } else {
          // Fallback to localStorage data if API fails
          setUser(userData)
        }
      } catch (error) {
        console.error("Error fetching fresh user data:", error)
        // Fallback to localStorage data if API fails
        setUser(userData)
      }
    }

    fetchFreshUserData()

    // Set up real-time profile update listener
    const handleProfileUpdate = async (event: CustomEvent) => {
      const updatedUser = event.detail
      if (updatedUser && updatedUser.id === userData.id) {
        console.log("Profile updated via event, refreshing...")
        // Update localStorage and state
        localStorage.setItem("currentUser", JSON.stringify(updatedUser))
        setUser(updatedUser)
      }
    }

    // Listen for profile update events (when admin approves profile changes)
    window.addEventListener("userProfileUpdated", handleProfileUpdate as EventListener)

    // Set up periodic polling to check for profile updates (every 5 seconds)
    const pollInterval = setInterval(async () => {
      try {
        const response = await fetch(`/api/users/${userData.id}`)
        const data = await response.json()
        
        if (data.ok && data.user) {
          const currentUser = localStorage.getItem("currentUser")
          if (currentUser) {
            const currentUserData = JSON.parse(currentUser)
            // Check if any profile fields have changed
            const hasChanges = 
              currentUserData.firstName !== data.user.firstName ||
              currentUserData.lastName !== data.user.lastName ||
              currentUserData.email !== data.user.email ||
              currentUserData.section !== data.user.section ||
              currentUserData.strand !== data.user.strand ||
              currentUserData.course !== data.user.course ||
              currentUserData.yearLevel !== data.user.yearLevel

            if (hasChanges) {
              console.log("Profile changes detected, updating...")
              localStorage.setItem("currentUser", JSON.stringify(data.user))
              setUser(data.user)
              // Dispatch event for other tabs/components
              window.dispatchEvent(new CustomEvent("userProfileUpdated", { detail: data.user }))
            }
          }
        }
      } catch (error) {
        console.error("Error polling for profile updates:", error)
      }
    }, 5000) // Poll every 5 seconds

    // Listen for storage changes (cross-tab communication)
    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === "currentUser" && e.newValue) {
        try {
          const updatedUser = JSON.parse(e.newValue)
          if (updatedUser.id === userData.id) {
            console.log("Profile updated via storage event, refreshing...")
            setUser(updatedUser)
          }
        } catch (error) {
          console.error("Error parsing storage event:", error)
        }
      } else if (e.key === "profileUpdateTrigger" && e.newValue) {
        // Profile update trigger detected, fetch fresh data
        try {
          const trigger = JSON.parse(e.newValue)
          if (trigger.userId === userData.id) {
            console.log("Profile update trigger detected, fetching fresh data...")
            fetchFreshUserData()
          }
        } catch (error) {
          console.error("Error parsing profile update trigger:", error)
        }
      }
    }

    window.addEventListener("storage", handleStorageChange)
    
    // Also listen for profileUpdateTrigger in the same tab (using custom event)
    const handleProfileUpdateTrigger = () => {
      const trigger = localStorage.getItem("profileUpdateTrigger")
      if (trigger) {
        try {
          const triggerData = JSON.parse(trigger)
          if (triggerData.userId === userData.id) {
            console.log("Profile update trigger detected in same tab, fetching fresh data...")
            fetchFreshUserData()
          }
        } catch (error) {
          console.error("Error parsing profile update trigger:", error)
        }
      }
    }
    
    // Check for profile updates periodically (also checks for trigger)
    const triggerCheckInterval = setInterval(() => {
      handleProfileUpdateTrigger()
    }, 1000) // Check every second for triggers

    // Get join date from localStorage or set default
    const storedJoinDate = localStorage.getItem(`joinDate_${userData.id}`)
    if (storedJoinDate) {
      setJoinDate(storedJoinDate)
    } else {
      // Set join date to current date if not exists
      const date = new Date()
      const formattedDate = date.toLocaleDateString("en-US", {
        year: "numeric",
        month: "long",
        day: "numeric",
      })
      setJoinDate(formattedDate)
      localStorage.setItem(`joinDate_${userData.id}`, formattedDate)
    }

    // Get last login from localStorage or set default
    const storedLastLogin = localStorage.getItem(`lastLogin_${userData.id}`)
    if (storedLastLogin) {
      setLastLogin(storedLastLogin)
    } else {
      // Set last login to current date/time if not exists
      const date = new Date()
      const formattedDateTime = date.toLocaleString("en-US", {
        year: "numeric",
        month: "long",
        day: "numeric",
        hour: "numeric",
        minute: "2-digit",
        hour12: true,
      })
      setLastLogin(formattedDateTime)
      localStorage.setItem(`lastLogin_${userData.id}`, formattedDateTime)
    }

    // Update last login on page visit
    const date = new Date()
    const formattedDateTime = date.toLocaleString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "numeric",
      minute: "2-digit",
      hour12: true,
    })
    localStorage.setItem(`lastLogin_${userData.id}`, formattedDateTime)
    setLastLogin(formattedDateTime)

    setIsLoading(false)

    // Cleanup function
    return () => {
      window.removeEventListener("userProfileUpdated", handleProfileUpdate as EventListener)
      window.removeEventListener("storage", handleStorageChange)
      clearInterval(pollInterval)
      clearInterval(triggerCheckInterval)
    }
  }, [router])

  const handleLogout = () => {
    localStorage.removeItem("currentUser")
    localStorage.removeItem("rememberMe")
    router.push("/login")
  }

  const handleEditProfileClick = () => {
    router.push("/profile/edit")
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen" style={{ fontFamily: "'Inter', sans-serif" }}>
        Loading...
      </div>
    )
  }

  const userInitials = (user?.firstName?.[0] || "U") + (user?.lastName?.[0] || "")
  const fullName = `${user?.firstName || ""} ${user?.lastName || ""}`.trim() || "N/A"

  // Format year level
  const formatYearLevel = () => {
    const yearLevel = user?.yearLevel
    
    if (!yearLevel) return "N/A"
    
    // If yearLevel is already a formatted string (e.g., "Grade 1", "1st Year"), remove "Grade" if present
    if (typeof yearLevel === "string") {
      return yearLevel.replace(/^Grade\s+/i, "")
    }
    
    // Legacy support for numeric year levels
    if (typeof yearLevel === "number") {
      // For College (year levels 13-16)
      if (yearLevel >= 13 && yearLevel <= 16) {
        const yearNum = yearLevel - 12
        let suffix = "th"
        if (yearNum === 1) suffix = "st"
        else if (yearNum === 2) suffix = "nd"
        else if (yearNum === 3) suffix = "rd"
        return `${yearNum}${suffix} Year`
      } else {
        return `${yearLevel}`
      }
    }
    
    return "N/A"
  }

  // Format department and year level display
  const formatDepartmentYear = () => {
    const department = user?.department || "N/A"
    const yearLevel = user?.yearLevel
    
    if (!yearLevel) return department
    
    if (yearLevel >= 13 && yearLevel <= 16) {
      const yearNum = yearLevel - 12
      let suffix = "th"
      if (yearNum === 1) suffix = "st"
      else if (yearNum === 2) suffix = "nd"
      else if (yearNum === 3) suffix = "rd"
      return `${department} • ${yearNum}${suffix} Year`
    } else {
      // Handle both string and number year levels
      let yearDisplay = ""
      if (typeof yearLevel === "string") {
        yearDisplay = yearLevel.replace(/^Grade\s+/i, "")
      } else {
        yearDisplay = `${yearLevel}`
      }
      return `${department} • ${yearDisplay}`
    }
  }

  // Format member since date
  const formatMemberSince = () => {
    if (!joinDate) return "Oct 2025"
    const date = new Date(joinDate)
    return date.toLocaleDateString("en-US", { month: "short", year: "numeric" })
  }

  return (
    <div className="min-h-screen flex flex-col bg-white" style={{ fontFamily: "'Inter', sans-serif" }}>
      <AuthenticatedHeader userName={user?.firstName} userInitials={userInitials} useLandingPageStylingMobileOnly={true} />

      {/* Main Content */}
      <main className="flex-1 pt-12 sm:pt-16 pb-20 sm:pb-32 px-3 sm:px-4">
        <div className="max-w-7xl mx-auto">
          {/* Two-Column Layout */}
          <div className="flex flex-col lg:flex-row items-start space-y-4 sm:space-y-6 lg:space-y-0 lg:space-x-6">
            {/* Left Column - Profile Summary Card */}
            <div className="w-full lg:w-96 bg-white rounded-xl sm:rounded-2xl shadow-md border-l-4 border-[#1D3557] p-4 sm:p-6 min-h-0 sm:min-h-[600px]">
              {/* Profile Picture */}
              <div className="w-20 h-20 sm:w-32 sm:h-32 bg-gray-100 rounded-full flex items-center justify-center mb-4 sm:mb-6 mx-auto border-2 border-white shadow-md overflow-hidden">
                {user?.profilePicture ? (
                  <Image
                    src={user.profilePicture}
                    alt="Profile"
                    width={128}
                    height={128}
                    className="w-full h-full object-cover rounded-full"
                  />
                ) : (
                  <BookOpen className="w-10 h-10 sm:w-16 sm:h-16 text-gray-400" />
                )}
              </div>

              {/* User Name */}
              <h1 className="text-lg sm:text-2xl font-bold text-[#212529] text-center mb-1.5 sm:mb-2">
                {fullName}
              </h1>

              {/* Department and Year Level */}
              <p className="text-[#495057] text-center mb-4 sm:mb-6 text-xs sm:text-sm">
                {formatDepartmentYear()}
              </p>

              {/* Status Badges */}
              <div className="flex flex-row justify-center gap-1.5 sm:gap-2 mb-4 sm:mb-6 flex-wrap">
                <div className="rounded-xl px-2 sm:px-2.5 py-0.5 sm:py-1 text-[10px] sm:text-xs font-semibold bg-[#E8F5E9] text-[#2E7D32] flex items-center">
                  <div className="w-1.5 h-1.5 bg-green-600 rounded-full mr-1.5 sm:mr-2"></div>
                  <span>Active Account</span>
                </div>
                <div className="rounded-xl px-2 sm:px-2.5 py-0.5 sm:py-1 text-[10px] sm:text-xs font-semibold bg-gray-100 text-gray-700 flex items-center">
                  <Calendar className="w-2.5 h-2.5 sm:w-3 sm:h-3 text-gray-600 mr-1.5 sm:mr-2" />
                  <span>Member since {formatMemberSince()}</span>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="space-y-1 sm:space-y-1.5">
                <button
                  onClick={handleEditProfileClick}
                  className="w-full bg-[#0B1E45] text-white px-3 sm:px-4 py-2 sm:py-3 rounded-lg flex items-center justify-center font-medium hover:bg-[#254B82] transition-colors text-sm sm:text-base"
                >
                  <Edit className="w-3.5 h-3.5 sm:w-4 sm:h-4 mr-1.5 sm:mr-2" />
                  Edit Profile
                </button>
                <button
                  onClick={handleLogout}
                  className="w-full bg-transparent text-[#C62828] border border-[#C62828] px-3 sm:px-4 py-2 sm:py-3 rounded-lg flex items-center justify-center font-medium hover:bg-[#C62828] hover:text-white transition-colors text-sm sm:text-base mt-2 sm:mt-2.5"
                >
                  <LogOut className="w-3.5 h-3.5 sm:w-4 sm:h-4 mr-1.5 sm:mr-2" />
                  Logout
                </button>
              </div>
            </div>

            {/* Right Column - Information Cards */}
            <div className="flex-1 w-full lg:w-auto space-y-4 sm:space-y-6">
              {/* Personal Information Card */}
              <div className="bg-white rounded-xl sm:rounded-2xl shadow-md border-l-4 border-[#1D3557] p-4 sm:p-6 transition-transform hover:-translate-y-0.5 hover:shadow-lg">
                <div 
                  className="flex items-center -m-4 sm:-m-6 mb-4 sm:mb-6 -mt-4 sm:-mt-6 px-4 sm:px-6 py-3 sm:py-4 rounded-t-xl sm:rounded-t-2xl"
                  style={{ background: "linear-gradient(135deg, #001F54, #004AAD)", boxShadow: "0 4px 10px rgba(0, 0, 0, 0.2)" }}
                >
                  <FileText className="w-4 h-4 sm:w-5 sm:h-5 text-white mr-2 sm:mr-3" />
                  <h2 className="text-base sm:text-xl font-semibold text-white">Personal Information</h2>
                </div>

                <div className="space-y-3 sm:space-y-4">
                  <div className="pb-3 sm:pb-4 border-b border-[#E5E8EC]">
                    <p className="text-[10px] sm:text-xs text-[#495057] uppercase tracking-wide mb-0.5 sm:mb-1">EMAIL</p>
                    <p className="text-sm sm:text-base text-[#212529] font-medium">{user?.email || "N/A"}</p>
                  </div>

                  <div className="pb-3 sm:pb-4 border-b border-[#E5E8EC]">
                    <p className="text-[10px] sm:text-xs text-[#495057] uppercase tracking-wide mb-0.5 sm:mb-1">YEAR LEVEL</p>
                    <p className="text-sm sm:text-base text-[#212529] font-medium">{formatYearLevel()}</p>
                  </div>

                  {user?.section && (
                    <div className="pb-3 sm:pb-4 border-b border-[#E5E8EC]">
                      <p className="text-[10px] sm:text-xs text-[#495057] uppercase tracking-wide mb-0.5 sm:mb-1">SECTION</p>
                      <p className="text-sm sm:text-base text-[#212529] font-medium">{user.section}</p>
                    </div>
                  )}

                  {user?.department === "Senior High School" && user?.strand && (
                    <div className="pb-3 sm:pb-4 border-b border-[#E5E8EC]">
                      <p className="text-[10px] sm:text-xs text-[#495057] uppercase tracking-wide mb-0.5 sm:mb-1">STRAND</p>
                      <p className="text-sm sm:text-base text-[#212529] font-medium">{user.strand}</p>
                    </div>
                  )}

                  {user?.department !== "Elementary" && user?.department !== "Junior High School" && user?.department !== "Senior High School" && user?.course && (
                    <div className="pb-3 sm:pb-4 border-b border-[#E5E8EC]">
                      <p className="text-[10px] sm:text-xs text-[#495057] uppercase tracking-wide mb-0.5 sm:mb-1">COURSE</p>
                      <p className="text-sm sm:text-base text-[#212529] font-medium">{user.course}</p>
                    </div>
                  )}

                  <div>
                    <p className="text-[10px] sm:text-xs text-[#495057] uppercase tracking-wide mb-0.5 sm:mb-1">PROGRAM</p>
                    <p className="text-sm sm:text-base text-[#212529] font-medium">{user?.department || "N/A"}</p>
                  </div>
                </div>
              </div>

              {/* Account Information Card */}
              <div className="bg-white rounded-xl sm:rounded-2xl shadow-md border-l-4 border-[#1D3557] p-4 sm:p-6 transition-transform hover:-translate-y-0.5 hover:shadow-lg">
                <div 
                  className="flex items-center -m-4 sm:-m-6 mb-4 sm:mb-6 -mt-4 sm:-mt-6 px-4 sm:px-6 py-3 sm:py-4 rounded-t-xl sm:rounded-t-2xl"
                  style={{ background: "linear-gradient(135deg, #001F54, #004AAD)", boxShadow: "0 4px 10px rgba(0, 0, 0, 0.2)" }}
                >
                  <Lock className="w-4 h-4 sm:w-5 sm:h-5 text-white mr-2 sm:mr-3" />
                  <h2 className="text-base sm:text-xl font-semibold text-white">Account Information</h2>
                </div>

                <div className="space-y-3 sm:space-y-4">
                  <div className="pb-3 sm:pb-4 border-b border-[#E5E8EC]">
                    <p className="text-[10px] sm:text-xs text-[#495057] uppercase tracking-wide mb-0.5 sm:mb-1">JOINED</p>
                    <p className="text-sm sm:text-base text-[#212529] font-medium">{joinDate || "October 27, 2025"}</p>
                  </div>

                  <div className="pb-3 sm:pb-4 border-b border-[#E5E8EC]">
                    <p className="text-[10px] sm:text-xs text-[#495057] uppercase tracking-wide mb-0.5 sm:mb-1">LAST LOGIN</p>
                    <p className="text-sm sm:text-base text-[#212529] font-medium">{lastLogin || "November 14, 2025 8:48 AM"}</p>
                  </div>

                  <div>
                    <p className="text-[10px] sm:text-xs text-[#495057] uppercase tracking-wide mb-0.5 sm:mb-1">STATUS</p>
                    <p className="text-sm sm:text-base text-green-600 font-medium">Active</p>
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

