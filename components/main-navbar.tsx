"use client"

import { useState } from "react"
import Link from "next/link"
import { Menu, X } from "lucide-react"
import { Button } from "@/components/ui/button"
import { LanguageSwitcher } from "@/components/language-switcher"
import { useTranslation } from "@/lib/translation-context"

export default function MainNavbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const { t } = useTranslation()

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex items-center justify-between h-16 px-4 md:px-6">
        <Link href="/" className="flex items-center">
          <div className="mr-2 h-8 w-8 rounded-full bg-blue-600 flex items-center justify-center">
            <span className="text-white font-bold text-lg">M</span>
          </div>
          <span className="font-bold text-xl">MarocTransit</span>
          <span className="text-xs text-blue-600 ml-2">AI-Powered Logistics</span>
        </Link>

        {/* Mobile menu button */}
        <button
          onClick={() => setIsMenuOpen(!isMenuOpen)}
          className="inline-flex items-center p-2 ml-3 rounded-lg md:hidden"
        >
          {isMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
        </button>

        {/* Desktop navigation */}
        <nav className={`hidden md:flex gap-6 items-center`}>
          <Link href="/" className="text-sm font-medium text-gray-700 hover:text-blue-600 transition-colors">
            {t("nav.home")}
          </Link>
          <Link href="/solutions" className="text-sm font-medium text-gray-700 hover:text-blue-600 transition-colors">
            {t("nav.solutions")}
          </Link>
          <Link href="/features" className="text-sm font-medium text-gray-700 hover:text-blue-600 transition-colors">
            {t("nav.features")}
          </Link>
          <Link href="/pricing" className="text-sm font-medium text-gray-700 hover:text-blue-600 transition-colors">
            {t("nav.pricing")}
          </Link>
          <Link href="/about" className="text-sm font-medium text-gray-700 hover:text-blue-600 transition-colors">
            {t("nav.about")}
          </Link>
          <LanguageSwitcher />
          <div className="flex items-center gap-2">
            <Button variant="outline" className="px-4" asChild>
              <Link href="/login">{t("nav.login")}</Link>
            </Button>
            <Button className="px-4 bg-blue-600 hover:bg-blue-700" asChild>
              <Link href="/signup">{t("nav.signup")}</Link>
            </Button>
          </div>
        </nav>
      </div>

      {/* Mobile menu */}
      <div className={`md:hidden ${isMenuOpen ? "block" : "hidden"}`}>
        <div className="space-y-1 px-4 py-3 border-t">
          <Link
            href="/"
            className="block py-2 px-3 text-gray-700 hover:bg-gray-100 rounded-md"
            onClick={() => setIsMenuOpen(false)}
          >
            {t("nav.home")}
          </Link>
          <Link
            href="/solutions"
            className="block py-2 px-3 text-gray-700 hover:bg-gray-100 rounded-md"
            onClick={() => setIsMenuOpen(false)}
          >
            {t("nav.solutions")}
          </Link>
          <Link
            href="/features"
            className="block py-2 px-3 text-gray-700 hover:bg-gray-100 rounded-md"
            onClick={() => setIsMenuOpen(false)}
          >
            {t("nav.features")}
          </Link>
          <Link
            href="/pricing"
            className="block py-2 px-3 text-gray-700 hover:bg-gray-100 rounded-md"
            onClick={() => setIsMenuOpen(false)}
          >
            {t("nav.pricing")}
          </Link>
          <Link
            href="/about"
            className="block py-2 px-3 text-gray-700 hover:bg-gray-100 rounded-md"
            onClick={() => setIsMenuOpen(false)}
          >
            {t("nav.about")}
          </Link>
          <div className="pt-4 flex items-center">
            <LanguageSwitcher />
          </div>
          <div className="flex flex-col space-y-2 pt-2">
            <Button variant="outline" className="w-full" asChild>
              <Link href="/login" onClick={() => setIsMenuOpen(false)}>
                {t("nav.login")}
              </Link>
            </Button>
            <Button className="w-full bg-blue-600 hover:bg-blue-700" asChild>
              <Link href="/signup" onClick={() => setIsMenuOpen(false)}>
                {t("nav.signup")}
              </Link>
            </Button>
          </div>
        </div>
      </div>
    </header>
  )
}
