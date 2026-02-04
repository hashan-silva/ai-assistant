'use client';

import Link from 'next/link';
import {Box, Button, Card, Stack, Typography} from '@mui/material';
export default function HomePage() {
  return (
    <Box className="simple-landing">
      <Card className="simple-landing-card">
        <Stack spacing={3}>
          <Typography variant="h2" className="simple-landing-title">
            Simple chat, powered by Ollama
          </Typography>
          <Typography variant="body1" color="text.secondary">
            Ask a question and get a fast response from your local model.
          </Typography>
          <Button
            component={Link}
            href="/chat"
            variant="contained"
            className="simple-landing-cta"
          >
            Open chat
          </Button>
        </Stack>
      </Card>
    </Box>
  );
}
