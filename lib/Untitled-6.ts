/**
 * Internationalization (i18n) setup for MarocTransit
 */

import React, { createContext, useContext, useState, useEffect } from 'react';

// Define available languages
export type Language = 'en' | 'fr' | 'ar';

// Define translation interface
export interface Translations {
  [key: string]: string | Translations;
}

// i18n context interface
interface I18nContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: (key: string, params?: Record<string, string | number>) => string;
  isRTL: boolean;
}

// Create context with default values
const I18nContext = createContext<I18nContextType>({
  language: 'en',
  setLanguage: () => {},
  t: (key) => key,
  isRTL: false,
});

// Default language
const DEFAULT_LANGUAGE: Language = 'en';

// RTL languages
const RTL_LANGUAGES: Language[] = ['ar'];

// Translation files
const translations: Record<Language, Translations> = {
  en: {
    common: {
      loading: 'Loading...',
      error: 'An error occurred',
      retry: 'Retry',
      welcome: 'Welcome to MarocTransit',
      login: 'Login',
      signup: 'Sign Up',
      logout: 'Logout',
    },
    navigation: {
      home: 'Home',
      routes: 'Routes',
      schedules: 'Schedules',
      alerts: 'Alerts',
      profile: 'Profile',
      settings: 'Settings',
    },
    routes: {
      search: 'Search routes',
      noRoutes: 'No routes found',
      from: 'From',
      to: 'To',
      departsAt: 'Departs at',
      arrivesAt: 'Arrives at',
      duration: 'Duration',
    },
  },
  fr: {
    common: {
      loading: 'Chargement...',
      error: 'Une erreur s\'est produite',
      retry: 'Réessayer',
      welcome: 'Bienvenue sur MarocTransit',
      login: 'Connexion',
      signup: 'S\'inscrire',
      logout: 'Déconnexion',
    },
    navigation: {
      home: 'Accueil',
      routes: 'Itinéraires',
      schedules: 'Horaires',
      alerts: 'Alertes',
      profile: 'Profil',
      settings: 'Paramètres',
    },
    routes: {
      search: 'Rechercher des itinéraires',
      noRoutes: 'Aucun itinéraire trouvé',
      from: 'De',
      to: 'À',
      departsAt: 'Départ à',
      arrivesAt: 'Arrivée à',
      duration: 'Durée',
    },
  },
  ar: {
    common: {
      loading: 'جاري التحميل...',
      error: 'حدث خطأ',
      retry: 'إعادة المحاولة',
      welcome: 'مرحبًا بك في ماروك ترانزيت',
      login: 'تسجيل الدخول',
      signup: 'إنشاء حساب',
      logout: 'تسجيل الخروج',
    },
    navigation: {
      home: 'الرئيسية',
      routes: 'المسارات',
      schedules: 'الجداول الزمنية',
      alerts: 'التنبيهات',
      profile: 'الملف الشخصي',
      settings: 'الإعدادات',
    },
    routes: {
      search: 'البحث عن المسارات',
      noRoutes: 'لم يتم العثور على مسارات',
      from: 'من',
      to: 'إلى',
      departsAt: 'المغادرة في',
      arrivesAt: 'الوصول في',
      duration: 'المدة',
    },
  },
};

// Utility to get nested values using dot notation
function getNestedValue(obj: Translations, path: string): string {
  const keys = path.split('.');
  let result: any = obj;
  
  for (const key of keys) {
    if (result && typeof result === 'object' && key in result) {
      result = result[key];
    } else {
      return path; // Return the path if translation not found
    }
  }
  
  return typeof result === 'string' ? result : path;
}

// Replace parameters in translation string
function replaceParams(text: string, params?: Record<string, string | number>): string {
  if (!params) return text;
  
  return Object.entries(params).reduce((result, [key, value]) => {
    const regex = new RegExp(`{{${key}}}`, 'g');
    return result.replace(regex, String(value));
  }, text);
}

// I18n Provider component
export const I18nProvider: React.FC<{
  children: React.ReactNode;
  initialLanguage?: Language;
}> = ({ children, initialLanguage }) => {
  const [language, setLanguageState] = useState<Language>(
    initialLanguage || DEFAULT_LANGUAGE
  );
  
  const isRTL = RTL_LANGUAGES.includes(language);
  
  // Translation function
  const t = (key: string, params?: Record<string, string | number>): string => {
    const translation = getNestedValue(translations[language], key);
    return replaceParams(translation, params);
  };
  
  // Set language and update document attributes
  const setLanguage = (lang: Language) => {
    setLanguageState(lang);
    localStorage.setItem('language', lang);
    document.documentElement.lang = lang;
    document.documentElement.dir = isRTL ? 'rtl' : 'ltr';
  };
  
  // Initialize language from localStorage on mount
  useEffect(() => {
    const savedLanguage = localStorage.getItem('language') as Language;
    if (savedLanguage && Object.keys(translations).includes(savedLanguage)) {
      setLanguage(savedLanguage);
    } else {
      // Try to detect browser language
      const browserLang = navigator.language.split('-')[0] as Language;
      if (Object.keys(translations).includes(browserLang)) {
        setLanguage(browserLang);
      }
    }
  }, []);
  
  return (
    <I18nContext.Provider value={{ language, setLanguage, t, isRTL }}>
      {children}
    </I18nContext.Provider>
  );
};

