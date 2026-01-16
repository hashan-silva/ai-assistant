import {createRemoteJWKSet, jwtVerify} from 'jose';
import {NextResponse} from 'next/server';
import type {NextRequest} from 'next/server';

const PUBLIC_PATHS = ['/login', '/register'];

const region = process.env.COGNITO_REGION;
const userPoolId = process.env.COGNITO_USER_POOL_ID;
const clientId = process.env.COGNITO_USER_POOL_CLIENT_ID;
const issuer = region && userPoolId
  ? `https://cognito-idp.${region}.amazonaws.com/${userPoolId}`
  : null;
const jwks = issuer ? createRemoteJWKSet(new URL(`${issuer}/.well-known/jwks.json`)) : null;

const verifyToken = async (token: string) => {
  if (!issuer || !jwks || !clientId) {
    throw new Error('Missing Cognito config');
  }
  const {payload} = await jwtVerify(token, jwks, {issuer});
  const audience = typeof payload.aud === 'string' ? payload.aud : undefined;
  const clientClaim = typeof payload.client_id === 'string' ? payload.client_id : undefined;
  if (audience !== clientId && clientClaim !== clientId) {
    throw new Error('Invalid client');
  }
  return payload;
};

export async function middleware(request: NextRequest) {
  const {pathname} = request.nextUrl;
  if (PUBLIC_PATHS.includes(pathname)) {
    return NextResponse.next();
  }

  const token = request.cookies.get('helpclub_access_token');
  if (!token) {
    const url = request.nextUrl.clone();
    url.pathname = '/login';
    return NextResponse.redirect(url);
  }

  try {
    await verifyToken(token.value);
  } catch {
    const url = request.nextUrl.clone();
    url.pathname = '/login';
    const response = NextResponse.redirect(url);
    response.cookies.delete('helpclub_access_token');
    response.cookies.delete('helpclub_id_token');
    response.cookies.delete('helpclub_refresh_token');
    return response;
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/((?!api|_next|favicon.ico).*)']
};
