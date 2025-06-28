"use client"

import { createContext, useContext, useState, useEffect, type ReactNode } from "react"

type TranslationContextType = {
  t: (key: string) => string
  changeLanguage: (language: string) => void
  currentLanguage: string
}

const TranslationContext = createContext<TranslationContextType | undefined>(undefined)

// Basic translations for demonstration
const translations: Record<string, Record<string, string>> = {
  en: {
    "login.title": "Sign in to your account",
    "login.createAccount": "Or create a new account",
    "login.email": "Email address",
    "login.password": "Password",
    "login.forgotPassword": "Forgot your password?",
    "login.signIn": "Sign in",
    "login.signingIn": "Signing in...",
    "login.selectAccountType": "Select Account Type",
    "login.chooseAccountType": "Choose the type of account that best fits your needs",
    "login.carrier": "Carrier",
    "login.carrierDesc": "Transport goods and find shipments near you",
    "login.individual": "Individual Shipper",
    "login.individualDesc": "Ship your goods with reliable carriers",
    "login.company": "Fleet Manager",
    "login.companyDesc": "Manage your fleet and optimize operations",
    "login.errorSelectType": "Please select an account type",
    "nav.home": "Home",
    "nav.solutions": "Solutions",
    "nav.features": "Features",
    "nav.pricing": "Pricing",
    "nav.about": "About",
    "nav.login": "Login",
    "nav.signup": "Sign Up Free",
  },
  fr: {
    "login.title": "Connectez-vous à votre compte",
    "login.createAccount": "Ou créez un nouveau compte",
    "login.email": "Adresse e-mail",
    "login.password": "Mot de passe",
    "login.forgotPassword": "Mot de passe oublié ?",
    "login.signIn": "Se connecter",
    "login.signingIn": "Connexion...",
    "login.selectAccountType": "Sélectionnez le type de compte",
    "login.chooseAccountType": "Choisissez le type de compte qui correspond le mieux à vos besoins",
    "login.carrier": "Transporteur",
    "login.carrierDesc": "Transportez des marchandises et trouvez des expéditions près de chez vous",
    "login.individual": "Expéditeur Individuel",
    "login.individualDesc": "Expédiez vos marchandises avec des transporteurs fiables",
    "login.company": "Gestionnaire de Flotte",
    "login.companyDesc": "Gérez votre flotte et optimisez les opérations",
    "login.errorSelectType": "Veuillez sélectionner un type de compte",
    "nav.home": "Accueil",
    "nav.solutions": "Solutions",
    "nav.features": "Fonctionnalités",
    "nav.pricing": "Tarification",
    "nav.about": "À propos",
    "nav.login": "Connexion",
    "nav.signup": "Inscription Gratuite",
  },
  ar: {
    "login.title": "تسجيل الدخول إلى حسابك",
    "login.createAccount": "أو إنشاء حساب جديد",
    "login.email": "البريد الإلكتروني",
    "login.password": "كلمة المرور",
    "login.forgotPassword": "نسيت كلمة المرور؟",
    "login.signIn": "تسجيل الدخول",
    "login.signingIn": "جاري تسجيل الدخول...",
    "login.selectAccountType": "اختر نوع الحساب",
    "login.chooseAccountType": "اختر نوع الحساب الذي يناسب احتياجاتك",
    "login.carrier": "ناقل",
    "login.carrierDesc": "نقل البضائع والعثور على الشحنات بالقرب منك",
    "login.individual": "شاحن فردي",
    "login.individualDesc": "شحن بضائعك مع ناقلين موثوقين",
    "login.company": "مدير الأسطول",
    "login.companyDesc": "إدارة أسطولك وتحسين العمليات",
    "login.errorSelectType": "الرجاء اختيار نوع الحساب",
    "nav.home": "الرئيسية",
    "nav.solutions": "الحلول",
    "nav.features": "الميزات",
    "nav.pricing": "التسعير",
    "nav.about": "عن الشركة",
    "nav.login": "تسجيل الدخول",
    "nav.signup": "التسجيل مجانًا",
  },
  es: {
    "login.title": "Inicia sesión en tu cuenta",
    "login.createAccount": "O crea una nueva cuenta",
    "login.email": "Correo electrónico",
    "login.password": "Contraseña",
    "login.forgotPassword": "¿Olvidaste tu contraseña?",
    "login.signIn": "Iniciar sesión",
    "login.signingIn": "Iniciando sesión...",
    "login.selectAccountType": "Selecciona el tipo de cuenta",
    "login.chooseAccountType": "Elige el tipo de cuenta que mejor se adapte a tus necesidades",
    "login.carrier": "Transportista",
    "login.carrierDesc": "Transporta mercancías y encuentra envíos cerca de ti",
    "login.individual": "Remitente Individual",
    "login.individualDesc": "Envía tus mercancías con transportistas confiables",
    "login.company": "Gestor de Flota",
    "login.companyDesc": "Gestiona tu flota y optimiza las operaciones",
    "login.errorSelectType": "Por favor selecciona un tipo de cuenta",
    "nav.home": "Inicio",
    "nav.solutions": "Soluciones",
    "nav.features": "Funcionalidades",
    "nav.pricing": "Precios",
    "nav.about": "Acerca de",
    "nav.login": "Iniciar Sesión",
    "nav.signup": "Registrarse Gratis",
  },
}

export const TranslationProvider = ({ children }: { children: ReactNode }) => {
  const [currentLanguage, setCurrentLanguage] = useState("en")

  useEffect(() => {
    const savedLang = localStorage.getItem("preferredLanguage")
    if (savedLang && translations[savedLang]) {
      setCurrentLanguage(savedLang)
      document.documentElement.lang = savedLang
      document.documentElement.dir = savedLang === "ar" ? "rtl" : "ltr"
    }
  }, [])

  const changeLanguage = (language: string) => {
    if (translations[language]) {
      setCurrentLanguage(language)
      localStorage.setItem("preferredLanguage", language)
      document.documentElement.lang = language
      document.documentElement.dir = language === "ar" ? "rtl" : "ltr"
    }
  }

  const t = (key: string): string => {
    return translations[currentLanguage]?.[key] || translations["en"][key] || key
  }

  return (
    <TranslationContext.Provider value={{ t, changeLanguage, currentLanguage }}>{children}</TranslationContext.Provider>
  )
}

export const useTranslation = () => {
  const context = useContext(TranslationContext)
  if (context === undefined) {
    throw new Error("useTranslation must be used within a TranslationProvider")
  }
  return context
}
