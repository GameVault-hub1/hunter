import { useState, useCallback } from 'react';
import type { LoadedExtension } from '../lib/privacy';
import { PRESET_EXTENSIONS, generateId } from '../lib/extensions';

export function useExtensions() {
  const [extensions, setExtensions] = useState<LoadedExtension[]>(PRESET_EXTENSIONS);
  const [customScript, setCustomScript] = useState('');
  const [customName, setCustomName] = useState('');
  const [customError, setCustomError] = useState<string | null>(null);

  const toggleExtension = useCallback((id: string) => {
    setExtensions((prev) =>
      prev.map((ext) =>
        ext.id === id
          ? { ...ext, active: !ext.active, enabledAt: !ext.active ? Date.now() : undefined }
          : ext
      )
    );
  }, []);

  const removeExtension = useCallback((id: string) => {
    setExtensions((prev) => prev.filter((ext) => ext.id !== id));
  }, []);

  const loadCustomExtension = useCallback(() => {
    setCustomError(null);
    if (!customScript.trim()) {
      setCustomError('Inserisci il codice dello script o il contenuto .crx da caricare.');
      return;
    }
    const name = customName.trim() || `Estensione Custom #${Date.now().toString(36)}`;
    const newExt: LoadedExtension = {
      id: generateId(),
      name,
      description: 'Estensione personalizzata caricata manualmente - nessuna firma richiesta.',
      version: '1.0.0-custom',
      source: customScript.trim().slice(0, 200),
      active: true,
      enabledAt: Date.now(),
      custom: true,
    };
    setExtensions((prev) => [newExt, ...prev]);
    setCustomScript('');
    setCustomName('');
  }, [customScript, customName]);

  return {
    extensions,
    customScript,
    customName,
    customError,
    setCustomScript,
    setCustomName,
    toggleExtension,
    removeExtension,
    loadCustomExtension,
  };
}
