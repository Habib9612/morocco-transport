import { createContext, useContext, useState, useEffect, ReactNode } from 'react';

type Language = 'en' | 'fr' | 'ar';

interface Translations {
  [key: string]: {
    [key: string]: string;
  };
}

const translations: Translations = {
  en: {
    'chat.placeholder': 'Type a message...',
    'chat.placeholder.offline': "You're offline - messages will be sent when connected",
    'chat.send': 'Send',
    'chat.status.connected': 'Connected',
    'chat.status.offline': 'Offline',
    'chat.with': 'Chat with {name}',
    'chat.message.retry': 'Retry sending message',
    'chat.message.delete': 'Delete message',
    'chat.typing': '{name} is typing...',
    'chat.load_more': 'Load more messages',
    'notification.close': 'Close notification',
    'notification.mark_all_read': 'Mark all as read',
    'notification.empty': 'No new notifications',
    'map.loading': 'Loading map...',
    'map.location_error': 'Error getting location',
    'map.search_placeholder': 'Search location...',
    'map.your_location': 'Your location',
    'map.destination': 'Destination',
    'error.websocket': 'WebSocket is not connected',
    'error.message.failed': 'Failed to send message',
    'error.retry': 'Retry',
    'error.location': 'Unable to get your location',
    'language.select': 'Select language',
    'date.today': 'Today',
    'date.yesterday': 'Yesterday',
    'time.just_now': 'Just now',
    'time.minutes_ago': '{minutes}m ago',
    'time.hours_ago': '{hours}h ago',
    'keyboard.shortcuts': 'Keyboard Shortcuts',
    'keyboard.toggle_theme': 'Toggle theme',
    'keyboard.focus_search': 'Focus search',
    'keyboard.toggle_chat': 'Toggle chat',
    'keyboard.toggle_notifications': 'Toggle notifications',
    'keyboard.close_modal': 'Close modal/dropdown',
    'keyboard.show_shortcuts': 'Show keyboard shortcuts',
    'common.close': 'Close',
    'chat.reactions.add': 'Add reaction',
    'chat.reactions.remove': 'Remove reaction',
    'chat.reactions.users': '{count} users reacted with {emoji}',
    'upload.click_to_upload': 'Click to upload',
    'upload.or_drag_drop': 'or drag and drop',
    'upload.max_size': 'Maximum file size: {maxSize}MB',
    'upload.error.size': 'File is too large. Maximum size is {maxSize}MB',
    'upload.error.type': 'Invalid file type',
    'search.placeholder': 'Search messages...',
    'search.no_results': 'No messages found'
  },
  fr: {
    'chat.placeholder': 'Tapez un message...',
    'chat.placeholder.offline': 'Vous êtes hors ligne - les messages seront envoyés une fois connecté',
    'chat.send': 'Envoyer',
    'chat.status.connected': 'Connecté',
    'chat.status.offline': 'Hors ligne',
    'chat.with': 'Chat avec {name}',
    'chat.message.retry': 'Renvoyer le message',
    'chat.message.delete': 'Supprimer le message',
    'chat.typing': '{name} est en train d\'écrire...',
    'chat.load_more': 'Charger plus de messages',
    'notification.close': 'Fermer la notification',
    'notification.mark_all_read': 'Tout marquer comme lu',
    'notification.empty': 'Aucune nouvelle notification',
    'map.loading': 'Chargement de la carte...',
    'map.location_error': 'Erreur de localisation',
    'map.search_placeholder': 'Rechercher un lieu...',
    'map.your_location': 'Votre position',
    'map.destination': 'Destination',
    'error.websocket': 'WebSocket non connecté',
    'error.message.failed': 'Échec de l\'envoi du message',
    'error.retry': 'Réessayer',
    'error.location': 'Impossible d\'obtenir votre position',
    'language.select': 'Sélectionner la langue',
    'date.today': 'Aujourd\'hui',
    'date.yesterday': 'Hier',
    'time.just_now': 'À l\'instant',
    'time.minutes_ago': 'Il y a {minutes}m',
    'time.hours_ago': 'Il y a {hours}h',
    'keyboard.shortcuts': 'Raccourcis Clavier',
    'keyboard.toggle_theme': 'Changer de thème',
    'keyboard.focus_search': 'Focus recherche',
    'keyboard.toggle_chat': 'Basculer le chat',
    'keyboard.toggle_notifications': 'Basculer les notifications',
    'keyboard.close_modal': 'Fermer modal/menu',
    'keyboard.show_shortcuts': 'Afficher les raccourcis',
    'common.close': 'Fermer',
    'chat.reactions.add': 'Ajouter une réaction',
    'chat.reactions.remove': 'Supprimer la réaction',
    'chat.reactions.users': '{count} utilisateurs ont réagi avec {emoji}',
    'upload.click_to_upload': 'Cliquez pour télécharger',
    'upload.or_drag_drop': 'ou glissez-déposez',
    'upload.max_size': 'Taille maximale du fichier : {maxSize}MB',
    'upload.error.size': 'Le fichier est trop volumineux. Taille maximale : {maxSize}MB',
    'upload.error.type': 'Type de fichier invalide',
    'search.placeholder': 'Rechercher des messages...',
    'search.no_results': 'Aucun message trouvé'
  },
  ar: {
    'chat.placeholder': 'اكتب رسالة...',
    'chat.placeholder.offline': 'أنت غير متصل - سيتم إرسال الرسائل عند الاتصال',
    'chat.send': 'إرسال',
    'chat.status.connected': 'متصل',
    'chat.status.offline': 'غير متصل',
    'chat.with': 'محادثة مع {name}',
    'chat.message.retry': 'إعادة إرسال الرسالة',
    'chat.message.delete': 'حذف الرسالة',
    'chat.typing': '{name} يكتب...',
    'chat.load_more': 'تحميل المزيد من الرسائل',
    'notification.close': 'إغلاق الإشعار',
    'notification.mark_all_read': 'تحديد الكل كمقروء',
    'notification.empty': 'لا توجد إشعارات جديدة',
    'map.loading': 'جاري تحميل الخريطة...',
    'map.location_error': 'خطأ في تحديد الموقع',
    'map.search_placeholder': 'البحث عن موقع...',
    'map.your_location': 'موقعك',
    'map.destination': 'الوجهة',
    'error.websocket': 'WebSocket غير متصل',
    'error.message.failed': 'فشل إرسال الرسالة',
    'error.retry': 'إعادة المحاولة',
    'error.location': 'تعذر الحصول على موقعك',
    'language.select': 'اختر اللغة',
    'date.today': 'اليوم',
    'date.yesterday': 'أمس',
    'time.just_now': 'الآن',
    'time.minutes_ago': 'منذ {minutes} دقيقة',
    'time.hours_ago': 'منذ {hours} ساعة',
    'keyboard.shortcuts': 'اختصارات لوحة المفاتيح',
    'keyboard.toggle_theme': 'تبديل المظهر',
    'keyboard.focus_search': 'تركيز البحث',
    'keyboard.toggle_chat': 'تبديل المحادثة',
    'keyboard.toggle_notifications': 'تبديل الإشعارات',
    'keyboard.close_modal': 'إغلاق النافذة/القائمة',
    'keyboard.show_shortcuts': 'عرض الاختصارات',
    'common.close': 'إغلاق',
    'chat.reactions.add': 'إضافة رد فعل',
    'chat.reactions.remove': 'إزالة رد الفعل',
    'chat.reactions.users': '{count} مستخدمين تفاعلوا بـ {emoji}',
    'upload.click_to_upload': 'انقر للتحميل',
    'upload.or_drag_drop': 'أو اسحب وأفلت',
    'upload.max_size': 'الحد الأقصى لحجم الملف: {maxSize} ميجابايت',
    'upload.error.size': 'الملف كبير جدًا. الحد الأقصى للحجم هو {maxSize} ميجابايت',
    'upload.error.type': 'نوع الملف غير صالح',
    'search.placeholder': 'البحث في الرسائل...',
    'search.no_results': 'لم يتم العثور على رسائل'
  }
};

