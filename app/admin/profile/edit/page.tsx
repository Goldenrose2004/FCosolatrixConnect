"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { AdminHeader, type AdminNavItem } from "@/components/admin/header"
import { Footer } from "@/components/footer"
import { Upload, Trash2, Eye, EyeOff, ArrowLeft, Megaphone, LayoutDashboard, MessageSquare } from "lucide-react"
import Image from "next/image"
import { Input } from "@/components/ui/input"

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

export default function AdminEditProfilePage() {
  const router = useRouter()
  const [user, setUser] = useState<any>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [showCurrentPassword, setShowCurrentPassword] = useState(false)
  const [showNewPassword, setShowNewPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [selectedFile, setSelectedFile] = useState<File | null>(null)
  const [notifications, setNotifications] = useState<any[]>([])
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  })

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
    setFormData({
      firstName: userData?.firstName || "",
      lastName: userData?.lastName || "",
      email: userData?.email || "",
      currentPassword: "",
      newPassword: "",
      confirmPassword: "",
    })

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

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setSelectedFile(e.target.files[0])
    }
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleSaveChanges = () => {
    // Update user data in localStorage
    if (user) {
      const updatedUser = {
        ...user,
        firstName: formData.firstName,
        lastName: formData.lastName,
        email: formData.email,
      }
      localStorage.setItem("currentUser", JSON.stringify(updatedUser))
      setUser(updatedUser)
    }
    
    // Handle password change if provided
    if (formData.newPassword && formData.newPassword === formData.confirmPassword) {
      // Password change logic would go here
      console.log("Password changed")
    }

    // Navigate back to profile
    router.push("/admin/profile")
  }

  const handleRemoveProfilePicture = () => {
    setSelectedFile(null)
    // Additional logic to remove profile picture
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

      <main className="flex-1 py-6 sm:py-8 px-3 sm:px-6 lg:px-8">
        <div className="max-w-full sm:max-w-2xl md:max-w-4xl mx-auto">
          <button
            onClick={() => router.push("/admin/profile")}
            className="flex items-center gap-2 text-gray-600 hover:text-gray-900 mb-5 sm:mb-6 text-sm sm:text-base font-medium"
            style={{ fontFamily: "'Inter', sans-serif" }}
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Back to Profile</span>
          </button>

          <div className="mb-6">
            <h1 className="text-2xl font-bold text-black" style={{ fontFamily: "'Inter', sans-serif" }}>
              Edit Profile
            </h1>
            <p className="text-gray-600 mt-1" style={{ fontFamily: "'Inter', sans-serif" }}>
              Update your personal information and security settings
            </p>
          </div>

          <div className="space-y-4 sm:space-y-6">
            {/* Profile Photo Section */}
            <div className="bg-white rounded-2xl border border-gray-200 p-4 sm:p-6 shadow-md sm:shadow-lg">
              <h3 className="text-lg font-semibold text-black mb-2" style={{ fontFamily: "'Inter', sans-serif" }}>
                Profile Photo
              </h3>
              <p className="text-sm text-gray-600 mb-4" style={{ fontFamily: "'Inter', sans-serif" }}>
                Update your profile picture
              </p>
              <div className="flex items-center gap-4 sm:gap-6">
                <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-full bg-gray-100 flex items-center justify-center flex-shrink-0 border border-gray-200">
                  {selectedFile ? (
                    <Image
                      src={URL.createObjectURL(selectedFile)}
                      alt="Profile"
                      width={96}
                      height={96}
                      className="w-20 h-20 sm:w-24 sm:h-24 rounded-full object-cover"
                    />
                  ) : (
                    <Image
                      src="/images/logo-icon.png"
                      alt="Profile"
                      width={48}
                      height={48}
                      className="w-12 h-12 object-contain"
                    />
                  )}
                </div>
                <div className="flex-1">
                  <p className="text-sm font-medium text-black mb-3" style={{ fontFamily: "'Inter', sans-serif" }}>
                    Upload New Profile Picture
                  </p>
                  <div className="flex flex-col sm:flex-row items-start sm:items-center gap-2 sm:gap-3 mb-3">
                    <label className="cursor-pointer">
                      <input
                        type="file"
                        accept="image/*"
                        onChange={handleFileChange}
                        className="hidden"
                        id="profile-upload"
                      />
                      <span
                        className="inline-flex items-center rounded-full border border-gray-300 px-4 py-2 text-sm font-medium bg-white shadow-sm hover:bg-gray-50 transition-colors"
                        onClick={() => document.getElementById("profile-upload")?.click()}
                      >
                        Choose File
                      </span>
                    </label>
                    <span className="text-xs sm:text-sm text-gray-500 break-all" style={{ fontFamily: "'Inter', sans-serif" }}>
                      {selectedFile ? selectedFile.name : "No file chosen"}
                    </span>
                  </div>
                  <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2 sm:gap-3">
                    <button
                      type="button"
                      className="w-full sm:w-auto bg-blue-600 hover:bg-blue-700 text-white rounded-full px-4 py-2 text-sm font-semibold shadow-md flex items-center justify-center gap-2"
                      onClick={() => document.getElementById("profile-upload")?.click()}
                    >
                      <Upload className="w-4 h-4" />
                      Upload Picture
                    </button>
                    <button
                      type="button"
                      className="w-full sm:w-auto border border-red-300 text-red-600 rounded-full px-4 py-2 text-sm font-semibold flex items-center justify-center gap-2 hover:bg-red-50 transition-colors"
                      onClick={handleRemoveProfilePicture}
                    >
                      <Trash2 className="w-4 h-4" />
                      Remove Profile Picture
                    </button>
                  </div>
                </div>
              </div>
            </div>

            {/* Personal Information Section */}
            <div className="bg-white rounded-2xl border border-gray-200 p-4 sm:p-6 shadow-md sm:shadow-lg">
              <h3 className="text-lg font-semibold text-black mb-4" style={{ fontFamily: "'Inter', sans-serif" }}>
                Personal Information
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2" style={{ fontFamily: "'Inter', sans-serif" }}>
                    First Name
                  </label>
                  <Input
                    type="text"
                    name="firstName"
                    value={formData.firstName}
                    onChange={handleInputChange}
                    className="w-full"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2" style={{ fontFamily: "'Inter', sans-serif" }}>
                    Last Name
                  </label>
                  <Input
                    type="text"
                    name="lastName"
                    value={formData.lastName}
                    onChange={handleInputChange}
                    className="w-full"
                  />
                </div>
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-2" style={{ fontFamily: "'Inter', sans-serif" }}>
                    Email Address
                  </label>
                  <Input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    className="w-full"
                  />
                </div>
              </div>
            </div>

            {/* Security Section */}
            <div className="bg-white rounded-2xl border border-gray-200 p-4 sm:p-6 shadow-md sm:shadow-lg">
              <h3 className="text-lg font-semibold text-black mb-4" style={{ fontFamily: "'Inter', sans-serif" }}>
                Security
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2" style={{ fontFamily: "'Inter', sans-serif" }}>
                    Current Password
                  </label>
                  <div className="relative">
                    <Input
                      type={showCurrentPassword ? "text" : "password"}
                      name="currentPassword"
                      value={formData.currentPassword}
                      onChange={handleInputChange}
                      placeholder="Enter current password"
                      className="w-full pr-10"
                    />
                    <button
                      type="button"
                      onClick={() => setShowCurrentPassword(!showCurrentPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700"
                    >
                      {showCurrentPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2" style={{ fontFamily: "'Inter', sans-serif" }}>
                    New Password
                  </label>
                  <div className="relative">
                    <Input
                      type={showNewPassword ? "text" : "password"}
                      name="newPassword"
                      value={formData.newPassword}
                      onChange={handleInputChange}
                      placeholder="Enter new password"
                      className="w-full pr-10"
                    />
                    <button
                      type="button"
                      onClick={() => setShowNewPassword(!showNewPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700"
                    >
                      {showNewPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                </div>
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-2" style={{ fontFamily: "'Inter', sans-serif" }}>
                    Confirm Password
                  </label>
                  <div className="relative">
                    <Input
                      type={showConfirmPassword ? "text" : "password"}
                      name="confirmPassword"
                      value={formData.confirmPassword}
                      onChange={handleInputChange}
                      placeholder="Confirm new password"
                      className="w-full pr-10"
                    />
                    <button
                      type="button"
                      onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700"
                    >
                      {showConfirmPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                </div>
              </div>
              <p className="text-sm text-gray-600 mt-4" style={{ fontFamily: "'Inter', sans-serif" }}>
                Leave password fields empty if you don't want to change your password.
              </p>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row gap-3 pt-4">
              <button
                type="button"
                className="w-full sm:w-auto border border-gray-300 rounded-full px-4 py-2.5 text-sm font-semibold text-gray-700 bg-white hover:bg-gray-50 transition-colors"
                onClick={() => router.push("/admin/profile")}
              >
                Cancel
              </button>
              <button
                type="button"
                className="w-full sm:w-auto bg-[#041A44] hover:bg-[#1e3a8a] text-white rounded-full px-4 py-2.5 text-sm font-semibold shadow-[0_12px_24px_rgba(8,26,68,0.35)]"
                onClick={handleSaveChanges}
              >
                Save Changes
              </button>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  )
}

