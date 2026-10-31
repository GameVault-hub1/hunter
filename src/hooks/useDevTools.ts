import { useState, useCallback, useRef, useEffect } from 'react';
import type { ConsoleLogEntry } from '../lib/privacy';

export type DevToolsTab = 'console' | 'elements' | 'sources';

export function useDevTools() {
  const [logs, setLogs] = useState<ConsoleLogEntry[]>([]);
  const [activeTab, setActiveTab] = useState<DevToolsTab>('console');
  const [clearOnNavigate, setClearOnNavigate] = useState(true);
  const logIdRef = useRef(0);

  const addLog = useCallback((level: ConsoleLogEntry['level'], message: string) => {
    const id = logIdRef.current++;
    setLogs((prev) => [...prev.slice(-199), { id, level, message, timestamp: Date.now() }]);
  }, []);

  const clearLogs = useCallback(() => setLogs([]), []);

  const simulatePageLogs = useCallback((pageUrl: string) => {
    if (clearOnNavigate) setLogs([]);
    // Simulate typical console output from a page
    const mockLogs: Array<{ level: ConsoleLogEntry['level']; message: string }> = [
      { level: 'info', message: `[Privacy Browser] Caricamento di ${pageUrl}` },
      { level: 'log', message: 'Document ready state: loading' },
      { level: 'log', message: 'DOMParser: parsed 142 nodes' },
      { level: 'info', message: '[Canvas Guard] Intercettato getContext("2d") - rumore iniettato' },
      { level: 'warn', message: '[Cookie Fence] 3 cookie di terze parti isolati e bloccati' },
      { level: 'log', message: '[Header Spoof] User-Agent simulato: Mozilla/5.0 (neutral)' },
      { level: 'warn', message: 'Mixed Content: bloccato 1 script http su https' },
      { level: 'log', message: '[uBlock Lite] 7 richieste pubblicitarie bloccate' },
      { level: 'error', message: 'Refused to execute script from tracking domain: adnxs.com' },
      { level: 'info', message: '[Privacy Shield] Fingerprint randomizzato con successo' },
    ];
    logIdRef.current = 0;
    const selected = mockLogs.sort(() => Math.random() - 0.5).slice(0, Math.floor(Math.random() * 4) + 5);
    selected.forEach((log, i) => {
      setTimeout(() => addLog(log.level, log.message), i * 150);
    });
  }, [clearOnNavigate, addLog]);

  return {
    logs,
    activeTab,
    clearOnNavigate,
    setActiveTab,
    setClearOnNavigate,
    addLog,
    clearLogs,
    simulatePageLogs,
  };
}
