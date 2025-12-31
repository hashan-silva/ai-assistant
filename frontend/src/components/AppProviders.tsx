'use client';

import type {ReactNode} from 'react';
import {AppRouterCacheProvider} from '@mui/material-nextjs/v14-appRouter';
import {CssBaseline, ThemeProvider} from '@mui/material';
import theme from '@/lib/theme';

export default function AppProviders({children}: {children: ReactNode}) {
  return (
    <AppRouterCacheProvider options={{enableCssLayer: true}}>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        {children}
      </ThemeProvider>
    </AppRouterCacheProvider>
  );
}
