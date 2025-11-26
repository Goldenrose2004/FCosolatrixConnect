"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { AdminHeader, type AdminNavItem } from "@/components/admin/header"
import { Footer } from "@/components/footer"
import { Upload, Trash2, ArrowLeft, Megaphone, LayoutDashboard, MessageSquare, Eye } from "lucide-react"
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

export default function AdminUploadProfilePage() {
  const router = useRouter()
  const [user, setUser] = useState<any>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [selectedFile, setSelectedFile] = useState<File | null>(null)
  const [fileName, setFileName] = useState<string>("No file chosen")
  const [filePreview, setFilePreview] = useState<string | null>(null)
  const [isUploading, setIsUploading] = useState(false)
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
    setIsLoading(false)
  }, [router])

  // Poll for new notifications every 5 seconds
  useEffect(() => {
    if (!user?.id) return

    fetchNotifications(user.id)

    const interval = setInterval(() => {
      fetchNotifications(user.id)
    }, 5000)

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
      const file = e.target.files[0]
      setSelectedFile(file)
      setFileName(file.name)
      
      // Create preview
      const reader = new FileReader()
      reader.onload = (e) => {
        setFilePreview(e.target?.result as string)
      }
      reader.readAsDataURL(file)
    }
  }

  const handleUploadPicture = async () => {
    if (!selectedFile || !user) return

    setIsUploading(true)

    try {
      // Convert file to base64
      const reader = new FileReader()
      const fileData = await new Promise<string>((resolve, reject) => {
        reader.onload = (e) => resolve(e.target?.result as string)
        reader.onerror = reject
        reader.readAsDataURL(selectedFile)
      })

      // Extract base64 data (remove data:type;base64, prefix)
      const base64Data = fileData.split(',')[1]
      const mimeType = selectedFile.type

      // Update profile picture via API
      const response = await fetch(`/api/users/${user.id}/profile-picture`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          profilePicture: `data:${mimeType};base64,${base64Data}`,
          profilePictureName: selectedFile.name,
        }),
      })

      const data = await response.json()

      if (data.ok && data.user) {
        // Update user in localStorage
        const updatedUser = { ...user, profilePicture: data.user.profilePicture }
        localStorage.setItem("currentUser", JSON.stringify(updatedUser))
        setUser(updatedUser)
        
        // Dispatch event to update profile picture in chats
        window.dispatchEvent(new CustomEvent("profilePictureUpdated", { detail: updatedUser }))
        
        // Clear selection
        setSelectedFile(null)
        setFileName("No file chosen")
        setFilePreview(null)
        
        // Reset file input
        const fileInput = document.getElementById("profile-upload") as HTMLInputElement
        if (fileInput) {
          fileInput.value = ""
        }
        
        alert("Profile picture uploaded successfully!")
        
        // Navigate back to profile
        router.push("/admin/profile")
      } else {
        alert("Failed to upload profile picture: " + (data.error || "Unknown error"))
      }
    } catch (error) {
      console.error("Error uploading profile picture:", error)
      alert("Failed to upload profile picture")
    } finally {
      setIsUploading(false)
    }
  }

  const handleRemoveProfilePicture = async () => {
    if (!user) return

    if (!confirm("Are you sure you want to remove your profile picture?")) {
      return
    }

    try {
      const response = await fetch(`/api/users/${user.id}/profile-picture`, {
        method: "DELETE",
      })

      const data = await response.json()

      if (data.ok && data.user) {
        // Update user in localStorage
        const updatedUser = { ...user, profilePicture: null }
        localStorage.setItem("currentUser", JSON.stringify(updatedUser))
        setUser(updatedUser)
        
        // Dispatch event to update profile picture in chats
        window.dispatchEvent(new CustomEvent("profilePictureUpdated", { detail: updatedUser }))
        
        alert("Profile picture removed successfully!")
        
        // Navigate back to profile
        router.push("/admin/profile")
      } else {
        alert("Failed to remove profile picture: " + (data.error || "Unknown error"))
      }
    } catch (error) {
      console.error("Error removing profile picture:", error)
      alert("Failed to remove profile picture")
    }
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

      <main className="flex-1 py-4 sm:py-8 px-3 sm:px-4" style={{ backgroundColor: "#f5f7fb" }}>
        <div className="max-w-2xl mx-auto">
          <button
            onClick={() => router.push("/admin/profile")}
            className="flex items-center gap-2 text-gray-600 hover:text-gray-900 mb-4 sm:mb-6"
            style={{ fontFamily: "'Inter', sans-serif" }}
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Back to Profile</span>
          </button>

          <div className="mb-5 sm:mb-8">
            <h1 className="text-xl sm:text-2xl font-bold text-gray-900 mb-1.5 sm:mb-2">Upload Profile Picture</h1>
            <p className="text-gray-600 text-sm sm:text-base">Update your profile picture</p>
          </div>

          <div className="bg-white rounded-lg sm:rounded-xl shadow-lg p-4 sm:p-6">
            <div className="flex flex-col sm:flex-row items-center sm:items-start space-y-4 sm:space-y-0 sm:space-x-6">
              {/* Profile Picture Preview */}
              <div className="w-32 h-32 sm:w-40 sm:h-40 rounded-full bg-gray-200 flex items-center justify-center overflow-hidden border-2 border-gray-200 flex-shrink-0">
                {filePreview ? (
                  <Image
                    src={filePreview}
                    alt="Profile Preview"
                    width={160}
                    height={160}
                    className="w-full h-full object-cover rounded-full"
                  />
                ) : user?.profilePicture ? (
                  <Image
                    src={user.profilePicture}
                    alt="Profile"
                    width={160}
                    height={160}
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

              {/* Upload Controls */}
              <div className="flex-1 w-full sm:w-auto">
                <div className="mb-3 sm:mb-4">
                  <h3 className="text-base sm:text-lg font-semibold text-gray-900 mb-0.5 sm:mb-1 text-center sm:text-left">Profile Photo</h3>
                  <p className="text-xs sm:text-sm text-gray-500 text-center sm:text-left">Upload a new profile picture</p>
                </div>

                <div className="mb-3 sm:mb-4">
                  <h4 className="text-xs sm:text-sm font-medium text-gray-700 mb-2 sm:mb-3">Upload New Profile Picture</h4>

                  {/* File Input with Mobile Support */}
                  <div className="flex flex-row items-center gap-2 sm:gap-3 mb-2 sm:mb-3">
                    <label 
                      htmlFor="profile-upload"
                      className="cursor-pointer bg-blue-50 text-blue-600 px-3 sm:px-4 py-1.5 sm:py-2 rounded-lg border border-blue-200 hover:bg-blue-100 transition-colors text-xs sm:text-sm font-medium"
                    >
                      Choose File
                    </label>
                    <input
                      type="file"
                      id="profile-upload"
                      accept="image/*"
                      onChange={handleFileChange}
                      className="hidden"
                    />
                    <span className="text-xs sm:text-sm text-gray-500 break-all">{fileName}</span>
                  </div>

                  {/* Upload and Remove Buttons */}
                  <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2 sm:gap-3">
                    <button
                      type="button"
                      onClick={handleUploadPicture}
                      disabled={!selectedFile || isUploading}
                      className="bg-blue-600 text-white px-3 sm:px-4 py-1.5 sm:py-2 rounded-lg hover:bg-blue-700 transition-colors text-xs sm:text-sm font-medium flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      <Upload className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                      {isUploading ? "Uploading..." : "Upload Picture"}
                    </button>
                    {user?.profilePicture && (
                      <button
                        type="button"
                        onClick={handleRemoveProfilePicture}
                        className="bg-red-50 text-red-600 px-3 sm:px-4 py-1.5 sm:py-2 rounded-lg border border-red-200 hover:bg-red-100 transition-colors text-xs sm:text-sm font-medium flex items-center justify-center gap-2"
                      >
                        <Trash2 className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                        Remove Picture
                      </button>
                    )}
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

