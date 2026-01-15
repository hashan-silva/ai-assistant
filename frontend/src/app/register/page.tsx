'use client';

import {ChangeEvent, useState} from 'react';
import Link from 'next/link';
import {useRouter} from 'next/navigation';
import {
  Box,
  Button,
  Card,
  MenuItem,
  Stack,
  TextField,
  Typography
} from '@mui/material';
import {SignUpCommand} from '@aws-sdk/client-cognito-identity-provider';
import {useTranslations} from 'next-intl';
import {getCognitoConfig} from '@/lib/cognito';

const profileOptions = ['job_seeker', 'job_poster', 'both'] as const;

export default function RegisterPage() {
  const t = useTranslations('auth');
  const router = useRouter();
  const [form, setForm] = useState({
    personalNumber: '',
    email: '',
    phone: '',
    firstName: '',
    lastName: '',
    city: '',
    profileType: profileOptions[0],
    password: ''
  });
  const [status, setStatus] = useState<'idle' | 'loading' | 'success'>('idle');
  const [error, setError] = useState<string | null>(null);

  const updateField = (key: keyof typeof form) => (event: ChangeEvent<HTMLInputElement>) =>
    setForm((prev) => ({...prev, [key]: event.target.value}));

  const handleSubmit = async () => {
    if (status === 'loading') {
      return;
    }
    setStatus('loading');
    setError(null);

    try {
      const {client, clientId} = getCognitoConfig();
      const result = await client.send(new SignUpCommand({
        ClientId: clientId,
        Username: form.personalNumber.trim(),
        Password: form.password,
        UserAttributes: [
          {Name: 'email', Value: form.email.trim()},
          {Name: 'phone_number', Value: form.phone.trim()},
          {Name: 'given_name', Value: form.firstName.trim()},
          {Name: 'family_name', Value: form.lastName.trim()},
          {Name: 'address', Value: form.city.trim()},
          {Name: 'custom:profile_type', Value: form.profileType}
        ]
      }));

      if (!result.UserSub) {
        throw new Error(t('errors.registerFailed'));
      }

      setStatus('success');
      router.push('/login');
    } catch (err) {
      setStatus('idle');
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError(t('errors.registerFailed'));
      }
    }
  };

  return (
    <Box className="auth-layout">
      <Card className="auth-card">
        <Stack spacing={3}>
          <Stack spacing={1}>
            <Typography variant="h3">{t('registerTitle')}</Typography>
            <Typography variant="body2" color="text.secondary">
              {t('registerSubtitle')}
            </Typography>
          </Stack>
          <Stack spacing={2}>
            <TextField
              label={t('personalNumber')}
              value={form.personalNumber}
              onChange={updateField('personalNumber')}
              autoComplete="username"
            />
            <TextField
              label={t('email')}
              value={form.email}
              onChange={updateField('email')}
              type="email"
              autoComplete="email"
            />
            <TextField
              label={t('phone')}
              helperText={t('phoneHint')}
              value={form.phone}
              onChange={updateField('phone')}
              autoComplete="tel"
            />
            <Stack direction={{xs: 'column', sm: 'row'}} spacing={2}>
              <TextField
                label={t('firstName')}
                value={form.firstName}
                onChange={updateField('firstName')}
                autoComplete="given-name"
                fullWidth
              />
              <TextField
                label={t('lastName')}
                value={form.lastName}
                onChange={updateField('lastName')}
                autoComplete="family-name"
                fullWidth
              />
            </Stack>
            <TextField
              label={t('city')}
              value={form.city}
              onChange={updateField('city')}
              autoComplete="address-level2"
            />
            <TextField
              label={t('profileType')}
              value={form.profileType}
              onChange={updateField('profileType')}
              select
            >
              {profileOptions.map((option) => (
                <MenuItem key={option} value={option}>
                  {t(`profileOptions.${option}`)}
                </MenuItem>
              ))}
            </TextField>
            <TextField
              label={t('password')}
              type="password"
              value={form.password}
              onChange={updateField('password')}
              autoComplete="new-password"
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
              {status === 'loading' ? t('loading') : t('registerCta')}
            </Button>
          </Stack>
          <Typography variant="body2" color="text.secondary">
            {t('haveAccount')}{' '}
            <Button component={Link} href="/login" size="small">
              {t('loginLink')}
            </Button>
          </Typography>
        </Stack>
      </Card>
    </Box>
  );
}
