import { createClient } from '@supabase/supabase-js';
import { SUPABASE_URL, SUPABASE_KEY } from '@/lib/supabaseConfig';

// Workbench tables live in the RVNO Supabase project with a wb_ prefix.
// Access is a secret token in the URL, sent as a header and checked by row
// level security in the database.

const url = SUPABASE_URL;
const key = SUPABASE_KEY;

export const isConfigured = Boolean(url && key);

const clients = new Map();

function db(token) {
  if (!isConfigured) throw new Error('Supabase is not configured.');
  if (!token) throw new Error('No workbench token.');
  if (!clients.has(token)) {
    clients.set(
      token,
      createClient(url, key, {
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
  const workspace = unwrap(await c.from('wb_workspaces').select('*').maybeSingle());
  if (!workspace) return null;

  const [parts, projects, lines, order] = await Promise.all([
    c.from('wb_parts').select('*').order('name').then(unwrap),
    c.from('wb_projects').select('*').order('created_at', { ascending: false }).then(unwrap),
    c.from('wb_project_lines').select('*').order('sort_order').then(unwrap),
    c.from('wb_order_list').select('*').then(unwrap),
  ]);

  return { workspace, parts: parts || [], projects: projects || [], lines: lines || [], order: order || [] };
}

/* ---------- parts ---------- */

export const addPart = (token, workspaceId, fields) =>
  db(token).from('wb_parts').insert({ workspace_id: workspaceId, ...fields }).select().single().then(unwrap);

export const updatePart = (token, id, fields) =>
  db(token).from('wb_parts').update(fields).eq('id', id).select().single().then(unwrap);

export const deletePart = (token, id) =>
  db(token).from('wb_parts').delete().eq('id', id).then(unwrap);

/* ---------- projects ---------- */

export const addProject = (token, workspaceId, fields) =>
  db(token).from('wb_projects').insert({ workspace_id: workspaceId, ...fields }).select().single().then(unwrap);

export const updateProject = (token, id, fields) =>
  db(token).from('wb_projects').update(fields).eq('id', id).select().single().then(unwrap);

export const deleteProject = (token, id) =>
  db(token).from('wb_projects').delete().eq('id', id).then(unwrap);

/* ---------- lines ---------- */

export const addLine = (token, workspaceId, projectId, fields) =>
  db(token)
    .from('wb_project_lines')
    .insert({ workspace_id: workspaceId, project_id: projectId, ...fields })
    .select()
    .single()
    .then(unwrap);

export const updateLine = (token, id, fields) =>
  db(token).from('wb_project_lines').update(fields).eq('id', id).select().single().then(unwrap);

export const deleteLine = (token, id) =>
  db(token).from('wb_project_lines').delete().eq('id', id).then(unwrap);

/* ---------- the order list ---------- */
// A database view: lines on gathering/building projects, summed per part,
// minus what is in the bins. Nothing is reserved or decremented anywhere.

export const loadOrderList = (token) =>
  db(token).from('wb_order_list').select('*').then(unwrap);
