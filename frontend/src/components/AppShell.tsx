import type {ReactNode} from 'react';
import {Box} from '@mui/material';
import AppTopBar from '@/components/AppTopBar';

export default function AppShell({children}: {children: ReactNode}) {
  return (
    <Box className="app-shell">
      <AppTopBar />
      <Box component="main" className="app-main">
        {children}
      </Box>
    </Box>
  );
}
