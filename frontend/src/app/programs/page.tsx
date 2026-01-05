import {Card, CardContent, Chip, Grid, Stack, Typography} from '@mui/material';
import {getTranslations} from 'next-intl/server';
import SectionHeader from '@/components/SectionHeader';

const programKeys = ['mentorship', 'language', 'wellbeing', 'career'] as const;

export default async function ProgramsPage() {
  const t = await getTranslations('programs');

  return (
    <Stack spacing={4}>
      <SectionHeader title={t('title')} subtitle={t('subtitle')} />
      <Grid container spacing={3}>
        {programKeys.map((key) => (
          <Grid item xs={12} md={6} key={key}>
            <Card className="info-card">
              <CardContent>
                <Stack spacing={2}>
                  <Stack direction="row" justifyContent="space-between" alignItems="center">
                    <Typography variant="h4">{t(`cards.${key}.title`)}</Typography>
                    <Chip label={t(`cards.${key}.tag`)} color="secondary" size="small" />
                  </Stack>
                  <Typography variant="body2" color="text.secondary">
                    {t(`cards.${key}.body`)}
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
