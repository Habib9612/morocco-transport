"use client"

import type React from "react"

import { cn } from "@/lib/utils"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { ArrowUpRight } from "lucide-react"

interface DashboardCardProps {
  title: string
  description?: string
  icon?: React.ReactNode
  className?: string
  headerClassName?: string
  contentClassName?: string
  footerClassName?: string
  footerContent?: React.ReactNode
  actionLabel?: string
  actionHref?: string
  onActionClick?: () => void
  children: React.ReactNode
}

export function DashboardCard({
  title,
  description,
  icon,
  className,
  headerClassName,
  contentClassName,
  footerClassName,
  footerContent,
  actionLabel,
  actionHref,
  onActionClick,
  children,
}: DashboardCardProps) {
  return (
    <Card className={cn("bg-gray-900 border-gray-800 overflow-hidden", className)}>
      <CardHeader className={cn("flex flex-row items-center justify-between pb-2", headerClassName)}>
        <div className="space-y-1">
          <CardTitle className="text-white flex items-center">
            {icon && <span className="mr-2">{icon}</span>}
            {title}
          </CardTitle>
          {description && <CardDescription className="text-gray-400">{description}</CardDescription>}
        </div>
        {actionLabel && (
          <Button
            size="sm"
            variant="ghost"
            className="text-blue-400 hover:text-blue-300 hover:bg-blue-900/20"
            onClick={onActionClick}
            asChild={!!actionHref}
          >
            {actionHref ? (
              <a href={actionHref}>
                {actionLabel}
                <ArrowUpRight className="ml-1 h-4 w-4" />
              </a>
            ) : (
              <>
                {actionLabel}
                <ArrowUpRight className="ml-1 h-4 w-4" />
              </>
            )}
          </Button>
        )}
      </CardHeader>
      <CardContent className={cn("", contentClassName)}>{children}</CardContent>
      {(footerContent || footerClassName) && (
        <CardFooter className={cn("border-t border-gray-800 pt-4", footerClassName)}>{footerContent}</CardFooter>
      )}
    </Card>
  )
}
