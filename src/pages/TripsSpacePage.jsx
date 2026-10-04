import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { Helmet } from 'react-helmet';
import { Link, useParams } from 'react-router-dom';
import { Check, Copy, Plus, Share, Trash2, X, Pencil, RotateCcw } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { toast } from '@/components/ui/use-toast';
import { cn } from '@/lib/utils';
import * as api from '@/lib/tripsApi';
import { TRIPS_LAST_KEY } from '@/pages/TripsPage';

// ---------- small helpers ----------

const LAST_CATEGORY = /before we leave/i;

function groupByCategory(items) {
  const groups = new Map();
  for (const it of items) {
    if (!groups.has(it.category)) groups.set(it.category, []);
    groups.get(it.category).push(it);
  }
  const entries = [...groups.entries()];
  // "Before we leave" always reads last.
  entries.sort((a, b) => Number(LAST_CATEGORY.test(a[0])) - Number(LAST_CATEGORY.test(b[0])));
  return entries;
}

function readJSON(key, fallback) {
  try {
    const raw = localStorage.getItem(key);
    return raw ? JSON.parse(raw) : fallback;
  } catch {
    return fallback;
  }
}

function writeJSON(key, value) {
  try { localStorage.setItem(key, JSON.stringify(value)); } catch { /* private mode */ }
}

const emptyDraft = () => ({ name: '', date: '', skipped: [], extras: [] });

function formatDate(iso) {
  if (!iso) return '';
  const d = new Date(`${iso}T12:00:00`);
  return d.toLocaleDateString(undefined, { month: 'short', day: 'numeric' });
}

// Plain text, one thing per line. In Notes: paste, select all, Cmd+Shift+L.
function buildNoteText(title, items) {
  const lines = [title];
  for (const [cat, list] of groupByCategory(items)) {
    lines.push('', cat.toUpperCase());
    for (const it of list) lines.push(it.note ? `${it.name} (${it.note})` : it.name);
  }
  return lines.join('\n');
}

async function copyText(text) {
  try {
    await navigator.clipboard.writeText(text);
    return true;
  } catch {
    const ta = document.createElement('textarea');
    ta.value = text;
    ta.style.position = 'fixed';
    ta.style.opacity = '0';
    document.body.appendChild(ta);
    ta.select();
    const ok = document.execCommand('copy');
    document.body.removeChild(ta);
    return ok;
  }
}

// ---------- pieces ----------

function ItemRow({ item, skipped, onToggle, onRemove }) {
  const [confirming, setConfirming] = useState(false);

  useEffect(() => {
    if (!confirming) return undefined;
    const t = setTimeout(() => setConfirming(false), 3000);
    return () => clearTimeout(t);
  }, [confirming]);

  return (
    <li className="group flex items-center gap-3 py-1.5">
      <button
        type="button"
        onClick={onToggle}
        aria-pressed={!skipped}
        aria-label={skipped ? `Bring ${item.name} this time` : `Skip ${item.name} this time`}
        className={cn(
          'flex h-6 w-6 shrink-0 items-center justify-center rounded-md border-2 transition-colors',
          skipped ? 'border-[#E2D7C3] bg-transparent' : 'border-[#D8401F] bg-[#D8401F] text-[#FFFBF3]'
        )}
      >
        {!skipped && <Check className="h-4 w-4" strokeWidth={3} />}
      </button>
      <span className={cn('flex-1 min-w-0', skipped && 'text-[#6F655A] line-through')}>
        {item.name}
        {item.note && <span className="ml-2 text-sm text-[#6F655A]">{item.note}</span>}
      </span>
      {onRemove && (
        confirming ? (
          <button
            type="button"
            onClick={onRemove}
            className="text-xs font-semibold text-[#B3321A] px-2 py-1 rounded-full bg-[#F7E3DC]"
          >
            Remove for good?
          </button>
        ) : (
          <button
            type="button"
            onClick={() => setConfirming(true)}
            aria-label={`Remove ${item.name} from the list`}
            className="p-1 text-[#6F655A] opacity-60 sm:opacity-0 sm:group-hover:opacity-100 hover:text-[#B3321A] focus:opacity-100"
          >
            <X className="h-4 w-4" />
          </button>
        )
      )}
    </li>
  );
}

