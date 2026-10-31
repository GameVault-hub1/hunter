import { useEffect } from 'react';
import { useBrowser } from './hooks/useBrowser';
import { BrowserChrome } from './components/BrowserChrome';
import { WebView } from './components/WebView';
import { DevToolsPanel } from './components/DevToolsPanel';
import { ExtensionsPanel } from './components/ExtensionsPanel';
import { PrivacyShield } from './components/PrivacyShield';

function App() {
  const browser = useBrowser();

  // Simulate console logs on navigation
  useEffect(() => {
    if (browser.currentSrc) {
      browser.devtools.simulatePageLogs(browser.currentSrc);
    }
  }, [browser.currentSrc]);

  const canGoBack = browser.historyIndex > 0;
  const canGoForward = browser.historyIndex < browser.history.length - 1;

  return (
    <div className="h-screen flex flex-col bg-[#0a0b10] overflow-hidden select-none">
      <BrowserChrome
        displayUrl={browser.displayUrl}
        canGoBack={canGoBack}
        canGoForward={canGoForward}
        loading={browser.loading}
        incognito={browser.incognito}
        trackerCount={browser.privacy.stats.trackersBlocked}
        onNavigate={browser.navigate}
        onBack={browser.goBack}
        onForward={browser.goForward}
        onReload={browser.reload}
        onHome={browser.goHome}
        onShield={() => browser.setShowShield(true)}
        onToggleDevTools={() => browser.togglePanel('devtools')}
        onToggleExtensions={() => browser.togglePanel('extensions')}
        onToggleIncognito={() => browser.setIncognito((v) => !v)}
        devToolsActive={browser.activePanel === 'devtools'}
        extensionsActive={browser.activePanel === 'extensions'}
      />

      <div className="flex-1 flex flex-col overflow-hidden">
        <WebView
          currentSrc={browser.currentSrc}
          displayUrl={browser.url}
          loading={browser.loading}
          iframeRef={browser.iframeRef}
          onQuickSearch={(q) => browser.navigate(q)}
        />

        {browser.activePanel === 'devtools' && (
          <DevToolsPanel
            logs={browser.devtools.logs}
            activeTab={browser.devtools.activeTab}
            currentSrc={browser.url}
            onTabChange={browser.devtools.setActiveTab}
            onClearLogs={browser.devtools.clearLogs}
            onClose={() => browser.togglePanel('devtools')}
          />
        )}

        {browser.activePanel === 'extensions' && (
          <ExtensionsPanel
            extensions={browser.extensions.extensions}
            customScript={browser.extensions.customScript}
            customName={browser.extensions.customName}
            customError={browser.extensions.customError}
            onScriptChange={browser.extensions.setCustomScript}
            onNameChange={browser.extensions.setCustomName}
            onToggle={browser.extensions.toggleExtension}
            onRemove={browser.extensions.removeExtension}
            onLoad={browser.extensions.loadCustomExtension}
            onClose={() => browser.togglePanel('extensions')}
          />
        )}
      </div>

      {browser.showShield && (
        <PrivacyShield
          stats={browser.privacy.stats}
          blockedTrackers={browser.privacy.blockedTrackers}
          incognito={browser.incognito}
          onClose={() => browser.setShowShield(false)}
        />
      )}
    </div>
  );
}

export default App;
