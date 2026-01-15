'use client';

import {useState} from 'react';
import Link from 'next/link';
import {useRouter} from 'next/navigation';
import {
  Box,
  Button,
  Card,
  Stack,
  TextField,
  Typography
} from '@mui/material';
import {useTranslations} from 'next-intl';

export default function LoginPage() {
  const t = useTranslations('auth');
  const router = useRouter();
  const [personalNumber, setPersonalNumber] = useState('');
  const [password, setPassword] = useState('');
  const [status, setStatus] = useState<'idle' | 'loading' | 'success'>('idle');
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async () => {
    if (!personalNumber.trim() || !password.trim() || status === 'loading') {
      return;
    }
    setStatus('loading');
    setError(null);

    try {
      const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify({
          personalNumber: personalNumber.trim(),
          password
        })
      });
      let payload: {error?: string} | null = null;
      try {
        payload = await response.json();
      } catch {
        payload = null;
      }
      if (!response.ok) {
        throw new Error(payload?.error || t('errors.loginFailed'));
      }
      setStatus('success');
      router.push('/chat');
    } catch (err) {
      setStatus('idle');
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError(t('errors.loginFailed'));
      }
    }
  };

  return (
    <Box className="auth-layout">
      <Card className="auth-card">
        <Stack spacing={3}>
          <Stack spacing={1}>
            <Typography variant="h3">{t('loginTitle')}</Typography>
            <Typography variant="body2" color="text.secondary">
              {t('loginSubtitle')}
            </Typography>
          </Stack>
          <Stack spacing={2}>
            <TextField
              label={t('personalNumber')}
              value={personalNumber}
              onChange={(event) => setPersonalNumber(event.target.value)}
              autoComplete="username"
            />
            <TextField
              label={t('password')}
              type="password"
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              autoComplete="current-password"
            />
            {error && (
              <Typography variant="body2" color="error">
                {error}
              </Typography>
            )}
            <Button
              variant="contained"
              onClick={handleSubmit}
              disabled={status === 'loading'}
            >
              {status === 'loading' ? t('loading') : t('loginCta')}
            </Button>
          </Stack>
          <Typography variant="body2" color="text.secondary">
            {t('noAccount')}{' '}
            <Button component={Link} href="/register" size="small">
              {t('registerLink')}
            </Button>
          </Typography>
        </Stack>
      </Card>
    </Box>
  );
}
