"use client"

import type React from "react"

import { useState, useEffect, useRef } from "react"
import { useAuth } from "@/lib/auth-context"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Send, Phone, Video, Info, Search } from "lucide-react"

// Mock conversation data
const MOCK_CONVERSATIONS = [
  {
    id: "1",
    with: {
      id: "user1",
      name: "John Doe",
      avatar: null,
    },
    lastMessage: {
      text: "I can deliver your package tomorrow morning.",
      timestamp: new Date(Date.now() - 1000 * 60 * 30).toISOString(),
      isRead: true,
    },
    unread: 0,
  },
  {
    id: "2",
    with: {
      id: "user2",
      name: "ABC Logistics",
      avatar: null,
    },
    lastMessage: {
      text: "What time will you be available for pickup?",
      timestamp: new Date(Date.now() - 1000 * 60 * 60 * 2).toISOString(),
      isRead: false,
    },
    unread: 2,
  },
  {
    id: "3",
    with: {
      id: "user3",
      name: "Sarah Smith",
      avatar: null,
    },
    lastMessage: {
      text: "The package has been delivered successfully.",
      timestamp: new Date(Date.now() - 1000 * 60 * 60 * 24).toISOString(),
      isRead: true,
    },
    unread: 0,
  },
]

// Mock messages for a conversation
const MOCK_MESSAGES = [
  {
    id: "m1",
    senderId: "user1",
    text: "Hello, I saw your shipment request.",
    timestamp: new Date(Date.now() - 1000 * 60 * 60).toISOString(),
  },
  {
    id: "m2",
    senderId: "currentUser",
    text: "Hi there! Yes, I need to ship some furniture.",
    timestamp: new Date(Date.now() - 1000 * 60 * 55).toISOString(),
  },
  {
    id: "m3",
    senderId: "user1",
    text: "I can help with that. What's the pickup location?",
    timestamp: new Date(Date.now() - 1000 * 60 * 50).toISOString(),
  },
  {
    id: "m4",
    senderId: "currentUser",
    text: "It's at 123 Main St, New York.",
    timestamp: new Date(Date.now() - 1000 * 60 * 45).toISOString(),
  },
  {
    id: "m5",
    senderId: "user1",
    text: "Great, I can be there tomorrow at 10 AM. Does that work for you?",
    timestamp: new Date(Date.now() - 1000 * 60 * 40).toISOString(),
  },
  {
    id: "m6",
    senderId: "currentUser",
    text: "That works perfectly. How much will it cost?",
    timestamp: new Date(Date.now() - 1000 * 60 * 35).toISOString(),
  },
  {
    id: "m7",
    senderId: "user1",
    text: "Based on the size and distance, it will be $350.",
    timestamp: new Date(Date.now() - 1000 * 60 * 30).toISOString(),
  },
]

function formatTime(timestamp: string) {
  const date = new Date(timestamp)
  return date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })
}

function formatDate(timestamp: string) {
  const date = new Date(timestamp)
  const today = new Date()
  const yesterday = new Date(today)
  yesterday.setDate(yesterday.getDate() - 1)

  if (date.toDateString() === today.toDateString()) {
    return "Today"
  } else if (date.toDateString() === yesterday.toDateString()) {
    return "Yesterday"
  } else {
    return date.toLocaleDateString()
  }
}

