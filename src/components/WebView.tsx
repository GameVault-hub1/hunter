import { Shield, Lock, Fingerprint, Cookie, Eye, Search, ExternalLink, Globe, CheckCircle2, Clock } from 'lucide-react';
import { useRef } from 'react';
import type { VisitedSite } from '../hooks/useBrowser';

interface Props {
  visited: VisitedSite | null;
  loading: boolean;
  onQuickSearch: (query: string) => void;
  onReopen: (url: string) => void;
}

const SHORTCUTS = [
  { label: 'DuckDuckGo', url: 'duckduckgo.com', icon: '🦆', color: 'from-orange-500 to-red-500' },
  { label: 'Wikipedia', url: 'wikipedia.org', icon: '📚', color: 'from-sky-500 to-blue-600' },
  { label: 'Hacker News', url: 'news.ycombinator.com', icon: '📰', color: 'from-orange-400 to-amber-500' },
  { label: 'Reddit', url: 'reddit.com', icon: '👁', color: 'from-orange-500 to-red-600' },
  { label: 'Proton Mail', url: 'proton.me', icon: '✉️', color: 'from-violet-500 to-purple-600' },
  { label: 'Tor Project', url: 'torproject.org', icon: '🧅', color: 'from-purple-500 to-indigo-600' },
];

export function WebView({ visited, loading, onQuickSearch, onReopen }: Props) {
  const searchRef = useRef<HTMLInputElement>(null);

  return (
    <div className="flex-1 overflow-y-auto no-scrollbar bg-gradient-to-b from-[#0a0b10] via-[#0c0e16] to-[#0a0b10]">
      <div className="flex flex-col items-center px-5 pt-10 pb-8 max-w-lg mx-auto">
        {/* Logo */}
        <div className="relative mb-5">
          <div className="absolute inset-0 bg-emerald-500/20 blur-2xl rounded-full" />
          <div className="relative w-20 h-20 rounded-2xl bg-gradient-to-br from-emerald-500 to-teal-600 flex items-center justify-center shadow-2xl shadow-emerald-500/20">
            <Shield className="w-10 h-10 text-white" />
          </div>
        </div>

        <h1 className="text-2xl font-bold text-white mb-1.5">Veil Browser</h1>
        <p className="text-sm text-gray-400 mb-6 text-center">Hub di sicurezza — navigazione anonima, blindata e senza tracciamento</p>

        {/* Search */}
        <form
          onSubmit={(e) => { e.preventDefault(); if (searchRef.current?.value.trim()) onQuickSearch(searchRef.current.value); }}
          className="w-full mb-6"
        >
          <div className="relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500" />
            <input
              ref={searchRef}
              type="text"
              placeholder="Cerca anonimo su DuckDuckGo o inserisci un URL..."
              className="w-full bg-[#12141c] border border-[#252836] rounded-xl pl-12 pr-4 py-3.5 text-sm text-white placeholder-gray-500 focus:outline-none focus:border-emerald-500/40 focus:ring-2 focus:ring-emerald-500/20 transition-all"
              autoCapitalize="off"
              autoCorrect="off"
              spellCheck={false}
            />
          </div>
          <p className="text-[11px] text-gray-500 mt-2 text-center flex items-center justify-center gap-1.5">
            <ExternalLink className="w-3 h-3" />
            I siti si aprono in una nuova scheda con referrer anonimo (noopener + noreferrer)
          </p>
        </form>

        {/* Last visited site */}
        {visited && (
          <div className="w-full mb-6 fade-in">
            <div className="rounded-xl bg-emerald-500/[0.06] border border-emerald-500/20 p-4">
              <div className="flex items-center gap-2 mb-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                <span className="text-xs font-semibold text-emerald-300">Sito aperto in nuova scheda</span>
              </div>
              <div className="flex items-center gap-2.5 px-3 py-2.5 rounded-lg bg-[#0a0b10] border border-[#1e2030]">
                <Globe className="w-4 h-4 text-emerald-400 flex-shrink-0" />
                <div className="min-w-0 flex-1">
                  <div className="text-sm text-white truncate">{visited.displayUrl}</div>
                  <div className="text-[10px] text-gray-500 flex items-center gap-1 mt-0.5">
                    <Clock className="w-2.5 h-2.5" />
                    {new Date(visited.openedAt).toLocaleTimeString('it-IT', { hour12: false })}
                  </div>
                </div>
                <button
                  onClick={() => onReopen(visited.url)}
                  className="flex-shrink-0 px-2.5 py-1.5 rounded-lg bg-emerald-500/15 text-emerald-300 text-xs font-medium hover:bg-emerald-500/25 transition flex items-center gap-1"
                >
                  <ExternalLink className="w-3 h-3" />
                  Riapri
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Shortcuts */}
        <div className="w-full mb-6">
          <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-3">Collegamenti rapidi</p>
          <div className="grid grid-cols-3 gap-3">
            {SHORTCUTS.map((s) => (
              <button
                key={s.label}
                onClick={() => onQuickSearch(s.url)}
                className="flex flex-col items-center gap-2 p-3 rounded-xl bg-[#12141c] border border-[#252836] hover:border-emerald-500/30 active:scale-95 transition-all group"
              >
                <div className={`w-10 h-10 rounded-lg bg-gradient-to-br ${s.color} flex items-center justify-center text-xl`}>
                  {s.icon}
                </div>
                <span className="text-xs text-gray-400 group-hover:text-white transition-colors">{s.label}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Privacy features */}
        <div className="w-full">
          <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-3">Protezioni attive</p>
          <div className="grid grid-cols-2 gap-2.5">
            <FeatureCard icon={<Fingerprint className="w-4 h-4" />} title="Fingerprint Noise" desc="Canvas & WebGL offuscati" />
            <FeatureCard icon={<Cookie className="w-4 h-4" />} title="Cookie Isolati" desc="Sandbox per dominio" />
            <FeatureCard icon={<Lock className="w-4 h-4" />} title="Tracker Block" desc="40k+ domini bloccati" />
            <FeatureCard icon={<Eye className="w-4 h-4" />} title="No Telemetry" desc="DNT + ping bloccati" />
          </div>
        </div>

        {loading && (
          <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-sm flex items-center justify-center fade-in pointer-events-none">
            <div className="flex flex-col items-center">
              <div className="w-10 h-10 rounded-full border-2 border-[#252836] border-t-emerald-400 animate-spin mb-3" />
              <p className="text-sm text-gray-300">Apertura sito sicura...</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

function FeatureCard({ icon, title, desc }: { icon: React.ReactNode; title: string; desc: string }) {
  return (
    <div className="flex items-start gap-2.5 p-3 rounded-xl bg-[#12141c] border border-[#252836]">
      <div className="text-emerald-400 mt-0.5 flex-shrink-0">{icon}</div>
      <div className="min-w-0">
        <div className="text-xs font-semibold text-white truncate">{title}</div>
        <div className="text-[11px] text-gray-500 leading-tight">{desc}</div>
      </div>
    </div>
  );
}
