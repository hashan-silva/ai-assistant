import {NextResponse} from 'next/server';
import {cookies} from 'next/headers';

export const runtime = 'nodejs';
export const maxDuration = 60;

const resolveAccessToken = () => cookies().get('helpclub_access_token')?.value;

const buildHeaders = () => {
  const headers: Record<string, string> = {'Content-Type': 'application/json'};
  const token = resolveAccessToken();
  if (token) {
    headers.Authorization = `Bearer ${token}`;
  }
  return headers;
};

export async function GET() {
  const apiBaseUrl = process.env.API_BASE_URL || 'http://localhost:8080';

  try {
    const response = await fetch(`${apiBaseUrl}/api/profile`, {
      headers: buildHeaders()
    });
    const text = await response.text();
    let data: unknown;

    try {
      data = JSON.parse(text);
    } catch {
      return NextResponse.json({error: 'Invalid response from backend'}, {status: 502});
    }

    return NextResponse.json(data, {status: response.status});
  } catch {
    return NextResponse.json({error: 'Failed to reach backend'}, {status: 502});
  }
}

export async function PUT(request: Request) {
  const apiBaseUrl = process.env.API_BASE_URL || 'http://localhost:8080';
  let payload: unknown;

  try {
    payload = await request.json();
  } catch {
    return NextResponse.json({error: 'Invalid JSON payload'}, {status: 400});
  }

  try {
    const response = await fetch(`${apiBaseUrl}/api/profile`, {
      method: 'PUT',
      headers: buildHeaders(),
      body: JSON.stringify(payload)
    });
    const text = await response.text();
    let data: unknown;

    try {
      data = JSON.parse(text);
    } catch {
      return NextResponse.json({error: 'Invalid response from backend'}, {status: 502});
    }

    return NextResponse.json(data, {status: response.status});
  } catch {
    return NextResponse.json({error: 'Failed to reach backend'}, {status: 502});
  }
}
