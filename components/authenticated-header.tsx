"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { Menu, X, Home, Info, FileText, MessageSquare, User, LogOut } from "lucide-react"
import Image from "next/image"
import { useRouter } from "next/navigation"
import { NotificationMenu } from "@/components/notification-menu"
import { usePresence } from "@/hooks/use-presence"

interface AuthenticatedHeaderProps {
  userName?: string
  userInitials?: string
  hideProfile?: boolean
  useLandingPageStyling?: boolean
  useLandingPageStylingMobileOnly?: boolean
}

export function AuthenticatedHeader({ userName = "User", userInitials = "U", hideProfile = false, useLandingPageStyling = false, useLandingPageStylingMobileOnly = false }: AuthenticatedHeaderProps) {
  const [isOpen, setIsOpen] = useState(false)
  const router = useRouter()
  const [homeHref, setHomeHref] = useState("/basic-education-dashboard")
  const [isBasicEducation, setIsBasicEducation] = useState(false)
  const [profilePicture, setProfilePicture] = useState<string | null>(null)
  const [notifications, setNotifications] = useState<any[]>([])
  const [userId, setUserId] = useState<string | null>(null)
  
  // Track user presence/activity
  usePresence()

  // Fetch notifications
  const fetchNotifications = async (currentUserId: string) => {
    try {
      const response = await fetch(`/api/notifications?userId=${currentUserId}`)
      const data = await response.json()
      if (data.ok && data.notifications) {
        setNotifications(data.notifications)
      }
    } catch (error) {
      console.error("Error fetching notifications:", error)
    }
  }

  useEffect(() => {
    try {
      const raw = localStorage.getItem("currentUser")
      if (raw) {
        const user = JSON.parse(raw)
        const currentUserId = user?.id
        
        if (currentUserId) {
          setUserId(currentUserId)
          // Fetch notifications immediately
          fetchNotifications(currentUserId)
        }
        
        // Load profile picture if exists
        if (user?.profilePicture) {
          setProfilePicture(user.profilePicture)
        }
        
        if (user?.role === "admin") {
          setHomeHref("/admin")
          setIsBasicEducation(false)
          return
        }
        const isBasicEd =
          user?.department === "Elementary" ||
          user?.department === "Junior High School" ||
          user?.department === "Senior High School"
        setIsBasicEducation(isBasicEd)
        
        if (user?.department === "College") {
          setHomeHref("/college-dashboard")
        } else if (isBasicEd) {
          setHomeHref("/basic-education-dashboard")
        } else {
          setHomeHref("/basic-education-dashboard") // Default to basic education dashboard
        }
      }
    } catch {
      // ignore parse errors and keep default
      setHomeHref("/basic-education-dashboard")
    }
    
    // Listen for storage changes to update profile picture when it's changed
    const handleStorageChange = () => {
      try {
        const raw = localStorage.getItem("currentUser")
        if (raw) {
          const user = JSON.parse(raw)
          if (user?.profilePicture) {
            setProfilePicture(user.profilePicture)
          } else {
            setProfilePicture(null)
          }
        }
      } catch {
        // ignore parse errors
      }
    }
    
    // Listen for custom event when profile picture is updated
    window.addEventListener("storage", handleStorageChange)
    window.addEventListener("profilePictureUpdated", handleStorageChange)
    
    return () => {
      window.removeEventListener("storage", handleStorageChange)
      window.removeEventListener("profilePictureUpdated", handleStorageChange)
    }
  }, [])

  // Poll for new notifications every 5 seconds
  useEffect(() => {
    if (!userId) return

    const interval = setInterval(() => {
      fetchNotifications(userId)
    }, 5000)

    // Also listen for custom events that might trigger notification updates
    const handleNotificationUpdate = () => {
      fetchNotifications(userId)
    }

    window.addEventListener("notificationUpdate", handleNotificationUpdate)
    window.addEventListener("announcementCreated", handleNotificationUpdate)

    return () => {
      clearInterval(interval)
      window.removeEventListener("notificationUpdate", handleNotificationUpdate)
      window.removeEventListener("announcementCreated", handleNotificationUpdate)
    }
  }, [userId])

  const handleLogout = () => {
    localStorage.removeItem("currentUser")
    localStorage.removeItem("rememberMe")
    router.push("/")
  }

  return (
    <header className="sticky top-0 z-50 w-full" style={{ backgroundColor: "#041A44" }}>
      <div className="w-full px-4 sm:px-6 lg:px-12">
        <div className={`${useLandingPageStyling ? 'h-16 sm:h-[4.5rem] md:h-20' : 'h-16 md:h-20'} flex items-center justify-between relative`} {...(useLandingPageStyling && { suppressHydrationWarning: true })}>
          {/* Logo and Brand */}
          <div 
            className={`flex items-center ${
              useLandingPageStyling 
                ? 'gap-0 ml-0 sm:ml-2 md:ml-12 lg:ml-32 xl:ml-40 md:gap-1 min-w-0 flex-1' 
                : useLandingPageStylingMobileOnly
                ? 'gap-0 sm:gap-1 ml-0 sm:ml-2 md:ml-12 lg:ml-32 xl:ml-40 min-w-0 flex-1 sm:cursor-default sm:select-none'
                : 'gap-1 ml-2 md:ml-12 lg:ml-32 xl:ml-40 md:gap-1 cursor-default select-none'
            }`}
            suppressHydrationWarning
          >
            <Image
              src="/images/logo-icon.png"
              alt="ConsolatrixConnect"
              width={115}
              height={115}
              className={`flex-shrink-0 ${
                useLandingPageStyling 
                  ? 'w-[72px] h-[72px] sm:w-16 sm:h-16 md:w-20 md:h-20 lg:w-24 lg:h-24 xl:w-24 xl:h-24 object-contain' 
                  : useLandingPageStylingMobileOnly
                  ? 'w-[72px] h-[72px] sm:w-10 sm:h-10 md:w-20 md:h-20 lg:w-24 lg:h-24 xl:w-24 xl:h-24 object-contain sm:pointer-events-none'
                  : 'pointer-events-none w-10 h-10 md:w-20 md:h-20 lg:w-24 lg:h-24 xl:w-24 xl:h-24 md:object-contain'
              }`}
            />
            <span 
              className={`text-white font-bold whitespace-nowrap truncate ${
                useLandingPageStyling 
                  ? 'text-base sm:text-base md:text-xl lg:text-2xl -ml-1 sm:-ml-1.5 md:-ml-2' 
                  : useLandingPageStylingMobileOnly
                  ? 'text-base sm:text-lg md:text-xl lg:text-2xl -ml-1 sm:-ml-0 sm:hidden md:inline md:-ml-2'
                  : 'text-sm sm:text-lg md:text-xl lg:text-2xl hidden sm:inline md:-ml-2'
              }`}
              style={{ fontFamily: "'Inter', sans-serif" }}
              suppressHydrationWarning
            >ConsolatrixConnect</span>
          </div>

          {/* Desktop Navigation - Centered */}
          <nav className="hidden md:flex absolute left-1/2 transform -translate-x-1/2 items-center gap-12">
            <Link href={homeHref} className="text-white hover:text-blue-300 transition text-lg" style={{ fontFamily: "'Inter', sans-serif" }}>
              Home
            </Link>
            <Link href="/about-us" className="text-white hover:text-blue-300 transition text-lg" style={{ fontFamily: "'Inter', sans-serif" }}>
              About us
            </Link>
            <Link href="/records" className="text-white hover:text-blue-300 transition text-lg" style={{ fontFamily: "'Inter', sans-serif" }}>
              Records
            </Link>
            <Link href="/chats" className="text-white hover:text-blue-300 transition text-lg" style={{ fontFamily: "'Inter', sans-serif" }}>
              Chats
            </Link>
          </nav>

          {/* User Actions */}
          <div className="hidden md:flex items-center gap-3 ml-auto mr-12 md:mr-32 lg:mr-40">
            <NotificationMenu notifications={notifications} align="end" userId={userId} onNotificationUpdate={() => userId && fetchNotifications(userId)} />
            <Link
              href="/profile"
              className="w-8 h-8 rounded-full flex items-center justify-center text-white text-sm font-semibold hover:opacity-80 transition cursor-pointer border border-white overflow-hidden"
              style={{ backgroundColor: profilePicture ? "transparent" : "#60A5FA" }}
            >
              {profilePicture ? (
                <Image
                  src={profilePicture}
                  alt="Profile"
                  width={32}
                  height={32}
                  className="w-full h-full object-cover rounded-full"
                />
              ) : (
                userInitials
              )}
            </Link>
          </div>

          {/* Mobile Actions - Notification and Menu */}
          <div className="flex items-center gap-2 md:hidden">
            <NotificationMenu notifications={notifications} align="end" userId={userId} onNotificationUpdate={() => userId && fetchNotifications(userId)} />
            <button onClick={() => setIsOpen(!isOpen)} className="text-white p-2 z-10" aria-label="Toggle menu">
              {isOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {isOpen && (
          <div className="md:hidden pb-3">
            <div className="grid grid-cols-3 gap-1.5 mb-2">
              <Link 
                href={homeHref} 
                className="flex flex-col items-center justify-center gap-1 text-white hover:bg-white/10 transition-all duration-200 rounded-lg py-2 px-1 border border-white/20 hover:border-white/40"
                style={{ fontFamily: "'Inter', sans-serif" }}
                onClick={() => setIsOpen(false)}
              >
                <Home className="w-4 h-4" />
                <span className="text-[10px] font-medium">Home</span>
              </Link>
              <Link 
                href="/about-us" 
                className="flex flex-col items-center justify-center gap-1 text-white hover:bg-white/10 transition-all duration-200 rounded-lg py-2 px-1 border border-white/20 hover:border-white/40"
                style={{ fontFamily: "'Inter', sans-serif" }}
                onClick={() => setIsOpen(false)}
              >
                <Info className="w-4 h-4" />
                <span className="text-[10px] font-medium">About us</span>
              </Link>
              <Link 
                href="/records" 
                className="flex flex-col items-center justify-center gap-1 text-white hover:bg-white/10 transition-all duration-200 rounded-lg py-2 px-1 border border-white/20 hover:border-white/40"
                style={{ fontFamily: "'Inter', sans-serif" }}
                onClick={() => setIsOpen(false)}
              >
                <FileText className="w-4 h-4" />
                <span className="text-[10px] font-medium">Records</span>
              </Link>
              <Link 
                href="/chats" 
                className="flex flex-col items-center justify-center gap-1 text-white hover:bg-white/10 transition-all duration-200 rounded-lg py-2 px-1 border border-white/20 hover:border-white/40"
                style={{ fontFamily: "'Inter', sans-serif" }}
                onClick={() => setIsOpen(false)}
              >
                <MessageSquare className="w-4 h-4" />
                <span className="text-[10px] font-medium">Chats</span>
              </Link>
              <Link 
                href="/profile" 
                className="flex flex-col items-center justify-center gap-1 text-white hover:bg-white/10 transition-all duration-200 rounded-lg py-2 px-1 border border-white/20 hover:border-white/40"
                style={{ fontFamily: "'Inter', sans-serif" }}
                onClick={() => setIsOpen(false)}
              >
                <User className="w-4 h-4" />
                <span className="text-[10px] font-medium">Profile</span>
              </Link>
            </div>
            <button
              onClick={handleLogout}
              className="w-full flex items-center justify-center gap-1.5 px-3 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-all duration-200 font-medium text-xs shadow-md hover:shadow-lg"
            >
              <LogOut className="w-3.5 h-3.5" />
              Logout
            </button>
          </div>
        )}
      </div>
    </header>
  )
}
