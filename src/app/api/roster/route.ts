import { NextRequest, NextResponse } from 'next/server';

export async function GET(req: NextRequest) {
  const teamId = req.nextUrl.searchParams.get('teamId');

  if (!teamId) {
    return NextResponse.json({ error: 'Missing teamId' }, { status: 400 });
  }

  try {
    const res = await fetch(`https://statsapi.web.nhl.com/api/v1/teams/${teamId}?expand=team.roster`);
    const data = await res.json();

    const roster = data.teams?.[0]?.roster?.roster?.map((p: any) => ({
      id: p.person.id,
      fullName: p.person.fullName,
      position: p.position.name,
      jerseyNumber: p.jerseyNumber,
    })) ?? [];

    return NextResponse.json({ roster });
  } catch (error) {
    console.error('Error fetching roster:', error);
    return NextResponse.json({ error: 'Failed to fetch roster' }, { status: 500 });
  }
}