function AddRow({ categories, onAdd, placeholder, idPrefix }) {
  const [name, setName] = useState('');
  const [category, setCategory] = useState('');
  const [busy, setBusy] = useState(false);

  const submit = async (e) => {
    e.preventDefault();
    const n = name.trim();
    if (!n) return;
    setBusy(true);
    try {
      await onAdd(category.trim() || categories[0] || 'Other', n);
      setName('');
    } finally {
      setBusy(false);
    }
  };

  return (
    <form onSubmit={submit} className="mt-3 flex flex-col sm:flex-row gap-2">
      <Input
        value={name}
        onChange={(e) => setName(e.target.value)}
        placeholder={placeholder}
        aria-label="Item"
        className="sm:flex-[2]"
      />
      <Input
        value={category}
        onChange={(e) => setCategory(e.target.value)}
        placeholder={categories[0] ? `in ${categories[0]}` : 'Category'}
        aria-label="Category"
        list={`${idPrefix}-cats`}
        className="sm:flex-1"
      />
      <datalist id={`${idPrefix}-cats`}>
        {categories.map((c) => <option key={c} value={c} />)}
      </datalist>
      <Button type="submit" variant="outline" disabled={busy || !name.trim()}>
        <Plus className="h-4 w-4 mr-1" /> Add
      </Button>
    </form>
  );
}

function ListSection({ title, blurb, items, skipped, onToggle, onRemove, onAdd, categories, addPlaceholder, idPrefix }) {
  return (
    <section className="band-card p-5 pt-7">
      <h2 className="text-lg font-extrabold tracking-tight">{title}</h2>
      {blurb && <p className="text-sm text-[#6F655A] mt-0.5">{blurb}</p>}
      {items.length === 0 && <p className="text-sm text-[#6F655A] mt-3">Nothing here yet.</p>}
      {groupByCategory(items).map(([cat, list]) => (
        <div key={cat} className="mt-4">
          <h3 className="text-xs font-bold uppercase tracking-wider text-[#B3321A]">{cat}</h3>
          <ul className="mt-1">
            {list.map((it) => (
              <ItemRow
                key={it.id}
                item={it}
                skipped={skipped.has(it.id)}
                onToggle={() => onToggle(it.id)}
                onRemove={onRemove ? () => onRemove(it) : null}
              />
            ))}
          </ul>
        </div>
      ))}
      <AddRow categories={categories} onAdd={onAdd} placeholder={addPlaceholder} idPrefix={idPrefix} />
    </section>
  );
}

// ---------- the page ----------

