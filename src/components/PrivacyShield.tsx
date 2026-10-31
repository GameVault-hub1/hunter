import { Shield, Eye, EyeOff, Lock, Zap, Activity } from 'lucide-react';
import type { PrivacyStats, BlockedTracker } from '../lib/privacy';

const TYPE_LABELS: Record<string, string> = {
  ad: 'Pubblicità',
  analytics: 'Analytics',
  social: 'Social',
  fingerprint: 'Fingerprint',
};

const TYPE_COLORS: Record<string, string> = {
  ad: 'text-red-400 bg-red-500/10 border-red-500/20',
  analytics: 'text-amber-400 bg-amber-500/10 border-amber-500/20',
  social: 'text-sky-400 bg-sky-500/10 border-sky-500/20',
  fingerprint: 'text-fuchsia-400 bg-fuchsia-500/10 border-fuchsia-500/20',
};

interface Props {
  stats: PrivacyStats;
  blockedTrackers: BlockedTracker[];
  incognito: boolean;
  onClose: () => void;
}

export function PrivacyShield({ stats, blockedTrackers, incognito, onClose }: Props) {
  return (
    <div className="absolute inset-0 z-40 bg-black/70 backdrop-blur-sm flex items-end sm:items-center justify-center fade-in" onClick={onClose}>
      <div
        className="w-full sm:max-w-md bg-[#12141c] border border-[#252836] rounded-t-2xl sm:rounded-2xl p-5 slide-up sm:scale-in max-h-[85vh] overflow-y-auto no-scrollbar"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between mb-5">
          <div className="flex items-center gap-2.5">
            <div className="relative">
              <Shield className="w-6 h-6 text-emerald-400 shield-pulse" />
            </div>
            <h2 className="text-lg font-semibold text-white">Privacy Shield</h2>
          </div>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-white text-sm px-3 py-1 rounded-lg hover:bg-white/5 transition"
          >
            Chiudi
          </button>
        </div>

        {incognito && (
          <div className="mb-4 flex items-center gap-2 px-3 py-2.5 rounded-xl bg-violet-500/10 border border-violet-500/20">
            <EyeOff className="w-4 h-4 text-violet-300 flex-shrink-0" />
            <span className="text-sm text-violet-200">Modalità Incognito attiva — sessione effimera</span>
          </div>
        )}

        <div className="grid grid-cols-2 gap-3 mb-5">
          <StatCard icon={<Zap className="w-4 h-4" />} label="Tracker bloccati" value={stats.trackersBlocked} color="emerald" />
          <StatCard icon={<Lock className="w-4 h-4" />} label="Cookie isolati" value={stats.cookiesIsolated} color="sky" />
          <StatCard icon={<Eye className="w-4 h-4" />} label="Fingerprint offuscato" value={stats.fingerprintNoiseEvents} color="fuchsia" />
          <StatCard icon={<Activity className="w-4 h-4" />} label="Sessioni isolate" value={incognito ? 1 : 0} color="amber" />
        </div>

        <div className="space-y-2 mb-4">
          <ToggleRow label="Protezione Canvas" active={stats.canvasProtected} />
          <ToggleRow label="Isolamento Cookie" active={stats.cookiesIsolatedActive} />
          <ToggleRow label="Do Not Track" active={stats.dntActive} />
        </div>

        <div>
          <h3 className="text-xs font-semibold text-gray-400 uppercase tracking-wide mb-2.5">Tracker bloccati di recente</h3>
          {blockedTrackers.length === 0 ? (
            <p className="text-sm text-gray-500 italic py-4 text-center">Nessun tracker rilevato in questa sessione.</p>
          ) : (
            <div className="space-y-1.5 max-h-48 overflow-y-auto no-scrollbar">
              {blockedTrackers.map((t, i) => (
                <div key={i} className="flex items-center justify-between px-3 py-2 rounded-lg bg-[#0a0b10] border border-[#1e2030]">
                  <span className="text-sm font-mono text-gray-300 truncate">{t.domain}</span>
                  <span className={`text-[10px] px-2 py-0.5 rounded-full border font-medium flex-shrink-0 ml-2 ${TYPE_COLORS[t.type]}`}>
                    {TYPE_LABELS[t.type]}
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

function StatCard({ icon, label, value, color }: { icon: React.ReactNode; label: string; value: number; color: string }) {
  const colorMap: Record<string, string> = {
    emerald: 'text-emerald-400',
    sky: 'text-sky-400',
    fuchsia: 'text-fuchsia-400',
    amber: 'text-amber-400',
  };
  return (
    <div className="bg-[#0a0b10] border border-[#1e2030] rounded-xl p-3.5">
      <div className={`mb-1.5 ${colorMap[color]}`}>{icon}</div>
      <div className="text-2xl font-bold text-white tabular-nums">{value}</div>
      <div className="text-[11px] text-gray-500 leading-tight mt-0.5">{label}</div>
    </div>
  );
}

function ToggleRow({ label, active }: { label: string; active: boolean }) {
  return (
    <div className="flex items-center justify-between px-3 py-2.5 rounded-lg bg-[#0a0b10] border border-[#1e2030]">
      <span className="text-sm text-gray-300">{label}</span>
      <span className={`flex items-center gap-1.5 text-xs font-medium ${active ? 'text-emerald-400' : 'text-gray-500'}`}>
        <span className={`w-2 h-2 rounded-full ${active ? 'bg-emerald-400' : 'bg-gray-600'}`} />
        {active ? 'Attivo' : 'Inattivo'}
      </span>
    </div>
  );
}
