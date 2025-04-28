"use client"

import { Badge } from "@/components/ui/badge"

import type React from "react"

import { useState } from "react"
import { useAuth } from "@/lib/auth-context"
import { useTranslation } from "@/lib/translation-context"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { AlertCircle, Check, Globe, Lock, MapPin, Shield, User, Wrench } from "lucide-react"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"

export default function SettingsPage() {
  const { user, updateUserLocation } = useAuth()
  const { t } = useTranslation()

  const [activeTab, setActiveTab] = useState("profile")
  const [formState, setFormState] = useState({
    name: user?.name || "",
    email: user?.email || "",
    company: user?.company || "",
    phone: "",
    address: user?.location?.address || "",
    language: "en",
    timeZone: "UTC",
    dateFormat: "MM/DD/YYYY",
    timeFormat: "12h",
    darkMode: true,
    emailNotifications: true,
    pushNotifications: true,
    smsNotifications: false,
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  })

  const [saveStatus, setSaveStatus] = useState<"idle" | "saving" | "success" | "error">("idle")

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormState((prev) => ({ ...prev, [name]: value }))
  }

  const handleSwitchChange = (name: string, checked: boolean) => {
    setFormState((prev) => ({ ...prev, [name]: checked }))
  }

  const handleSelectChange = (name: string, value: string) => {
    setFormState((prev) => ({ ...prev, [name]: value }))
  }

  const handleSaveProfile = async () => {
    setSaveStatus("saving")

    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1000))

      // Update user location if address was changed
      if (formState.address !== user?.location?.address) {
        updateUserLocation({
          lat: user?.location?.lat || 0,
          lng: user?.location?.lng || 0,
          address: formState.address,
        })
      }

      setSaveStatus("success")
      setTimeout(() => setSaveStatus("idle"), 3000)
    } catch (error) {
      setSaveStatus("error")
      setTimeout(() => setSaveStatus("idle"), 3000)
    }
  }

  const handleSavePassword = async () => {
    setSaveStatus("saving")

    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1000))

      setSaveStatus("success")
      setTimeout(() => setSaveStatus("idle"), 3000)
      setFormState((prev) => ({
        ...prev,
        currentPassword: "",
        newPassword: "",
        confirmPassword: "",
      }))
    } catch (error) {
      setSaveStatus("error")
      setTimeout(() => setSaveStatus("idle"), 3000)
    }
  }

  return (
    <div className="container mx-auto py-6 max-w-5xl">
      <div className="flex flex-col space-y-6">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-white">{t("settings.title")}</h1>
          <p className="text-slate-400">{t("settings.subtitle")}</p>
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="grid grid-cols-4 sm:w-[600px]">
            <TabsTrigger value="profile" className="flex items-center gap-2" data-active={activeTab === "profile"}>
              <User className="h-4 w-4" />
              <span className="hidden sm:inline">{t("settings.tabs.profile")}</span>
            </TabsTrigger>
            <TabsTrigger
              value="preferences"
              className="flex items-center gap-2"
              data-active={activeTab === "preferences"}
            >
              <Wrench className="h-4 w-4" />
              <span className="hidden sm:inline">{t("settings.tabs.preferences")}</span>
            </TabsTrigger>
            <TabsTrigger
              value="notifications"
              className="flex items-center gap-2"
              data-active={activeTab === "notifications"}
            >
              <AlertCircle className="h-4 w-4" />
              <span className="hidden sm:inline">{t("settings.tabs.notifications")}</span>
            </TabsTrigger>
            <TabsTrigger value="security" className="flex items-center gap-2" data-active={activeTab === "security"}>
              <Shield className="h-4 w-4" />
              <span className="hidden sm:inline">{t("settings.tabs.security")}</span>
            </TabsTrigger>
          </TabsList>

          {/* Profile Settings */}
          <TabsContent value="profile" className="space-y-6">
            <Card className="bg-gray-900 border-gray-800">
              <CardHeader>
                <CardTitle className="text-white">{t("settings.profile.title")}</CardTitle>
                <CardDescription className="text-gray-400">{t("settings.profile.description")}</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="flex flex-col md:flex-row gap-6">
                  <div className="flex flex-col items-center space-y-3">
                    <Avatar className="h-24 w-24">
                      <AvatarImage src="/placeholder.svg?height=96&width=96" alt={user?.name} />
                      <AvatarFallback className="text-2xl">{user?.name?.charAt(0).toUpperCase() || "U"}</AvatarFallback>
                    </Avatar>
                    <Button
                      variant="outline"
                      size="sm"
                      className="text-gray-400 border-gray-700 hover:text-white hover:bg-gray-800"
                    >
                      {t("settings.profile.changePhoto")}
                    </Button>
                  </div>
                  <div className="flex-1 space-y-4">
                    <div className="grid gap-4 md:grid-cols-2">
                      <div className="space-y-2">
                        <Label htmlFor="name" className="text-gray-300">
                          {t("settings.profile.name")}
                        </Label>
                        <Input
                          id="name"
                          name="name"
                          value={formState.name}
                          onChange={handleInputChange}
                          className="bg-gray-800 border-gray-700 text-white"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="email" className="text-gray-300">
                          {t("settings.profile.email")}
                        </Label>
                        <Input
                          id="email"
                          name="email"
                          type="email"
                          value={formState.email}
                          onChange={handleInputChange}
                          className="bg-gray-800 border-gray-700 text-white"
                        />
                      </div>
                    </div>
                    <div className="grid gap-4 md:grid-cols-2">
                      <div className="space-y-2">
                        <Label htmlFor="company" className="text-gray-300">
                          {t("settings.profile.company")}
                        </Label>
                        <Input
                          id="company"
                          name="company"
                          value={formState.company}
                          onChange={handleInputChange}
                          className="bg-gray-800 border-gray-700 text-white"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="phone" className="text-gray-300">
                          {t("settings.profile.phone")}
                        </Label>
                        <Input
                          id="phone"
                          name="phone"
                          type="tel"
                          value={formState.phone}
                          onChange={handleInputChange}
                          className="bg-gray-800 border-gray-700 text-white"
                        />
                      </div>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="address" className="text-gray-300">
                        <div className="flex items-center">
                          <MapPin className="h-4 w-4 mr-1" />
                          {t("settings.profile.address")}
                        </div>
                      </Label>
                      <Textarea
                        id="address"
                        name="address"
                        value={formState.address}
                        onChange={handleInputChange}
                        className="bg-gray-800 border-gray-700 text-white min-h-[80px]"
                      />
                    </div>
                  </div>
                </div>
              </CardContent>
              <CardFooter className="flex justify-between border-t border-gray-800 pt-5">
                <div className="flex items-center">
                  {saveStatus === "success" && (
                    <span className="text-green-500 flex items-center">
                      <Check className="mr-1 h-4 w-4" /> {t("settings.saved")}
                    </span>
                  )}
                  {saveStatus === "error" && (
                    <span className="text-red-500 flex items-center">
                      <AlertCircle className="mr-1 h-4 w-4" /> {t("settings.error")}
                    </span>
                  )}
                </div>
                <Button
                  onClick={handleSaveProfile}
                  disabled={saveStatus === "saving"}
                  className="bg-blue-600 hover:bg-blue-700 text-white"
                >
                  {saveStatus === "saving" ? t("settings.saving") : t("settings.saveChanges")}
                </Button>
              </CardFooter>
            </Card>
          </TabsContent>

          {/* Preferences Settings */}
          <TabsContent value="preferences" className="space-y-6">
            <Card className="bg-gray-900 border-gray-800">
              <CardHeader>
                <CardTitle className="text-white">{t("settings.preferences.title")}</CardTitle>
                <CardDescription className="text-gray-400">{t("settings.preferences.description")}</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="language" className="text-gray-300">
                      <div className="flex items-center">
                        <Globe className="h-4 w-4 mr-1" />
                        {t("settings.preferences.language")}
                      </div>
                    </Label>
                    <Select value={formState.language} onValueChange={(value) => handleSelectChange("language", value)}>
                      <SelectTrigger id="language" className="bg-gray-800 border-gray-700 text-white">
                        <SelectValue placeholder={t("settings.preferences.selectLanguage")} />
                      </SelectTrigger>
                      <SelectContent className="bg-gray-800 border-gray-700 text-white">
                        <SelectItem value="en">English</SelectItem>
                        <SelectItem value="fr">Français</SelectItem>
                        <SelectItem value="es">Español</SelectItem>
                        <SelectItem value="ar">العربية</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="timeZone" className="text-gray-300">
                      {t("settings.preferences.timeZone")}
                    </Label>
                    <Select value={formState.timeZone} onValueChange={(value) => handleSelectChange("timeZone", value)}>
                      <SelectTrigger id="timeZone" className="bg-gray-800 border-gray-700 text-white">
                        <SelectValue placeholder={t("settings.preferences.selectTimeZone")} />
                      </SelectTrigger>
                      <SelectContent className="bg-gray-800 border-gray-700 text-white">
                        <SelectItem value="UTC">UTC</SelectItem>
                        <SelectItem value="EST">Eastern Time (EST/EDT)</SelectItem>
                        <SelectItem value="CST">Central Time (CST/CDT)</SelectItem>
                        <SelectItem value="MST">Mountain Time (MST/MDT)</SelectItem>
                        <SelectItem value="PST">Pacific Time (PST/PDT)</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="grid gap-4 md:grid-cols-2">
                    <div className="space-y-2">
                      <Label htmlFor="dateFormat" className="text-gray-300">
                        {t("settings.preferences.dateFormat")}
                      </Label>
                      <Select
                        value={formState.dateFormat}
                        onValueChange={(value) => handleSelectChange("dateFormat", value)}
                      >
                        <SelectTrigger id="dateFormat" className="bg-gray-800 border-gray-700 text-white">
                          <SelectValue placeholder={t("settings.preferences.selectDateFormat")} />
                        </SelectTrigger>
                        <SelectContent className="bg-gray-800 border-gray-700 text-white">
                          <SelectItem value="MM/DD/YYYY">MM/DD/YYYY</SelectItem>
                          <SelectItem value="DD/MM/YYYY">DD/MM/YYYY</SelectItem>
                          <SelectItem value="YYYY-MM-DD">YYYY-MM-DD</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="timeFormat" className="text-gray-300">
                        {t("settings.preferences.timeFormat")}
                      </Label>
                      <Select
                        value={formState.timeFormat}
                        onValueChange={(value) => handleSelectChange("timeFormat", value)}
                      >
                        <SelectTrigger id="timeFormat" className="bg-gray-800 border-gray-700 text-white">
                          <SelectValue placeholder={t("settings.preferences.selectTimeFormat")} />
                        </SelectTrigger>
                        <SelectContent className="bg-gray-800 border-gray-700 text-white">
                          <SelectItem value="12h">12-hour (AM/PM)</SelectItem>
                          <SelectItem value="24h">24-hour</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label htmlFor="darkMode" className="text-gray-300">
                        {t("settings.preferences.darkMode")}
                      </Label>
                      <p className="text-xs text-gray-500">{t("settings.preferences.darkModeDescription")}</p>
                    </div>
                    <Switch
                      id="darkMode"
                      checked={formState.darkMode}
                      onCheckedChange={(checked) => handleSwitchChange("darkMode", checked)}
                    />
                  </div>
                </div>
              </CardContent>
              <CardFooter className="flex justify-between border-t border-gray-800 pt-5">
                <div className="flex items-center">
                  {saveStatus === "success" && (
                    <span className="text-green-500 flex items-center">
                      <Check className="mr-1 h-4 w-4" /> {t("settings.saved")}
                    </span>
                  )}
                  {saveStatus === "error" && (
                    <span className="text-red-500 flex items-center">
                      <AlertCircle className="mr-1 h-4 w-4" /> {t("settings.error")}
                    </span>
                  )}
                </div>
                <Button
                  onClick={handleSaveProfile}
                  disabled={saveStatus === "saving"}
                  className="bg-blue-600 hover:bg-blue-700 text-white"
                >
                  {saveStatus === "saving" ? t("settings.saving") : t("settings.saveChanges")}
                </Button>
              </CardFooter>
            </Card>
          </TabsContent>

          {/* Notifications Settings */}
          <TabsContent value="notifications" className="space-y-6">
            <Card className="bg-gray-900 border-gray-800">
              <CardHeader>
                <CardTitle className="text-white">{t("settings.notifications.title")}</CardTitle>
                <CardDescription className="text-gray-400">{t("settings.notifications.description")}</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label htmlFor="emailNotifications" className="text-gray-300">
                        {t("settings.notifications.email")}
                      </Label>
                      <p className="text-xs text-gray-500">{t("settings.notifications.emailDescription")}</p>
                    </div>
                    <Switch
                      id="emailNotifications"
                      checked={formState.emailNotifications}
                      onCheckedChange={(checked) => handleSwitchChange("emailNotifications", checked)}
                    />
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label htmlFor="pushNotifications" className="text-gray-300">
                        {t("settings.notifications.push")}
                      </Label>
                      <p className="text-xs text-gray-500">{t("settings.notifications.pushDescription")}</p>
                    </div>
                    <Switch
                      id="pushNotifications"
                      checked={formState.pushNotifications}
                      onCheckedChange={(checked) => handleSwitchChange("pushNotifications", checked)}
                    />
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label htmlFor="smsNotifications" className="text-gray-300">
                        {t("settings.notifications.sms")}
                      </Label>
                      <p className="text-xs text-gray-500">{t("settings.notifications.smsDescription")}</p>
                    </div>
                    <Switch
                      id="smsNotifications"
                      checked={formState.smsNotifications}
                      onCheckedChange={(checked) => handleSwitchChange("smsNotifications", checked)}
                    />
                  </div>
                </div>
              </CardContent>
              <CardFooter className="flex justify-between border-t border-gray-800 pt-5">
                <div className="flex items-center">
                  {saveStatus === "success" && (
                    <span className="text-green-500 flex items-center">
                      <Check className="mr-1 h-4 w-4" /> {t("settings.saved")}
                    </span>
                  )}
                  {saveStatus === "error" && (
                    <span className="text-red-500 flex items-center">
                      <AlertCircle className="mr-1 h-4 w-4" /> {t("settings.error")}
                    </span>
                  )}
                </div>
                <Button
                  onClick={handleSaveProfile}
                  disabled={saveStatus === "saving"}
                  className="bg-blue-600 hover:bg-blue-700 text-white"
                >
                  {saveStatus === "saving" ? t("settings.saving") : t("settings.saveChanges")}
                </Button>
              </CardFooter>
            </Card>
          </TabsContent>

          {/* Security Settings */}
          <TabsContent value="security" className="space-y-6">
            <Card className="bg-gray-900 border-gray-800">
              <CardHeader>
                <CardTitle className="text-white">{t("settings.security.title")}</CardTitle>
                <CardDescription className="text-gray-400">{t("settings.security.description")}</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="currentPassword" className="text-gray-300">
                      <div className="flex items-center">
                        <Lock className="h-4 w-4 mr-1" />
                        {t("settings.security.currentPassword")}
                      </div>
                    </Label>
                    <Input
                      id="currentPassword"
                      name="currentPassword"
                      type="password"
                      value={formState.currentPassword}
                      onChange={handleInputChange}
                      className="bg-gray-800 border-gray-700 text-white"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="newPassword" className="text-gray-300">
                      {t("settings.security.newPassword")}
                    </Label>
                    <Input
                      id="newPassword"
                      name="newPassword"
                      type="password"
                      value={formState.newPassword}
                      onChange={handleInputChange}
                      className="bg-gray-800 border-gray-700 text-white"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="confirmPassword" className="text-gray-300">
                      {t("settings.security.confirmPassword")}
                    </Label>
                    <Input
                      id="confirmPassword"
                      name="confirmPassword"
                      type="password"
                      value={formState.confirmPassword}
                      onChange={handleInputChange}
                      className="bg-gray-800 border-gray-700 text-white"
                    />
                  </div>
                </div>

                <Alert variant="default" className="bg-gray-800 border-amber-800 text-amber-400">
                  <AlertCircle className="h-4 w-4" />
                  <AlertTitle>{t("settings.security.passwordRequirements")}</AlertTitle>
                  <AlertDescription className="text-gray-400">
                    <ul className="list-disc pl-5 text-sm mt-2 space-y-1">
                      <li>{t("settings.security.minChars")}</li>
                      <li>{t("settings.security.upperCase")}</li>
                      <li>{t("settings.security.lowerCase")}</li>
                      <li>{t("settings.security.number")}</li>
                      <li>{t("settings.security.specialChar")}</li>
                    </ul>
                  </AlertDescription>
                </Alert>
              </CardContent>
              <CardFooter className="flex justify-between border-t border-gray-800 pt-5">
                <div className="flex items-center">
                  {saveStatus === "success" && (
                    <span className="text-green-500 flex items-center">
                      <Check className="mr-1 h-4 w-4" /> {t("settings.saved")}
                    </span>
                  )}
                  {saveStatus === "error" && (
                    <span className="text-red-500 flex items-center">
                      <AlertCircle className="mr-1 h-4 w-4" /> {t("settings.error")}
                    </span>
                  )}
                </div>
                <Button
                  onClick={handleSavePassword}
                  disabled={
                    saveStatus === "saving" ||
                    !formState.currentPassword ||
                    !formState.newPassword ||
                    formState.newPassword !== formState.confirmPassword
                  }
                  className="bg-blue-600 hover:bg-blue-700 text-white"
                >
                  {saveStatus === "saving" ? t("settings.saving") : t("settings.updatePassword")}
                </Button>
              </CardFooter>
            </Card>

            <Card className="bg-gray-900 border-gray-800">
              <CardHeader>
                <CardTitle className="text-white">{t("settings.security.sessions")}</CardTitle>
                <CardDescription className="text-gray-400">
                  {t("settings.security.sessionsDescription")}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {[
                    { device: "Chrome on Windows", lastActive: "Currently active", location: "Rabat, Morocco" },
                    { device: "Safari on iPhone", lastActive: "2 hours ago", location: "Casablanca, Morocco" },
                    { device: "Firefox on Mac", lastActive: "Yesterday", location: "Marrakech, Morocco" },
                  ].map((session, index) => (
                    <div
                      key={index}
                      className="flex justify-between items-center border-b border-gray-800 pb-3 last:border-b-0 last:pb-0"
                    >
                      <div>
                        <p className="font-medium text-white">{session.device}</p>
                        <div className="flex flex-col sm:flex-row sm:items-center text-xs text-gray-400 gap-0 sm:gap-2">
                          <span>{session.lastActive}</span>
                          <span className="hidden sm:inline">•</span>
                          <span>{session.location}</span>
                        </div>
                      </div>
                      {index === 0 ? (
                        <Badge variant="outline" className="bg-green-900/30 text-green-400 border-green-800/30">
                          Current
                        </Badge>
                      ) : (
                        <Button
                          variant="outline"
                          size="sm"
                          className="text-red-400 border-gray-700 hover:bg-red-900/20 hover:text-red-300"
                        >
                          Log out
                        </Button>
                      )}
                    </div>
                  ))}
                </div>
              </CardContent>
              <CardFooter className="border-t border-gray-800 pt-5">
                <Button
                  variant="outline"
                  className="text-red-400 border-gray-700 hover:bg-red-900/20 hover:text-red-300"
                >
                  {t("settings.security.logoutAllDevices")}
                </Button>
              </CardFooter>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}
