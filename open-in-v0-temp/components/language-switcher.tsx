"use client"

import { useState, useEffect } from "react"
import { Check, ChevronDown, Globe } from "lucide-react"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"

export type Language = {
  code: string
  name: string
  flag?: string
}

interface LanguageSwitcherProps {
  className?: string
  variant?: "default" | "outline" | "minimal"
}

const languages: Language[] = [
  { code: "en", name: "English", flag: "🇺🇸" },
  { code: "fr", name: "Français", flag: "🇫🇷" },
  { code: "ar", name: "العربية", flag: "🇲🇦" },
  { code: "es", name: "Español", flag: "🇪🇸" },
]

export function LanguageSwitcher({ className, variant = "default" }: LanguageSwitcherProps) {
  const [currentLanguage, setCurrentLanguage] = useState<Language>(languages[0])

  useEffect(() => {
    const savedLang = localStorage.getItem("preferredLanguage")
    if (savedLang) {
      const lang = languages.find((l) => l.code === savedLang)
      if (lang) setCurrentLanguage(lang)
    }
  }, [])

  const handleLanguageChange = (language: Language) => {
    setCurrentLanguage(language)
    localStorage.setItem("preferredLanguage", language.code)
    // This would trigger the actual language change in a real app
    document.documentElement.lang = language.code
    // If using next-i18next or similar, you would call their functions here
  }

  if (variant === "minimal") {
    return (
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" size="icon" className={cn("px-2 w-9", className)}>
            <span className="sr-only">Switch language</span>
            <span className="text-sm font-medium">{currentLanguage.code.toUpperCase()}</span>
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-[160px]">
          {languages.map((language) => (
            <DropdownMenuItem
              key={language.code}
              onClick={() => handleLanguageChange(language)}
              className="cursor-pointer"
            >
              <span className="mr-2">{language.flag}</span>
              <span>{language.name}</span>
              {currentLanguage.code === language.code && <Check className="ml-auto h-4 w-4" />}
            </DropdownMenuItem>
          ))}
        </DropdownMenuContent>
      </DropdownMenu>
    )
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant={variant === "outline" ? "outline" : "ghost"}
          size="sm"
          className={cn("flex items-center gap-1 px-2", className)}
        >
          <Globe className="h-4 w-4" />
          <span className="hidden sm:inline-block">{currentLanguage.name}</span>
          <span className="inline-block sm:hidden">{currentLanguage.code.toUpperCase()}</span>
          <ChevronDown className="h-3 w-3 opacity-50" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-[160px]">
        {languages.map((language) => (
          <DropdownMenuItem
            key={language.code}
            onClick={() => handleLanguageChange(language)}
            className="cursor-pointer"
          >
            <span className="mr-2">{language.flag}</span>
            <span>{language.name}</span>
            {currentLanguage.code === language.code && <Check className="ml-auto h-4 w-4" />}
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
