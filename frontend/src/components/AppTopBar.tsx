'use client';

import {useEffect, useState} from 'react';
import {usePathname, useRouter} from 'next/navigation';
import {useLocale} from 'next-intl';
import {Avatar, Box, Button, MenuItem, Select, Stack, Typography} from '@mui/material';
import {localeCookieName, locales} from '@/i18n/routing';

type MeResponse = {
  name?: string;
};

const languageOptions: Record<(typeof locales)[number], {label: string; flag: string}> = {
  en: {label: 'English', flag: '🇬🇧'},
  sv: {label: 'Svenska', flag: '🇸🇪'}
};

export default function AppTopBar() {
  const router = useRouter();
  const pathname = usePathname();
  const locale = useLocale() as (typeof locales)[number];
  const [name, setName] = useState<string | null>(null);

  useEffect(() => {
    let active = true;

    const loadProfile = async () => {
      try {
        const response = await fetch('/api/auth/me', {cache: 'no-store'});
        if (!response.ok) {
          if (active) {
            setName(null);
          }
          return;
        }
        const payload = await response.json() as MeResponse;
        if (active) {
          setName(payload.name || null);
        }
      } catch {
        if (active) {
          setName(null);
        }
      }
    };

    void loadProfile();
    return () => {
      active = false;
    };
  }, [pathname]);

  const onLocaleChange = (value: (typeof locales)[number]) => {
    document.cookie = `${localeCookieName}=${value}; path=/; max-age=31536000; samesite=lax`;
    router.refresh();
  };

  const onLogout = async () => {
    await fetch('/api/auth/logout', {method: 'POST'});
    router.push('/login');
    router.refresh();
  };

  const showUserActions = pathname !== '/login' && pathname !== '/register';

  return (
    <Box className="app-topbar">
      <Stack direction="row" justifyContent="space-between" alignItems="center" className="app-topbar-inner">
        <Typography variant="h6" className="app-brand">ai-assistant</Typography>
        <Stack direction="row" spacing={1.5} alignItems="center">
          <Select
            size="small"
            className="language-select"
            value={locale}
            onChange={(event) => onLocaleChange(event.target.value as (typeof locales)[number])}
          >
            {locales.map((code) => (
              <MenuItem key={code} value={code}>
                {languageOptions[code].flag} {languageOptions[code].label}
              </MenuItem>
            ))}
          </Select>
          {showUserActions && (
            <Stack direction="row" spacing={1} alignItems="center" className="user-pill">
              <Avatar sx={{width: 30, height: 30}}>{name?.charAt(0).toUpperCase() || 'U'}</Avatar>
              <Typography variant="body2" className="user-name">{name || 'User'}</Typography>
              <Button size="small" variant="outlined" onClick={onLogout}>Logout</Button>
            </Stack>
          )}
        </Stack>
      </Stack>
    </Box>
  );
}
