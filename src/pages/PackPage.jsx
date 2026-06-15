import React, { useState, useEffect, useMemo } from 'react';
import { Helmet } from 'react-helmet';
import { motion } from 'framer-motion';
import { Plus, Trash2, Printer, Check, Tent, RotateCcw } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';

const CATEGORIES = [
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

const TRIP_MODES = ['Kid / Basecamp', 'Canoe / Moving Camp'];

const STORAGE_KEY = 'beigesocks-pack-v1';

// Seeded from Patrick's real master inventory so the locker isn't empty on first run.
const STARTER_GEAR = [
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
].map((g, i) => ({ id: `seed-${i}`, ...g }));

function loadState() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) return JSON.parse(raw);
  } catch {
    // fall through to default
  }
  return { gear: STARTER_GEAR, trip: { name: '', mode: TRIP_MODES[0], chosen: {} } };
}

function PackPage() {
  const [gear, setGear] = useState([]);
  const [trip, setTrip] = useState({ name: '', mode: TRIP_MODES[0], chosen: {} });
  const [newName, setNewName] = useState('');
  const [newCat, setNewCat] = useState(CATEGORIES[0]);
  const [newNote, setNewNote] = useState('');

  useEffect(() => {
    const s = loadState();
    setGear(s.gear || STARTER_GEAR);
    setTrip(s.trip || { name: '', mode: TRIP_MODES[0], chosen: {} });
  }, []);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify({ gear, trip }));
    } catch {
      // storage full or unavailable — non-fatal for a single-user tool
    }
  }, [gear, trip]);

  const addGear = () => {
    const name = newName.trim();
    if (!name) return;
    setGear((prev) => [
      ...prev,
      { id: `g-${Date.now()}`, cat: newCat, name, note: newNote.trim() || undefined },
    ]);
    setNewName('');
    setNewNote('');
  };

  const removeGear = (id) => {
    setGear((prev) => prev.filter((g) => g.id !== id));
    setTrip((prev) => {
      const chosen = { ...prev.chosen };
      delete chosen[id];
      return { ...prev, chosen };
    });
  };

  const toggleChosen = (id) =>
    setTrip((prev) => ({ ...prev, chosen: { ...prev.chosen, [id]: !prev.chosen[id] } }));

  const resetTrip = () => setTrip((prev) => ({ ...prev, chosen: {} }));

  const byCategory = useMemo(() => {
    const map = {};
    CATEGORIES.forEach((c) => (map[c] = []));
    gear.forEach((g) => {
      if (!map[g.cat]) map[g.cat] = [];
      map[g.cat].push(g);
    });
    return map;
  }, [gear]);

  const chosenList = useMemo(
    () => gear.filter((g) => trip.chosen[g.id]),
    [gear, trip.chosen]
  );

  const chosenByCategory = useMemo(() => {
    const map = {};
    chosenList.forEach((g) => {
      (map[g.cat] = map[g.cat] || []).push(g);
    });
    return map;
  }, [chosenList]);

  return (
    <>
      <Helmet>
        <title>Pack - Camp Loadout Builder | BeigeSocks</title>
        <meta
          name="description"
          content="Build a trip loadout from your own gear locker, then print a packing checklist. Pack for the trip you actually have."
        />
      </Helmet>

      <style>{`
        @media print {
          body * { visibility: hidden !important; }
          #pack-printable, #pack-printable * { visibility: visible !important; }
          #pack-printable { position: absolute; left: 0; top: 0; width: 100%; padding: 24px; }
          .no-print { display: none !important; }
        }
      `}</style>

      <div className="space-y-8">
        <div className="flex items-start justify-between gap-4 flex-wrap">
          <div>
            <h1 className="text-4xl font-bold text-[#2C3E2E] flex items-center gap-3">
              <Tent className="text-[#8B9E7D]" size={34} />
              Pack
            </h1>
            <p className="text-[#6B7C6B] mt-2 max-w-xl">
              Your gear lives in the locker, tagged by system. Build a trip by checking what
              actually comes. Pack for the trip you have, not the one you picture.
            </p>
          </div>
        </div>

        {/* Trip setup */}
        <div className="bg-white rounded-xl p-6 border border-[#D4D8D0]">
          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <label className="text-[#6B7C6B] text-sm block mb-1">Trip name</label>
              <Input
                placeholder="Emerald Isle, Delaware run…"
                value={trip.name}
                onChange={(e) => setTrip({ ...trip, name: e.target.value })}
              />
            </div>
            <div>
              <label className="text-[#6B7C6B] text-sm block mb-1">Mode</label>
              <select
                value={trip.mode}
                onChange={(e) => setTrip({ ...trip, mode: e.target.value })}
                className="w-full bg-[#F0F2EE] text-[#2C3E2E] border border-[#D4D8D0] rounded-md px-3 py-2 h-10"
              >
                {TRIP_MODES.map((m) => (
                  <option key={m}>{m}</option>
                ))}
              </select>
            </div>
          </div>
          <div className="flex items-center gap-3 mt-4 flex-wrap">
            <Badge variant="success">{chosenList.length} chosen</Badge>
            <Badge variant="secondary">{gear.length} in locker</Badge>
            <div className="flex-1" />
            <Button
              onClick={resetTrip}
              variant="outline"
              className="bg-white text-[#2C3E2E] border-[#D4D8D0] hover:bg-[#F0F2EE]"
            >
              <RotateCcw className="mr-2" size={16} /> Clear picks
            </Button>
            <Button
              onClick={() => window.print()}
              className="bg-[#8B9E7D] text-white hover:bg-[#6B8560]"
            >
              <Printer className="mr-2" size={16} /> Print checklist
            </Button>
          </div>
        </div>

        {/* Add gear */}
        <div className="bg-[#E8EDE5] rounded-xl p-6 border border-[#D4D8D0]">
          <h2 className="text-lg font-bold text-[#2C3E2E] mb-4">Add to locker</h2>
          <div className="grid md:grid-cols-[1fr_1fr_1fr_auto] gap-3 items-end">
            <div>
              <label className="text-[#6B7C6B] text-sm block mb-1">Item</label>
              <Input
                placeholder="What is it?"
                value={newName}
                onChange={(e) => setNewName(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && addGear()}
              />
            </div>
            <div>
              <label className="text-[#6B7C6B] text-sm block mb-1">Category</label>
              <select
                value={newCat}
                onChange={(e) => setNewCat(e.target.value)}
                className="w-full bg-[#F0F2EE] text-[#2C3E2E] border border-[#D4D8D0] rounded-md px-3 py-2 h-10"
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
                onKeyDown={(e) => e.key === 'Enter' && addGear()}
              />
            </div>
            <Button onClick={addGear} className="bg-[#8B9E7D] text-white hover:bg-[#6B8560] h-10">
              <Plus size={18} />
            </Button>
          </div>
        </div>

        {/* Locker by category */}
        <div className="space-y-6 no-print">
          {CATEGORIES.map((cat) => {
            const items = byCategory[cat] || [];
            if (items.length === 0) return null;
            return (
              <motion.section
                key={cat}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.25 }}
              >
                <div className="flex items-center justify-between mb-3">
                  <h3 className="text-xl font-bold text-[#2C3E2E]">{cat}</h3>
                  <span className="text-[#6B7C6B] text-sm">
                    {items.filter((g) => trip.chosen[g.id]).length}/{items.length}
                  </span>
                </div>
                <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-3">
                  {items.map((g) => {
                    const isChosen = !!trip.chosen[g.id];
                    return (
                      <div
                        key={g.id}
                        className={`group flex items-start gap-3 rounded-lg border p-3 transition-all cursor-pointer ${
                          isChosen
                            ? 'bg-[#8B9E7D] border-[#6B8560]'
                            : 'bg-white border-[#D4D8D0] hover:border-[#8B9E7D]'
                        }`}
                        onClick={() => toggleChosen(g.id)}
                      >
                        <div
                          className={`mt-0.5 flex h-5 w-5 flex-shrink-0 items-center justify-center rounded border ${
                            isChosen ? 'bg-white border-white' : 'border-[#D4D8D0]'
                          }`}
                        >
                          {isChosen && <Check size={14} className="text-[#6B8560]" />}
                        </div>
                        <div className="flex-1 min-w-0">
                          <p
                            className={`text-sm font-medium ${
                              isChosen ? 'text-white' : 'text-[#2C3E2E]'
                            }`}
                          >
                            {g.name}
                          </p>
                          {g.note && (
                            <p
                              className={`text-xs mt-0.5 ${
                                isChosen ? 'text-white/80' : 'text-[#6B7C6B]'
                              }`}
                            >
                              {g.note}
                            </p>
                          )}
                        </div>
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            removeGear(g.id);
                          }}
                          className={`opacity-0 group-hover:opacity-100 transition-opacity ${
                            isChosen ? 'text-white/70 hover:text-white' : 'text-[#6B7C6B] hover:text-[#B85C5C]'
                          }`}
                          aria-label={`Remove ${g.name}`}
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
                    );
                  })}
                </div>
              </motion.section>
            );
          })}
        </div>

        {/* Printable checklist */}
        <div id="pack-printable" className="hidden print:block">
          <h1 style={{ fontSize: '24px', fontWeight: 700, marginBottom: '4px' }}>
            {trip.name || 'Camp Loadout'}
          </h1>
          <p style={{ fontSize: '13px', color: '#555', marginBottom: '16px' }}>
            {trip.mode} · {chosenList.length} items · BeigeSocks
          </p>
          {CATEGORIES.map((cat) => {
            const items = chosenByCategory[cat] || [];
            if (items.length === 0) return null;
            return (
              <div key={cat} style={{ marginBottom: '12px' }}>
                <h2 style={{ fontSize: '15px', fontWeight: 700, marginBottom: '4px' }}>{cat}</h2>
                {items.map((g) => (
                  <div key={g.id} style={{ fontSize: '13px', marginBottom: '2px' }}>
                    ☐ {g.name}
                    {g.note ? ` — ${g.note}` : ''}
                  </div>
                ))}
              </div>
            );
          })}
          {chosenList.length === 0 && (
            <p style={{ fontSize: '13px' }}>Nothing chosen yet — check items in the locker first.</p>
          )}
        </div>
      </div>
    </>
  );
}

export default PackPage;
