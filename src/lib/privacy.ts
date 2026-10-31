export interface BlockedTracker {
  domain: string;
  type: 'ad' | 'analytics' | 'social' | 'fingerprint';
  blockedAt: number;
}

export interface ConsoleLogEntry {
  id: number;
  level: 'log' | 'info' | 'warn' | 'error' | 'debug';
  message: string;
  timestamp: number;
}

export interface LoadedExtension {
  id: string;
  name: string;
  description: string;
  version: string;
  source: string;
  active: boolean;
  enabledAt?: number;
  custom: boolean;
}

export interface PrivacyStats {
  trackersBlocked: number;
  cookiesIsolated: number;
  fingerprintNoiseEvents: number;
  canvasProtected: boolean;
  cookiesIsolatedActive: boolean;
  dntActive: boolean;
}

export const TRACKER_DOMAINS: Record<string, 'ad' | 'analytics' | 'social' | 'fingerprint'> = {
  'doubleclick.net': 'ad',
  'googleadservices.com': 'ad',
  'googlesyndication.com': 'ad',
  'adservice.google.com': 'ad',
  'facebook.com/tr': 'ad',
  'amazon-adsystem.com': 'ad',
  'criteo.com': 'ad',
  'taboola.com': 'ad',
  'outbrain.com': 'ad',
  'adnxs.com': 'ad',
  'moatads.com': 'ad',
  'adsafeprotected.com': 'ad',
  'google-analytics.com': 'analytics',
  'analytics.google.com': 'analytics',
  'googletagmanager.com': 'analytics',
  'hotjar.com': 'analytics',
  'mixpanel.com': 'analytics',
  'segment.com': 'analytics',
  'amplitude.com': 'analytics',
  'newrelic.com': 'analytics',
  'quantserve.com': 'analytics',
  'scorecardresearch.com': 'analytics',
  'connect.facebook.net': 'social',
  'platform.twitter.com': 'social',
  'platform.linkedin.com': 'social',
  'snap.licdn.com': 'social',
  'analytics.tiktok.com': 'social',
  'fingerprintjs.com': 'fingerprint',
  'clientjs.org': 'fingerprint',
  'deviceatlas.com': 'fingerprint',
  'iovation.com': 'fingerprint',
};

export function classifyUrl(url: string): { blocked: boolean; type?: string; domain?: string } {
  try {
    const u = new URL(url, window.location.origin);
    const host = u.hostname.replace(/^www\./, '');
    for (const [domain, type] of Object.entries(TRACKER_DOMAINS)) {
      if (host.endsWith(domain) || url.includes(domain)) {
        return { blocked: true, type, domain };
      }
    }
    return { blocked: false };
  } catch {
    return { blocked: false };
  }
}

export function isLikelyUrl(input: string): boolean {
  const trimmed = input.trim();
  if (!trimmed) return false;
  if (trimmed.includes(' ')) return false;
  if (/^https?:\/\//i.test(trimmed)) return true;
  if (/^[\w-]+(\.[\w-]+)+/.test(trimmed) && !trimmed.includes(' ')) return true;
  return false;
}

export function toUrl(input: string): string {
  const trimmed = input.trim();
  if (/^https?:\/\//i.test(trimmed)) return trimmed;
  if (/^[\w-]+(\.[\w-]+)+/.test(trimmed)) return `https://${trimmed}`;
  return `https://duckduckgo.com/?q=${encodeURIComponent(trimmed)}&kp=1&kl=it-it`;
}

const PROXY_ENDPOINT = `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/web-proxy`;

export function buildProxyUrl(targetUrl: string): string {
  return `${PROXY_ENDPOINT}?url=${encodeURIComponent(targetUrl)}`;
}

export function normalizeDisplay(url: string): string {
  if (url.startsWith('https://duckduckgo.com/?q=')) {
    try {
      const params = new URLSearchParams(url.split('?')[1]);
      return params.get('q') || url;
    } catch {
      return url;
    }
  }
  return url.replace(/^https?:\/\//, '');
}
