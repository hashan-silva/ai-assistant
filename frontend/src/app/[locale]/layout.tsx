import '@/styles/globals.scss';
import type {ReactNode} from 'react';
import type {Metadata} from 'next';
import {NextIntlClientProvider} from 'next-intl';
import {getMessages, getTranslations} from 'next-intl/server';
import {Source_Serif_4, Work_Sans} from 'next/font/google';
import {routing} from '@/i18n/routing';
import AppProviders from '@/components/AppProviders';
import AppShell from '@/components/AppShell';

const displayFont = Source_Serif_4({
  subsets: ['latin'],
  variable: '--font-display'
});

const bodyFont = Work_Sans({
  subsets: ['latin'],
  variable: '--font-body'
});

export function generateStaticParams() {
  return routing.locales.map((locale) => ({locale}));
}

export async function generateMetadata({
  params
}: {
  params: {locale: string};
}): Promise<Metadata> {
  const t = await getTranslations({locale: params.locale, namespace: 'app'});

  return {
    title: t('name'),
    description: t('metaDescription')
  };
}

export default async function LocaleLayout({
  children,
  params
}: {
  children: ReactNode;
  params: {locale: string};
}) {
  const messages = await getMessages();

  return (
    <html lang={params.locale}>
      <body className={`${bodyFont.variable} ${displayFont.variable}`}>
        <NextIntlClientProvider messages={messages}>
          <AppProviders>
            <AppShell>{children}</AppShell>
          </AppProviders>
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
