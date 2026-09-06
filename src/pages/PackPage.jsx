import React, { useState } from 'react';
import { Helmet } from 'react-helmet';
import { useNavigate, Link } from 'react-router-dom';
import { Tent, Loader2, ArrowRight } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { CATEGORIES, TRIP_MODES, STARTER_GEAR, getRecentTrips, rememberTrip } from '@/lib/packData';
import { createTrip, isConfigured } from '@/lib/packApi';

function PackPage() {
  const navigate = useNavigate();
  const [name, setName] = useState('');
  const [mode, setMode] = useState(TRIP_MODES[0]);
  const [seed, setSeed] = useState(true);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState('');
  const recent = getRecentTrips();

  const start = async () => {
    setBusy(true);
    setError('');
    try {
      const token = await createTrip(name.trim(), mode, seed ? STARTER_GEAR : []);
      rememberTrip(token, name.trim() || 'Untitled trip');
      navigate(`/pack/${token}`);
    } catch (e) {
      setError(e.message || 'Could not create the trip.');
      setBusy(false);
    }
  };

  return (
    <>
      <Helmet>
        <title>Pack - Shared Camp Loadout | BeigeSocks</title>
        <meta
          name="description"
          content="Build a shared camping packing list, claim what you're bringing, and print the checklist."
        />
      </Helmet>

      <div className="max-w-2xl mx-auto space-y-8">
        <div>
          <h1 className="text-4xl font-bold text-[#2C3E2E] flex items-center gap-3">
            <Tent className="text-[#8B9E7D]" size={34} />
            Pack
          </h1>
          <p className="text-[#6B7C6B] mt-2">
            Start a trip, send the link to everyone coming. You all edit the same list and claim
            what you're bringing, so nobody shows up with three coolers and no stove.
          </p>
        </div>

        {!isConfigured ? (
          <div className="bg-[#FDF3F3] border border-[#E5C3C3] rounded-xl p-6 text-[#8A4A4A]">
            <p className="font-semibold">Not connected to the database yet.</p>
            <p className="text-sm mt-1">
              Set <code>VITE_SUPABASE_URL</code> and <code>VITE_SUPABASE_ANON_KEY</code>, then
              rebuild. See <code>.env.example</code>.
            </p>
          </div>
        ) : (
          <div className="bg-white rounded-xl p-6 border border-[#D4D8D0] space-y-4">
            <div>
              <label className="text-[#6B7C6B] text-sm block mb-1">Trip name</label>
              <Input
                autoFocus
                placeholder="Emerald Isle, Delaware run…"
                value={name}
                onChange={(e) => setName(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && !busy && start()}
              />
            </div>
            <div>
              <label className="text-[#6B7C6B] text-sm block mb-1">Mode</label>
              <select
                value={mode}
                onChange={(e) => setMode(e.target.value)}
                className="w-full bg-[#F0F2EE] text-[#2C3E2E] border border-[#D4D8D0] rounded-md px-3 py-2 h-10"
              >
                {TRIP_MODES.map((m) => (
                  <option key={m}>{m}</option>
                ))}
              </select>
            </div>
            <label className="flex items-start gap-3 cursor-pointer">
              <input
                type="checkbox"
                checked={seed}
                onChange={(e) => setSeed(e.target.checked)}
                className="mt-1 h-4 w-4 accent-[#8B9E7D]"
              />
              <span className="text-sm text-[#2C3E2E]">
                Start from my gear locker
                <span className="text-[#6B7C6B]">
                  {' '}
                  — {STARTER_GEAR.length} items across {CATEGORIES.length} categories. Uncheck for a
                  blank list.
                </span>
              </span>
            </label>

            {error && <p className="text-sm text-[#B85C5C]">{error}</p>}

            <Button
              onClick={start}
              disabled={busy}
              className="bg-[#8B9E7D] text-white hover:bg-[#6B8560] w-full h-11"
            >
              {busy ? (
                <>
                  <Loader2 className="mr-2 animate-spin" size={16} /> Creating…
                </>
              ) : (
                <>
                  Start the trip <ArrowRight className="ml-2" size={16} />
                </>
              )}
            </Button>
          </div>
        )}

        {recent.length > 0 && (
          <div>
            <h2 className="text-sm font-semibold text-[#6B7C6B] uppercase tracking-wide mb-2">
              Recent trips
            </h2>
            <div className="space-y-2">
              {recent.map((t) => (
                <Link
                  key={t.token}
                  to={`/pack/${t.token}`}
                  className="flex items-center justify-between bg-white border border-[#D4D8D0] rounded-lg px-4 py-3 hover:border-[#8B9E7D] transition-colors"
                >
                  <span className="text-[#2C3E2E] font-medium">{t.name}</span>
                  <ArrowRight size={16} className="text-[#8B9E7D]" />
                </Link>
              ))}
            </div>
          </div>
        )}
      </div>
    </>
  );
}

export default PackPage;
