import { useState, useCallback, useRef, useEffect } from 'react';
import { usePrivacy } from './usePrivacy';
import { useDevTools } from './useDevTools';
import { useExtensions } from './useExtensions';

export type PanelType = 'devtools' | 'extensions' | null;

export function useBrowser() {
  const [url, setUrl] = useState('');
  const [displayUrl, setDisplayUrl] = useState('');
  const [currentSrc, setCurrentSrc] = useState<string | null>(null);
  const [history, setHistory] = useState<string[]>([]);
  const [historyIndex, setHistoryIndex] = useState(-1);
  const [loading, setLoading] = useState(false);
  const [blocked, setBlocked] = useState(false);
  const [activePanel, setActivePanel] = useState<PanelType>(null);
  const [showShield, setShowShield] = useState(false);
  const [incognito, setIncognito] = useState(false);
  const iframeRef = useRef<HTMLIFrameElement>(null);

  const privacy = usePrivacy();
  const devtools = useDevTools();
  const extensions = useExtensions();

  const navigate = useCallback((input: string) => {
    if (!input.trim()) return;
    import('../lib/privacy').then(({ toUrl }) => {
      const finalUrl = toUrl(input);
      setUrl(finalUrl);
      setDisplayUrl(input);
      setCurrentSrc(finalUrl);
      setLoading(true);
      setBlocked(false);
      setHistory((prev) => {
        const newHistory = [...prev.slice(0, historyIndex + 1), finalUrl];
        setHistoryIndex(newHistory.length - 1);
        return newHistory;
      });
      privacy.trackPageLoad(finalUrl);
      // Simulate loading completion
      setTimeout(() => setLoading(false), 1200);
    });
  }, [historyIndex, privacy]);

  const goBack = useCallback(() => {
    if (historyIndex > 0) {
      const newIndex = historyIndex - 1;
      setHistoryIndex(newIndex);
      const target = history[newIndex];
      setCurrentSrc(target);
      setUrl(target);
      setDisplayUrl(target);
      setLoading(true);
      setTimeout(() => setLoading(false), 1000);
    }
  }, [historyIndex, history]);

  const goForward = useCallback(() => {
    if (historyIndex < history.length - 1) {
      const newIndex = historyIndex + 1;
      setHistoryIndex(newIndex);
      const target = history[newIndex];
      setCurrentSrc(target);
      setUrl(target);
      setDisplayUrl(target);
      setLoading(true);
      setTimeout(() => setLoading(false), 1000);
    }
  }, [historyIndex, history]);

  const reload = useCallback(() => {
    if (currentSrc) {
      setCurrentSrc(null);
      setLoading(true);
      setTimeout(() => {
        setCurrentSrc(url);
        setLoading(false);
      }, 600);
    }
  }, [currentSrc, url]);

  const goHome = useCallback(() => {
    setCurrentSrc(null);
    setUrl('');
    setDisplayUrl('');
    setBlocked(false);
    setHistory((prev) => {
      const newHistory = [...prev.slice(0, historyIndex + 1), 'about:home'];
      setHistoryIndex(newHistory.length - 1);
      return newHistory;
    });
  }, [historyIndex]);

  const togglePanel = useCallback((panel: PanelType) => {
    setActivePanel((current) => (current === panel ? null : panel));
  }, []);

  // keyboard shortcut: Escape closes panel
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setActivePanel(null);
    };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, []);

  return {
    url,
    displayUrl,
    setDisplayUrl,
    currentSrc,
    loading,
    blocked,
    history,
    historyIndex,
    activePanel,
    showShield,
    incognito,
    iframeRef,
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
    setBlocked,
  };
}
