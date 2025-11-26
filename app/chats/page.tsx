"use client"

import { useEffect, useState, useRef } from "react"
import { useRouter } from "next/navigation"
import { AuthenticatedHeader } from "@/components/authenticated-header"
import Image from "next/image"
import { Reply, Smile, MoreVertical, Edit, Trash2, X, Copy } from "lucide-react"

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

export default function ChatsPage() {
  const router = useRouter()
  const [user, setUser] = useState<any>(null)
  const [adminProfilePicture, setAdminProfilePicture] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [message, setMessage] = useState("")
  const [messages, setMessages] = useState<ChatMessage[]>([])
  const [openMenuId, setOpenMenuId] = useState<string | null>(null)
  const [openReactId, setOpenReactId] = useState<string | null>(null)
  const [editingMessageId, setEditingMessageId] = useState<string | null>(null)
  const [editMessageText, setEditMessageText] = useState("")
  const [replyingToMessageId, setReplyingToMessageId] = useState<string | null>(null)
  const [selectedFiles, setSelectedFiles] = useState<File[]>([])
  const [filePreviews, setFilePreviews] = useState<Array<{ file: File; preview: string }>>([])
  const [longPressMessageId, setLongPressMessageId] = useState<string | null>(null)
  const [hoveredMessageId, setHoveredMessageId] = useState<string | null>(null)
  const longPressTimerRef = useRef<NodeJS.Timeout | null>(null)
  const messageMenuRef = useRef<HTMLDivElement>(null)
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const messagesContainerRef = useRef<HTMLDivElement>(null)
  const shouldAutoScrollRef = useRef(true)
  const lastMessageCountRef = useRef(0)
  const userScrolledRef = useRef(false)
  const menuRef = useRef<HTMLDivElement>(null)
  const reactRef = useRef<HTMLDivElement>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)

  // Fetch admin profile picture
  const fetchAdminProfilePicture = async () => {
    try {
      // Find admin user - typically admin has role "admin" or we can search for a specific admin
      const response = await fetch("/api/users/find?role=admin")
      const data = await response.json()
      if (data.ok && data.users && data.users.length > 0) {
        const admin = data.users[0]
        if (admin.profilePicture) {
          setAdminProfilePicture(admin.profilePicture)
        }
      }
    } catch (error) {
      console.error("Error fetching admin profile picture:", error)
    }
  }

  useEffect(() => {
    // Check if user is logged in
    const currentUser = localStorage.getItem("currentUser")
    if (!currentUser) {
      router.push("/login")
      return
    }

    const userData = JSON.parse(currentUser)
    setUser(userData)
    setIsLoading(false)

    // Fetch admin profile picture
    fetchAdminProfilePicture()

    // Listen for profile picture updates
    const handleProfilePictureUpdate = (event: CustomEvent) => {
      const updatedUser = event.detail
      // If the updated user is admin, update admin profile picture
      if (updatedUser?.role === "admin") {
        setAdminProfilePicture(updatedUser.profilePicture || null)
      }
      // If it's the current user, update their data
      if (updatedUser?.id === userData?.id) {
        setUser(updatedUser)
        localStorage.setItem("currentUser", JSON.stringify(updatedUser))
      }
    }

    // Listen for storage changes (cross-tab updates)
    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === "currentUser" && e.newValue) {
        try {
          const user = JSON.parse(e.newValue)
          if (user?.role === "admin") {
            fetchAdminProfilePicture()
          }
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
  }, [router])

  // Fetch messages from database (user perspective)
  const fetchMessages = async () => {
    if (!user) return

    try {
      // Get user ID (handle both id and _id formats)
      const userId = user.id || user._id
      const userIdString = typeof userId === 'object' ? userId.toString() : String(userId)

      const response = await fetch(`/api/messages?userId=${userIdString}&perspective=user`)
      const data = await response.json()
      
      if (data.ok && data.messages) {
        // Update admin profile picture if found in messages
        const adminMessage = data.messages.find((msg: ChatMessage) => !msg.isOutgoing && msg.senderProfilePicture)
        if (adminMessage?.senderProfilePicture) {
          setAdminProfilePicture(adminMessage.senderProfilePicture)
        }
        
        // Check if new messages were added by comparing with last known count
        const previousCount = lastMessageCountRef.current
        const newCount = data.messages.length
        
        // Only auto-scroll if new messages were added AND user hasn't manually scrolled up
        if (newCount > previousCount && !userScrolledRef.current) {
          // Check if user is near bottom (within 150px) - if not, don't auto-scroll
          const container = messagesContainerRef.current
          if (container) {
            const isNearBottom = container.scrollHeight - container.scrollTop - container.clientHeight < 150
            shouldAutoScrollRef.current = isNearBottom
          } else {
            shouldAutoScrollRef.current = true // If container not found, default to scroll
          }
        } else if (newCount > previousCount) {
          // New messages but user scrolled up - check if they're near bottom now
          const container = messagesContainerRef.current
          if (container) {
            const isNearBottom = container.scrollHeight - container.scrollTop - container.clientHeight < 150
            shouldAutoScrollRef.current = isNearBottom
          }
        } else {
          // No new messages - don't auto-scroll
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
    if (user) {
      // Reset auto-scroll when user loads
      shouldAutoScrollRef.current = true
      userScrolledRef.current = false
      lastMessageCountRef.current = 0
      fetchMessages()
      
      // Poll for new messages every 5 seconds
      const interval = setInterval(() => {
        fetchMessages()
      }, 5000)
      
      return () => clearInterval(interval)
    }
  }, [user])

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

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault()
    if ((!message.trim() && selectedFiles.length === 0) || !user) return

    try {
      // Get user ID (handle both id and _id formats)
      const userId = user.id || user._id
      const userIdString = typeof userId === 'object' ? userId.toString() : String(userId)
      const userInitials = (user?.firstName?.[0] || "U") + (user?.lastName?.[0] || "")

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
          senderId: userIdString,
          receiverId: "admin",
          senderName: `${user.firstName} ${user.lastName}`,
          senderInitials: userInitials,
          text: message.trim(),
          repliedTo: replyingToMessageId || null,
          attachments: attachments.length > 0 ? attachments : undefined,
        }),
      })

      const data = await response.json()

      if (data.ok && data.message) {
        // Update isOutgoing to true for user perspective (user's own messages appear on right)
        const userMessage = { ...data.message, isOutgoing: true }
        // Add the new message to the list
        shouldAutoScrollRef.current = true // Always scroll when sending a message
        userScrolledRef.current = false // Reset scroll flag when sending
        lastMessageCountRef.current = messages.length + 1
        setMessages([...messages, userMessage])
        setMessage("")
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
    if (!editMessageText.trim() || !user) return

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
        fetchMessages()
      } else {
        console.error("Failed to edit message:", data.error)
      }
    } catch (error) {
      console.error("Error editing message:", error)
    }
  }

  const handleDeleteMessage = async (messageId: string) => {
    if (!user) return

    try {
      // Get user ID (handle both id and _id formats)
      const userId = user.id || user._id
      const userIdString = typeof userId === 'object' ? userId.toString() : String(userId)
      const userName = `${user.firstName} ${user.lastName}`

      const response = await fetch("/api/messages", {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          messageId,
          deletedBy: userIdString,
          deletedByName: userName,
        }),
      })

      const data = await response.json()

      if (data.ok) {
        // Update the message to show as deleted instead of removing it
        setMessages((prev) =>
          prev.map((msg) =>
            msg.id === messageId
              ? { ...msg, deleted: true, deletedBy: userIdString, deletedByName: userName }
              : msg
          )
        )
        setOpenMenuId(null)
        // Refetch to ensure real-time sync
        fetchMessages()
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
    if (!user) return

    try {
      // Get user ID (handle both id and _id formats)
      const userId = user.id || user._id
      const userIdString = typeof userId === 'object' ? userId.toString() : String(userId)

      const response = await fetch("/api/messages/reactions", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          messageId,
          emoji,
          userId: userIdString,
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
        fetchMessages()
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

  if (isLoading) {
    return <div className="flex items-center justify-center min-h-screen">Loading...</div>
  }

  const userInitials = (user?.firstName?.[0] || "U") + (user?.lastName?.[0] || "")

  return (
    <div className="min-h-screen max-h-screen bg-gray-50 flex flex-col overflow-hidden md:bg-gray-50" style={{ fontFamily: "'Inter', sans-serif" }}>
      <AuthenticatedHeader userName={user?.firstName} userInitials={userInitials} useLandingPageStylingMobileOnly={true} />

      {/* Chat Container */}
      <main className="flex-1 overflow-hidden">
        <div className="w-full md:max-w-[70%] container mx-auto px-0 md:px-6 py-0 md:py-6 h-full">
          <div className="bg-white rounded-none sm:rounded-xl shadow-lg flex flex-col h-[calc(100vh-4rem)] md:h-[calc(100vh-8rem)] md:max-h-[calc(100vh-8rem)] overflow-hidden">
          {/* Chat Header */}
          <div className="border-b border-gray-200 p-3 sm:p-4 md:p-6 rounded-t-none sm:rounded-t-xl" style={{ backgroundColor: "#041A44" }}>
            <div className="flex items-center">
              <div className="relative w-9 h-9 sm:w-10 sm:h-10 md:w-12 md:h-12 rounded-full overflow-hidden flex-shrink-0 mr-2.5 sm:mr-3 md:mr-4 bg-white" style={{ padding: "2px" }}>
                {adminProfilePicture ? (
                  <Image
                    src={adminProfilePicture}
                    alt="System Administrator"
                    width={48}
                    height={48}
                    className="w-full h-full object-cover rounded-full"
                    priority
                    unoptimized
                  />
                ) : (
                  <Image
                    src="/images/logo.jpg"
                    alt="System Administrator"
                    width={48}
                    height={48}
                    className="w-full h-full object-contain rounded-full"
                    priority
                    unoptimized
                  />
                )}
              </div>
              <div className="min-w-0 flex-1">
                <h2 className="text-base sm:text-lg md:text-xl font-semibold text-white truncate" style={{ fontFamily: "'Inter', sans-serif" }}>
                  System Administrator
                </h2>
                <p className="text-[10px] sm:text-xs md:text-sm text-gray-300 truncate" style={{ fontFamily: "'Inter', sans-serif" }}>Administrator</p>
              </div>
            </div>
          </div>

          {/* Chat Messages Area */}
          <div 
            ref={messagesContainerRef}
            onScroll={handleScroll}
            className="flex-1 overflow-y-auto px-2.5 sm:px-3 md:px-6 py-3 sm:py-4 md:py-6 bg-gray-50" 
            id="messages-container"
            style={{ minHeight: 0 }}
          >
            {messages.length === 0 ? (
              /* Empty state - no messages yet */
              <div className="flex items-center justify-center h-full text-gray-400">
                <p className="text-xs md:text-sm px-4 text-center" style={{ fontFamily: "'Inter', sans-serif" }}>No messages yet. Start a conversation!</p>
              </div>
            ) : (
              /* Messages list */
              <div className="space-y-2.5 sm:space-y-3 md:space-y-4">
                {messages.map((msg) => (
                  <div
                    key={msg.id}
                    className={`group flex gap-1.5 sm:gap-2 md:gap-3 items-start ${msg.isOutgoing ? "justify-end" : "justify-start"}`}
                  >
                    {!msg.isOutgoing && (
                      <div 
                        className="flex h-6 w-6 sm:h-7 sm:w-7 md:h-8 md:w-8 items-center justify-center rounded-full bg-blue-100 text-[#041A44] text-[9px] sm:text-[10px] md:text-xs font-semibold flex-shrink-0 overflow-hidden" 
                        style={{ 
                          marginTop: msg.repliedTo ? '3.5rem' : '1.25rem',
                          backgroundColor: msg.senderProfilePicture ? "transparent" : "#DBEAFE"
                        }}
                      >
                        {msg.senderProfilePicture ? (
                          <Image
                            src={msg.senderProfilePicture}
                            alt={msg.senderName}
                            width={32}
                            height={32}
                            className="w-full h-full object-cover rounded-full"
                          />
                        ) : (
                          msg.senderInitials
                        )}
                      </div>
                    )}
                    <div className={`flex flex-col max-w-[82%] sm:max-w-[85%] md:max-w-[70%] ${msg.isOutgoing ? "items-end" : "items-start"}`}>
                      {msg.repliedTo && !msg.deleted && (() => {
                        const repliedMessage = messages.find(m => m.id === msg.repliedTo)
                        return repliedMessage ? (
                          <div className={`mb-1 ${msg.isOutgoing ? 'items-end flex flex-col' : 'inline-block'}`}>
                            <p className={`text-[9px] sm:text-[10px] md:text-xs text-gray-500 mb-1 px-1 ${msg.isOutgoing ? 'text-right' : 'text-left'}`} style={{ fontFamily: "'Inter', sans-serif" }}>
                              {msg.isOutgoing 
                                ? `You replied to ${repliedMessage.senderName}`
                                : `${msg.senderName} replied to ${repliedMessage.senderName}`}
                            </p>
                            <div className="rounded-xl px-2 py-1 sm:py-1.5 md:px-3 md:py-2 max-w-[65%] sm:max-w-[60%] bg-gray-100 border border-gray-200 inline-block">
                              <p className="text-[9px] sm:text-[10px] md:text-xs text-gray-600 truncate" style={{ fontFamily: "'Inter', sans-serif" }}>{repliedMessage.text}</p>
                            </div>
                          </div>
                        ) : null
                      })()}
                      <div className={`relative flex items-center gap-2 ${msg.isOutgoing ? "flex-row-reverse" : ""}`}>
                        {editingMessageId === msg.id ? (
                          <div className="flex flex-col gap-2 w-full">
                            <input
                              type="text"
                              value={editMessageText}
                              onChange={(e) => setEditMessageText(e.target.value)}
                              onKeyPress={(e) => {
                                if (e.key === "Enter") {
                                  handleEditMessage(msg.id)
                                }
                                if (e.key === "Escape") {
                                  setEditingMessageId(null)
                                  setEditMessageText("")
                                }
                              }}
                              className="rounded-2xl px-2.5 sm:px-3 md:px-4 py-1.5 sm:py-2 md:py-3 border border-[#041A44] focus:outline-none focus:ring-2 focus:ring-[#041A44]/20 text-[11px] sm:text-xs md:text-sm"
                              style={{ fontFamily: "'Inter', sans-serif" }}
                              autoFocus
                            />
                            <div className="flex gap-2">
                              <button
                                onClick={() => handleEditMessage(msg.id)}
                                className="text-[10px] md:text-xs text-[#041A44] hover:underline"
                              >
                                Save
                              </button>
                              <button
                                onClick={() => {
                                  setEditingMessageId(null)
                                  setEditMessageText("")
                                }}
                                className="text-[10px] md:text-xs text-gray-500 hover:underline"
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
                                  msg.isOutgoing
                                    ? msg.deleted 
                                      ? "bg-gray-100 text-gray-500 border border-gray-200"
                                      : "bg-[#041A44] text-white"
                                    : msg.deleted
                                      ? "bg-gray-100 text-gray-500 border border-gray-200"
                                      : "bg-gray-100 text-gray-900"
                                }`}
                                onMouseEnter={() => !msg.deleted && setHoveredMessageId(msg.id)}
                                onMouseLeave={() => setHoveredMessageId(null)}
                                onTouchStart={(e) => !msg.deleted && handleLongPressStart(msg.id, e)}
                                onTouchEnd={handleLongPressEnd}
                                onTouchCancel={handleLongPressEnd}
                                onContextMenu={(e) => {
                                  e.preventDefault() // Prevent default context menu
                                }}
                              >
                                {msg.deleted ? (
                                  <p className="text-xs md:text-sm italic text-gray-500" style={{ fontFamily: "'Inter', sans-serif" }}>
                                    {(() => {
                                      const userId = user?.id || user?._id
                                      const userIdString = typeof userId === 'object' ? userId.toString() : String(userId)
                                      return msg.deletedBy === userIdString || msg.deletedBy === userId
                                        ? "You deleted this message"
                                        : `Message was deleted by ${msg.deletedByName || "someone"}`
                                    })()}
                                  </p>
                                ) : (
                                  <>
                                    {msg.attachments && msg.attachments.length > 0 && (
                                      <div className="mb-2 space-y-2">
                                        {msg.attachments.map((att, idx) => {
                                          const isImage = att.mimeType.startsWith('image/')
                                          const isVideo = att.mimeType.startsWith('video/')
                                          const dataUrl = `data:${att.mimeType};base64,${att.fileData}`
                                          
                                          return (
                                            <div key={idx} className="rounded-lg overflow-hidden">
                                              {isImage ? (
                                                <img 
                                                  src={dataUrl} 
                                                  alt={att.fileName} 
                                                  className="max-w-full max-h-48 md:max-h-64 object-contain rounded-lg cursor-pointer hover:opacity-90"
                                                  onClick={() => window.open(dataUrl, '_blank')}
                                                />
                                              ) : isVideo ? (
                                                <video 
                                                  src={dataUrl} 
                                                  controls 
                                                  className="max-w-full max-h-48 md:max-h-64 rounded-lg"
                                                />
                                              ) : (
                                                <a
                                                  href={dataUrl}
                                                  download={att.fileName}
                                                  className="flex items-center gap-2 p-2 bg-gray-200 hover:bg-gray-300 rounded-lg transition"
                                                >
                                                  <svg className="w-4 h-4 md:w-5 md:h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.172 7l-6.586 6.586a2 2 0 102.828 2.828l6.414-6.586a4 4 0 00-5.656-5.656l-6.415 6.585a6 6 0 108.486 8.486L20.5 13" />
                                                  </svg>
                                                  <div className="flex-1 min-w-0">
                                                    <p className="text-xs md:text-sm font-medium truncate">{att.fileName}</p>
                                                    <p className="text-[10px] md:text-xs text-gray-500">{(att.fileSize / 1024).toFixed(1)} KB</p>
                                                  </div>
                                                </a>
                                              )}
                                            </div>
                                          )
                                        })}
                                      </div>
                                    )}
                                    {msg.text && (
                                      <p className="text-[11px] sm:text-xs md:text-sm whitespace-pre-wrap break-words text-justify md:text-left" style={{ fontFamily: "'Inter', sans-serif", wordBreak: 'break-word', overflowWrap: 'anywhere' }}>{msg.text}</p>
                                    )}
                                  </>
                                )}
                              </div>
                              {msg.reactions && msg.reactions.length > 0 && (
                                <div className="absolute flex flex-wrap gap-1 right-0 translate-x-2 bottom-0 translate-y-1/2">
                                  {Array.from(new Set(msg.reactions.map((r: any) => r.emoji))).map((emoji) => (
                                    <span
                                      key={emoji}
                                      className="flex items-center justify-center w-5 h-5 md:w-6 md:h-6 rounded-full bg-white border border-gray-200 shadow-sm text-xs md:text-sm"
                                    >
                                      {emoji}
                                    </span>
                                  ))}
                                </div>
                              )}
                              {/* Message Action Menu - Appears on hover (desktop) or long press (mobile) */}
                              {(longPressMessageId === msg.id || hoveredMessageId === msg.id) && !msg.deleted && (
                                <div 
                                  ref={messageMenuRef}
                                  className={`md:hidden absolute ${msg.isOutgoing ? 'right-0' : 'left-0'} bottom-full mb-2 z-50`}
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
                                        onClick={() => handleReact(msg.id, "❤️")}
                                        className="p-1 md:p-1.5 hover:bg-gray-700 active:bg-gray-600 rounded transition-all duration-200 hover:scale-125 text-sm md:text-base touch-manipulation"
                                        title="Love"
                                      >
                                        ❤️
                                      </button>
                                      <button
                                        onClick={() => handleReact(msg.id, "😂")}
                                        className="p-1 md:p-1.5 hover:bg-gray-700 active:bg-gray-600 rounded transition-all duration-200 hover:scale-125 text-sm md:text-base touch-manipulation"
                                        title="Laugh"
                                      >
                                        😂
                                      </button>
                                      <button
                                        onClick={() => handleReact(msg.id, "😮")}
                                        className="p-1 md:p-1.5 hover:bg-gray-700 active:bg-gray-600 rounded transition-all duration-200 hover:scale-125 text-sm md:text-base touch-manipulation"
                                        title="Surprised"
                                      >
                                        😮
                                      </button>
                                      <button
                                        onClick={() => handleReact(msg.id, "😢")}
                                        className="p-1 md:p-1.5 hover:bg-gray-700 active:bg-gray-600 rounded transition-all duration-200 hover:scale-125 text-sm md:text-base touch-manipulation"
                                        title="Sad"
                                      >
                                        😢
                                      </button>
                                      <button
                                        onClick={() => handleReact(msg.id, "😠")}
                                        className="p-1 md:p-1.5 hover:bg-gray-700 active:bg-gray-600 rounded transition-all duration-200 hover:scale-125 text-sm md:text-base touch-manipulation"
                                        title="Angry"
                                      >
                                        😠
                                      </button>
                                      <button
                                        onClick={() => handleReact(msg.id, "👍")}
                                        className="p-1 md:p-1.5 hover:bg-gray-700 active:bg-gray-600 rounded transition-all duration-200 hover:scale-125 text-sm md:text-base touch-manipulation"
                                        title="Thumbs up"
                                      >
                                        👍
                                      </button>
                                    </div>
                                    {/* Action Buttons */}
                                    <div className="flex items-center gap-1 md:gap-1.5">
                                      <button
                                        onClick={() => handleReply(msg.id)}
                                        className="flex flex-col items-center gap-0.5 px-1.5 md:px-2 py-1 rounded hover:bg-gray-700 active:bg-gray-600 transition-colors touch-manipulation"
                                        title="Reply"
                                      >
                                        <Reply className="h-3.5 w-3.5 md:h-4 md:w-4 text-pink-400" />
                                        <span className="text-[8px] md:text-[9px] text-white font-medium">Reply</span>
                                      </button>
                                      <button
                                        onClick={() => handleCopyMessage(msg.text)}
                                        className="flex flex-col items-center gap-0.5 px-1.5 md:px-2 py-1 rounded hover:bg-gray-700 active:bg-gray-600 transition-colors touch-manipulation"
                                        title="Copy"
                                      >
                                        <Copy className="h-3.5 w-3.5 md:h-4 md:w-4 text-pink-400" />
                                        <span className="text-[8px] md:text-[9px] text-white font-medium">Copy</span>
                                      </button>
                                      {msg.isOutgoing && (
                                        <>
                                          <button
                                            onClick={() => {
                                              setEditingMessageId(msg.id)
                                              setEditMessageText(msg.text)
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
                                              handleDeleteMessage(msg.id)
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
                            {!msg.deleted && (
                              <div className="flex items-center gap-0.5 md:gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                                {msg.isOutgoing ? (
                                  <>
                                    <div className="relative" ref={openMenuId === msg.id ? menuRef : null}>
                                      <button
                                        onClick={() => setOpenMenuId(openMenuId === msg.id ? null : msg.id)}
                                        className="p-1 md:p-1.5 rounded-full bg-pink-100 hover:bg-pink-200 transition-colors"
                                        title="More options"
                                      >
                                        <MoreVertical className="h-3 w-3 md:h-4 md:w-4 text-gray-800" />
                                      </button>
                                      {openMenuId === msg.id && (
                                        <div className="absolute left-1/2 -translate-x-1/2 bottom-full mb-1 bg-white rounded-lg shadow-lg border border-gray-200 py-1 z-10 min-w-[120px]">
                                          <button
                                            onClick={() => {
                                              setEditingMessageId(msg.id)
                                              setEditMessageText(msg.text)
                                              setOpenMenuId(null)
                                            }}
                                            className="w-full px-4 py-2 text-left text-sm text-gray-700 hover:bg-gray-100 flex items-center gap-2"
                                          >
                                            <Edit className="h-4 w-4" />
                                            Edit
                                          </button>
                                          <button
                                            onClick={() => handleDeleteMessage(msg.id)}
                                            className="w-full px-4 py-2 text-left text-sm text-red-600 hover:bg-red-50 flex items-center gap-2"
                                        >
                                          <Trash2 className="h-4 w-4" />
                                          Delete
                                        </button>
                                      </div>
                                    )}
                                  </div>
                                  <button
                                    onClick={() => handleReply(msg.id)}
                                    className="p-1 md:p-1.5 rounded-full bg-pink-100 hover:bg-pink-200 transition-colors"
                                    title="Reply"
                                  >
                                    <Reply className="h-3 w-3 md:h-4 md:w-4 text-gray-800" />
                                  </button>
                                  <div className="relative" ref={openReactId === msg.id ? reactRef : null}>
                                    <button
                                      onClick={() => setOpenReactId(openReactId === msg.id ? null : msg.id)}
                                      className="p-1 md:p-1.5 rounded-full bg-pink-100 hover:bg-pink-200 transition-colors"
                                      title="React"
                                    >
                                      <Smile className="h-3 w-3 md:h-4 md:w-4 text-gray-800" />
                                    </button>
                                    {openReactId === msg.id && (
                                      <div className="absolute right-0 bottom-full mb-2 bg-white rounded-lg shadow-lg border border-gray-200 p-2 z-10 flex gap-1">
                                        <button
                                          onClick={() => handleReact(msg.id, "❤️")}
                                          className="p-1.5 hover:bg-gray-100 rounded transition-all duration-200 hover:scale-150 text-lg"
                                          title="Love"
                                        >
                                          ❤️
                                        </button>
                                        <button
                                          onClick={() => handleReact(msg.id, "😂")}
                                          className="p-1.5 hover:bg-gray-100 rounded transition-all duration-200 hover:scale-150 text-lg"
                                          title="Laugh"
                                        >
                                          😂
                                        </button>
                                        <button
                                          onClick={() => handleReact(msg.id, "😮")}
                                          className="p-1.5 hover:bg-gray-100 rounded transition-all duration-200 hover:scale-150 text-lg"
                                          title="Surprised"
                                        >
                                          😮
                                        </button>
                                        <button
                                          onClick={() => handleReact(msg.id, "😢")}
                                          className="p-1.5 hover:bg-gray-100 rounded transition-all duration-200 hover:scale-150 text-lg"
                                          title="Sad"
                                        >
                                          😢
                                        </button>
                                        <button
                                          onClick={() => handleReact(msg.id, "😠")}
                                          className="p-1.5 hover:bg-gray-100 rounded transition-all duration-200 hover:scale-150 text-lg"
                                          title="Angry"
                                        >
                                          😠
                                        </button>
                                        <button
                                          onClick={() => handleReact(msg.id, "👍")}
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
                                  <div className="relative" ref={openReactId === msg.id ? reactRef : null}>
                                    <button
                                      onClick={() => setOpenReactId(openReactId === msg.id ? null : msg.id)}
                                      className="p-1 md:p-1.5 rounded-full bg-pink-100 hover:bg-pink-200 transition-colors"
                                      title="React"
                                    >
                                      <Smile className="h-3 w-3 md:h-4 md:w-4 text-gray-800" />
                                    </button>
                                    {openReactId === msg.id && (
                                      <div className="absolute left-0 bottom-full mb-2 bg-white rounded-lg shadow-lg border border-gray-200 p-2 z-10 flex gap-1">
                                        <button
                                          onClick={() => handleReact(msg.id, "❤️")}
                                          className="p-1.5 hover:bg-gray-100 rounded transition-all duration-200 hover:scale-150 text-lg"
                                          title="Love"
                                        >
                                          ❤️
                                        </button>
                                        <button
                                          onClick={() => handleReact(msg.id, "😂")}
                                          className="p-1.5 hover:bg-gray-100 rounded transition-all duration-200 hover:scale-150 text-lg"
                                          title="Laugh"
                                        >
                                          😂
                                        </button>
                                        <button
                                          onClick={() => handleReact(msg.id, "😮")}
                                          className="p-1.5 hover:bg-gray-100 rounded transition-all duration-200 hover:scale-150 text-lg"
                                          title="Surprised"
                                        >
                                          😮
                                        </button>
                                        <button
                                          onClick={() => handleReact(msg.id, "😢")}
                                          className="p-1.5 hover:bg-gray-100 rounded transition-all duration-200 hover:scale-150 text-lg"
                                          title="Sad"
                                        >
                                          😢
                                        </button>
                                        <button
                                          onClick={() => handleReact(msg.id, "😠")}
                                          className="p-1.5 hover:bg-gray-100 rounded transition-all duration-200 hover:scale-150 text-lg"
                                          title="Angry"
                                        >
                                          😠
                                        </button>
                                        <button
                                          onClick={() => handleReact(msg.id, "👍")}
                                          className="p-1.5 hover:bg-gray-100 rounded transition-all duration-200 hover:scale-150 text-lg"
                                          title="Thumbs up"
                                        >
                                          👍
                                        </button>
                                      </div>
                                    )}
                                  </div>
                                  <button
                                    onClick={() => handleReply(msg.id)}
                                    className="p-1 md:p-1.5 rounded-full bg-pink-100 hover:bg-pink-200 transition-colors"
                                    title="Reply"
                                  >
                                    <Reply className="h-3 w-3 md:h-4 md:w-4 text-gray-800" />
                                  </button>
                                  <div className="relative" ref={openMenuId === msg.id ? menuRef : null}>
                                    <button
                                      onClick={() => setOpenMenuId(openMenuId === msg.id ? null : msg.id)}
                                      className="p-1 md:p-1.5 rounded-full bg-pink-100 hover:bg-pink-200 transition-colors"
                                      title="More options"
                                    >
                                      <MoreVertical className="h-3 w-3 md:h-4 md:w-4 text-gray-800" />
                                    </button>
                                    {openMenuId === msg.id && (
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
                      <p className="text-[9px] sm:text-[10px] md:text-xs text-gray-500 mt-1 px-1">{msg.timestamp}</p>
                    </div>
                  </div>
                ))}
                <div ref={messagesEndRef} />
              </div>
            )}
          </div>

          {/* Message Input */}
          <form onSubmit={handleSendMessage} className="border-t border-gray-200 p-2.5 sm:p-3 md:p-6">
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
                        <div className="relative w-16 h-16 md:w-20 md:h-20 rounded-lg overflow-hidden border border-gray-200">
                          <img src={preview} alt={file.name} className="w-full h-full object-cover" />
                          <button
                            type="button"
                            onClick={() => removeFile(index)}
                            className="absolute top-0 right-0 bg-red-500 text-white rounded-full w-4 h-4 md:w-5 md:h-5 flex items-center justify-center text-[10px] md:text-xs hover:bg-red-600"
                          >
                            ×
                          </button>
                        </div>
                      ) : isVideo && preview ? (
                        <div className="relative w-16 h-16 md:w-20 md:h-20 rounded-lg overflow-hidden border border-gray-200">
                          <video src={preview} className="w-full h-full object-cover" />
                          <button
                            type="button"
                            onClick={() => removeFile(index)}
                            className="absolute top-0 right-0 bg-red-500 text-white rounded-full w-4 h-4 md:w-5 md:h-5 flex items-center justify-center text-[10px] md:text-xs hover:bg-red-600"
                          >
                            ×
                          </button>
                        </div>
                      ) : (
                        <div className="relative bg-gray-100 rounded-lg p-1.5 md:p-2 border border-gray-200">
                          <p className="text-[10px] md:text-xs text-gray-700 truncate max-w-[80px] md:max-w-[100px]">{file.name}</p>
                          <p className="text-[10px] md:text-xs text-gray-500">{(file.size / 1024).toFixed(1)} KB</p>
                          <button
                            type="button"
                            onClick={() => removeFile(index)}
                            className="absolute top-0 right-0 bg-red-500 text-white rounded-full w-4 h-4 md:w-5 md:h-5 flex items-center justify-center text-[10px] md:text-xs hover:bg-red-600"
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
              {/* Attachment Icon */}
              <label className="cursor-pointer flex items-center justify-center hover:opacity-70 transition-opacity touch-manipulation min-w-[36px] min-h-[36px] sm:min-w-[40px] sm:min-h-[40px]" title="Attach file" style={{ filter: "drop-shadow(0 1px 2px rgba(0,0,0,0.1))" }}>
                <svg
                  className="w-4 h-4 sm:w-4.5 sm:h-4.5 md:w-5 md:h-5 text-gray-600"
                  style={{ transform: "rotate(20deg)" }}
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  viewBox="0 0 24 24"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" d="M15.172 7l-6.586 6.586a2 2 0 102.828 2.828l6.414-6.586a4 4 0 00-5.656-5.656l-6.415 6.585a6 6 0 108.486 8.486L20.5 13" />
                </svg>
                <input 
                  ref={fileInputRef}
                  type="file" 
                  id="attachmentInput" 
                  name="attachment" 
                  accept="image/*,video/*,.pdf,.doc,.docx,.txt,.zip,.rar" 
                  className="hidden" 
                  multiple
                  onChange={handleFileSelect}
                />
              </label>

              {/* Input Container */}
              <div className="relative flex-1 flex items-center bg-white rounded-xl border border-gray-200 shadow-sm px-2.5 sm:px-3 md:px-4 py-1.5 sm:py-2 md:py-2.5 min-h-[36px] sm:min-h-[40px]">
                <input
                  type="text"
                  name="message"
                  id="messageInput"
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  className="flex-1 bg-transparent border-0 focus:outline-none focus:ring-0 text-[11px] sm:text-xs md:text-sm text-gray-900"
                  placeholder={replyingToMessageId ? "Type your reply..." : "Type your message..."}
                  style={{ fontFamily: "'Inter', sans-serif", color: "#1f2937" }}
                  autoComplete="off"
                />
              </div>

              {/* Send Button */}
              <button
                type="submit"
                className="w-8 h-8 sm:w-8.5 sm:h-8.5 md:w-9 md:h-9 bg-gray-700 text-white rounded-full flex items-center justify-center hover:bg-gray-800 transition-all duration-200 shadow-md hover:shadow-lg flex-shrink-0 touch-manipulation"
                style={{ filter: "drop-shadow(0 2px 4px rgba(0,0,0,0.15))" }}
                aria-label="Send message"
              >
                <svg
                  className="w-3 h-3 sm:w-3.5 sm:h-3.5 md:w-4 md:h-4"
                  style={{ transform: "rotate(20deg)" }}
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path d="M10.894 2.553a1 1 0 00-1.788 0l-7 14a1 1 0 001.169 1.409l5-1.429A1 1 0 009 15.571V11a1 1 0 112 0v4.571a1 1 0 00.725.962l5 1.428a1 1 0 001.17-1.408l-7-14z" />
                </svg>
              </button>
            </div>
          </form>
          </div>
        </div>
      </main>
    </div>
  )
}

