import {NextResponse} from 'next/server';

export async function POST() {
  const response = NextResponse.json({ok: true});
  response.cookies.delete('ai-assistant_access_token');
  response.cookies.delete('ai-assistant_id_token');
  response.cookies.delete('ai-assistant_refresh_token');
  return response;
}
