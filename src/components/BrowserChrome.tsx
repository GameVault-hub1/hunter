import { ArrowLeft, ArrowRight, RotateCw, Home, Shield, Code2, Puzzle, Eye, EyeOff, Lock } from 'lucide-react';
import { useState, useRef, useEffect } from 'react';

interface Props {
  displayUrl: string;
  canGoBack: boolean;
  canGoForward: boolean;
  loading: boolean;
  incognito: boolean;
  trackerCount: number;
  onNavigate: (input: string) => void;
  onBack: () => void;
  onForward: () => void;
  onReload: () => void;
  onHome: () => void;
  onShield: () => void;
  onToggleDevTools: () => void;
  onToggleExtensions: () => void;
  onToggleIncognito: () => void;
  devToolsActive: boolean;
  extensionsActive: boolean;
}

export function BrowserChrome({
  displayUrl,
  canGoBack,
  canGoForward,
  loading,
  incognito,
  trackerCount,
  onNavigate,
  onBack,
  onForward,
  onReload,
  onHome,
  onShield,
  onToggleDevTools,
  onToggleExtensions,
  onToggleIncognito,
  devToolsActive,
  extensionsActive,
}: Props) {
  const [input, setInput] = useState(displayUrl);
  const [focused, setFocused] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (!focused) setInput(displayUrl);
  }, [displayUrl, focused]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (input.trim()) {
      onNavigate(input);
      inputRef.current?.blur();
    }
  };

  return (
    <div className="flex-shrink-0 bg-[#12141c] border-b border-[#252836]">
      {/* Top row: nav buttons + address bar */}
      <div className="flex items-center gap-1.5 px-2.5 py-2">
        <NavButton onClick={onBack} disabled={!canGoBack} aria-label="Indietro">
          <ArrowLeft className="w-[18px] h-[18px]" />
        </NavButton>
        <NavButton onClick={onForward} disabled={!canGoForward} aria-label="Avanti">
          <ArrowRight className="w-[18px] h-[18px]" />
        </NavButton>
        <NavButton onClick={onReload} disabled={!displayUrl} aria-label="Ricarica">
          <RotateCw className={`w-[18px] h-[18px] ${loading ? 'animate-spin' : ''}`} />
        </NavButton>
        <NavButton onClick={onHome} aria-label="Home">
          <Home className="w-[18px] h-[18px]" />
        </NavButton>

        <form onSubmit={handleSubmit} className="flex-1 mx-1">
          <div className={`relative flex items-center rounded-full transition-all ${focused ? 'ring-2 ring-emerald-500/40' : ''}`}>
            <div className="absolute left-3 flex items-center gap-1.5 pointer-events-none">
              {incognito ? (
                <EyeOff className="w-3.5 h-3.5 text-violet-400" />
              ) : (
                <Lock className="w-3.5 h-3.5 text-emerald-400" />
              )}
            </div>
            <input
              ref={inputRef}
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onFocus={() => { setFocused(true); inputRef.current?.select(); }}
              onBlur={() => setFocused(false)}
              placeholder="Cerca anonimo su DuckDuckGo o inserisci un URL"
              className="w-full bg-[#0a0b10] border border-[#252836] rounded-full pl-9 pr-20 py-2 text-sm text-white placeholder-gray-500 focus:outline-none focus:border-emerald-500/40 transition-colors"
              autoCapitalize="off"
              autoCorrect="off"
              spellCheck={false}
            />
            {trackerCount > 0 && !focused && (
              <div className="absolute right-2 flex items-center gap-1 px-2 py-0.5 rounded-full bg-emerald-500/10 border border-emerald-500/20 pointer-events-none">
                <Shield className="w-3 h-3 text-emerald-400" />
                <span className="text-[10px] font-semibold text-emerald-400 tabular-nums">{trackerCount}</span>
              </div>
            )}
          </div>
        </form>

        <NavButton onClick={onToggleIncognito} active={incognito} aria-label="Incognito">
          <EyeOff className="w-[18px] h-[18px]" />
        </NavButton>
        <NavButton onClick={onShield} aria-label="Privacy Shield">
          <Shield className="w-[18px] h-[18px] text-emerald-400" />
        </NavButton>
      </div>

      {/* Second row: panel toggles */}
      <div className="flex items-center gap-1.5 px-2.5 pb-2">
        <PanelButton onClick={onToggleDevTools} active={devToolsActive} icon={<Code2 className="w-4 h-4" />} label="Sviluppatore" />
        <PanelButton onClick={onToggleExtensions} active={extensionsActive} icon={<Puzzle className="w-4 h-4" />} label="Estensioni Libere" />
        <div className="flex-1" />
        <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20">
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
          <span className="text-[10px] font-medium text-emerald-300">Anti-Tracciamento</span>
        </div>
      </div>
    </div>
  );
}

function NavButton({ children, onClick, disabled, active, ...rest }: {
  children: React.ReactNode;
  onClick: () => void;
  disabled?: boolean;
  active?: boolean;
  'aria-label'?: string;
}) {
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      {...rest}
      className={`flex items-center justify-center w-9 h-9 rounded-lg transition-all flex-shrink-0 ${
        disabled
          ? 'text-gray-600 cursor-not-allowed'
          : active
          ? 'text-emerald-400 bg-emerald-500/10 hover:bg-emerald-500/20'
          : 'text-gray-400 hover:text-white hover:bg-white/5 active:scale-90'
      }`}
    >
      {children}
    </button>
  );
}

function PanelButton({ onClick, active, icon, label }: {
  onClick: () => void;
  active: boolean;
  icon: React.ReactNode;
  label: string;
}) {
  return (
    <button
      onClick={onClick}
      className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
        active
          ? 'bg-emerald-500/15 text-emerald-300 border border-emerald-500/30'
          : 'text-gray-400 hover:text-white hover:bg-white/5 border border-transparent'
      }`}
    >
      {icon}
      <span className="hidden xs:inline">{label}</span>
      <span className="xs:hidden">{label.split(' ')[0]}</span>
    </button>
  );
}
