import '@/styles/globals.scss';
import type {ReactNode} from 'react';
import type {Metadata} from 'next';
import AppProviders from '@/components/AppProviders';
import AppShell from '@/components/AppShell';
import {defaultLocale} from '@/i18n/routing';
import {getTranslator} from '@/i18n/translator';

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
  return (
    <html lang={defaultLocale}>
      <body>
        <AppProviders>
          <AppShell>{children}</AppShell>
        </AppProviders>
      </body>
    </html>
  );
}
