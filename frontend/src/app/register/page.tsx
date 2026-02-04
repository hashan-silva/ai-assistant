'use client';

import Link from 'next/link';
import {FormEvent, useState} from 'react';
import {useRouter} from 'next/navigation';
import {Alert, Box, Button, Card, Stack, TextField, Typography} from '@mui/material';

export default function RegisterPage() {
  const router = useRouter();
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const onSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError(null);
    setIsLoading(true);

    try {
      const response = await fetch('/api/auth/register', {
        method: 'POST',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify({firstName, lastName, email, phone, password})
      });
      const payload = await response.json().catch(() => ({}));
      if (!response.ok) {
        setError(payload.error || 'Registration failed');
        return;
      }
      router.push('/login');
    } catch {
      setError('Unable to register right now');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Box className="auth-layout">
      <Card className="auth-card">
        <Stack component="form" spacing={2} onSubmit={onSubmit}>
          <Typography variant="h4">Create account</Typography>
          <Typography variant="body2" color="text.secondary">
            Use email or phone number as your login identifier.
          </Typography>
          {error && <Alert severity="error">{error}</Alert>}
          <TextField label="First name" value={firstName} onChange={(event) => setFirstName(event.target.value)} required fullWidth />
          <TextField label="Last name" value={lastName} onChange={(event) => setLastName(event.target.value)} required fullWidth />
          <TextField label="Email (optional)" type="email" value={email} onChange={(event) => setEmail(event.target.value)} fullWidth />
          <TextField label="Phone (optional)" value={phone} onChange={(event) => setPhone(event.target.value)} fullWidth />
          <TextField label="Password" type="password" value={password} onChange={(event) => setPassword(event.target.value)} required fullWidth />
          <Button type="submit" variant="contained" disabled={isLoading}>
            {isLoading ? 'Creating account...' : 'Create account'}
          </Button>
          <Typography variant="body2" color="text.secondary">
            Already have an account? <Link href="/login">Sign in</Link>
          </Typography>
        </Stack>
      </Card>
    </Box>
  );
}
