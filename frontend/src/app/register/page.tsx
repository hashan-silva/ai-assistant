'use client';

import Link from 'next/link';
import {FormEvent, useState} from 'react';
import {useRouter} from 'next/navigation';
import {
  CognitoIdentityProviderClient,
  SignUpCommand
} from '@aws-sdk/client-cognito-identity-provider';
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

    const region = process.env.NEXT_PUBLIC_COGNITO_REGION;
    const clientId = process.env.NEXT_PUBLIC_COGNITO_USER_POOL_CLIENT_ID;
    if (!region || !clientId) {
      setError('Cognito is not configured');
      setIsLoading(false);
      return;
    }

    try {
      const uniqueIdentifier = email.trim() || phone.trim();
      if (!uniqueIdentifier) {
        setError('Email or phone number is required');
        return;
      }

      const userAttributes = [
        email ? {Name: 'email', Value: email.trim()} : null,
        phone ? {Name: 'phone_number', Value: phone.trim()} : null,
        {Name: 'given_name', Value: firstName.trim()},
        {Name: 'family_name', Value: lastName.trim()}
      ].filter((attribute): attribute is {Name: string; Value: string} => attribute !== null);

      const client = new CognitoIdentityProviderClient({region});
      const result = await client.send(new SignUpCommand({
        ClientId: clientId,
        Username: uniqueIdentifier,
        Password: password,
        UserAttributes: userAttributes
      }));
      if (!result.UserSub) {
        setError('Unable to create account');
        return;
      }
      router.push('/login');
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Unable to register right now';
      setError(message);
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
