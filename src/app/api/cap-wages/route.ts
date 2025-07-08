import { NextRequest } from 'next/server';
import * as cheerio from 'cheerio';

const teamSlugMap: Record<string, string> = {
  'ANAHEIM DUCKS': 'anaheim_ducks',
  'ARIZONA COYOTES': 'arizona_coyotes',
  'BOSTON BRUINS': 'boston_bruins',
  'BUFFALO SABRES': 'buffalo_sabres',
  'CALGARY FLAMES': 'calgary_flames',
  'CAROLINA HURRICANES': 'carolina_hurricanes',
  'CHICAGO BLACKHAWKS': 'chicago_blackhawks',
  'COLORADO AVALANCHE': 'colorado_avalanche',
  'COLUMBUS BLUE JACKETS': 'columbus_blue_jackets',
  'DALLAS STARS': 'dallas_stars',
  'DETROIT RED WINGS': 'detroit_red_wings',
  'EDMONTON OILERS': 'edmonton_oilers',
  'FLORIDA PANTHERS': 'florida_panthers',
  'LOS ANGELES KINGS': 'los_angeles_kings',
  'MINNESOTA WILD': 'minnesota_wild',
  'MONTREAL CANADIENS': 'montreal_canadiens',
  'NASHVILLE PREDATORS': 'nashville_predators',
  'NEW JERSEY DEVILS': 'new_jersey_devils',
  'NEW YORK ISLANDERS': 'new_york_islanders',
  'NEW YORK RANGERS': 'new_york_rangers',
  'OTTAWA SENATORS': 'ottawa_senators',
  'PHILADELPHIA FLYERS': 'philadelphia_flyers',
  'PITTSBURGH PENGUINS': 'pittsburgh_penguins',
  'SAN JOSE SHARKS': 'san_jose_sharks',
  'SEATTLE KRAKEN': 'seattle_kraken',
  'ST. LOUIS BLUES': 'st_louis_blues',
  'TAMPA BAY LIGHTNING': 'tampa_bay_lightning',
  'TORONTO MAPLE LEAFS': 'toronto_maple_leafs',
  'VANCOUVER CANUCKS': 'vancouver_canucks',
  'VEGAS GOLDEN KNIGHTS': 'vegas_golden_knights',
  'WASHINGTON CAPITALS': 'washington_capitals',
  'WINNIPEG JETS': 'winnipeg_jets',
};

export async function GET(req: NextRequest) {
  const teamName = req.nextUrl.searchParams.get('teamName');

  if (!teamName || !teamSlugMap[teamName]) {
    return new Response(JSON.stringify({ error: 'Invalid or missing team name' }), { status: 400 });
  }

  const slug = teamSlugMap[teamName];
  const url = `https://capwages.com/teams/${slug}`;

  try {
    const res = await fetch(url);
    const html = await res.text();
    const $ = cheerio.load(html);

    const players: any[] = [];

    $('table.teamProfileRosterSection__table tbody tr').each((_, row) => {
      const tds = $(row).find('td');

      if (tds.length >= 10) {
        const name = $(tds[0]).find('a').text().trim();
        const yearsRemaining = $(tds[1]).text().trim();
        const term = $(tds[2]).text().trim();
        const position = $(tds[3])
          .text()
          .trim()
          .split(',')
          .map((p) => p.trim());
        const status = $(tds[4]).text().trim();
        const age = parseInt($(tds[6]).text().trim(), 10);

        const capHits: Record<string, string> = {};
        const yearLabels = ['2025-26', '2026-27', '2027-28', '2028-29', '2029-30', '2030-31'];

        for (let i = 0; i < yearLabels.length; i++) {
          const capText = $(tds[9 + i])
            .find('div')
            .first()
            .text()
            .trim();
          capHits[yearLabels[i]] = capText || '';
        }

        const expiryYear = Object.entries(capHits)
          .reverse()
          .find(([_, val]) => val)?.[0];

        players.push({
          name,
          yearsRemaining,
          term,
          position,
          status,
          age,
          capHits,
          expiryYear,
        });
      }
    });

    return Response.json(players);
  } catch (err) {
    console.error('Scraping error:', err);
    return new Response(JSON.stringify({ error: 'Failed to fetch cap data' }), { status: 500 });
  }
}
