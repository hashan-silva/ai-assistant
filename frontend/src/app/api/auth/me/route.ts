import {decodeJwt} from 'jose';
import {NextResponse} from 'next/server';
import {cookies} from 'next/headers';

const resolveName = () => {
  const idToken = cookies().get('ai-assistant_id_token')?.value;
  if (!idToken) {
    return null;
  }

  try {
    const payload = decodeJwt(idToken) as Record<string, unknown>;
    const preferredName = typeof payload.name === 'string' ? payload.name : null;
    if (preferredName) {
      return preferredName;
    }

    const givenName = typeof payload.given_name === 'string' ? payload.given_name : '';
    const familyName = typeof payload.family_name === 'string' ? payload.family_name : '';
    const fullName = `${givenName} ${familyName}`.trim();
    if (fullName) {
      return fullName;
    }

    const email = typeof payload.email === 'string' ? payload.email : null;
    if (email) {
      return email;
    }

    const phone = typeof payload.phone_number === 'string' ? payload.phone_number : null;
    return phone;
  } catch {
    return null;
  }
};

export async function GET() {
  const name = resolveName();
  if (!name) {
    return NextResponse.json({error: 'Not authenticated'}, {status: 401});
  }

  return NextResponse.json({name});
}
