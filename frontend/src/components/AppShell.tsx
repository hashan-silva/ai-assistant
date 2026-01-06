import type {ReactNode} from 'react';
import {Box} from '@mui/material';

export default function AppShell({children}: {children: ReactNode}) {
  return (
    <Box className="app-shell">
      <Box component="main" className="app-main">
        {children}
      </Box>
    </Box>
  );
}
