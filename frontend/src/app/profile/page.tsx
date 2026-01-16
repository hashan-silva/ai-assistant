'use client';

import {ChangeEvent, useEffect, useState} from 'react';
import {
  Box,
  Button,
  Card,
  CircularProgress,
  MenuItem,
  Stack,
  TextField,
  Typography
} from '@mui/material';
import {useTranslations} from 'next-intl';

const profileOptions = ['job_seeker', 'job_poster', 'both'] as const;

type ProfileForm = {
  personalNumber: string;
  email: string;
  phone: string;
  firstName: string;
  lastName: string;
  city: string;
  profileType: (typeof profileOptions)[number] | '';
};

const emptyForm: ProfileForm = {
  personalNumber: '',
  email: '',
  phone: '',
  firstName: '',
  lastName: '',
  city: '',
  profileType: ''
};

export default function ProfilePage() {
  const t = useTranslations('myProfile');
  const tAuth = useTranslations('auth');
  const [form, setForm] = useState<ProfileForm>(emptyForm);
  const [loading, setLoading] = useState(true);
  const [status, setStatus] = useState<'idle' | 'loading' | 'success'>('idle');
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let active = true;
    const loadProfile = async () => {
      setLoading(true);
      setError(null);
      try {
        const response = await fetch('/api/profile');
        const payload = await response.json();
        if (!response.ok) {
          throw new Error(payload?.error || t('loadError'));
        }
        if (active) {
          const incomingType = payload.profile?.profileType ?? '';
          const safeProfileType = profileOptions.includes(
            incomingType as (typeof profileOptions)[number]
          )
            ? (incomingType as (typeof profileOptions)[number])
            : '';
          setForm({
            personalNumber: payload.profile?.personalNumber ?? '',
            email: payload.profile?.email ?? '',
            phone: payload.profile?.phone ?? '',
            firstName: payload.profile?.firstName ?? '',
            lastName: payload.profile?.lastName ?? '',
            city: payload.profile?.city ?? '',
            profileType: safeProfileType
          });
        }
      } catch (err) {
        if (active) {
          if (err instanceof Error) {
            setError(err.message);
          } else {
            setError(t('loadError'));
          }
        }
      } finally {
        if (active) {
          setLoading(false);
        }
      }
    };

    loadProfile();

    return () => {
      active = false;
    };
  }, [t]);

  const updateField = (key: keyof ProfileForm) => (event: ChangeEvent<HTMLInputElement>) => {
    setStatus('idle');
    setError(null);
    setForm((prev) => ({...prev, [key]: event.target.value}));
  };

  const handleSave = async () => {
    if (status === 'loading') {
      return;
    }
    setStatus('loading');
    setError(null);

    try {
      const response = await fetch('/api/profile', {
        method: 'PUT',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify({
          email: form.email.trim(),
          phone: form.phone.trim(),
          firstName: form.firstName.trim(),
          lastName: form.lastName.trim(),
          city: form.city.trim(),
          profileType: form.profileType
        })
      });
      const payload = await response.json();
      if (!response.ok) {
        throw new Error(payload?.error || t('saveError'));
      }
      setForm({
        personalNumber: payload.profile?.personalNumber ?? form.personalNumber,
        email: payload.profile?.email ?? form.email,
        phone: payload.profile?.phone ?? form.phone,
        firstName: payload.profile?.firstName ?? form.firstName,
        lastName: payload.profile?.lastName ?? form.lastName,
        city: payload.profile?.city ?? form.city,
        profileType: payload.profile?.profileType ?? form.profileType
      });
      setStatus('success');
    } catch (err) {
      setStatus('idle');
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError(t('saveError'));
      }
    }
  };

  return (
    <Box className="profile-layout">
      <Box className="profile-header">
        <Stack spacing={1}>
          <Typography variant="h3">{t('title')}</Typography>
          <Typography variant="body2" color="text.secondary">
            {t('subtitle')}
          </Typography>
        </Stack>
      </Box>

      <Card className="profile-card">
        <Stack spacing={3}>
          <Stack spacing={1}>
            <Typography variant="h5">{t('sectionTitle')}</Typography>
            <Typography variant="body2" color="text.secondary">
              {t('sectionBody')}
            </Typography>
          </Stack>

          {loading ? (
            <Box className="profile-loading">
              <CircularProgress size={32} />
            </Box>
          ) : (
            <Stack spacing={2} className="profile-form">
              <TextField
                label={tAuth('personalNumber')}
                value={form.personalNumber}
                helperText={t('personalNumberHint')}
                disabled
              />
              <TextField
                label={tAuth('email')}
                value={form.email}
                onChange={updateField('email')}
                type="email"
                autoComplete="email"
              />
              <TextField
                label={tAuth('phone')}
                helperText={tAuth('phoneHint')}
                value={form.phone}
                onChange={updateField('phone')}
                autoComplete="tel"
              />
              <Stack direction={{xs: 'column', sm: 'row'}} spacing={2}>
                <TextField
                  label={tAuth('firstName')}
                  value={form.firstName}
                  onChange={updateField('firstName')}
                  autoComplete="given-name"
                  fullWidth
                />
                <TextField
                  label={tAuth('lastName')}
                  value={form.lastName}
                  onChange={updateField('lastName')}
                  autoComplete="family-name"
                  fullWidth
                />
              </Stack>
              <TextField
                label={tAuth('city')}
                value={form.city}
                onChange={updateField('city')}
                autoComplete="address-level2"
              />
              <TextField
                label={tAuth('profileType')}
                value={form.profileType}
                onChange={updateField('profileType')}
                select
              >
                {profileOptions.map((option) => (
                  <MenuItem key={option} value={option}>
                    {tAuth(`profileOptions.${option}`)}
                  </MenuItem>
                ))}
              </TextField>
            </Stack>
          )}

          {error && (
            <Typography variant="body2" color="error">
              {error}
            </Typography>
          )}
          {status === 'success' && !error && (
            <Typography variant="body2" color="success.main">
              {t('saveSuccess')}
            </Typography>
          )}

          <Box className="profile-actions">
            <Button
              variant="contained"
              onClick={handleSave}
              disabled={loading || status === 'loading'}
            >
              {status === 'loading' ? t('saving') : t('saveCta')}
            </Button>
          </Box>
        </Stack>
      </Card>
    </Box>
  );
}
