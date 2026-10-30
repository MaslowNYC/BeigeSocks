import { createClient } from '@supabase/supabase-js';
import { SUPABASE_URL, SUPABASE_KEY } from '@/lib/supabaseConfig';

// Trips: one base list that goes on every trip, plus places that each keep a
// standing list of their own. Same access idea as Workbench: a secret token in
// the URL, sent as a header, checked by row level security in the database.
// Tables live in `public` with a travel_ prefix.

const url = SUPABASE_URL;
const key = SUPABASE_KEY;

export const isConfigured = Boolean(url && key);

const clients = new Map();

function db(token) {
  if (!isConfigured) throw new Error('Supabase is not configured.');
  if (!token) throw new Error('No trips token.');
  if (!clients.has(token)) {
    clients.set(
      token,
      createClient(url, key, {
        global: { headers: { 'x-travel-token': token } },
        auth: { persistSession: false },
      })
    );
  }
  return clients.get(token);
}

function unwrap({ data, error }) {
  if (error) throw new Error(error.message);
  return data;
}

// Everything in one go. Returns null when the token is wrong.
export async function loadAll(token) {
  const c = db(token);
  const household = unwrap(await c.from('travel_households').select('id, name').maybeSingle());
  if (!household) return null;
  const [places, items] = await Promise.all([
    c.from('travel_places').select('*').order('sort_order').order('created_at').then(unwrap),
    c.from('travel_items').select('*').order('sort_order').order('created_at').then(unwrap),
  ]);
  return { household, places, items };
}

export const addPlace = (token, householdId, name, sortOrder) =>
  db(token)
    .from('travel_places')
    .insert({ household_id: householdId, name, sort_order: sortOrder })
    .select()
    .single()
    .then(unwrap);

export const updatePlace = (token, id, fields) =>
  db(token).from('travel_places').update(fields).eq('id', id).select().single().then(unwrap);

export const deletePlace = (token, id) =>
  db(token).from('travel_places').delete().eq('id', id).then(unwrap);

// placeId null puts the item on the every-trip list.
export const addItem = (token, householdId, placeId, category, name, note, sortOrder) =>
  db(token)
    .from('travel_items')
    .insert({
      household_id: householdId,
      place_id: placeId,
      category,
      name,
      note: note || null,
      sort_order: sortOrder,
    })
    .select()
    .single()
    .then(unwrap);

export const deleteItem = (token, id) =>
  db(token).from('travel_items').delete().eq('id', id).then(unwrap);
