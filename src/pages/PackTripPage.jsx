import React, { useState, useEffect, useMemo, useRef, useCallback } from 'react';
import { Helmet } from 'react-helmet';
import { useParams, Link } from 'react-router-dom';
import {
  Plus, Trash2, Printer, Check, Tent, Link2, Loader2, User, RefreshCw, AlertCircle,
} from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { CATEGORIES, TRIP_MODES, getWho, setWho, rememberTrip } from '@/lib/packData';
import * as api from '@/lib/packApi';

const POLL_MS = 7000;
const FILTERS = ['Everything', 'My stuff', 'Unclaimed'];

function PackTripPage() {
  const { token } = useParams();
  const [trip, setTrip] = useState(null);
  const [items, setItems] = useState([]);
  const [status, setStatus] = useState('loading'); // loading | ready | missing | error
  const [error, setError] = useState('');

  const [who, setWhoState] = useState(getWho());
  const [nameDraft, setNameDraft] = useState('');
  const [filter, setFilter] = useState(FILTERS[0]);
  const [copied, setCopied] = useState(false);

  const [newName, setNewName] = useState('');
  const [newCat, setNewCat] = useState(CATEGORIES[0]);
  const [newNote, setNewNote] = useState('');

  // Writes are optimistic. While any are in flight, polls are skipped so a slow
  // response can't stomp a change the user just made.
  const pending = useRef(0);

  const refresh = useCallback(
    async ({ force = false } = {}) => {
      if (!force && pending.current > 0) return;
      try {
        const data = await api.loadTrip(token);
        if (!data) {
          setStatus('missing');
          return;
        }
        if (pending.current > 0 && !force) return;
        setTrip(data.trip);
        setItems(data.items || []);
        setStatus('ready');
        rememberTrip(token, data.trip.name || 'Untitled trip');
      } catch (e) {
        setError(e.message || 'Could not reach the list.');
        setStatus((s) => (s === 'ready' ? 'ready' : 'error'));
      }
    },
    [token]
  );

  useEffect(() => {
    if (!api.isConfigured) {
      setStatus('error');
      setError('Supabase is not configured for this build.');
      return undefined;
    }
    refresh({ force: true });
    const id = setInterval(refresh, POLL_MS);
    const onFocus = () => refresh();
    window.addEventListener('focus', onFocus);
    return () => {
      clearInterval(id);
      window.removeEventListener('focus', onFocus);
    };
  }, [refresh]);

  useEffect(() => {
    if (trip) setNameDraft(trip.name);
  }, [trip?.token]); // eslint-disable-line react-hooks/exhaustive-deps

  // Run a write optimistically: apply `optimistic` to local state, then reconcile.
  const write = async (optimistic, fn) => {
    pending.current += 1;
    setItems(optimistic);
    try {
      await fn();
      setError('');
    } catch (e) {
      setError(e.message || 'That change did not save.');
    } finally {
      pending.current -= 1;
      if (pending.current === 0) refresh({ force: true });
    }
  };

  const togglePacked = (item) =>
    write(
      items.map((i) => (i.id === item.id ? { ...i, packed: !i.packed } : i)),
      () => api.setPacked(token, item.id, !item.packed)
    );

  const toggleClaim = (item) => {
    if (!who) return;
    const next = item.claimed_by === who ? '' : who;
    write(
      items.map((i) => (i.id === item.id ? { ...i, claimed_by: next || null } : i)),
      () => api.setClaim(token, item.id, next)
    );
  };

  const removeItem = (item) =>
    write(
      items.filter((i) => i.id !== item.id),
      () => api.deleteItem(token, item.id)
    );

  const addItem = async () => {
    const name = newName.trim();
    if (!name) return;
    const note = newNote.trim();
    setNewName('');
    setNewNote('');
    pending.current += 1;
    try {
      const created = await api.addItem(token, newCat, name, note);
      setItems((prev) => [...prev, created]);
      setError('');
    } catch (e) {
      setError(e.message || 'Could not add that item.');
    } finally {
      pending.current -= 1;
      if (pending.current === 0) refresh({ force: true });
    }
  };

  const saveTripMeta = (name, mode) => {
    setTrip((t) => ({ ...t, name, mode }));
    api.updateTrip(token, name, mode).catch((e) => setError(e.message));
  };

  const copyLink = async () => {
    try {
      await navigator.clipboard.writeText(window.location.href);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      window.prompt('Copy this link and send it to your crew:', window.location.href);
    }
  };

  const saveWho = (value) => {
    const v = value.trim().slice(0, 60);
    setWhoState(v);
    setWho(v);
  };

  const visible = useMemo(() => {
    if (filter === 'My stuff') return items.filter((i) => i.claimed_by && i.claimed_by === who);
    if (filter === 'Unclaimed') return items.filter((i) => !i.claimed_by);
    return items;
  }, [items, filter, who]);

  const groupOrder = useMemo(() => {
    const known = CATEGORIES.filter((c) => items.some((i) => i.cat === c));
    const extra = [...new Set(items.map((i) => i.cat))].filter((c) => !CATEGORIES.includes(c));
    return [...known, ...extra.sort()];
  }, [items]);

  const packedCount = items.filter((i) => i.packed).length;
  const claimedCount = items.filter((i) => i.claimed_by).length;

  const people = useMemo(
    () => [...new Set(items.map((i) => i.claimed_by).filter(Boolean))].sort(),
    [items]
  );

  if (status === 'loading') {
    return (
      <div className="flex items-center gap-3 text-[#6B7C6B] py-20 justify-center">
        <Loader2 className="animate-spin" size={20} /> Loading the list…
      </div>
    );
  }

  if (status === 'missing' || (status === 'error' && !trip)) {
    return (
      <div className="max-w-lg mx-auto text-center py-20 space-y-4">
        <AlertCircle className="mx-auto text-[#B85C5C]" size={32} />
        <h1 className="text-2xl font-bold text-[#2C3E2E]">
          {status === 'missing' ? "That trip link doesn't exist" : 'Could not load the list'}
        </h1>
        <p className="text-[#6B7C6B]">{error || 'Check the link, or start a new trip.'}</p>
        <Link to="/pack">
          <Button className="bg-[#8B9E7D] text-white hover:bg-[#6B8560]">Start a new trip</Button>
        </Link>
      </div>
    );
  }

  return (
    <>
      <Helmet>
        <title>{trip.name || 'Camp Loadout'} - Pack | BeigeSocks</title>
      </Helmet>

      <style>{`
        @media print {
          @page { margin: 14mm; }
          html, body { background: #fff !important; }
          body * { visibility: hidden !important; background: transparent !important; }
          #pack-printable .print-box.is-packed { background: #000 !important; }
          #pack-printable, #pack-printable * { visibility: visible !important; }
          #pack-printable { position: absolute; left: 0; top: 0; width: 100%; }
          .no-print { display: none !important; }
        }
      `}</style>

      <div className="space-y-6">
        {/* Title + share */}
        <div className="no-print">
          <div className="flex items-start justify-between gap-4 flex-wrap">
            <div className="flex items-center gap-3">
              <Tent className="text-[#8B9E7D]" size={30} />
              <input
                value={nameDraft}
                placeholder="Name this trip…"
                onChange={(e) => setNameDraft(e.target.value)}
                onBlur={() => nameDraft !== trip.name && saveTripMeta(nameDraft, trip.mode)}
                onKeyDown={(e) => e.key === 'Enter' && e.currentTarget.blur()}
                className="text-3xl font-bold text-[#2C3E2E] bg-transparent border-b border-transparent hover:border-[#D4D8D0] focus:border-[#8B9E7D] focus:outline-none max-w-full"
              />
            </div>
            <div className="flex items-center gap-2">
              <Button
                onClick={copyLink}
                variant="outline"
                className="bg-white text-[#2C3E2E] border-[#D4D8D0] hover:bg-[#F0F2EE]"
              >
                <Link2 className="mr-2" size={16} /> {copied ? 'Link copied' : 'Copy invite link'}
              </Button>
              <Button
                onClick={() => window.print()}
                className="bg-[#8B9E7D] text-white hover:bg-[#6B8560]"
              >
                <Printer className="mr-2" size={16} /> Print / PDF
              </Button>
            </div>
          </div>
          <p className="text-[#6B7C6B] text-sm mt-2">
            Everyone with this link edits the same list. Changes from your crew show up within a few
            seconds.
          </p>
        </div>

        {/* Who am I + status bar */}
        <div className="bg-white rounded-xl p-4 border border-[#D4D8D0] no-print">
          <div className="flex items-center gap-3 flex-wrap">
            <div className="flex items-center gap-2">
              <User size={16} className="text-[#8B9E7D]" />
              <span className="text-sm text-[#6B7C6B]">You are</span>
              <Input
                value={who}
                placeholder="your name"
                onChange={(e) => saveWho(e.target.value)}
                className="h-8 w-36"
              />
            </div>
            <select
              value={trip.mode}
              onChange={(e) => saveTripMeta(trip.name, e.target.value)}
              className="bg-[#F0F2EE] text-[#2C3E2E] border border-[#D4D8D0] rounded-md px-3 h-8 text-sm"
            >
              {TRIP_MODES.map((m) => (
                <option key={m}>{m}</option>
              ))}
            </select>
            <div className="flex gap-1">
              {FILTERS.map((f) => (
                <button
                  key={f}
                  onClick={() => setFilter(f)}
                  className={`text-sm px-3 h-8 rounded-md border transition-colors ${
                    filter === f
                      ? 'bg-[#8B9E7D] text-white border-[#6B8560]'
                      : 'bg-white text-[#2C3E2E] border-[#D4D8D0] hover:bg-[#F0F2EE]'
                  }`}
                >
                  {f}
                </button>
              ))}
            </div>
            <div className="flex-1" />
            <Badge variant="secondary">{items.length} items</Badge>
            <Badge variant="success">{claimedCount} claimed</Badge>
            <Badge variant="secondary">{packedCount} packed</Badge>
            <button
              onClick={() => refresh({ force: true })}
              title="Refresh now"
              className="text-[#6B7C6B] hover:text-[#2C3E2E]"
            >
              <RefreshCw size={15} />
            </button>
          </div>

          {!who && (
            <p className="text-sm text-[#8A6D3B] bg-[#FDF8E8] border border-[#E8DCB5] rounded-md px-3 py-2 mt-3">
              Put your name in above so you can claim what you're bringing.
            </p>
          )}
          {people.length > 0 && (
            <p className="text-xs text-[#6B7C6B] mt-3">
              Bringing stuff: {people.join(' · ')}
            </p>
          )}
          {error && <p className="text-sm text-[#B85C5C] mt-2">{error}</p>}
        </div>

        {/* Add item */}
        <div className="bg-[#E8EDE5] rounded-xl p-4 border border-[#D4D8D0] no-print">
          <div className="grid md:grid-cols-[1fr_1fr_1fr_auto] gap-3 items-end">
            <div>
              <label className="text-[#6B7C6B] text-sm block mb-1">Item</label>
              <Input
                placeholder="What is it?"
                value={newName}
                onChange={(e) => setNewName(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && addItem()}
              />
            </div>
            <div>
              <label className="text-[#6B7C6B] text-sm block mb-1">Category</label>
              <select
                value={newCat}
                onChange={(e) => setNewCat(e.target.value)}
                className="w-full bg-white text-[#2C3E2E] border border-[#D4D8D0] rounded-md px-3 py-2 h-10"
              >
                {CATEGORIES.map((c) => (
                  <option key={c}>{c}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="text-[#6B7C6B] text-sm block mb-1">Note (optional)</label>
              <Input
                placeholder="e.g. Jake's epi pen, basecamp only"
                value={newNote}
                onChange={(e) => setNewNote(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && addItem()}
              />
            </div>
            <Button onClick={addItem} className="bg-[#8B9E7D] text-white hover:bg-[#6B8560] h-10">
              <Plus size={18} />
            </Button>
          </div>
        </div>

        {/* The list */}
        <div className="space-y-6 no-print">
          {groupOrder.map((cat) => {
            const rows = visible.filter((i) => i.cat === cat);
            if (rows.length === 0) return null;
            return (
              <section key={cat}>
                <div className="flex items-center justify-between mb-2">
                  <h3 className="text-lg font-bold text-[#2C3E2E]">{cat}</h3>
                  <span className="text-[#6B7C6B] text-sm">
                    {rows.filter((i) => i.packed).length}/{rows.length} packed
                  </span>
                </div>
                <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-2">
                  {rows.map((item) => {
                    const mine = item.claimed_by && item.claimed_by === who;
                    return (
                      <div
                        key={item.id}
                        className={`group flex items-start gap-3 rounded-lg border p-3 transition-colors ${
                          item.packed
                            ? 'bg-[#EDF1EA] border-[#C3D0BC]'
                            : 'bg-white border-[#D4D8D0]'
                        }`}
                      >
                        <button
                          onClick={() => togglePacked(item)}
                          aria-label={item.packed ? `Mark ${item.name} unpacked` : `Mark ${item.name} packed`}
                          className={`mt-0.5 flex h-5 w-5 flex-shrink-0 items-center justify-center rounded border ${
                            item.packed
                              ? 'bg-[#8B9E7D] border-[#6B8560]'
                              : 'border-[#D4D8D0] hover:border-[#8B9E7D]'
                          }`}
                        >
                          {item.packed && <Check size={14} className="text-white" />}
                        </button>

                        <div className="flex-1 min-w-0">
                          <p
                            className={`text-sm font-medium ${
                              item.packed ? 'text-[#6B7C6B] line-through' : 'text-[#2C3E2E]'
                            }`}
                          >
                            {item.name}
                          </p>
                          {item.note && <p className="text-xs text-[#6B7C6B] mt-0.5">{item.note}</p>}

                          <button
                            onClick={() => toggleClaim(item)}
                            disabled={!who}
                            title={
                              !who
                                ? 'Add your name above to claim items'
                                : mine
                                  ? 'Give this up'
                                  : item.claimed_by
                                    ? `Take this over from ${item.claimed_by}`
                                    : 'Claim this'
                            }
                            className={`mt-2 text-xs rounded-full px-2 py-0.5 border transition-colors disabled:cursor-not-allowed disabled:opacity-60 ${
                              mine
                                ? 'bg-[#8B9E7D] text-white border-[#6B8560]'
                                : item.claimed_by
                                  ? 'bg-[#F0F2EE] text-[#4A5A4A] border-[#D4D8D0] hover:border-[#8B9E7D]'
                                  : 'bg-transparent text-[#6B7C6B] border-dashed border-[#C3C8BE] hover:border-[#8B9E7D] hover:text-[#2C3E2E]'
                            }`}
                          >
                            {item.claimed_by ? item.claimed_by : '+ claim'}
                          </button>
                        </div>

                        <button
                          onClick={() => removeItem(item)}
                          className="opacity-0 group-hover:opacity-100 focus:opacity-100 transition-opacity text-[#6B7C6B] hover:text-[#B85C5C]"
                          aria-label={`Remove ${item.name}`}
                        >
                          <Trash2 size={15} />
                        </button>
                      </div>
                    );
                  })}
                </div>
              </section>
            );
          })}

          {visible.length === 0 && (
            <p className="text-[#6B7C6B] text-center py-10">
              {items.length === 0
                ? 'Nothing on the list yet — add the first thing above.'
                : `Nothing matches "${filter}".`}
            </p>
          )}
        </div>

        <PrintableList trip={trip} items={items} people={people} />
      </div>
    </>
  );
}

function PrintableList({ trip, items, people }) {
  const groups = useMemo(() => {
    const known = CATEGORIES.filter((c) => items.some((i) => i.cat === c));
    const extra = [...new Set(items.map((i) => i.cat))].filter((c) => !CATEGORIES.includes(c));
    return [...known, ...extra.sort()].map((cat) => ({
      cat,
      rows: items.filter((i) => i.cat === cat),
    }));
  }, [items]);

  const printed = new Date().toLocaleDateString(undefined, {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  });

  return (
    <div id="pack-printable" className="hidden print:block" style={{ color: '#000' }}>
      <div style={{ borderBottom: '2px solid #000', paddingBottom: '6px', marginBottom: '10px' }}>
        <h1 style={{ fontSize: '20pt', fontWeight: 700, margin: 0, lineHeight: 1.15 }}>
          {trip.name || 'Camp Loadout'}
        </h1>
        <p style={{ fontSize: '9pt', margin: '4px 0 0', color: '#444' }}>
          {trip.mode} · {items.length} items · {printed} · beigesocks.com/pack
        </p>
        {people.length > 0 && (
          <p style={{ fontSize: '9pt', margin: '2px 0 0', color: '#444' }}>
            Crew: {people.join(' · ')}
          </p>
        )}
      </div>

      <div style={{ columnCount: 2, columnGap: '20px' }}>
        {groups.map(({ cat, rows }) => (
          <div key={cat} style={{ breakInside: 'avoid', marginBottom: '10px' }}>
            <h2
              style={{
                fontSize: '10pt',
                fontWeight: 700,
                textTransform: 'uppercase',
                letterSpacing: '0.06em',
                borderBottom: '1px solid #999',
                paddingBottom: '2px',
                marginBottom: '4px',
              }}
            >
              {cat}
            </h2>
            {rows.map((item) => (
              <div
                key={item.id}
                style={{
                  fontSize: '9.5pt',
                  lineHeight: 1.35,
                  marginBottom: '3px',
                  display: 'flex',
                  gap: '6px',
                  breakInside: 'avoid',
                }}
              >
                <span
                  className={`print-box${item.packed ? ' is-packed' : ''}`}
                  style={{
                    display: 'inline-block',
                    width: '9pt',
                    height: '9pt',
                    border: '1px solid #000',
                    flexShrink: 0,
                    marginTop: '2pt',
                  }}
                />
                <span>
                  {item.name}
                  {item.note ? (
                    <span style={{ color: '#555' }}> — {item.note}</span>
                  ) : null}
                  {item.claimed_by ? (
                    <span style={{ fontWeight: 700 }}> [{item.claimed_by}]</span>
                  ) : null}
                </span>
              </div>
            ))}
          </div>
        ))}
      </div>

      {items.length === 0 && <p style={{ fontSize: '10pt' }}>Nothing on the list yet.</p>}
    </div>
  );
}

export default PackTripPage;
