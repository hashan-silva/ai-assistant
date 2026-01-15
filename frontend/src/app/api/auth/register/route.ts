import {NextResponse} from 'next/server';
import {
  CognitoIdentityProviderClient,
  SignUpCommand
} from '@aws-sdk/client-cognito-identity-provider';

export const runtime = 'nodejs';
export const maxDuration = 60;

type RegisterPayload = {
  personalNumber?: string;
  email?: string;
  phone?: string;
  firstName?: string;
  lastName?: string;
  city?: string;
  profileType?: string;
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

  if (!payload.personalNumber || !payload.password || !payload.email || !payload.phone
    || !payload.firstName || !payload.lastName || !payload.city || !payload.profileType) {
    return NextResponse.json({error: 'Missing required fields'}, {status: 400});
  }

  try {
    const {client, clientId} = getClient();
    const result = await client.send(new SignUpCommand({
      ClientId: clientId,
      Username: payload.personalNumber,
      Password: payload.password,
      UserAttributes: [
        {Name: 'email', Value: payload.email},
        {Name: 'phone_number', Value: payload.phone},
        {Name: 'given_name', Value: payload.firstName},
        {Name: 'family_name', Value: payload.lastName},
        {Name: 'address', Value: payload.city},
        {Name: 'custom:profile_type', Value: payload.profileType}
      ]
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
