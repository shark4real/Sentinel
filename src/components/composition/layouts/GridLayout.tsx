import React from 'react';
import type { UIComponentSpec } from '../../../types/schema';
import { resolveComponent } from '../../registry';

/**
 * GridLayout — Arranges components in a responsive CSS grid.
 * StatusBanner spans the full width. MetricCards share a row.
 */
const GridLayout: React.FC<{ components: UIComponentSpec[] }> = ({
  components,
}) => {
  return (
    <div className="sentinel-layout sentinel-layout--grid">
      {components.map((spec) => {
        const Component = resolveComponent(spec.type);
        if (!Component) return null;

        // StatusBanner always spans full width
        const isFullWidth =
          spec.type === 'StatusBanner' || spec.type === 'RecommendationStrip';
        // MetricCards are compact
        const isCompact = spec.type === 'MetricCard';

        return (
          <div
            key={spec.id}
            className={`sentinel-layout__cell ${
              isFullWidth
                ? 'sentinel-layout__cell--full'
                : isCompact
                  ? 'sentinel-layout__cell--quarter'
                  : 'sentinel-layout__cell--half'
            }`}
            style={{ animationDelay: `${spec.priority * 60}ms` }}
          >
            <Component {...spec.props} />
          </div>
        );
      })}
    </div>
  );
};

export default GridLayout;
