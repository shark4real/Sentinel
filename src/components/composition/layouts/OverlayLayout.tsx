import React from 'react';
import type { UIComponentSpec } from '../../../types/schema';
import { resolveComponent } from '../../registry';

/**
 * OverlayLayout — Base grid with floating overlay for urgent components.
 * High-priority components (priority <= 2) are rendered as overlays.
 */
const OverlayLayout: React.FC<{ components: UIComponentSpec[] }> = ({
  components,
}) => {
  const overlays = components.filter((c) => c.priority <= 2);
  const base = components.filter((c) => c.priority > 2);

  return (
    <div className="sentinel-layout sentinel-layout--overlay">
      {/* Base layer */}
      <div className="sentinel-layout__overlay-base">
        {base.map((spec) => {
          const Component = resolveComponent(spec.type);
          if (!Component) return null;
          return (
            <div
              key={spec.id}
              className="sentinel-layout__cell sentinel-layout__cell--half"
              style={{ animationDelay: `${spec.priority * 60}ms` }}
            >
              <Component {...spec.props} />
            </div>
          );
        })}
      </div>

      {/* Overlay layer */}
      {overlays.length > 0 && (
        <div className="sentinel-layout__overlay-top">
          {overlays.map((spec) => {
            const Component = resolveComponent(spec.type);
            if (!Component) return null;
            return (
              <div
                key={spec.id}
                className="sentinel-layout__cell sentinel-layout__cell--full sentinel-layout__cell--overlay"
                style={{ animationDelay: `${spec.priority * 60}ms` }}
              >
                <Component {...spec.props} />
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default OverlayLayout;
