/**
 * SENTINEL COMPONENT REGISTRY
 *
 * Central mapping of component type names to their React implementations.
 * This is the bridge between the AI's JSON schema and actual UI rendering.
 *
 * Architecture decision: We use a simple map rather than a DI container
 * because every component is self-contained and stateless (props only).
 * The registry is consumed by SentinelComposition to resolve type → component.
 *
 * To add a new component:
 * 1. Create it in src/components/sentinel/
 * 2. Add its props interface to src/types/schema.ts
 * 3. Register it in this map
 * 4. Add its Zod schema in src/tambo/components.ts
 */

import React from 'react';
import type { ComponentType } from '../../types/schema';

import MetricCard from '../sentinel/MetricCard';
import AlertPanel from '../sentinel/AlertPanel';
import TimelineView from '../sentinel/TimelineView';
import LogViewer from '../sentinel/LogViewer';
import ChartView from '../sentinel/ChartView';
import ActionChecklist from '../sentinel/ActionChecklist';
import InsightSummary from '../sentinel/InsightSummary';
import RecommendationStrip from '../sentinel/RecommendationStrip';
import GeoMap from '../sentinel/GeoMap';
import StatusBanner from '../sentinel/StatusBanner';

/**
 * The registry: a map from AI schema component type names
 * to their concrete React component implementations.
 */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const componentRegistry: Record<ComponentType, React.ComponentType<any>> = {
  MetricCard,
  AlertPanel,
  TimelineView,
  LogViewer,
  ChartView,
  ActionChecklist,
  InsightSummary,
  RecommendationStrip,
  GeoMap,
  StatusBanner,
};

/**
 * Resolve a component type string to its React component.
 * Returns null if the type is not registered (defensive).
 */
export function resolveComponent(
  type: ComponentType
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
): React.ComponentType<any> | null {
  return componentRegistry[type] ?? null;
}

/**
 * Get all registered component type names.
 */
export function getRegisteredTypes(): ComponentType[] {
  return Object.keys(componentRegistry) as ComponentType[];
}
