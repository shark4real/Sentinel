import React from 'react';
import type { UIComponentSpec } from '../../../types/schema';
import { resolveComponent } from '../../registry';

/**
 * SplitLayout — Two-column layout for investigation/exploration.
 * Left column: primary components (first half). Right column: secondary (second half).
 */
const SplitLayout: React.FC<{ components: UIComponentSpec[] }> = ({
  components,
}) => {
  const mid = Math.ceil(components.length / 2);
  const left = components.slice(0, mid);
  const right = components.slice(mid);

  const renderColumn = (items: UIComponentSpec[]) =>
    items.map((spec) => {
      const Component = resolveComponent(spec.type);
      if (!Component) return null;

      const isFullWidth =
        spec.type === 'StatusBanner' || spec.type === 'RecommendationStrip';

      return (
        <div
          key={spec.id}
          className={`sentinel-layout__cell ${
            isFullWidth
              ? 'sentinel-layout__cell--full'
              : 'sentinel-layout__cell--full'
          }`}
          style={{ animationDelay: `${spec.priority * 60}ms` }}
        >
          <Component {...spec.props} />
        </div>
      );
    });

  return (
    <div className="sentinel-layout sentinel-layout--split">
      <div className="sentinel-layout__split-left">{renderColumn(left)}</div>
      <div className="sentinel-layout__split-right">{renderColumn(right)}</div>
    </div>
  );
};

export default SplitLayout;
