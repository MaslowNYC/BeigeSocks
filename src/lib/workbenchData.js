// Shared constants for the Workbench. Categories are display-only; the
// database stores whatever string is here, so adding one is safe.

export const CATEGORIES = [
  { id: 'motor',   label: 'Motors & motion',   color: '#8B5A2B' },
  { id: 'light',   label: 'LEDs & light',      color: '#C4342B' },
  { id: 'input',   label: 'Buttons & switches', color: '#C87914' },
  { id: 'sensor',  label: 'Sensors',           color: '#B8A016' },
  { id: 'power',   label: 'Power & battery',   color: '#3F8F4F' },
  { id: 'board',   label: 'Boards & chips',    color: '#2F6FB0' },
  { id: 'passive', label: 'Resistors, caps, wire', color: '#7A52A8' },
  { id: 'mech',    label: 'Hardware & printed parts', color: '#6E6A62' },
];

export const STATUSES = [
  { id: 'idea',      label: 'Idea' },
  { id: 'designing', label: 'Working it out' },
  { id: 'gathering', label: 'Gathering parts' },
  { id: 'building',  label: 'Building' },
  { id: 'done',      label: 'Done' },
  { id: 'parked',    label: 'Parked' },
];

// Projects in these states are what the order list adds up.
export const ACTIVE_STATUSES = ['gathering', 'building'];

export const categoryOf = (id) =>
  CATEGORIES.find((c) => c.id === id) || CATEGORIES[CATEGORIES.length - 1];

export const statusLabel = (id) =>
  (STATUSES.find((s) => s.id === id) || STATUSES[0]).label;

const KID_KEY = 'bs-workbench-kid';

export function getKidMode() {
  try { return localStorage.getItem(KID_KEY) === '1'; } catch { return false; }
}
export function setKidMode(on) {
  try { localStorage.setItem(KID_KEY, on ? '1' : '0'); } catch { /* private mode */ }
}
