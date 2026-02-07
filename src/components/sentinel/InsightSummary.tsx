import React from 'react';
import type { InsightSummaryProps } from '../../types/schema';

/**
 * InsightSummary — Displays AI-generated insights with confidence bars.
 * Self-contained. Accepts props only. No business logic.
 */
const InsightSummary: React.FC<InsightSummaryProps> = ({ title, insights }) => {
  const getConfidenceColor = (confidence: number): string => {
    if (confidence >= 0.8) return 'var(--color-accent-green)';
    if (confidence >= 0.5) return 'var(--color-accent-amber)';
    return 'var(--color-accent-red)';
  };

  const getConfidenceLabel = (confidence: number): string => {
    if (confidence >= 0.8) return 'High';
    if (confidence >= 0.5) return 'Medium';
    return 'Low';
  };

  return (
    <div className="sentinel-card sentinel-insights">
      <h3 className="sentinel-card__title">{title}</h3>
      <div className="sentinel-insights__list">
        {insights.map((insight) => (
          <div key={insight.id} className="sentinel-insights__item">
            <div className="sentinel-insights__header">
              <span className="sentinel-insights__category">
                {insight.category}
              </span>
              <span
                className="sentinel-insights__confidence"
                style={{ color: getConfidenceColor(insight.confidence) }}
              >
                {getConfidenceLabel(insight.confidence)} (
                {Math.round(insight.confidence * 100)}%)
              </span>
            </div>
            <div className="sentinel-insights__text">{insight.text}</div>
            <div className="sentinel-insights__bar-bg">
              <div
                className="sentinel-insights__bar-fill"
                style={{
                  width: `${insight.confidence * 100}%`,
                  backgroundColor: getConfidenceColor(insight.confidence),
                }}
              />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default InsightSummary;
