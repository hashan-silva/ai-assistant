'use client';

import Link from 'next/link';
import {FormEvent, useState} from 'react';
import {useRouter} from 'next/navigation';
import {
  CognitoIdentityProviderClient,
  InitiateAuthCommand
} from '@aws-sdk/client-cognito-identity-provider';
import {Alert, Box, Button, Card, Stack, TextField, Typography} from '@mui/material';
import {persistTokens} from '@/lib/auth';

export default function LoginPage() {
  const router = useRouter();
  const [identifier, setIdentifier] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const onSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError(null);
    setIsLoading(true);

    const region = process.env.NEXT_PUBLIC_COGNITO_REGION;
    const clientId = process.env.NEXT_PUBLIC_COGNITO_USER_POOL_CLIENT_ID;
    if (!region || !clientId) {
      setError('Cognito is not configured');
      setIsLoading(false);
      return;
    }

    try {
      const client = new CognitoIdentityProviderClient({region});
      const result = await client.send(new InitiateAuthCommand({
        AuthFlow: 'USER_PASSWORD_AUTH',
        ClientId: clientId,
        AuthParameters: {
          USERNAME: identifier,
          PASSWORD: password
        }
      }));
      const auth = result.AuthenticationResult;
      if (!auth?.AccessToken) {
        setError('Login failed');
        return;
      }
      persistTokens({
        accessToken: auth.AccessToken,
        idToken: auth.IdToken,
        refreshToken: auth.RefreshToken
      });
      router.push('/chat');
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Unable to login right now';
      setError(message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Box className="auth-layout">
      <Card className="auth-card">
        <Stack component="form" spacing={2} onSubmit={onSubmit}>
          <Typography variant="h4">Sign in</Typography>
          <Typography variant="body2" color="text.secondary">
            Use your email or phone number.
          </Typography>
          {error && <Alert severity="error">{error}</Alert>}
          <TextField
            label="Email or phone number"
            value={identifier}
            onChange={(event) => setIdentifier(event.target.value)}
            required
            fullWidth
          />
          <TextField
            label="Password"
            type="password"
            value={password}
            onChange={(event) => setPassword(event.target.value)}
            required
            fullWidth
          />
          <Button type="submit" variant="contained" disabled={isLoading}>
            {isLoading ? 'Signing in...' : 'Sign in'}
          </Button>
          <Typography variant="body2" color="text.secondary">
            Need an account? <Link href="/register">Register</Link>
          </Typography>
        </Stack>
      </Card>
    </Box>
  );
}
