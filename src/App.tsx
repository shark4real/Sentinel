/**
 * SENTINEL — AI-Driven Situational Command Center
 *
 * Architecture:
 * - TamboProvider wraps the app (when API key available) for cloud AI features
 * - Local analysis engine handles demo mode (always available)
 * - SentinelComposition renders UI from AISchema — the ONLY rendering path
 * - No fixed routes, no static dashboards, no hardcoded flows
 *
 * The same prompt may produce different UI based on analysis context.
 */

import React, { useState, useCallback, Component, type ErrorInfo, type ReactNode } from 'react';
import { TamboProvider } from '@tambo-ai/react';
import type { UISchema } from './types/schema';
import { analyzeSituation } from './ai/analyzer';
import { sentinelComponents } from './tambo/components';
import { sentinelTools } from './tambo/tools';
import SentinelComposition from './components/composition/SentinelComposition';
import SituationInput from './components/shell/SituationInput';
import ExplainabilityPanel from './components/shell/ExplainabilityPanel';

// ─── Error Boundary ───────────────────────────────────────────────

interface ErrorBoundaryState {
  hasError: boolean;
  error: Error | null;
}

class SentinelErrorBoundary extends Component<{ children: ReactNode }, ErrorBoundaryState> {
  state: ErrorBoundaryState = { hasError: false, error: null };

  static getDerivedStateFromError(error: Error) {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, info: ErrorInfo) {
    console.error('[Sentinel] Render error:', error, info.componentStack);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div style={{ padding: 40, color: '#ff6b6b', background: '#0d1117', minHeight: '100vh', fontFamily: 'monospace' }}>
          <h1>⚠ Sentinel Error</h1>
          <pre style={{ color: '#e6edf3', whiteSpace: 'pre-wrap' }}>
            {this.state.error?.message}
          </pre>
          <pre style={{ color: '#8b949e', fontSize: 12, whiteSpace: 'pre-wrap' }}>
            {this.state.error?.stack}
          </pre>
          <button
            onClick={() => this.setState({ hasError: false, error: null })}
            style={{ marginTop: 20, padding: '8px 16px', background: '#238636', color: '#fff', border: 'none', borderRadius: 6, cursor: 'pointer' }}
          >
            Retry
          </button>
        </div>
      );
    }
    return this.props.children;
  }
}

// ─── Sentinel Core App ────────────────────────────────────────────

const SentinelApp: React.FC = () => {
  const [schema, setSchema] = useState<UISchema | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [showExplanation, setShowExplanation] = useState(false);
  const [lastPrompt, setLastPrompt] = useState('');

  const handleSituationSubmit = useCallback(async (input: string) => {
    setIsAnalyzing(true);
    setLastPrompt(input);

    try {
      // AI analysis produces a UISchema — the ONLY rendering contract
      const result = await analyzeSituation(input);
      setSchema(result);
    } catch (err) {
      console.error('Analysis failed:', err);
    } finally {
      setIsAnalyzing(false);
    }
  }, []);

  return (
    <div className="sentinel-app">
      {/* ─── Top Bar ─── */}
      <header className="sentinel-header">
        <div className="sentinel-header__left">
          <div className="sentinel-header__logo">
            <span className="sentinel-header__icon">◆</span>
            <h1 className="sentinel-header__title">SENTINEL</h1>
          </div>
          <span className="sentinel-header__subtitle">
            AI Situational Command Center
          </span>
        </div>
        <div className="sentinel-header__right">
          {schema && (
            <button
              className={`sentinel-header__explain-btn ${showExplanation ? 'sentinel-header__explain-btn--active' : ''}`}
              onClick={() => setShowExplanation(!showExplanation)}
            >
              {showExplanation ? '✕ Hide' : '🧠 Why this UI?'}
            </button>
          )}
          <div className="sentinel-header__status">
            <span className="sentinel-header__dot" />
            <span>
              {isAnalyzing ? 'Analyzing...' : schema ? 'Ready' : 'Awaiting input'}
            </span>
          </div>
        </div>
      </header>

      {/* ─── Main Content ─── */}
      <main className="sentinel-main">
        {schema ? (
          <div className="sentinel-main__content">
            {/* Current prompt display */}
            {lastPrompt && (
              <div className="sentinel-main__prompt">
                <span className="sentinel-main__prompt-label">Situation:</span>
                <span className="sentinel-main__prompt-text">"{lastPrompt}"</span>
              </div>
            )}

            {/* Generated UI from AI schema */}
            <SentinelComposition schema={schema} />

            {/* Explainability panel (toggleable) */}
            {showExplanation && <ExplainabilityPanel schema={schema} />}
          </div>
        ) : (
          /* ─── Welcome Screen ─── */
          <div className="sentinel-welcome">
            <div className="sentinel-welcome__icon">◆</div>
            <h2 className="sentinel-welcome__title">SENTINEL</h2>
            <p className="sentinel-welcome__desc">
              Describe a situation. The AI will compose the right interface.
            </p>
            <div className="sentinel-welcome__examples">
              <span className="sentinel-welcome__label">Try saying:</span>
              <div className="sentinel-welcome__list">
                <code>"Users are reporting login failures"</code>
                <code>"Give me a high-level overview of today"</code>
                <code>"Something feels off, help me investigate"</code>
                <code>"This is escalating, what should I do now?"</code>
              </div>
            </div>
          </div>
        )}
      </main>

      {/* ─── Situation Input ─── */}
      <SituationInput onSubmit={handleSituationSubmit} isLoading={isAnalyzing} />
    </div>
  );
};

// ─── App Root with Tambo Provider ─────────────────────────────────

/**
 * Root component. Wraps in TamboProvider when API key is available.
 * Without a key, the app runs in local analysis mode (fully functional).
 *
 * TamboProvider enables:
 * - Cloud AI component selection
 * - Streamed prop generation
 * - Conversation history
 * - Remote tool execution
 *
 * Local mode enables:
 * - All rendering features
 * - Local analysis engine
 * - Full demo capability
 */
const App: React.FC = () => {
  const apiKey = import.meta.env.VITE_TAMBO_API_KEY;

  // Always wrap in error boundary; TamboProvider only when API key present
  return (
    <SentinelErrorBoundary>
      {apiKey ? (
        <TamboProvider
          apiKey={apiKey}
          components={sentinelComponents}
          tools={sentinelTools}
        >
          <SentinelApp />
        </TamboProvider>
      ) : (
        <SentinelApp />
      )}
    </SentinelErrorBoundary>
  );
};

export default App;
