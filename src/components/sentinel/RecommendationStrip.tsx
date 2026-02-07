import React from 'react';
import type { RecommendationStripProps } from '../../types/schema';

/**
 * RecommendationStrip — Horizontal strip of actionable recommendations.
 * Self-contained. Accepts props only. No business logic.
 */
const RecommendationStrip: React.FC<RecommendationStripProps> = ({
  recommendations,
}) => {
  const urgencyColors: Record<string, string> = {
    critical: 'var(--color-accent-red)',
    high: 'var(--color-accent-amber)',
    medium: 'var(--color-accent-blue)',
    low: 'var(--color-accent-green)',
  };

  return (
    <div className="sentinel-card sentinel-recs">
      <h3 className="sentinel-card__title">Recommendations</h3>
      <div className="sentinel-recs__strip">
        {recommendations.map((rec) => (
          <div
            key={rec.id}
            className="sentinel-recs__item"
            style={{ borderLeftColor: urgencyColors[rec.urgency] }}
          >
            <div className="sentinel-recs__item-header">
              <span className="sentinel-recs__title">{rec.title}</span>
              <span
                className="sentinel-recs__urgency"
                style={{ color: urgencyColors[rec.urgency] }}
              >
                {rec.urgency.toUpperCase()}
              </span>
            </div>
            <div className="sentinel-recs__desc">{rec.description}</div>
            <button className="sentinel-recs__action">{rec.action}</button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default RecommendationStrip;
