import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { Helmet } from 'react-helmet';
import { useParams, Link } from 'react-router-dom';
import {
  Plus, Trash2, ArrowLeft, Loader2, AlertCircle, PackageSearch, ShoppingCart, Wrench, Minus,
} from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  CATEGORIES, STATUSES, ACTIVE_STATUSES, categoryOf, statusLabel, getKidMode, setKidMode,
} from '@/lib/workbenchData';
import * as api from '@/lib/workbenchApi';

const TABS = [
  { id: 'projects', label: 'Projects', icon: Wrench },
  { id: 'parts', label: 'Parts', icon: PackageSearch },
  { id: 'order', label: 'To order', icon: ShoppingCart },
];

function WorkbenchSpacePage() {
  const { token } = useParams();
  const [space, setSpace] = useState(null);
  const [status, setStatus] = useState('loading'); // loading | ready | missing | error
  const [error, setError] = useState('');
  const [tab, setTab] = useState('projects');
  const [openId, setOpenId] = useState(null);
  const [kid, setKid] = useState(getKidMode());

  const refresh = useCallback(async () => {
    try {
      const data = await api.loadSpace(token);
      if (!data) { setStatus('missing'); return; }
      setSpace(data);
      setStatus('ready');
    } catch (e) {
      setError(e.message || 'Could not reach the workbench.');
      setStatus((s) => (s === 'ready' ? 'ready' : 'error'));
    }
  }, [token]);

  useEffect(() => {
    if (!api.isConfigured) {
      setStatus('error');
      setError('Supabase is not configured for this build.');
      return undefined;
    }
    refresh();
    const onFocus = () => refresh();
    window.addEventListener('focus', onFocus);
    return () => window.removeEventListener('focus', onFocus);
  }, [refresh]);

  const run = async (fn) => {
    try { await fn(); await refresh(); }
    catch (e) { setError(e.message || 'That did not save.'); }
  };

  // How many of a part are already spoken for by other active projects.
  // Nothing is reserved. This only warns you when two builds want the same
  // six motors.
  const committed = useMemo(() => {
    if (!space) return () => 0;
    const active = new Set(
      space.projects.filter((p) => ACTIVE_STATUSES.includes(p.status)).map((p) => p.id)
    );
    return (partId, exceptProjectId) =>
      space.lines
        .filter((l) => l.part_id === partId && active.has(l.project_id) && l.project_id !== exceptProjectId)
        .reduce((n, l) => n + (l.qty || 0), 0);
  }, [space]);

  const lineState = (line, projectId) => {
    const need = line.qty || 0;
    if (!line.part_id) return { code: 'unknown', short: need };
    const part = space.parts.find((p) => p.id === line.part_id);
    if (!part) return { code: 'unknown', short: need };
    const free = (part.qty || 0) - committed(part.id, projectId);
    return free >= need
      ? { code: 'have', have: part.qty, short: 0 }
      : { code: 'short', have: part.qty, short: need - Math.max(0, free) };
  };

  if (status === 'loading') {
    return <div className="flex items-center gap-2 text-[#6F655A]"><Loader2 className="w-4 h-4 animate-spin" /> Opening the workbench…</div>;
  }
  if (status === 'missing') {
    return (
      <div className="surface-elevated p-6 max-w-lg">
        <h1 className="text-xl font-bold mb-2">No workbench with that code</h1>
        <p className="text-[#6F655A] mb-4">Check the link, or open a different one.</p>
        <Link to="/workbench"><Button variant="outline">Back</Button></Link>
      </div>
    );
  }
  if (status === 'error') {
    return (
      <div className="surface-elevated p-6 max-w-lg flex gap-3">
        <AlertCircle className="w-5 h-5 text-[#A0522D] shrink-0 mt-0.5" />
        <div><h1 className="font-bold mb-1">Could not load it</h1><p className="text-[#6F655A]">{error}</p></div>
      </div>
    );
  }

  const openProject = space.projects.find((p) => p.id === openId) || null;
  const base = kid ? 'text-lg' : '';

  return (
    <div className={base}>
      <Helmet><title>{space.workspace.name} | BeigeSocks</title></Helmet>

      <div className="flex items-end justify-between gap-4 flex-wrap mb-6">
        <div>
          <p className="text-xs tracking-widest uppercase text-[#D8401F] font-semibold">Beigesocks</p>
          <h1 className="text-3xl font-bold">{space.workspace.name}</h1>
        </div>
        <label className="flex items-center gap-2 text-sm text-[#6F655A] bg-[#FFFBF3] border border-[#E2D7C3] rounded-full px-3 py-1.5">
          <input
            type="checkbox"
            checked={kid}
            onChange={(e) => { setKid(e.target.checked); setKidMode(e.target.checked); }}
          />
          Z mode
        </label>
      </div>

      {error && <p className="text-sm text-[#A0522D] mb-4">{error}</p>}

      <nav className="flex gap-1 border-b border-[#E2D7C3] mb-6">
        {TABS.map((t) => {
          const Icon = t.icon;
          const n = t.id === 'projects' ? space.projects.length
            : t.id === 'parts' ? space.parts.length
            : space.order.length;
          const on = tab === t.id && !openProject;
          return (
            <button
              key={t.id}
              onClick={() => { setTab(t.id); setOpenId(null); }}
              className={`flex items-center gap-2 px-4 py-2 -mb-px border-b-2 font-semibold text-sm ${
                on ? 'border-[#B3321A] text-[#2A2420]' : 'border-transparent text-[#6F655A]'
              }`}
            >
              <Icon className="w-4 h-4" />{t.label}
              <span className="text-xs tabular-nums text-[#D8401F]">{n}</span>
            </button>
          );
        })}
      </nav>

      {openProject ? (
        <ProjectDetail
          project={openProject}
          space={space}
          kid={kid}
          lineState={lineState}
          onBack={() => setOpenId(null)}
          onPatch={(fields) => run(() => api.updateProject(token, openProject.id, fields))}
          onAddLine={() => run(() => api.addLine(token, space.workspace.id, openProject.id, {
            qty: 1, want: '', sort_order: (space.lines.filter((l) => l.project_id === openProject.id).length || 0) + 1,
          }))}
          onPatchLine={(id, fields) => run(() => api.updateLine(token, id, fields))}
          onDeleteLine={(id) => run(() => api.deleteLine(token, id))}
          onDelete={() => { setOpenId(null); run(() => api.deleteProject(token, openProject.id)); }}
        />
      ) : tab === 'projects' ? (
        <Projects
          space={space}
          lineState={lineState}
          onOpen={setOpenId}
          onNew={() => run(async () => {
            const p = await api.addProject(token, space.workspace.id, { title: '', status: 'idea' });
            setOpenId(p.id);
          })}
        />
      ) : tab === 'parts' ? (
        <Parts
          space={space}
          kid={kid}
          committed={committed}
          onAdd={(fields) => run(() => api.addPart(token, space.workspace.id, fields))}
          onBump={(part, d) => run(() => api.updatePart(token, part.id, { qty: Math.max(0, (part.qty || 0) + d) }))}
          onDelete={(id) => run(() => api.deletePart(token, id))}
        />
      ) : (
        <OrderList rows={space.order} />
      )}
    </div>
  );
}

