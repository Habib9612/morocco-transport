import { useEffect } from 'react';
import { AppProps } from 'next/app';
import { ThemeProvider } from '@/lib/theme-context';
import { I18nProvider } from '@/lib/i18n-context';
import { KeyboardShortcutsProvider } from '@/lib/keyboard-shortcuts';
import { registerServiceWorker } from '@/lib/service-worker';
import '@/styles/globals.css';

export default function App({ Component, pageProps }: AppProps) {
  useEffect(() => {
    // Register service worker
    registerServiceWorker().catch(console.error);

    // Cleanup function
    return () => {
      // Service worker will be automatically unregistered when the app is uninstalled
    };
  }, []);

  return (
    <ThemeProvider>
      <I18nProvider>
        <KeyboardShortcutsProvider>
          <Component {...pageProps} />
        </KeyboardShortcutsProvider>
      </I18nProvider>
    </ThemeProvider>
  );
} 