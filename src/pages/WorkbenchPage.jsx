import React, { useState } from 'react';
import { Helmet } from 'react-helmet';
import { useNavigate } from 'react-router-dom';
import { Wrench, ArrowRight } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';

// There is no sign in. A workbench is reached by its token, the same way a
// Pack trip is. Paste the token once and the browser remembers the link.
const LAST_KEY = 'bs-workbench-last';

function WorkbenchPage() {
  const navigate = useNavigate();
  const [token, setToken] = useState('');
  let last = null;
  try { last = localStorage.getItem(LAST_KEY); } catch { /* private mode */ }

  const open = (t) => {
    const clean = (t || '').trim();
    if (!clean) return;
    try { localStorage.setItem(LAST_KEY, clean); } catch { /* private mode */ }
    navigate(`/workbench/${clean}`);
  };

  return (
    <>
      <Helmet>
        <title>Workbench | BeigeSocks</title>
        <meta name="description" content="Parts inventory and project builder." />
      </Helmet>

      <div className="max-w-xl">
        <div className="flex items-center gap-3 mb-2">
          <Wrench className="w-6 h-6 text-[#D8401F]" />
          <h1 className="text-3xl font-bold">Workbench</h1>
        </div>
        <p className="text-[#6F655A] mb-8">
          Write up a project, list what it needs, and see what you already have
          against what you have to order.
        </p>

        <form
          onSubmit={(e) => { e.preventDefault(); open(token); }}
          className="band-card p-5 pt-7 flex flex-col gap-3"
        >
          <label htmlFor="wb-token" className="text-sm font-semibold">
            Workbench code
          </label>
          <div className="flex gap-2">
            <Input
              id="wb-token"
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
          {last && (
            <button
              type="button"
              onClick={() => open(last)}
              className="text-sm text-[#B3321A] underline self-start"
            >
              Open the one you used last time
            </button>
          )}
        </form>
      </div>
    </>
  );
}

export default WorkbenchPage;
