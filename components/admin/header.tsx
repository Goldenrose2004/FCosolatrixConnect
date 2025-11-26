"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import Image from "next/image"
import { Menu, X, User } from "lucide-react"
import { NotificationMenu } from "@/components/notification-menu"
import type { LucideIcon } from "lucide-react"

export type AdminNotification = {
  id: string
  title: string
  description: string
  time: string
  isNew?: boolean
  badgeColor?: string
}

export type AdminNavItem = {
  id: string
  label: string
  icon: LucideIcon
  href?: string
}

type AdminHeaderProps = {
  navItems: readonly AdminNavItem[]
  activeNavId?: string
  onSelectNav?: (id: AdminNavItem["id"]) => void
  userName: string
  notifications?: AdminNotification[]
  userId?: string | null
  onNotificationUpdate?: () => void
  onProfileClick?: () => void
}

export function AdminHeader({
  navItems,
  activeNavId,
  onSelectNav,
  userName,
  notifications = [],
  userId,
  onNotificationUpdate,
  onProfileClick,
}: AdminHeaderProps) {
  const [isOpen, setIsOpen] = useState(false)

  return (
    <header className="sticky top-0 z-50 w-full" style={{ backgroundColor: "#041A44" }}>
      <div className="w-full px-4 sm:px-6 lg:px-12">
        <div className="h-16 md:h-20 flex items-center justify-between">
          {/* Logo and Brand */}
          <div className="flex items-center gap-0 ml-0 sm:ml-2 md:ml-12 lg:ml-32 xl:ml-40 min-w-0 flex-1 md:flex-none cursor-default select-none">
            <Image
              src="/images/logo-icon.png"
              alt="ConsolatrixConnect"
              width={115}
              height={115}
              className="flex-shrink-0 pointer-events-none w-[72px] h-[72px] sm:w-16 sm:h-16 md:w-24 md:h-24 object-contain"
            />
            <span className="text-white font-bold text-base sm:text-base md:text-xl lg:text-2xl whitespace-nowrap truncate -ml-1 sm:-ml-1.5 md:-ml-2">
              ConsolatrixConnect
            </span>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex flex-1 items-center">
            <nav className="flex flex-1 justify-center gap-6">
              {navItems.map((item) => {
                const Icon = item.icon
                const isActive = item.id === activeNavId

                const content = (
                  <span className={`group flex items-center gap-2 text-base font-semibold transition-colors duration-150 ${isActive ? "text-white" : "text-white/70 hover:text-white"}`}>
                    <Icon className={`h-5 w-5 ${isActive ? "text-white" : "text-white/70 group-hover:text-white"}`} />
                    {item.label}
                  </span>
                )

                if (item.href) {
                  return (
                    <Link key={item.id} href={item.href} className="outline-none focus-visible:ring-2 focus-visible:ring-white/60 rounded-full px-2 py-1">
                      {content}
                    </Link>
                  )
                }

                return (
                  <button
                    key={item.id}
                    onClick={() => onSelectNav?.(item.id)}
                    className="group rounded-full px-2 py-1 outline-none focus-visible:ring-2 focus-visible:ring-white/60"
                    type="button"
                  >
                    {content}
                  </button>
                )
              })}
            </nav>

            {/* User Actions */}
            <div className="flex items-center gap-3 ml-auto mr-12 md:mr-32 lg:mr-40">
              <NotificationMenu notifications={notifications} align="end" userId={userId} onNotificationUpdate={onNotificationUpdate} />
              <ProfileBadge name={userName} onClick={onProfileClick} />
            </div>
          </div>

          {/* Mobile Actions - Notification and Menu */}
          <div className="flex items-center gap-2 md:hidden">
            <NotificationMenu notifications={notifications} align="end" userId={userId} onNotificationUpdate={onNotificationUpdate} />
            <button onClick={() => setIsOpen(!isOpen)} className="text-white p-2 z-10" aria-label="Toggle menu">
              {isOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {isOpen && (
          <div className="md:hidden pb-3">
            <div className="grid grid-cols-3 gap-1.5 mb-2">
              {navItems.map((item) => {
                const Icon = item.icon
                const isActive = item.id === activeNavId
                const sharedClasses =
                  "flex flex-col items-center justify-center gap-1 text-white hover:bg-white/10 transition-all duration-200 rounded-lg py-2 px-1 border border-white/20 hover:border-white/40"

                if (item.href) {
                  return (
                    <Link
                      key={item.id}
                      href={item.href}
                      onClick={() => setIsOpen(false)}
                      className={`${sharedClasses} ${isActive ? "border-white/60" : ""}`}
                      style={{ fontFamily: "'Inter', sans-serif" }}
                    >
                      <Icon className="w-4 h-4" />
                      <span className="text-[10px] font-medium">{item.label}</span>
                    </Link>
                  )
                }

                return (
                  <button
                    key={item.id}
                    onClick={() => {
                      onSelectNav?.(item.id)
                      setIsOpen(false)
                    }}
                    className={`${sharedClasses} ${isActive ? "border-white/60" : ""}`}
                    style={{ fontFamily: "'Inter', sans-serif" }}
                    type="button"
                  >
                    <Icon className="w-4 h-4" />
                    <span className="text-[10px] font-medium">{item.label}</span>
                  </button>
                )
              })}
              <button
                onClick={() => {
                  onProfileClick?.()
                  setIsOpen(false)
                }}
                className="flex flex-col items-center justify-center gap-1 text-white hover:bg-white/10 transition-all duration-200 rounded-lg py-2 px-1 border border-white/20 hover:border-white/40"
                style={{ fontFamily: "'Inter', sans-serif" }}
                type="button"
              >
                <User className="w-4 h-4" />
                <span className="text-[10px] font-medium">Profile</span>
              </button>
            </div>
          </div>
        )}
      </div>
    </header>
  )
}

function ProfileBadge({ name, onClick }: { name: string; onClick?: () => void }) {
  const [profilePicture, setProfilePicture] = useState<string | null>(null)

  useEffect(() => {
    // Get profile picture from localStorage
    const currentUser = localStorage.getItem("currentUser")
    if (currentUser) {
      try {
        const user = JSON.parse(currentUser)
        if (user?.profilePicture) {
          setProfilePicture(user.profilePicture)
        }
      } catch (error) {
        console.error("Error parsing user data:", error)
      }
    }

    // Listen for profile picture updates
    const handleProfilePictureUpdate = (event: CustomEvent) => {
      const updatedUser = event.detail
      if (updatedUser?.profilePicture) {
        setProfilePicture(updatedUser.profilePicture)
      } else {
        setProfilePicture(null)
      }
      // Update localStorage
      if (currentUser) {
        try {
          const user = JSON.parse(currentUser)
          const updatedUserData = { ...user, profilePicture: updatedUser?.profilePicture || null }
          localStorage.setItem("currentUser", JSON.stringify(updatedUserData))
        } catch (error) {
          console.error("Error updating localStorage:", error)
        }
      }
    }

    // Listen for storage changes (cross-tab updates)
    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === "currentUser" && e.newValue) {
        try {
          const user = JSON.parse(e.newValue)
          setProfilePicture(user?.profilePicture || null)
        } catch (error) {
          console.error("Error parsing storage event:", error)
        }
      }
    }

    window.addEventListener("profilePictureUpdated", handleProfilePictureUpdate as EventListener)
    window.addEventListener("storage", handleStorageChange)

    return () => {
      window.removeEventListener("profilePictureUpdated", handleProfilePictureUpdate as EventListener)
      window.removeEventListener("storage", handleStorageChange)
    }
  }, [])

  const initials = (name || "Admin").slice(0, 1).toUpperCase()

  return (
    <button
      onClick={onClick}
      className="w-8 h-8 rounded-full flex items-center justify-center text-white text-sm font-semibold hover:opacity-80 transition cursor-pointer border border-white overflow-hidden"
      style={{ backgroundColor: profilePicture ? "transparent" : "#60A5FA" }}
      type="button"
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
        initials || "A"
      )}
    </button>
  )
}

