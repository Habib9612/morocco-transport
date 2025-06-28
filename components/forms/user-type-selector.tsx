"use client"

import { Truck, User, Building2 } from "lucide-react"
import { useTranslation } from "@/lib/translation-context"

export type UserType = "carrier" | "individual" | "company"

interface UserTypeSelectorProps {
  onSelect: (type: UserType) => void
  selectedType: UserType | null
}

export function UserTypeSelector({ onSelect, selectedType }: UserTypeSelectorProps) {
  const { t } = useTranslation()

  return (
    <div className="w-full">
      <div className="mb-4">
        <h2 className="text-xl font-bold text-white">{t("login.selectAccountType")}</h2>
        <p className="text-sm text-gray-400">{t("login.chooseAccountType")}</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div
          onClick={() => onSelect("carrier")}
          className={`flex flex-col items-center rounded-lg border-2 p-5 cursor-pointer transition-all duration-200 ${
            selectedType === "carrier"
              ? "border-blue-500 bg-blue-900/20"
              : "border-gray-700 bg-gray-900/50 hover:border-gray-600 hover:bg-gray-800/50"
          }`}
        >
          <div className="bg-blue-900/30 p-3 rounded-full mb-3">
            <Truck className="h-8 w-8 text-blue-400" />
          </div>
          <h3 className="text-lg font-medium text-white mb-2">{t("login.carrier")}</h3>
          <p className="text-sm text-gray-400 text-center">{t("login.carrierDesc")}</p>
        </div>

        <div
          onClick={() => onSelect("individual")}
          className={`flex flex-col items-center rounded-lg border-2 p-5 cursor-pointer transition-all duration-200 ${
            selectedType === "individual"
              ? "border-blue-500 bg-blue-900/20"
              : "border-gray-700 bg-gray-900/50 hover:border-gray-600 hover:bg-gray-800/50"
          }`}
        >
          <div className="bg-blue-900/30 p-3 rounded-full mb-3">
            <User className="h-8 w-8 text-blue-400" />
          </div>
          <h3 className="text-lg font-medium text-white mb-2">{t("login.individual")}</h3>
          <p className="text-sm text-gray-400 text-center">{t("login.individualDesc")}</p>
        </div>

        <div
          onClick={() => onSelect("company")}
          className={`flex flex-col items-center rounded-lg border-2 p-5 cursor-pointer transition-all duration-200 ${
            selectedType === "company"
              ? "border-blue-500 bg-blue-900/20"
              : "border-gray-700 bg-gray-900/50 hover:border-gray-600 hover:bg-gray-800/50"
          }`}
        >
          <div className="bg-blue-900/30 p-3 rounded-full mb-3">
            <Building2 className="h-8 w-8 text-blue-400" />
          </div>
          <h3 className="text-lg font-medium text-white mb-2">{t("login.company")}</h3>
          <p className="text-sm text-gray-400 text-center">{t("login.companyDesc")}</p>
        </div>
      </div>
    </div>
  )
}
