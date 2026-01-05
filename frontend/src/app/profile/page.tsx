import {Card, CardContent, Grid, Stack, Typography} from '@mui/material';
import {getTranslations} from 'next-intl/server';
import SectionHeader from '@/components/SectionHeader';

export default async function ProfilePage() {
  const t = await getTranslations('profile');

  return (
    <Stack spacing={4}>
      <SectionHeader title={t('title')} subtitle={t('subtitle')} />
      <Grid container spacing={3}>
        <Grid item xs={12} md={6}>
          <Card className="info-card">
            <CardContent>
              <Stack spacing={2}>
                <Typography variant="h4">{t('summary.nameLabel')}</Typography>
                <Typography variant="body1">{t('summary.nameValue')}</Typography>
                <Typography variant="subtitle2" color="text.secondary">
                  {t('summary.regionLabel')}
                </Typography>
                <Typography variant="body2">{t('summary.regionValue')}</Typography>
                <Typography variant="subtitle2" color="text.secondary">
                  {t('summary.statusLabel')}
                </Typography>
                <Typography variant="body2">{t('summary.statusValue')}</Typography>
              </Stack>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} md={6}>
          <Card className="info-card">
            <CardContent>
              <Stack spacing={2}>
                <Typography variant="h4">{t('nextSteps.title')}</Typography>
                <Stack spacing={1.5}>
                  <Typography variant="body2">• {t('nextSteps.one')}</Typography>
                  <Typography variant="body2">• {t('nextSteps.two')}</Typography>
                  <Typography variant="body2">• {t('nextSteps.three')}</Typography>
                </Stack>
              </Stack>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Stack>
  );
}