/* ---------------- projects ---------------- */

function Projects({ space, lineState, onOpen, onNew }) {
  return (
    <>
      <div className="flex items-center justify-between gap-4 mb-4">
        <p className="text-[#6F655A] text-sm">Start with the idea. Parts come later.</p>
        <Button onClick={onNew}><Plus className="w-4 h-4 mr-1" /> New project</Button>
      </div>

      {space.projects.length === 0 ? (
        <div className="surface-elevated p-8 text-center text-[#6F655A]">
          Nothing yet. A project starts as a sentence about what you want to make.
        </div>
      ) : (
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {space.projects.map((p) => {
            const lines = space.lines.filter((l) => l.project_id === p.id);
            const have = lines.filter((l) => lineState(l, p.id).code === 'have').length;
            const short = lines.length - have;
            return (
              <button
                key={p.id}
                onClick={() => onOpen(p.id)}
                className="band-card p-4 pt-6 text-left flex flex-col gap-2"
              >
                <Badge variant="secondary" className="self-start">{statusLabel(p.status)}</Badge>
                <h3 className="font-bold text-lg">{p.title || 'Untitled'}</h3>
                {p.owner && <span className="text-sm text-[#6F655A]">{p.owner}</span>}
                {lines.length > 0 ? (
                  <>
                    <span className="flex h-1.5 rounded overflow-hidden bg-[#EEE4D2]">
                      <i style={{ flex: have }} className="bg-[#3F8F4F]" />
                      <i style={{ flex: short }} className="bg-[#C8902A]" />
                    </span>
                    <span className="text-xs text-[#6F655A] tabular-nums">
                      {have} of {lines.length} lines covered
                    </span>
                  </>
                ) : (
                  <span className="text-xs text-[#6F655A]">no parts listed yet</span>
                )}
              </button>
            );
          })}
        </div>
      )}
    </>
  );
}

/* ---------------- one project ---------------- */

