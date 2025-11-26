"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { AdminHeader, type AdminNavItem } from "@/components/admin/header"
import { Footer } from "@/components/footer"
import { FileText, Lock, LogOut, Calendar, Megaphone, LayoutDashboard, MessageSquare, Eye, Upload } from "lucide-react"
import Image from "next/image"

const navItems: AdminNavItem[] = [
  {
    id: "dashboard",
    label: "Dashboard",
    icon: LayoutDashboard,
    href: "/admin?tab=dashboard",
  },
  {
    id: "announcements",
    label: "Announcements",
    icon: Megaphone,
    href: "/admin",
  },
  {
    id: "overview",
    label: "Overview",
    icon: Eye,
    href: "/admin?tab=overview",
  },
  {
    id: "chat",
    label: "Chat",
    icon: MessageSquare,
    href: "/admin?tab=chat",
  },
]

export default function AdminProfilePage() {
  const router = useRouter()
  const [user, setUser] = useState<any>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [joinDate, setJoinDate] = useState<string>("")
  const [lastLogin, setLastLogin] = useState<string>("")
  const [notifications, setNotifications] = useState<any[]>([])

  // Fetch notifications
  const fetchNotifications = async (adminId: string) => {
    try {
      const response = await fetch(`/api/notifications?userId=${adminId}`)
      const data = await response.json()
      if (data.ok && data.notifications) {
        setNotifications(data.notifications)
      }
    } catch (error) {
      console.error("Error fetching notifications:", error)
    }
  }

  useEffect(() => {
    const currentUser = localStorage.getItem("currentUser")
    if (!currentUser) {
      router.push("/login")
      return
    }

    const userData = JSON.parse(currentUser)
    if (userData?.role !== "admin") {
      router.push("/profile")
      return
    }

    setUser(userData)

    const storedJoinDate = localStorage.getItem(`joinDate_${userData.id}`)
    if (storedJoinDate) {
      setJoinDate(storedJoinDate)
    } else {
      const date = new Date()
      const formattedDate = date.toLocaleDateString("en-US", {
        year: "numeric",
        month: "long",
        day: "numeric",
      })
      setJoinDate(formattedDate)
      localStorage.setItem(`joinDate_${userData.id}`, formattedDate)
    }

    const storedLastLogin = localStorage.getItem(`lastLogin_${userData.id}`)
    if (storedLastLogin) {
      setLastLogin(storedLastLogin)
    } else {
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
  }, [router])

  // Poll for new notifications every 5 seconds
  useEffect(() => {
    if (!user?.id) return

    // Fetch immediately
    fetchNotifications(user.id)

    const interval = setInterval(() => {
      fetchNotifications(user.id)
    }, 5000)

    // Also listen for custom events that might trigger notification updates
    const handleNotificationUpdate = () => {
      fetchNotifications(user.id)
    }

    window.addEventListener("notificationUpdate", handleNotificationUpdate)
    window.addEventListener("announcementCreated", handleNotificationUpdate)

    return () => {
      clearInterval(interval)
      window.removeEventListener("notificationUpdate", handleNotificationUpdate)
      window.removeEventListener("announcementCreated", handleNotificationUpdate)
    }
  }, [user?.id])

  const handleLogout = () => {
    localStorage.removeItem("currentUser")
    localStorage.removeItem("rememberMe")
    router.push("/login")
  }

  const handleEditProfileClick = () => {
    router.push("/admin/profile/upload")
  }

  const handleTabChange = (tabId: AdminNavItem["id"]) => {
    const navItem = navItems.find((item) => item.id === tabId)
    if (navItem?.href) {
      router.push(navItem.href)
    }
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen" style={{ fontFamily: "'Inter', sans-serif" }}>
        Loading...
      </div>
    )
  }

  const fullName = `${user?.firstName || ""} ${user?.lastName || ""}`.trim() || "N/A"

  return (
    <div className="min-h-screen flex flex-col bg-[#f5f7fb]">
      <AdminHeader
        navItems={navItems}
        activeNavId={undefined}
        onSelectNav={handleTabChange}
        userName={user?.firstName || "Admin"}
        notifications={notifications}
        userId={user?.id || null}
        onNotificationUpdate={() => user?.id && fetchNotifications(user.id)}
        onProfileClick={() => router.push("/admin/profile")}
      />

      <main className="flex-1 pt-6 sm:pt-10 pb-14 sm:pb-20 px-3 sm:px-5 lg:px-8">
        <div className="max-w-4xl sm:max-w-5xl lg:max-w-7xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 sm:gap-6">
            <div className="lg:col-span-1 space-y-4">
              {/* Mobile card */}
              <div className="block sm:hidden bg-white rounded-2xl shadow-md border-l-4 border-[#1D3557] p-4 space-y-4">
                <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto border-2 border-white shadow-md overflow-hidden">
                  {user?.profilePicture ? (
                    <Image src={user.profilePicture} alt="Profile" width={80} height={80} className="w-full h-full object-cover rounded-full" />
                  ) : (
                    <Image src="/images/logo-icon.png" alt="Profile" width={60} height={60} className="w-16 h-16 object-contain" />
                  )}
                </div>
                <div>
                  <h1 className="text-lg font-bold text-center text-[#212529] mb-1">{fullName}</h1>
                  <p className="text-xs text-center text-[#495057] mb-4">{user?.department || "N/A"} • {user?.yearLevel || "N/A"}</p>
                  <div className="flex flex-row justify-center gap-2 flex-wrap mb-4">
                    <span className="rounded-xl px-2.5 py-1 text-[10px] font-semibold bg-[#E8F5E9] text-[#2E7D32] flex items-center">
                      <span className="w-1.5 h-1.5 bg-green-600 rounded-full mr-1.5"></span>
                      Active Account
                    </span>
                    <span className="rounded-xl px-2.5 py-1 text-[10px] font-semibold bg-gray-100 text-gray-700 flex items-center">
                      <Calendar className="w-2.5 h-2.5 text-gray-600 mr-1.5" />
                      Member since {joinDate ? new Date(joinDate).toLocaleDateString("en-US", { month: "short", year: "numeric" }) : "Jun 2025"}
                    </span>
                  </div>
                  <div className="space-y-1.5">
                    <button
                      onClick={handleEditProfileClick}
                      className="w-full bg-[#0B1E45] text-white px-4 py-2.5 rounded-lg flex items-center justify-center font-medium hover:bg-[#254B82] transition-colors text-sm"
                    >
                      <Upload className="w-4 h-4 mr-1.5" />
                      Upload Profile Picture
                    </button>
                    <button
                      onClick={handleLogout}
                      className="w-full bg-transparent text-[#C62828] border border-[#C62828] px-4 py-2.5 rounded-lg flex items-center justify-center font-medium hover:bg-[#C62828] hover:text-white transition-colors text-sm"
                    >
                      <LogOut className="w-4 h-4 mr-1.5" />
                      Logout
                    </button>
                  </div>
                </div>
              </div>

              {/* Desktop/Tablet card */}
              <div className="hidden sm:block bg-white rounded-2xl overflow-hidden p-6" style={{ boxShadow: "0 6px 20px rgba(11, 30, 69, 0.12)", borderLeft: "5px solid #0B2154", minHeight: "400px" }}>
                <div className="flex justify-center mb-5">
                  <div className="w-24 h-24 rounded-full bg-white flex items-center justify-center overflow-hidden border border-[#dce4ff] shadow-[0_6px_18px_rgba(5,23,67,0.12)]">
                    {user?.profilePicture ? (
                      <Image
                        src={user.profilePicture}
                        alt="Profile"
                        width={112}
                        height={112}
                        className="w-full h-full object-cover rounded-full"
                      />
                    ) : (
                      <Image
                        src="/images/logo-icon.png"
                        alt="Profile"
                        width={80}
                        height={80}
                        className="w-20 h-20 object-contain"
                      />
                    )}
                  </div>
                </div>

                <h2 className="text-2xl font-extrabold text-[#0B234A] text-center mb-2" style={{ fontFamily: "'Inter', sans-serif" }}>
                  {fullName}
                </h2>

                <p className="text-sm text-gray-500 text-center mb-4 font-medium" style={{ fontFamily: "'Inter', sans-serif", letterSpacing: "0.03em" }}>
                  {user?.department || "N/A"} • {user?.yearLevel || "N/A"}
                </p>

                <div className="flex flex-row gap-2 mb-5 flex-wrap justify-center">
                  <div 
                    className="flex items-center gap-2 shadow-[inset_0_0_0_1px_rgba(0,128,0,0.12)]"
                    style={{
                      borderRadius: "999px",
                      padding: "4px 12px",
                      fontSize: "12px",
                      fontWeight: 600,
                      color: "#0B8A4A",
                      backgroundColor: "#E9F9F1",
                      fontFamily: "'Inter', sans-serif"
                    }}
                  >
                    <div className="w-1.5 h-1.5 bg-green-600 rounded-full flex-shrink-0 shadow-[0_0_6px_rgba(0,128,0,0.4)]"></div>
                    <span>Active Account</span>
                  </div>
                  <div 
                    className="flex items-center gap-2"
                    style={{
                      borderRadius: "999px",
                      padding: "4px 12px",
                      fontSize: "12px",
                      fontWeight: 600,
                      color: "#0B234A",
                      backgroundColor: "#EEF2FF",
                      fontFamily: "'Inter', sans-serif"
                    }}
                  >
                    <Calendar className="w-3.5 h-3.5 flex-shrink-0" style={{ color: "#495057" }} />
                    <span>Member since {joinDate ? new Date(joinDate).toLocaleDateString("en-US", { month: "short", year: "numeric" }) : "Jun 2025"}</span>
                  </div>
                </div>

                <div className="space-y-2">
                  <button
                    onClick={handleEditProfileClick}
                    className="w-full bg-[#081A44] text-white px-4 py-3 rounded-[18px] flex items-center justify-center gap-2 hover:bg-[#102f63] transition-colors font-semibold text-base shadow-[0_18px_36px_rgba(8,26,68,0.35)]"
                    style={{ fontFamily: "'Inter', sans-serif" }}
                  >
                    <Upload className="w-4 h-4" />
                    <span>Upload Profile Picture</span>
                  </button>
                  <button
                    onClick={handleLogout}
                    className="w-full bg-transparent border-2 rounded-[18px] px-4 py-3 flex items-center justify-center gap-2 transition-all group text-sm sm:text-base font-semibold tracking-wide"
                    style={{ 
                      fontFamily: "'Inter', sans-serif",
                      color: "#C62828",
                      borderColor: "#C62828",
                      borderWidth: "2px"
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.backgroundColor = "#C62828"
                      e.currentTarget.style.color = "#FFFFFF"
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.backgroundColor = "transparent"
                      e.currentTarget.style.color = "#C62828"
                    }}
                  >
                    <LogOut 
                      className="w-4 h-4 group-hover:text-white transition-colors" 
                      style={{ color: "inherit" }}
                    />
                    <span>Logout</span>
                  </button>
                </div>
              </div>
            </div>

            <div className="lg:col-span-2 space-y-4 sm:space-y-5">
              {/* Mobile info cards */}
              <div className="space-y-4 sm:hidden">
                <div className="bg-white rounded-xl shadow-md border-l-4 border-[#1D3557] p-4">
                  <div className="flex items-center -m-4 mb-4 -mt-4 px-4 py-3 rounded-t-xl" style={{ background: "linear-gradient(135deg, #001F54, #004AAD)", boxShadow: "0 4px 10px rgba(0, 0, 0, 0.2)" }}>
                    <FileText className="w-4 h-4 text-white mr-2" />
                    <h2 className="text-base font-semibold text-white">Personal Information</h2>
                  </div>
                  <div className="space-y-3">
                    <div className="pb-3 border-b border-[#E5E8EC]">
                      <p className="text-[10px] text-[#495057] uppercase tracking-wide mb-0.5">EMAIL</p>
                      <p className="text-sm text-[#212529] font-medium">{user?.email || "N/A"}</p>
                    </div>
                    <div className="pb-3 border-b border-[#E5E8EC]">
                      <p className="text-[10px] text-[#495057] uppercase tracking-wide mb-0.5">YEAR LEVEL</p>
                      <p className="text-sm text-[#212529] font-medium">{user?.yearLevel || "N/A"}</p>
                    </div>
                    <div>
                      <p className="text-[10px] text-[#495057] uppercase tracking-wide mb-0.5">PROGRAM</p>
                      <p className="text-sm text-[#212529] font-medium">{user?.department || "N/A"}</p>
                    </div>
                  </div>
                </div>

                <div className="bg-white rounded-xl shadow-md border-l-4 border-[#1D3557] p-4">
                  <div className="flex items-center -m-4 mb-4 -mt-4 px-4 py-3 rounded-t-xl" style={{ background: "linear-gradient(135deg, #001F54, #004AAD)", boxShadow: "0 4px 10px rgba(0, 0, 0, 0.2)" }}>
                    <Lock className="w-4 h-4 text-white mr-2" />
                    <h2 className="text-base font-semibold text-white">Account Information</h2>
                  </div>
                  <div className="space-y-3">
                    <div className="pb-3 border-b border-[#E5E8EC]">
                      <p className="text-[10px] text-[#495057] uppercase tracking-wide mb-0.5">JOINED</p>
                      <p className="text-sm text-[#212529] font-medium">{joinDate || "October 27, 2025"}</p>
                    </div>
                    <div className="pb-3 border-b border-[#E5E8EC]">
                      <p className="text-[10px] text-[#495057] uppercase tracking-wide mb-0.5">LAST LOGIN</p>
                      <p className="text-sm text-[#212529] font-medium">{lastLogin || "November 12, 2025 10:47 PM"}</p>
                    </div>
                    <div>
                      <p className="text-[10px] text-[#495057] uppercase tracking-wide mb-0.5">STATUS</p>
                      <p className="text-sm text-green-600 font-medium">Active</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Desktop cards */}
              <div className="hidden sm:block space-y-5">
                <div className="bg-white rounded-[26px] overflow-hidden" style={{ boxShadow: "0 12px 30px rgba(5, 23, 67, 0.12)", borderLeft: "5px solid #0B234A", padding: "18px" }}>
                <div 
                  className="flex items-center text-white"
                  style={{ 
                    background: "linear-gradient(135deg, #041754, #0d3a99)",
                    boxShadow: "0 6px 16px rgba(4, 23, 84, 0.3)",
                    margin: "-18px -18px 18px -18px",
                    padding: "14px 18px",
                    borderRadius: "22px 22px 0 0"
                  }}
                >
                  <FileText className="w-5 h-5 text-white mr-3" />
                  <h3 className="text-base sm:text-lg font-semibold text-white tracking-wide" style={{ fontFamily: "'Inter', sans-serif" }}>
                    Personal Information
                  </h3>
                </div>
                <div className="space-y-4">
                  <div className="pb-4 border-b" style={{ borderColor: "#E5E8EC" }}>
                    <p className="text-xs text-gray-500 uppercase tracking-wide mb-1" style={{ fontFamily: "'Inter', sans-serif" }}>
                      EMAIL
                    </p>
                    <p className="text-base font-medium text-black mt-1" style={{ fontFamily: "'Inter', sans-serif" }}>
                      {user?.email || "N/A"}
                    </p>
                  </div>
                  <div className="pb-4 border-b" style={{ borderColor: "#E5E8EC" }}>
                    <p className="text-xs text-gray-500 uppercase tracking-wide mb-1" style={{ fontFamily: "'Inter', sans-serif" }}>
                      YEAR LEVEL
                    </p>
                    <p className="text-base font-medium text-black mt-1" style={{ fontFamily: "'Inter', sans-serif" }}>
                      {user?.yearLevel || "N/A"}
                    </p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-500 uppercase tracking-wide mb-1" style={{ fontFamily: "'Inter', sans-serif" }}>
                      PROGRAM
                    </p>
                    <p className="text-base font-medium text-black mt-1" style={{ fontFamily: "'Inter', sans-serif" }}>
                      {user?.department || "N/A"}
                    </p>
                  </div>
                </div>

                </div>

                <div className="bg-white rounded-[26px] overflow-hidden" style={{ boxShadow: "0 12px 30px rgba(5, 23, 67, 0.12)", borderLeft: "5px solid #0B234A", padding: "18px" }}>
                  <div 
                    className="flex items-center text-white"
                    style={{ 
                      background: "linear-gradient(135deg, #041754, #0d3a99)",
                      boxShadow: "0 6px 16px rgba(4, 23, 84, 0.3)",
                      margin: "-18px -18px 18px -18px",
                      padding: "14px 18px",
                      borderRadius: "22px 22px 0 0"
                    }}
                  >
                    <Lock className="w-5 h-5 text-white mr-3" />
                    <h3 className="text-base sm:text-lg font-semibold text-white tracking-wide" style={{ fontFamily: "'Inter', sans-serif" }}>
                      Account Information
                    </h3>
                  </div>
                  <div className="space-y-4">
                    <div className="pb-4 border-b" style={{ borderColor: "#E5E8EC" }}>
                      <p className="text-xs text-gray-500 uppercase tracking-wide mb-1" style={{ fontFamily: "'Inter', sans-serif" }}>
                        JOINED
                      </p>
                      <p className="text-base font-medium text-black mt-1" style={{ fontFamily: "'Inter', sans-serif" }}>
                        {joinDate || "October 27, 2025"}
                      </p>
                    </div>
                    <div className="pb-4 border-b" style={{ borderColor: "#E5E8EC" }}>
                      <p className="text-xs text-gray-500 uppercase tracking-wide mb-1" style={{ fontFamily: "'Inter', sans-serif" }}>
                        LAST LOGIN
                      </p>
                      <p className="text-base font-medium text-black mt-1" style={{ fontFamily: "'Inter', sans-serif" }}>
                        {lastLogin || "November 12, 2025 10:47 PM"}
                      </p>
                    </div>
                    <div>
                      <p className="text-xs text-gray-500 uppercase tracking-wide mb-1" style={{ fontFamily: "'Inter', sans-serif" }}>
                        STATUS
                      </p>
                      <p className="text-base font-medium text-green-600 mt-1" style={{ fontFamily: "'Inter', sans-serif" }}>
                        Active
                      </p>
                    </div>
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

