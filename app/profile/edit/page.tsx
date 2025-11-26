"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { AuthenticatedHeader } from "@/components/authenticated-header"
import { Upload, Trash2, Eye, EyeOff, ArrowLeft, Check, GraduationCap } from "lucide-react"
import Image from "next/image"

const departmentYearMap: Record<string, string[]> = {
  College: ["1st Year", "2nd Year", "3rd Year", "4th Year"],
  "Senior High School": ["Grade 11", "Grade 12"],
  "Junior High School": ["Grade 7", "Grade 8", "Grade 9", "Grade 10"],
  Elementary: ["Grade 1", "Grade 2", "Grade 3", "Grade 4", "Grade 5", "Grade 6"],
}

export default function EditProfilePage() {
  const router = useRouter()
  const [user, setUser] = useState<any>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [showCurrentPassword, setShowCurrentPassword] = useState(false)
  const [showNewPassword, setShowNewPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [selectedFile, setSelectedFile] = useState<File | null>(null)
  const [fileName, setFileName] = useState<string>("No file chosen")
  const [showSuccessMessage, setShowSuccessMessage] = useState(false)
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
    section: "",
    strand: "",
    course: "",
    yearLevel: "",
  })

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
          setFormData({
            firstName: data.user.firstName || "",
            lastName: data.user.lastName || "",
            email: data.user.email || "",
            currentPassword: "",
            newPassword: "",
            confirmPassword: "",
            section: data.user.section || "",
            strand: data.user.strand || "",
            course: data.user.course || "",
            yearLevel: data.user.yearLevel || "",
          })
        } else {
          // Fallback to localStorage data if API fails
          setUser(userData)
          setFormData({
            firstName: userData.firstName || "",
            lastName: userData.lastName || "",
            email: userData.email || "",
            currentPassword: "",
            newPassword: "",
            confirmPassword: "",
            section: userData.section || "",
            strand: userData.strand || "",
            course: userData.course || "",
            yearLevel: userData.yearLevel || "",
          })
        }
      } catch (error) {
        console.error("Error fetching fresh user data:", error)
        // Fallback to localStorage data if API fails
        setUser(userData)
        setFormData({
          firstName: userData.firstName || "",
          lastName: userData.lastName || "",
          email: userData.email || "",
          currentPassword: "",
          newPassword: "",
          confirmPassword: "",
          section: userData.section || "",
          strand: userData.strand || "",
          course: userData.course || "",
          yearLevel: userData.yearLevel || "",
        })
      }
    }

    fetchFreshUserData()
    setIsLoading(false)
  }, [router])

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0]
      setSelectedFile(file)
      setFileName(file.name)
    }
  }

  const handleUploadPicture = async () => {
    if (!selectedFile || !user) return

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
        
        // Reset file input
        const fileInput = document.getElementById("profile_picture") as HTMLInputElement
        if (fileInput) {
          fileInput.value = ""
        }
        
        alert("Profile picture uploaded successfully!")
      } else {
        alert("Failed to upload profile picture: " + (data.error || "Unknown error"))
      }
    } catch (error) {
      console.error("Error uploading profile picture:", error)
      alert("Failed to upload profile picture")
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
      } else {
        alert("Failed to remove profile picture: " + (data.error || "Unknown error"))
      }
    } catch (error) {
      console.error("Error removing profile picture:", error)
      alert("Failed to remove profile picture")
    }
  }

  const handleSaveChanges = async () => {
    if (!user) return

    try {
      // Prepare the profile edit request
      const currentProfile = {
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,
        section: user.section || null,
        strand: user.strand || null,
        course: user.course || null,
        yearLevel: user.yearLevel || null,
      }

      const editedProfile = {
        firstName: formData.firstName,
        lastName: formData.lastName,
        email: formData.email,
        section: formData.section || null,
        strand: formData.strand || null,
        course: formData.course || null,
        yearLevel: formData.yearLevel || null,
      }

      // Submit profile edit request
      const response = await fetch("/api/profile-edit-requests", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          userId: user.id,
          currentProfile,
          editedProfile,
        }),
      })

      const data = await response.json()
      if (data.ok) {
        setShowSuccessMessage(true)
        setTimeout(() => {
          setShowSuccessMessage(false)
          router.push("/profile")
        }, 3000)
      } else {
        alert("Failed to submit profile edit request: " + (data.error || "Unknown error"))
      }
    } catch (error) {
      console.error("Error submitting profile edit request:", error)
      alert("Failed to submit profile edit request")
    }
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen" style={{ fontFamily: "'Inter', sans-serif" }}>
        Loading...
      </div>
    )
  }

  const userInitials = (user?.firstName?.[0] || "U") + (user?.lastName?.[0] || "")

  return (
    <div className="min-h-screen flex flex-col" style={{ backgroundColor: "#f3f4f6", fontFamily: "'Inter', sans-serif" }}>
      <AuthenticatedHeader userName={user?.firstName} userInitials={userInitials} useLandingPageStylingMobileOnly={true} />

      <main className="flex-1 py-4 sm:py-8 px-3 sm:px-4" style={{ backgroundColor: "#f3f4f6" }}>
        <div className="max-w-4xl mx-auto">
          {/* Back to Profile Link */}
          <div className="mb-4 sm:mb-6">
            <button
              onClick={() => router.push("/profile")}
              className="inline-flex items-center hover:opacity-80 transition-colors text-sm sm:text-base"
              style={{ color: "#041A44" }}
            >
              <ArrowLeft className="w-3.5 h-3.5 sm:w-4 sm:h-4 mr-1.5 sm:mr-2" />
              Back to Profile
            </button>
          </div>

          {/* Success Message Notification */}
          {showSuccessMessage && (
            <div 
              className="mb-4 sm:mb-6 flex items-center"
              style={{
                backgroundColor: "#e6ffe6",
                border: "1px solid #c8e6c9",
                borderRadius: "8px",
                padding: "10px 12px",
                boxShadow: "0 1px 3px rgba(0, 0, 0, 0.1)"
              }}
            >
              <div 
                className="rounded-full flex items-center justify-center mr-2 sm:mr-3 flex-shrink-0"
                style={{ 
                  backgroundColor: "#388e3c",
                  width: "20px",
                  height: "20px"
                }}
              >
                <Check className="text-white" style={{ width: "14px", height: "14px", strokeWidth: 3 }} />
              </div>
              <p 
                style={{ 
                  color: "#2e7d32",
                  fontWeight: 500,
                  fontSize: "12px",
                  margin: 0
                }}
              >
                Profile edit request submitted! Waiting for admin approval.
              </p>
            </div>
          )}

          {/* Page Header */}
          <div className="mb-5 sm:mb-8">
            <h1 className="text-xl sm:text-2xl font-bold text-gray-900 mb-1.5 sm:mb-2">Edit Profile</h1>
            <p className="text-gray-600 text-sm sm:text-base">Update your personal information and security settings</p>
          </div>

          <form onSubmit={(e) => { e.preventDefault(); handleSaveChanges(); }} className="space-y-4 sm:space-y-6">
            {/* Profile Photo Card */}
            <div className="bg-white rounded-lg sm:rounded-xl shadow-lg p-4 sm:p-6">
              <div className="flex flex-col sm:flex-row items-center sm:items-start space-y-4 sm:space-y-0 sm:space-x-6">
                {/* Profile Picture on Left */}
                <div className="w-20 h-20 sm:w-32 sm:h-32 rounded-full bg-white flex items-center justify-center overflow-hidden border-2 border-gray-200 flex-shrink-0">
                  {selectedFile ? (
                    <Image
                      src={URL.createObjectURL(selectedFile)}
                      alt="Profile"
                      width={128}
                      height={128}
                      className="w-full h-full object-cover rounded-full"
                    />
                  ) : user?.profilePicture ? (
                    <Image
                      src={user.profilePicture}
                      alt="Profile"
                      width={128}
                      height={128}
                      className="w-full h-full object-cover rounded-full"
                    />
                  ) : (
                    <Image
                      src="/images/logo-icon.png"
                      alt="Profile"
                      width={80}
                      height={80}
                      className="w-12 h-12 sm:w-20 sm:h-20 object-contain"
                    />
                  )}
                </div>

                {/* Content on Right */}
                <div className="flex-1 w-full sm:w-auto">
                  <div className="mb-3 sm:mb-4">
                    <h3 className="text-base sm:text-lg font-semibold text-gray-900 mb-0.5 sm:mb-1 text-center sm:text-left">Profile Photo</h3>
                    <p className="text-xs sm:text-sm text-gray-500 text-center sm:text-left">Update your profile picture</p>
                  </div>

                  {/* Upload New Profile Picture Section */}
                  <div className="mb-3 sm:mb-4">
                    <h4 className="text-xs sm:text-sm font-medium text-gray-700 mb-2 sm:mb-3">Upload New Profile Picture</h4>

                    {/* Choose File Button and File Status */}
                    <div className="flex flex-row items-center gap-2 sm:gap-3 mb-2 sm:mb-3">
                      <button
                        type="button"
                        onClick={() => document.getElementById("profile_picture")?.click()}
                        className="bg-blue-50 text-blue-600 px-3 sm:px-4 py-1.5 sm:py-2 rounded-lg border border-blue-200 hover:bg-blue-100 transition-colors text-xs sm:text-sm font-medium"
                      >
                        Choose File
                      </button>
                      <span className="text-xs sm:text-sm text-gray-500 break-all">{fileName}</span>
                    </div>

                    {/* Upload and Remove Buttons */}
                    <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2 sm:gap-3 sm:space-x-3">
                      <button
                        type="button"
                        onClick={handleUploadPicture}
                        className="bg-blue-600 text-white px-3 sm:px-4 py-1.5 sm:py-2 rounded-lg hover:bg-blue-700 transition-colors text-xs sm:text-sm font-medium flex items-center justify-center"
                      >
                        <Upload className="w-3.5 h-3.5 sm:w-4 sm:h-4 mr-1.5 sm:mr-2" />
                        Upload Picture
                      </button>
                      <button
                        type="button"
                        onClick={handleRemoveProfilePicture}
                        className="bg-red-50 text-red-600 px-3 sm:px-4 py-1.5 sm:py-2 rounded-lg border border-red-200 hover:bg-red-100 transition-colors text-xs sm:text-sm font-medium flex items-center justify-center"
                      >
                        <Trash2 className="w-3.5 h-3.5 sm:w-4 sm:h-4 mr-1.5 sm:mr-2" />
                        Remove Profile Picture
                      </button>
                    </div>
                  </div>
                </div>
              </div>
              <input
                type="file"
                id="profile_picture"
                accept="image/*"
                onChange={handleFileChange}
                className="hidden"
              />
            </div>

            {/* Personal Information Card */}
            <div className="bg-white rounded-lg sm:rounded-xl shadow-lg p-4 sm:p-6">
              <div className="mb-4 sm:mb-6">
                <h3 className="text-base sm:text-lg font-semibold text-gray-900 mb-0.5 sm:mb-1">Personal Information</h3>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
                <div>
                  <label htmlFor="firstName" className="block text-xs sm:text-sm font-medium text-gray-700 mb-1.5 sm:mb-2">
                    First Name
                  </label>
                  <input
                    type="text"
                    id="firstName"
                    name="firstName"
                    value={formData.firstName}
                    onChange={handleInputChange}
                    className="w-full px-3 sm:px-4 py-2 sm:py-2.5 border border-gray-300 rounded-lg text-sm sm:text-base focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
                <div>
                  <label htmlFor="lastName" className="block text-xs sm:text-sm font-medium text-gray-700 mb-1.5 sm:mb-2">
                    Last Name
                  </label>
                  <input
                    type="text"
                    id="lastName"
                    name="lastName"
                    value={formData.lastName}
                    onChange={handleInputChange}
                    className="w-full px-3 sm:px-4 py-2 sm:py-2.5 border border-gray-300 rounded-lg text-sm sm:text-base focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
                <div className="md:col-span-2">
                  <label htmlFor="email" className="block text-xs sm:text-sm font-medium text-gray-700 mb-1.5 sm:mb-2">
                    Email Address
                  </label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    className="w-full px-3 sm:px-4 py-2 sm:py-2.5 border border-gray-300 rounded-lg text-sm sm:text-base focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
              </div>
            </div>

            {/* Academic Information Card */}
            <div className="bg-white rounded-lg sm:rounded-xl shadow-lg p-4 sm:p-6">
              <div className="mb-4 sm:mb-6">
                <div className="flex items-center gap-2">
                  <GraduationCap className="w-4 h-4 sm:w-5 sm:h-5 text-gray-700" />
                  <h3 className="text-base sm:text-lg font-semibold text-gray-900">Academic Information</h3>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
                {/* Year Level Dropdown */}
                <div>
                  <label htmlFor="yearLevel" className="block text-xs sm:text-sm font-medium text-gray-700 mb-1.5 sm:mb-2">
                    Year Level <span className="text-red-500">*</span>
                  </label>
                  <select
                    id="yearLevel"
                    name="yearLevel"
                    value={formData.yearLevel}
                    onChange={handleInputChange}
                    className="w-full px-3 sm:px-4 py-2 sm:py-2.5 border border-gray-300 rounded-lg text-sm sm:text-base focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white"
                  >
                    <option value="">Select Year Level</option>
                    {user?.department && departmentYearMap[user.department]?.map((level) => (
                      <option key={level} value={level}>
                        {level}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Section/Blocks */}
                <div>
                  <label htmlFor="section" className="block text-xs sm:text-sm font-medium text-gray-700 mb-1.5 sm:mb-2">
                    Blocks/Section
                  </label>
                  <input
                    type="text"
                    id="section"
                    name="section"
                    value={formData.section}
                    onChange={handleInputChange}
                    placeholder="e.g., A, B, 1, 2"
                    className="w-full px-3 sm:px-4 py-2 sm:py-2.5 border border-gray-300 rounded-lg text-sm sm:text-base focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>

                {/* Strand (for Senior High School) */}
                {user?.department === "Senior High School" && (
                  <div>
                    <label htmlFor="strand" className="block text-xs sm:text-sm font-medium text-gray-700 mb-1.5 sm:mb-2">
                      Strand
                    </label>
                    <input
                      type="text"
                      id="strand"
                      name="strand"
                      value={formData.strand}
                      onChange={handleInputChange}
                      placeholder="e.g., STEM, ABM, HUMSS"
                      className="w-full px-3 sm:px-4 py-2 sm:py-2.5 border border-gray-300 rounded-lg text-sm sm:text-base focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>
                )}

                {/* Course (for College) */}
                {user?.department === "College" && (
                  <div>
                    <label htmlFor="course" className="block text-xs sm:text-sm font-medium text-gray-700 mb-1.5 sm:mb-2">
                      Course
                    </label>
                    <input
                      type="text"
                      id="course"
                      name="course"
                      value={formData.course}
                      onChange={handleInputChange}
                      placeholder="e.g., BSIT, BSCS, BSED"
                      className="w-full px-3 sm:px-4 py-2 sm:py-2.5 border border-gray-300 rounded-lg text-sm sm:text-base focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>
                )}
              </div>
            </div>

            {/* Security Card */}
            <div className="bg-white rounded-lg sm:rounded-xl shadow-lg p-4 sm:p-6">
              <div className="mb-4 sm:mb-6">
                <h3 className="text-base sm:text-lg font-semibold text-gray-900 mb-0.5 sm:mb-1">Security</h3>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
                <div>
                  <label htmlFor="currentPassword" className="block text-xs sm:text-sm font-medium text-gray-700 mb-1.5 sm:mb-2">
                    Current Password
                  </label>
                  <div className="relative">
                    <input
                      type={showCurrentPassword ? "text" : "password"}
                      id="currentPassword"
                      name="currentPassword"
                      value={formData.currentPassword}
                      onChange={handleInputChange}
                      placeholder="Enter current password"
                      className="w-full px-3 sm:px-4 py-2 sm:py-2.5 pr-10 border border-gray-300 rounded-lg text-sm sm:text-base focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                    <button
                      type="button"
                      onClick={() => setShowCurrentPassword(!showCurrentPassword)}
                      className="absolute right-2.5 sm:right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700"
                    >
                      {showCurrentPassword ? <EyeOff className="w-4 h-4 sm:w-5 sm:h-5" /> : <Eye className="w-4 h-4 sm:w-5 sm:h-5" />}
                    </button>
                  </div>
                </div>
                <div>
                  <label htmlFor="newPassword" className="block text-xs sm:text-sm font-medium text-gray-700 mb-1.5 sm:mb-2">
                    New Password
                  </label>
                  <div className="relative">
                    <input
                      type={showNewPassword ? "text" : "password"}
                      id="newPassword"
                      name="newPassword"
                      value={formData.newPassword}
                      onChange={handleInputChange}
                      placeholder="Enter new password"
                      className="w-full px-3 sm:px-4 py-2 sm:py-2.5 pr-10 border border-gray-300 rounded-lg text-sm sm:text-base focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                    <button
                      type="button"
                      onClick={() => setShowNewPassword(!showNewPassword)}
                      className="absolute right-2.5 sm:right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700"
                    >
                      {showNewPassword ? <EyeOff className="w-4 h-4 sm:w-5 sm:h-5" /> : <Eye className="w-4 h-4 sm:w-5 sm:h-5" />}
                    </button>
                  </div>
                </div>
                <div className="md:col-span-2">
                  <label htmlFor="confirmPassword" className="block text-xs sm:text-sm font-medium text-gray-700 mb-1.5 sm:mb-2">
                    Confirm Password
                  </label>
                  <div className="relative">
                    <input
                      type={showConfirmPassword ? "text" : "password"}
                      id="confirmPassword"
                      name="confirmPassword"
                      value={formData.confirmPassword}
                      onChange={handleInputChange}
                      placeholder="Confirm new password"
                      className="w-full px-3 sm:px-4 py-2 sm:py-2.5 pr-10 border border-gray-300 rounded-lg text-sm sm:text-base focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                    <button
                      type="button"
                      onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                      className="absolute right-2.5 sm:right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700"
                    >
                      {showConfirmPassword ? <EyeOff className="w-4 h-4 sm:w-5 sm:h-5" /> : <Eye className="w-4 h-4 sm:w-5 sm:h-5" />}
                    </button>
                  </div>
                </div>
              </div>
              <p className="text-xs sm:text-sm text-gray-600 mt-3 sm:mt-4">
                Leave password fields empty if you don't want to change your password.
              </p>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row justify-end gap-2 sm:gap-3 pt-3 sm:pt-4">
              <button
                type="button"
                onClick={() => router.push("/profile")}
                className="px-4 sm:px-6 py-2 sm:py-2.5 border border-gray-300 rounded-lg text-sm sm:text-base font-medium text-gray-700 hover:bg-gray-50 transition-colors"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-4 sm:px-6 py-2 sm:py-2.5 bg-[#041A44] text-white rounded-lg hover:bg-[#1e3a8a] transition-colors text-sm sm:text-base font-medium"
              >
                Save Changes
              </button>
            </div>
          </form>
        </div>
      </main>
    </div>
  )
}
