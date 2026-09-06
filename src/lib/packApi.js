import { createClient } from '@supabase/supabase-js';

const url = import.meta.env.VITE_SUPABASE_URL;
const key = import.meta.env.VITE_SUPABASE_ANON_KEY;

// Missing env shouldn't blow up the whole bundle — the Pack page checks isConfigured
// and shows a setup message instead of a white screen.
export const isConfigured = Boolean(url && key);

const supabase = isConfigured ? createClient(url, key, { auth: { persistSession: false } }) : null;

async function rpc(fn, args) {
  if (!supabase) throw new Error('Supabase is not configured.');
  const { data, error } = await supabase.rpc(fn, args);
  if (error) throw new Error(error.message);
  return data;
}

export const createTrip = (name, mode, items) =>
  rpc('pack_create_trip', {
    p_name: name,
    p_mode: mode,
    p_items: items.map(({ cat, name: n, note }) => ({ cat, name: n, note: note || '' })),
  });

export const loadTrip = (token) => rpc('pack_load', { p_token: token });

export const updateTrip = (token, name, mode) =>
  rpc('pack_update_trip', { p_token: token, p_name: name, p_mode: mode });

export const addItem = (token, cat, name, note) =>
  rpc('pack_add_item', { p_token: token, p_cat: cat, p_name: name, p_note: note || null });

export const setPacked = (token, itemId, packed) =>
  rpc('pack_set_packed', { p_token: token, p_item: itemId, p_packed: packed });

export const setClaim = (token, itemId, claim) =>
  rpc('pack_set_claim', { p_token: token, p_item: itemId, p_claim: claim || '' });

export const deleteItem = (token, itemId) =>
  rpc('pack_delete_item', { p_token: token, p_item: itemId });
