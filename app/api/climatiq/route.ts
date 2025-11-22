import { NextRequest, NextResponse } from 'next/server';

const CLIMATIQ_API_KEY = 'VGSK4AN02D2QD18R2K3QBCS5NR';
const CLIMATIQ_BASE_URL = 'https://www.climatiq.io';

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    // Default data_version is ^28 (URL encoded as %5E28)
    const dataVersion = searchParams.get('data_version') || '%5E28';
    const page = searchParams.get('page') || '1';

    // Build URL with query parameters
    // The data_version should be URL encoded if it contains ^
    const url = `${CLIMATIQ_BASE_URL}/data/api/activities?page=${page}&data_version=${dataVersion}`;
    
    const response = await fetch(url, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${CLIMATIQ_API_KEY}`,
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('Climatiq API error:', errorText);
      return NextResponse.json(
        { error: `Climatiq API error: ${response.statusText}`, details: errorText },
        { status: response.status }
      );
    }

    const data = await response.json();
    return NextResponse.json(data);
  } catch (error) {
    console.error('Error fetching Climatiq data:', error);
    return NextResponse.json(
      { error: 'Failed to fetch Climatiq data', details: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    );
  }
}
