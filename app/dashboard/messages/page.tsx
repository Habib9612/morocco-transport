"use client"

import type React from "react"

import { useState, useEffect, useRef } from "react"
import { useAuth } from "@/lib/auth-context"

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

type Conversation = {
  id: string;
  with: {
    id: string;
    name: string;
    avatar: string | null;
  };
  lastMessage: {
    text: string;
    timestamp: string;
    isRead: boolean;
  };
  unread: number;
};

function formatTime(timestamp: string) {
  const date = new Date(timestamp)
  return date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })
}

export default function MessagesPage() {
  const { user } = useAuth()
  const [conversations] = useState<Conversation[]>(MOCK_CONVERSATIONS)
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

  const activeConvo = conversations.find((c) => c.id === activeConversation)

  return (
    <div className="flex h-[calc(100vh-4rem)] bg-gray-900">
      {/* Conversations sidebar */}
      <div className="w-80 border-r border-gray-800 flex flex-col">
        <div className="p-4 border-b border-gray-800">
          <h2 className="text-xl font-bold text-white">Messages</h2>
        </div>
        <div className="flex-1 overflow-auto">
          {conversations.map((conversation) => (
            <div
              key={conversation.id}
              className={`p-4 border-b border-gray-800 cursor-pointer hover:bg-gray-800 ${
                activeConversation === conversation.id ? "bg-gray-800" : ""
              }`}
              onClick={() => setActiveConversation(conversation.id)}
            >
              <div className="flex justify-between items-start">
                <div className="flex items-center">
                  <div className="w-10 h-10 rounded-full bg-gray-700 flex items-center justify-center text-white">
                    {conversation.with.name.charAt(0)}
                  </div>
                  <div className="ml-3">
                    <p className="font-medium text-white">{conversation.with.name}</p>
                    <p className="text-sm text-gray-400 truncate w-36">{conversation.lastMessage.text}</p>
                  </div>
                </div>
                <div className="flex flex-col items-end">
                  <span className="text-xs text-gray-500">{formatTime(conversation.lastMessage.timestamp)}</span>
                  {conversation.unread > 0 && (
                    <span className="mt-1 bg-blue-600 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                      {conversation.unread}
                    </span>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Chat area */}
      {activeConversation ? (
        <div className="flex-1 flex flex-col">
          <div className="p-4 border-b border-gray-800 flex items-center">
            <div className="w-8 h-8 rounded-full bg-gray-700 flex items-center justify-center text-white">
              {activeConvo?.with.name.charAt(0)}
            </div>
            <h3 className="ml-3 font-medium text-white">{activeConvo?.with.name}</h3>
          </div>
          <div className="flex-1 overflow-auto p-4 space-y-4">
            {messages.map((message) => {
              const isCurrentUser = message.senderId === "currentUser"
              return (
                <div key={message.id} className={`flex ${isCurrentUser ? "justify-end" : "justify-start"}`}>
                  <div
                    className={`max-w-[70%] rounded-lg p-3 ${
                      isCurrentUser ? "bg-blue-600 text-white" : "bg-gray-800 text-gray-200"
                    }`}
                  >
                    <p>{message.text}</p>
                    <p className="text-xs mt-1 opacity-70">{formatTime(message.timestamp)}</p>
                  </div>
                </div>
              )
            })}
            <div ref={messagesEndRef} />
          </div>
          <form onSubmit={handleSendMessage} className="p-4 border-t border-gray-800 flex">
            <input
              type="text"
              value={newMessage}
              onChange={(e) => setNewMessage(e.target.value)}
              placeholder="Type a message..."
              className="flex-1 bg-gray-800 border border-gray-700 rounded-l-md px-4 py-2 text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <button type="submit" className="bg-blue-600 hover:bg-blue-700 text-white px-4 rounded-r-md">
              Send
            </button>
          </form>
        </div>
      ) : (
        <div className="flex-1 flex items-center justify-center">
          <div className="text-center">
            <p className="text-gray-400">Select a conversation to start messaging</p>
          </div>
        </div>
      )}
    </div>
  )
}
