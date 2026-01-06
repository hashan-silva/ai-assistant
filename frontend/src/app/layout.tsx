import '@/styles/globals.scss';
import type {ReactNode} from 'react';
import type {Metadata} from 'next';
import {headers} from 'next/headers';
import AppProviders from '@/components/AppProviders';
import AppShell from '@/components/AppShell';
import {defaultLocale} from '@/i18n/routing';
import {getRequestLocale, getTranslator, loadMessages} from '@/i18n/translator';

export const dynamic = 'force-dynamic';

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
  const headerLocale = headers().get('accept-language');
  const locale = getRequestLocale(headerLocale);
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
