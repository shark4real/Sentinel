import React from 'react';
import type { UIComponentSpec } from '../../../types/schema';
import { resolveComponent } from '../../registry';

/**
 * StackLayout — Arranges components in a single vertical stack.
 * Used for escalation/critical scenarios where linear priority matters.
 */
const StackLayout: React.FC<{ components: UIComponentSpec[] }> = ({
  components,
}) => {
  return (
    <div className="sentinel-layout sentinel-layout--stack">
      {components.map((spec) => {
        const Component = resolveComponent(spec.type);
        if (!Component) return null;

        return (
          <div
            key={spec.id}
            className="sentinel-layout__cell sentinel-layout__cell--full"
            style={{ animationDelay: `${spec.priority * 60}ms` }}
          >
            <Component {...spec.props} />
          </div>
        );
      })}
    </div>
  );
};

export default StackLayout;
