import '@/styles/globals.scss';
import type {ReactNode} from 'react';
import type {Metadata} from 'next';
import {NextIntlClientProvider} from 'next-intl';
import {getLocale, getMessages, getTranslations} from 'next-intl/server';
import {Source_Serif_4, Work_Sans} from 'next/font/google';
import AppProviders from '@/components/AppProviders';
import AppShell from '@/components/AppShell';
import {defaultLocale} from '@/i18n/routing';

export const dynamic = 'force-dynamic';

const displayFont = Source_Serif_4({
  subsets: ['latin'],
  variable: '--font-display'
});

const bodyFont = Work_Sans({
  subsets: ['latin'],
  variable: '--font-body'
});

export async function generateMetadata(): Promise<Metadata> {
  const t = await getTranslations({locale: defaultLocale, namespace: 'app'});

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
  const locale = await getLocale();
  const messages = await getMessages();

  return (
    <html lang={locale}>
      <body className={`${bodyFont.variable} ${displayFont.variable}`}>
        <NextIntlClientProvider locale={locale} messages={messages}>
          <AppProviders>
            <AppShell>{children}</AppShell>
          </AppProviders>
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
