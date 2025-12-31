import {Box, Button, Card, CardContent, Grid, Stack, Typography} from '@mui/material';
import {getTranslations} from 'next-intl/server';
import {Link} from '@/i18n/navigation';

export default async function HomePage() {
  const t = await getTranslations('home');
  const common = await getTranslations('common');

  const stats = [
    {key: 'members', value: '1 248'},
    {key: 'partners', value: '36'},
    {key: 'sessions', value: '312'},
    {key: 'satisfaction', value: '4.8/5'}
  ];

  const highlights = ['care', 'skills', 'partnerships'] as const;

  return (
    <Stack spacing={6}>
      <Box className="hero-panel">
        <Grid container spacing={4} alignItems="center">
          <Grid item xs={12} md={7}>
            <Stack spacing={3}>
              <Typography variant="h1">{t('heroTitle')}</Typography>
              <Typography variant="body1" color="text.secondary">
                {t('heroBody')}
              </Typography>
              <Stack direction={{xs: 'column', sm: 'row'}} spacing={2}>
                <Button
                  variant="contained"
                  size="large"
                  component={Link}
                  href="/support"
                >
                  {common('primaryAction')}
                </Button>
                <Button
                  variant="outlined"
                  size="large"
                  component={Link}
                  href="/programs"
                >
                  {common('secondaryAction')}
                </Button>
              </Stack>
            </Stack>
          </Grid>
          <Grid item xs={12} md={5}>
            <Card className="hero-card">
              <CardContent>
                <Stack spacing={2}>
                  <Typography variant="h4">{t('spotlightTitle')}</Typography>
                  <Typography variant="body2" color="text.secondary">
                    {t('spotlightBody')}
                  </Typography>
                  <Box className="hero-divider" />
                  <Typography variant="subtitle2" color="text.secondary">
                    {t('scheduleTitle')}
                  </Typography>
                  <Stack spacing={1}>
                    <Typography variant="body2">{t('scheduleItems.one')}</Typography>
                    <Typography variant="body2">{t('scheduleItems.two')}</Typography>
                    <Typography variant="body2">{t('scheduleItems.three')}</Typography>
                  </Stack>
                </Stack>
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      </Box>

      <Box>
        <Typography variant="h3" sx={{mb: 3}}>
          {t('statsTitle')}
        </Typography>
        <Grid container spacing={3}>
          {stats.map((stat) => (
            <Grid item xs={12} sm={6} md={3} key={stat.key}>
              <Card className="stat-card">
                <CardContent>
                  <Typography variant="h4">{stat.value}</Typography>
                  <Typography variant="body2" color="text.secondary">
                    {t(`stats.${stat.key}`)}
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      </Box>

      <Box>
        <Typography variant="h3" sx={{mb: 3}}>
          {t('highlightsTitle')}
        </Typography>
        <Grid container spacing={3}>
          {highlights.map((item) => (
            <Grid item xs={12} md={4} key={item}>
              <Card className="info-card">
                <CardContent>
                  <Typography variant="h4" sx={{mb: 1}}>
                    {t(`highlights.${item}.title`)}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    {t(`highlights.${item}.body`)}
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      </Box>
    </Stack>
  );
}
