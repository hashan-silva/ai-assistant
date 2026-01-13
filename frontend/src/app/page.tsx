'use client';

import Link from 'next/link';
import {Box, Button, Card, Chip, Stack, Typography} from '@mui/material';
import {useTranslations} from 'next-intl';

export default function HomePage() {
  const t = useTranslations('landing');

  const roles = [
    {
      key: 'seeker',
      tag: t('roles.seeker.tag'),
      title: t('roles.seeker.title'),
      body: t('roles.seeker.body'),
      cta: t('roles.seeker.cta'),
      href: '/chat?role=job-seeker',
      className: 'role-card seeker'
    },
    {
      key: 'poster',
      tag: t('roles.poster.tag'),
      title: t('roles.poster.title'),
      body: t('roles.poster.body'),
      cta: t('roles.poster.cta'),
      href: '/chat?role=job-poster',
      className: 'role-card poster'
    }
  ];

  return (
    <Box className="role-landing">
      <Box className="role-hero">
        <Stack spacing={3}>
          <Chip label={t('eyebrow')} className="role-chip" />
          <Typography variant="h2" className="role-title">
            {t('title')}
          </Typography>
          <Typography variant="body1" className="role-subtitle">
            {t('subtitle')}
          </Typography>
        </Stack>
      </Box>

      <Box className="role-grid">
        {roles.map((role) => (
          <Card key={role.key} className={role.className}>
            <Stack spacing={2}>
              <Chip label={role.tag} className="role-card-tag" />
              <Typography variant="h4">{role.title}</Typography>
              <Typography variant="body2" color="text.secondary">
                {role.body}
              </Typography>
              <Button
                component={Link}
                href={role.href}
                variant="contained"
                className="role-card-cta"
              >
                {role.cta}
              </Button>
            </Stack>
          </Card>
        ))}
      </Box>
    </Box>
  );
}
