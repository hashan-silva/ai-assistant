import {NextResponse} from 'next/server';

export async function POST(request: Request) {
  const apiBaseUrl = process.env.API_BASE_URL || 'http://localhost:8080';
  let payload: unknown;

  try {
    payload = await request.json();
  } catch {
    return NextResponse.json({error: 'Invalid JSON payload'}, {status: 400});
  }

  try {
    const response = await fetch(`${apiBaseUrl}/api/chat`, {
      method: 'POST',
      headers: {'Content-Type': 'application/json'},
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
