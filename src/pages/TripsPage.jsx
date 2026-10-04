import React, { useEffect, useState } from 'react';
import { Helmet } from 'react-helmet';
import { useNavigate } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';

// No sign in. The trips list is reached by its code, and the browser
// remembers the last one so the pigeon goes straight there next time.
export const TRIPS_LAST_KEY = 'bs-trips-last';

function TripsPage() {
  const navigate = useNavigate();
  const [token, setToken] = useState('');
  let last = null;
  try { last = localStorage.getItem(TRIPS_LAST_KEY); } catch { /* private mode */ }

  useEffect(() => {
    if (last) navigate(`/trips/${last}`, { replace: true });
  }, [last, navigate]);

  const open = (t) => {
    const clean = (t || '').trim();
    if (!clean) return;
    navigate(`/trips/${clean}`);
  };

  return (
    <>
      <Helmet>
        <title>Trips | BeigeSocks</title>
      </Helmet>

      <div className="max-w-xl">
        <div className="flex items-center gap-3 mb-2">
          <img src="/Pigeon.JPG" alt="" className="h-12 w-12 rounded-full object-cover border-2 border-[#D8401F]" />
          <h1 className="text-3xl font-extrabold tracking-tight">Trips</h1>
        </div>
        <p className="text-[#6F655A] mb-8">
          What to bring, and what each place already has.
        </p>

        <form
          onSubmit={(e) => { e.preventDefault(); open(token); }}
          className="band-card p-5 pt-7 flex flex-col gap-3"
        >
          <label htmlFor="trips-token" className="text-sm font-semibold">
            Trips code
          </label>
          <div className="flex gap-2">
            <Input
              id="trips-token"
              value={token}
              onChange={(e) => setToken(e.target.value)}
              placeholder="paste the code from your link"
              autoComplete="off"
              spellCheck="false"
            />
            <Button type="submit" disabled={!token.trim()}>
              Open <ArrowRight className="w-4 h-4 ml-1" />
            </Button>
          </div>
        </form>
      </div>
    </>
  );
}

export default TripsPage;