function TripsSpacePage() {
  const { token } = useParams();
  const [data, setData] = useState(null);
  const [status, setStatus] = useState('loading'); // loading | ready | missing | error
  const [error, setError] = useState('');
  const placeKey = `bs-trips-place-${token}`;
  const [placeId, setPlaceId] = useState(() => readJSON(placeKey, null));
  const draftKey = placeId ? `bs-trips-draft-${token}-${placeId}` : null;
  const [draft, setDraft] = useState(emptyDraft);
  const [editingPlace, setEditingPlace] = useState(false);
  const [placeName, setPlaceName] = useState('');
  const [confirmDelete, setConfirmDelete] = useState(false);
  const [newPlace, setNewPlace] = useState('');
  const [addingPlace, setAddingPlace] = useState(false);

  const load = useCallback(async () => {
    try {
      const d = await api.loadAll(token);
      if (!d) { setStatus('missing'); return; }
      setData(d);
      setStatus('ready');
      try { localStorage.setItem(TRIPS_LAST_KEY, token); } catch { /* private mode */ }
    } catch (e) {
      setError(e.message);
      setStatus('error');
    }
  }, [token]);

  useEffect(() => { load(); }, [load]);

  // Fall back to the first place if the remembered one is gone.
  useEffect(() => {
    if (!data) return;
    if (!placeId || !data.places.some((p) => p.id === placeId)) {
      setPlaceId(data.places[0]?.id ?? null);
    }
  }, [data, placeId]);

  useEffect(() => { writeJSON(placeKey, placeId); }, [placeKey, placeId]);

  useEffect(() => {
    setDraft(draftKey ? { ...emptyDraft(), ...readJSON(draftKey, {}) } : emptyDraft());
    setEditingPlace(false);
    setConfirmDelete(false);
  }, [draftKey]);

  const saveDraft = (next) => {
    setDraft(next);
    if (draftKey) writeJSON(draftKey, next);
  };

  const place = data?.places.find((p) => p.id === placeId) ?? null;
  const baseItems = useMemo(() => data?.items.filter((i) => !i.place_id) ?? [], [data]);
  const placeItems = useMemo(() => data?.items.filter((i) => i.place_id === placeId) ?? [], [data, placeId]);
  const skipped = useMemo(() => new Set(draft.skipped), [draft.skipped]);
  const allCategories = useMemo(() => [...new Set(data?.items.map((i) => i.category) ?? [])], [data]);
  const baseCategories = useMemo(() => [...new Set(baseItems.map((i) => i.category))], [baseItems]);
  const placeCategories = useMemo(() => {
    const own = [...new Set(placeItems.map((i) => i.category))];
    return [...own, ...allCategories.filter((c) => !own.includes(c))];
  }, [placeItems, allCategories]);

  const bringing = useMemo(
    () => [...baseItems, ...placeItems, ...draft.extras].filter((i) => !skipped.has(i.id)),
    [baseItems, placeItems, draft.extras, skipped]
  );

  if (status === 'loading') return <p className="text-[#6F655A]">Loading…</p>;
  if (status === 'missing') {
    return (
      <div className="max-w-xl">
        <h1 className="text-2xl font-extrabold mb-2">That code didn't match anything.</h1>
        <Link to="/trips" className="text-[#B3321A] underline" onClick={() => { try { localStorage.removeItem(TRIPS_LAST_KEY); } catch { /* */ } }}>
          Try a different code
        </Link>
      </div>
    );
  }
  if (status === 'error') return <p className="text-[#B3321A]">Couldn't load trips: {error}</p>;

  const hid = data.household.id;

  const replaceData = (fn) => setData((d) => ({ ...d, ...fn(d) }));

  const fail = (e) => toast({ title: 'That didn’t save', description: e.message, variant: 'destructive' });

  const toggle = (id) => {
    const next = new Set(skipped);
    if (next.has(id)) next.delete(id); else next.add(id);
    saveDraft({ ...draft, skipped: [...next] });
  };

  const addStanding = (forPlace) => async (category, name) => {
    try {
      const pool = data.items.filter((i) => i.place_id === (forPlace ? placeId : null));
      const order = pool.reduce((m, i) => Math.max(m, i.sort_order), 0) + 1;
      const row = await api.addItem(token, hid, forPlace ? placeId : null, category, name, null, order);
      replaceData((d) => ({ items: [...d.items, row] }));
    } catch (e) { fail(e); }
  };

  const removeStanding = async (item) => {
    try {
      await api.deleteItem(token, item.id);
      replaceData((d) => ({ items: d.items.filter((i) => i.id !== item.id) }));
    } catch (e) { fail(e); }
  };

  const addExtra = async (category, name) => {
    const extra = { id: `x-${Date.now()}`, category, name, note: null };
    saveDraft({ ...draft, extras: [...draft.extras, extra] });
  };

  const removeExtra = (item) => {
    saveDraft({ ...draft, extras: draft.extras.filter((x) => x.id !== item.id) });
  };

  const saveNote = async (note) => {
    if (!place || note === place.note) return;
    try {
      const row = await api.updatePlace(token, place.id, { note });
      replaceData((d) => ({ places: d.places.map((p) => (p.id === row.id ? row : p)) }));
    } catch (e) { fail(e); }
  };

  const renamePlace = async (e) => {
    e.preventDefault();
    const name = placeName.trim();
    if (!name || !place) { setEditingPlace(false); return; }
    try {
      const row = await api.updatePlace(token, place.id, { name });
      replaceData((d) => ({ places: d.places.map((p) => (p.id === row.id ? row : p)) }));
      setEditingPlace(false);
    } catch (err) { fail(err); }
  };

  const removePlace = async () => {
    try {
      await api.deletePlace(token, place.id);
      try { localStorage.removeItem(draftKey); } catch { /* */ }
      replaceData((d) => ({
        places: d.places.filter((p) => p.id !== place.id),
        items: d.items.filter((i) => i.place_id !== place.id),
      }));
      setPlaceId(null);
    } catch (e) { fail(e); }
  };

  const createPlace = async (e) => {
    e.preventDefault();
    const name = newPlace.trim();
    if (!name) return;
    try {
      const order = data.places.reduce((m, p) => Math.max(m, p.sort_order), 0) + 1;
      const row = await api.addPlace(token, hid, name, order);
      replaceData((d) => ({ places: [...d.places, row] }));
      setPlaceId(row.id);
      setNewPlace('');
      setAddingPlace(false);
    } catch (err) { fail(err); }
  };

  const title = [draft.name.trim() || place?.name || 'Trip', formatDate(draft.date)].filter(Boolean).join(' · ');
  const noteText = buildNoteText(title, bringing);

  const doCopy = async () => {
    const ok = await copyText(noteText);
    toast(ok
      ? { title: 'Copied', description: 'Paste it in the note, select all, then Cmd+Shift+L for checkboxes.' }
      : { title: 'Couldn’t copy', variant: 'destructive' });
  };

  const canShare = typeof navigator !== 'undefined' && typeof navigator.share === 'function';
  const doShare = async () => {
    try { await navigator.share({ title, text: noteText }); } catch { /* cancelled */ }
  };

  const startFresh = () => saveDraft(emptyDraft());

  return (
    <>
      <Helmet>
        <title>Trips | BeigeSocks</title>
      </Helmet>

      <div className="max-w-3xl pb-28">
        <div className="flex items-center gap-3 mb-1">
          <img src="/Pigeon.JPG" alt="" className="h-12 w-12 rounded-full object-cover border-2 border-[#D8401F]" />
          <h1 className="text-3xl font-extrabold tracking-tight">Trips</h1>
        </div>
        <p className="text-[#6F655A] mb-6">Pick where you're going. The list builds itself.</p>

        {/* places */}
        <div className="flex flex-wrap gap-2 mb-6" role="tablist" aria-label="Places">
          {data.places.map((p) => (
            <button
              key={p.id}
              type="button"
              role="tab"
              aria-selected={p.id === placeId}
              onClick={() => setPlaceId(p.id)}
              className={cn(
                'band-pill transition-transform hover:-translate-y-0.5',
                p.id === placeId && '!bg-[#D8401F] !text-[#FFFBF3]'
              )}
              style={p.id === placeId ? { boxShadow: 'inset 0 3px 0 #FFFBF3, inset 0 -3px 0 #FFFBF3' } : undefined}
            >
              {p.name}
            </button>
          ))}
          {addingPlace ? (
            <form onSubmit={createPlace} className="flex gap-2">
              <Input
                autoFocus
                value={newPlace}
                onChange={(e) => setNewPlace(e.target.value)}
                placeholder="New place"
                className="h-9 w-40"
                onBlur={() => { if (!newPlace.trim()) setAddingPlace(false); }}
              />
              <Button type="submit" size="sm" disabled={!newPlace.trim()}>Add</Button>
            </form>
          ) : (
            <button
              type="button"
              onClick={() => setAddingPlace(true)}
              className="inline-flex items-center gap-1 rounded-full border-2 border-dashed border-[#E2D7C3] px-4 py-1.5 text-sm font-semibold text-[#6F655A] hover:border-[#D8401F] hover:text-[#B3321A]"
            >
              <Plus className="h-4 w-4" /> Place
            </button>
          )}
        </div>

        {!place ? (
          <p className="text-[#6F655A]">Add a place to get started.</p>
        ) : (
          <div className="flex flex-col gap-5">
            {/* this trip */}
            <section className="band-card p-5 pt-7">
              <div className="flex items-start justify-between gap-3">
                {editingPlace ? (
                  <form onSubmit={renamePlace} className="flex gap-2 flex-1">
                    <Input autoFocus value={placeName} onChange={(e) => setPlaceName(e.target.value)} aria-label="Place name" />
                    <Button type="submit" size="sm">Save</Button>
                    <Button type="button" size="sm" variant="outline" onClick={() => setEditingPlace(false)}>Cancel</Button>
                  </form>
                ) : (
                  <h2 className="text-2xl font-extrabold tracking-tight">{place.name}</h2>
                )}
                {!editingPlace && (
                  <div className="flex items-center gap-1 shrink-0">
                    <button
                      type="button"
                      onClick={() => { setPlaceName(place.name); setEditingPlace(true); }}
                      aria-label="Rename place"
                      className="p-2 rounded-full text-[#6F655A] hover:bg-[#EEE4D2]"
                    >
                      <Pencil className="h-4 w-4" />
                    </button>
                    {confirmDelete ? (
                      <button
                        type="button"
                        onClick={removePlace}
                        className="text-xs font-semibold text-[#B3321A] px-3 py-1.5 rounded-full bg-[#F7E3DC]"
                      >
                        Delete {place.name} and its list?
                      </button>
                    ) : (
                      <button
                        type="button"
                        onClick={() => setConfirmDelete(true)}
                        aria-label="Delete place"
                        className="p-2 rounded-full text-[#6F655A] hover:bg-[#EEE4D2] hover:text-[#B3321A]"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    )}
                  </div>
                )}
              </div>

              <textarea
                key={place.id}
                defaultValue={place.note}
                onBlur={(e) => saveNote(e.target.value)}
                placeholder="What's there, what isn't, anything to remember about this place"
                rows={2}
                className="mt-2 w-full resize-y rounded-xl border border-[#E2D7C3] bg-[#F6F1E7] px-3 py-2 text-sm text-[#2A2420] placeholder:text-[#6F655A] focus:outline-none focus:ring-2 focus:ring-[#D8401F]"
              />

              <div className="mt-3 grid grid-cols-1 sm:grid-cols-[1fr_auto] gap-2">
                <Input
                  value={draft.name}
                  onChange={(e) => saveDraft({ ...draft, name: e.target.value })}
                  placeholder={`Trip name (defaults to ${place.name})`}
                  aria-label="Trip name"
                />
                <Input
                  type="date"
                  value={draft.date}
                  onChange={(e) => saveDraft({ ...draft, date: e.target.value })}
                  aria-label="Leaving on"
                  className="sm:w-44"
                />
              </div>
              <p className="mt-3 text-sm text-[#6F655A]">
                Uncheck anything you're skipping this time. That only affects this trip. The X removes it from the list for good.
              </p>
            </section>

            <ListSection
              title="Every trip"
              blurb="Goes everywhere."
              items={baseItems}
              skipped={skipped}
              onToggle={toggle}
              onRemove={removeStanding}
              onAdd={addStanding(false)}
              categories={baseCategories}
              addPlaceholder="Add to every trip"
              idPrefix="base"
            />

            <ListSection
              title={`Only for ${place.name}`}
              blurb="Remembered for next time."
              items={placeItems}
              skipped={skipped}
              onToggle={toggle}
              onRemove={removeStanding}
              onAdd={addStanding(true)}
              categories={placeCategories}
              addPlaceholder={`Add to ${place.name}`}
              idPrefix="place"
            />

            <ListSection
              title="Just this trip"
              blurb="One-offs. Not saved to any list."
              items={draft.extras}
              skipped={skipped}
              onToggle={toggle}
              onRemove={removeExtra}
              onAdd={addExtra}
              categories={['Extras', ...allCategories.filter((c) => c !== 'Extras')]}
              addPlaceholder="Add a one-off"
              idPrefix="extra"
            />

            <button
              type="button"
              onClick={startFresh}
              className="self-start inline-flex items-center gap-1.5 text-sm text-[#6F655A] hover:text-[#B3321A]"
            >
              <RotateCcw className="h-4 w-4" /> Start this trip fresh
            </button>
          </div>
        )}
      </div>

      {place && (
        <div className="fixed inset-x-0 bottom-0 z-40 border-t border-[#E2D7C3] bg-[#FFFBF3]/95 backdrop-blur">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 py-3 flex items-center gap-3">
            <span className="text-sm text-[#6F655A] flex-1 min-w-0 truncate">
              <strong className="text-[#2A2420]">{bringing.length}</strong> things for {title}
            </span>
            {canShare && (
              <Button type="button" variant="outline" onClick={doShare}>
                <Share className="h-4 w-4 mr-1.5" /> Share
              </Button>
            )}
            <Button type="button" onClick={doCopy}>
              <Copy className="h-4 w-4 mr-1.5" /> Copy for Notes
            </Button>
          </div>
        </div>
      )}
    </>
  );
}

export default TripsSpacePage;
