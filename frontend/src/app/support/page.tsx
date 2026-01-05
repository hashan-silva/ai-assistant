import {
  Box,
  Button,
  Card,
  CardContent,
  Grid,
  Stack,
  Typography
} from '@mui/material';
import {getTranslations} from 'next-intl/server';
import SectionHeader from '@/components/SectionHeader';

const resourceKeys = ['care', 'legal', 'funding'] as const;

export default async function SupportPage() {
  const t = await getTranslations('support');

  return (
    <Stack spacing={4}>
      <SectionHeader title={t('title')} subtitle={t('subtitle')} />
      <Grid container spacing={3}>
        {resourceKeys.map((key) => (
          <Grid item xs={12} md={4} key={key}>
            <Card className="info-card">
              <CardContent>
                <Stack spacing={2}>
                  <Typography variant="h4">{t(`resources.${key}.title`)}</Typography>
                  <Typography variant="body2" color="text.secondary">
                    {t(`resources.${key}.body`)}
                  </Typography>
                  <Button variant="outlined" size="small">
                    {t(`resources.${key}.cta`)}
                  </Button>
                </Stack>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>

      <Box className="contact-banner">
        <Stack spacing={2}>
          <Typography variant="h3">{t('contact.title')}</Typography>
          <Typography variant="body1" color="text.secondary">
            {t('contact.body')}
          </Typography>
          <Button variant="contained">hello@helpclub.se</Button>
        </Stack>
      </Box>
    </Stack>
  );
}