interface I18nContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: (key: string, params?: Record<string, string>) => string;
  dir: () => 'ltr' | 'rtl';
  formatDate: (date: Date) => string;
  formatTime: (date: Date) => string;
  formatRelativeTime: (date: Date) => string;
}

const I18nContext = createContext<I18nContextType | undefined>(undefined);

const LANGUAGE_STORAGE_KEY = 'preferred_language';

export function I18nProvider({ children }: { children: ReactNode }) {
  const [language, setLanguageState] = useState<Language>(() => {
    const stored = localStorage.getItem(LANGUAGE_STORAGE_KEY);
    return (stored as Language) || 
           (typeof window !== 'undefined' && window.navigator.language.startsWith('fr') ? 'fr' :
            typeof window !== 'undefined' && window.navigator.language.startsWith('ar') ? 'ar' : 'en');
  });

  const setLanguage = (lang: Language) => {
    setLanguageState(lang);
    localStorage.setItem(LANGUAGE_STORAGE_KEY, lang);
    document.documentElement.dir = lang === 'ar' ? 'rtl' : 'ltr';
    document.documentElement.lang = lang;
  };

  useEffect(() => {
    document.documentElement.dir = language === 'ar' ? 'rtl' : 'ltr';
    document.documentElement.lang = language;
  }, [language]);

  const t = (key: string, params?: Record<string, string>) => {
    let text = translations[language]?.[key] || key;
    if (params) {
      Object.entries(params).forEach(([key, value]) => {
        text = text.replace(`{${key}}`, value);
      });
    }
    return text;
  };

  const dir = () => language === 'ar' ? 'rtl' : 'ltr';

  const formatDate = (date: Date) => {
    const today = new Date();
    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);

    if (date.toDateString() === today.toDateString()) {
      return t('date.today');
    } else if (date.toDateString() === yesterday.toDateString()) {
      return t('date.yesterday');
    }

    return date.toLocaleDateString(language === 'en' ? 'en-US' : language === 'fr' ? 'fr-FR' : 'ar-MA');
  };

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString(language === 'en' ? 'en-US' : language === 'fr' ? 'fr-FR' : 'ar-MA', {
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const formatRelativeTime = (date: Date) => {
    const now = new Date();
    const diffMinutes = Math.floor((now.getTime() - date.getTime()) / (1000 * 60));

    if (diffMinutes < 1) {
      return t('time.just_now');
    } else if (diffMinutes < 60) {
      return t('time.minutes_ago', { minutes: diffMinutes.toString() });
    } else {
      const hours = Math.floor(diffMinutes / 60);
      if (hours < 24) {
        return t('time.hours_ago', { hours: hours.toString() });
      }
    }

    return formatDate(date);
  };

  return (
    <I18nContext.Provider value={{ 
      language, 
      setLanguage, 
      t, 
      dir,
      formatDate,
      formatTime,
      formatRelativeTime
    }}>
      {children}
    </I18nContext.Provider>
  );
}

export function useI18n() {
  const context = useContext(I18nContext);
  if (context === undefined) {
    throw new Error('useI18n must be used within an I18nProvider');
  }
  return context;
} 