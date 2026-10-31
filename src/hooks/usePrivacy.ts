import { useState, useCallback, useEffect } from 'react';
import type { BlockedTracker, PrivacyStats } from '../lib/privacy';
import { classifyUrl } from '../lib/privacy';

const INITIAL_STATS: PrivacyStats = {
  trackersBlocked: 0,
  cookiesIsolated: 0,
  fingerprintNoiseEvents: 0,
  canvasProtected: true,
  cookiesIsolatedActive: true,
  dntActive: true,
};

export function usePrivacy() {
  const [stats, setStats] = useState<PrivacyStats>(INITIAL_STATS);
  const [blockedTrackers, setBlockedTrackers] = useState<BlockedTracker[]>([]);

  const trackPageLoad = useCallback((pageUrl: string) => {
    // Simulate detecting and blocking trackers that the page would load
    const mockTrackers = generateMockTrackers(pageUrl);
    if (mockTrackers.length > 0) {
      setBlockedTrackers((prev) => [...mockTrackers, ...prev].slice(0, 50));
      setStats((prev) => ({
        ...prev,
        trackersBlocked: prev.trackersBlocked + mockTrackers.length,
        cookiesIsolated: prev.cookiesIsolated + Math.floor(Math.random() * 3) + 1,
        fingerprintNoiseEvents: prev.fingerprintNoiseEvents + Math.floor(Math.random() * 5) + 2,
      }));
    }
  }, []);

  const resetSession = useCallback(() => {
    setStats(INITIAL_STATS);
    setBlockedTrackers([]);
  }, []);

  // Simulate ongoing fingerprint protection
  useEffect(() => {
    const interval = setInterval(() => {
      setStats((prev) => ({
        ...prev,
        fingerprintNoiseEvents: prev.fingerprintNoiseEvents + Math.floor(Math.random() * 2),
      }));
    }, 8000);
    return () => clearInterval(interval);
  }, []);

  return { stats, blockedTrackers, trackPageLoad, resetSession };
}

function generateMockTrackers(pageUrl: string): BlockedTracker[] {
  const now = Date.now();
  const allTypes: Array<{ domain: string; type: 'ad' | 'analytics' | 'social' | 'fingerprint' }> = [
    { domain: 'doubleclick.net', type: 'ad' },
    { domain: 'google-analytics.com', type: 'analytics' },
    { domain: 'googletagmanager.com', type: 'analytics' },
    { domain: 'facebook.com/tr', type: 'social' },
    { domain: 'fingerprintjs.com', type: 'fingerprint' },
    { domain: 'hotjar.com', type: 'analytics' },
    { domain: 'criteo.com', type: 'ad' },
    { domain: 'taboola.com', type: 'ad' },
    { domain: 'scorecardresearch.com', type: 'analytics' },
  ];
  const count = Math.floor(Math.random() * 4) + 2;
  const shuffled = [...allTypes].sort(() => Math.random() - 0.5);
  return shuffled.slice(0, count).map((t) => ({
    domain: t.domain,
    type: t.type,
    blockedAt: now,
  }));
}
