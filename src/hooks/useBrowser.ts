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
    import('../lib/privacy').then(({ toUrl, buildProxyUrl }) => {
      const finalUrl = toUrl(input);
      const proxiedUrl = buildProxyUrl(finalUrl);
      setUrl(finalUrl);
      setDisplayUrl(input);
      setCurrentSrc(proxiedUrl);
      setLoading(true);
      setBlocked(false);
      setHistory((prev) => {
        const newHistory = [...prev.slice(0, historyIndex + 1), finalUrl];
        setHistoryIndex(newHistory.length - 1);
        return newHistory;
      });
      privacy.trackPageLoad(finalUrl);
      setTimeout(() => setLoading(false), 1500);
    });
  }, [historyIndex, privacy]);

  const loadUrl = useCallback((targetUrl: string) => {
    import('../lib/privacy').then(({ buildProxyUrl }) => {
      const proxied = buildProxyUrl(targetUrl);
      setUrl(targetUrl);
      setDisplayUrl(targetUrl);
      setCurrentSrc(proxied);
      setLoading(true);
      setTimeout(() => setLoading(false), 1500);
    });
  }, []);

  const goBack = useCallback(() => {
    if (historyIndex > 0) {
      const newIndex = historyIndex - 1;
      setHistoryIndex(newIndex);
      const target = history[newIndex];
      if (target === 'about:home') {
        setCurrentSrc(null);
        setUrl('');
        setDisplayUrl('');
      } else {
        loadUrl(target);
      }
    }
  }, [historyIndex, history, loadUrl]);

  const goForward = useCallback(() => {
    if (historyIndex < history.length - 1) {
      const newIndex = historyIndex + 1;
      setHistoryIndex(newIndex);
      const target = history[newIndex];
      if (target === 'about:home') {
        setCurrentSrc(null);
        setUrl('');
        setDisplayUrl('');
      } else {
        loadUrl(target);
      }
    }
  }, [historyIndex, history, loadUrl]);

  const reload = useCallback(() => {
    if (url) {
      setCurrentSrc(null);
      setLoading(true);
      import('../lib/privacy').then(({ buildProxyUrl }) => {
        setTimeout(() => {
          setCurrentSrc(buildProxyUrl(url));
          setLoading(false);
        }, 400);
      });
    }
  }, [url]);

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
