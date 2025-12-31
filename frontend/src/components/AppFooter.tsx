import {Box, Container, Link as MuiLink, Stack, Typography} from '@mui/material';
import {getTranslations} from 'next-intl/server';
import {Link} from '@/i18n/navigation';

export default async function AppFooter() {
  const t = await getTranslations('footer');

  return (
    <Box component="footer" className="app-footer">
      <Container maxWidth="lg">
        <Stack spacing={2}>
          <Typography variant="h6">{t('title')}</Typography>
          <Typography variant="body2" color="text.secondary">
            {t('body')}
          </Typography>
          <Stack direction={{xs: 'column', sm: 'row'}} spacing={2}>
            <MuiLink component={Link} href="/support" underline="none">
              {t('links.contact')}
            </MuiLink>
            <MuiLink component={Link} href="/" underline="none">
              {t('links.privacy')}
            </MuiLink>
            <MuiLink component={Link} href="/" underline="none">
              {t('links.terms')}
            </MuiLink>
          </Stack>
        </Stack>
      </Container>
    </Box>
  );
}
