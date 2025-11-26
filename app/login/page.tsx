"use client"

import type React from "react"

import { useState } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { X } from "lucide-react"

export default function LoginPage() {
  const router = useRouter()
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [showPassword, setShowPassword] = useState(false)
  const [rememberMe, setRememberMe] = useState(false)
  const [error, setError] = useState("")
  const [isLoading, setIsLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")

    // Validate inputs - both fields must not be empty
    if (!email.trim() || !password.trim()) {
      setError("Please fill in all fields")
      return
    }

    setIsLoading(true)
    const startTime = Date.now()
    const finishLoading = () => {
      const elapsed = Date.now() - startTime
      const remaining = Math.max(0, 2000 - elapsed)
      setTimeout(() => setIsLoading(false), remaining)
    }

    try {
      const response = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: email.trim(), password }),
      })

      // Handle network errors or service unavailable
      if (!response.ok && response.status >= 500) {
        setError("Login service temporarily unavailable. Please try again later.")
        finishLoading()
        return
      }

      const contentType = response.headers.get("content-type") || ""
      const data = contentType.includes("application/json") ? await response.json() : await response.text()

      if (!response.ok) {
        setError("Invalid username or password. Please try again.")
        finishLoading()
        return
      }

      const userData =
        typeof data === "string"
          ? null
          : {
              id: data.user?.id,
              firstName: data.user?.firstName,
              lastName: data.user?.lastName,
              email: data.user?.email,
              studentId: data.user?.studentId,
              department: data.user?.department,
              yearLevel: data.user?.yearLevel,
              role: data.user?.role ?? "user",
            }

      if (!userData) {
        setError("Login succeeded but user data missing")
        finishLoading()
        return
      }

      if (rememberMe) {
        localStorage.setItem("rememberMe", "true")
      } else {
        localStorage.removeItem("rememberMe")
      }
      localStorage.setItem("currentUser", JSON.stringify(userData))

      // Determine redirect path based on role/department
      let redirectPath = "/basic-education-dashboard" // Default to basic education dashboard
      if (userData.role === "admin") {
        redirectPath = "/admin"
      } else if (userData.department === "College") {
        redirectPath = "/college-dashboard"
      } else if (
        userData.department === "Elementary" ||
        userData.department === "Junior High School" ||
        userData.department === "Senior High School"
      ) {
        redirectPath = "/basic-education-dashboard"
      }
      router.push(redirectPath)
      finishLoading()
    } catch (err) {
      console.error("Login error:", err)
      // Check if it's a network error
      if (err instanceof TypeError && err.message.includes("fetch")) {
        setError("Login service temporarily unavailable. Please try again later.")
      } else {
        setError("An error occurred. Please try again.")
      }
      finishLoading()
    }
  }

  // Check if both fields are filled to enable/disable button
  const isFormValid = email.trim().length > 0 && password.trim().length > 0

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center p-4">
      <div className="bg-white rounded-lg shadow-lg p-6 w-full max-w-sm md:w-96 md:p-8 relative">
        <Link
          href="/"
          className="absolute top-3 right-3 md:top-4 md:right-4 text-gray-500 hover:text-gray-700 transition"
          aria-label="Close"
        >
          <X className="w-5 h-5 md:w-6 md:h-6" />
        </Link>

        <div className="text-center mb-6 md:mb-8">
          <h1 className="text-xl md:text-2xl font-bold text-gray-900" style={{ fontFamily: "'Inter', sans-serif" }}>Welcome Back!</h1>
          <p className="text-gray-600 text-sm md:text-base" style={{ fontFamily: "'Inter', sans-serif" }}>Please sign in to continue</p>
        </div>

        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-3 py-2 rounded-lg mb-6 text-sm" style={{ fontFamily: "'Inter', sans-serif" }}>
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-3 md:space-y-4" autoComplete="off">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2" style={{ fontFamily: "'Inter', sans-serif" }}>Email</label>
            <input
              type="text"
              placeholder="Enter your email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              autoComplete="off"
              autoCapitalize="none"
              autoCorrect="off"
              spellCheck={false}
              title="Please fill out this form"
              className="w-full px-4 py-3 bg-blue-50 border-0 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all duration-200"
              style={{ fontFamily: "'Inter', sans-serif" }}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2" style={{ fontFamily: "'Inter', sans-serif" }}>Password</label>
            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                placeholder="Enter password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                autoComplete="off"
                autoCapitalize="none"
                autoCorrect="off"
                spellCheck={false}
                title="Please fill out this form"
                className="w-full px-4 py-3 bg-blue-50 border-0 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all duration-200 pr-12"
                style={{ fontFamily: "'Inter', sans-serif" }}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 focus:outline-none cursor-pointer"
              >
                <i className={`fas ${showPassword ? "fa-eye-slash" : "fa-eye"}`} id="passwordToggle"></i>
              </button>
            </div>
          </div>

          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <input
                type="checkbox"
                id="remember"
                checked={rememberMe}
                onChange={(e) => setRememberMe(e.target.checked)}
                className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
              />
              <label htmlFor="remember" className="ml-2 block text-sm text-gray-700" style={{ fontFamily: "'Inter', sans-serif" }}>
                Remember me
              </label>
            </div>
            <Link href="#" className="text-sm text-blue-600 hover:text-blue-800 font-medium transition-colors duration-200" style={{ fontFamily: "'Inter', sans-serif" }}>
              Forgot password?
            </Link>
          </div>

          <div className="pt-3 md:pt-4">
            <button
              type="submit"
              disabled={isLoading || !isFormValid}
              className="w-full text-white font-semibold py-2.5 md:py-3 px-4 rounded-lg transition-all duration-200 transform hover:scale-[1.02] focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
              style={{ fontFamily: "'Inter', sans-serif", backgroundColor: "#041A44" }}
              onMouseOver={(e) => !isLoading && isFormValid && (e.currentTarget.style.backgroundColor = "#1e3a8a")}
              onMouseOut={(e) => !isLoading && (e.currentTarget.style.backgroundColor = "#041A44")}
            >
              {isLoading ? (
                <span className="flex items-center justify-center gap-2">
                  <svg className="animate-spin h-4 w-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Signing in...
                </span>
              ) : (
                "Sign In"
              )}
            </button>
          </div>
        </form>

        <div className="text-center mt-5 md:mt-6">
          <p className="text-gray-600 text-sm" style={{ fontFamily: "'Inter', sans-serif" }}>
            Don't have an account?{" "}
            <Link href="/signup" className="text-blue-600 hover:text-blue-800 font-medium transition-colors duration-200" style={{ fontFamily: "'Inter', sans-serif" }}>
              Create Account
            </Link>
          </p>
        </div>
      </div>
    </div>
  )
}
