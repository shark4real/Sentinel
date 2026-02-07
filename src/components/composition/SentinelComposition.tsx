import React from 'react';
import type { UISchema, LayoutType } from '../../types/schema';
import GridLayout from './layouts/GridLayout';
import StackLayout from './layouts/StackLayout';
import SplitLayout from './layouts/SplitLayout';
import OverlayLayout from './layouts/OverlayLayout';

/**
 * SENTINEL COMPOSITION ENGINE
 *
 * This is the heart of the generative UI system. It receives a UISchema
 * from the AI — the ONLY input — and renders the full, adaptive interface.
 *
 * Architecture:
 * 1. Filters components by visibility
 * 2. Sorts by priority
 * 3. Selects the appropriate layout strategy
 * 4. Delegates rendering to layout components
 *
 * The AI controls everything: which components, which layout, which order.
 * This component has ZERO knowledge of business logic or situations.
 */

interface SentinelCompositionProps {
  schema: UISchema;
}

/** Map of layout types to their React implementations */
const layoutMap: Record<LayoutType, React.ComponentType<{ components: UISchema['components'] }>> = {
  grid: GridLayout,
  stack: StackLayout,
  split: SplitLayout,
  overlay: OverlayLayout,
};

const SentinelComposition: React.FC<SentinelCompositionProps> = ({ schema }) => {
  // Step 1: Filter to only visible components
  const visibleComponents = schema.components.filter(
    (c) => c.visibility === 'visible'
  );

  // Step 2: Sort by priority (1 = highest)
  const sorted = [...visibleComponents].sort((a, b) => a.priority - b.priority);

  // Step 3: Select layout engine
  const LayoutComponent = layoutMap[schema.layout] ?? GridLayout;

  // Step 4: Render confidence indicator
  const confidenceColor =
    schema.confidence >= 0.8
      ? 'var(--color-accent-green)'
      : schema.confidence >= 0.5
        ? 'var(--color-accent-amber)'
        : 'var(--color-accent-red)';

  return (
    <div className="sentinel-composition" data-layout={schema.layout}>
      {/* AI confidence strip — always visible */}
      <div className="sentinel-composition__confidence">
        <div
          className="sentinel-composition__confidence-bar"
          style={{
            width: `${schema.confidence * 100}%`,
            backgroundColor: confidenceColor,
          }}
        />
        <span className="sentinel-composition__confidence-label">
          AI Confidence: {Math.round(schema.confidence * 100)}%
        </span>
      </div>

      {/* Layout-driven component rendering */}
      <LayoutComponent components={sorted} />
    </div>
  );
};

export default SentinelComposition;
