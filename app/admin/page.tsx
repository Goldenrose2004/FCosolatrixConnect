"use client"

import { useEffect, useState, useRef, useCallback, memo } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { usePresence } from "@/hooks/use-presence"
import {
  AlertCircle,
  BookOpen,
  Calendar,
  CheckCircle2,
  ClipboardList,
  Edit,
  GraduationCap,
  LayoutDashboard,
  Megaphone,
  MessageSquare,
  Orbit,
  Paperclip,
  Plus,
  RefreshCw,
  Send,
  Trash2,
  Users,
  Menu,
  Eye,
  X,
  Check,
  Reply,
  Smile,
  MoreVertical,
  Search,
  Building,
  Mail,
  User,
  Settings,
  ChevronDown,
  ArrowLeft,
  Copy,
} from "lucide-react"
import {
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  Legend,
  Line,
  LineChart,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts"
import { AdminHeader, type AdminNavItem } from "@/components/admin/header"

// FontAwesome fa-graduation-cap icon - exact match
function GraduationCapIcon({ size = 20, className = "" }: { size?: number; className?: string }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 640 512"
      fill="currentColor"
      className={className}
    >
      {/* FontAwesome graduation cap - flat top with tassel on right */}
      <path d="M622.34 153.2L343.4 67.5c-15.2-4.67-31.6-4.67-46.79 0L17.66 153.2c-23.54 7.23-23.54 38.36 0 45.59l48.63 14.94c-10.67 13.19-17.23 29.28-17.88 46.9C38.78 266.15 32 276.11 32 288c0 10.78 5.68 19.85 13.86 25.65L20.33 428.53C18.11 438.52 25.71 448 35.94 448h56.11c10.24 0 17.84-9.48 15.62-19.47L82.7 313.65C90.88 307.85 96.55 298.78 96.55 288c0-11.57-6.47-21.25-15.66-26.87.76-15.02 8.44-28.3 20.5-36.72L312.89 190l-60.13-18.5c-19.28-5.93-19.28-37.17 0-43.1l247.15-76c11.12-3.41 23.75-.36 30.75 7.57l11 13.31c4.19 5.07 4.19 12.35 0 17.42l-11 13.31c-4.45 5.39-11.25 8.57-18.38 8.57l-82.51-25.38L622.34 153.2c23.55-7.24 23.55-38.36 0-45.59zM352.79 315.09c-28.53-14.29-51.5-35.14-67.67-57.25L256 192l-29.12 65.84c-16.17 22.11-39.14 42.96-67.67 57.25L352.79 315.09z" />
    </svg>
  )
}

// FontAwesome fa-book-reader icon - exact match (person's head above open book)
function BookReaderIcon({ size = 20, className = "" }: { size?: number; className?: string }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 512 512"
      fill="currentColor"
      className={className}
    >
      {/* FontAwesome book-reader - circle (head) above open book */}
      <path d="M352 96c0-53.02-42.98-96-96-96s-96 42.98-96 96s42.98 96 96 96s96-42.98 96-96zM233.59 241.1c-59.33-36.32-155.43-46.3-203.79-49.05C13.55 191.13 0 203.51 0 219.14v222.8c0 14.33 11.59 26.28 26.49 27.05c43.66 2.29 131.99 10.68 189.04 41.19c9.28 4.9 20.48-1.12 20.48-11.5V252.56c-.01-4.45-2.22-8.72-6.42-11.46zm248.61-49.05c-48.35 2.74-144.46 12.73-203.78 49.05c-4.2 2.74-6.41 7.01-6.41 11.46v245.79c0 10.37 11.2 16.4 20.48 11.5c57.06-30.51 145.38-38.9 189.04-41.19c14.9-.78 26.49-12.73 26.49-27.05V219.14c.01-15.63-13.54-28.01-28.86-27.09z" />
    </svg>
  )
}

// FontAwesome fa-user-graduate icon - exact match (person's head with graduation cap)
function UserGraduateIcon({ size = 20, className = "" }: { size?: number; className?: string }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 448 512"
      fill="currentColor"
      className={className}
    >
      {/* FontAwesome user-graduate - graduation cap with person's head */}
      <path d="M319.4 320.6L224 416l-95.4-95.4C57.1 323.7 0 382.2 0 454.4v9.6c0 26.5 21.5 48 48 48h352c26.5 0 48-21.5 48-48v-9.6c0-72.2-57.1-130.7-128.6-133.8zM13.6 79.8l6.4 1.5v58.4c-7 4.2-12 11.5-12 20.3 0 8.4 4.6 15.4 11.1 19.7L3.5 242c-1.7 6.9 2.1 14 7.6 14h41.8c5.5 0 9.3-7.1 7.6-14l-15.6-62.3C51.4 175.4 56 168.4 56 160c0-8.8-5-16.1-12-20.3V87.1l66 15.9c-8.6 17.2-14 36.4-14 57 0 70.7 57.3 128 128 128s128-57.3 128-128c0-20.6-5.3-39.8-14-57l96.3-23.2c18.2-4.4 18.2-27.1 0-31.5l-190.4-46c-13-3.1-26.7-3.1-39.7 0L13.6 48.2c-18.1 4.4-18.1 27.2 0 31.6z" />
    </svg>
  )
}

// FontAwesome fa-university icon - exact match (classical building with columns and pediment)
function UniversityIcon({ size = 20, className = "" }: { size?: number; className?: string }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 640 512"
      fill="currentColor"
      className={className}
    >
      {/* FontAwesome university - building with columns and triangular pediment */}
      <path d="M48 32C21.5 32 0 53.5 0 80v352c0 26.5 21.5 48 48 48h16v-80H48c-8.8 0-16-7.2-16-16V80c0-8.8 7.2-16 16-16h544c8.8 0 16 7.2 16 16v352c0 8.8-7.2 16-16 16h-16v80h16c26.5 0 48-21.5 48-48V80c0-26.5-21.5-48-48-48H48zm176 400H80v-80h144v80zm224 0H304v-80h144v80zm112-128h-48V128h48v176zm-480 0H48v-48h144v48zm352-96H224v-64h192v64zm-192-96H96v-64h192v64z" />
    </svg>
  )
}

type AnnouncementDraft = {
  title: string
  content: string
}

type AnnouncementRecord = AnnouncementDraft & {
  id: string
  createdAt: string
}

type AnnouncementBroadcastMessage =
  | { type: "created"; announcements: any[] }
  | { type: "updated"; announcement: any }
  | { type: "deleted"; id: string }

type AdminUserSummary = {
  id: string
  firstName: string
  lastName: string
  department: string
  email?: string
  studentId?: string
  yearLevel?: string
  section?: string | null
  strand?: string | null
  course?: string | null
  profilePicture?: string | null
  profilePictureName?: string | null
  avatar?: string
  isOnline?: boolean
  lastActive?: string | null
}

// Removed hardcoded data - now fetched from database

// chatUsers will be loaded from the database

const navItems: AdminNavItem[] = [
  {
    id: "dashboard",
    label: "Dashboard",
    icon: LayoutDashboard,
  },
  {
    id: "announcements",
    label: "Announcements",
    icon: Megaphone,
  },
  {
    id: "overview",
    label: "Overview",
    icon: Eye,
  },
  {
    id: "chat",
    label: "Chat",
    icon: MessageSquare,
  },
]

export default function AdminPage() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const [activeTab, setActiveTab] = useState<AdminNavItem["id"]>("dashboard")
  const [currentUser, setCurrentUser] = useState<{ id?: string; firstName?: string; lastName?: string } | null>(null)
  const [isCheckingAuth, setIsCheckingAuth] = useState(true)
  const [selectedDepartment, setSelectedDepartment] = useState<string | null>(null)
  const [notifications, setNotifications] = useState<any[]>([])
  
  // Track admin presence/activity
  usePresence()

  // Fetch notifications
  const fetchNotifications = async (adminId: string) => {
    try {
      const response = await fetch(`/api/notifications?userId=${adminId}`)
      
      // Check if response is ok before parsing JSON
      if (!response.ok) {
        // Silently fail - don't interrupt user experience
        return
      }
      
      const data = await response.json()
      if (data.ok && data.notifications) {
        setNotifications(data.notifications)
      }
    } catch (error) {
      // Silently fail - network errors are expected if server is temporarily unavailable
      // Don't log to console to avoid cluttering the console
    }
  }

  // Poll for new notifications every 5 seconds
  useEffect(() => {
    if (!currentUser?.id) return

    const userId = currentUser.id

    // Fetch immediately
    fetchNotifications(userId)

    const interval = setInterval(() => {
      if (userId) {
        fetchNotifications(userId)
      }
    }, 5000)

    // Also listen for custom events that might trigger notification updates
    const handleNotificationUpdate = () => {
      if (userId) {
        fetchNotifications(userId)
      }
    }

    window.addEventListener("notificationUpdate", handleNotificationUpdate)
    window.addEventListener("announcementCreated", handleNotificationUpdate)

    return () => {
      clearInterval(interval)
      window.removeEventListener("notificationUpdate", handleNotificationUpdate)
      window.removeEventListener("announcementCreated", handleNotificationUpdate)
    }
  }, [currentUser?.id])

  useEffect(() => {
    const tabParam = searchParams.get("tab") as AdminNavItem["id"] | null
    const deptParam = searchParams.get("department")
    if (tabParam && navItems.some((item) => item.id === tabParam)) {
      setActiveTab(tabParam)
    }
    if (deptParam && ["ELEMENTARY", "JUNIOR HIGH", "SENIOR HIGH", "COLLEGE"].includes(deptParam)) {
      setSelectedDepartment(deptParam)
      if (tabParam !== "records") {
        setActiveTab("records")
      }
    }
  }, [searchParams])

  useEffect(() => {
    const raw = typeof window !== "undefined" ? localStorage.getItem("currentUser") : null
    if (!raw) {
      router.replace("/login")
      return
    }
    try {
      const parsed = JSON.parse(raw)
      if (parsed?.role !== "admin") {
        router.replace("/login")
        return
      }
      setCurrentUser(parsed)
    } catch {
      router.replace("/login")
      return
    } finally {
      setIsCheckingAuth(false)
    }
  }, [router])

  if (isCheckingAuth) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100">
        <div className="flex items-center gap-2 text-[#041A44] font-medium">
          <Orbit className="w-5 h-5 animate-spin" />
          Checking admin access...
        </div>
      </div>
    )
  }

  if (!currentUser) {
    return null
  }

  const handleTabChange = (tabId: AdminNavItem["id"]) => {
    setActiveTab(tabId)
    const params = new URLSearchParams(searchParams?.toString() || "")
    if (tabId === "dashboard") {
      params.delete("tab")
      params.delete("department")
      setSelectedDepartment(null)
    } else {
      params.set("tab", tabId)
      // When switching to a non-records tab, clear department but keep tab param
      if (tabId !== "records") {
        params.delete("department")
        setSelectedDepartment(null)
      }
    }
    const query = params.toString()
    router.replace(query ? `/admin?${query}` : "/admin", { scroll: false })
  }

  const handleDepartmentClick = (department: string) => {
    setSelectedDepartment(department)
    setActiveTab("records")
    const params = new URLSearchParams()
    params.set("tab", "records")
    params.set("department", department)
    router.push(`/admin?${params.toString()}`, { scroll: false })
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <AdminHeader
        navItems={navItems}
        activeNavId={activeTab === "records" ? "dashboard" : activeTab}
        onSelectNav={handleTabChange}
        userName={currentUser.firstName || "Admin"}
        notifications={notifications}
        userId={currentUser.id || null}
        onNotificationUpdate={() => currentUser.id && fetchNotifications(currentUser.id)}
        onProfileClick={() => router.push("/admin/profile")}
      />
      <main className={`mx-auto px-3 md:px-6 py-4 md:py-8 ${activeTab === "records" ? "max-w-full md:max-w-[98%] xl:max-w-[1800px]" : activeTab === "announcements" ? "max-w-full md:max-w-[85rem] xl:max-w-[95rem]" : "max-w-full md:max-w-7xl"}`}>
        {activeTab === "overview" ? (
          <OverviewSection />
        ) : activeTab === "announcements" ? (
          <AnnouncementsSection />
        ) : activeTab === "records" ? (
          <RecordsSection initialDepartment={selectedDepartment} onDepartmentChange={setSelectedDepartment} />
        ) : activeTab === "dashboard" ? (
          <DashboardSection onDepartmentClick={handleDepartmentClick} />
        ) : (
          <ChatSection />
        )}
      </main>
    </div>
  )
}

type PendingProfileEdit = {
  id: string
  studentId: string
  studentName: string
  studentDepartment: string
  studentYearLevel?: string
  currentProfile: {
    firstName: string
    lastName: string
    email?: string
    phone?: string
    address?: string
    department?: string
    yearLevel?: string
    section?: string
    strand?: string
    course?: string
  }
  editedProfile: {
    firstName: string
    lastName: string
    email?: string
    phone?: string
    address?: string
    department?: string
    yearLevel?: string
    section?: string
    strand?: string
    course?: string
  }
  submittedAt: string
}

const OverviewSection = memo(function OverviewSection() {
  const [pendingEdits, setPendingEdits] = useState<PendingProfileEdit[]>([])
  const [selectedEditId, setSelectedEditId] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const isMountedRef = useRef(true)
  const hasLoadedOnceRef = useRef(false)

  const fetchPendingEdits = useCallback(async () => {
    try {
      const response = await fetch("/api/profile-edit-requests?status=pending")
      const data = await response.json()

      if (!isMountedRef.current) {
        return
      }

      if (data.ok && data.requests) {
        const shouldDispatchNotification = hasLoadedOnceRef.current
        setPendingEdits((prev) => {
          const prevIds = new Set(prev.map((edit) => edit.id))
          const hasNewRequest =
            shouldDispatchNotification &&
            data.requests.some((request: PendingProfileEdit) => !prevIds.has(request.id))

          if (hasNewRequest && typeof window !== "undefined") {
            window.dispatchEvent(new CustomEvent("notificationUpdate"))
          }

          return data.requests
        })

        if (!hasLoadedOnceRef.current) {
          hasLoadedOnceRef.current = true
        }
      } else if (isMountedRef.current) {
        setPendingEdits([])
      }
    } catch (error) {
      console.error("Error fetching pending edits:", error)
      if (isMountedRef.current) {
        setPendingEdits([])
      }
    } finally {
      if (isMountedRef.current) {
        setIsLoading(false)
      }
    }
  }, [])

  useEffect(() => {
    isMountedRef.current = true
    fetchPendingEdits()
    const interval = setInterval(() => {
      fetchPendingEdits()
    }, 5000)

    return () => {
      isMountedRef.current = false
      clearInterval(interval)
    }
  }, [fetchPendingEdits])

  useEffect(() => {
    if (!pendingEdits.length) {
      setSelectedEditId(null)
      return
    }
    if (!selectedEditId || !pendingEdits.some((edit) => edit.id === selectedEditId)) {
      setSelectedEditId(pendingEdits[0].id)
    }
  }, [pendingEdits, selectedEditId])

  const buildProfileFieldList = (edit: PendingProfileEdit | null) => {
    if (!edit) return []
    return [
      {
        key: "name",
        label: "Name",
        current: `${edit.currentProfile.firstName} ${edit.currentProfile.lastName}`,
        edited: `${edit.editedProfile.firstName} ${edit.editedProfile.lastName}`,
      },
      { key: "email", label: "Email", current: edit.currentProfile.email, edited: edit.editedProfile.email },
      { key: "phone", label: "Phone", current: edit.currentProfile.phone, edited: edit.editedProfile.phone },
      { key: "address", label: "Address", current: edit.currentProfile.address, edited: edit.editedProfile.address },
      { key: "yearLevel", label: "Year Level", current: edit.currentProfile.yearLevel, edited: edit.editedProfile.yearLevel },
      { key: "section", label: "Section", current: edit.currentProfile.section, edited: edit.editedProfile.section },
      ...(edit.studentDepartment === "Senior High School" && edit.currentProfile.strand
        ? [{ key: "strand", label: "Strand", current: edit.currentProfile.strand, edited: edit.editedProfile.strand }]
        : []),
      ...(edit.studentDepartment !== "Elementary" &&
      edit.studentDepartment !== "Junior High School" &&
      edit.studentDepartment !== "Senior High School" &&
      edit.currentProfile.course
        ? [{ key: "course", label: "Course", current: edit.currentProfile.course, edited: edit.editedProfile.course }]
        : []),
    ].filter((field) => field.current || field.edited)
  }

  const getChangedFieldCount = (edit: PendingProfileEdit) =>
    buildProfileFieldList(edit).filter((field) => field.current !== field.edited).length


  const handleApprove = async (id: string) => {
    if (!id) {
      alert("Invalid request ID")
      return
    }

    try {
      console.log("Approving request with ID:", id)
      const response = await fetch(`/api/profile-edit-requests/${id}/approve`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          reviewedBy: "admin",
        }),
      })

      const data = await response.json()
      console.log("Approve response:", data)

      if (data.ok) {
        // Remove the approved request from the list
        setPendingEdits((prev) => prev.filter((edit) => edit.id !== id))
        
        // If updatedUser is returned, update localStorage for that user (if they're currently logged in)
        if (data.updatedUser) {
          const currentUser = localStorage.getItem("currentUser")
          if (currentUser) {
            const currentUserData = JSON.parse(currentUser)
            // Only update if it's the same user
            if (currentUserData.id === data.updatedUser.id) {
              localStorage.setItem("currentUser", JSON.stringify(data.updatedUser))
              // Dispatch a custom event to notify other components in the same window
              window.dispatchEvent(new CustomEvent("userProfileUpdated", { detail: data.updatedUser }))
              
              // Also trigger a storage event for cross-tab communication
              // We'll use a custom storage key to trigger the event
              localStorage.setItem("profileUpdateTrigger", JSON.stringify({ 
                userId: data.updatedUser.id, 
                timestamp: Date.now() 
              }))
              // Remove it immediately so it can trigger again next time
              setTimeout(() => {
                localStorage.removeItem("profileUpdateTrigger")
              }, 100)
            }
          }
        }
        
        // Dispatch event to refresh chat user list
        window.dispatchEvent(new CustomEvent("profileUpdateTrigger"))
        
        alert("Profile edit request approved successfully! The user's profile has been updated.")
      } else {
        alert(data.error || "Failed to approve profile edit request")
      }
    } catch (error) {
      console.error("Error approving request:", error)
      alert("Failed to approve profile edit request. Please try again.")
    }
  }

  const handleReject = async (id: string) => {
    if (!id) {
      alert("Invalid request ID")
      return
    }

    if (!confirm("Are you sure you want to reject this profile edit request?")) {
      return
    }

    try {
      console.log("Rejecting request with ID:", id)
      const response = await fetch(`/api/profile-edit-requests/${id}/reject`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          reviewedBy: "admin",
        }),
      })

      const data = await response.json()
      console.log("Reject response:", data)

      if (data.ok) {
        // Remove the rejected request from the list
        setPendingEdits((prev) => prev.filter((edit) => edit.id !== id))
      } else {
        alert(data.error || "Failed to reject profile edit request")
      }
    } catch (error) {
      console.error("Error rejecting request:", error)
      alert("Failed to reject profile edit request. Please try again.")
    }
  }

  return (
    <div className="space-y-6">
      {/* Modern Minimalist Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3">
        <div>
          <div className="flex items-center gap-2 md:gap-3 mb-2">
            <div className="h-8 w-8 md:h-10 md:w-10 rounded-lg bg-gradient-to-br from-[#041A44] to-[#004AAD] flex items-center justify-center shadow-md">
              <Eye className="h-4 w-4 md:h-5 md:w-5 text-white" />
            </div>
            <h1 className="text-xl md:text-2xl font-bold text-gray-900">Profile Edit Approvals</h1>
            {pendingEdits.length > 0 && !isLoading && (
              <span className="px-2 py-0.5 md:px-3 md:py-1 rounded-full bg-red-100 text-red-700 text-[10px] md:text-xs font-semibold">
                {pendingEdits.length} Pending
              </span>
            )}
          </div>
          <p className="text-xs md:text-sm text-gray-500 ml-0 md:ml-[52px]">Review and approve student profile changes</p>
        </div>
      </div>

      {/* Main Content */}
      {isLoading ? (
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 md:p-12">
          <div className="text-center">
            <RefreshCw className="mx-auto h-8 w-8 md:h-10 md:w-10 text-[#041A44] mb-4 animate-spin" />
            <p className="text-sm md:text-base font-semibold text-gray-800">Loading pending approvals...</p>
            <p className="text-xs md:text-sm text-gray-500 mt-1">Please wait while we fetch the data</p>
          </div>
        </div>
      ) : pendingEdits.length === 0 ? (
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 md:p-12">
          <div className="text-center">
            <div className="w-12 h-12 md:w-16 md:h-16 rounded-full bg-green-50 flex items-center justify-center mx-auto mb-4">
              <CheckCircle2 className="h-6 w-6 md:h-8 md:w-8 text-green-500" />
            </div>
            <h3 className="text-base md:text-lg font-semibold text-gray-800 mb-1">No Pending Approvals</h3>
            <p className="text-xs md:text-sm text-gray-500">All profile edit requests have been reviewed</p>
          </div>
        </div>
      ) : (
        (() => {
          const selectedEdit =
            pendingEdits.find((edit) => edit.id === selectedEditId) ?? (pendingEdits.length ? pendingEdits[0] : null)
          const selectedFields = buildProfileFieldList(selectedEdit)
          const selectedChangedCount = selectedEdit ? getChangedFieldCount(selectedEdit) : 0

          if (!selectedEdit) {
            return null
          }

          return (
            <div className="flex flex-col lg:flex-row gap-5">
              <div className="lg:w-80 xl:w-96">
                <div className="rounded-3xl border border-gray-200 shadow-sm overflow-hidden bg-white">
                  <div className="bg-gradient-to-r from-[#021442] via-[#073da4] to-[#0a5fdd] px-5 py-4 text-white">
                    <p className="text-sm font-semibold tracking-tight">Pending Approvals</p>
                    <p className="text-xs text-white/80">
                      {pendingEdits.length === 1 ? "1 request" : `${pendingEdits.length} requests`}
                    </p>
                  </div>
                  <div className="bg-[#f2f6ff]">
                    {pendingEdits.map((edit) => {
                      const isActive = edit.id === selectedEdit.id
                      const changes = getChangedFieldCount(edit)
                      return (
                        <button
                          key={edit.id}
                          type="button"
                          onClick={() => setSelectedEditId(edit.id)}
                          className={`relative w-full text-left transition-all px-5 py-4 border-t border-[#dfe6ff] first:border-t-0 ${
                            isActive
                              ? "bg-[#e7f0ff] shadow-[0_8px_24px_rgba(4,26,68,0.12)] ring-1 ring-[#0a5fdd]/40"
                              : "bg-[#f2f6ff]"
                          }`}
                        >
                          {isActive && <span className="absolute left-0 top-0 h-full w-[3px] bg-[#041a44]" />}
                          <div className="flex items-center gap-3">
                            <div className="h-10 w-10 rounded-full flex items-center justify-center font-semibold text-white bg-[#062258]">
                              {edit.studentName
                                .split(" ")
                                .map((n) => n[0])
                                .join("")
                                .substring(0, 2)
                                .toUpperCase()}
                            </div>
                            <div className="min-w-0">
                              <p className="text-sm font-semibold text-[#0b1f47] tracking-tight truncate">{edit.studentName}</p>
                              {edit.studentDepartment && (
                                <p className="text-[11px] text-[#4b5f8f] font-medium truncate">
                                  {edit.studentDepartment}
                                  {edit.studentYearLevel && ` • ${edit.studentYearLevel}`}
                                </p>
                              )}
                            </div>
                          </div>
                          <div className="mt-3 flex items-center gap-2 text-[11px] text-[#1f2a44]">
                            <span className="inline-flex items-center px-2 py-0.5 rounded-full bg-[#ffe0a6] text-[#8f5d00] font-semibold text-[10px]">
                              {changes} change{changes !== 1 ? "s" : ""}
                            </span>
                            <span className="text-[#8a95b5] font-medium">{edit.submittedAt}</span>
                          </div>
                        </button>
                      )
                    })}
                    {pendingEdits.length === 0 && (
                      <div className="px-5 py-6 text-center text-xs text-gray-500 border-t border-gray-100">No requests</div>
                    )}
                  </div>
                </div>
              </div>
              <div className="flex-1 space-y-4">
                <div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden">
                  <div className="bg-gradient-to-r from-gray-50 to-white px-4 md:px-6 py-3 md:py-4 border-b border-gray-100">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 md:gap-3 mb-2">
                          <div className="h-10 w-10 md:h-12 md:w-12 rounded-xl bg-gradient-to-br from-[#041A44] to-[#004AAD] flex items-center justify-center text-white font-bold text-sm md:text-lg shadow-sm">
                            {selectedEdit.studentName
                              .split(" ")
                              .map((n) => n[0])
                              .join("")
                              .substring(0, 2)
                              .toUpperCase()}
                          </div>
                          <div>
                            <h3 className="text-base md:text-lg font-bold text-gray-900">{selectedEdit.studentName}</h3>
                            <p className="text-[10px] md:text-xs text-gray-600 mt-0.5">
                              {selectedEdit.studentDepartment}{" "}
                              {selectedEdit.studentYearLevel && `• ${selectedEdit.studentYearLevel}`}
                            </p>
                          </div>
                        </div>
                        <div className="flex flex-col md:flex-row md:items-center gap-2 md:gap-4 mt-2 text-[10px] md:text-xs text-gray-500">
                          <div className="flex items-center gap-1.5">
                            <Calendar className="h-3 w-3 md:h-3.5 md:w-3.5" />
                            <span>{selectedEdit.submittedAt}</span>
                          </div>
                          <div className="flex items-center gap-1.5">
                            <AlertCircle className="h-3 w-3 md:h-3.5 md:w-3.5 text-amber-500" />
                            <span className="text-amber-600 font-medium">
                              {selectedChangedCount} field{selectedChangedCount !== 1 ? "s" : ""} changed
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="p-4 md:p-6">
                    <div className="space-y-4">
                      {selectedFields.map((field, idx) => {
                        const isChanged = field.current !== field.edited
                        return (
                          <div
                            key={idx}
                            className={`rounded-xl p-3 md:p-4 transition-all ${
                              isChanged ? "bg-amber-50 border-2 border-amber-200" : "bg-gray-50 border border-gray-200"
                            }`}
                          >
                            <div className="flex items-start justify-between gap-2 md:gap-4">
                              <div className="flex-1 min-w-0">
                                <div className="flex flex-wrap items-center gap-1.5 md:gap-2 mb-2">
                                  <span className="text-[10px] md:text-xs font-semibold text-gray-600 uppercase tracking-wide">
                                    {field.label}
                                  </span>
                                  {isChanged && (
                                    <span className="px-1.5 py-0.5 md:px-2 md:py-0.5 rounded-full bg-amber-100 text-amber-700 text-[10px] md:text-xs font-medium">
                                      Changed
                                    </span>
                                  )}
                                </div>
                                <div className="space-y-1.5 md:space-y-2">
                                  {isChanged ? (
                                    <>
                                      <div className="flex items-start gap-1.5 md:gap-2">
                                        <div className="flex-shrink-0 w-12 md:w-16 text-[10px] md:text-xs font-medium text-gray-500 pt-0.5">
                                          From:
                                        </div>
                                        <div className="flex-1 text-xs md:text-sm text-gray-700 line-through opacity-60 break-words">
                                          {field.current || <span className="text-gray-400 italic">Not set</span>}
                                        </div>
                                      </div>
                                      <div className="flex items-start gap-1.5 md:gap-2">
                                        <div className="flex-shrink-0 w-12 md:w-16 text-[10px] md:text-xs font-medium text-[#041A44] pt-0.5">
                                          To:
                                        </div>
                                        <div className="flex-1 text-xs md:text-sm font-semibold text-[#041A44] break-words">
                                          {field.edited || <span className="text-gray-400 italic">Not set</span>}
                                        </div>
                                      </div>
                                    </>
                                  ) : (
                                    <div className="flex items-start gap-1.5 md:gap-2">
                                      <div className="flex-shrink-0 w-12 md:w-16 text-[10px] md:text-xs font-medium text-gray-500 pt-0.5">
                                        Value:
                                      </div>
                                      <div className="flex-1 text-xs md:text-sm text-gray-700 break-words">
                                        {field.current || <span className="text-gray-400 italic">Not set</span>}
                                      </div>
                                    </div>
                                  )}
                                </div>
                              </div>
                            </div>
                          </div>
                        )
                      })}
                    </div>
                  </div>
                  <div className="bg-gray-50 px-4 md:px-6 py-3 md:py-4 border-t border-gray-200 flex flex-col sm:flex-row items-stretch sm:items-center justify-end gap-2 md:gap-3">
                    <button
                      onClick={() => handleReject(selectedEdit.id)}
                      className="flex items-center justify-center gap-2 rounded-xl border-2 border-red-200 bg-white px-4 md:px-6 py-2 md:py-2.5 text-xs md:text-sm text-red-600 font-semibold transition-all hover:bg-red-50 hover:border-red-300 hover:shadow-sm active:scale-95"
                    >
                      <X className="h-3.5 w-3.5 md:h-4 md:w-4" />
                      Reject
                    </button>
                    <button
                      onClick={() => handleApprove(selectedEdit.id)}
                      className="flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-[#041A44] to-[#004AAD] px-4 md:px-6 py-2 md:py-2.5 text-xs md:text-sm font-semibold text-white shadow-md transition-all hover:shadow-lg hover:from-[#0b2c6f] hover:to-[#0056c7] active:scale-95"
                    >
                      <Check className="h-3.5 w-3.5 md:h-4 md:w-4" />
                      Approve Changes
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )
        })()
      )}
    </div>
  )
})

