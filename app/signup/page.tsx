"use client"

import type React from "react"

import { useState } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { X } from "lucide-react"

const departmentYearMap: Record<string, string[]> = {
  College: ["1st Year", "2nd Year", "3rd Year", "4th Year"],
  "Senior High School": ["Grade 11", "Grade 12"],
  "Junior High School": ["Grade 7", "Grade 8", "Grade 9", "Grade 10"],
  Elementary: ["Grade 1", "Grade 2", "Grade 3", "Grade 4", "Grade 5", "Grade 6"],
}

export default function SignUpPage() {
  const router = useRouter()
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
    confirmPassword: "",
    studentId: "",
    department: "",
    yearLevel: "",
  })

  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [error, setError] = useState("")
  const [isLoading, setIsLoading] = useState(false)

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({
      ...prev,
      [name]: value,
      // Reset year level if department changes
      ...(name === "department" && { yearLevel: "" }),
    }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")

    // Validation
    if (
      !formData.firstName ||
      !formData.lastName ||
      !formData.email ||
      !formData.password ||
      !formData.confirmPassword ||
      !formData.studentId ||
      !formData.department ||
      !formData.yearLevel
    ) {
      setError("Please fill in all fields")
      return
    }

    // Email validation
    if (!formData.email.includes("@")) {
      setError("Please enter a valid email")
      return
    }

    // Password match validation
    if (formData.password !== formData.confirmPassword) {
      setError("Passwords do not match")
      return
    }

    // Password length validation
    if (formData.password.length < 6) {
      setError("Password must be at least 6 characters")
      return
    }

    setIsLoading(true)

    try {
      const response = await fetch("/api/auth/signup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          firstName: formData.firstName,
          lastName: formData.lastName,
          email: formData.email,
          password: formData.password,
          studentId: formData.studentId,
          department: formData.department,
          yearLevel: formData.yearLevel,
        }),
      })

      const contentType = response.headers.get("content-type") || ""
      let data: any = null
      if (contentType.includes("application/json")) {
        data = await response.json()
      } else {
        const text = await response.text()
        data = { error: text }
      }

      if (!response.ok) {
        setError(data.error || "Signup failed")
        setIsLoading(false)
        return
      }

      // Redirect to login with success message
      router.push("/login?signup=success")
    } catch (err) {
      console.error("Signup error:", err)
      setError("An error occurred. Please try again.")
      setIsLoading(false)
    }
  }

  const availableYearLevels = departmentYearMap[formData.department] || []

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center p-2 sm:p-4">
      <div className="bg-white rounded-2xl shadow-xl p-4 sm:p-6 md:p-8 w-full max-w-xs sm:max-w-md relative mt-4 sm:mt-0">
        <Link
          href="/"
          className="absolute top-3 right-3 sm:top-4 sm:right-4 text-gray-500 hover:text-gray-700 transition"
          aria-label="Close"
        >
          <X size={20} className="sm:w-6 sm:h-6" />
        </Link>

        <div className="text-center mb-6 sm:mb-8">
          <h1 className="text-xl sm:text-2xl font-bold text-gray-900 mb-2" style={{ fontFamily: "'Inter', sans-serif" }}>Create an Account</h1>
          <p className="text-gray-600 text-xs sm:text-sm" style={{ fontFamily: "'Inter', sans-serif" }}>Join ConsolatrixConnect to access the digital handbook</p>
        </div>

        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-3 sm:px-4 py-2 sm:py-3 rounded-lg mb-4 sm:mb-6 text-xs sm:text-sm" style={{ fontFamily: "'Inter', sans-serif" }}>
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-3 sm:space-y-4" autoComplete="off">
          {/* Name Fields */}
          <div className="grid grid-cols-2 gap-2 sm:gap-4">
            <div>
              <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-1.5 sm:mb-2" style={{ fontFamily: "'Inter', sans-serif" }}>First Name</label>
              <input
                type="text"
                name="firstName"
                placeholder="Enter first name"
                value={formData.firstName}
                onChange={handleChange}
                autoComplete="off"
                autoCapitalize="words"
                autoCorrect="off"
                spellCheck={false}
                title="Please fill out this field"
                className="w-full px-3 sm:px-4 py-2.5 sm:py-3 bg-blue-50 border-0 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all duration-200 text-sm"
                style={{ fontFamily: "'Inter', sans-serif" }}
              />
            </div>
            <div>
              <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-1.5 sm:mb-2" style={{ fontFamily: "'Inter', sans-serif" }}>Last Name</label>
              <input
                type="text"
                name="lastName"
                placeholder="Enter last name"
                value={formData.lastName}
                onChange={handleChange}
                autoComplete="off"
                autoCapitalize="words"
                autoCorrect="off"
                spellCheck={false}
                title="Please fill out this field"
                className="w-full px-3 sm:px-4 py-2.5 sm:py-3 bg-blue-50 border-0 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all duration-200 text-sm"
                style={{ fontFamily: "'Inter', sans-serif" }}
              />
            </div>
          </div>

          {/* Email */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2" style={{ fontFamily: "'Inter', sans-serif" }}>Email</label>
            <input
              type="email"
              name="email"
              placeholder="Enter your email"
              value={formData.email}
              onChange={handleChange}
              autoComplete="off"
              autoCapitalize="none"
              autoCorrect="off"
              spellCheck={false}
              title="Please fill out this field"
              className="w-full px-4 py-3 bg-blue-50 border-0 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all duration-200 text-sm"
              style={{ fontFamily: "'Inter', sans-serif" }}
            />
          </div>

          {/* Password */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2" style={{ fontFamily: "'Inter', sans-serif" }}>Password</label>
            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                name="password"
                placeholder="Enter password"
                value={formData.password}
                onChange={handleChange}
                autoComplete="new-password"
                autoCapitalize="none"
                autoCorrect="off"
                spellCheck={false}
                title="Password must contain: 8+ characters, uppercase, lowercase, number, special character"
                className="w-full px-3 sm:px-4 py-2.5 sm:py-3 bg-blue-50 border-0 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all duration-200 pr-10 sm:pr-12 text-sm"
                style={{ fontFamily: "'Inter', sans-serif" }}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 sm:right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 focus:outline-none"
              >
                <i className={`fas ${showPassword ? "fa-eye-slash" : "fa-eye"}`} id="passwordToggle"></i>
              </button>
            </div>
          </div>

          {/* Confirm Password */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2" style={{ fontFamily: "'Inter', sans-serif" }}>Confirm Password</label>
            <div className="relative">
              <input
                type={showConfirmPassword ? "text" : "password"}
                name="confirmPassword"
                placeholder="Confirm password"
                value={formData.confirmPassword}
                onChange={handleChange}
                autoComplete="new-password"
                autoCapitalize="none"
                autoCorrect="off"
                spellCheck={false}
                title="Please fill out this field"
                className="w-full px-3 sm:px-4 py-2.5 sm:py-3 bg-blue-50 border-0 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all duration-200 pr-10 sm:pr-12 text-sm"
                style={{ fontFamily: "'Inter', sans-serif" }}
              />
              <button
                type="button"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                className="absolute right-3 sm:right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 focus:outline-none"
              >
                <i className={`fas ${showConfirmPassword ? "fa-eye-slash" : "fa-eye"}`} id="confirmPasswordToggle"></i>
              </button>
            </div>
          </div>

          {/* Student ID */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2" style={{ fontFamily: "'Inter', sans-serif" }}>Student ID Number</label>
            <input
              type="text"
              name="studentId"
              placeholder="Enter 8-digit Student ID"
              value={formData.studentId}
              onChange={handleChange}
              autoComplete="off"
              inputMode="numeric"
              autoCorrect="off"
              spellCheck={false}
              maxLength={8}
              title="Please fill out this field"
              className="w-full px-4 py-3 bg-blue-50 border-0 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all duration-200 text-sm"
              style={{ fontFamily: "'Inter', sans-serif" }}
            />
          </div>

          {/* Department */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2" style={{ fontFamily: "'Inter', sans-serif" }}>Department</label>
            <select
              name="department"
              value={formData.department}
              onChange={handleChange}
              title="please select an item in the list"
              className="w-full px-3 sm:px-4 py-2.5 sm:py-3 bg-blue-50 border-0 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all duration-200 appearance-none cursor-pointer text-sm"
              style={{ fontFamily: "'Inter', sans-serif", color: "#111827" }}
            >
              <option value="">Select Department</option>
              <option value="College">College</option>
              <option value="Senior High School">Senior High School</option>
              <option value="Junior High School">Junior High School</option>
              <option value="Elementary">Elementary</option>
            </select>
          </div>

          {/* Year Level */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2" style={{ fontFamily: "'Inter', sans-serif" }}>Year Level</label>
            <select
              name="yearLevel"
              value={formData.yearLevel}
              onChange={handleChange}
              disabled={!formData.department}
              title="please select an item in the list"
              className="w-full px-3 sm:px-4 py-2.5 sm:py-3 bg-blue-50 border-0 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all duration-200 appearance-none cursor-pointer text-sm"
              style={{ fontFamily: "'Inter', sans-serif", color: "#111827" }}
            >
              <option value="">Select Year Level</option>
              {availableYearLevels.map((level) => (
                <option key={level} value={level}>
                  {level}
                </option>
              ))}
            </select>
          </div>

          {/* Submit Button */}
          <div className="pt-3 sm:pt-4">
            <button
              type="submit"
              disabled={isLoading}
              className="w-full text-white font-semibold py-2.5 sm:py-3 px-4 rounded-lg transition-all duration-200 transform hover:scale-[1.02] focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none text-sm sm:text-base"
              style={{ fontFamily: "'Inter', sans-serif", backgroundColor: "#041A44" }}
              onMouseOver={(e) => !isLoading && (e.currentTarget.style.backgroundColor = "#1e3a8a")}
              onMouseOut={(e) => !isLoading && (e.currentTarget.style.backgroundColor = "#041A44")}
            >
              {isLoading ? "Creating Account..." : "Create Account"}
            </button>
          </div>
        </form>

        <div className="text-center mt-4 sm:mt-6">
          <p className="text-gray-600 text-xs sm:text-sm" style={{ fontFamily: "'Inter', sans-serif" }}>
            Already have an account?{" "}
            <Link href="/login" className="text-blue-600 hover:text-blue-800 font-medium transition-colors duration-200" style={{ fontFamily: "'Inter', sans-serif" }}>
              Sign in
            </Link>
          </p>
        </div>
      </div>
    </div>
  )
}
