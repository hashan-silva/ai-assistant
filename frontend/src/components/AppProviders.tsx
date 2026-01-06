'use client';

import type {ReactNode} from 'react';
import {AppRouterCacheProvider} from '@mui/material-nextjs/v14-appRouter';
import {CssBaseline, ThemeProvider} from '@mui/material';
import {NextIntlClientProvider} from 'next-intl';
import type {AbstractIntlMessages} from 'next-intl';
import theme from '@/lib/theme';

type AppProvidersProps = {
  children: ReactNode;
  locale: string;
  messages: AbstractIntlMessages;
};

export default function AppProviders({children, locale, messages}: AppProvidersProps) {
  return (
    <AppRouterCacheProvider options={{enableCssLayer: true}}>
      <NextIntlClientProvider locale={locale} messages={messages} timeZone="Europe/Stockholm">
        <ThemeProvider theme={theme}>
          <CssBaseline />
          {children}
        </ThemeProvider>
      </NextIntlClientProvider>
    </AppRouterCacheProvider>
  );
}
