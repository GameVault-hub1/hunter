import { useState } from 'react';
import { Terminal, Code, FileCode2, Trash2, ChevronDown, ChevronRight, X, Circle } from 'lucide-react';
import type { ConsoleLogEntry } from '../lib/privacy';
import type { DevToolsTab } from '../hooks/useDevTools';

interface Props {
  logs: ConsoleLogEntry[];
  activeTab: DevToolsTab;
  currentSrc: string | null;
  onTabChange: (tab: DevToolsTab) => void;
  onClearLogs: () => void;
  onClose: () => void;
}

const LEVEL_COLORS: Record<string, string> = {
  log: 'text-gray-300',
  info: 'text-sky-400',
  warn: 'text-amber-400',
  error: 'text-red-400',
  debug: 'text-fuchsia-400',
};

const LEVEL_ICONS: Record<string, React.ReactNode> = {
  log: <Circle className="w-1.5 h-1.5 fill-current" />,
  info: <Circle className="w-1.5 h-1.5 fill-current" />,
  warn: <span className="text-[10px]">⚠</span>,
  error: <span className="text-[10px]">✕</span>,
  debug: <span className="text-[10px]">•</span>,
};

export function DevToolsPanel({ logs, activeTab, currentSrc, onTabChange, onClearLogs, onClose }: Props) {
  return (
    <div className="flex-shrink-0 bg-[#12141c] border-t border-[#252836] h-[42vh] max-h-[360px] min-h-[240px] flex flex-col slide-up">
      {/* Header */}
      <div className="flex items-center justify-between px-3 py-2 border-b border-[#252836] flex-shrink-0">
        <div className="flex items-center gap-1">
          <TabButton active={activeTab === 'console'} onClick={() => onTabChange('console')} icon={<Terminal className="w-3.5 h-3.5" />} label="Console" badge={logs.length} />
          <TabButton active={activeTab === 'elements'} onClick={() => onTabChange('elements')} icon={<Code className="w-3.5 h-3.5" />} label="Elementi" />
          <TabButton active={activeTab === 'sources'} onClick={() => onTabChange('sources')} icon={<FileCode2 className="w-3.5 h-3.5" />} label="Sorgente" />
        </div>
        <div className="flex items-center gap-1">
          {activeTab === 'console' && (
            <button onClick={onClearLogs} className="p-1.5 rounded-md text-gray-400 hover:text-white hover:bg-white/5 transition" title="Pulisci console">
              <Trash2 className="w-3.5 h-3.5" />
            </button>
          )}
          <button onClick={onClose} className="p-1.5 rounded-md text-gray-400 hover:text-white hover:bg-white/5 transition" title="Chiudi">
            <X className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-hidden">
        {activeTab === 'console' && <ConsoleView logs={logs} />}
        {activeTab === 'elements' && <ElementsView />}
        {activeTab === 'sources' && <SourcesView currentSrc={currentSrc} />}
      </div>
    </div>
  );
}

