"use client"

import { useMemo, useState } from "react"
import { Bell, RefreshCcw, X, Trash2 } from "lucide-react"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

type NotificationItem = {
  id: string
  title: string
  description: string
  time: string
  isNew?: boolean
  badgeColor?: string
}

type NotificationMenuProps = {
  notifications: NotificationItem[]
  align?: "start" | "center" | "end"
  userId?: string | null
  onNotificationUpdate?: () => void
}

export function NotificationMenu({ notifications, align = "end", userId, onNotificationUpdate }: NotificationMenuProps) {
  const [open, setOpen] = useState(false)
  const newCount = useMemo(
    () => notifications.filter((notification) => notification.isNew).length,
    [notifications],
  )

  const handleMarkAllAsRead = async () => {
    if (!userId) return
    
    try {
      const response = await fetch("/api/notifications", {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          userId,
          markAll: true,
        }),
      })

      const data = await response.json()
      if (data.ok && onNotificationUpdate) {
        onNotificationUpdate()
      }
    } catch (error) {
      console.error("Error marking notifications as read:", error)
    }
  }

  const handleDeleteAll = async () => {
    if (!userId) return
    
    if (!confirm("Are you sure you want to delete all notifications?")) {
      return
    }

    try {
      const response = await fetch("/api/notifications", {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          userId,
          deleteAll: true,
        }),
      })

      const data = await response.json()
      if (data.ok && onNotificationUpdate) {
        onNotificationUpdate()
      }
    } catch (error) {
      console.error("Error deleting notifications:", error)
    }
  }

  const handleNotificationClick = async (notificationId: string) => {
    if (!userId) return

    // Mark notification as read when clicked
    try {
      const response = await fetch("/api/notifications", {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          userId,
          notificationIds: [notificationId],
        }),
      })

      const data = await response.json()
      if (data.ok && onNotificationUpdate) {
        onNotificationUpdate()
      }
    } catch (error) {
      console.error("Error marking notification as read:", error)
    }
  }

  return (
    <DropdownMenu open={open} onOpenChange={setOpen}>
      <DropdownMenuTrigger asChild>
        <button
          className="relative p-2 text-white/75 transition hover:text-white focus:outline-none"
          aria-label="Notifications"
        >
          <Bell className="h-5 w-5" />
          {newCount > 0 && (
            <span className="absolute -right-0.5 -top-0.5 inline-flex h-5 min-w-5 items-center justify-center rounded-full bg-red-500 px-1.5 text-xs font-semibold text-white">
              {newCount}
            </span>
          )}
        </button>
      </DropdownMenuTrigger>
      <DropdownMenuContent
        align={align}
        sideOffset={12}
        className="max-sm:w-[280px] max-sm:max-w-[82vw] sm:w-[360px] sm:max-w-[92vw] md:w-[420px] md:max-w-[420px] overflow-hidden rounded-2xl sm:rounded-3xl border-0 bg-white p-0 text-slate-800 shadow-[0_20px_40px_rgba(4,26,68,0.18)]"
      >
        <div className="bg-[#041A44] px-3 sm:px-4 py-2.5 sm:py-3 text-white">
          <div className="flex items-center justify-between">
            <h3 className="text-sm sm:text-base font-semibold">Notifications</h3>
            <button
              type="button"
              onClick={() => setOpen(false)}
              className="rounded-full p-1 text-white/70 transition hover:bg-white/10 hover:text-white"
              aria-label="Close notifications"
            >
              <X className="h-4 w-4" />
            </button>
          </div>
        </div>
        <div className="max-h-[40vh] sm:max-h-[50vh] md:max-h-[320px] overflow-y-auto divide-y divide-slate-100">
          {notifications.length === 0 ? (
            <div className="px-5 py-8 text-center text-sm text-slate-500">No notifications</div>
          ) : (
            notifications.map((notification) => (
              <div
                key={notification.id}
                className={`flex gap-2.5 sm:gap-3 px-3 py-2.5 sm:px-4 sm:py-3 cursor-pointer hover:bg-slate-50 transition-colors ${
                  notification.isNew ? "bg-blue-50/50" : ""
                }`}
                onClick={() => handleNotificationClick(notification.id)}
              >
                <div
                  className="mt-0.5 h-7 w-7 sm:h-10 sm:w-10 flex-shrink-0 rounded-full bg-blue-100 text-blue-600"
                  style={notification.badgeColor ? { backgroundColor: notification.badgeColor, color: "#ffffff" } : undefined}
                >
                  <div className="flex h-full w-full items-center justify-center text-xs sm:text-sm font-semibold">
                    {notification.title.split(" ").map((word) => word[0]).join("").slice(0, 2)}
                  </div>
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between gap-2 sm:gap-4">
                    <p
                      className={`text-[13px] sm:text-sm font-semibold truncate ${
                        notification.isNew ? "text-slate-900" : "text-slate-700"
                      }`}
                    >
                      {notification.title}
                      {notification.isNew && (
                        <span className="ml-1 inline-block h-1.5 w-1.5 sm:h-2 sm:w-2 rounded-full bg-blue-500"></span>
                      )}
                    </p>
                    <span className="text-[11px] sm:text-xs text-slate-400 whitespace-nowrap">{notification.time}</span>
                  </div>
                  <p className="mt-0.5 text-[12px] sm:text-sm leading-relaxed text-slate-600 line-clamp-2">
                    {notification.description}
                  </p>
                </div>
              </div>
            ))
          )}
        </div>
        <div className="flex items-center justify-between bg-slate-50 px-4 py-3">
          <button
            type="button"
            onClick={handleDeleteAll}
            className="inline-flex items-center gap-1 sm:gap-1.5 text-[10px] sm:text-xs font-semibold text-red-600 tracking-wide transition hover:text-red-700"
          >
            <Trash2 className="h-3 w-3 sm:h-3.5 sm:w-3.5" />
            Delete All
          </button>
          <button
            type="button"
            onClick={handleMarkAllAsRead}
            className="inline-flex items-center gap-1 sm:gap-1.5 text-[10px] sm:text-xs font-semibold text-[#041A44] tracking-wide transition hover:text-[#0b2c6f]"
          >
            <RefreshCcw className="h-3 w-3 sm:h-3.5 sm:w-3.5" />
            Mark all as read
          </button>
        </div>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}

