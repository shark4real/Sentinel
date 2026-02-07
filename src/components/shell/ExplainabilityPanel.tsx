import React from 'react';
import type { UISchema } from '../../types/schema';

/**
 * ExplainabilityPanel — "Why this UI?" feature.
 *
 * Renders the AI's reasoning for the current composition:
 * - Why this layout was chosen
 * - What the AI detected (intent, urgency)
 * - Why certain components are visible
 * - Why others are hidden
 * - Uncertainty areas
 *
 * All data comes from the UISchema — no business logic here.
 */

interface ExplainabilityPanelProps {
  schema: UISchema;
}

const ExplainabilityPanel: React.FC<ExplainabilityPanelProps> = ({ schema }) => {
  const { reasoning, explanation, confidence, layout, components } = schema;

  const urgencyColors: Record<string, string> = {
    low: 'var(--color-accent-green)',
    medium: 'var(--color-accent-amber)',
    high: 'var(--color-accent-red)',
    critical: 'var(--color-accent-red)',
  };

  const confidenceLabel =
    confidence >= 0.8 ? 'High' : confidence >= 0.5 ? 'Medium' : 'Low';

  return (
    <div className="sentinel-explain">
      <div className="sentinel-explain__header">
        <h3 className="sentinel-explain__title">🧠 Why This UI?</h3>
      </div>

      {/* AI Explanation */}
      <div className="sentinel-explain__section">
        <h4>AI Reasoning</h4>
        <p className="sentinel-explain__text">{explanation}</p>
      </div>

      {/* Classification */}
      <div className="sentinel-explain__section">
        <h4>Analysis</h4>
        <div className="sentinel-explain__grid">
          <div className="sentinel-explain__fact">
            <span className="sentinel-explain__label">Intent</span>
            <span className="sentinel-explain__value">{reasoning.intent}</span>
          </div>
          <div className="sentinel-explain__fact">
            <span className="sentinel-explain__label">Urgency</span>
            <span
              className="sentinel-explain__value"
              style={{ color: urgencyColors[reasoning.urgency] }}
            >
              {reasoning.urgency.toUpperCase()}
            </span>
          </div>
          <div className="sentinel-explain__fact">
            <span className="sentinel-explain__label">Confidence</span>
            <span className="sentinel-explain__value">
              {confidenceLabel} ({Math.round(confidence * 100)}%)
            </span>
          </div>
          <div className="sentinel-explain__fact">
            <span className="sentinel-explain__label">Layout</span>
            <span className="sentinel-explain__value">{layout}</span>
          </div>
        </div>
      </div>

      {/* Visible Components */}
      <div className="sentinel-explain__section">
        <h4>Shown Components ({components.filter((c) => c.visibility === 'visible').length})</h4>
        <div className="sentinel-explain__components">
          {components
            .filter((c) => c.visibility === 'visible')
            .sort((a, b) => a.priority - b.priority)
            .map((c) => (
              <div key={c.id} className="sentinel-explain__comp sentinel-explain__comp--shown">
                <span className="sentinel-explain__comp-type">{c.type}</span>
                <span className="sentinel-explain__comp-priority">
                  Priority: {c.priority}
                </span>
              </div>
            ))}
        </div>
      </div>

      {/* Hidden Components */}
      {reasoning.hiddenComponents.length > 0 && (
        <div className="sentinel-explain__section">
          <h4>Hidden Components ({reasoning.hiddenComponents.length})</h4>
          <div className="sentinel-explain__components">
            {reasoning.hiddenComponents.map((h, i) => (
              <div key={i} className="sentinel-explain__comp sentinel-explain__comp--hidden">
                <span className="sentinel-explain__comp-type">{h.type}</span>
                <span className="sentinel-explain__comp-reason">{h.reason}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Uncertainty Areas */}
      {reasoning.uncertaintyAreas.length > 0 && (
        <div className="sentinel-explain__section">
          <h4>Uncertainty Areas</h4>
          <ul className="sentinel-explain__list">
            {reasoning.uncertaintyAreas.map((area, i) => (
              <li key={i}>{area}</li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};

export default ExplainabilityPanel;
