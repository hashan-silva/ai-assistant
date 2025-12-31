'use client';

import {useState} from 'react';
import {
  AppBar,
  Box,
  Button,
  Drawer,
  IconButton,
  Stack,
  Toolbar,
  Typography
} from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';
import {useTranslations} from 'next-intl';
import {Link} from '@/i18n/navigation';
import {navItems} from '@/lib/navigation';
import LanguageSwitcher from '@/components/LanguageSwitcher';

export default function AppHeader() {
  const t = useTranslations();
  const [open, setOpen] = useState(false);

  const navLinks = navItems.map((item) => (
    <Button
      key={item.key}
      component={Link}
      href={item.href}
      color="inherit"
      sx={{textTransform: 'none', fontWeight: 500}}
    >
      {t(`nav.${item.key}`)}
    </Button>
  ));

  const drawerLinks = navItems.map((item) => (
    <Button
      key={item.key}
      component={Link}
      href={item.href}
      color="inherit"
      onClick={() => setOpen(false)}
      sx={{justifyContent: 'flex-start', textTransform: 'none', fontWeight: 500}}
    >
      {t(`nav.${item.key}`)}
    </Button>
  ));

  return (
    <AppBar
      position="sticky"
      elevation={0}
      sx={{
        backgroundColor: 'rgba(255, 255, 255, 0.9)',
        color: 'text.primary',
        backdropFilter: 'blur(12px)',
        borderBottom: '1px solid rgba(12, 48, 70, 0.08)'
      }}
    >
      <Toolbar sx={{minHeight: 72}}>
        <Stack direction="row" alignItems="center" spacing={1.5} sx={{flexGrow: 1}}>
          <Box className="brand-dot" />
          <Typography variant="h6" sx={{fontWeight: 600}}>
            {t('app.name')}
          </Typography>
          <Typography
            variant="body2"
            sx={{
              color: 'text.secondary',
              display: {xs: 'none', md: 'block'}
            }}
          >
            {t('app.tagline')}
          </Typography>
        </Stack>

        <Box sx={{display: {xs: 'none', lg: 'flex'}, gap: 1}}>{navLinks}</Box>

        <Box sx={{display: {xs: 'none', md: 'flex'}, ml: 2}}>
          <LanguageSwitcher />
        </Box>

        <IconButton
          onClick={() => setOpen(true)}
          sx={{display: {xs: 'inline-flex', lg: 'none'}, ml: 1}}
          aria-label="Open navigation"
        >
          <MenuIcon />
        </IconButton>
      </Toolbar>

      <Drawer
        anchor="right"
        open={open}
        onClose={() => setOpen(false)}
        PaperProps={{sx: {width: 280, p: 3}}}
      >
        <Stack spacing={2}>
          <Typography variant="h6">{t('app.name')}</Typography>
          <Stack spacing={1}>{drawerLinks}</Stack>
          <LanguageSwitcher />
        </Stack>
      </Drawer>
    </AppBar>
  );
}
