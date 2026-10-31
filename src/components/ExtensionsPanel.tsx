import { Puzzle, Upload, Power, Trash2, X, CheckCircle2, Plus, Code2, AlertTriangle } from 'lucide-react';
import type { LoadedExtension } from '../lib/privacy';

interface Props {
  extensions: LoadedExtension[];
  customScript: string;
  customName: string;
  customError: string | null;
  onScriptChange: (v: string) => void;
  onNameChange: (v: string) => void;
  onToggle: (id: string) => void;
  onRemove: (id: string) => void;
  onLoad: () => void;
  onClose: () => void;
}

export function ExtensionsPanel({
  extensions,
  customScript,
  customName,
  customError,
  onScriptChange,
  onNameChange,
  onToggle,
  onRemove,
  onLoad,
  onClose,
}: Props) {
  const activeCount = extensions.filter((e) => e.active).length;

  return (
    <div className="flex-shrink-0 bg-[#12141c] border-t border-[#252836] h-[48vh] max-h-[420px] min-h-[280px] flex flex-col slide-up">
      {/* Header */}
      <div className="flex items-center justify-between px-3 py-2 border-b border-[#252836] flex-shrink-0">
        <div className="flex items-center gap-2">
          <Puzzle className="w-4 h-4 text-emerald-400" />
          <span className="text-sm font-semibold text-white">Estensioni Libere</span>
          <span className="text-[10px] px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
            {activeCount} attive
          </span>
          <span className="text-[10px] text-gray-500 hidden sm:inline">· nessuna firma digitale richiesta</span>
        </div>
        <button onClick={onClose} className="p-1.5 rounded-md text-gray-400 hover:text-white hover:bg-white/5 transition">
          <X className="w-4 h-4" />
        </button>
      </div>

      <div className="flex-1 overflow-y-auto p-3 space-y-2.5 no-scrollbar">
        {/* Custom script loader */}
        <div className="rounded-xl bg-[#0a0b10] border border-[#252836] p-3.5">
          <div className="flex items-center gap-2 mb-2.5">
            <Upload className="w-4 h-4 text-emerald-400" />
            <span className="text-sm font-medium text-white">Carica estensione / script</span>
          </div>
          <p className="text-[11px] text-gray-500 mb-3">Incolla codice JavaScript, contenuto .crx simulato o manifest JSON. Nessuna restrizione.</p>

          <input
            type="text"
            value={customName}
            onChange={(e) => onNameChange(e.target.value)}
            placeholder="Nome estensione (opzionale)"
            className="w-full bg-[#12141c] border border-[#252836] rounded-lg px-3 py-2 text-sm text-white placeholder-gray-600 focus:outline-none focus:border-emerald-500/40 mb-2"
          />
          <textarea
            value={customScript}
            onChange={(e) => onScriptChange(e.target.value)}
            placeholder="// Il tuo script qui&#10;// Esempio:&#10;// console.log('Estensione caricata');&#10;// document.body.style.filter = 'invert(1)';"
            rows={4}
            className="w-full bg-[#12141c] border border-[#252836] rounded-lg px-3 py-2 text-xs font-mono text-gray-300 placeholder-gray-600 focus:outline-none focus:border-emerald-500/40 resize-none mb-2"
            spellCheck={false}
          />
          {customError && (
            <div className="flex items-center gap-2 mb-2 px-3 py-2 rounded-lg bg-amber-500/10 border border-amber-500/20">
              <AlertTriangle className="w-3.5 h-3.5 text-amber-400 flex-shrink-0" />
              <span className="text-xs text-amber-300">{customError}</span>
            </div>
          )}
          <button
            onClick={onLoad}
            className="flex items-center gap-2 px-4 py-2 rounded-lg bg-emerald-500/15 text-emerald-300 border border-emerald-500/30 hover:bg-emerald-500/25 transition text-sm font-medium"
          >
            <Plus className="w-4 h-4" />
            Carica e attiva
          </button>
        </div>

        {/* Extension list */}
        {extensions.map((ext) => (
          <ExtensionCard key={ext.id} ext={ext} onToggle={onToggle} onRemove={onRemove} />
        ))}
      </div>
    </div>
  );
}

function ExtensionCard({ ext, onToggle, onRemove }: {
  ext: LoadedExtension;
  onToggle: (id: string) => void;
  onRemove: (id: string) => void;
}) {
  return (
    <div className={`rounded-xl border p-3.5 transition-all ${ext.active ? 'bg-emerald-500/[0.04] border-emerald-500/20' : 'bg-[#0a0b10] border-[#252836]'}`}>
      <div className="flex items-start justify-between gap-3">
        <div className="flex items-start gap-2.5 min-w-0 flex-1">
          <div className={`w-9 h-9 rounded-lg flex items-center justify-center flex-shrink-0 ${ext.active ? 'bg-emerald-500/15 text-emerald-400' : 'bg-white/5 text-gray-500'}`}>
            {ext.custom ? <Code2 className="w-4 h-4" /> : <Puzzle className="w-4 h-4" />}
          </div>
          <div className="min-w-0 flex-1">
            <div className="flex items-center gap-2">
              <span className="text-sm font-semibold text-white truncate">{ext.name}</span>
              <span className="text-[10px] text-gray-500 flex-shrink-0">v{ext.version}</span>
              {ext.custom && (
                <span className="text-[9px] px-1.5 py-0.5 rounded bg-fuchsia-500/10 text-fuchsia-400 border border-fuchsia-500/20 flex-shrink-0">
                  CUSTOM
                </span>
              )}
            </div>
            <p className="text-xs text-gray-400 mt-0.5 leading-snug">{ext.description}</p>
            <div className="mt-1.5 flex items-center gap-1.5">
              <CheckCircle2 className={`w-3 h-3 ${ext.active ? 'text-emerald-400' : 'text-gray-600'}`} />
              <span className={`text-[11px] font-mono truncate ${ext.active ? 'text-emerald-400/70' : 'text-gray-600'}`}>
                {ext.source}
              </span>
            </div>
          </div>
        </div>
        <div className="flex items-center gap-1.5 flex-shrink-0">
          <button
            onClick={() => onToggle(ext.id)}
            className={`relative w-10 rounded-full transition-all ${ext.active ? 'bg-emerald-500/30' : 'bg-[#252836]'}`}
            style={{ height: '22px' }}
          >
            <span
              className={`absolute top-0.5 w-[18px] h-[18px] rounded-full transition-all ${ext.active ? 'left-[22px] bg-emerald-400' : 'left-0.5 bg-gray-500'}`}
            />
          </button>
          <button
            onClick={() => onRemove(ext.id)}
            className="p-1.5 rounded-md text-gray-500 hover:text-red-400 hover:bg-red-500/10 transition"
          >
            <Trash2 className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
      {ext.active && (
        <div className="mt-2.5 flex items-center gap-1.5 text-[11px] text-emerald-400/70">
          <Power className="w-3 h-3" />
          <span>Estensione in esecuzione — nessuna verifica firma richiesta</span>
        </div>
      )}
    </div>
  );
}