export default function MessagesPage() {
  const { user } = useAuth()
  const [conversations, setConversations] = useState(MOCK_CONVERSATIONS)
  const [activeConversation, setActiveConversation] = useState<string | null>(null)
  const [messages, setMessages] = useState(MOCK_MESSAGES)
  const [newMessage, setNewMessage] = useState("")
  const messagesEndRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: "smooth" })
    }
  }, [messages])

  if (!user) {
    return null
  }

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault()
    if (!newMessage.trim()) return

    const newMsg = {
      id: `m${messages.length + 1}`,
      senderId: "currentUser",
      text: newMessage,
      timestamp: new Date().toISOString(),
    }

    setMessages([...messages, newMsg])
    setNewMessage("")
  }

  const activeConversationData = conversations.find((c) => c.id === activeConversation) || conversations[0]

  return (
    <div className="flex h-[calc(100vh-4rem)] flex-col">
      <div className="border-b p-4">
        <h1 className="text-2xl font-bold">Messages</h1>
        <p className="text-sm text-gray-500">Communicate with carriers and customers</p>
      </div>
      <div className="flex flex-1 overflow-hidden">
        {/* Conversations sidebar */}
        <div className="w-80 border-r overflow-y-auto">
          <div className="p-3 border-b">
            <div className="relative">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-500" />
              <Input type="search" placeholder="Search conversations..." className="w-full pl-9" />
            </div>
          </div>
          <div className="divide-y">
            {conversations.map((conversation) => (
              <div
                key={conversation.id}
                className={`p-3 cursor-pointer hover:bg-gray-100 ${
                  activeConversation === conversation.id ? "bg-gray-100" : ""
                }`}
                onClick={() => setActiveConversation(conversation.id)}
              >
                <div className="flex items-start gap-3">
                  <Avatar>
                    <AvatarImage src={conversation.with.avatar || undefined} />
                    <AvatarFallback>{conversation.with.name.charAt(0).toUpperCase()}</AvatarFallback>
                  </Avatar>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between">
                      <h3 className="font-medium truncate">{conversation.with.name}</h3>
                      <span className="text-xs text-gray-500">{formatTime(conversation.lastMessage.timestamp)}</span>
                    </div>
                    <p className="text-sm text-gray-500 truncate">{conversation.lastMessage.text}</p>
                  </div>
                  {conversation.unread > 0 && (
                    <Badge variant="destructive" className="ml-auto">
                      {conversation.unread}
                    </Badge>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Chat area */}
        <div className="flex-1 flex flex-col overflow-hidden">
          {/* Chat header */}
          <div className="border-b p-3 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Avatar>
                <AvatarImage src={activeConversationData?.with.avatar || undefined} />
                <AvatarFallback>{activeConversationData?.with.name.charAt(0).toUpperCase()}</AvatarFallback>
              </Avatar>
              <div>
                <h3 className="font-medium">{activeConversationData?.with.name}</h3>
                <p className="text-xs text-gray-500">Last active: 5m ago</p>
              </div>
            </div>
            <div className="flex gap-2">
              <Button variant="ghost" size="icon">
                <Phone className="h-5 w-5" />
              </Button>
              <Button variant="ghost" size="icon">
                <Video className="h-5 w-5" />
              </Button>
              <Button variant="ghost" size="icon">
                <Info className="h-5 w-5" />
              </Button>
            </div>
          </div>

          {/* Messages */}
          <div className="flex-1 overflow-y-auto p-4">
            {messages.map((message, index) => {
              const isCurrentUser = message.senderId === "currentUser"
              const showDate =
                index === 0 || formatDate(messages[index - 1].timestamp) !== formatDate(message.timestamp)

              return (
                <div key={message.id} className="mb-4">
                  {showDate && (
                    <div className="flex justify-center mb-4">
                      <span className="text-xs bg-gray-100 text-gray-500 px-2 py-1 rounded-full">
                        {formatDate(message.timestamp)}
                      </span>
                    </div>
                  )}
                  <div className={`flex ${isCurrentUser ? "justify-end" : "justify-start"}`}>
                    <div className="flex items-end gap-2 max-w-[70%]">
                      {!isCurrentUser && (
                        <Avatar className="h-8 w-8">
                          <AvatarImage src={activeConversationData?.with.avatar || undefined} />
                          <AvatarFallback>{activeConversationData?.with.name.charAt(0).toUpperCase()}</AvatarFallback>
                        </Avatar>
                      )}
                      <div
                        className={`px-4 py-2 rounded-2xl ${
                          isCurrentUser ? "bg-blue-500 text-white rounded-br-none" : "bg-gray-100 rounded-bl-none"
                        }`}
                      >
                        <p>{message.text}</p>
                        <span className={`text-xs block mt-1 ${isCurrentUser ? "text-blue-100" : "text-gray-500"}`}>
                          {formatTime(message.timestamp)}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              )
            })}
            <div ref={messagesEndRef} />
          </div>

          {/* Message input */}
          <div className="border-t p-3">
            <form onSubmit={handleSendMessage} className="flex gap-2">
              <Input
                value={newMessage}
                onChange={(e) => setNewMessage(e.target.value)}
                placeholder="Type a message..."
                className="flex-1"
              />
              <Button type="submit" disabled={!newMessage.trim()}>
                <Send className="h-4 w-4 mr-2" />
                Send
              </Button>
            </form>
          </div>
        </div>
      </div>
    </div>
  )
}