function TabButton({ active, onClick, icon, label, badge }: {
  active: boolean;
  onClick: () => void;
  icon: React.ReactNode;
  label: string;
  badge?: number;
}) {
  return (
    <button
      onClick={onClick}
      className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-medium transition ${
        active ? 'bg-emerald-500/15 text-emerald-300' : 'text-gray-400 hover:text-white hover:bg-white/5'
      }`}
    >
      {icon}
      <span>{label}</span>
      {badge !== undefined && badge > 0 && (
        <span className="text-[9px] px-1.5 py-0.5 rounded-full bg-white/10 text-gray-300 tabular-nums">{badge}</span>
      )}
    </button>
  );
}

function ConsoleView({ logs }: { logs: ConsoleLogEntry[] }) {
  return (
    <div className="h-full overflow-y-auto font-mono text-xs p-2 space-y-0.5 bg-[#0a0b10]">
      {logs.length === 0 ? (
        <div className="flex items-center justify-center h-full text-gray-600">
          <Terminal className="w-4 h-4 mr-2" />
          <span>Console pronta. I log appariranno qui durante la navigazione.</span>
        </div>
      ) : (
        logs.map((log) => (
          <div key={log.id} className="flex items-start gap-2 px-2 py-1 rounded hover:bg-white/5 transition">
            <span className={`mt-1 flex-shrink-0 ${LEVEL_COLORS[log.level]}`}>{LEVEL_ICONS[log.level]}</span>
            <span className={`flex-1 break-all ${LEVEL_COLORS[log.level]}`}>{log.message}</span>
            <span className="text-gray-600 flex-shrink-0 tabular-nums">{new Date(log.timestamp).toLocaleTimeString('it-IT', { hour12: false })}</span>
          </div>
        ))
      )}
    </div>
  );
}

const MOCK_DOM_TREE = [
  { tag: 'html', attrs: 'lang="it"', children: [
    { tag: 'head', children: [
      { tag: 'meta', attrs: 'charset="UTF-8"', selfClosing: true },
      { tag: 'meta', attrs: 'name="viewport" content="width=device-width"', selfClosing: true },
      { tag: 'title', text: 'Pagina Navigata' },
    ]},
    { tag: 'body', children: [
      { tag: 'div', attrs: 'id="app" class="container"', children: [
        { tag: 'header', children: [
          { tag: 'nav', attrs: 'class="navbar"', text: 'Navigazione' },
        ]},
        { tag: 'main', attrs: 'role="main"', children: [
          { tag: 'section', attrs: 'class="hero"', text: 'Contenuto principale' },
          { tag: 'article', text: 'Articolo' },
        ]},
        { tag: 'footer', children: [
          { tag: 'p', text: '© 2026' },
        ]},
      ]},
      { tag: 'script', attrs: 'data-blocked="true" src="tracker.js"', selfClosing: true },
    ]},
  ]},
];

function ElementsView() {
  return (
    <div className="h-full overflow-y-auto bg-[#0a0b10] font-mono text-xs p-2">
      <div className="text-gray-500 mb-2 px-2 flex items-center gap-2">
        <Code className="w-3.5 h-3.5" />
        <span>Strutura HTML simulata (DOM ispezionato)</span>
      </div>
      <DOMNode node={MOCK_DOM_TREE[0]} depth={0} isLast={true} />
    </div>
  );
}

function DOMNode({ node, depth, isLast }: { node: any; depth: number; isLast: boolean }) {
  const [expanded, setExpanded] = useState(depth < 2);
  const hasChildren = node.children && node.children.length > 0;
  const indent = depth * 16;

  return (
    <div>
      <div
        className="flex items-center gap-1 py-0.5 hover:bg-white/5 rounded px-1 cursor-pointer"
        style={{ paddingLeft: `${indent + 4}px` }}
        onClick={() => hasChildren && setExpanded(!expanded)}
      >
        {hasChildren ? (
          expanded ? <ChevronDown className="w-3 h-3 text-gray-500 flex-shrink-0" /> : <ChevronRight className="w-3 h-3 text-gray-500 flex-shrink-0" />
        ) : (
          <span className="w-3 flex-shrink-0" />
        )}
        <span className="text-gray-500">&lt;</span>
        <span className="text-emerald-400">{node.tag}</span>
        {node.attrs && <span className="text-amber-300/80 text-[11px]"> {node.attrs}</span>}
        {node.selfClosing ? (
          <span className="text-gray-500"> /&gt;</span>
        ) : (
          <>
            <span className="text-gray-500">&gt;</span>
            {node.text && <span className="text-gray-300 ml-1">{node.text}</span>}
            {!hasChildren && <span className="text-gray-500 ml-0.5">&lt;/</span>}
            {!hasChildren && <span className="text-emerald-400">{node.tag}</span>}
            {!hasChildren && <span className="text-gray-500">&gt;</span>}
          </>
        )}
      </div>
      {hasChildren && expanded && (
        <div>
          {node.children.map((child: any, i: number) => (
            <DOMNode key={i} node={child} depth={depth + 1} isLast={i === node.children.length - 1} />
          ))}
          <div className="flex items-center py-0.5 px-1" style={{ paddingLeft: `${indent + 4}px` }}>
            <span className="w-3 flex-shrink-0" />
            <span className="text-gray-500">&lt;/</span><span className="text-emerald-400">{node.tag}</span><span className="text-gray-500">&gt;</span>
          </div>
        </div>
      )}
    </div>
  );
}

function SourcesView({ currentSrc }: { currentSrc: string | null }) {
  const mockSource = currentSrc
    ? `<!DOCTYPE html>
<html lang="it">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${currentSrc.replace(/^https?:\/\//, '').split('/')[0]}</title>
  <!-- [BLOCKED] script src="https://google-analytics.com/analytics.js" -->
  <!-- [BLOCKED] script src="https://doubleclick.net/ad.js" -->
  <style>
    body { font-family: sans-serif; margin: 0; }
    .hero { padding: 40px; text-align: center; }
  </style>
</head>
<body>
  <div id="app">
    <header>
      <nav>Menu di navigazione</nav>
    </header>
    <main>
      <section class="hero">
        <h1>Benvenuto</h1>
        <p>Contenuto della pagina navigata tramite Veil Browser.</p>
      </section>
    </main>
    <footer>
      <p>© 2026 - Pagina caricata in modalità anonima</p>
    </footer>
  </div>
  <!-- [CANVAS GUARD] toDataURL intercettato e alterato -->
  <!-- [COOKIE FENCE] document.cookie sandboxed -->
  <script>
    console.log("Pagina caricata");
  </script>
</body>
</html>`
    : `<!-- Nessuna pagina caricata -->`;

  return (
    <div className="h-full overflow-y-auto bg-[#0a0b10] font-mono text-xs p-3">
      <div className="text-gray-500 mb-2 flex items-center gap-2">
        <FileCode2 className="w-3.5 h-3.5" />
        <span>Sorgente pagina {currentSrc ? `· ${currentSrc.replace(/^https?:\/\//, '').slice(0, 30)}` : ''}</span>
      </div>
      <pre className="text-gray-300 whitespace-pre-wrap break-all leading-relaxed">{mockSource}</pre>
    </div>
  );
}
