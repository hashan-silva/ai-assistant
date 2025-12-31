import {Box, Typography} from '@mui/material';

export default function SectionHeader({
  title,
  subtitle
}: {
  title: string;
  subtitle?: string;
}) {
  return (
    <Box className="section-header">
      <Typography variant="h2">{title}</Typography>
      {subtitle ? (
        <Typography variant="body1" color="text.secondary">
          {subtitle}
        </Typography>
      ) : null}
    </Box>
  );
}
