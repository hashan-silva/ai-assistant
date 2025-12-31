import {Card, CardContent, Grid, Stack, Typography} from '@mui/material';
import {getTranslations} from 'next-intl/server';
import SectionHeader from '@/components/SectionHeader';

const eventKeys = ['circle', 'makers', 'outdoor'] as const;

export default async function CommunityPage() {
  const t = await getTranslations('community');

  return (
    <Stack spacing={4}>
      <SectionHeader title={t('title')} subtitle={t('subtitle')} />
      <Grid container spacing={3}>
        {eventKeys.map((key) => (
          <Grid item xs={12} md={4} key={key}>
            <Card className="info-card">
              <CardContent>
                <Stack spacing={2}>
                  <Typography variant="h4">{t(`events.${key}.title`)}</Typography>
                  <Typography variant="body2" color="text.secondary">
                    {t(`events.${key}.body`)}
                  </Typography>
                  <Typography variant="subtitle2" color="primary">
                    {t(`events.${key}.time`)}
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
