import { createClient } from '@supabase/supabase-js';

// The Workbench lives in its own Postgres schema so Gabber can be split out
// of this database later without untangling anything. Pack stays on `public`
// and keeps using its own client in packApi.js — do not merge the two.
//
// Access works the same way Pack's does: a secret token in the URL. The
// difference is that Pack passes the token as an argument to SECURITY DEFINER
// functions, while here the client sends it as a header and row level security
// checks it. That means plain table queries instead of an RPC per operation.

const url = import.meta.env.VITE_SUPABASE_URL;
const key = import.meta.env.VITE_SUPABASE_ANON_KEY;

export const isConfigured = Boolean(url && key);

const clients = new Map();

function db(token) {
  if (!isConfigured) throw new Error('Supabase is not configured.');
  if (!token) throw new Error('No workbench token.');
  if (!clients.has(token)) {
    clients.set(
      token,
      createClient(url, key, {
        db: { schema: 'workbench' },
        global: { headers: { 'x-workbench-token': token } },
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

// One round trip for everything the page needs. Returns null when the token
// is wrong, which reads as "no such workbench" rather than an error.
export async function loadSpace(token) {
  const c = db(token);
  const workspace = unwrap(await c.from('workspaces').select('*').maybeSingle());
  if (!workspace) return null;

  const [parts, projects, lines, order] = await Promise.all([
    c.from('parts').select('*').order('name').then(unwrap),
    c.from('projects').select('*').order('created_at', { ascending: false }).then(unwrap),
    c.from('project_lines').select('*').order('sort_order').then(unwrap),
    c.from('order_list').select('*').then(unwrap),
  ]);

  return { workspace, parts: parts || [], projects: projects || [], lines: lines || [], order: order || [] };
}

/* ---------- parts ---------- */

export const addPart = (token, workspaceId, fields) =>
  db(token).from('parts').insert({ workspace_id: workspaceId, ...fields }).select().single().then(unwrap);

export const updatePart = (token, id, fields) =>
  db(token).from('parts').update(fields).eq('id', id).select().single().then(unwrap);

export const deletePart = (token, id) =>
  db(token).from('parts').delete().eq('id', id).then(unwrap);

/* ---------- projects ---------- */

export const addProject = (token, workspaceId, fields) =>
  db(token).from('projects').insert({ workspace_id: workspaceId, ...fields }).select().single().then(unwrap);

export const updateProject = (token, id, fields) =>
  db(token).from('projects').update(fields).eq('id', id).select().single().then(unwrap);

export const deleteProject = (token, id) =>
  db(token).from('projects').delete().eq('id', id).then(unwrap);

/* ---------- lines ---------- */

export const addLine = (token, workspaceId, projectId, fields) =>
  db(token)
    .from('project_lines')
    .insert({ workspace_id: workspaceId, project_id: projectId, ...fields })
    .select()
    .single()
    .then(unwrap);

export const updateLine = (token, id, fields) =>
  db(token).from('project_lines').update(fields).eq('id', id).select().single().then(unwrap);

export const deleteLine = (token, id) =>
  db(token).from('project_lines').delete().eq('id', id).then(unwrap);

/* ---------- the order list ---------- */
// A database view: lines on gathering/building projects, summed per part,
// minus what is in the bins. Nothing is reserved or decremented anywhere.

export const loadOrderList = (token) =>
  db(token).from('order_list').select('*').then(unwrap);
