import {Card, CardContent, Grid, Stack, Typography} from '@mui/material';
import {getTranslations} from 'next-intl/server';
import SectionHeader from '@/components/SectionHeader';

const metricKeys = ['engagement', 'continuity', 'capacity', 'wellbeing'] as const;

export default async function ImpactPage() {
  const t = await getTranslations('impact');

  return (
    <Stack spacing={4}>
      <SectionHeader title={t('title')} subtitle={t('subtitle')} />
      <Grid container spacing={3}>
        {metricKeys.map((key) => (
          <Grid item xs={12} md={6} key={key}>
            <Card className="stat-card">
              <CardContent>
                <Stack spacing={1.5}>
                  <Typography variant="h4">{t(`metrics.${key}.title`)}</Typography>
                  <Typography variant="h3" color="primary">
                    {t(`metrics.${key}.value`)}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    {t(`metrics.${key}.body`)}
                  </Typography>
                </Stack>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>
    </Stack>
  );
}
