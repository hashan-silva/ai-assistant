import {NextResponse} from 'next/server';
import {
  CognitoIdentityProviderClient,
  SignUpCommand
} from '@aws-sdk/client-cognito-identity-provider';

export const runtime = 'nodejs';
export const maxDuration = 60;

type RegisterPayload = {
  email?: string;
  phone?: string;
  firstName?: string;
  lastName?: string;
  password?: string;
};

const getClient = () => {
  const region = process.env.COGNITO_REGION;
  const clientId = process.env.COGNITO_USER_POOL_CLIENT_ID;
  if (!region || !clientId) {
    throw new Error('Cognito is not configured');
  }
  return {
    client: new CognitoIdentityProviderClient({region}),
    clientId
  };
};

export async function POST(request: Request) {
  let payload: RegisterPayload;
  try {
    payload = await request.json();
  } catch {
    return NextResponse.json({error: 'Invalid JSON payload'}, {status: 400});
  }

  if (!payload.password || !payload.firstName || !payload.lastName) {
    return NextResponse.json({error: 'Missing required fields'}, {status: 400});
  }

  const uniqueIdentifier = payload.email?.trim() || payload.phone?.trim();
  if (!uniqueIdentifier) {
    return NextResponse.json({error: 'Email or phone number is required'}, {status: 400});
  }

  const userAttributes = [
    payload.email ? {Name: 'email', Value: payload.email} : null,
    payload.phone ? {Name: 'phone_number', Value: payload.phone} : null,
    {Name: 'given_name', Value: payload.firstName},
    {Name: 'family_name', Value: payload.lastName}
  ].filter((attribute): attribute is {Name: string; Value: string} => attribute !== null);

  try {
    const {client, clientId} = getClient();
    const result = await client.send(new SignUpCommand({
      ClientId: clientId,
      Username: uniqueIdentifier,
      Password: payload.password,
      UserAttributes: userAttributes
    }));

    if (!result.UserSub) {
      return NextResponse.json({error: 'Unable to create account'}, {status: 400});
    }

    return NextResponse.json({ok: true});
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Register failed';
    return NextResponse.json({error: message}, {status: 400});
  }
}
