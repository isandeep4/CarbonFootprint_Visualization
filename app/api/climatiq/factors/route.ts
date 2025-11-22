import { NextRequest, NextResponse } from 'next/server';

const CLIMATIQ_API_KEY = 'VGSK4AN02D2QD18R2K3QBCS5NR';
const CLIMATIQ_BASE_URL = 'https://www.climatiq.io';

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const activityId = searchParams.get('activity_id');
    const dataVersion = searchParams.get('data_version') || '%5E28';
    const page = searchParams.get('page') || '1';

    if (!activityId) {
      return NextResponse.json(
        { error: 'activity_id parameter is required' },
        { status: 400 }
      );
    }

    // Build URL with query parameters
    const url = `${CLIMATIQ_BASE_URL}/data/api/factors?activity_id=${encodeURIComponent(activityId)}&page=${page}&data_version=${dataVersion}`;
    
    const response = await fetch(url, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${CLIMATIQ_API_KEY}`,
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('Climatiq Factors API error:', errorText);
      return NextResponse.json(
        { error: `Climatiq API error: ${response.statusText}`, details: errorText },
        { status: response.status }
      );
    }

    const data = await response.json();
    return NextResponse.json(data);
  } catch (error) {
    console.error('Error fetching Climatiq factors data:', error);
    return NextResponse.json(
      { error: 'Failed to fetch Climatiq factors data', details: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    );
  }
}