function ProjectDetail({ project, space, kid, lineState, onBack, onPatch, onAddLine, onPatchLine, onDeleteLine, onDelete }) {
  const [notes, setNotes] = useState(project.notes || '');
  // Reset the draft only when a different project opens. Watching project.notes
  // would stomp what you are typing every time a save comes back.
  // eslint-disable-next-line react-hooks/exhaustive-deps
  useEffect(() => { setNotes(project.notes || ''); }, [project.id]);

  const lines = space.lines.filter((l) => l.project_id === project.id);

  return (
    <div>
      <button onClick={onBack} className="text-sm text-[#6F655A] font-semibold mb-3 flex items-center gap-1">
        <ArrowLeft className="w-4 h-4" /> All projects
      </button>

      <div className="flex gap-3 items-center flex-wrap mb-6">
        <input
          value={project.title || ''}
          onChange={(e) => onPatch({ title: e.target.value })}
          placeholder="What are we making?"
          className="flex-1 min-w-[200px] text-2xl font-bold bg-transparent border-b border-transparent hover:border-[#E2D7C3] focus:border-[#B3321A] focus:outline-none py-1"
        />
        <select
          value={project.status}
          onChange={(e) => onPatch({ status: e.target.value })}
          className="bg-[#FFFBF3] border border-[#E2D7C3] rounded-lg px-3 py-2 text-sm font-semibold"
        >
          {STATUSES.map((s) => <option key={s.id} value={s.id}>{s.label}</option>)}
        </select>
      </div>

      <h2 className="font-bold mb-1">Thinking it through</h2>
      <p className="text-sm text-[#6F655A] mb-2">
        How it should work, what you are unsure about, what you tried.
      </p>
      <textarea
        value={notes}
        onChange={(e) => setNotes(e.target.value)}
        onBlur={() => { if (notes !== project.notes) onPatch({ notes }); }}
        placeholder="It should do this. I think we need a way to…"
        className="w-full min-h-[160px] surface-elevated p-4 leading-relaxed focus:outline-none focus:border-[#B3321A]"
      />

      <div className="flex items-center justify-between gap-4 mt-8 mb-2">
        <div>
          <h2 className="font-bold">Parts it needs</h2>
          <p className="text-sm text-[#6F655A]">
            Write what you need even if you have no idea what it is called.
          </p>
        </div>
        <Button variant="outline" onClick={onAddLine}><Plus className="w-4 h-4 mr-1" /> Add line</Button>
      </div>

      <div className="surface-elevated divide-y divide-[#EEE4D2]">
        {lines.length === 0 && <p className="p-4 text-sm text-[#6F655A]">No parts listed yet.</p>}
        {lines.map((l) => {
          const st = lineState(l, project.id);
          return (
            <div key={l.id} className="flex items-center gap-2 p-3">
              <input
                type="number"
                min="0"
                value={l.qty}
                onChange={(e) => onPatchLine(l.id, { qty: parseInt(e.target.value, 10) || 0 })}
                className="w-14 text-center tabular-nums bg-transparent border border-transparent hover:border-[#E2D7C3] focus:border-[#B3321A] rounded px-1 py-1 focus:outline-none"
              />
              <input
                value={l.want}
                onChange={(e) => onPatchLine(l.id, { want: e.target.value })}
                placeholder="a thing that spins the wheel"
                className="flex-1 font-medium bg-transparent border border-transparent hover:border-[#E2D7C3] focus:border-[#B3321A] rounded px-2 py-1 focus:outline-none"
              />
              <select
                value={l.part_id || ''}
                onChange={(e) => onPatchLine(l.id, { part_id: e.target.value || null })}
                className="bg-transparent border border-transparent hover:border-[#E2D7C3] focus:border-[#B3321A] rounded px-2 py-1 text-sm max-w-[150px]"
              >
                <option value="">not linked</option>
                {space.parts.map((p) => <option key={p.id} value={p.id}>{p.name}</option>)}
              </select>
              {!kid && (
                <span className="w-24 text-right">
                  {st.code === 'have' && <Badge className="bg-[#E2F0E7] text-[#2F7D4F]">have {st.have}</Badge>}
                  {st.code === 'short' && <Badge className="bg-[#F7ECD2] text-[#8A6206]">order {st.short}</Badge>}
                  {st.code === 'unknown' && <Badge variant="secondary">not linked</Badge>}
                </span>
              )}
              <button onClick={() => onDeleteLine(l.id)} className="text-[#D8401F] hover:text-[#A0522D] p-1" aria-label="Remove line">
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          );
        })}
      </div>

      <div className="mt-8">
        <Button variant="outline" onClick={onDelete} className="text-[#A0522D]">Delete this project</Button>
      </div>
    </div>
  );
}

/* ---------------- parts ---------------- */

