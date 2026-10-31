import type { LoadedExtension } from './privacy';

export const PRESET_EXTENSIONS: LoadedExtension[] = [
  {
    id: 'ubo-lite',
    name: 'uBlock Lite',
    description: 'Blocca advertisign, banner e pop-up aggressivi al caricamento pagina.',
    version: '1.5.2',
    source: 'Blocca richieste a oltre 40.000 domini pubblicitari noti',
    active: false,
    custom: false,
  },
  {
    id: 'canvas-guard',
    name: 'Canvas Guard',
    description: 'Inietta rumore nel rendering canvas per neutralizzare il fingerprinting.',
    version: '0.9.1',
    source: 'Cattura getContext, toDataURL, toBlob e restituisce dati alterati',
    active: false,
    custom: false,
  },
  {
    id: 'cookie-fence',
    name: 'Cookie Fence',
    description: 'Isola cookie e sessionStorage per dominio impedendo tracciamento cross-site.',
    version: '2.0.0',
    source: 'Wrapper di document.cookie con sandbox virtuale per-origin',
    active: false,
    custom: false,
  },
  {
    id: 'header-spoof',
    name: 'Header Spoof',
    description: 'Simula header User-Agent e Accept-Language neutri per ridurre identificazione.',
    version: '1.1.0',
    source: 'Sovrascrive navigator.userAgent e languages con valori generici',
    active: false,
    custom: false,
  },
  {
    id: 'no-script-flex',
    name: 'NoScript Flex',
    description: 'Permette di abilitare selettivamente JavaScript solo su domini fidati.',
    version: '3.2.1',
    source: 'Intercepts script tags e gestisce allowlist personalizzata',
    active: false,
    custom: false,
  },
  {
    id: 'decentraleyes',
    name: 'Decentraleyes',
    description: 'Serve localmente librerie JS comuni evitando richieste a CDN traccianti.',
    version: '2.0.20',
    source: 'Cache locale di jQuery, React, lodash e altre 50+ librerie',
    active: false,
    custom: false,
  },
];

export function generateId(): string {
  return `ext-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`;
}
