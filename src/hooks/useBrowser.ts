import { useState, useCallback, useEffect } from 'react';
import { usePrivacy } from './usePrivacy';
import { useDevTools } from './useDevTools';
import { useExtensions } from './useExtensions';
import { toUrl } from '../lib/privacy';

export type PanelType = 'devtools' | 'extensions' | null;

export interface VisitedSite {
  url: string;
  displayUrl: string;
  openedAt: number;
}

export function useBrowser() {
  const [displayUrl, setDisplayUrl] = useState('');
  const [visited, setVisited] = useState<VisitedSite | null>(null);
  const [history, setHistory] = useState<string[]>([]);
  const [historyIndex, setHistoryIndex] = useState(-1);
  const [loading, setLoading] = useState(false);
  const [activePanel, setActivePanel] = useState<PanelType>(null);
  const [showShield, setShowShield] = useState(false);
  const [incognito, setIncognito] = useState(false);

  const privacy = usePrivacy();
  const devtools = useDevTools();
  const extensions = useExtensions();

  const navigate = useCallback((input: string) => {
    if (!input.trim()) return;
    const finalUrl = toUrl(input);
    setDisplayUrl(input);
    setLoading(true);

    // Open in a new tab with anonymous referrer (noopener + noreferrer)
    window.open(finalUrl, '_blank', 'noopener,noreferrer');

    setVisited({ url: finalUrl, displayUrl: input.trim(), openedAt: Date.now() });
    setHistory((prev) => {
      const newHistory = [...prev.slice(0, historyIndex + 1), finalUrl];
      setHistoryIndex(newHistory.length - 1);
      return newHistory;
    });
    privacy.trackPageLoad(finalUrl);
    devtools.simulatePageLogs(finalUrl);
    setTimeout(() => setLoading(false), 800);
  }, [historyIndex, privacy, devtools]);

  const goBack = useCallback(() => {
    if (historyIndex > 0) {
      const newIndex = historyIndex - 1;
      setHistoryIndex(newIndex);
      const target = history[newIndex];
      window.open(target, '_blank', 'noopener,noreferrer');
      setVisited({ url: target, displayUrl: target, openedAt: Date.now() });
      privacy.trackPageLoad(target);
      devtools.simulatePageLogs(target);
    }
  }, [historyIndex, history, privacy, devtools]);

  const goForward = useCallback(() => {
    if (historyIndex < history.length - 1) {
      const newIndex = historyIndex + 1;
      setHistoryIndex(newIndex);
      const target = history[newIndex];
      window.open(target, '_blank', 'noopener,noreferrer');
      setVisited({ url: target, displayUrl: target, openedAt: Date.now() });
      privacy.trackPageLoad(target);
      devtools.simulatePageLogs(target);
    }
  }, [historyIndex, history, privacy, devtools]);

  const reload = useCallback(() => {
    if (visited) {
      setLoading(true);
      window.open(visited.url, '_blank', 'noopener,noreferrer');
      setTimeout(() => setLoading(false), 600);
    }
  }, [visited]);

  const goHome = useCallback(() => {
    setVisited(null);
    setDisplayUrl('');
    setHistory((prev) => {
      const newHistory = [...prev.slice(0, historyIndex + 1), 'about:home'];
      setHistoryIndex(newHistory.length - 1);
      return newHistory;
    });
  }, [historyIndex]);

  const togglePanel = useCallback((panel: PanelType) => {
    setActivePanel((current) => (current === panel ? null : panel));
  }, []);

  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setActivePanel(null);
    };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, []);

  return {
    displayUrl,
    setDisplayUrl,
    visited,
    loading,
    history,
    historyIndex,
    activePanel,
    showShield,
    incognito,
    privacy,
    devtools,
    extensions,
    navigate,
    goBack,
    goForward,
    reload,
    goHome,
    togglePanel,
    setShowShield,
    setIncognito,
  };
}