function AnnouncementsSection() {
  const [drafts, setDrafts] = useState<AnnouncementDraft[]>([{ title: "", content: "" }])
  const [announcements, setAnnouncements] = useState<AnnouncementRecord[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [expandedContentId, setExpandedContentId] = useState<string | null>(null)
  const editTitleRef = useRef<HTMLTextAreaElement | null>(null)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [editingId, setEditingId] = useState<string | null>(null)
  const [editTitle, setEditTitle] = useState("")
  const [editContent, setEditContent] = useState("")
  const [deleteId, setDeleteId] = useState<string | null>(null)
  const [showEditModal, setShowEditModal] = useState(false)
  const [showDeleteModal, setShowDeleteModal] = useState(false)
  const [viewAnnouncement, setViewAnnouncement] = useState<AnnouncementRecord | null>(null)
  const announcementsChannelRef = useRef<BroadcastChannel | null>(null)
  const submitStartRef = useRef<number | null>(null)
  const submitTimeoutRef = useRef<NodeJS.Timeout | null>(null)
  const contentRefs = useRef<Record<number, HTMLTextAreaElement | null>>({})
  const [announcementSearch, setAnnouncementSearch] = useState("")

  const autoResizeTextarea = (element: HTMLTextAreaElement | null) => {
    if (!element) return
    element.style.height = "auto"
    element.style.height = `${element.scrollHeight}px`
  }

  const setContentRef = (index: number, element: HTMLTextAreaElement | null) => {
    if (!element) {
      delete contentRefs.current[index]
      return
    }
    contentRefs.current[index] = element
    autoResizeTextarea(element)
  }

  useEffect(() => {
    if (editTitleRef.current) {
      const el = editTitleRef.current
      el.style.height = "auto"
      el.style.height = `${el.scrollHeight}px`
    }
  }, [editTitle])

  useEffect(() => {
    drafts.forEach((_, index) => {
      const textarea = contentRefs.current[index]
      if (textarea) {
        autoResizeTextarea(textarea)
      }
    })
  }, [drafts])

  useEffect(() => {
    return () => {
      if (submitTimeoutRef.current) {
        clearTimeout(submitTimeoutRef.current)
      }
    }
  }, [])

  useEffect(() => {
    if (typeof window === "undefined" || typeof BroadcastChannel === "undefined") {
      return
    }
    const channel = new BroadcastChannel("announcements-channel")
    announcementsChannelRef.current = channel
    return () => {
      channel.close()
    }
  }, [])

  const broadcastAnnouncements = (message: AnnouncementBroadcastMessage) => {
    if (!message) return
    announcementsChannelRef.current?.postMessage(message)
  }

  const convertToAnnouncementRecord = (announcement: any): AnnouncementRecord => ({
    id: announcement.id,
    title: announcement.title,
    content: announcement.content,
    createdAt: announcement.createdAt || announcement.date || new Date().toISOString(),
  })

  const filteredAnnouncements = announcements.filter((announcement) => {
    if (!announcementSearch.trim()) return true
    const query = announcementSearch.toLowerCase()
    return announcement.title?.toLowerCase().includes(query)
  })

  const upsertAdminAnnouncements = (incoming: AnnouncementRecord[]) => {
    if (!incoming || incoming.length === 0) return
    setAnnouncements((prev) => {
      const map = new Map(prev.map((ann) => [ann.id, ann]))
      incoming.forEach((ann) => {
        if (ann?.id) {
          map.set(ann.id, ann)
        }
      })
      return Array.from(map.values()).sort(
        (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
      )
    })
  }

  // Fetch announcements from database
  const fetchAnnouncements = useCallback(async () => {
    try {
      const response = await fetch("/api/announcements?sort=desc")
      const data = await response.json()

      if (data.ok && data.announcements) {
        const formatted = data.announcements.map((ann: any) => ({
          id: ann.id,
          title: ann.title,
          content: ann.content,
          createdAt: ann.formattedDate,
        }))
        setAnnouncements(formatted)
      } else {
        console.error("Failed to fetch announcements:", data.error)
        setAnnouncements([])
      }
    } catch (error) {
      console.error("Error fetching announcements:", error)
      setAnnouncements([])
    } finally {
      setIsLoading(false)
    }
  }, [])

  useEffect(() => {
    fetchAnnouncements()

    // Poll for new announcements every 5 seconds
    const interval = setInterval(fetchAnnouncements, 5000)
    return () => clearInterval(interval)
  }, [fetchAnnouncements])

  // Listen for new announcement events
  useEffect(() => {
    const handleNewAnnouncement = () => {
      fetchAnnouncements()
    }

    window.addEventListener("announcementCreated", handleNewAnnouncement as EventListener)
    window.addEventListener("announcementUpdated", handleNewAnnouncement as EventListener)
    window.addEventListener("announcementDeleted", handleNewAnnouncement as EventListener)

    return () => {
      window.removeEventListener("announcementCreated", handleNewAnnouncement as EventListener)
      window.removeEventListener("announcementUpdated", handleNewAnnouncement as EventListener)
      window.removeEventListener("announcementDeleted", handleNewAnnouncement as EventListener)
    }
  }, [fetchAnnouncements])

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    const formData = drafts.filter((item) => item.title.trim() && item.content.trim())
    if (!formData.length) {
      return
    }

    submitStartRef.current = Date.now()
    setIsSubmitting(true)
    if (submitTimeoutRef.current) {
      clearTimeout(submitTimeoutRef.current)
      submitTimeoutRef.current = null
    }

    const finishSubmitting = () => {
      const MIN_DURATION = 2000
      const elapsed = submitStartRef.current ? Date.now() - submitStartRef.current : MIN_DURATION
      const remaining = Math.max(0, MIN_DURATION - elapsed)
      submitTimeoutRef.current = setTimeout(() => {
        setIsSubmitting(false)
        submitTimeoutRef.current = null
      }, remaining)
    }

    try {
      // Get current admin user
      const currentUser = localStorage.getItem("currentUser")
      const userData = currentUser ? JSON.parse(currentUser) : null

      const response = await fetch("/api/announcements", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          announcements: formData,
          createdBy: userData?.id || "admin",
          createdByName: userData ? `${userData.firstName} ${userData.lastName}` : "Administrator",
        }),
      })

      const data = await response.json()

      if (data.ok) {
        const createdAnnouncements = Array.isArray(data.announcements) ? data.announcements : []
        if (createdAnnouncements.length) {
          upsertAdminAnnouncements(createdAnnouncements.map(convertToAnnouncementRecord))
        }
        // Reset form immediately
        setDrafts([{ title: "", content: "" }])
        // Broadcast updates for other tabs/pages
        if (createdAnnouncements.length) {
          broadcastAnnouncements({ type: "created", announcements: createdAnnouncements })
        }
        window.dispatchEvent(new CustomEvent("announcementCreated", { detail: createdAnnouncements }))
        // Refresh announcements in the background to keep pagination/order accurate
        fetchAnnouncements().catch((error) => console.error("Error refreshing announcements:", error))
      } else {
        alert(data.error || "Failed to create announcements")
      }
    } catch (error) {
      console.error("Error creating announcements:", error)
      alert("Failed to create announcements. Please try again.")
    } finally {
      finishSubmitting()
    }
  }

  const updateDraft = (index: number, key: keyof AnnouncementDraft, value: string) => {
    setDrafts((prev) => {
      const updated = [...prev]
      updated[index] = { ...updated[index], [key]: value }
      return updated
    })
  }

  const addDraft = () => {
    setDrafts((prev) => [...prev, { title: "", content: "" }])
  }

  const removeAnnouncement = (id: string) => {
    setDeleteId(id)
    setShowDeleteModal(true)
  }

  const handleEdit = (announcement: AnnouncementRecord) => {
    setEditingId(announcement.id)
    setEditTitle(announcement.title)
    setEditContent(announcement.content)
    setShowEditModal(true)
  }

  const handleView = (announcement: AnnouncementRecord) => {
    setViewAnnouncement(announcement)
  }

  const handleSaveEdit = async () => {
    if (!editingId || !editTitle.trim() || !editContent.trim()) {
      return
    }

    try {
      const response = await fetch(`/api/announcements/${editingId}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          title: editTitle.trim(),
          content: editContent.trim(),
        }),
      })

      const data = await response.json()

      if (data.ok) {
        if (data.announcement) {
          upsertAdminAnnouncements([convertToAnnouncementRecord(data.announcement)])
          broadcastAnnouncements({ type: "updated", announcement: data.announcement })
          window.dispatchEvent(new CustomEvent("announcementUpdated", { detail: data.announcement }))
        } else {
          fetchAnnouncements().catch((error) => console.error("Error refreshing announcements:", error))
        }
        // Reset edit state
        setEditingId(null)
        setEditTitle("")
        setEditContent("")
        setShowEditModal(false)
        if (!data.announcement) {
          window.dispatchEvent(new CustomEvent("announcementUpdated"))
        }
        fetchAnnouncements().catch((error) => console.error("Error refreshing announcements:", error))
      } else {
        alert(data.error || "Failed to update announcement")
      }
    } catch (error) {
      console.error("Error updating announcement:", error)
      alert("Failed to update announcement. Please try again.")
    }
  }

  const handleCancelEdit = () => {
    setEditingId(null)
    setEditTitle("")
    setEditContent("")
    setShowEditModal(false)
  }

  const confirmDelete = async () => {
    if (!deleteId) return
    const announcementIdToDelete = deleteId
    
    try {
      const response = await fetch(`/api/announcements/${announcementIdToDelete}`, {
        method: "DELETE",
      })

      const data = await response.json()

      if (data.ok) {
        setAnnouncements((prev) => prev.filter((ann) => ann.id !== announcementIdToDelete))
        if (announcementIdToDelete) {
          broadcastAnnouncements({ type: "deleted", id: announcementIdToDelete })
          window.dispatchEvent(new CustomEvent("announcementDeleted", { detail: announcementIdToDelete }))
        } else {
          window.dispatchEvent(new CustomEvent("announcementDeleted"))
        }
        setDeleteId(null)
        setShowDeleteModal(false)
        fetchAnnouncements().catch((error) => console.error("Error refreshing announcements:", error))
      } else {
        alert(data.error || "Failed to delete announcement")
      }
    } catch (error) {
      console.error("Error deleting announcement:", error)
      alert("Failed to delete announcement. Please try again.")
    }
  }

  return (
    <div className="space-y-8 relative">
      {/* Create Announcements Section */}
      <section className="bg-white rounded-lg border border-gray-200 shadow-sm p-5 md:p-8 mb-8">
        <div className="flex items-center mb-4 md:mb-6">
          <div className="w-9 h-9 md:w-10 md:h-10 bg-gray-100 rounded-lg flex items-center justify-center mr-3 md:mr-4">
            <svg className="w-4 h-4 md:w-5 md:h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M11 5.882V19.24a1.76 1.76 0 01-3.417.592l-2.147-6.15M18 13a3 3 0 100-6M5.436 13.683A4.001 4.001 0 017 6h1.832c4.1 0 7.625-1.234 9.168-3v14c-1.543-1.766-5.067-3-9.168-3H7a3.988 3.988 0 01-1.564-.317z"></path>
            </svg>
          </div>
          <h2 className="text-lg md:text-xl font-semibold text-gray-900">Create Announcements</h2>
        </div>

        <form onSubmit={handleSubmit}>
          <div id="announcementFields" className="space-y-4 md:space-y-6">
            {drafts.map((draft, index) => (
              <div key={index} className="p-4 md:p-6 border border-gray-200 rounded-lg bg-gray-50">
                <div className="space-y-4 md:space-y-6">
                  <div>
                    <label className="block text-xs md:text-sm font-medium text-gray-700 mb-2">
                      <svg className="w-3.5 h-3.5 md:w-4 md:h-4 inline mr-1.5 md:mr-2 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z"></path>
                      </svg>
                      Title
                    </label>
                    <input
                      type="text"
                      value={draft.title}
                      onChange={(event) => updateDraft(index, "title", event.target.value)}
                      placeholder="Enter announcement title..."
                      className="w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm text-gray-700 transition focus:border-[#041A44] focus:outline-none focus:ring-2 focus:ring-[#041A44]/20"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-xs md:text-sm font-medium text-gray-700 mb-2">
                      <svg className="w-3.5 h-3.5 md:w-4 md:h-4 inline mr-1.5 md:mr-2 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M4 6h16M4 12h16M4 18h7"></path>
                      </svg>
                      Content
                    </label>
                    <textarea
                      ref={(element) => setContentRef(index, element)}
                      value={draft.content}
                      onChange={(event) => {
                        updateDraft(index, "content", event.target.value)
                        autoResizeTextarea(event.target)
                      }}
                      rows={3}
                      placeholder="Enter announcement content..."
                      className="w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm text-gray-700 transition focus:border-[#041A44] focus:outline-none focus:ring-2 focus:ring-[#041A44]/20 resize-none"
                      style={{ minHeight: "120px", overflow: "hidden" }}
                      required
                    />
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="flex justify-end items-center mt-6 md:mt-8">
            <button
              type="submit"
              disabled={isSubmitting}
              className="inline-flex items-center gap-2 px-5 md:px-6 py-2.5 md:py-3 text-sm font-medium text-white rounded-md transition-all hover:shadow-md disabled:opacity-50 disabled:cursor-not-allowed w-full sm:w-auto justify-center"
              style={{
                background: "#041A44",
                border: "1px solid #041A44",
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.background = "#1e40af"
                e.currentTarget.style.borderColor = "#1e40af"
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.background = "#041A44"
                e.currentTarget.style.borderColor = "#041A44"
              }}
            >
              {isSubmitting ? (
                <>
                  <RefreshCw className="h-4 w-4 animate-spin" />
                  Creating...
                </>
              ) : (
                <>
                  <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8"></path>
                  </svg>
                  Create Announcements
                </>
              )}
            </button>
          </div>
        </form>
      </section>

      {/* All Announcements Section */}
      <section className="bg-white rounded-lg border border-gray-200 shadow-sm">
        <div className="px-5 py-4 md:px-8 md:py-6 border-b border-gray-100">
          <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
            <div className="flex items-center gap-3 md:gap-4">
              <div className="bg-green-100 p-2.5 md:p-3 rounded-xl">
                <ClipboardList className="w-4.5 h-4.5 md:w-6 md:h-6 text-green-600" />
              </div>
              <h2 className="text-lg md:text-2xl font-bold text-gray-800">All Announcements</h2>
            </div>
            <div className="relative w-full max-w-xs md:max-w-sm">
              <input
                type="text"
                value={announcementSearch ?? ""}
                onChange={(e) => setAnnouncementSearch(e.target.value)}
                placeholder="Search announcements..."
                className="w-full rounded-lg border border-gray-300 bg-white pl-10 pr-4 py-2 text-sm text-gray-700 focus:border-[#041A44] focus:outline-none focus:ring-2 focus:ring-[#041A44]/20"
              />
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            </div>
          </div>
        </div>
        <div className="overflow-x-auto">
          {isLoading ? (
            <div className="text-center py-12">
              <RefreshCw className="mx-auto h-16 w-16 text-[#041A44] mb-4 animate-spin" />
              <p className="text-lg font-semibold text-gray-700">Loading announcements...</p>
            </div>
          ) : announcements.length === 0 ? (
            <div className="text-center py-12">
              <Megaphone className="mx-auto h-16 w-16 text-gray-400 mb-4" />
              <p className="text-lg font-semibold text-gray-700">No announcements yet</p>
              <p className="text-sm text-gray-500 mt-2">Create your first announcement above</p>
            </div>
          ) : filteredAnnouncements.length === 0 ? (
            <div className="text-center py-10">
              <p className="text-base font-semibold text-gray-700">No announcements match your search.</p>
              <p className="text-sm text-gray-500 mt-1">Try adjusting your keywords.</p>
            </div>
          ) : (
            <>
              <div className="hidden md:block">
                <table className="w-full rounded-2xl overflow-hidden">
                  <thead>
                    <tr>
                      <th className="px-8 py-4 text-left text-base font-extrabold text-white uppercase tracking-wide" style={{ 
                        background: "linear-gradient(135deg, #001F54, #004AAD)",
                        color: "#F8FAFC",
                        letterSpacing: "0.08em",
                        boxShadow: "0 4px 10px rgba(0, 0, 0, 0.2)",
                        padding: "1rem 2rem",
                        borderBottom: "2px solid rgba(255, 255, 255, 0.1)",
                        textShadow: "0 1px 2px rgba(0, 0, 0, 0.35)",
                      }}>Title</th>
                      <th className="px-8 py-4 text-left text-base font-extrabold text-white uppercase tracking-wide" style={{ 
                        background: "linear-gradient(135deg, #001F54, #004AAD)",
                        color: "#F8FAFC",
                        letterSpacing: "0.08em",
                        boxShadow: "0 4px 10px rgba(0, 0, 0, 0.2)",
                        padding: "1rem 2rem",
                        borderBottom: "2px solid rgba(255, 255, 255, 0.1)",
                        textShadow: "0 1px 2px rgba(0, 0, 0, 0.35)",
                      }}>Content</th>
                      <th className="px-8 py-4 text-left text-base font-extrabold text-white uppercase tracking-wide date-column" style={{ 
                        background: "linear-gradient(135deg, #001F54, #004AAD)",
                        color: "#F8FAFC",
                        letterSpacing: "0.08em",
                        boxShadow: "0 4px 10px rgba(0, 0, 0, 0.2)",
                        padding: "1rem 2rem",
                        borderBottom: "2px solid rgba(255, 255, 255, 0.1)",
                        textShadow: "0 1px 2px rgba(0, 0, 0, 0.35)",
                      }}>Created</th>
                      <th className="px-8 py-4 text-left text-sm font-bold text-white uppercase" style={{ 
                        background: "linear-gradient(135deg, #001F54, #004AAD)",
                        color: "#ffffff",
                        fontWeight: 700,
                        textTransform: "uppercase",
                        letterSpacing: "0.025em",
                        boxShadow: "0 4px 10px rgba(0, 0, 0, 0.2)",
                        padding: "1rem 2rem",
                        borderBottom: "2px solid rgba(255, 255, 255, 0.1)"
                      }}>Actions</th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-100">
                    {filteredAnnouncements.map((announcement) => {
                      const query = announcementSearch.trim().toLowerCase()
                      const isTitleMatch = query ? announcement.title?.toLowerCase().includes(query) : false
                      return (
                        <tr
                          key={announcement.id}
                          className="transition hover:bg-gray-50"
                        >
                          <td className="px-4 py-3">
                            <div className="text-sm font-semibold text-gray-900">
                              {announcement.title || "Untitled Announcement"}
                            </div>
                          </td>
                          <td className="px-4 py-3 align-top">
                            <div className="text-sm text-gray-700 whitespace-pre-wrap break-words">
                              {announcement.content}
                            </div>
                          </td>
                          <td className="px-4 py-3">
                            <div className="text-sm text-gray-500">
                              <div className="flex items-center">
                                <Calendar className="w-4 h-4 mr-2" />
                                {announcement.createdAt}
                              </div>
                            </div>
                          </td>
                          <td className="px-4 py-3">
                            <div className="flex space-x-3">
                              <button
                                type="button"
                                onClick={() => handleEdit(announcement)}
                                className="inline-flex items-center gap-2 px-3 h-9 rounded-md border border-[#041A44] text-[#041A44] bg-white transition-all hover:bg-[#041A44] hover:text-white hover:shadow-md"
                                title="Edit announcement"
                              >
                                <Edit className="w-4 h-4" />
                                <span className="text-sm font-medium">Edit</span>
                              </button>
                              <button
                                type="button"
                                onClick={() => removeAnnouncement(announcement.id)}
                                className="inline-flex items-center gap-2 px-3 h-9 rounded-md border border-red-600 text-red-600 bg-white transition-all hover:bg-red-600 hover:text-white hover:shadow-md"
                                title="Delete announcement"
                              >
                                <Trash2 className="w-4 h-4" />
                                <span className="text-sm font-medium">Delete</span>
                              </button>
                            </div>
                          </td>
                        </tr>
                      )
                    })}
                  </tbody>
                </table>
              </div>

              <div className="md:hidden px-4 py-4 space-y-3">
                {filteredAnnouncements.map((announcement) => {
                  const query = announcementSearch.trim().toLowerCase()
                  const isTitleMatch = query ? announcement.title?.toLowerCase().includes(query) : false
                  return (
                    <div
                      key={announcement.id}
                      className="rounded-2xl border border-gray-200 bg-white shadow-sm overflow-hidden"
                    >
                      <div
                        className="flex items-center justify-between px-4 py-2"
                        style={{
                          background: "linear-gradient(135deg, #001F54, #004AAD)",
                        }}
                      >
                        <div className="flex items-center gap-2 text-white text-sm font-semibold">
                          <Calendar className="w-4 h-4" />
                          {announcement.createdAt}
                        </div>
                        <button
                          type="button"
                          onClick={() => handleView(announcement)}
                          className="inline-flex items-center gap-1.5 rounded-full border border-white/50 bg-white/10 px-3 py-1.5 text-xs font-semibold text-white transition-all hover:bg-white/20"
                        >
                          <Eye className="w-3.5 h-3.5" />
                          View
                        </button>
                      </div>
                      <div className="bg-white px-4 py-3 space-y-4">
                        <div className="flex flex-col gap-2">
                          <span
                            className="text-sm font-extrabold uppercase text-[#041A44]"
                            style={{ letterSpacing: "0.08em" }}
                          >
                            Title
                          </span>
                        <span className="inline-block rounded-[12px] bg-white px-3 py-1.5 text-xs font-semibold text-gray-700 break-words w-full shadow-[inset_0_0_0_1px_rgba(4,26,68,0.15)]">
                          {announcement.title || "Untitled Announcement"}
                        </span>
                        </div>
                        <div className="flex flex-col gap-2">
                          <span
                            className="text-sm font-extrabold uppercase text-[#041A44]"
                            style={{ letterSpacing: "0.08em" }}
                          >
                            Actions
                          </span>
                          <div className="flex flex-wrap gap-2">
                            <button
                              type="button"
                              onClick={() => handleEdit(announcement)}
                              className="inline-flex items-center gap-2 rounded-full border border-[#041A44] px-3 py-1 text-xs font-semibold text-[#041A44] hover:bg-[#041A44]/5"
                            >
                              <Edit className="h-3.5 w-3.5" />
                              <span>Edit</span>
                            </button>
                            <button
                              type="button"
                              onClick={() => removeAnnouncement(announcement.id)}
                              className="inline-flex items-center gap-2 rounded-full border border-red-500 px-3 py-1 text-xs font-semibold text-red-600 hover:bg-red-50"
                            >
                              <Trash2 className="h-3.5 w-3.5" />
                              <span>Delete</span>
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  )
                })}
              </div>
            </>
          )}
        </div>
      </section>

      {/* Edit Modal */}
      {showEditModal && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-xl max-w-md w-full p-6">
            <div className="flex items-center gap-3 mb-6">
              <div className="bg-blue-100 w-11 h-11 rounded-full flex items-center justify-center">
                <Edit className="w-5 h-5 text-blue-600" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 sm:text-2xl whitespace-nowrap">Edit Announcement</h3>
            </div>
            <form
              onSubmit={(e) => {
                e.preventDefault()
                handleSaveEdit()
              }}
            >
              <div className="space-y-6 text-left">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Title</label>
                  <div className="relative">
                    <textarea
                      ref={editTitleRef}
                      value={editTitle}
                      onChange={(e) => setEditTitle(e.target.value)}
                      className="w-full rounded-lg border border-gray-200 bg-white px-4 py-3 text-sm text-gray-700 focus:border-[#041A44] focus:outline-none focus:ring-2 focus:ring-[#041A44]/20 resize-none overflow-hidden"
                      rows={1}
                      style={{ minHeight: "48px" }}
                      onInput={(e) => {
                        const target = e.currentTarget
                        target.style.height = "auto"
                        target.style.height = `${target.scrollHeight}px`
                      }}
                      required
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Content</label>
                  <textarea
                    value={editContent}
                    onChange={(e) => setEditContent(e.target.value)}
                    rows={6}
                    className="w-full rounded-lg border border-gray-200 bg-white px-4 py-3 text-sm text-gray-700 focus:border-[#041A44] focus:outline-none focus:ring-2 focus:ring-[#041A44]/20 resize-y"
                    style={{ minHeight: "220px", overflowWrap: "anywhere" }}
                    required
                  />
                </div>
                <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 pt-4 sm:justify-end">
                  <button
                    type="submit"
                    className="w-full sm:w-auto px-3 sm:px-5 py-2 bg-[#041A44] text-white rounded-lg hover:bg-[#0b2c6f] transition-colors text-center text-sm sm:text-base"
                  >
                    Update Announcement
                  </button>
                  <button
                    type="button"
                    onClick={handleCancelEdit}
                    className="w-full sm:w-auto px-3 sm:px-5 py-2 border border-gray-300 rounded-lg text-gray-700 bg-white hover:bg-gray-50 transition-colors text-center text-sm sm:text-base"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* View Modal - Mobile Focused */}
      {viewAnnouncement && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-xl max-w-md w-full p-6 max-h-[80vh] overflow-y-auto md:max-h-none md:overflow-visible">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-full bg-[#041A44]/10 flex items-center justify-center">
                <Megaphone className="w-5 h-5 text-[#041A44]" />
              </div>
              <div>
                <h3 className="text-lg font-bold text-gray-900 sm:text-xl">Announcement Details</h3>
                <p className="text-xs text-gray-500 mt-0.5 sm:text-sm">Quick view</p>
              </div>
            </div>
            <div className="space-y-4 text-left">
              <div>
                <p className="text-sm font-extrabold uppercase text-[#041A44] tracking-[0.08em] md:text-xs md:font-semibold md:text-gray-500 md:tracking-wide">Title</p>
                <div className="mt-1 rounded-lg border border-gray-200 bg-white px-4 py-3 text-base font-semibold text-gray-900 break-words">
                  {viewAnnouncement.title}
                </div>
              </div>
                <div>
                  <p className="text-sm font-extrabold uppercase text-[#041A44] tracking-[0.08em] md:text-xs md:font-semibold md:text-gray-500 md:tracking-wide">Content</p>
                  <div className="mt-1 rounded-lg border border-gray-200 bg-white px-4 py-3 text-sm text-gray-700 whitespace-pre-wrap break-words max-h-[55vh] min-h-[220px] overflow-y-auto">
                    {viewAnnouncement.content}
                  </div>
                </div>
              <div>
                <p className="text-sm font-extrabold uppercase text-[#041A44] tracking-[0.08em] md:text-xs md:font-semibold md:text-gray-500 md:tracking-wide">Created</p>
                <div className="mt-1 rounded-lg border border-gray-200 bg-white px-4 py-3 text-sm text-gray-600 flex items-center gap-2">
                  <Calendar className="w-4 h-4 text-[#041A44]" />
                  {viewAnnouncement.createdAt}
                </div>
              </div>
            </div>
            <button
              type="button"
              onClick={() => setViewAnnouncement(null)}
              className="mt-6 w-full rounded-xl bg-gradient-to-r from-[#041A44] to-[#004AAD] py-2.5 text-sm font-semibold text-white shadow-md transition-all hover:shadow-lg"
            >
              Close
            </button>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {showDeleteModal && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full p-6">
            <div className="flex flex-col items-center text-center">
              <div className="h-14 w-14 rounded-full bg-red-50 text-red-600 flex items-center justify-center mb-4">
                <Trash2 className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">Delete Announcement</h3>
              <p className="text-sm text-gray-600 mb-6">
                Are you sure you want to delete this announcement? This action cannot be undone.
              </p>
              <div className="flex items-center gap-3 w-full">
                <button
                  onClick={() => { setShowDeleteModal(false); setDeleteId(null); }}
                  className="w-full rounded-xl border border-gray-200 bg-white py-2.5 text-sm font-semibold text-gray-700 hover:bg-gray-50 transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={confirmDelete}
                  className="w-full rounded-xl bg-red-600 py-2.5 text-sm font-semibold text-white hover:bg-red-700 transition-colors"
                >
                  Delete
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

// Department Records Component
function DepartmentRecordsSection({ department, departmentLabel }: { department: string; departmentLabel: string }) {
  const [users, setUsers] = useState<any[]>([])
  const [violations, setViolations] = useState<any[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [isLoadingViolations, setIsLoadingViolations] = useState(true)
  const [hasLoadedViolations, setHasLoadedViolations] = useState(false)
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedUser, setSelectedUser] = useState<any>(null)
  const [showAddViolation, setShowAddViolation] = useState(false)
  const [showViewViolations, setShowViewViolations] = useState(false)
  const [showStudentDetails, setShowStudentDetails] = useState(false)
  const [userViolations, setUserViolations] = useState<any[]>([])
  const [isLoadingUserViolations, setIsLoadingUserViolations] = useState(false)
  const [openStatusDropdownId, setOpenStatusDropdownId] = useState<string | null>(null)
  const [violationForm, setViolationForm] = useState({ 
    violation: "", 
    violationType: "", 
    status: "pending", 
    notes: "",
    approverName: "",
    approverTitle: ""
  })
  const [showViolationToast, setShowViolationToast] = useState(false)
  const [violationToastMessage, setViolationToastMessage] = useState("")
  const [violationToastSubtext, setViolationToastSubtext] = useState("")
  const toastTimeoutRef = useRef<NodeJS.Timeout | null>(null)

  const showViolationNotification = (userName: string) => {
    setViolationToastMessage("Violation Added Successfully!")
    setViolationToastSubtext(`Violation has been added to ${userName}'s record.`)
    setShowViolationToast(true)
    if (toastTimeoutRef.current) clearTimeout(toastTimeoutRef.current)
    toastTimeoutRef.current = setTimeout(() => setShowViolationToast(false), 3500)
  }

  useEffect(() => {
    return () => {
      if (toastTimeoutRef.current) clearTimeout(toastTimeoutRef.current)
    }
  }, [])
  const [violationStatusFilter, setViolationStatusFilter] = useState("all")
  const [selectedViolation, setSelectedViolation] = useState<any>(null)
  const [showViolationDetails, setShowViolationDetails] = useState(false)
  // Long-press state for Academic Records
  const [longPressUserId, setLongPressUserId] = useState<string | null>(null)
  const [hoveredUserId, setHoveredUserId] = useState<string | null>(null)
  const longPressTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null)
  // Long-press state for Recent Violations
  const [longPressViolationId, setLongPressViolationId] = useState<string | null>(null)
  const [hoveredViolationId, setHoveredViolationId] = useState<string | null>(null)
  const longPressViolationTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null)
  const violationsChannelRef = useRef<BroadcastChannel | null>(null)
  const statusOptions = ["pending", "warning", "resolved"]
  const showInitialViolationsLoader = !hasLoadedViolations && isLoadingViolations

  const normalizeStatus = (status?: string | null) =>
    status ? status.trim().toLowerCase() : "pending"

  const formatStatusLabel = (status?: string | null) => {
    const normalized = normalizeStatus(status)
    return `${normalized.charAt(0).toUpperCase()}${normalized.slice(1)}`
  }

  const getStatusClasses = (status?: string | null) => {
    const normalized = normalizeStatus(status)
    switch (normalized) {
      case "resolved":
        return "bg-green-50 text-green-700 border border-green-200"
      case "warning":
        return "bg-yellow-50 text-yellow-700 border border-yellow-200"
      default:
        return "bg-yellow-50 text-yellow-600 border border-yellow-200"
    }
  }

  const getStatusBadgeClasses = (status?: string | null) => {
    const normalized = normalizeStatus(status)
    switch (normalized) {
      case "resolved":
        return "bg-green-100 text-green-800"
      case "warning":
        return "bg-yellow-100 text-yellow-800"
      default:
        return "bg-red-100 text-red-700"
    }
  }

  // Long-press handlers for Academic Records
  const handleLongPressStart = (userId: string, e: React.TouchEvent) => {
    e.preventDefault()
    const timer = setTimeout(() => {
      if (navigator.vibrate) {
        navigator.vibrate(50)
      }
      setLongPressUserId(userId)
    }, 500)
    longPressTimerRef.current = timer
  }

  const handleLongPressEnd = () => {
    if (longPressTimerRef.current) {
      clearTimeout(longPressTimerRef.current)
      longPressTimerRef.current = null
    }
  }

  // Long-press handlers for Recent Violations
  const handleViolationLongPressStart = (violationId: string, e: React.TouchEvent) => {
    e.preventDefault()
    const timer = setTimeout(() => {
      if (navigator.vibrate) {
        navigator.vibrate(50)
      }
      setLongPressViolationId(violationId)
    }, 500)
    longPressViolationTimerRef.current = timer
  }

  const handleViolationLongPressEnd = () => {
    if (longPressViolationTimerRef.current) {
      clearTimeout(longPressViolationTimerRef.current)
      longPressViolationTimerRef.current = null
    }
  }

  // Map department code to database department name
  const getDepartmentName = (deptCode: string): string => {
    const mapping: Record<string, string> = {
      "ELEMENTARY": "Elementary",
      "JUNIOR HIGH": "Junior High School",
      "SENIOR HIGH": "Senior High School",
      "COLLEGE": "College",
    }
    return mapping[deptCode] || deptCode
  }

  const fetchUsers = useCallback(async () => {
    try {
      const response = await fetch(`/api/users/department?department=${department}&search=${encodeURIComponent(searchQuery)}`)
      const data = await response.json()
      if (data.ok && data.users) {
        setUsers(data.users)
      }
    } catch (error) {
      console.error("Error fetching users:", error)
    } finally {
      setIsLoading(false)
    }
  }, [department, searchQuery])

  const fetchViolations = useCallback(async () => {
    try {
      setIsLoadingViolations(true)
      const statusParam = violationStatusFilter === "all" ? "" : `&status=${violationStatusFilter}`
      const url = `/api/violations?department=${encodeURIComponent(department)}${statusParam}`
      console.log(`[DepartmentRecordsSection] ===== FETCHING VIOLATIONS =====`)
      console.log(`[DepartmentRecordsSection] URL: ${url}`)
      console.log(`[DepartmentRecordsSection] Department code: ${department}`)
      console.log(`[DepartmentRecordsSection] Department name (mapped): ${getDepartmentName(department)}`)
      console.log(`[DepartmentRecordsSection] Status filter: ${violationStatusFilter}`)
      
      const response = await fetch(url)
      const data = await response.json()
      
      console.log(`[DepartmentRecordsSection] API Response:`, {
        ok: data.ok,
        error: data.error,
        violationsCount: data.violations?.length || 0
      })
      
      if (data.ok && data.violations) {
        console.log(`[DepartmentRecordsSection] ✅ Successfully fetched ${data.violations.length} violations for department ${department}`)
        if (data.violations.length > 0) {
          console.log(`[DepartmentRecordsSection] Violations found:`, data.violations.map((v: any) => ({
            id: v.id,
            studentName: v.studentName,
            studentDepartment: v.studentDepartment,
            violation: v.violation,
            status: v.status
          })))
        }
        setViolations(data.violations)
      } else {
        console.error(`[DepartmentRecordsSection] ❌ Failed to fetch violations:`, data.error)
        console.error(`[DepartmentRecordsSection] Response data:`, data)
        setViolations([])
      }
    } catch (error) {
      console.error(`[DepartmentRecordsSection] ❌ Error fetching violations:`, error)
      setViolations([])
    } finally {
      setIsLoadingViolations(false)
      setHasLoadedViolations(true)
    }
  }, [department, violationStatusFilter])

  const fetchUserViolations = useCallback(async (userId: string) => {
    try {
      setIsLoadingUserViolations(true)
      const response = await fetch(`/api/violations?userId=${userId}`)
      const data = await response.json()
      
      if (data.ok && data.violations) {
        setUserViolations(data.violations)
      } else {
        console.error("Failed to fetch user violations:", data.error)
        setUserViolations([])
      }
    } catch (error) {
      console.error("Error fetching user violations:", error)
      setUserViolations([])
    } finally {
      setIsLoadingUserViolations(false)
    }
  }, [])

  useEffect(() => {
    if (typeof window === "undefined" || typeof BroadcastChannel === "undefined") {
      return
    }
    const channel = new BroadcastChannel("violations-channel")
    violationsChannelRef.current = channel
    return () => {
      channel.close()
      violationsChannelRef.current = null
    }
  }, [])

  const handleStatusUpdate = useCallback(
    async (violation: any, status: string) => {
      const violationId = violation.id
      try {
        const response = await fetch(`/api/violations/${violationId}`, {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ status }),
        })
        const data = await response.json()
        if (data.ok) {
          setViolations((prev) =>
            prev.map((violation) => (violation.id === violationId ? { ...violation, status } : violation)),
          )
          setUserViolations((prev) =>
            prev.map((violation) => (violation.id === violationId ? { ...violation, status } : violation)),
          )
          setSelectedViolation((prev: any) => (prev?.id === violationId ? { ...prev, status } : prev))

          // Refresh main violations list
          fetchViolations()
          // Refresh user-specific violations if modal is open for this user
          if (showViewViolations && selectedUser) {
            fetchUserViolations(selectedUser.id)
          }
          const updatedViolation = data.violation
          const targetUserId = violation.userId || updatedViolation?.userId || null
          const targetStudentName = violation.studentName || updatedViolation?.studentName || null

          violationsChannelRef.current?.postMessage({
            type: "violation:status-updated",
            violationId,
            status,
            userId: targetUserId,
            studentName: targetStudentName,
            department,
            timestamp: Date.now(),
          })

          window.dispatchEvent(
            new CustomEvent("violationUpdated", { detail: { department, violationId, status, userId: targetUserId } }),
          )
        } else {
          alert(data.error || "Failed to update violation status")
        }
      } catch (error) {
        console.error("Error updating violation status:", error)
        alert("Failed to update violation status. Please try again.")
      }
    },
    [department, fetchViolations, fetchUserViolations, selectedUser, showViewViolations],
  )

  useEffect(() => {
    const handleOutsideClick = (event: MouseEvent) => {
      if (!(event.target as HTMLElement)?.closest(".violation-status-dropdown")) {
        setOpenStatusDropdownId(null)
      }
    }
    const handleScroll = () => setOpenStatusDropdownId(null)
    document.addEventListener("mousedown", handleOutsideClick)
    document.addEventListener("scroll", handleScroll, true)
    return () => {
      document.removeEventListener("mousedown", handleOutsideClick)
      document.removeEventListener("scroll", handleScroll, true)
    }
  }, [])

  useEffect(() => {
    fetchUsers()
  }, [fetchUsers])

  useEffect(() => {
    // Initial fetch
    console.log(`[DepartmentRecordsSection] Initial fetch for department: ${department}`)
    fetchViolations()
    
    // Poll every 10 seconds to ensure we have the latest data
    const interval = setInterval(() => {
      console.log(`[DepartmentRecordsSection] Polling violations for department: ${department}`)
      fetchViolations()
    }, 10000)
    
    // Listen for violation events
    const handleViolationEvent = (event: any) => {
      console.log(`[DepartmentRecordsSection] Violation event received (${department}):`, event.type)
      const eventDepartment = event.detail?.department
      
      // Only refresh if the violation is for this department (or no department specified, meaning refresh all)
      if (!eventDepartment || eventDepartment === department) {
        console.log(`[DepartmentRecordsSection] Refreshing violations for department ${department} due to ${event.type} event`)
        // Small delay to ensure database is updated
        setTimeout(() => {
          fetchViolations()
        }, 500)
      } else {
        console.log(`[DepartmentRecordsSection] Ignoring event - violation is for department ${eventDepartment}, current is ${department}`)
      }
    }
    
    window.addEventListener("violationCreated", handleViolationEvent as EventListener)
    window.addEventListener("violationDeleted", handleViolationEvent as EventListener)
    window.addEventListener("violationUpdated", handleViolationEvent as EventListener)
    
    return () => {
      clearInterval(interval)
      window.removeEventListener("violationCreated", handleViolationEvent as EventListener)
      window.removeEventListener("violationDeleted", handleViolationEvent as EventListener)
      window.removeEventListener("violationUpdated", handleViolationEvent as EventListener)
    }
  }, [fetchViolations, department])

  const handleAddViolation = async () => {
    if (!selectedUser || !violationForm.violation.trim()) {
      alert("Please fill in the violation description")
      return
    }
    
    if (!violationForm.approverName.trim() || !violationForm.approverTitle.trim()) {
      alert("Please fill in the approver information (Name and Title/Position are required)")
      return
    }

    try {
      const currentUser = localStorage.getItem("currentUser")
      const adminData = currentUser ? JSON.parse(currentUser) : null

      const response = await fetch("/api/violations", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          userId: selectedUser.id,
          studentId: selectedUser.studentId,
          studentName: `${selectedUser.firstName} ${selectedUser.lastName}`,
          studentDepartment: getDepartmentName(department), // Use actual department name, not code
          violation: violationForm.violation.trim(),
          violationType: violationForm.violationType || null,
          status: violationForm.status,
          managedBy: adminData?.id || "admin",
          managedByName: violationForm.approverName.trim() || (adminData ? `${adminData.firstName} ${adminData.lastName}` : "Administrator"),
          approverTitle: violationForm.approverTitle.trim() || null,
          notes: violationForm.notes || null,
        }),
      })

      const data = await response.json()
      if (data.ok) {
        console.log("Violation created successfully:", data.violation)
        console.log("Department used when creating:", getDepartmentName(department))
        console.log("Department code:", department)
        
        // Close modal and reset form
        setShowAddViolation(false)
        setSelectedUser(null)
        setViolationForm({ violation: "", violationType: "", status: "pending", notes: "", approverName: "", approverTitle: "" })
        
        // CRITICAL: Immediately fetch violations to update the Recent Violations section
        // Use a small delay to ensure database write is complete
        setTimeout(async () => {
          console.log("Refreshing violations list for department:", department)
          await fetchViolations()
        }, 500)
        
        // Also dispatch event for other components
        const event = new CustomEvent("violationCreated", { 
          detail: { 
            violation: data.violation,
            department: department 
          } 
        })
        window.dispatchEvent(event)
        console.log("Violation created event dispatched:", event)
        
        showViolationNotification(`${selectedUser?.firstName || "Student"} ${selectedUser?.lastName || ""}`.trim())
      } else {
        alert(data.error || "Failed to add violation")
      }
    } catch (error) {
      console.error("Error adding violation:", error)
      alert("Failed to add violation. Please try again.")
    }
  }

  const [showViolationDeleteModal, setShowViolationDeleteModal] = useState(false)
  const [deleteViolationTarget, setDeleteViolationTarget] = useState<{ id: string; studentName?: string } | null>(null)
  const [isDeletingViolation, setIsDeletingViolation] = useState(false)

  const handleDeleteViolation = async () => {
    if (!deleteViolationTarget) return

    try {
      setIsDeletingViolation(true)
      const response = await fetch(`/api/violations/${deleteViolationTarget.id}`, { method: "DELETE" })
      const data = await response.json()
      if (data.ok) {
        fetchViolations()
        if (selectedViolation?.id === deleteViolationTarget.id) {
          setShowViolationDetails(false)
          setSelectedViolation(null)
        }
        window.dispatchEvent(new CustomEvent("violationDeleted", { detail: { department } }))
      } else {
        alert(data.error || "Failed to delete violation")
      }
    } catch (error) {
      console.error("Error deleting violation:", error)
      alert("Failed to delete violation. Please try again.")
    } finally {
      setIsDeletingViolation(false)
      setShowViolationDeleteModal(false)
      setDeleteViolationTarget(null)
    }
  }

  const getInitials = (firstName: string, lastName: string) => {
    return `${firstName?.[0] || ""}${lastName?.[0] || ""}`.toUpperCase()
  }

  const formatYearLevel = (yearLevel: string | null) => {
    if (!yearLevel) return "N/A"
    if (yearLevel.includes("Grade")) return yearLevel
    if (yearLevel.includes("Year")) return yearLevel
    return yearLevel
  }

  return (
    <div className="space-y-8">
      {showViolationToast && (
        <div className="hidden md:block pointer-events-none fixed right-10 bottom-10 z-[200] animate-slide-in">
          <div className="bg-white border border-green-200 rounded-2xl shadow-[0_12px_40px_rgba(34,197,94,0.25)] px-5 py-4 w-[320px]">
            <div className="flex items-start gap-3">
              <div className="h-10 w-10 rounded-full bg-green-50 flex items-center justify-center border border-green-100">
                <svg className="h-5 w-5 text-green-500" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                </svg>
              </div>
              <div className="flex-1">
                <p className="text-sm font-semibold text-gray-900">{violationToastMessage}</p>
                <p className="text-xs text-gray-500 mt-0.5">{violationToastSubtext}</p>
              </div>
            </div>
          </div>
        </div>
      )}
      {showViolationDeleteModal && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[210] flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full p-6">
            <div className="flex flex-col items-center text-center">
              <div className="h-14 w-14 rounded-full bg-red-50 text-red-600 flex items-center justify-center mb-4">
                <Trash2 className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-1">Delete Violation</h3>
              <p className="text-sm text-gray-600 mb-6">
                {deleteViolationTarget?.studentName
                  ? `Are you sure you want to delete ${deleteViolationTarget.studentName}'s violation? This action cannot be undone.`
                  : "Are you sure you want to delete this violation? This action cannot be undone."}
              </p>
              <div className="flex items-center gap-3 w-full">
                <button
                  onClick={() => {
                    setShowViolationDeleteModal(false)
                    setDeleteViolationTarget(null)
                  }}
                  className="w-full rounded-xl border border-gray-200 bg-white py-2.5 text-sm font-semibold text-gray-700 hover:bg-gray-50 transition-colors"
                  disabled={isDeletingViolation}
                >
                  Cancel
                </button>
                <button
                  onClick={handleDeleteViolation}
                  className="w-full rounded-xl bg-red-600 py-2.5 text-sm font-semibold text-white hover:bg-red-700 transition-colors"
                >
                  Delete
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
      {/* Student Records Section */}
      <section className="rounded-3xl bg-white shadow-lg ring-1 ring-black/5">
        <div className="bg-gradient-to-r from-[#041A44] via-[#0d2f7b] to-[#123a91] rounded-none md:rounded-xl px-4 md:px-6 lg:px-8 py-5 md:py-6 text-white">
          <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 md:h-12 md:w-12 rounded-2xl bg-white/10 text-white flex items-center justify-center flex-shrink-0">
                <Users className="h-5 w-5 md:h-6 md:w-6" />
              </div>
              <div className="space-y-0.5">
                <h2 className="text-xl md:text-2xl font-semibold text-white">{departmentLabel} Records</h2>
                <p className="text-xs md:text-sm text-white/80">Manage student records and violations</p>
              </div>
            </div>
            <div className="relative w-full md:max-w-md lg:max-w-lg">
              <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 h-4 w-4 text-white/70" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search by name or year level..."
                className="w-full pl-11 pr-4 py-2 text-sm md:text-base rounded-full border border-white/40 bg-white/10 text-white placeholder-white/70 focus:border-white focus:outline-none focus:ring-2 focus:ring-white/40"
              />
            </div>
          </div>
        </div>

        <div className="overflow-visible px-8 pb-16 pt-16">
          {isLoading ? (
            <div className="text-center py-12">
              <RefreshCw className="mx-auto h-16 w-16 text-[#041A44] mb-4 animate-spin" />
              <p className="text-lg font-semibold text-gray-700">Loading students...</p>
            </div>
          ) : users.length === 0 ? (
            <div className="text-center py-12">
              <Users className="mx-auto h-16 w-16 text-gray-400 mb-4" />
              <p className="text-lg font-semibold text-gray-700">No students found</p>
              <p className="text-sm text-gray-500 mt-2">No students registered in this department yet</p>
            </div>
          ) : (
            <>
              {/* Mobile Card List */}
              <div className="md:hidden space-y-3">
                {users.map((user) => (
                  <div
                    key={user.id}
                    className="rounded-2xl bg-white shadow-sm ring-1 ring-gray-100 overflow-hidden flex flex-col gap-3"
                  >
                    <div className="flex items-center gap-3 bg-gradient-to-r from-[#041A44] via-[#0d2f7b] to-[#123a91] px-3 py-2">
                      {user.profilePicture ? (
                        <img
                          src={user.profilePicture}
                          alt={`${user.firstName} {user.lastName}`}
                          className="h-11 w-11 rounded-full object-cover border-2 border-white/80"
                        />
                      ) : (
                        <div className="h-11 w-11 rounded-full bg-purple-500 flex items-center justify-center text-white font-semibold text-sm border-2 border-white/60">
                          {getInitials(user.firstName, user.lastName)}
                        </div>
                      )}
                      <div className="min-w-0">
                        <p className="text-sm font-semibold text-white leading-tight truncate">
                          {user.firstName} {user.lastName}
                        </p>
                      </div>
                    </div>
                    <div className="flex flex-wrap gap-2 px-3 pb-3">
                      <button
                        type="button"
                        onClick={() => {
                          setSelectedUser(user)
                          setShowAddViolation(false)
                          setShowViewViolations(false)
                          setShowStudentDetails(true)
                        }}
                        className="flex-1 min-w-[48%] inline-flex items-center justify-center rounded-lg bg-[#041A44] text-white text-xs font-semibold px-3 py-2 shadow-sm"
                      >
                        View Student
                      </button>
                      <button
                        type="button"
                        onClick={async () => {
                          setSelectedUser(user)
                          setShowStudentDetails(false)
                          setShowViewViolations(true)
                          await fetchUserViolations(user.id)
                        }}
                        className="flex-1 min-w-[48%] inline-flex items-center justify-center rounded-lg border border-blue-200 bg-blue-50 text-blue-700 text-xs font-semibold px-3 py-2 shadow-sm"
                      >
                        Violations
                      </button>
                      <button
                        type="button"
                        onClick={() => {
                          setSelectedUser(user)
                          setShowStudentDetails(false)
                          setShowViewViolations(false)
                          setShowAddViolation(true)
                        }}
                        className="w-full inline-flex items-center justify-center rounded-lg border border-gray-200 bg-white text-[#041A44] text-xs font-semibold px-3 py-2 shadow-sm"
                      >
                        Add Violation
                      </button>
                    </div>
                  </div>
                ))}
              </div>

              {/* Desktop Table */}
              <div className="overflow-x-auto rounded-2xl border border-gray-100 shadow-sm hidden md:block">
                <table className="min-w-full divide-y divide-gray-100 text-left text-xs md:text-sm">
                <thead className="bg-[#041A44] text-white">
                  <tr>
                    <th className="px-3 md:px-6 py-2 md:py-4 font-semibold uppercase tracking-wide text-[10px] md:text-sm">
                      <div className="flex items-center gap-1.5 md:gap-2">
                        <User className="h-3 w-3 md:h-4 md:w-4" />
                        NAME
                      </div>
                    </th>
                    <th className="px-3 md:px-6 py-2 md:py-4 font-semibold uppercase tracking-wide text-[10px] md:text-sm hidden lg:table-cell">
                      <div className="flex items-center gap-1.5 md:gap-2">
                        <Mail className="h-3 w-3 md:h-4 md:w-4" />
                        EMAIL
                      </div>
                    </th>
                    <th className="px-3 md:px-6 py-2 md:py-4 font-semibold uppercase tracking-wide text-[10px] md:text-sm">
                      <div className="flex items-center gap-1.5 md:gap-2">
                        <Building className="h-3 w-3 md:h-4 md:w-4" />
                        DEPARTMENT
                      </div>
                    </th>
                    <th className="px-3 md:px-6 py-2 md:py-4 font-semibold uppercase tracking-wide text-[10px] md:text-sm hidden lg:table-cell">
                      <div className="flex items-center gap-1.5 md:gap-2">
                        <GraduationCap className="h-3 w-3 md:h-4 md:w-4" />
                        COURSE
                      </div>
                    </th>
                    <th className="px-3 md:px-6 py-2 md:py-4 font-semibold uppercase tracking-wide text-[10px] md:text-sm hidden md:table-cell">
                      <div className="flex items-center gap-1.5 md:gap-2">
                        <GraduationCap className="h-3 w-3 md:h-4 md:w-4" />
                        YEAR LEVEL
                      </div>
                    </th>
                    <th className="px-3 md:px-6 py-2 md:py-4 font-semibold uppercase tracking-wide text-[10px] md:text-sm hidden md:table-cell">
                      <div className="flex items-center gap-1.5 md:gap-2">
                        <Calendar className="h-3 w-3 md:h-4 md:w-4" />
                        CREATED AT
                      </div>
                    </th>
                    <th className="px-3 md:px-6 py-2 md:py-4 font-semibold uppercase tracking-wide text-center text-[10px] md:text-sm hidden md:table-cell">
                      <div className="flex items-center justify-center gap-1.5 md:gap-2">
                        <Settings className="h-3 w-3 md:h-4 md:w-4" />
                        ACTIONS
                      </div>
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100 bg-white">
                  {users.map((user) => (
                    <tr 
                      key={user.id} 
                      className="hover:bg-gray-50/60 transition relative"
                      onMouseEnter={() => setHoveredUserId(user.id)}
                      onMouseLeave={() => setHoveredUserId(null)}
                      onTouchStart={(e) => handleLongPressStart(user.id, e)}
                      onTouchEnd={handleLongPressEnd}
                      onTouchCancel={handleLongPressEnd}
                      onContextMenu={(e) => e.preventDefault()}
                    >
                      <td className="px-3 md:px-6 py-2 md:py-5">
                        <div className="flex items-center gap-2 md:gap-3">
                          {user.profilePicture ? (
                            <img
                              src={user.profilePicture}
                              alt={`${user.firstName} ${user.lastName}`}
                              className="h-7 w-7 md:h-10 md:w-10 rounded-full object-cover"
                            />
                          ) : (
                            <div className="h-7 w-7 md:h-10 md:w-10 rounded-full bg-purple-500 flex items-center justify-center text-white font-semibold text-xs md:text-sm">
                              {getInitials(user.firstName, user.lastName)}
                            </div>
                          )}
                          <span className="text-xs md:text-sm font-semibold text-[#041A44]">
                            {user.firstName} {user.lastName}
                          </span>
                        </div>
                      </td>
                      <td className="px-3 md:px-6 py-2 md:py-5 text-xs md:text-sm text-gray-600 truncate max-w-[200px] md:max-w-none hidden lg:table-cell" title={user.email}>{user.email}</td>
                      <td className="px-3 md:px-6 py-2 md:py-5 text-xs md:text-sm font-semibold text-[#041A44]">{user.department}</td>
                      <td className="px-3 md:px-6 py-2 md:py-5 hidden lg:table-cell text-xs md:text-sm text-gray-600">
                        {user.course ? (
                          <span className="font-semibold text-[#041A44]">{user.course}</span>
                        ) : (
                          <span className="italic text-gray-400">Pending approval</span>
                        )}
                      </td>
                      <td className="px-3 md:px-6 py-2 md:py-5 hidden md:table-cell">
                        <span className="text-xs md:text-sm text-blue-600 font-medium cursor-pointer hover:underline">
                          {formatYearLevel(user.yearLevel)}
                        </span>
                      </td>
                      <td className="px-3 md:px-6 py-2 md:py-5 text-xs md:text-sm text-gray-500 hidden md:table-cell">{user.formattedDate}</td>
                      {/* Desktop Action Buttons */}
                      <td className="px-3 md:px-6 py-2 md:py-5 text-xs md:text-sm hidden md:table-cell">
                        <div className="flex items-center justify-center gap-2 md:gap-3">
                          <button
                            type="button"
                            onClick={async () => {
                              setSelectedUser(user)
                              setShowViewViolations(true)
                              await fetchUserViolations(user.id)
                            }}
                            className="rounded-lg border border-blue-200 bg-blue-50 px-3 md:px-4 py-1.5 md:py-2 text-blue-600 text-xs md:text-sm font-medium transition hover:bg-blue-100 flex items-center gap-1.5 md:gap-2"
                          >
                            <Eye className="h-3.5 w-3.5 md:h-4 md:w-4" />
                            View
                          </button>
                          <button
                            type="button"
                            onClick={() => {
                              setSelectedUser(user)
                              setShowAddViolation(true)
                            }}
                            className="rounded-lg border border-blue-200 bg-blue-50 px-3 md:px-4 py-1.5 md:py-2 text-blue-600 text-xs md:text-sm font-medium transition hover:bg-blue-100 flex items-center gap-1.5 md:gap-2"
                          >
                            <Plus className="h-3.5 w-3.5 md:h-4 md:w-4" />
                            Add Violation
                          </button>
                        </div>
                      </td>
                      {/* Mobile Action Menu - Appears on long press */}
                      <td className="md:hidden relative">
                        {(longPressUserId === user.id || hoveredUserId === user.id) && (
                          <div className="absolute right-2 top-1/2 -translate-y-1/2 z-50">
                            <div className="bg-gray-800 rounded-lg px-2 py-1.5 flex items-center gap-1.5 shadow-xl">
                              <button
                                onClick={async () => {
                                  setSelectedUser(user)
                                  setShowViewViolations(true)
                                  await fetchUserViolations(user.id)
                                  setLongPressUserId(null)
                                  setHoveredUserId(null)
                                }}
                                className="flex flex-col items-center gap-0.5 px-2 py-1 rounded hover:bg-gray-700 active:bg-gray-600 transition-colors touch-manipulation"
                                title="View"
                              >
                                <Eye className="h-3.5 w-3.5 text-blue-400" />
                                <span className="text-[8px] text-white font-medium">View</span>
                              </button>
                              <button
                                onClick={() => {
                                  setSelectedUser(user)
                                  setShowAddViolation(true)
                                  setLongPressUserId(null)
                                  setHoveredUserId(null)
                                }}
                                className="flex flex-col items-center gap-0.5 px-2 py-1 rounded hover:bg-gray-700 active:bg-gray-600 transition-colors touch-manipulation"
                                title="Add Violation"
                              >
                                <Plus className="h-3.5 w-3.5 text-green-400" />
                                <span className="text-[8px] text-white font-medium">Add</span>
                              </button>
                            </div>
                          </div>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
                </table>
              </div>
            </>
          )}
        </div>
      </section>

      {/* Recent Violations Section */}
      <section className="rounded-3xl bg-white shadow-lg ring-1 ring-black/5">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center border-b border-gray-100 bg-gradient-to-r from-[#041A44] via-[#0d2f7b] to-[#123a91] px-5 py-5 md:px-8 md:py-6 text-white">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 md:h-12 md:w-12 items-center justify-center rounded-2xl bg-white/20">
              <AlertCircle className="h-5 w-5 md:h-6 md:w-6" />
            </div>
            <div>
              <h3 className="text-lg md:text-xl font-semibold">Recent Violations</h3>
              <p className="text-xs md:text-sm text-white/80">View and manage student violations</p>
            </div>
          </div>
          <div className="relative w-full sm:w-auto sm:ml-auto">
            <select
              value={violationStatusFilter}
              onChange={(e) => setViolationStatusFilter(e.target.value)}
              className="appearance-none bg-white/20 border border-white/30 rounded-lg px-4 py-2 pr-8 text-white text-xs md:text-sm w-full sm:w-auto focus:outline-none focus:ring-2 focus:ring-white/50"
            >
              <option value="all" className="text-gray-900">All Status</option>
              <option value="pending" className="text-gray-900">Pending</option>
              <option value="warning" className="text-gray-900">Warning</option>
              <option value="resolved" className="text-gray-900">Resolved</option>
            </select>
            <ChevronDown className="absolute right-2 top-1/2 transform -translate-y-1/2 h-4 w-4 text-white pointer-events-none" />
          </div>
        </div>

        <div className="overflow-hidden px-8 pb-8 pt-6">
          {showInitialViolationsLoader ? (
            <div className="text-center py-12">
              <RefreshCw className="mx-auto h-16 w-16 text-[#041A44] mb-4 animate-spin" />
              <p className="text-lg font-semibold text-gray-700">Loading violations...</p>
            </div>
          ) : violations.length === 0 ? (
            <div className="text-center py-12">
              <CheckCircle2 className="mx-auto h-16 w-16 text-green-500 mb-4" />
              <p className="text-lg font-semibold text-gray-700">No violations found. All students are following the rules!</p>
            </div>
          ) : (
            <>
              {/* Mobile Card Layout */}
              <div className="space-y-3 md:hidden">
                {violations.map((violation) => {
                  const studentInitials = violation.studentName
                    .split(" ")
                    .map((n: string) => n[0])
                    .join("")
                    .toUpperCase()
                    .slice(0, 2)
                  const normalizedStatus = normalizeStatus(violation.status)
                  const isResolved = normalizedStatus === "resolved"

                  return (
                    <div key={violation.id} className="rounded-2xl border border-gray-100 bg-white shadow-sm overflow-hidden">
                      <div className="flex items-center gap-3 bg-gradient-to-r from-[#041A44] via-[#0d2f7b] to-[#123a91] px-3 py-2">
                        <div className="h-10 w-10 rounded-full bg-orange-500 flex items-center justify-center text-white font-semibold text-sm border-2 border-white/70">
                          {studentInitials}
                        </div>
                        <div className="min-w-0">
                          <p className="text-sm font-semibold text-white truncate">{violation.studentName}</p>
                        </div>
                      </div>
                        <div className="p-4">
                          <div className="mt-1 flex flex-wrap gap-2">
                            <button
                              type="button"
                              onClick={() => {
                                setSelectedViolation(violation)
                                setShowViolationDetails(true)
                              }}
                              className="flex-1 min-w-[30%] inline-flex items-center justify-center rounded-lg border border-blue-200 bg-blue-50 px-3 py-2 text-xs font-semibold text-blue-700 shadow-sm"
                            >
                              View
                            </button>
                            <div className="relative flex-1 min-w-[30%] violation-status-dropdown">
                              <button
                                type="button"
                                onClick={() =>
                                  setOpenStatusDropdownId((prev) =>
                                    prev === `mobile-${violation.id}` ? null : `mobile-${violation.id}`,
                                  )
                                }
                                className={`w-full inline-flex items-center justify-between rounded-full px-3 py-2 text-xs font-semibold border ${getStatusClasses(
                                  violation.status,
                                )}`}
                              >
                                <span className="flex items-center gap-1">
                                  <Check className="h-3 w-3" />
                                  Status
                                </span>
                                <ChevronDown className="h-3 w-3" />
                              </button>
                              {openStatusDropdownId === `mobile-${violation.id}` && (
                                <div className="absolute z-30 mt-2 w-36 rounded-2xl border border-gray-100 bg-white shadow-xl">
                                  {statusOptions.map((statusOption) => (
                                    <button
                                      key={statusOption}
                                      type="button"
                                  onClick={() => {
                                        setOpenStatusDropdownId(null)
                                        if (normalizedStatus === statusOption) return
                                    handleStatusUpdate(violation, statusOption)
                                      }}
                                      className={`flex w-full items-center justify-between px-4 py-2 text-xs font-medium transition ${
                                        normalizedStatus === statusOption
                                          ? "bg-green-50 text-green-600 font-semibold rounded-xl"
                                          : "text-gray-600 hover:bg-gray-50"
                                      }`}
                                    >
                                      <span>{formatStatusLabel(statusOption)}</span>
                                      {normalizedStatus === statusOption && <Check className="h-3 w-3 text-green-500" />}
                                    </button>
                                  ))}
                                </div>
                              )}
                            </div>
                        <button
                          type="button"
                          onClick={() => {
                            setDeleteViolationTarget({ id: violation.id, studentName: violation.studentName })
                            setShowViolationDeleteModal(true)
                          }}
                          className="flex-1 min-w-[30%] inline-flex items-center justify-center rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-xs font-semibold text-red-600 shadow-sm"
                        >
                          Delete
                        </button>
                      </div>
                      </div>
                    </div>
                  )
                })}
              </div>

              {/* Desktop Table */}
              <div
                className="hidden md:block rounded-2xl border border-gray-100 shadow-sm"
                style={{ overflow: "visible" }}
              >
                <div className="overflow-x-auto" style={{ overflowY: "visible" }}>
                  <table className="min-w-full divide-y divide-gray-100 text-left text-xs md:text-sm">
                <thead className="bg-[#041A44] text-white">
                  <tr>
                    <th className="px-3 md:px-6 py-2 md:py-4 font-semibold uppercase tracking-wide text-[10px] md:text-sm">
                      <div className="flex items-center gap-1.5 md:gap-2">
                        <User className="h-3 w-3 md:h-4 md:w-4" />
                        STUDENT
                      </div>
                    </th>
                    <th className="px-3 md:px-6 py-2 md:py-4 font-semibold uppercase tracking-wide text-[10px] md:text-sm hidden md:table-cell">
                      <div className="flex items-center gap-1.5 md:gap-2">
                        <AlertCircle className="h-3 w-3 md:h-4 md:w-4" />
                        VIOLATION
                      </div>
                    </th>
                    <th className="px-3 md:px-6 py-2 md:py-4 font-semibold uppercase tracking-wide text-[10px] md:text-sm">
                      <div className="flex items-center gap-1.5 md:gap-2">
                        <CheckCircle2 className="h-3 w-3 md:h-4 md:w-4" />
                        STATUS
                      </div>
                    </th>
                    <th className="px-3 md:px-6 py-2 md:py-4 font-semibold uppercase tracking-wide text-[10px] md:text-sm hidden md:table-cell">
                      <div className="flex items-center gap-1.5 md:gap-2">
                        <User className="h-3 w-3 md:h-4 md:w-4" />
                        MANAGED BY
                      </div>
                    </th>
                    <th className="px-3 md:px-6 py-2 md:py-4 font-semibold uppercase tracking-wide text-[10px] md:text-sm hidden md:table-cell">
                      <div className="flex items-center gap-1.5 md:gap-2">
                        <Calendar className="h-3 w-3 md:h-4 md:w-4" />
                        DATE
                      </div>
                    </th>
                    <th className="px-3 md:px-6 py-2 md:py-4 font-semibold uppercase tracking-wide text-center text-[10px] md:text-sm hidden md:table-cell">
                      <div className="flex items-center justify-center gap-1.5 md:gap-2">
                        <Settings className="h-3 w-3 md:h-4 md:w-4" />
                        ACTIONS
                      </div>
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100 bg-white">
                  {violations.map((violation) => {
                    const studentInitials = violation.studentName
                      .split(" ")
                      .map((n: string) => n[0])
                      .join("")
                      .toUpperCase()
                      .slice(0, 2)
                    const [firstName, ...lastNameParts] = violation.studentName.split(" ")
                    const lastName = lastNameParts.join(" ")
                    const normalizedStatus = normalizeStatus(violation.status)
                    
                    return (
                      <tr 
                        key={violation.id} 
                        className="hover:bg-gray-50/60 transition relative md:cursor-default cursor-pointer"
                        onMouseEnter={() => setHoveredViolationId(violation.id)}
                        onMouseLeave={() => setHoveredViolationId(null)}
                        onClick={(e) => {
                          // On mobile, clicking the row opens the view modal
                          if (window.innerWidth < 768 && !e.currentTarget.closest('button')) {
                            setSelectedViolation(violation)
                            setShowViolationDetails(true)
                          }
                        }}
                        onTouchStart={(e) => handleViolationLongPressStart(violation.id, e)}
                        onTouchEnd={handleViolationLongPressEnd}
                        onTouchCancel={handleViolationLongPressEnd}
                        onContextMenu={(e) => e.preventDefault()}
                      >
                        <td className="px-3 md:px-6 py-2 md:py-5">
                          <div className="flex items-center gap-2 md:gap-3">
                            <div className="h-7 w-7 md:h-10 md:w-10 rounded-full bg-orange-500 flex items-center justify-center text-white font-semibold text-xs md:text-sm">
                              {studentInitials}
                            </div>
                            <span className="text-xs md:text-sm font-semibold text-[#041A44]">{violation.studentName}</span>
                          </div>
                        </td>
                        <td className="px-3 md:px-6 py-2 md:py-5 text-xs md:text-sm text-gray-600 hidden md:table-cell">{violation.violationType || violation.violation}</td>
                        <td className="px-3 md:px-6 py-2 md:py-5">
                          <span
                            className={`inline-flex items-center px-2 md:px-3 py-0.5 md:py-1 rounded-full text-[10px] md:text-xs font-medium ${getStatusBadgeClasses(
                              violation.status,
                            )}`}
                          >
                            {formatStatusLabel(violation.status).toUpperCase()}
                          </span>
                        </td>
                        <td className="px-3 md:px-6 py-2 md:py-5 hidden md:table-cell">
                          <div className="text-xs md:text-sm text-gray-600">
                            <div className="font-medium">{violation.managedByName}</div>
                            {violation.approverTitle && (
                              <div className="text-[10px] md:text-xs text-gray-500">{violation.approverTitle}</div>
                            )}
                            {!violation.approverTitle && (
                              <div className="text-[10px] md:text-xs text-gray-500">Admin</div>
                            )}
                          </div>
                        </td>
                        <td className="px-3 md:px-6 py-2 md:py-5 text-xs md:text-sm text-gray-500 hidden md:table-cell">{violation.date}</td>
                        {/* Desktop Action Buttons */}
                        <td className="px-3 md:px-6 py-2 md:py-5 text-xs md:text-sm hidden md:table-cell">
                          <div className="flex items-center justify-center gap-2">
                            <div className="relative violation-status-dropdown">
                              <button
                                type="button"
                                onClick={() =>
                                  setOpenStatusDropdownId((prev) =>
                                    prev === `table-${violation.id}` ? null : `table-${violation.id}`,
                                  )
                                }
                                className={`inline-flex items-center gap-1 rounded-full px-3 py-1 text-xs font-semibold border ${getStatusClasses(
                                  violation.status,
                                )}`}
                              >
                                <Check className="h-3 w-3" />
                                Status
                                <ChevronDown className="h-3 w-3" />
                              </button>
                              {openStatusDropdownId === `table-${violation.id}` && (
                                <div className="absolute z-30 mt-2 w-40 rounded-2xl border border-gray-100 bg-white shadow-xl">
                                  {statusOptions.map((statusOption) => (
                                    <button
                                      key={statusOption}
                                      type="button"
                                        onClick={() => {
                                        setOpenStatusDropdownId(null)
                                        if (normalizedStatus === statusOption) return
                                          handleStatusUpdate(violation, statusOption)
                                      }}
                                      className={`flex w-full items-center justify-between px-4 py-2 text-xs font-medium transition ${
                                        normalizedStatus === statusOption
                                          ? "bg-green-50 text-green-600 font-semibold rounded-xl"
                                          : "text-gray-600 hover:bg-gray-50"
                                      }`}
                                    >
                                      <span>{formatStatusLabel(statusOption)}</span>
                                      {normalizedStatus === statusOption && <Check className="h-3 w-3 text-green-500" />}
                                    </button>
                                  ))}
                                </div>
                              )}
                            </div>
                            <button
                              type="button"
                              onClick={() => {
                                setDeleteViolationTarget({ id: violation.id, studentName: violation.studentName })
                                setShowViolationDeleteModal(true)
                              }}
                              className="rounded-lg border border-red-200 bg-white px-3 md:px-3 py-1.5 md:py-1.5 text-red-600 text-xs md:text-xs font-medium transition hover:bg-red-50 flex items-center gap-1.5"
                            >
                              <Trash2 className="h-3.5 w-3.5" />
                              Delete
                            </button>
                          </div>
                        </td>
                        {/* Mobile Action Menu - Appears on long press */}
                        <td className="md:hidden relative">
                          {(longPressViolationId === violation.id || hoveredViolationId === violation.id) && (
                            <div className="absolute right-2 top-1/2 -translate-y-1/2 z-50">
                              <div className="bg-gray-800 rounded-lg px-2 py-1.5 flex items-center gap-1.5 shadow-xl">
                                <button
                                  onClick={(e) => {
                                    e.stopPropagation()
                                    setSelectedViolation(violation)
                                    setShowViolationDetails(true)
                                    setLongPressViolationId(null)
                                    setHoveredViolationId(null)
                                  }}
                                  className="flex flex-col items-center gap-0.5 px-2 py-1 rounded hover:bg-gray-700 active:bg-gray-600 transition-colors touch-manipulation"
                                  title="View"
                                >
                                  <Eye className="h-3.5 w-3.5 text-blue-400" />
                                  <span className="text-[8px] text-white font-medium">View</span>
                                </button>
                              </div>
                            </div>
                          )}
                        </td>
                      </tr>
                    )
                  })}
                </tbody>
              </table>
                </div>
              </div>
            </>
          )}
        </div>
      </section>

      {/* Violation Details Modal - Mobile Only */}
      {showViolationDetails && selectedViolation && (
        <div className="md:hidden fixed inset-0 bg-blue-900/30 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-xl max-w-lg w-full mx-4" style={{ maxHeight: "90vh", overflowY: "auto" }}>
            {/* Header */}
            <div className="sticky top-0 bg-white border-b border-gray-200 px-4 md:px-6 py-4 rounded-t-2xl flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="h-10 w-10 rounded-full bg-blue-100 flex items-center justify-center">
                  <AlertCircle className="h-5 w-5 text-blue-600" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-[#041A44]">Violation Details</h3>
                  <p className="text-xs text-gray-500 mt-0.5">View violation information</p>
                </div>
              </div>
              <button
                onClick={() => {
                  setShowViolationDetails(false)
                  setSelectedViolation(null)
                }}
                className="text-gray-400 hover:text-gray-600 transition"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            {/* Content */}
            <div className="px-4 md:px-6 py-6 space-y-4">
              {/* Student Name */}
              <div>
                <label className="flex items-center gap-2 text-xs font-medium text-gray-700 mb-2">
                  <User className="h-4 w-4 text-gray-500" />
                  Student Name
                </label>
                <div className="w-full rounded-lg border border-gray-200 bg-gray-50 px-3 py-2.5 text-xs text-gray-700">
                  {selectedViolation.studentName}
                </div>
              </div>

              {/* Violation */}
              <div>
                <label className="flex items-center gap-2 text-xs font-medium text-gray-700 mb-2">
                  <AlertCircle className="h-4 w-4 text-gray-500" />
                  Violation
                </label>
                <div className="w-full rounded-lg border border-gray-200 bg-gray-50 px-3 py-2.5 text-xs text-gray-700 text-justify md:text-left">
                  {selectedViolation.violationType || selectedViolation.violation || "—"}
                </div>
              </div>

              {/* Status */}
              <div>
                <label className="flex items-center gap-2 text-xs font-medium text-gray-700 mb-2">
                  <CheckCircle2 className="h-4 w-4 text-gray-500" />
                  Status
                </label>
                <div className="w-full">
                  <span
                    className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium ${getStatusBadgeClasses(
                      selectedViolation.status,
                    )}`}
                  >
                    {formatStatusLabel(selectedViolation.status).toUpperCase()}
                  </span>
                </div>
              </div>

              {/* Managed By */}
              <div>
                <label className="flex items-center gap-2 text-xs font-medium text-gray-700 mb-2">
                  <User className="h-4 w-4 text-gray-500" />
                  Managed By
                </label>
                <div className="w-full rounded-lg border border-gray-200 bg-gray-50 px-3 py-2.5 text-xs text-gray-700">
                  <div className="font-medium">{selectedViolation.managedByName}</div>
                  {selectedViolation.approverTitle && (
                    <div className="text-[10px] text-gray-500 mt-1">{selectedViolation.approverTitle}</div>
                  )}
                  {!selectedViolation.approverTitle && (
                    <div className="text-[10px] text-gray-500 mt-1">Admin</div>
                  )}
                </div>
              </div>

              {/* Date */}
              <div>
                <label className="flex items-center gap-2 text-xs font-medium text-gray-700 mb-2">
                  <Calendar className="h-4 w-4 text-gray-500" />
                  Date
                </label>
                <div className="w-full rounded-lg border border-gray-200 bg-gray-50 px-3 py-2.5 text-xs text-gray-700">
                  {selectedViolation.date || "—"}
                </div>
              </div>

              {/* Notes */}
              {selectedViolation.notes && (
                <div>
                  <label className="flex items-center gap-2 text-xs font-medium text-gray-700 mb-2">
                    <ClipboardList className="h-4 w-4 text-gray-500" />
                    Notes
                  </label>
                  <div className="w-full rounded-lg border border-gray-200 bg-gray-50 px-3 py-2.5 text-xs text-gray-700 text-justify md:text-left">
                    {selectedViolation.notes}
                  </div>
                </div>
              )}

              {/* Action Buttons */}
              <div className="flex flex-col gap-2 pt-4 border-t border-gray-200">
                {selectedViolation.status !== "resolved" && (
                  <button
                    type="button"
                    onClick={async () => {
                      try {
                        const response = await fetch(`/api/violations/${selectedViolation.id}`, {
                          method: "PATCH",
                          headers: { "Content-Type": "application/json" },
                          body: JSON.stringify({ status: "resolved" }),
                        })
                        const data = await response.json()
                        if (data.ok) {
                          alert("Violation resolved successfully!")
                          fetchViolations()
                          window.dispatchEvent(new CustomEvent("violationUpdated", { detail: { department } }))
                          setShowViolationDetails(false)
                          setSelectedViolation(null)
                        } else {
                          alert(data.error || "Failed to resolve violation")
                        }
                      } catch (error) {
                        console.error("Error resolving violation:", error)
                        alert("Failed to resolve violation. Please try again.")
                      }
                    }}
                    className="w-full rounded-lg border border-green-200 bg-green-50 px-4 py-2.5 text-green-700 text-xs font-medium transition hover:bg-green-100 flex items-center justify-center gap-2"
                  >
                    <Check className="h-4 w-4" />
                    Resolve
                  </button>
                )}
                <button
                  type="button"
                  onClick={() => {
                    setDeleteViolationTarget({ id: selectedViolation.id, studentName: selectedViolation.studentName })
                    setShowViolationDeleteModal(true)
                  }}
                  className="w-full rounded-lg border border-red-200 bg-white px-4 py-2.5 text-red-600 text-xs font-medium transition hover:bg-red-50 flex items-center justify-center gap-2"
                >
                  <Trash2 className="h-4 w-4" />
                  Delete
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* View Student Details Modal (Mobile) */}
      {showStudentDetails && selectedUser && (
        <div className="fixed inset-0 bg-blue-900/30 backdrop-blur-sm flex items-center justify-center z-50 p-4 md:hidden">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-sm mx-auto max-h-[90vh] overflow-y-auto p-5 space-y-5">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                {selectedUser.profilePicture ? (
                  <img
                    src={selectedUser.profilePicture}
                    alt={`${selectedUser.firstName} ${selectedUser.lastName}`}
                    className="h-12 w-12 rounded-full object-cover"
                  />
                ) : (
                  <div className="h-12 w-12 rounded-full bg-purple-500 text-white font-semibold flex items-center justify-center">
                    {getInitials(selectedUser.firstName, selectedUser.lastName)}
                  </div>
                )}
                <div>
                  <p className="text-base font-semibold text-[#041A44] leading-tight">
                    {selectedUser.firstName} {selectedUser.lastName}
                  </p>
                  {selectedUser.studentId && (
                    <p className="text-xs text-gray-500">ID: {selectedUser.studentId}</p>
                  )}
                </div>
              </div>
              <button
                onClick={() => {
                  setShowStudentDetails(false)
                  setSelectedUser(null)
                }}
                className="text-gray-400 hover:text-gray-600 transition"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <div className="space-y-3">
              {[
                { label: "Email", value: selectedUser.email || "—", icon: Mail },
                { label: "Department", value: selectedUser.department || "—", icon: Building },
                { label: "Year Level", value: formatYearLevel(selectedUser.yearLevel) || "—", icon: GraduationCap },
                { label: "Course", value: selectedUser.course || "Pending admin approval", icon: BookOpen },
                { label: "Date Created", value: selectedUser.formattedDate || "—", icon: Calendar },
              ].map(({ label, value, icon: DetailIcon }) => (
                <div key={label} className="rounded-xl border border-gray-100 bg-gray-50 px-3 py-2.5">
                  <p className="text-[11px] font-medium text-gray-500 flex items-center gap-2 mb-1">
                    <DetailIcon className="h-3.5 w-3.5 text-gray-400" />
                    {label}
                  </p>
                  <p className="text-sm font-semibold text-[#041A44] break-words">{value}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Add Violation Modal */}
      {showAddViolation && selectedUser && (
        <div className="fixed inset-0 bg-blue-900/30 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-md md:max-w-lg mx-auto max-h-[90vh] overflow-hidden flex flex-col">
            {/* Header */}
            <div className="bg-white border-b border-gray-200 px-4 md:px-6 py-3 md:py-4 rounded-t-2xl flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="h-10 w-10 rounded-full bg-blue-100 flex items-center justify-center">
                  <AlertCircle className="h-5 w-5 text-blue-600" />
                </div>
                <div>
                  <h3 className="text-lg md:text-xl font-semibold text-[#041A44]">Add New Violation</h3>
                  <p className="text-xs text-gray-500 mt-0.5">
                    Record a new violation with required approver information for accountability
                  </p>
                </div>
              </div>
              <button
                onClick={() => {
                  setShowAddViolation(false)
                  setSelectedUser(null)
                  setViolationForm({ violation: "", violationType: "", status: "pending", notes: "", approverName: "", approverTitle: "" })
                }}
                className="text-gray-400 hover:text-gray-600 transition"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            {/* Form Content */}
            <div className="px-4 md:px-6 py-4 md:py-6 space-y-4 overflow-y-auto">
              {/* Student Name */}
              <div>
                <label className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-2">
                  <User className="h-4 w-4 text-gray-500" />
                  Student Name
                </label>
                <input
                  type="text"
                  value={`${selectedUser.firstName} ${selectedUser.lastName}`}
                  readOnly
                  className="w-full rounded-lg border border-gray-200 bg-gray-50 px-3 md:px-4 py-2.5 md:py-3 text-sm text-gray-700 cursor-not-allowed"
                />
              </div>

              {/* Violation Type */}
              <div>
                <label className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-2">
                  <AlertCircle className="h-4 w-4 text-gray-500" />
                  Violation Type
                </label>
                <div className="relative">
                  <select
                    value={violationForm.violationType}
                    onChange={(e) => setViolationForm({ ...violationForm, violationType: e.target.value })}
                    className="w-full rounded-lg border border-gray-200 px-3 md:px-4 py-2.5 md:py-3 pr-10 text-sm text-gray-700 appearance-none bg-white focus:border-[#041A44] focus:outline-none focus:ring-2 focus:ring-[#041A44]/20 cursor-pointer"
                  >
                    <option value="">Select Violation Type</option>
                    <option value="Attendance">Attendance</option>
                    <option value="Behavior">Behavior</option>
                    <option value="Uniform">Uniform</option>
                    <option value="Academic">Academic</option>
                    <option value="Others">Others</option>
                  </select>
                  <ChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400 pointer-events-none" />
                </div>
              </div>

              {/* Description */}
              <div>
                <label className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-2">
                  <ClipboardList className="h-4 w-4 text-gray-500" />
                  Description
                </label>
                <textarea
                  value={violationForm.violation}
                  onChange={(e) => setViolationForm({ ...violationForm, violation: e.target.value })}
                  rows={4}
                  className="w-full rounded-lg border border-gray-200 px-3 md:px-4 py-2.5 md:py-3 text-sm text-gray-700 focus:border-[#041A44] focus:outline-none focus:ring-2 focus:ring-[#041A44]/20 resize-y"
                  placeholder="Provide a detailed description of the violation..."
                />
              </div>

              {/* Approver Information */}
              <div>
                <label className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-2">
                  <User className="h-4 w-4 text-gray-500" />
                  Approver Information (Required)
                </label>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  <div>
                    <input
                      type="text"
                      value={violationForm.approverName}
                      onChange={(e) => setViolationForm({ ...violationForm, approverName: e.target.value })}
                      className="w-full rounded-lg border border-gray-200 px-3 md:px-4 py-2.5 md:py-3 text-sm text-gray-700 focus:border-[#041A44] focus:outline-none focus:ring-2 focus:ring-[#041A44]/20"
                      placeholder="Approver Name"
                    />
                  </div>
                  <div>
                    <input
                      type="text"
                      value={violationForm.approverTitle}
                      onChange={(e) => setViolationForm({ ...violationForm, approverTitle: e.target.value })}
                      className="w-full rounded-lg border border-gray-200 px-3 md:px-4 py-2.5 md:py-3 text-sm text-gray-700 focus:border-[#041A44] focus:outline-none focus:ring-2 focus:ring-[#041A44]/20"
                      placeholder="Title/Position"
                    />
                  </div>
                </div>
              </div>

              {/* Additional Notes */}
              <div>
                <label className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-2">
                  <ClipboardList className="h-4 w-4 text-gray-500" />
                  Additional Notes
                </label>
                <textarea
                  value={violationForm.notes}
                  onChange={(e) => setViolationForm({ ...violationForm, notes: e.target.value })}
                  rows={3}
                  className="w-full rounded-lg border border-gray-200 px-3 md:px-4 py-2.5 md:py-3 text-sm text-gray-700 focus:border-[#041A44] focus:outline-none focus:ring-2 focus:ring-[#041A44]/20 resize-y"
                  placeholder="Any additional context or notes..."
                />
              </div>
            </div>

            {/* Footer */}
            <div className="bg-white border-t border-gray-200 px-4 md:px-6 py-3 md:py-4 rounded-b-2xl flex flex-col md:flex-row gap-3 md:gap-0 md:justify-end">
              <button
                onClick={handleAddViolation}
                className="inline-flex w-full md:w-auto items-center justify-center gap-2 rounded-lg bg-[#041A44] px-4 md:px-6 py-2.5 md:py-3 text-sm font-medium text-white transition hover:bg-[#0b2c6f] shadow-md"
              >
                <ClipboardList className="h-4 w-4" />
                Create Violation
              </button>
            </div>
          </div>
        </div>
      )}

      {/* View Violations Modal */}
      {showViewViolations && selectedUser && (
        <div className="fixed inset-0 bg-blue-900/30 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-md md:max-w-7xl mx-auto max-h-[90vh] overflow-y-auto">
            {/* Header */}
            <div className="sticky top-0 bg-white border-b border-gray-200 px-4 md:px-6 py-3 md:py-4 rounded-t-2xl flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="h-10 w-10 rounded-full bg-blue-100 flex items-center justify-center">
                  <AlertCircle className="h-5 w-5 text-blue-600" />
                </div>
                <div>
                  <h3 className="text-base md:text-xl font-semibold text-[#041A44]">
                    <span className="md:hidden">Violation Details</span>
                    <span className="hidden md:inline">Violation Records - {selectedUser.firstName} {selectedUser.lastName}</span>
                  </h3>
                  <p className="text-xs text-gray-500 mt-0.5">
                    <span className="md:hidden">View violation information</span>
                    <span className="hidden md:inline">{selectedUser.studentId ? `Student ID: ${selectedUser.studentId}` : `Email: ${selectedUser.email}`}</span>
                  </p>
                </div>
              </div>
              <button
                onClick={() => {
                  setShowViewViolations(false)
                  setSelectedUser(null)
                  setUserViolations([])
                }}
                className="text-gray-400 hover:text-gray-600 transition"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            {/* Content */}
            <div className="px-4 md:px-6 py-6">
              {isLoadingUserViolations ? (
                <div className="text-center py-12">
                  <RefreshCw className="mx-auto h-12 w-12 text-[#041A44] mb-4 animate-spin" />
                  <p className="text-sm font-medium text-gray-700">Loading violations...</p>
                </div>
              ) : userViolations.length === 0 ? (
                <div className="text-center py-12">
                  <CheckCircle2 className="mx-auto h-12 w-12 text-green-500 mb-4" />
                  <p className="text-lg font-semibold text-gray-700">No violations found</p>
                  <p className="text-sm text-gray-500 mt-2">This student has a clean record.</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {/* Mobile View - Card Layout */}
                  <div className="md:hidden space-y-4">
                    {userViolations.map((violation) => (
                      <div key={violation.id} className="bg-white rounded-lg border border-gray-200 p-4 space-y-4">
                        {/* Student Name */}
                        <div>
                          <label className="flex items-center gap-2 text-xs font-medium text-gray-700 mb-2">
                            <User className="h-4 w-4 text-gray-500" />
                            Student Name
                          </label>
                          <div className="w-full rounded-lg border border-gray-200 bg-gray-50 px-3 py-2.5 text-xs text-gray-700">
                            {selectedUser.firstName} {selectedUser.lastName}
                          </div>
                        </div>

                        {/* Violation */}
                        <div>
                          <label className="flex items-center gap-2 text-xs font-medium text-gray-700 mb-2">
                            <AlertCircle className="h-4 w-4 text-gray-500" />
                            Violation
                          </label>
                          <div className="w-full rounded-lg border border-gray-200 bg-gray-50 px-3 py-2.5 text-xs text-gray-700 text-justify md:text-left">
                            {violation.violationType || violation.violation || "—"}
                          </div>
                        </div>

                        {/* Status */}
                        <div>
                          <label className="flex items-center gap-2 text-xs font-medium text-gray-700 mb-2">
                            <CheckCircle2 className="h-4 w-4 text-gray-500" />
                            Status
                          </label>
                          <div className="w-full">
                            <span
                              className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium ${getStatusBadgeClasses(
                                violation.status,
                              )}`}
                            >
                              {formatStatusLabel(violation.status).toUpperCase()}
                            </span>
                          </div>
                        </div>

                        {/* Managed By */}
                        <div>
                          <label className="flex items-center gap-2 text-xs font-medium text-gray-700 mb-2">
                            <User className="h-4 w-4 text-gray-500" />
                            Managed By
                          </label>
                          <div className="w-full rounded-lg border border-gray-200 bg-gray-50 px-3 py-2.5 text-xs text-gray-700">
                            <div className="font-medium">{violation.managedByName || "Admin"}</div>
                            {violation.approverTitle && (
                              <div className="text-[10px] text-gray-500 mt-1">{violation.approverTitle}</div>
                            )}
                            {!violation.approverTitle && (
                              <div className="text-[10px] text-gray-500 mt-1">Admin</div>
                            )}
                          </div>
                        </div>

                        {/* Date */}
                        <div>
                          <label className="flex items-center gap-2 text-xs font-medium text-gray-700 mb-2">
                            <Calendar className="h-4 w-4 text-gray-500" />
                            Date
                          </label>
                          <div className="w-full rounded-lg border border-gray-200 bg-gray-50 px-3 py-2.5 text-xs text-gray-700">
                            {violation.date || "—"}
                          </div>
                        </div>

                        {/* Notes */}
                        {violation.notes && (
                          <div>
                            <label className="flex items-center gap-2 text-xs font-medium text-gray-700 mb-2">
                              <ClipboardList className="h-4 w-4 text-gray-500" />
                              Notes
                            </label>
                            <div className="w-full rounded-lg border border-gray-200 bg-gray-50 px-3 py-2.5 text-xs text-gray-700 text-justify md:text-left">
                              {violation.notes}
                            </div>
                          </div>
                        )}
                      </div>
                    ))}
                  </div>

                  {/* Desktop View - Table Layout */}
                  <div className="hidden md:block overflow-x-auto rounded-2xl border border-gray-100 shadow-sm">
                    <table className="min-w-full divide-y divide-gray-100 text-left text-sm">
                      <thead className="bg-[#041A44] text-white">
                        <tr>
                          <th className="px-6 py-4 font-semibold uppercase tracking-wide">
                            <div className="flex items-center gap-2">
                              <Calendar className="h-4 w-4" />
                              DATE
                            </div>
                          </th>
                          <th className="px-6 py-4 font-semibold uppercase tracking-wide">
                            <div className="flex items-center gap-2">
                              <AlertCircle className="h-4 w-4" />
                              TYPE
                            </div>
                          </th>
                          <th className="px-6 py-4 font-semibold uppercase tracking-wide">
                            <div className="flex items-center gap-2">
                              <ClipboardList className="h-4 w-4" />
                              DESCRIPTION
                            </div>
                          </th>
                          <th className="px-6 py-4 font-semibold uppercase tracking-wide">
                            <div className="flex items-center gap-2">
                              <User className="h-4 w-4" />
                              MANAGED BY
                            </div>
                          </th>
                          <th className="px-6 py-4 font-semibold uppercase tracking-wide">
                            <div className="flex items-center gap-2">
                              <ClipboardList className="h-4 w-4" />
                              ADDITIONAL NOTES
                            </div>
                          </th>
                          <th className="px-6 py-4 font-semibold uppercase tracking-wide">
                            <div className="flex items-center gap-2">
                              <CheckCircle2 className="h-4 w-4" />
                              STATUS
                            </div>
                          </th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-gray-100 bg-white">
                        {userViolations.map((violation) => (
                          <tr key={violation.id} className="hover:bg-gray-50/60 transition">
                            <td className="px-6 py-5">
                              <div className="flex items-center gap-2">
                                <div className="h-2 w-2 rounded-full bg-blue-500"></div>
                                <span className="text-sm text-gray-700">{violation.date}</span>
                              </div>
                            </td>
                            <td className="px-6 py-5">
                              <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-red-100 text-red-800">
                                {violation.violationType || "N/A"}
                              </span>
                            </td>
                            <td className="px-6 py-5 text-sm text-gray-700 max-w-xs">
                              <div className="truncate text-justify md:text-left" title={violation.violation}>
                                {violation.violation}
                              </div>
                            </td>
                            <td className="px-6 py-5">
                              <div className="text-sm text-gray-700">
                                <div className="font-medium">{violation.managedByName || "Admin"}</div>
                                {violation.approverTitle && (
                                  <div className="text-xs text-gray-500">{violation.approverTitle}</div>
                                )}
                                {!violation.approverTitle && (
                                  <div className="text-xs text-gray-500">Admin</div>
                                )}
                              </div>
                            </td>
                            <td className="px-6 py-5 text-sm text-gray-600 max-w-xs">
                              <div className="truncate text-justify md:text-left" title={violation.notes || "No additional notes"}>
                                {violation.notes || "—"}
                              </div>
                            </td>
                            <td className="px-6 py-5">
                              <span
                                className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium ${getStatusBadgeClasses(
                                  violation.status,
                                )}`}
                              >
                                {formatStatusLabel(violation.status).toUpperCase()}
                              </span>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

// Records Section - Full page with department sub-header
function RecordsSection({ 
  initialDepartment, 
  onDepartmentChange 
}: { 
  initialDepartment: string | null
  onDepartmentChange: (dept: string) => void
}) {
  const departments = [
    { id: "ELEMENTARY", label: "Elementary", icon: BookOpen },
    { id: "JUNIOR HIGH", label: "Junior High", icon: GraduationCap },
    { id: "SENIOR HIGH", label: "Senior High", icon: Users },
    { id: "COLLEGE", label: "College", icon: Calendar },
  ]
  const [selectedDepartment, setSelectedDepartment] = useState<string>(initialDepartment || "ELEMENTARY")
  const [departmentCounts, setDepartmentCounts] = useState<Record<string, number>>({
    "ELEMENTARY": 0,
    "JUNIOR HIGH": 0,
    "SENIOR HIGH": 0,
    "COLLEGE": 0,
  })

  useEffect(() => {
    if (initialDepartment) {
      setSelectedDepartment(initialDepartment)
    }
  }, [initialDepartment])

  // Fetch user counts per department
  useEffect(() => {
    const fetchDepartmentCounts = async () => {
      try {
        const response = await fetch("/api/users/chat")
        const data = await response.json()
        if (data.ok && data.users) {
          const allUsers = data.users
          
          // Calculate counts per department
          const counts: Record<string, number> = {
            "ELEMENTARY": 0,
            "JUNIOR HIGH": 0,
            "SENIOR HIGH": 0,
            "COLLEGE": 0,
          }

          allUsers.forEach((user: any) => {
            const userDept = user.department
            if (userDept === "Elementary") {
              counts["ELEMENTARY"]++
            } else if (userDept === "Junior High School") {
              counts["JUNIOR HIGH"]++
            } else if (userDept === "Senior High School") {
              counts["SENIOR HIGH"]++
            } else if (userDept === "College") {
              counts["COLLEGE"]++
            }
          })

          setDepartmentCounts(counts)
        }
      } catch (error) {
        console.error("Error fetching department counts:", error)
      }
    }

    fetchDepartmentCounts()
  }, [])

  const handleDepartmentSelect = (dept: string) => {
    setSelectedDepartment(dept)
    onDepartmentChange(dept)
    // Update URL without page reload
    const params = new URLSearchParams(window.location.search)
    params.set("department", dept)
    window.history.pushState({}, "", `?${params.toString()}`)
  }

  const departmentLabels: Record<string, string> = {
    ELEMENTARY: "Elementary",
    "JUNIOR HIGH": "Junior High",
    "SENIOR HIGH": "Senior High",
    COLLEGE: "College",
  }

  return (
    <div className="space-y-6">
      {/* Sub-header with department navigation */}
      <div className="bg-gradient-to-r from-[#041A44] via-[#0d2f7b] to-[#123a91] rounded-2xl shadow-lg">
        <div className="px-6 py-4">
          <h2 className="text-2xl font-semibold text-white mb-4">Academic Records</h2>
          <div className="grid grid-cols-2 gap-3 sm:flex sm:flex-wrap">
            {departments.map((dept) => {
              const Icon = dept.icon
              const isActive = selectedDepartment === dept.id
              const userCount = departmentCounts[dept.id] || 0
              return (
                <button
                  key={dept.id}
                  onClick={() => handleDepartmentSelect(dept.id)}
                  className={`flex items-center gap-1.5 sm:gap-2 px-2 sm:px-3 py-2 rounded-lg transition-all w-full justify-between sm:justify-center text-xs sm:text-base sm:w-auto sm:justify-start whitespace-nowrap ${
                    isActive
                      ? "bg-white text-[#041A44] shadow-md"
                      : "bg-white/20 text-white hover:bg-white/30"
                  }`}
                >
                  <div className="flex items-center gap-1.5 sm:gap-2 flex-shrink-0">
                    <Icon className="h-4 w-4 sm:h-5 sm:w-5 flex-shrink-0" />
                    <span className="font-medium">{dept.label}</span>
                  </div>
                  {/* Show user count only on mobile */}
                  <span className="block sm:hidden text-xs font-semibold flex-shrink-0 ml-1">{userCount}</span>
                </button>
              )
            })}
          </div>
        </div>
      </div>

      {/* Department Records Content */}
      <DepartmentRecordsSection
        department={selectedDepartment}
        departmentLabel={departmentLabels[selectedDepartment] || selectedDepartment}
      />
    </div>
  )
}

type MetricCard = {
  label: string
  value: number
  icon: React.ComponentType<any>
  department: string
}
type RegisteredStudentsSeries = { department: string; students: number }
type ViolationDepartmentStat = { department: string; violations: number; noViolations: number }
type ViolationBreakdownSlice = { name: string; value: number; fill: string }
type TopViolatorStat = { studentId: string; name: string; department: string; count: number }

function DashboardSection({ onDepartmentClick }: { onDepartmentClick: (department: string) => void }) {
  const [metrics, setMetrics] = useState<MetricCard[]>([
    { label: "Elementary", value: 0, icon: GraduationCapIcon, department: "ELEMENTARY" },
    { label: "Junior High", value: 0, icon: BookReaderIcon, department: "JUNIOR HIGH" },
    { label: "Senior High", value: 0, icon: UserGraduateIcon, department: "SENIOR HIGH" },
    { label: "College", value: 0, icon: UniversityIcon, department: "COLLEGE" },
  ])
  const [registeredStudents, setRegisteredStudents] = useState<RegisteredStudentsSeries[]>([
    { department: "Elementary", students: 0 },
    { department: "Junior High", students: 0 },
    { department: "Senior High", students: 0 },
    { department: "College", students: 0 },
  ])
  const [violationPerDepartment, setViolationPerDepartment] = useState<ViolationDepartmentStat[]>([
    { department: "Elementary", violations: 0, noViolations: 0 },
    { department: "Junior High", violations: 0, noViolations: 0 },
    { department: "Senior High", violations: 0, noViolations: 0 },
    { department: "College", violations: 0, noViolations: 0 },
  ])
  const [violationBreakdown, setViolationBreakdown] = useState<ViolationBreakdownSlice[]>([
    { name: "Attendance", value: 0, fill: "#2563eb" },
    { name: "Behavior", value: 0, fill: "#f97316" },
    { name: "Uniform", value: 0, fill: "#ef4444" },
    { name: "Academic", value: 0, fill: "#22c55e" },
    { name: "Others", value: 0, fill: "#8b5cf6" },
  ])
  const [topViolators, setTopViolators] = useState<TopViolatorStat[]>([])
  const hasLoadedChartsRef = useRef(false)
  const fetchAbortControllerRef = useRef<AbortController | null>(null)

  const departmentLabels: Record<string, string> = {
    ELEMENTARY: "Elementary",
    "JUNIOR HIGH": "Junior High",
    "SENIOR HIGH": "Senior High",
    COLLEGE: "College",
  }

  const fetchDashboardData = useCallback(async () => {
    const controller = new AbortController()
    fetchAbortControllerRef.current?.abort()
    fetchAbortControllerRef.current = controller

    try {
      const response = await fetch("/api/analytics/dashboard", {
        cache: "no-store",
        signal: controller.signal,
      })

      if (!response.ok) {
        throw new Error("Failed to fetch analytics dashboard data")
      }

      const data = await response.json()
      if (!data?.ok) {
        throw new Error(data?.error || "Failed to read analytics dashboard data")
      }

      setMetrics((prev: MetricCard[]) =>
        prev.map((metric) => {
          const updated = data.metrics?.find((item: any) => item.department === metric.department)
          return { ...metric, value: updated?.count ?? 0 }
        }),
      )

      setRegisteredStudents((prev: RegisteredStudentsSeries[]) =>
        Array.isArray(data.registeredStudents) && data.registeredStudents.length > 0 ? data.registeredStudents : prev,
      )

      setViolationPerDepartment((prev: ViolationDepartmentStat[]) =>
        Array.isArray(data.violationPerDepartment) && data.violationPerDepartment.length > 0
          ? data.violationPerDepartment
          : prev,
      )

      const breakdown = Array.isArray(data.violationBreakdown) ? data.violationBreakdown : []
      setViolationBreakdown(
        breakdown.length > 0 ? breakdown : [{ name: "No Violations", value: 1, fill: "#CBD5F5" }],
      )

      setTopViolators(Array.isArray(data.topViolators) ? data.topViolators : [])
    } catch (error: any) {
      if (error?.name === "AbortError") {
        return
      }
      console.error("Error fetching dashboard data:", error)
    } finally {
      if (!controller.signal.aborted) {
        hasLoadedChartsRef.current = true
      }
      if (fetchAbortControllerRef.current === controller) {
        fetchAbortControllerRef.current = null
      }
    }
  }, [])

  useEffect(() => {
    fetchDashboardData()
    const interval = setInterval(fetchDashboardData, 30000) // Refresh every 30 seconds
    
    // Listen for violation events to refresh charts
    const handleViolationEvent = () => {
      fetchDashboardData()
    }
    
    window.addEventListener("violationCreated", handleViolationEvent as EventListener)
    window.addEventListener("violationDeleted", handleViolationEvent as EventListener)
    window.addEventListener("violationUpdated", handleViolationEvent as EventListener)
    
    return () => {
      clearInterval(interval)
      window.removeEventListener("violationCreated", handleViolationEvent as EventListener)
      window.removeEventListener("violationDeleted", handleViolationEvent as EventListener)
      window.removeEventListener("violationUpdated", handleViolationEvent as EventListener)
      fetchAbortControllerRef.current?.abort()
    }
  }, [fetchDashboardData])

  const refreshCharts = () => {
    fetchDashboardData()
  }

  return (
    <div>
      {/* Dashboard Header */}
      <div className="mb-6 md:mb-8">
        <h1 className="text-2xl md:text-3xl font-bold text-gray-900">Admin Dashboard</h1>
        <p className="text-xs md:text-base text-gray-600">Manage and monitor school enrollment and user records</p>
      </div>

      {/* Enrollment Statistics Cards */}
      <div className="grid grid-cols-1 gap-4 md:gap-6 mb-6 md:mb-8 md:grid-cols-4">
        {metrics.map((metric) => {
          const Icon = metric.icon
          return (
            <div
              key={metric.label}
              onClick={() => onDepartmentClick(metric.department)}
              className="bg-[#041A44] text-white p-4 md:p-6 rounded-lg cursor-pointer transition-colors"
            >
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-base md:text-lg font-medium">{metric.label}</h3>
                  <p className="text-xl md:text-2xl font-bold">{metric.value}</p>
                </div>
                <div className="w-10 h-10 md:w-12 md:h-12 bg-blue-100 rounded-full flex items-center justify-center">
                  <Icon size={18} className="md:w-5 md:h-5 text-blue-900" />
                </div>
              </div>
            </div>
          )
        })}
      </div>

      {/* Data Analytics Section */}
      <section className="mt-12">
        {/* Header Section */}
        <div className="mb-6 md:mb-10 flex flex-row items-start justify-between gap-2 sm:gap-3 md:gap-4">
          <div className="flex-1 min-w-0 sm:max-w-none">
            <h2 className="text-xl md:text-3xl font-semibold text-gray-900 mb-1 md:mb-1.5 tracking-tight">Data Analytics</h2>
            <p className="text-[10px] md:text-sm text-gray-500 font-light whitespace-nowrap sm:whitespace-normal">
              Comprehensive insights into student enrollment and violation patterns
            </p>
          </div>
          <button
            onClick={refreshCharts}
            className="inline-flex shrink-0 items-center justify-center gap-2 px-2 md:px-5 py-1.5 md:py-2.5 text-[11px] md:text-sm font-medium text-white rounded-lg shadow-md transition-all hover:shadow-lg active:scale-[0.98] self-start sm:self-auto w-fit sm:w-auto"
            style={{
              background: "linear-gradient(135deg, #041A44 0%, #0d2f7b 50%, #123a91 100%)",
            }}
          >
            <RefreshCw className="h-3.5 w-3.5 md:h-4 md:w-4 text-white" />
            Refresh Data
          </button>
        </div>

        {/* 2x2 Grid Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
          {/* Chart 1: Registered Students per Department */}
          <DashboardCard
            title="Registered Students per Department"
            subtitle="Total student enrollment across all departments"
            icon={Users}
          >
            {!hasLoadedChartsRef.current ? (
              <div className="flex h-[240px] md:h-[320px] items-center justify-center">
                <RefreshCw className="h-6 w-6 text-gray-400 animate-spin" />
              </div>
            ) : (
              <div className="h-[240px] md:h-[320px] w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={registeredStudents} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" vertical={false} />
                    <XAxis 
                      dataKey="department" 
                      tick={{ fill: "#64748b", fontSize: 11, fontWeight: 500 }} 
                      axisLine={false}
                      tickLine={false}
                    />
                    <YAxis 
                      allowDecimals={false} 
                      tick={{ fill: "#94a3b8", fontSize: 11 }} 
                      axisLine={false}
                      tickLine={false}
                    />
                    <Tooltip
                      contentStyle={{ 
                        borderRadius: 8, 
                        border: "1px solid #e2e8f0",
                        backgroundColor: "white",
                        boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.1)"
                      }}
                      labelStyle={{ fontWeight: 600, color: "#1e293b", fontSize: 12, marginBottom: 4 }}
                      itemStyle={{ color: "#475569", fontSize: 12 }}
                    />
                    <Bar dataKey="students" radius={[4, 4, 0, 0]} barSize={60}>
                      {registeredStudents.map((entry, index) => {
                        const colors = ["#3b82f6", "#2563eb", "#1d4ed8", "#1e40af"]
                        return <Cell key={`cell-${index}`} fill={colors[index % colors.length]} />
                      })}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              </div>
            )}
          </DashboardCard>

          {/* Chart 2: Students with Violations per Department */}
          <DashboardCard
            title="Students with Violations per Department"
            subtitle="Comparison of students with and without violations"
            icon={AlertCircle}
            mobileTitleClassName="text-[13px]"
          >
            {!hasLoadedChartsRef.current ? (
              <div className="flex h-[240px] md:h-[320px] items-center justify-center">
                <RefreshCw className="h-6 w-6 text-gray-400 animate-spin" />
              </div>
            ) : (
              <div className="h-[240px] md:h-[320px] w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart 
                    data={violationPerDepartment} 
                    margin={{ top: 10, right: 10, left: 0, bottom: 0 }}
                    barCategoryGap="20%"
                  >
                    <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" vertical={false} />
                    <XAxis 
                      dataKey="department" 
                      tick={{ fill: "#64748b", fontSize: 11, fontWeight: 500 }} 
                      axisLine={false}
                      tickLine={false}
                    />
                    <YAxis 
                      allowDecimals={false} 
                      tick={{ fill: "#94a3b8", fontSize: 11 }} 
                      axisLine={false}
                      tickLine={false}
                    />
                    <Tooltip
                      contentStyle={{ 
                        borderRadius: 8, 
                        border: "1px solid #e2e8f0",
                        backgroundColor: "white",
                        boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.1)"
                      }}
                      labelStyle={{ fontWeight: 600, color: "#1e293b", fontSize: 12, marginBottom: 4 }}
                      itemStyle={{ color: "#475569", fontSize: 12 }}
                    />
                    <Legend 
                      iconType="circle" 
                      wrapperStyle={{ paddingTop: "16px", fontSize: "11px" }}
                      iconSize={8}
                    />
                    <Bar dataKey="violations" fill="#ef4444" radius={[4, 4, 0, 0]} name="With Violations" barSize={44} />
                    <Bar dataKey="noViolations" fill="#3b82f6" radius={[4, 4, 0, 0]} name="Without Violations" barSize={44} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            )}
          </DashboardCard>

          {/* Chart 3: Violation Types Distribution */}
          <DashboardCard title="Violation Types Distribution" subtitle="Breakdown of violation categories" icon={CheckCircle2}>
            {!hasLoadedChartsRef.current ? (
              <div className="flex h-[240px] md:h-[320px] items-center justify-center">
                <RefreshCw className="h-6 w-6 text-gray-400 animate-spin" />
              </div>
            ) : (
              <div className="h-[240px] md:h-[320px] w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      dataKey="value"
                      data={violationBreakdown}
                      cx="50%"
                      cy="50%"
                      innerRadius={60}
                      outerRadius={100}
                      paddingAngle={3}
                      stroke="#ffffff"
                      strokeWidth={2}
                    >
                      {violationBreakdown.map((entry, index) => (
                        <Cell key={`cell-${entry.name}-${index}`} fill={entry.fill} />
                      ))}
                    </Pie>
                    <Tooltip
                      formatter={(value: number, name: string) => {
                        return [`${value}`, name]
                      }}
                      contentStyle={{ 
                        borderRadius: 8, 
                        border: "1px solid #e2e8f0",
                        backgroundColor: "white",
                        boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.1)"
                      }}
                      labelStyle={{ fontWeight: 600, color: "#1e293b", fontSize: 12 }}
                      itemStyle={{ color: "#475569", fontSize: 12 }}
                    />
                    <Legend
                      iconType="circle"
                      wrapperStyle={{ paddingTop: "16px", fontSize: "11px" }}
                      iconSize={8}
                      formatter={(value) => <span style={{ fontFamily: "Inter", fontSize: "11px", color: "#64748b" }}>{value}</span>}
                    />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            )}
          </DashboardCard>

          {/* Chart 4: Top 5 Students with Most Violations */}
          <DashboardCard title="Top 5 Students with Most Violations" subtitle="Students requiring immediate attention" icon={AlertCircle}>
            {!hasLoadedChartsRef.current ? (
              <div className="flex h-[240px] md:h-[320px] flex-col items-center justify-center gap-3 py-6">
                <RefreshCw className="h-6 w-6 text-gray-400 animate-spin" />
                <p className="text-xs text-gray-400">Loading...</p>
              </div>
            ) : topViolators.length === 0 ? (
              <div className="flex h-[240px] md:h-[320px] flex-col items-center justify-center gap-3 py-6">
                <div className="flex h-12 w-12 items-center justify-center rounded-full bg-gray-100 text-gray-400">
                  <AlertCircle className="h-6 w-6" />
                </div>
                <p className="text-sm font-medium text-gray-700">No Data Available</p>
                <p className="text-xs text-gray-400">0 violations recorded</p>
              </div>
            ) : (
              <div className="space-y-2 max-h-none md:max-h-none overflow-y-hidden md:overflow-y-auto pr-1">
                {topViolators.map((violator, index) => {
                  const rank = index + 1
                  const violationText = violator.count === 1 ? "violation" : "violations"
                  // Get department from user data if available
                  const department = violator.department || "College"
                  
                  return (
                    <div
                      key={violator.studentId || index}
                      className="flex items-center justify-between p-3 rounded-lg border border-gray-100"
                    >
                      <div className="flex items-center gap-3">
                        <div className="w-7 h-7 bg-red-50 text-red-600 rounded-md flex items-center justify-center text-xs font-semibold">
                          {rank}
                        </div>
                        <div>
                          <p className="text-sm font-medium text-gray-900">{violator.name}</p>
                          <p className="text-xs text-gray-500">{department}</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <span className="text-xs font-semibold text-red-600">
                          {violator.count} {violationText}
                        </span>
                      </div>
                    </div>
                  )
                })}
              </div>
            )}
          </DashboardCard>
        </div>
      </section>
    </div>
  )
}

function DashboardCard({
  title,
  subtitle,
  icon: Icon,
  children,
  mobileTitleClassName,
}: {
  title: string
  subtitle: string
  icon: React.ComponentType<{ className?: string }>
  children: React.ReactNode
  mobileTitleClassName?: string
}) {
  // Determine icon background color based on title
  const getIconBgColor = () => {
    if (title.includes("Registered Students")) return "bg-blue-50"
    if (title.includes("Students with Violations")) return "bg-red-50"
    if (title.includes("Violation Types")) return "bg-purple-50"
    if (title.includes("Top 5")) return "bg-orange-50"
    return "bg-gray-50"
  }

  const getIconColor = () => {
    if (title.includes("Registered Students")) return "text-blue-600"
    if (title.includes("Students with Violations")) return "text-red-600"
    if (title.includes("Violation Types")) return "text-purple-600"
    if (title.includes("Top 5")) return "text-orange-600"
    return "text-gray-600"
  }

  return (
    <div className="bg-white rounded-lg border border-gray-200 p-4 md:p-6 shadow-md">
      <div className="flex items-start gap-3 mb-4 md:mb-6">
        <div className={`w-8 h-8 md:w-9 md:h-9 ${getIconBgColor()} rounded-md flex items-center justify-center flex-shrink-0 mt-0.5`}>
          <Icon className={`${getIconColor()} text-sm md:text-base`} />
        </div>
        <div className="flex-1 min-w-0">
          <h3
            className={`${mobileTitleClassName ?? "text-sm"} md:text-lg font-semibold text-gray-900 mb-0.5 leading-tight whitespace-nowrap sm:whitespace-normal overflow-hidden text-ellipsis pr-2`}
          >
            {title}
          </h3>
          <p className="text-[11px] md:text-xs text-gray-500 leading-relaxed">{subtitle}</p>
        </div>
      </div>
      <div>{children}</div>
    </div>
  )
}

type Attachment = {
  fileName: string
  fileType: string
  fileSize: number
  fileData: string
  mimeType: string
}

type ChatMessage = {
  id: string
  senderId: string
  senderName: string
  senderInitials: string
  senderProfilePicture?: string | null
  text: string
  timestamp: string
  isOutgoing: boolean
  read?: boolean
  repliedTo?: string | null
  reactions?: Array<{ userId: string; emoji: string }>
  deleted?: boolean
  deletedBy?: string | null
  deletedByName?: string | null
  attachments?: Attachment[]
}

function ChatSection() {
  const [selectedUser, setSelectedUser] = useState<AdminUserSummary | null>(null)
  const [searchQuery, setSearchQuery] = useState("")
  const [messages, setMessages] = useState<ChatMessage[]>([])
  const [newMessage, setNewMessage] = useState("")
  const [chatUsers, setChatUsers] = useState<AdminUserSummary[]>([])
  const [isLoadingUsers, setIsLoadingUsers] = useState(true)
  const [usersError, setUsersError] = useState<string | null>(null)
  const [unreadCounts, setUnreadCounts] = useState<Record<string, number>>({})
  const [recentlyOpenedUsers, setRecentlyOpenedUsers] = useState<Record<string, number>>({})
  const [openMenuId, setOpenMenuId] = useState<string | null>(null)
  const [openReactId, setOpenReactId] = useState<string | null>(null)
  const [editingMessageId, setEditingMessageId] = useState<string | null>(null)
  const [editMessageText, setEditMessageText] = useState("")
  const [replyingToMessageId, setReplyingToMessageId] = useState<string | null>(null)
  const [longPressMessageId, setLongPressMessageId] = useState<string | null>(null)
  const [hoveredMessageId, setHoveredMessageId] = useState<string | null>(null)
  const longPressTimerRef = useRef<NodeJS.Timeout | null>(null)
  const messageMenuRef = useRef<HTMLDivElement>(null)
  const [selectedFiles, setSelectedFiles] = useState<File[]>([])
  const [filePreviews, setFilePreviews] = useState<Array<{ file: File; preview: string }>>([])
  const fileInputRef = useRef<HTMLInputElement>(null)
  const previousUnreadCountsRef = useRef<Record<string, number>>({})
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const messagesContainerRef = useRef<HTMLDivElement>(null)
  const shouldAutoScrollRef = useRef(true)
  const lastMessageCountRef = useRef(0)
  const userScrolledRef = useRef(false)
  const menuRef = useRef<HTMLDivElement>(null)
  const reactRef = useRef<HTMLDivElement>(null)

  // Fetch users from database
  const fetchUsers = async (isInitialLoad = false) => {
    try {
      if (isInitialLoad) {
        setIsLoadingUsers(true)
      }
      setUsersError(null)
      const response = await fetch("/api/users/chat")
      const data = await response.json()
      
      if (data.ok && data.users) {
        setChatUsers(data.users)
      } else {
        setUsersError(data.error || "Failed to load users")
      }
    } catch (error) {
      console.error("Error fetching chat users:", error)
      setUsersError("Failed to load users. Please try again.")
    } finally {
      if (isInitialLoad) {
        setIsLoadingUsers(false)
      }
    }
  }

  useEffect(() => {
    fetchUsers(true) // Initial load with loading state
    
    // Poll for online status updates every 10 seconds (silent updates)
    const interval = setInterval(() => {
      fetchUsers(false) // Silent updates without loading state
    }, 10000) // Update every 10 seconds

    // Listen for profile update events (when profile edits are approved)
    const handleProfileUpdate = () => {
      console.log("Profile update detected, refreshing user list...")
      fetchUsers(false) // Refresh user list silently
    }

    window.addEventListener("userProfileUpdated", handleProfileUpdate as EventListener)
    window.addEventListener("profileUpdateTrigger", handleProfileUpdate as EventListener)

    return () => {
      clearInterval(interval)
      window.removeEventListener("userProfileUpdated", handleProfileUpdate as EventListener)
      window.removeEventListener("profileUpdateTrigger", handleProfileUpdate as EventListener)
    }
  }, [])

  // Fetch messages from database (admin perspective)
  const fetchMessages = useCallback(async (userId: string, isInitialLoad = false) => {
    try {
      const response = await fetch(`/api/messages?userId=${userId}&perspective=admin`)
      const data = await response.json()
      
      if (data.ok && data.messages) {
        // Check if new messages were added by comparing with last known count
        const previousCount = lastMessageCountRef.current
        const newCount = data.messages.length
        
        // Check if user sent a new message (not from admin)
        const hasNewMessage = !isInitialLoad && newCount > previousCount && previousCount > 0
        
        // If user sent a new message, mark them as recently opened (move to top of list)
        if (hasNewMessage) {
          // Check if the latest message is from the user (not admin)
          const latestMessage = data.messages[data.messages.length - 1]
          if (latestMessage && !latestMessage.isOutgoing) {
            // User sent a new message - mark as recently opened
            setRecentlyOpenedUsers((prev) => ({
              ...prev,
              [userId]: Date.now(),
            }))
          }
        }
        
        // Only auto-scroll if:
        // 1. This is NOT the initial load (user clicked a user)
        // 2. New messages were added (count increased)
        // 3. User hasn't manually scrolled up
        if (hasNewMessage && !userScrolledRef.current) {
          // Check if user is near bottom (within 150px) - if not, don't auto-scroll
          const container = messagesContainerRef.current
          if (container) {
            const isNearBottom = container.scrollHeight - container.scrollTop - container.clientHeight < 150
            shouldAutoScrollRef.current = isNearBottom
          } else {
            shouldAutoScrollRef.current = true // If container not found, default to scroll
          }
        } else if (hasNewMessage) {
          // New messages but user scrolled up - check if they're near bottom now
          const container = messagesContainerRef.current
          if (container) {
            const isNearBottom = container.scrollHeight - container.scrollTop - container.clientHeight < 150
            shouldAutoScrollRef.current = isNearBottom
          }
        } else {
          // Initial load or no new messages - don't auto-scroll
          shouldAutoScrollRef.current = false
        }
        
        lastMessageCountRef.current = newCount
        setMessages(data.messages)
      } else {
        setMessages([])
        lastMessageCountRef.current = 0
      }
    } catch (error) {
      console.error("Error fetching messages:", error)
      setMessages([])
    }
  }, [])

  // Update selectedUser when chatUsers updates (for online status and profile changes)
  // Use a string representation of user data to create a stable dependency
  const userDataString = chatUsers.map(u => `${u.id}:${u.isOnline}:${u.firstName}:${u.lastName}:${u.profilePicture || ''}`).join(',')
  
  useEffect(() => {
    if (!selectedUser || chatUsers.length === 0) return
    
    const updatedUser = chatUsers.find((u) => u.id === selectedUser.id)
    if (updatedUser) {
      // Update if online status changed OR if name changed (profile update)
      const hasChanges = 
        updatedUser.isOnline !== selectedUser.isOnline ||
        updatedUser.firstName !== selectedUser.firstName ||
        updatedUser.lastName !== selectedUser.lastName ||
        updatedUser.profilePicture !== selectedUser.profilePicture
      
      if (hasChanges) {
        setSelectedUser(updatedUser)
        // Refresh messages to get updated profile pictures
        if (updatedUser.id) {
          fetchMessages(updatedUser.id, false)
        }
      }
    }
  }, [userDataString, selectedUser?.id, fetchMessages])

  // Mark messages as read when admin opens a conversation
  const markMessagesAsRead = useCallback(async (userId: string) => {
    try {
      await fetch("/api/messages", {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          userId,
          adminId: "admin",
        }),
      })
      // Update local unread counts
      setUnreadCounts((prev) => {
        const updated = { ...prev }
        delete updated[userId]
        return updated
      })
    } catch (error) {
      console.error("Error marking messages as read:", error)
    }
  }, [])

  // Helper functions for user data
  const getUnreadCount = (userId: string) => {
    return unreadCounts[userId] || 0
  }
  
  // Track scroll position to determine if user scrolled up
  const handleScroll = () => {
    const container = messagesContainerRef.current
    if (!container) return
    
    const scrollTop = container.scrollTop
    const scrollHeight = container.scrollHeight
    const clientHeight = container.clientHeight
    const isNearBottom = scrollHeight - scrollTop - clientHeight < 150
    
    // If user scrolls up significantly, mark that they manually scrolled
    if (scrollTop < scrollHeight - clientHeight - 200) {
      userScrolledRef.current = true
    }
    
    // If user scrolls back near bottom, reset the flag
    if (isNearBottom) {
      userScrolledRef.current = false
      shouldAutoScrollRef.current = true
    } else {
      shouldAutoScrollRef.current = false
    }
  }

  useEffect(() => {
    if (selectedUser) {
      // Don't auto-scroll when selecting a new user (user clicked)
      shouldAutoScrollRef.current = false
      userScrolledRef.current = false
      lastMessageCountRef.current = 0
      fetchMessages(selectedUser.id, true) // Pass true to indicate this is initial load
      // Mark messages as read when admin opens the conversation
      markMessagesAsRead(selectedUser.id)
      // Don't mark user as recently opened when clicked - only when they send a new message
      
      // Poll for new messages every 5 seconds
      const interval = setInterval(() => {
        fetchMessages(selectedUser.id, false) // Pass false for subsequent fetches
      }, 5000)
      
      return () => clearInterval(interval)
    } else {
      setMessages([])
      lastMessageCountRef.current = 0
    }
  }, [selectedUser?.id, markMessagesAsRead])

  // Scroll to bottom when messages change (only if shouldAutoScroll is true)
  useEffect(() => {
    if (shouldAutoScrollRef.current && messagesEndRef.current) {
      // Use setTimeout to ensure DOM is updated
      setTimeout(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
      }, 100)
    }
  }, [messages])

  // Handle file selection
  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files
    if (!files || files.length === 0) return

    const newFiles = Array.from(files)
    const validFiles: File[] = []
    const previews: Array<{ file: File; preview: string }> = []

    // Validate file size (max 10MB per file)
    const maxSize = 10 * 1024 * 1024 // 10MB

    for (const file of newFiles) {
      if (file.size > maxSize) {
        alert(`File "${file.name}" is too large. Maximum size is 10MB.`)
        continue
      }
      validFiles.push(file)

      // Create preview for images and videos
      if (file.type.startsWith('image/') || file.type.startsWith('video/')) {
        const reader = new FileReader()
        reader.onload = (e) => {
          const preview = e.target?.result as string
          setFilePreviews(prev => [...prev, { file, preview }])
        }
        reader.readAsDataURL(file)
      } else {
        previews.push({ file, preview: '' })
      }
    }

    setSelectedFiles(prev => [...prev, ...validFiles])
    if (previews.length > 0) {
      setFilePreviews(prev => [...prev, ...previews])
    }
  }

  // Remove file from selection
  const removeFile = (index: number) => {
    setSelectedFiles(prev => prev.filter((_, i) => i !== index))
    setFilePreviews(prev => prev.filter((_, i) => i !== index))
    if (fileInputRef.current) {
      fileInputRef.current.value = ''
    }
  }

  // Convert files to base64 attachments
  const convertFilesToAttachments = async (files: File[]): Promise<Attachment[]> => {
    const attachments: Attachment[] = []
    
    for (const file of files) {
      const reader = new FileReader()
      const fileData = await new Promise<string>((resolve, reject) => {
        reader.onload = (e) => resolve(e.target?.result as string)
        reader.onerror = reject
        reader.readAsDataURL(file)
      })

      attachments.push({
        fileName: file.name,
        fileType: file.type,
        fileSize: file.size,
        fileData: fileData.split(',')[1], // Remove data:type;base64, prefix
        mimeType: file.type,
      })
    }

    return attachments
  }

  const handleSendMessage = async () => {
    if ((!newMessage.trim() && selectedFiles.length === 0) || !selectedUser) return

    try {
      // Convert files to attachments
      const attachments = selectedFiles.length > 0 
        ? await convertFilesToAttachments(selectedFiles)
        : []

      const response = await fetch("/api/messages", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          senderId: "admin",
          receiverId: selectedUser.id,
          senderName: "Admin",
          senderInitials: "A",
          text: newMessage.trim(),
          repliedTo: replyingToMessageId || null,
          attachments: attachments.length > 0 ? attachments : undefined,
        }),
      })

      const data = await response.json()

      if (data.ok && data.message) {
        // Update isOutgoing to true for admin perspective
        const adminMessage = { ...data.message, isOutgoing: true }
        // Add the new message to the list
        shouldAutoScrollRef.current = true // Always scroll when sending a message
        userScrolledRef.current = false // Reset scroll flag when sending
        lastMessageCountRef.current = messages.length + 1
        setMessages([...messages, adminMessage])
        setNewMessage("")
        setReplyingToMessageId(null)
        setSelectedFiles([])
        setFilePreviews([])
        if (fileInputRef.current) {
          fileInputRef.current.value = ''
        }
      } else {
        console.error("Failed to send message:", data.error)
      }
    } catch (error) {
      console.error("Error sending message:", error)
    }
  }

  const handleEditMessage = async (messageId: string) => {
    if (!editMessageText.trim() || !selectedUser) return

    try {
      const response = await fetch("/api/messages", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          messageId,
          text: editMessageText.trim(),
        }),
      })

      const data = await response.json()

      if (data.ok) {
        setMessages((prev) =>
          prev.map((msg) => (msg.id === messageId ? { ...msg, text: editMessageText.trim() } : msg))
        )
        setEditingMessageId(null)
        setEditMessageText("")
        setOpenMenuId(null)
        // Refetch to ensure real-time sync
        if (selectedUser) {
          fetchMessages(selectedUser.id, false)
        }
      } else {
        console.error("Failed to edit message:", data.error)
      }
    } catch (error) {
      console.error("Error editing message:", error)
    }
  }

  const handleDeleteMessage = async (messageId: string) => {
    if (!selectedUser) return

    try {
      const response = await fetch("/api/messages", {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          messageId,
          deletedBy: "admin",
          deletedByName: "Admin",
        }),
      })

      const data = await response.json()

      if (data.ok) {
        // Update the message to show as deleted instead of removing it
        setMessages((prev) =>
          prev.map((msg) =>
            msg.id === messageId
              ? { ...msg, deleted: true, deletedBy: "admin", deletedByName: "Admin" }
              : msg
          )
        )
        setOpenMenuId(null)
        // Refetch to ensure real-time sync
        if (selectedUser) {
          fetchMessages(selectedUser.id, false)
        }
      } else {
        console.error("Failed to delete message:", data.error)
      }
    } catch (error) {
      console.error("Error deleting message:", error)
    }
  }

  const handleReply = (messageId: string) => {
    setReplyingToMessageId(messageId)
    setOpenMenuId(null)
    setLongPressMessageId(null)
    setHoveredMessageId(null)
  }

  const handleCopyMessage = async (messageText: string) => {
    try {
      await navigator.clipboard.writeText(messageText)
      setLongPressMessageId(null)
      setHoveredMessageId(null)
      // You could add a toast notification here if needed
    } catch (error) {
      console.error("Failed to copy message:", error)
    }
  }

  // Long press handler for mobile
  const handleLongPressStart = (messageId: string, event: React.TouchEvent) => {
    event.preventDefault() // Prevent context menu
    longPressTimerRef.current = setTimeout(() => {
      setLongPressMessageId(messageId)
      // Haptic feedback if available
      if (navigator.vibrate) {
        navigator.vibrate(50)
      }
    }, 500) // 500ms for long press
  }

  const handleLongPressEnd = () => {
    if (longPressTimerRef.current) {
      clearTimeout(longPressTimerRef.current)
      longPressTimerRef.current = null
    }
  }

  // Close menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent | TouchEvent) => {
      if (messageMenuRef.current && !messageMenuRef.current.contains(event.target as Node)) {
        setLongPressMessageId(null)
        setHoveredMessageId(null)
      }
    }

    if (longPressMessageId || hoveredMessageId) {
      document.addEventListener("mousedown", handleClickOutside)
      document.addEventListener("touchstart", handleClickOutside)
      return () => {
        document.removeEventListener("mousedown", handleClickOutside)
        document.removeEventListener("touchstart", handleClickOutside)
      }
    }
  }, [longPressMessageId, hoveredMessageId])

  const handleReact = async (messageId: string, emoji: string) => {
    try {
      const response = await fetch("/api/messages/reactions", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          messageId,
          emoji,
          userId: "admin",
        }),
      })

      const data = await response.json()

      if (data.ok) {
        // Update the message with new reactions
        setMessages((prev) =>
          prev.map((msg) =>
            msg.id === messageId ? { ...msg, reactions: data.reactions || [] } : msg
          )
        )
        setOpenReactId(null)
        setOpenMenuId(null)
        // Refetch to ensure real-time sync
        if (selectedUser) {
          fetchMessages(selectedUser.id, false)
        }
      } else {
        console.error("Failed to react to message:", data.error)
      }
    } catch (error) {
      console.error("Error reacting to message:", error)
    }
  }

  // Close menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setOpenMenuId(null)
      }
      if (reactRef.current && !reactRef.current.contains(event.target as Node)) {
        setOpenReactId(null)
      }
    }

    if (openMenuId || openReactId) {
      document.addEventListener("mousedown", handleClickOutside)
      return () => document.removeEventListener("mousedown", handleClickOutside)
    }
  }, [openMenuId, openReactId])

  // Filter and sort users: those with unread messages first, then recently opened, then alphabetically
  const filteredUsers = chatUsers
    .filter(
      (user) =>
        user.firstName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        user.lastName.toLowerCase().includes(searchQuery.toLowerCase())
    )
    .sort((a, b) => {
      const aUnread = getUnreadCount(a.id)
      const bUnread = getUnreadCount(b.id)
      const aRecentlyOpened = recentlyOpenedUsers[a.id] || 0
      const bRecentlyOpened = recentlyOpenedUsers[b.id] || 0
      
      // Priority 1: Users with unread messages come first
      if (aUnread > 0 && bUnread === 0) return -1
      if (aUnread === 0 && bUnread > 0) return 1
      
      // If both have unread, sort by unread count (descending), then by most recently opened
      if (aUnread > 0 && bUnread > 0) {
        if (aUnread !== bUnread) {
          return bUnread - aUnread
        }
        // If same unread count, sort by most recently opened
        if (aRecentlyOpened !== bRecentlyOpened) {
          return bRecentlyOpened - aRecentlyOpened
        }
      }
      
      // Priority 2: Recently opened users come next (even if no unread), sorted by most recent first
      // This ensures users who sent messages stay at the top even after being read
      if (aRecentlyOpened > 0 && bRecentlyOpened === 0) return -1
      if (aRecentlyOpened === 0 && bRecentlyOpened > 0) return 1
      if (aRecentlyOpened > 0 && bRecentlyOpened > 0) {
        return bRecentlyOpened - aRecentlyOpened // Most recently opened first
      }
      
      // Priority 3: Alphabetical by last name, then first name
      const aName = `${a.lastName} ${a.firstName}`.toLowerCase()
      const bName = `${b.lastName} ${b.firstName}`.toLowerCase()
      return aName.localeCompare(bName)
    })

  // Get user timestamp from latest messages
  const [messageTimestamps, setMessageTimestamps] = useState<Record<string, string>>({})

  useEffect(() => {
    const fetchTimestamps = async () => {
      try {
        const response = await fetch("/api/messages/latest?adminId=admin")
        const data = await response.json()
        
        if (data.ok && data.timestamps) {
          setMessageTimestamps(data.timestamps)
        }
      } catch (error) {
        console.error("Error fetching message timestamps:", error)
      }
    }

    fetchTimestamps()
    
    // Update timestamps every 10 seconds
    const interval = setInterval(fetchTimestamps, 10000)
    return () => clearInterval(interval)
  }, [])

  // Fetch unread message counts
  useEffect(() => {
    const fetchUnreadCounts = async () => {
      try {
        const response = await fetch("/api/messages/unread?adminId=admin")
        const data = await response.json()
        
        if (data.ok && data.unreadCounts) {
          const previousCounts = previousUnreadCountsRef.current
          const newCounts = data.unreadCounts
          
          // Check if any user's unread count increased (they sent a new message)
          Object.keys(newCounts).forEach((userId) => {
            const previousCount = previousCounts[userId] || 0
            const newCount = newCounts[userId] || 0
            
            // If unread count increased, user sent a new message - mark as recently opened
            if (newCount > previousCount) {
              setRecentlyOpenedUsers((prev) => ({
                ...prev,
                [userId]: Date.now(),
              }))
            }
          })
          
          // Update previous counts for next comparison
          previousUnreadCountsRef.current = { ...newCounts }
          setUnreadCounts(newCounts)
        }
      } catch (error) {
        console.error("Error fetching unread counts:", error)
      }
    }

    fetchUnreadCounts()
    
    // Update unread counts every 5 seconds
    const interval = setInterval(fetchUnreadCounts, 5000)
    return () => clearInterval(interval)
  }, [])

  const getUserTimestamp = (userId: string) => {
    return messageTimestamps[userId] || ""
  }

  return (
    <section className={`${selectedUser ? 'md:space-y-6' : 'space-y-6'} ${selectedUser ? 'h-[calc(100vh-4rem)] md:h-auto' : ''} ${selectedUser ? '-mx-3 md:mx-0 -my-4 md:my-0' : ''}`}>
      {/* Header Section */}
      <div className={selectedUser ? 'hidden md:block' : 'block'}>
        <h2 className="text-xl md:text-3xl font-bold text-[#041A44]">Admin Chat Center</h2>
        <p className="text-xs md:text-sm text-gray-500 mt-1">Communicate with users across all departments</p>
      </div>

      {/* Two Separate Containers */}
      <div className={`flex flex-col md:flex-row gap-4 md:gap-6 ${selectedUser ? 'h-full md:h-auto' : ''} ${selectedUser ? 'px-3 md:px-0' : ''}`}>
        {/* Left Container - Users Directory */}
        <aside className={`w-full md:w-80 flex-shrink-0 rounded-2xl md:rounded-3xl bg-white shadow-lg ring-1 ring-black/5 overflow-hidden flex flex-col ${selectedUser ? 'hidden md:flex' : 'flex'} ${selectedUser ? '' : 'h-[calc(100vh-12rem)] md:min-h-[500px]'} md:min-h-[500px] ${selectedUser ? '' : 'max-h-[calc(100vh-12rem)]'} md:max-h-[700px]`}>
          {/* Header with dark blue background */}
          <div className="bg-gradient-to-r from-[#041A44] via-[#0d2f7b] to-[#123a91] px-4 md:px-6 py-3 md:py-4">
            <div className="flex items-center gap-2 text-white">
              <CheckCircle2 className="h-4 w-4 md:h-5 md:w-5" />
              <span className="text-sm md:text-base font-semibold">Users Directory</span>
            </div>
            <p className="text-xs md:text-sm text-white/80 mt-1">{filteredUsers.length} users available</p>
          </div>

          {/* Search Bar */}
          <div className="px-3 md:px-4 py-2 md:py-3">
            <div className="relative">
              <input
                type="search"
                placeholder="Search users..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full rounded-lg border border-gray-200 bg-white px-2.5 md:px-3 py-1.5 md:py-2 pl-8 md:pl-9 text-xs md:text-sm text-gray-700 shadow-sm transition focus:border-[#041A44] focus:outline-none focus:ring-2 focus:ring-[#041A44]/20"
              />
              <SearchIcon className="absolute left-2 md:left-2.5 top-1/2 -translate-y-1/2 text-gray-400 h-3.5 w-3.5 md:h-4 md:w-4" />
            </div>
          </div>

          {/* User List */}
          <div 
            className="flex-1 space-y-1.5 px-3 pb-4 overflow-y-auto min-h-0"
            style={{ overscrollBehavior: 'contain' }}
            onWheel={(e) => {
              const container = e.currentTarget
              const { scrollTop, scrollHeight, clientHeight } = container
              const isAtTop = scrollTop <= 0
              const isAtBottom = scrollTop + clientHeight >= scrollHeight - 5
              
              // Always prevent page scroll when scrolling inside the container
              // Only allow page scroll if we're at the boundaries and trying to scroll further
              if (!((e.deltaY < 0 && isAtTop) || (e.deltaY > 0 && isAtBottom))) {
                e.stopPropagation()
              }
            }}
          >
            {isLoadingUsers ? (
              <div className="flex items-center justify-center py-8">
                <div className="text-sm text-gray-500">Loading users...</div>
              </div>
            ) : usersError ? (
              <div className="flex items-center justify-center py-8">
                <div className="text-sm text-red-500">{usersError}</div>
              </div>
            ) : filteredUsers.length === 0 ? (
              <div className="flex items-center justify-center py-8">
                <div className="text-sm text-gray-500">No users found</div>
              </div>
            ) : (
              filteredUsers.map((user) => {
              const isActive = user.id === selectedUser?.id
              return (
                <button
                  key={user.id}
                  onClick={() => setSelectedUser(user)}
                  className={`flex w-full items-center gap-2 md:gap-2.5 rounded-xl px-2 md:px-2.5 py-1.5 md:py-2 text-left transition ${
                    isActive ? "bg-[#041A44] text-white shadow-md" : "bg-gray-50 text-gray-700 hover:bg-gray-100"
                  }`}
                >
                  {user.profilePicture ? (
                    <div className="relative h-8 w-8 md:h-10 md:w-10 rounded-full overflow-hidden flex-shrink-0">
                      <img
                        src={user.profilePicture}
                        alt={`${user.firstName} ${user.lastName}`}
                        className="w-full h-full object-cover"
                      />
                    </div>
                  ) : (
                    <div
                      className={`flex h-8 w-8 md:h-10 md:w-10 items-center justify-center rounded-full text-[10px] md:text-xs font-semibold ${
                        isActive
                          ? "bg-white/10 text-white"
                          : "bg-blue-100 text-[#041A44]"
                      }`}
                    >
                      {user.firstName[0]}
                      {user.lastName[0]}
                    </div>
                  )}
                  <div className="flex-1 min-w-0 relative">
                    <div className="flex items-center justify-between gap-1 md:gap-2">
                      <p className={`text-xs md:text-sm font-semibold truncate ${isActive ? "text-white" : "text-[#041A44]"}`}>
                        {user.firstName} {user.lastName}
                      </p>
                      <div className="flex items-center gap-2">
                        {getUserTimestamp(user.id) && (
                          <span className={`text-xs whitespace-nowrap ${isActive ? "text-white/70" : "text-gray-400"}`}>
                            {getUserTimestamp(user.id)}
                          </span>
                        )}
                        {getUnreadCount(user.id) > 0 && (
                          <span className={`flex items-center justify-center min-w-[20px] h-5 px-1.5 rounded-full text-xs font-semibold ${
                            isActive 
                              ? "bg-white text-[#041A44]" 
                              : "bg-[#041A44] text-white"
                          }`}>
                            {getUnreadCount(user.id) > 99 ? "99+" : getUnreadCount(user.id)}
                          </span>
                        )}
                      </div>
                    </div>
                    <p className={`text-xs mt-0.5 ${isActive ? "text-white/80" : "text-gray-500"}`}>Click to chat</p>
                  </div>
                  {user.isOnline ? (
                    <span className={`h-2 w-2 rounded-full flex-shrink-0 ${isActive ? "bg-emerald-300" : "bg-emerald-500"}`} />
                  ) : (
                    <span className={`h-2 w-2 rounded-full flex-shrink-0 ${isActive ? "bg-gray-400" : "bg-gray-300"}`} />
                  )}
                </button>
              )
            })
            )}
          </div>
        </aside>

        {/* Right Container - Chat Section */}
        <div className={`flex-1 rounded-none md:rounded-2xl md:rounded-3xl bg-white shadow-lg md:ring-1 ring-black/5 overflow-hidden flex flex-col ${selectedUser ? 'flex' : 'hidden md:flex'} ${selectedUser ? 'h-[calc(100vh-4rem)] md:min-h-[500px]' : 'min-h-[400px] md:min-h-[500px]'} md:min-h-[500px] ${selectedUser ? 'max-h-[calc(100vh-4rem)]' : ''} md:max-h-[700px]`}>
          {selectedUser ? (
            <div className="flex flex-col h-full min-h-0">
              {/* Chat Header */}
              <div className="border-b border-gray-200 px-3 sm:px-4 md:px-6 py-2.5 sm:py-3 md:py-4 bg-white">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-1.5 sm:gap-2 md:gap-3 min-w-0 flex-1">
                    {/* Back Button - Mobile Only */}
                    <button
                      onClick={() => setSelectedUser(null)}
                      className="md:hidden p-1 sm:p-1.5 rounded-full hover:bg-gray-100 transition mr-0.5 sm:mr-1 touch-manipulation flex-shrink-0"
                      aria-label="Back to users"
                    >
                      <ArrowLeft className="h-4 w-4 sm:h-5 sm:w-5 text-gray-600" />
                    </button>
                    {selectedUser.profilePicture ? (
                      <div className="relative h-7 w-7 sm:h-8 sm:w-8 md:h-10 md:w-10 rounded-full overflow-hidden flex-shrink-0">
                        <img
                          src={selectedUser.profilePicture}
                          alt={`${selectedUser.firstName} ${selectedUser.lastName}`}
                          className="w-full h-full object-cover"
                        />
                      </div>
                    ) : (
                      <div className="flex h-7 w-7 sm:h-8 sm:w-8 md:h-10 md:w-10 items-center justify-center rounded-full bg-blue-100 text-[#041A44] text-[10px] sm:text-xs md:text-sm font-semibold flex-shrink-0">
                        {selectedUser.firstName[0]}
                        {selectedUser.lastName[0]}
                      </div>
                    )}
                    <div className="min-w-0 flex-1">
                      <p className="text-xs sm:text-sm md:text-base font-semibold text-[#041A44] truncate">
                        {selectedUser.firstName} {selectedUser.lastName}
                      </p>
                      <p className={`text-[9px] sm:text-[10px] md:text-xs font-medium ${selectedUser.isOnline ? "text-green-600" : "text-gray-500"}`}>
                        {selectedUser.isOnline ? "Online" : "Offline"}
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Chat Messages Area */}
              <div 
                ref={messagesContainerRef}
                onScroll={handleScroll}
                className="flex-1 px-2.5 sm:px-3 md:px-6 py-3 sm:py-4 md:py-6 overflow-y-auto bg-gray-50 min-h-0"
              >
                {messages.length > 0 ? (
                  <div className="space-y-2.5 sm:space-y-3 md:space-y-4">
                    {messages.map((message) => (
                      <div
                        key={message.id}
                        className={`group flex gap-1.5 sm:gap-2 md:gap-3 items-start ${message.isOutgoing ? "justify-end" : "justify-start"}`}
                      >
                        {!message.isOutgoing && (
                          message.senderProfilePicture ? (
                            <div className="relative h-6 w-6 sm:h-7 sm:w-7 md:h-8 md:w-8 rounded-full overflow-hidden flex-shrink-0" style={{ marginTop: message.repliedTo ? '3.5rem' : '1.25rem' }}>
                              <img
                                src={message.senderProfilePicture}
                                alt={message.senderName}
                                className="w-full h-full object-cover"
                              />
                            </div>
                          ) : (
                            <div className="flex h-6 w-6 sm:h-7 sm:w-7 md:h-8 md:w-8 items-center justify-center rounded-full bg-blue-100 text-[#041A44] text-[9px] sm:text-[10px] md:text-xs font-semibold flex-shrink-0" style={{ marginTop: message.repliedTo ? '3.5rem' : '1.25rem' }}>
                              {message.senderInitials}
                            </div>
                          )
                        )}
                        <div className={`flex flex-col max-w-[82%] sm:max-w-[75%] md:max-w-[70%] ${message.isOutgoing ? "items-end" : "items-start"}`}>
                          {message.repliedTo && !message.deleted && (() => {
                            const repliedMessage = messages.find(m => m.id === message.repliedTo)
                            return repliedMessage ? (
                              <div className={`mb-1 ${message.isOutgoing ? 'items-end flex flex-col' : 'inline-block'}`}>
                                <p className={`text-[9px] sm:text-[10px] md:text-xs text-gray-500 mb-0.5 sm:mb-1 px-1 ${message.isOutgoing ? 'text-right' : 'text-left'}`}>
                                  {message.isOutgoing 
                                    ? `You replied to ${repliedMessage.senderName}`
                                    : `${message.senderName} replied to ${repliedMessage.senderName}`}
                                </p>
                                <div className="rounded-xl px-2 sm:px-2.5 md:px-3 py-1 sm:py-1.5 md:py-2 max-w-[65%] sm:max-w-[60%] bg-gray-100 border border-gray-200 inline-block">
                                  <p className="text-[9px] sm:text-[10px] md:text-xs text-gray-600 truncate">{repliedMessage.text}</p>
                                </div>
                              </div>
                            ) : null
                          })()}
                      <div className={`relative flex items-center gap-2 ${message.isOutgoing ? "flex-row-reverse" : ""}`}>
                        {editingMessageId === message.id ? (
                          <div className="flex flex-col gap-2 w-full">
                            <input
                              type="text"
                              value={editMessageText}
                              onChange={(e) => setEditMessageText(e.target.value)}
                              onKeyPress={(e) => {
                                if (e.key === "Enter") {
                                  handleEditMessage(message.id)
                                }
                                if (e.key === "Escape") {
                                  setEditingMessageId(null)
                                  setEditMessageText("")
                                }
                              }}
                              className="rounded-2xl px-2.5 sm:px-3 md:px-4 py-1.5 sm:py-2 md:py-3 border border-[#041A44] focus:outline-none focus:ring-2 focus:ring-[#041A44]/20 text-[11px] sm:text-xs md:text-sm"
                              autoFocus
                            />
                            <div className="flex gap-2">
                              <button
                                onClick={() => handleEditMessage(message.id)}
                                className="text-xs text-[#041A44] hover:underline"
                              >
                                Save
                              </button>
                              <button
                                onClick={() => {
                                  setEditingMessageId(null)
                                  setEditMessageText("")
                                }}
                                className="text-xs text-gray-500 hover:underline"
                              >
                                Cancel
                              </button>
                            </div>
                          </div>
                        ) : (
                          <>
                            <div className="relative">
                              <div
                                className={`rounded-2xl px-2.5 sm:px-3 md:px-4 py-1.5 sm:py-2 md:py-3 max-w-full ${
                                  message.isOutgoing
                                    ? message.deleted 
                                      ? "bg-gray-100 text-gray-500 border border-gray-200"
                                      : "bg-[#041A44] text-white"
                                    : message.deleted
                                      ? "bg-gray-100 text-gray-500 border border-gray-200"
                                      : "bg-white text-gray-800 border border-gray-200"
                                }`}
                                onMouseEnter={() => !message.deleted && setHoveredMessageId(message.id)}
                                onMouseLeave={() => setHoveredMessageId(null)}
                                onTouchStart={(e) => !message.deleted && handleLongPressStart(message.id, e)}
                                onTouchEnd={handleLongPressEnd}
                                onTouchCancel={handleLongPressEnd}
                                onContextMenu={(e) => {
                                  e.preventDefault() // Prevent default context menu
                                }}
                              >
                                {message.deleted ? (
                                  <p className="text-sm italic text-gray-500">
                                    {message.deletedBy === "admin"
                                      ? "You deleted this message"
                                      : `Message was deleted by ${message.deletedByName || "someone"}`}
                                  </p>
                                ) : (
                                  <>
                                    {message.attachments && message.attachments.length > 0 && (
                                      <div className="mb-2 space-y-2">
                                        {message.attachments.map((att, idx) => {
                                          const isImage = att.mimeType.startsWith('image/')
                                          const isVideo = att.mimeType.startsWith('video/')
                                          const dataUrl = `data:${att.mimeType};base64,${att.fileData}`
                                          
                                          return (
                                            <div key={idx} className="rounded-lg overflow-hidden">
                                              {isImage ? (
                                                <img 
                                                  src={dataUrl} 
                                                  alt={att.fileName} 
                                                  className="max-w-full max-h-64 object-contain rounded-lg cursor-pointer hover:opacity-90"
                                                  onClick={() => window.open(dataUrl, '_blank')}
                                                />
                                              ) : isVideo ? (
                                                <video 
                                                  src={dataUrl} 
                                                  controls 
                                                  className="max-w-full max-h-64 rounded-lg"
                                                />
                                              ) : (
                                                <a
                                                  href={dataUrl}
                                                  download={att.fileName}
                                                  className="flex items-center gap-2 p-2 bg-gray-200 hover:bg-gray-300 rounded-lg transition"
                                                >
                                                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.172 7l-6.586 6.586a2 2 0 102.828 2.828l6.414-6.586a4 4 0 00-5.656-5.656l-6.415 6.585a6 6 0 108.486 8.486L20.5 13" />
                                                  </svg>
                                                  <div className="flex-1 min-w-0">
                                                    <p className="text-sm font-medium truncate">{att.fileName}</p>
                                                    <p className="text-xs text-gray-500">{(att.fileSize / 1024).toFixed(1)} KB</p>
                                                  </div>
                                                </a>
                                              )}
                                            </div>
                                          )
                                        })}
                                      </div>
                                    )}
                                    {message.text && (
                                      <p className="text-[11px] sm:text-xs md:text-sm whitespace-pre-wrap break-words text-justify md:text-left" style={{ wordBreak: 'break-word', overflowWrap: 'anywhere' }}>{message.text}</p>
                                    )}
                                  </>
                                )}
                              </div>
                              {message.reactions && message.reactions.length > 0 && (
                                <div className="absolute flex flex-wrap gap-1 right-0 translate-x-2 bottom-0 translate-y-1/2">
                                  {Array.from(new Set(message.reactions.map((r: any) => r.emoji))).map((emoji) => (
                                    <span
                                      key={emoji}
                                      className="flex items-center justify-center w-6 h-6 rounded-full bg-white border border-gray-200 shadow-sm text-sm"
                                    >
                                      {emoji}
                                    </span>
                                  ))}
                                </div>
                              )}
                              {/* Message Action Menu - Appears on hover (desktop) or long press (mobile) */}
                              {(longPressMessageId === message.id || hoveredMessageId === message.id) && !message.deleted && (
                                <div 
                                  ref={messageMenuRef}
                                  className={`md:hidden absolute ${message.isOutgoing ? 'right-0' : 'left-0'} bottom-full mb-2 z-50`}
                                  style={{ 
                                    position: 'absolute',
                                    bottom: '100%',
                                    marginBottom: '0.5rem'
                                  }}
                                >
                                  <div className="bg-gray-800 rounded-lg px-1.5 md:px-2 py-1.5 flex items-center gap-1 md:gap-1.5 shadow-xl">
                                    {/* Reaction Emojis */}
                                    <div className="flex items-center gap-0.5 pr-1 md:pr-1.5 border-r border-gray-600">
                                      <button
                                        onClick={() => handleReact(message.id, "❤️")}
                                        className="p-1 md:p-1.5 hover:bg-gray-700 active:bg-gray-600 rounded transition-all duration-200 hover:scale-125 text-sm md:text-base touch-manipulation"
                                        title="Love"
                                      >
                                        ❤️
                                      </button>
                                      <button
                                        onClick={() => handleReact(message.id, "😂")}
                                        className="p-1 md:p-1.5 hover:bg-gray-700 active:bg-gray-600 rounded transition-all duration-200 hover:scale-125 text-sm md:text-base touch-manipulation"
                                        title="Laugh"
                                      >
                                        😂
                                      </button>
                                      <button
                                        onClick={() => handleReact(message.id, "😮")}
                                        className="p-1 md:p-1.5 hover:bg-gray-700 active:bg-gray-600 rounded transition-all duration-200 hover:scale-125 text-sm md:text-base touch-manipulation"
                                        title="Surprised"
                                      >
                                        😮
                                      </button>
                                      <button
                                        onClick={() => handleReact(message.id, "😢")}
                                        className="p-1 md:p-1.5 hover:bg-gray-700 active:bg-gray-600 rounded transition-all duration-200 hover:scale-125 text-sm md:text-base touch-manipulation"
                                        title="Sad"
                                      >
                                        😢
                                      </button>
                                      <button
                                        onClick={() => handleReact(message.id, "😠")}
                                        className="p-1 md:p-1.5 hover:bg-gray-700 active:bg-gray-600 rounded transition-all duration-200 hover:scale-125 text-sm md:text-base touch-manipulation"
                                        title="Angry"
                                      >
                                        😠
                                      </button>
                                      <button
                                        onClick={() => handleReact(message.id, "👍")}
                                        className="p-1 md:p-1.5 hover:bg-gray-700 active:bg-gray-600 rounded transition-all duration-200 hover:scale-125 text-sm md:text-base touch-manipulation"
                                        title="Thumbs up"
                                      >
                                        👍
                                      </button>
                                    </div>
                                    {/* Action Buttons */}
                                    <div className="flex items-center gap-1 md:gap-1.5">
                                      <button
                                        onClick={() => handleReply(message.id)}
                                        className="flex flex-col items-center gap-0.5 px-1.5 md:px-2 py-1 rounded hover:bg-gray-700 active:bg-gray-600 transition-colors touch-manipulation"
                                        title="Reply"
                                      >
                                        <Reply className="h-3.5 w-3.5 md:h-4 md:w-4 text-pink-400" />
                                        <span className="text-[8px] md:text-[9px] text-white font-medium">Reply</span>
                                      </button>
                                      <button
                                        onClick={() => handleCopyMessage(message.text)}
                                        className="flex flex-col items-center gap-0.5 px-1.5 md:px-2 py-1 rounded hover:bg-gray-700 active:bg-gray-600 transition-colors touch-manipulation"
                                        title="Copy"
                                      >
                                        <Copy className="h-3.5 w-3.5 md:h-4 md:w-4 text-pink-400" />
                                        <span className="text-[8px] md:text-[9px] text-white font-medium">Copy</span>
                                      </button>
                                      {message.isOutgoing && (
                                        <>
                                          <button
                                            onClick={() => {
                                              setEditingMessageId(message.id)
                                              setEditMessageText(message.text)
                                              setLongPressMessageId(null)
                                              setHoveredMessageId(null)
                                            }}
                                            className="flex flex-col items-center gap-0.5 px-1.5 md:px-2 py-1 rounded hover:bg-gray-700 active:bg-gray-600 transition-colors touch-manipulation"
                                            title="Edit"
                                          >
                                            <Edit className="h-3.5 w-3.5 md:h-4 md:w-4 text-blue-400" />
                                            <span className="text-[8px] md:text-[9px] text-white font-medium">Edit</span>
                                          </button>
                                          <button
                                            onClick={() => {
                                              handleDeleteMessage(message.id)
                                              setLongPressMessageId(null)
                                              setHoveredMessageId(null)
                                            }}
                                            className="flex flex-col items-center gap-0.5 px-1.5 md:px-2 py-1 rounded hover:bg-gray-700 active:bg-gray-600 transition-colors touch-manipulation"
                                            title="Delete"
                                          >
                                            <Trash2 className="h-3.5 w-3.5 md:h-4 md:w-4 text-red-400" />
                                            <span className="text-[8px] md:text-[9px] text-white font-medium">Delete</span>
                                          </button>
                                        </>
                                      )}
                                    </div>
                                  </div>
                                </div>
                              )}
                            </div>
                            {!message.deleted && (
                              <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                                    {message.isOutgoing ? (
                                      <>
                                        <div className="relative" ref={openMenuId === message.id ? menuRef : null}>
                                          <button
                                            onClick={() => setOpenMenuId(openMenuId === message.id ? null : message.id)}
                                            className="p-1.5 rounded-full bg-pink-100 hover:bg-pink-200 transition-colors"
                                            title="More options"
                                          >
                                            <MoreVertical className="h-4 w-4 text-gray-800" />
                                          </button>
                                          {openMenuId === message.id && (
                                            <div className="absolute left-1/2 -translate-x-1/2 bottom-full mb-1 bg-white rounded-lg shadow-lg border border-gray-200 py-1 z-10 min-w-[120px]">
                                              <button
                                                onClick={() => {
                                                  setEditingMessageId(message.id)
                                                  setEditMessageText(message.text)
                                                  setOpenMenuId(null)
                                                }}
                                                className="w-full px-4 py-2 text-left text-sm text-gray-700 hover:bg-gray-100 flex items-center gap-2"
                                              >
                                                <Edit className="h-4 w-4" />
                                                Edit
                                              </button>
                                              <button
                                                onClick={() => handleDeleteMessage(message.id)}
                                                className="w-full px-4 py-2 text-left text-sm text-red-600 hover:bg-red-50 flex items-center gap-2"
                                              >
                                                <Trash2 className="h-4 w-4" />
                                                Delete
                                              </button>
                                            </div>
                                          )}
                                        </div>
                                        <button
                                          onClick={() => handleReply(message.id)}
                                          className="p-1.5 rounded-full bg-pink-100 hover:bg-pink-200 transition-colors"
                                          title="Reply"
                                        >
                                          <Reply className="h-4 w-4 text-gray-800" />
                                        </button>
                                        <div className="relative" ref={openReactId === message.id ? reactRef : null}>
                                          <button
                                            onClick={() => setOpenReactId(openReactId === message.id ? null : message.id)}
                                            className="p-1.5 rounded-full bg-pink-100 hover:bg-pink-200 transition-colors"
                                            title="React"
                                          >
                                            <Smile className="h-4 w-4 text-gray-800" />
                                          </button>
                                        {openReactId === message.id && (
                                          <div className="absolute right-0 bottom-full mb-2 bg-white rounded-lg shadow-lg border border-gray-200 p-2 z-10 flex gap-1">
                                            <button
                                              onClick={() => handleReact(message.id, "❤️")}
                                              className="p-1.5 hover:bg-gray-100 rounded transition-all duration-200 hover:scale-150 text-lg"
                                              title="Love"
                                            >
                                              ❤️
                                            </button>
                                            <button
                                              onClick={() => handleReact(message.id, "😂")}
                                              className="p-1.5 hover:bg-gray-100 rounded transition-all duration-200 hover:scale-150 text-lg"
                                              title="Laugh"
                                            >
                                              😂
                                            </button>
                                            <button
                                              onClick={() => handleReact(message.id, "😮")}
                                              className="p-1.5 hover:bg-gray-100 rounded transition-all duration-200 hover:scale-150 text-lg"
                                              title="Surprised"
                                            >
                                              😮
                                            </button>
                                            <button
                                              onClick={() => handleReact(message.id, "😢")}
                                              className="p-1.5 hover:bg-gray-100 rounded transition-all duration-200 hover:scale-150 text-lg"
                                              title="Sad"
                                            >
                                              😢
                                            </button>
                                            <button
                                              onClick={() => handleReact(message.id, "😠")}
                                              className="p-1.5 hover:bg-gray-100 rounded transition-all duration-200 hover:scale-150 text-lg"
                                              title="Angry"
                                            >
                                              😠
                                            </button>
                                            <button
                                              onClick={() => handleReact(message.id, "👍")}
                                              className="p-1.5 hover:bg-gray-100 rounded transition-all duration-200 hover:scale-150 text-lg"
                                              title="Thumbs up"
                                            >
                                              👍
                                            </button>
                                          </div>
                                        )}
                                      </div>
                                    </>
                                  ) : (
                                    <>
                                      <div className="relative" ref={openReactId === message.id ? reactRef : null}>
                                        <button
                                          onClick={() => setOpenReactId(openReactId === message.id ? null : message.id)}
                                          className="p-1.5 rounded-full bg-pink-100 hover:bg-pink-200 transition-colors"
                                          title="React"
                                        >
                                          <Smile className="h-4 w-4 text-gray-800" />
                                        </button>
                                        {openReactId === message.id && (
                                          <div className="absolute left-0 bottom-full mb-2 bg-white rounded-lg shadow-lg border border-gray-200 p-2 z-10 flex gap-1">
                                            <button
                                              onClick={() => handleReact(message.id, "❤️")}
                                              className="p-1.5 hover:bg-gray-100 rounded transition-all duration-200 hover:scale-150 text-lg"
                                              title="Love"
                                            >
                                              ❤️
                                            </button>
                                            <button
                                              onClick={() => handleReact(message.id, "😂")}
                                              className="p-1.5 hover:bg-gray-100 rounded transition-all duration-200 hover:scale-150 text-lg"
                                              title="Laugh"
                                            >
                                              😂
                                            </button>
                                            <button
                                              onClick={() => handleReact(message.id, "😮")}
                                              className="p-1.5 hover:bg-gray-100 rounded transition-all duration-200 hover:scale-150 text-lg"
                                              title="Surprised"
                                            >
                                              😮
                                            </button>
                                            <button
                                              onClick={() => handleReact(message.id, "😢")}
                                              className="p-1.5 hover:bg-gray-100 rounded transition-all duration-200 hover:scale-150 text-lg"
                                              title="Sad"
                                            >
                                              😢
                                            </button>
                                            <button
                                              onClick={() => handleReact(message.id, "😠")}
                                              className="p-1.5 hover:bg-gray-100 rounded transition-all duration-200 hover:scale-150 text-lg"
                                              title="Angry"
                                            >
                                              😠
                                            </button>
                                            <button
                                              onClick={() => handleReact(message.id, "👍")}
                                              className="p-1.5 hover:bg-gray-100 rounded transition-all duration-200 hover:scale-150 text-lg"
                                              title="Thumbs up"
                                            >
                                              👍
                                            </button>
                                          </div>
                                        )}
                                      </div>
                                      <button
                                        onClick={() => handleReply(message.id)}
                                        className="p-1.5 rounded-full bg-pink-100 hover:bg-pink-200 transition-colors"
                                        title="Reply"
                                      >
                                        <Reply className="h-4 w-4 text-gray-800" />
                                      </button>
                                      <div className="relative" ref={openMenuId === message.id ? menuRef : null}>
                                        <button
                                          onClick={() => setOpenMenuId(openMenuId === message.id ? null : message.id)}
                                          className="p-1.5 rounded-full bg-pink-100 hover:bg-pink-200 transition-colors"
                                          title="More options"
                                        >
                                          <MoreVertical className="h-4 w-4 text-gray-800" />
                                        </button>
                                        {openMenuId === message.id && (
                                          <div className="absolute left-1/2 -translate-x-1/2 bottom-full mb-1 bg-white rounded-lg shadow-lg border border-gray-200 py-1 z-10 min-w-[120px]">
                                            <button
                                              onClick={() => {
                                                setEditingMessageId(null)
                                                setOpenMenuId(null)
                                              }}
                                              className="w-full px-4 py-2 text-left text-sm text-gray-700 hover:bg-gray-100"
                                              disabled
                                            >
                                              Options unavailable
                                            </button>
                                          </div>
                                        )}
                                      </div>
                                    </>
                                  )}
                              </div>
                            )}
                          </>
                        )}
                      </div>
                      <p className="text-[9px] sm:text-[10px] md:text-xs text-gray-400 mt-1 px-1">{message.timestamp}</p>
                    </div>
                  </div>
                ))}
                    <div ref={messagesEndRef} />
                  </div>
                ) : (
                  <div className="flex flex-col items-center justify-center h-full text-center">
                    <div className="space-y-4">
                      <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-white shadow-md">
                        <MessageSquare className="h-10 w-10 text-[#041A44]" />
                      </div>
                      <div>
                        <h3 className="text-xl font-semibold text-[#041A44]">Start Chatting</h3>
                        <p className="mt-2 text-sm text-gray-500">
                          Your conversation with {selectedUser.firstName} will appear here
                        </p>
                      </div>
                    </div>
                  </div>
                )}
              </div>

              {/* Chat Input Area */}
              <div className="border-t border-gray-200 px-2.5 sm:px-3 md:px-6 py-2.5 sm:py-3 md:py-4 bg-white">
                {replyingToMessageId && (() => {
                  const repliedMessage = messages.find(m => m.id === replyingToMessageId)
                  return repliedMessage ? (
                    <div className="mb-2.5 sm:mb-3 flex items-start justify-between bg-white rounded-lg px-2 sm:px-2.5 md:px-3 py-1.5 sm:py-2 md:py-2.5 border-l-[4px] border-[#041A44] shadow-sm">
                      <div className="flex-1 min-w-0 pr-1.5 sm:pr-2">
                        <p className="text-[9px] sm:text-[10px] md:text-xs text-gray-500 mb-0.5 sm:mb-1">Replying to {repliedMessage.senderName}</p>
                        <p className="text-[9px] sm:text-[10px] md:text-sm text-gray-700 break-words line-clamp-2 text-justify md:text-left">{repliedMessage.text || "No text content"}</p>
                      </div>
                      <button
                        type="button"
                        onClick={() => setReplyingToMessageId(null)}
                        className="ml-1.5 sm:ml-2 p-1 sm:p-1.5 hover:bg-gray-100 rounded-full transition flex-shrink-0 touch-manipulation"
                        aria-label="Cancel reply"
                      >
                        <X className="h-3 w-3 sm:h-3.5 sm:w-3.5 md:h-4 md:w-4 text-gray-600" />
                      </button>
                    </div>
                  ) : null
                })()}
                {/* File Previews */}
                {selectedFiles.length > 0 && (
                  <div className="mb-2 flex flex-wrap gap-2">
                    {selectedFiles.map((file, index) => {
                      const preview = filePreviews.find(p => p.file === file)?.preview
                      const isImage = file.type.startsWith('image/')
                      const isVideo = file.type.startsWith('video/')
                      
                      return (
                        <div key={index} className="relative inline-block">
                          {isImage && preview ? (
                            <div className="relative w-20 h-20 rounded-lg overflow-hidden border border-gray-200">
                              <img src={preview} alt={file.name} className="w-full h-full object-cover" />
                              <button
                                type="button"
                                onClick={() => removeFile(index)}
                                className="absolute top-0 right-0 bg-red-500 text-white rounded-full w-5 h-5 flex items-center justify-center text-xs hover:bg-red-600"
                              >
                                ×
                              </button>
                            </div>
                          ) : isVideo && preview ? (
                            <div className="relative w-20 h-20 rounded-lg overflow-hidden border border-gray-200">
                              <video src={preview} className="w-full h-full object-cover" />
                              <button
                                type="button"
                                onClick={() => removeFile(index)}
                                className="absolute top-0 right-0 bg-red-500 text-white rounded-full w-5 h-5 flex items-center justify-center text-xs hover:bg-red-600"
                              >
                                ×
                              </button>
                            </div>
                          ) : (
                            <div className="relative bg-gray-100 rounded-lg p-2 border border-gray-200">
                              <p className="text-xs text-gray-700 truncate max-w-[100px]">{file.name}</p>
                              <p className="text-xs text-gray-500">{(file.size / 1024).toFixed(1)} KB</p>
                              <button
                                type="button"
                                onClick={() => removeFile(index)}
                                className="absolute top-0 right-0 bg-red-500 text-white rounded-full w-5 h-5 flex items-center justify-center text-xs hover:bg-red-600"
                              >
                                ×
                              </button>
                            </div>
                          )}
                        </div>
                      )
                    })}
                  </div>
                )}
                <div className="flex items-center gap-1.5 sm:gap-2 md:gap-3">
                  <label className="cursor-pointer p-1 sm:p-1.5 md:p-2 rounded-full hover:bg-gray-100 transition touch-manipulation min-w-[36px] min-h-[36px] sm:min-w-[40px] sm:min-h-[40px] flex items-center justify-center" title="Attach file">
                    <Paperclip className="h-3.5 w-3.5 sm:h-4 sm:w-4 md:h-5 md:w-5 text-gray-600" />
                    <input 
                      ref={fileInputRef}
                      type="file" 
                      className="hidden" 
                      accept="image/*,video/*,.pdf,.doc,.docx,.txt,.zip,.rar" 
                      multiple
                      onChange={handleFileSelect}
                    />
                  </label>
                  <input
                    type="text"
                    placeholder={replyingToMessageId ? "Type your reply..." : "Type your message..."}
                    value={newMessage}
                    onChange={(e) => setNewMessage(e.target.value)}
                    onKeyPress={(e) => {
                      if (e.key === "Enter") {
                        handleSendMessage()
                      }
                    }}
                    className="flex-1 rounded-xl border border-gray-200 bg-gray-50 px-2.5 sm:px-3 md:px-4 py-1.5 sm:py-2 md:py-3 text-[11px] sm:text-xs md:text-sm text-gray-700 focus:border-[#041A44] focus:outline-none focus:ring-2 focus:ring-[#041A44]/20 min-h-[36px] sm:min-h-[40px]"
                  />
                  <button
                    onClick={handleSendMessage}
                    className="rounded-xl bg-[#041A44] p-1.5 sm:p-2 md:p-3 text-white transition hover:bg-[#0b2c6f] touch-manipulation min-w-[36px] min-h-[36px] sm:min-w-[40px] sm:min-h-[40px] flex items-center justify-center"
                  >
                    <Send className="h-3.5 w-3.5 sm:h-4 sm:w-4 md:h-5 md:w-5" />
                  </button>
                </div>
              </div>
            </div>
          ) : (
            <div className="flex flex-1 flex-col items-center justify-center bg-gray-50 text-center">
              <div className="space-y-4 px-8 py-12">
                <div className="mx-auto flex h-24 w-24 items-center justify-center rounded-full bg-white shadow-md">
                  <MessageSquare className="h-10 w-10 text-[#041A44]" />
                </div>
                <div>
                  <h3 className="text-2xl font-semibold text-[#041A44]">
                    Select a User to Start Chatting
                  </h3>
                  <p className="mt-3 text-sm text-gray-500">
                    Choose someone from the user list to begin a conversation
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </section>
  )
}

function SearchIcon({ className }: { className?: string }) {
  return (
    <svg
      className={className}
      xmlns="http://www.w3.org/2000/svg"
      width="16"
      height="16"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <circle cx="11" cy="11" r="8" />
      <path d="m21 21-4.3-4.3" />
    </svg>
  )
}

