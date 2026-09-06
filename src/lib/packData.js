export const CATEGORIES = [
  'Shelter & Sleep',
  'Light & Power',
  'Kitchen & Fire',
  'Water',
  'Clothing',
  'Wet & Beach',
  'Hygiene',
  'First Aid & Meds',
  'Tools',
  'Bugs',
  'Footwear',
  'Activities',
];

export const TRIP_MODES = ['Kid / Basecamp', 'Canoe / Moving Camp'];

// Seeded from Patrick's real master inventory so a new trip isn't an empty page.
export const STARTER_GEAR = [
  { cat: 'Shelter & Sleep', name: 'Nemo Aurora 6P tent' },
  { cat: 'Shelter & Sleep', name: 'Big Agnes Tiger Wall 2P' },
  { cat: 'Shelter & Sleep', name: 'Hammock Gear hammock + Incubator + Journey tarp' },
  { cat: 'Shelter & Sleep', name: 'Big Agnes Anvil Horn 30° bag' },
  { cat: 'Light & Power', name: 'Biolite headlamp', note: 'charge night before' },
  { cat: 'Light & Power', name: 'Jackery 240' },
  { cat: 'Light & Power', name: '20k battery bank' },
  { cat: 'Light & Power', name: 'THE power pouch (cables + brick)' },
  { cat: 'Kitchen & Fire', name: 'Hammock Gear fire pouch' },
  { cat: 'Kitchen & Fire', name: 'Pocket Rocket + fuel' },
  { cat: 'Kitchen & Fire', name: '12" cast iron', note: 'basecamp only' },
  { cat: 'Water', name: 'Sawyer filter' },
  { cat: 'Water', name: 'Mazama bottles' },
  { cat: 'Clothing', name: 'NF zip-cargo shorts (red + slate)' },
  { cat: 'Clothing', name: 'Smartwool shirts (red + green)' },
  { cat: 'Footwear', name: 'EVA Birkenstock Bostons' },
  { cat: 'Footwear', name: 'Tevas', note: 'wet / rocky' },
  { cat: 'Hygiene', name: 'Bifold pillbox (allopurinol + daily meds)' },
  { cat: 'First Aid & Meds', name: 'REI first aid kit + blister care' },
  { cat: 'Tools', name: 'Folding saw' },
  { cat: 'Tools', name: 'Paracord' },
  { cat: 'Bugs', name: 'Permethrin-treated clothing' },
  { cat: 'Bugs', name: 'Picaridin 20%' },
  { cat: 'Activities', name: 'Sleeping Queens', note: 'the champion' },
];

const NAME_KEY = 'beigesocks-pack-who';
const RECENT_KEY = 'beigesocks-pack-recent';

export function getWho() {
  try {
    return localStorage.getItem(NAME_KEY) || '';
  } catch {
    return '';
  }
}

export function setWho(name) {
  try {
    localStorage.setItem(NAME_KEY, name);
  } catch {
    // private browsing — the name just won't stick between visits
  }
}

export function getRecentTrips() {
  try {
    const raw = localStorage.getItem(RECENT_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

export function rememberTrip(token, name) {
  try {
    const next = [
      { token, name },
      ...getRecentTrips().filter((t) => t.token !== token),
    ].slice(0, 5);
    localStorage.setItem(RECENT_KEY, JSON.stringify(next));
  } catch {
    // non-fatal
  }
}
