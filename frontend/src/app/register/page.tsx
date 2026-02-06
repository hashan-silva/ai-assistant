'use client';

import Link from 'next/link';
import {FormEvent, useState} from 'react';
import {useRouter} from 'next/navigation';
import {useTranslations} from 'next-intl';
import {Alert, Box, Button, Card, Stack, TextField, Typography} from '@mui/material';

export default function RegisterPage() {
  const router = useRouter();
  const t = useTranslations('auth');
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const onSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError(null);
    setIsLoading(true);

    try {
      const uniqueIdentifier = email.trim() || phone.trim();
      if (!uniqueIdentifier) {
        setError(t('errors.identifierRequired'));
        return;
      }

      const requestId = crypto.randomUUID();
      const apiBaseUrl = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:8080';
      console.info('[auth-ui] register.start', {requestId, identifierLength: uniqueIdentifier.length});
      const response = await fetch(`${apiBaseUrl}/api/auth/register`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-Request-Id': requestId
        },
        body: JSON.stringify({
          email: email.trim() || undefined,
          phone: phone.trim() || undefined,
          firstName: firstName.trim(),
          lastName: lastName.trim(),
          password
        })
      }));
      let payload: {ok?: boolean; error?: string} | null = null;
      try {
        payload = await response.json();
      } catch {
        payload = null;
      }

      if (!response.ok || !payload?.ok) {
        setError(payload?.error || t('errors.registerFailed'));
        return;
      }
      console.info('[auth-ui] register.success', {requestId});
      router.push('/login');
    } catch (submitError) {
      const message = submitError instanceof Error ? submitError.message : 'Unable to register right now';
      console.error('[auth-ui] register.failed', {error: message});
      setError(message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Box className="auth-layout">
      <Card className="auth-card">
        <Stack component="form" spacing={2} onSubmit={onSubmit}>
          <Typography variant="h4">{t('registerTitle')}</Typography>
          <Typography variant="body2" color="text.secondary">
            {t('registerSubtitle')}
          </Typography>
          {error && <Alert severity="error">{error}</Alert>}
          <TextField label={t('firstName')} value={firstName} onChange={(event) => setFirstName(event.target.value)} required fullWidth />
          <TextField label={t('lastName')} value={lastName} onChange={(event) => setLastName(event.target.value)} required fullWidth />
          <TextField label={t('email')} type="email" value={email} onChange={(event) => setEmail(event.target.value)} fullWidth />
          <TextField label={t('phone')} value={phone} onChange={(event) => setPhone(event.target.value)} fullWidth />
          <TextField label={t('password')} type="password" value={password} onChange={(event) => setPassword(event.target.value)} required fullWidth />
          <Button type="submit" variant="contained" disabled={isLoading}>
            {isLoading ? t('creatingAccount') : t('registerCta')}
          </Button>
          <Typography variant="body2" color="text.secondary">
            {t('alreadyHaveAccount')} <Link href="/login">{t('loginCta')}</Link>
          </Typography>
        </Stack>
      </Card>
    </Box>
  );
}
