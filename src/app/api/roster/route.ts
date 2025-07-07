import { NextRequest } from 'next/server';
import * as cheerio from 'cheerio';

const teamSlugMap: Record<string, string> = {
  'ANAHEIM DUCKS': 'ana/anaheim-ducks',
  'ARIZONA COYOTES': 'ari/arizona-coyotes',
  'BOSTON BRUINS': 'bos/boston-bruins',
  'BUFFALO SABRES': 'buf/buffalo-sabres',
  'CALGARY FLAMES': 'cgy/calgary-flames',
  'CAROLINA HURRICANES': 'car/carolina-hurricanes',
  'CHICAGO BLACKHAWKS': 'chi/chicago-blackhawks',
  'COLORADO AVALANCHE': 'col/colorado-avalanche',
  'COLUMBUS BLUE JACKETS': 'cbj/columbus-blue-jackets',
  'DALLAS STARS': 'dal/dallas-stars',
  'DETROIT RED WINGS': 'det/detroit-red-wings',
  'EDMONTON OILERS': 'edm/edmonton-oilers',
  'FLORIDA PANTHERS': 'fla/florida-panthers',
  'LOS ANGELES KINGS': 'la/los-angeles-kings',
  'MINNESOTA WILD': 'min/minnesota-wild',
  'MONTREAL CANADIENS': 'mtl/montreal-canadiens',
  'NASHVILLE PREDATORS': 'nsh/nashville-predators',
  'NEW JERSEY DEVILS': 'nj/new-jersey-devils',
  'NEW YORK ISLANDERS': 'nyi/new-york-islanders',
  'NEW YORK RANGERS': 'nyr/new-york-rangers',
  'OTTAWA SENATORS': 'ott/ottawa-senators',
  'PHILADELPHIA FLYERS': 'phi/philadelphia-flyers',
  'PITTSBURGH PENGUINS': 'pit/pittsburgh-penguins',
  'SAN JOSE SHARKS': 'sj/san-jose-sharks',
  'SEATTLE KRAKEN': 'sea/seattle-kraken',
  'ST. LOUIS BLUES': 'stl/st-louis-blues',
  'TAMPA BAY LIGHTNING': 'tb/tampa-bay-lightning',
  'TORONTO MAPLE LEAFS': 'tor/toronto-maple-leafs',
  'VANCOUVER CANUCKS': 'van/vancouver-canucks',
  'VEGAS GOLDEN KNIGHTS': 'vgk/vegas-golden-knights',
  'WASHINGTON CAPITALS': 'wsh/washington-capitals',
  'WINNIPEG JETS': 'wpg/winnipeg-jets',
};



export async function GET(req: NextRequest) {
  const teamName = req.nextUrl.searchParams.get('teamName');
  if (!teamName || !teamSlugMap[teamName]) {
    return new Response(JSON.stringify({ error: 'Invalid team name' }), { status: 400 });
  }

  const slug = teamSlugMap[teamName];
  const url = `https://www.espn.com/nhl/team/roster/_/name/${slug}`;

  try {
    const res = await fetch(url);
    const html = await res.text();
    const $ = cheerio.load(html);

    const players: any[] = [];

    let currentPosition = ''; 

    $('h2, table').each((_, element) => {
      const tag = $(element).prop('tagName');

      if (tag === 'H2') {
        
        currentPosition = $(element).text().trim();
      } else if (tag === 'TABLE') {
        
        $(element).find('tbody tr').each((_, el) => {
          const tds = $(el).find('td');
          if (tds.length >= 5) {
            const fullName = $(tds[1]).find('a').text().trim();
            const [firstName, ...rest] = fullName.split(' ');
            const lastName = rest.join(' ').replace(/\d+$/, '').trim(); 

            players.push({
  playerId: Math.floor(Math.random() * 1000000),
  firstName,
  lastName,
  sweaterNumber: $(tds[0]).text().trim(),
  age: $(tds[2]).text().trim(),
  positionGroup: currentPosition,
  weight: $(tds[4]).text().trim(),
});

          }
        });
      }
    });

    return Response.json(players);
  } catch (err) {
    console.error('Scraping error:', err);
    return new Response(JSON.stringify({ error: 'Failed to fetch roster' }), { status: 500 });
  }
}





