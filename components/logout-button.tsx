"use client"

import { LogOut } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useAuth } from "@/lib/auth-context"

interface LogoutButtonProps {
  variant?: "default" | "outline" | "ghost"
  size?: "default" | "sm" | "lg" | "icon"
}

export default function LogoutButton({ variant = "ghost", size = "default" }: LogoutButtonProps) {
  const { logout } = useAuth()

  return (
    <Button
      variant={variant}
      size={size}
      onClick={logout}
      className={`
        ${variant === "ghost" ? "text-gray-400 hover:text-white hover:bg-[#2d3748]" : ""}
        ${variant === "outline" ? "border-[#2d3748] text-gray-300 hover:text-white hover:bg-[#2d3748]" : ""}
      `}
    >
      {size === "icon" ? (
        <LogOut className="h-4 w-4" />
      ) : (
        <>
          <LogOut className="mr-2 h-4 w-4" />
          Sign Out
        </>
      )}
    </Button>
  )
}
