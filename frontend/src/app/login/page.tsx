'use client';

import Link from 'next/link';
import {FormEvent, useState} from 'react';
import {useRouter} from 'next/navigation';
import {useTranslations} from 'next-intl';
import {Alert, Box, Button, Card, Stack, TextField, Typography} from '@mui/material';

export default function LoginPage() {
  const router = useRouter();
  const t = useTranslations('auth');
  const [identifier, setIdentifier] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const onSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError(null);
    setIsLoading(true);

    if (!identifier || !password) {
      setError(t('errors.missingCredentials'));
      setIsLoading(false);
      return;
    }

    try {
      const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify({identifier, password})
      });
      let payload: {error?: string} | null = null;
      try {
        payload = await response.json();
      } catch {
        payload = null;
      }
      if (!response.ok) {
        setError(payload?.error || t('errors.loginFailed'));
        return;
      }
      router.push('/chat');
      router.refresh();
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Unable to login right now';
      setError(message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Box className="auth-layout">
      <Card className="auth-card">
        <Stack component="form" spacing={2} onSubmit={onSubmit}>
          <Typography variant="h4">{t('loginTitle')}</Typography>
          <Typography variant="body2" color="text.secondary">
            {t('loginSubtitle')}
          </Typography>
          {error && <Alert severity="error">{error}</Alert>}
          <TextField
            label={t('identifier')}
            value={identifier}
            onChange={(event) => setIdentifier(event.target.value)}
            required
            fullWidth
          />
          <TextField
            label={t('password')}
            type="password"
            value={password}
            onChange={(event) => setPassword(event.target.value)}
            required
            fullWidth
          />
          <Button type="submit" variant="contained" disabled={isLoading}>
            {isLoading ? t('signingIn') : t('loginCta')}
          </Button>
          <Typography variant="body2" color="text.secondary">
            {t('needAccount')} <Link href="/register">{t('registerCta')}</Link>
          </Typography>
        </Stack>
      </Card>
    </Box>
  );
}
