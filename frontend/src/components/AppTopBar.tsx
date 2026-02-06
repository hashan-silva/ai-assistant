'use client';

import {useEffect, useMemo, useState} from 'react';
import {usePathname, useRouter} from 'next/navigation';
import {Avatar, Box, Button, MenuItem, Select, Stack, Typography} from '@mui/material';
import {locales} from '@/i18n/routing';
import {clearAuth, getUserName} from '@/lib/auth';
import {useAppLocale} from '@/components/AppProviders';

const languageOptions: Record<(typeof locales)[number], {label: string; flag: string}> = {
  en: {label: 'English', flag: '🇬🇧'},
  sv: {label: 'Svenska', flag: '🇸🇪'}
};

export default function AppTopBar() {
  const router = useRouter();
  const pathname = usePathname();
  const {locale, setLocale} = useAppLocale();
  const [name, setName] = useState<string | null>(null);

  useEffect(() => {
    setName(getUserName());
  }, [pathname]);

  const displayName = useMemo(() => {
    if (name?.trim()) {
      return name.trim();
    }
    return locale === 'sv' ? 'Anvandare' : 'User';
  }, [locale, name]);

  const onLocaleChange = (value: (typeof locales)[number]) => {
    setLocale(value);
  };

  const onLogout = () => {
    console.info('[auth-ui] logout');
    clearAuth();
    router.push('/login');
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
              <Avatar sx={{width: 30, height: 30}}>{displayName.charAt(0).toUpperCase()}</Avatar>
              <Typography variant="body2" className="user-name">{displayName}</Typography>
              <Button size="small" variant="outlined" onClick={onLogout}>Logout</Button>
            </Stack>
          )}
        </Stack>
      </Stack>
    </Box>
  );
}
