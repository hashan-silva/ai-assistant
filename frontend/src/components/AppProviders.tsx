'use client';

import {createContext, useContext, useEffect, useMemo, useState, type ReactNode} from 'react';
import {AppRouterCacheProvider} from '@mui/material-nextjs/v14-appRouter';
import {CssBaseline, ThemeProvider} from '@mui/material';
import {NextIntlClientProvider} from 'next-intl';
import type {AbstractIntlMessages} from 'next-intl';
import enMessages from '../../messages/en.json';
import svMessages from '../../messages/sv.json';
import theme from '@/lib/theme';
import {defaultLocale, localeCookieName, locales} from '@/i18n/routing';

type LocaleValue = {
  locale: (typeof locales)[number];
  setLocale: (locale: (typeof locales)[number]) => void;
};

const LocaleContext = createContext<LocaleValue>({
  locale: defaultLocale,
  setLocale: () => {}
});

const messagesByLocale: Record<(typeof locales)[number], AbstractIntlMessages> = {
  en: enMessages,
  sv: svMessages
};

const getInitialLocale = (): (typeof locales)[number] => {
  if (typeof window === 'undefined') {
    return defaultLocale;
  }
  const localStorageLocale = window.localStorage.getItem(localeCookieName);
  if (localStorageLocale && locales.includes(localStorageLocale as (typeof locales)[number])) {
    return localStorageLocale as (typeof locales)[number];
  }
  return defaultLocale;
};

export const useAppLocale = () => useContext(LocaleContext);

export default function AppProviders({children}: {children: ReactNode}) {
  const [locale, setLocale] = useState<(typeof locales)[number]>(defaultLocale);

  useEffect(() => {
    setLocale(getInitialLocale());
  }, []);

  const value = useMemo(() => ({
    locale,
    setLocale: (nextLocale: (typeof locales)[number]) => {
      setLocale(nextLocale);
      window.localStorage.setItem(localeCookieName, nextLocale);
      document.cookie = `${localeCookieName}=${nextLocale}; path=/; max-age=31536000; samesite=lax`;
      console.info('[locale] changed', {locale: nextLocale});
    }
  }), [locale]);

  return (
    <AppRouterCacheProvider options={{enableCssLayer: true}}>
      <LocaleContext.Provider value={value}>
        <NextIntlClientProvider
          locale={locale}
          messages={messagesByLocale[locale]}
          timeZone="Europe/Stockholm"
        >
          <ThemeProvider theme={theme}>
            <CssBaseline />
            {children}
          </ThemeProvider>
        </NextIntlClientProvider>
      </LocaleContext.Provider>
    </AppRouterCacheProvider>
  );
}