function Parts({ space, kid, committed, onAdd, onBump, onDelete }) {
  const [name, setName] = useState('');
  const [cat, setCat] = useState(CATEGORIES[0].id);
  const [qty, setQty] = useState('');
  const [bin, setBin] = useState('');

  const submit = (e) => {
    e.preventDefault();
    if (!name.trim()) return;
    onAdd({ name: name.trim(), category: cat, qty: parseInt(qty, 10) || 0, bin: bin.trim() || null });
    setName(''); setQty(''); setBin('');
  };

  return (
    <>
      <p className="text-sm text-[#6F655A] mb-4">What you actually have, and roughly where it is.</p>

      <form onSubmit={submit} className="surface-elevated p-4 grid gap-2 sm:grid-cols-[2fr_1fr_70px_1fr_auto] mb-4">
        <Input value={name} onChange={(e) => setName(e.target.value)} placeholder="6 yellow LEDs, 5mm" />
        <select
          value={cat}
          onChange={(e) => setCat(e.target.value)}
          className="bg-[#F6F1E7] border border-[#E2D7C3] rounded-lg px-3 py-2 text-sm"
        >
          {CATEGORIES.map((c) => <option key={c.id} value={c.id}>{c.label}</option>)}
        </select>
        <Input value={qty} onChange={(e) => setQty(e.target.value)} placeholder="qty" inputMode="numeric" />
        <Input value={bin} onChange={(e) => setBin(e.target.value)} placeholder="where is it?" />
        <Button type="submit">Add</Button>
      </form>

      {space.parts.length === 0 ? (
        <div className="surface-elevated p-8 text-center text-[#6F655A]">
          Empty. Start with the salvage bin, then count what is actually in it.
        </div>
      ) : (
        <div className="surface-elevated divide-y divide-[#EEE4D2]">
          {space.parts.map((p) => {
            const c = categoryOf(p.category);
            const spoken = committed(p.id, null);
            return (
              <div key={p.id} className="flex items-center gap-3 p-3">
                <span className="w-2.5 h-2.5 rounded-sm shrink-0" style={{ background: c.color }} />
                <span className="flex-1 min-w-0">
                  <span className="font-semibold">{p.name}</span>
                  {spoken > 0 && <Badge className="ml-2 bg-[#F7ECD2] text-[#8A6206]">{spoken} spoken for</Badge>}
                  {!kid && p.part_number && (
                    <span className="block text-xs text-[#6F655A] font-mono">{p.part_number}</span>
                  )}
                </span>
                {!kid && <span className="text-xs text-[#6F655A] w-28 truncate">{p.bin}</span>}
                <span className="flex items-center gap-1">
                  <button onClick={() => onBump(p, -1)} className="w-7 h-7 border border-[#E2D7C3] rounded" aria-label="One fewer">
                    <Minus className="w-3 h-3 mx-auto" />
                  </button>
                  <span className="w-8 text-center tabular-nums font-medium">{p.qty}</span>
                  <button onClick={() => onBump(p, 1)} className="w-7 h-7 border border-[#E2D7C3] rounded" aria-label="One more">
                    <Plus className="w-3 h-3 mx-auto" />
                  </button>
                </span>
                <button onClick={() => onDelete(p.id)} className="text-[#D8401F] hover:text-[#A0522D] p-1" aria-label="Remove part">
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            );
          })}
        </div>
      )}
    </>
  );
}

/* ---------------- order list ---------------- */

function OrderList({ rows }) {
  if (!rows.length) {
    return (
      <div className="surface-elevated p-8 text-center text-[#6F655A]">
        Nothing to order. Either you have everything, or no project has moved past
        “working it out” yet.
      </div>
    );
  }
  return (
    <>
      <p className="text-sm text-[#6F655A] mb-4">
        Every project that is gathering or building, minus what is in the bins.
      </p>
      <div className="surface-elevated divide-y divide-[#EEE4D2]">
        <div className="grid grid-cols-[1fr_70px_70px_70px] gap-3 p-3 text-xs uppercase tracking-wider text-[#6F655A] font-semibold">
          <span>Part</span><span className="text-right">Need</span>
          <span className="text-right">Have</span><span className="text-right">Order</span>
        </div>
        {rows.map((r) => (
          <div key={`${r.part_id || r.name}`} className="grid grid-cols-[1fr_70px_70px_70px] gap-3 p-3 items-center">
            <span>
              <span className="font-semibold">{r.name}</span>
              {r.unlinked && <Badge variant="secondary" className="ml-2">not in inventory</Badge>}
              {r.for_projects?.length > 0 && (
                <span className="block text-xs text-[#6F655A]">for {r.for_projects.join(', ')}</span>
              )}
            </span>
            <span className="text-right tabular-nums">{r.needed}</span>
            <span className="text-right tabular-nums">{r.unlinked ? '—' : r.on_hand}</span>
            <span className="text-right tabular-nums font-bold">{r.to_order}</span>
          </div>
        ))}
      </div>
    </>
  );
}

export default WorkbenchSpacePage;