// Hook to use i18n in components
export const useI18n = () => useContext(I18nContext);

// Language switcher component
export const LanguageSwitcher: React.FC = () => {
  const { language, setLanguage } = useI18n();
  
  return (
    <div className="language-switcher">
      <select
        value={language}
        onChange={(e) => setLanguage(e.target.value as Language)}
        aria-label="Select language"
      >
        <option value="en">English</option>
        <option value="fr">Français</option>
        <option value="ar">العربية</option>
      </select>
    </div>
  );/**
  * Performance optimization utilities for MarocTransit
  */
 
 import React, { useState, useCallback, useRef, useEffect } from 'react';
 
 /**
  * Custom hook for debouncing values
  */
 export function useDebounce<T>(value: T, delay: number = 500): T {
   const [debouncedValue, setDebouncedValue] = useState<T>(value);
 
   useEffect(() => {
     const handler = setTimeout(() => {
       setDebouncedValue(value);
     }, delay);
 
     return () => {
       clearTimeout(handler);
     };
   }, [value, delay]);
 
   return debouncedValue;
 }
 
 /**
  * Custom hook for throttling function calls
  */
 export function useThrottle<T extends (...args: any[]) => void>(
   func: T,
   wait: number = 300
 ): T {
   const lastCall = useRef(0);
   const timeout = useRef<NodeJS.Timeout | null>(null);
   const lastArgs = useRef<any[]>([]);
 
   return useCallback(
     (...args: Parameters<T>) => {
       const now = Date.now();
       lastArgs.current = args;
 
       if (now - lastCall.current < wait) {
         if (timeout.current) {
           clearTimeout(timeout.current);
         }
 
         timeout.current = setTimeout(() => {
           lastCall.current = now;
           func(...lastArgs.current);
         }, wait - (now - lastCall.current));
       } else {
         lastCall.current = now;
         func(...args);
       }
     },
     [func, wait]
   ) as T;
 }
 
 /**
  * Memoized component with deep props comparison
  */
 export function arePropsEqual(prevProps: any, nextProps: any): boolean {
   const prevKeys = Object.keys(prevProps);
   const nextKeys = Object.keys(nextProps);
 
   if (prevKeys.length !== nextKeys.length) {
     return false;
   }
 
   return prevKeys.every(key => {
     const prevValue = prevProps[key];
     const nextValue = nextProps[key];
     
     if (typeof prevValue === 'object' && prevValue !== null) {
       if (typeof nextValue !== 'object' || nextValue === null) {
         return false;
       }
       return JSON.stringify(prevValue) === JSON.stringify(nextValue);
     }
     
     return prevValue === nextValue;
   });
 }
 
 /**
  * HOC to wrap components that need deep comparison
  */
 export function withDeepComparison<P>(Component: React.ComponentType<P>): React.MemoExoticComponent<React.ComponentType<P>> {
   return React.memo(Component, arePropsEqual);
 }
 
 /**
  * Lazy loading image component with IntersectionObserver
  */
 export const LazyImage: React.FC<{
   src: string;
   alt: string;
   placeholder?: string;
   className?: string;
   width?: number;
   height?: number;
 }> = ({ src, alt, placeholder, className, width, height }) => {
   const [isLoaded, setIsLoaded] = useState(false);
   const [isInView, setIsInView] = useState(false);
   const imgRef = useRef<HTMLImageElement>(null);
 
   useEffect(() => {
     if (!imgRef.current) return;
     
     const observer = new IntersectionObserver(
       (entries) => {
         entries.forEach(entry => {
           if (entry.isIntersecting) {
             setIsInView(true);
             observer.disconnect();
           }
         });
       },
       {
         rootMargin: '200px', // Start loading 200px before image comes into view
       }
     );
 
     observer.observe(imgRef.current);
     
     return () => {
       if (imgRef.current) {
         observer.unobserve(imgRef.current);
       }
     };
   }, []);
 
   return (
     <div 
       className={`lazy-image-container ${className || ''}`}
       style={{ width, height, position: 'relative' }}
     >
       {(!isInView || !isLoaded) && placeholder && (
         <div 
           className="lazy-image-placeholder"
           style={{
             backgroundImage: `url(${placeholder})`,
             position: 'absolute',
             top: 0,
             left: 0,
             right: 0,
             bottom: 0,
             backgroundSize: 'cover',
             backgroundPosition: 'center',
             filter: 'blur(10px)',
           }}
         />
       )}
       <img
         ref={imgRef}
         src={isInView ? src : placeholder || 'data:image/gif;base64,R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw=='}
         alt={alt}
         className={`lazy-image ${isLoaded ? 'loaded' : ''}`}
         style={{ 
           opacity: isLoaded ? 1 : 0,
           transition: 'opacity 0.3s',
           width: '100%',
           height: 'auto',
         }}
         width={width}
         height={height}
         onLoad={() => setIsLoaded(true)}
       />
     </div>
   );
 };
 
 /**
  * Virtualized list component for rendering large lists efficiently
  */
 export const VirtualizedList = <T extends any>({
   items,
   height,
   itemHeight,
   renderItem,
   overscan = 5,
 }: {
   items: T[];
   height: number;
   itemHeight: number;
   renderItem: (item: T, index: number) => React.ReactNode;
   overscan?: number;
 }): JSX.Element => {
   const [scrollTop, setScrollTop] = useState(0);
   const containerRef = useRef<HTMLDivElement>(null);
 
   const handleScroll = useCallback(() => {
     if (containerRef.current) {
       setScrollTop(containerRef.current.scrollTop);
     }
   }, []);
 
   // Calculate which items to render
   const startIndex = Math.max(0, Math.floor(scrollTop / itemHeight) - overscan);
   const endIndex = Math.min(
     items.length - 1,
     Math.floor((scrollTop + height) / itemHeight) + overscan
   );
 
   // Items to render
   const visibleItems = items.slice(startIndex, endIndex + 1);
 
   return (
     <div
       ref={containerRef}
       onScroll={handleScroll}
       style={{
         height,
         overflow: 'auto',
         position: 'relative',
         willChange: 'transform',
       }}
     >
       <div
         style={{
           height: `${items.length * itemHeight}px`,
           position: 'relative',
         }}
       >
         {visibleItems.map((item, localIndex) => {
           const index = startIndex + localIndex;
           return (
             <div
               key={index}
               style={{
                 position: 'absolute',
                 top: `${index * itemHeight}px`,
                 height: `${itemHeight}px`,
                 width: '100%',
               }}
             >
               {renderItem(item, index)}
             </div>
           );
         })}
       </div>
     </div>
   );
 };
 
 /**
  * UseResizeObserver hook for responsive components
  */
 export function useResizeObserver<T extends HTMLElement>(): [
   React.RefObject<T>,
   { width: number; height: number }
 ] {
   const ref = useRef<T>(null);
   const [dimensions, setDimensions] = useState({ width: 0, height: 0 });
 
   useEffect(() => {
     if (!ref.current) return;
 
     const element = ref.current;
     const resizeObserver = new ResizeObserver(entries => {
       if (entries[0]) {
         const { width, height } = entries[0].contentRect;
         setDimensions({ width, height });
       }
     });
 
     resizeObserver.observe(element);
 
     return () => {
       resizeObserver.disconnect();
     };
   }, []);
 
   return [ref, dimensions];
 }
 
 /**
  * Optimize network requests with request batching
  */
 export class RequestBatcher {
   private batchTime: number;
   private batchMap: Map<string, {
     promise: Promise<any>;
     resolve: (value: any) => void;
     reject: (reason: any) => void;
   }[]>;
   private timeoutIds: Map<string, NodeJS.Timeout>;
 
   constructor(batchTime: number = 50) {
     this.batchTime = batchTime;
     this.batchMap = new Map();
     this.timeoutIds = new Map();
   }
 
   request<T>(endpoint: string, payload: any): Promise<T> {
     return new Promise<T>((resolve, reject) => {
       if (!this.batchMap.has(endpoint)) {
         this.batchMap.set(endpoint, []);
       }
 
       const batch = this.batchMap.get(endpoint)!;
       batch.push({ promise: Promise.resolve(), resolve, reject });
 
       if (this.timeoutIds.has(endpoint)) {
         clearTimeout(this.timeoutIds.get(endpoint)!);
       }
 
       this.timeoutIds.set(
         endpoint,
         setTimeout(() => this.processBatch(endpoint, payload), this.batchTime)
       );
     });
   }
 
   private async processBatch(endpoint: string, payload: any): Promise<void> {
     const batch = this.batchMap.get(endpoint) || [];
     this.batchMap.delete(endpoint);
     this.timeoutIds.delete(endpoint);
 
     if (batch.length === 0) return;
 
     try {
       // Here you would implement the logic to batch the requests
       // For example, combining multiple queries into a single request
       const response = await fetch(endpoint, {
         method: 'POST',
         headers: {
           'Content-Type': 'application/json',
         },
         body: JSON.stringify({
           batch: true,
           requests: batch.length,
           payload,
         }),
       });
 
       if (!response.ok) {
         throw new Error(`HTTP error! status: ${response.status}`);
       }
 
       const data = await response.json();
 
       // Resolve all promises in the batch
       batch.forEach(({ resolve }) => resolve(data));
     } catch (error) {
       // Reject all promises in the batch
       batch.forEach(({ reject }) => reject(error));
     }
   }
 }
 
 export default {
   useDebounce,
   useThrottle,
   withDeepComparison,
   LazyImage,
   VirtualizedList,
   useResizeObserver,
   RequestBatcher,
 };lib/performance.tsx
 
};

export default {
  I18nProvider,
  useI18n,
  LanguageSwitcher,
};lib/i18n/index.tsx
n