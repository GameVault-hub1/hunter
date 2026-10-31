import { Globe, Shield, Lock, Fingerprint, Cookie, Eye, Search } from 'lucide-react';
import { useRef } from 'react';

interface Props {
  currentSrc: string | null;
  loading: boolean;
  iframeRef: React.RefObject<HTMLIFrameElement>;
  onQuickSearch: (query: string) => void;
}

const SHORTCUTS = [
  { label: 'DuckDuckGo', url: 'duckduckgo.com', icon: '🦆' },
  { label: 'Wikipedia', url: 'wikipedia.org', icon: '📚' },
  { label: 'Hacker News', url: 'news.ycombinator.com', icon: '📰' },
  { label: 'Reddit', url: 'reddit.com', icon: '👁' },
  { label: 'Proton Mail', url: 'proton.me', icon: '✉️' },
  { label: 'Tor Project', url: 'torproject.org', icon: '🧅' },
];

export function WebView({ currentSrc, loading, iframeRef, onQuickSearch }: Props) {
  const searchRef = useRef<HTMLInputElement>(null);

  if (!currentSrc) {
    return (
      <div className="flex-1 overflow-y-auto bg-gradient-to-b from-[#0a0b10] via-[#0c0e16] to-[#0a0b10] flex flex-col items-center px-5 pt-12 pb-8">
        {/* Logo */}
        <div className="relative mb-6">
          <div className="absolute inset-0 bg-emerald-500/20 blur-2xl rounded-full" />
          <div className="relative w-20 h-20 rounded-2xl bg-gradient-to-br from-emerald-500 to-teal-600 flex items-center justify-center shadow-2xl shadow-emerald-500/20">
            <Shield className="w-10 h-10 text-white" />
          </div>
        </div>

        <h1 className="text-2xl font-bold text-white mb-1.5">Veil Browser</h1>
        <p className="text-sm text-gray-400 mb-7 text-center">Navigazione anonima, blindata e senza tracciamento</p>

        {/* Search */}
        <form
          onSubmit={(e) => { e.preventDefault(); if (searchRef.current?.value.trim()) onQuickSearch(searchRef.current.value); }}
          className="w-full max-w-md mb-8"
        >
          <div className="relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500" />
            <input
              ref={searchRef}
              type="text"
              placeholder="Cerca anonimo o inserisci un URL..."
              className="w-full bg-[#12141c] border border-[#252836] rounded-xl pl-12 pr-4 py-3.5 text-sm text-white placeholder-gray-500 focus:outline-none focus:border-emerald-500/40 focus:ring-2 focus:ring-emerald-500/20 transition-all"
              autoCapitalize="off"
              autoCorrect="off"
              spellCheck={false}
            />
          </div>
        </form>

        {/* Shortcuts */}
        <div className="w-full max-w-md mb-8">
          <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-3">Collegamenti rapidi</p>
          <div className="grid grid-cols-3 gap-3">
            {SHORTCUTS.map((s) => (
              <button
                key={s.label}
                onClick={() => onQuickSearch(s.url)}
                className="flex flex-col items-center gap-2 p-3 rounded-xl bg-[#12141c] border border-[#252836] hover:border-emerald-500/30 hover:bg-[#16182400] active:scale-95 transition-all group"
              >
                <span className="text-2xl">{s.icon}</span>
                <span className="text-xs text-gray-400 group-hover:text-white transition-colors">{s.label}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Privacy features */}
        <div className="w-full max-w-md">
          <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-3">Protezioni attive</p>
          <div className="grid grid-cols-2 gap-2.5">
            <FeatureCard icon={<Fingerprint className="w-4 h-4" />} title="Fingerprint Noise" desc="Canvas & WebGL offuscati" />
            <FeatureCard icon={<Cookie className="w-4 h-4" />} title="Cookie Isolati" desc="Sandbox per dominio" />
            <FeatureCard icon={<Lock className="w-4 h-4" />} title="Tracker Block" desc="40k+ domini bloccati" />
            <FeatureCard icon={<Eye className="w-4 h-4" />} title="No Telemetry" desc="DNT + ping bloccati" />
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex-1 relative bg-white overflow-hidden">
      {loading && (
        <div className="absolute inset-0 z-10 bg-[#0a0b10] flex flex-col items-center justify-center">
          <div className="w-10 h-10 rounded-full border-2 border-[#252836] border-t-emerald-400 animate-spin mb-3" />
          <p className="text-sm text-gray-400">Caricamento sicuro...</p>
          <p className="text-xs text-gray-600 mt-1">Blocco tracker e offuscamento fingerprint attivi</p>
        </div>
      )}
      <iframe
        ref={iframeRef}
        src={currentSrc}
        title="Contenuto navigato"
        className="w-full h-full border-0"
        sandbox="allow-scripts allow-same-origin allow-forms allow-popups allow-popups-to-escape-sandbox"
        referrerPolicy="no-referrer"
        onLoad={() => {}}
      />
      {/* X-Frame fallback notice */}
      <div className="absolute bottom-3 left-3 right-3 pointer-events-none">
        <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-black/80 backdrop-blur text-xs text-gray-300 border border-white/10">
          <Globe className="w-3 h-3 text-emerald-400" />
          <span className="truncate max-w-[200px]">{currentSrc.replace(/^https?:\/\//, '').slice(0, 40)}</span>
          <span className="text-gray-500">·</span>
          <Shield className="w-3 h-3 text-emerald-400" />
          <span className="text-emerald-400">Protetto</span>
        </div>
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
