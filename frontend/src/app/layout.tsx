import '@/styles/globals.scss';
import type {ReactNode} from 'react';
import type {Metadata} from 'next';
import {cookies, headers} from 'next/headers';
import AppProviders from '@/components/AppProviders';
import AppShell from '@/components/AppShell';
import {defaultLocale, localeCookieName, locales} from '@/i18n/routing';
import {resolveLocale} from '@/i18n/locale';
import {getTranslator, loadMessages} from '@/i18n/translator';

export async function generateMetadata(): Promise<Metadata> {
  const t = await getTranslator(defaultLocale, 'app');

  return {
    title: t('name'),
    description: t('metaDescription')
  };
}

export default async function RootLayout({
  children
}: {
  children: ReactNode;
}) {
  const cookieStore = cookies();
  const localeFromCookie = cookieStore.get(localeCookieName)?.value;
  const locale = locales.includes(localeFromCookie as (typeof locales)[number])
    ? (localeFromCookie as (typeof locales)[number])
    : resolveLocale(headers().get('accept-language'));
  const messages = await loadMessages(locale);

  return (
    <html lang={locale}>
      <body>
        <AppProviders locale={locale} messages={messages}>
          <AppShell>{children}</AppShell>
        </AppProviders>
      </body>
    </html>
  );
}
