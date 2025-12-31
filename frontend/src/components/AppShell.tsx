import type {ReactNode} from 'react';
import {Box, Container} from '@mui/material';
import AppHeader from '@/components/AppHeader';
import AppFooter from '@/components/AppFooter';

export default function AppShell({children}: {children: ReactNode}) {
  return (
    <Box className="app-shell">
      <AppHeader />
      <Box component="main" className="app-main">
        <Container maxWidth="lg">{children}</Container>
      </Box>
      <AppFooter />
    </Box>
  );
}
