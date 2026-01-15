import {NextResponse} from 'next/server';
import {
  CognitoIdentityProviderClient,
  InitiateAuthCommand
} from '@aws-sdk/client-cognito-identity-provider';

export const runtime = 'nodejs';
export const maxDuration = 60;

type LoginPayload = {
  personalNumber?: string;
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
  let payload: LoginPayload;
  try {
    payload = await request.json();
  } catch {
    return NextResponse.json({error: 'Invalid JSON payload'}, {status: 400});
  }

  if (!payload.personalNumber || !payload.password) {
    return NextResponse.json({error: 'Personal number and password are required'}, {status: 400});
  }

  try {
    const {client, clientId} = getClient();
    const result = await client.send(new InitiateAuthCommand({
      AuthFlow: 'USER_PASSWORD_AUTH',
      ClientId: clientId,
      AuthParameters: {
        USERNAME: payload.personalNumber,
        PASSWORD: payload.password
      }
    }));

    const accessToken = result.AuthenticationResult?.AccessToken;
    if (!accessToken) {
      return NextResponse.json({error: 'No session returned from Cognito'}, {status: 401});
    }

    const response = NextResponse.json({ok: true});
    response.cookies.set('helpclub_access_token', accessToken, {
      httpOnly: true,
      sameSite: 'lax',
      path: '/'
    });
    if (result.AuthenticationResult?.IdToken) {
      response.cookies.set('helpclub_id_token', result.AuthenticationResult.IdToken, {
        httpOnly: true,
        sameSite: 'lax',
        path: '/'
      });
    }
    if (result.AuthenticationResult?.RefreshToken) {
      response.cookies.set('helpclub_refresh_token', result.AuthenticationResult.RefreshToken, {
        httpOnly: true,
        sameSite: 'lax',
        path: '/'
      });
    }
    return response;
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Login failed';
    return NextResponse.json({error: message}, {status: 401});
  }
}
