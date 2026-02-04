import {NextResponse} from 'next/server';
import {
  CognitoIdentityProviderClient,
  InitiateAuthCommand
} from '@aws-sdk/client-cognito-identity-provider';

export const runtime = 'nodejs';
export const maxDuration = 60;

type LoginPayload = {
  identifier?: string;
  password?: string;
};

const setAuthCookies = (
  response: NextResponse,
  authResult: {AccessToken?: string; IdToken?: string; RefreshToken?: string}
) => {
  if (authResult.AccessToken) {
    response.cookies.set('ai-assistant_access_token', authResult.AccessToken, {
      httpOnly: true,
      sameSite: 'lax',
      path: '/'
    });
  }
  if (authResult.IdToken) {
    response.cookies.set('ai-assistant_id_token', authResult.IdToken, {
      httpOnly: true,
      sameSite: 'lax',
      path: '/'
    });
  }
  if (authResult.RefreshToken) {
    response.cookies.set('ai-assistant_refresh_token', authResult.RefreshToken, {
      httpOnly: true,
      sameSite: 'lax',
      path: '/'
    });
  }
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

  if (!payload.identifier || !payload.password) {
    return NextResponse.json({error: 'Email or phone number and password are required'}, {status: 400});
  }

  try {
    const {client, clientId} = getClient();
    const result = await client.send(new InitiateAuthCommand({
      AuthFlow: 'USER_PASSWORD_AUTH',
      ClientId: clientId,
      AuthParameters: {
        USERNAME: payload.identifier,
        PASSWORD: payload.password
      }
    }));

    const accessToken = result.AuthenticationResult?.AccessToken;
    if (!accessToken) {
      return NextResponse.json({error: 'No session returned from Cognito'}, {status: 401});
    }

    const response = NextResponse.json({ok: true});
    setAuthCookies(response, result.AuthenticationResult || {});
    return response;
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Login failed';
    return NextResponse.json({error: message}, {status: 401});
  }
}
