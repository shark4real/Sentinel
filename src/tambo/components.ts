/**
 * TAMBO COMPONENT REGISTRATION
 *
 * Registers all Sentinel components with Tambo's generative UI system.
 * Each entry tells Tambo:
 *   - What the component is called (name)
 *   - When to use it (description)
 *   - What it is (component reference)
 *   - What props it accepts (Zod schema)
 *
 * When Tambo's AI processes a user message, it uses these registrations
 * to decide WHICH component to render and WHAT props to generate.
 *
 * For Sentinel, we register SentinelComposition as the primary component.
 * The AI fills in the UISchema as props, which SentinelComposition then
 * uses to render the appropriate sub-components via the registry.
 */

import { z } from 'zod';
import type { TamboComponent } from '@tambo-ai/react';
import SentinelComposition from '../components/composition/SentinelComposition';
import MetricCard from '../components/sentinel/MetricCard';
import AlertPanel from '../components/sentinel/AlertPanel';
import TimelineView from '../components/sentinel/TimelineView';
import LogViewer from '../components/sentinel/LogViewer';
import ChartView from '../components/sentinel/ChartView';
import ActionChecklist from '../components/sentinel/ActionChecklist';
import InsightSummary from '../components/sentinel/InsightSummary';
import RecommendationStrip from '../components/sentinel/RecommendationStrip';
import GeoMap from '../components/sentinel/GeoMap';
import StatusBanner from '../components/sentinel/StatusBanner';

// ─── Zod Schemas for Individual Components ────────────────────────

const metricCardSchema = z.object({
  title: z.string().describe('Metric name'),
  value: z.union([z.string(), z.number()]).describe('Current value'),
  change: z.number().optional().describe('Percentage change'),
  changeDirection: z.enum(['up', 'down', 'stable']).optional(),
  unit: z.string().optional(),
  status: z.enum(['normal', 'warning', 'critical']).optional(),
});

const alertSchema = z.object({
  id: z.string(),
  severity: z.enum(['info', 'warning', 'critical']),
  message: z.string(),
  timestamp: z.string(),
  source: z.string(),
});

const alertPanelSchema = z.object({
  alerts: z.array(alertSchema),
  title: z.string().optional(),
});

const timelineEventSchema = z.object({
  id: z.string(),
  timestamp: z.string(),
  title: z.string(),
  description: z.string(),
  severity: z.enum(['info', 'warning', 'critical']),
});

const timelineViewSchema = z.object({
  events: z.array(timelineEventSchema),
  title: z.string().optional(),
});

const logEntrySchema = z.object({
  id: z.string(),
  timestamp: z.string(),
  level: z.enum(['debug', 'info', 'warn', 'error']),
  message: z.string(),
  source: z.string(),
});

const logViewerSchema = z.object({
  logs: z.array(logEntrySchema),
  title: z.string().optional(),
});

const chartViewSchema = z.object({
  title: z.string(),
  data: z.array(z.object({ label: z.string(), value: z.number() })),
  chartType: z.enum(['bar', 'line', 'area']),
  color: z.string().optional(),
});

const checklistItemSchema = z.object({
  id: z.string(),
  label: z.string(),
  completed: z.boolean(),
  priority: z.enum(['low', 'medium', 'high', 'critical']),
});

const actionChecklistSchema = z.object({
  title: z.string(),
  items: z.array(checklistItemSchema),
});

const insightSchema = z.object({
  id: z.string(),
  text: z.string(),
  confidence: z.number(),
  category: z.string(),
});

const insightSummarySchema = z.object({
  title: z.string(),
  insights: z.array(insightSchema),
});

const recommendationSchema = z.object({
  id: z.string(),
  title: z.string(),
  description: z.string(),
  urgency: z.enum(['low', 'medium', 'high', 'critical']),
  action: z.string(),
});

const recommendationStripSchema = z.object({
  recommendations: z.array(recommendationSchema),
});

const geoPointSchema = z.object({
  id: z.string(),
  label: z.string(),
  x: z.number().describe('X position 0-100'),
  y: z.number().describe('Y position 0-100'),
  status: z.enum(['normal', 'warning', 'critical']),
});

const geoMapSchema = z.object({
  title: z.string(),
  points: z.array(geoPointSchema),
});

const statusBannerSchema = z.object({
  status: z.enum(['healthy', 'degraded', 'critical', 'investigating', 'maintenance']),
  title: z.string(),
  message: z.string(),
  timestamp: z.string(),
});

// ─── Master UISchema for SentinelComposition ──────────────────────

/**
 * Explicit props schema — a flat union of every component's props as optional keys.
 * Tambo does not allow z.record() (dynamic keys), so we enumerate all possible
 * prop fields across all 10 Sentinel components here.
 */
const componentPropsSchema = z.object({
  // MetricCard
  title: z.string().optional().describe('Shared: display title'),
  value: z.union([z.string(), z.number()]).optional().describe('MetricCard: current value'),
  change: z.number().optional().describe('MetricCard: percentage change'),
  changeDirection: z.enum(['up', 'down', 'stable']).optional().describe('MetricCard: trend'),
  unit: z.string().optional().describe('MetricCard: value unit'),
  status: z.enum(['normal', 'warning', 'critical', 'healthy', 'degraded', 'investigating', 'maintenance']).optional().describe('MetricCard / StatusBanner: status'),

  // AlertPanel
  alerts: z.array(z.object({
    id: z.string(),
    severity: z.enum(['info', 'warning', 'critical']),
    message: z.string(),
    timestamp: z.string(),
    source: z.string(),
  })).optional().describe('AlertPanel: list of alerts'),

  // TimelineView
  events: z.array(z.object({
    id: z.string(),
    timestamp: z.string(),
    title: z.string(),
    description: z.string(),
    severity: z.enum(['info', 'warning', 'critical']),
  })).optional().describe('TimelineView: list of events'),

  // LogViewer
  logs: z.array(z.object({
    id: z.string(),
    timestamp: z.string(),
    level: z.enum(['debug', 'info', 'warn', 'error']),
    message: z.string(),
    source: z.string(),
  })).optional().describe('LogViewer: list of log entries'),

  // ChartView
  data: z.array(z.object({ label: z.string(), value: z.number() })).optional().describe('ChartView: data points'),
  chartType: z.enum(['bar', 'line', 'area']).optional().describe('ChartView: chart type'),
  color: z.string().optional().describe('ChartView: accent color'),

  // ActionChecklist
  items: z.array(z.object({
    id: z.string(),
    label: z.string(),
    completed: z.boolean(),
    priority: z.enum(['low', 'medium', 'high', 'critical']),
  })).optional().describe('ActionChecklist: checklist items'),

  // InsightSummary
  insights: z.array(z.object({
    id: z.string(),
    text: z.string(),
    confidence: z.number(),
    category: z.string(),
  })).optional().describe('InsightSummary: AI insights'),

  // RecommendationStrip
  recommendations: z.array(z.object({
    id: z.string(),
    title: z.string(),
    description: z.string(),
    urgency: z.enum(['low', 'medium', 'high', 'critical']),
    action: z.string(),
  })).optional().describe('RecommendationStrip: recommended actions'),

  // GeoMap
  points: z.array(z.object({
    id: z.string(),
    label: z.string(),
    x: z.number().describe('X position 0-100'),
    y: z.number().describe('Y position 0-100'),
    status: z.enum(['normal', 'warning', 'critical']),
  })).optional().describe('GeoMap: geographic points'),

  // StatusBanner
  message: z.string().optional().describe('StatusBanner: banner message'),
  timestamp: z.string().optional().describe('StatusBanner: event timestamp'),
}).describe('Props matching the component type — include only the keys relevant to the chosen type');

const uiComponentSpecSchema = z.object({
  id: z.string(),
  type: z.enum([
    'MetricCard', 'AlertPanel', 'TimelineView', 'LogViewer',
    'ChartView', 'ActionChecklist', 'InsightSummary',
    'RecommendationStrip', 'GeoMap', 'StatusBanner',
  ]),
  props: componentPropsSchema,
  priority: z.number().describe('1 = highest'),
  visibility: z.enum(['visible', 'hidden', 'conditional']),
  visibilityCondition: z.string().optional(),
});

const uiSchemaZod = z.object({
  layout: z.enum(['grid', 'stack', 'split', 'overlay'])
    .describe('grid for dashboards, stack for urgent sequences, split for investigation, overlay for critical+base'),
  components: z.array(uiComponentSpecSchema)
    .describe('Ordered list of UI components to render'),
  confidence: z.number().min(0).max(1)
    .describe('AI confidence 0-1. Low = exploratory UI, high = directive UI'),
  explanation: z.string()
    .describe('Human-readable explanation of the UI composition choice'),
  reasoning: z.object({
    intent: z.enum(['overview', 'investigation', 'incident', 'escalation', 'exploration']),
    urgency: z.enum(['low', 'medium', 'high', 'critical']),
    uncertaintyAreas: z.array(z.string()),
    hiddenComponents: z.array(z.object({
      type: z.string(),
      reason: z.string(),
    })),
  }),
});

// ─── Tambo Component Registrations ────────────────────────────────

/**
 * Primary registration: SentinelComposition
 * This is the main generative component. The AI outputs the entire
 * UISchema as its props, and SentinelComposition handles rendering.
 */
export const sentinelComponents: TamboComponent[] = [
  {
    name: 'SentinelComposition',
    description:
      'AI-driven situational command center composition. Renders an adaptive UI based on a UISchema. ' +
      'Use this for ALL situation analysis, incident response, investigation, and overview requests. ' +
      'The schema controls layout (grid/stack/split/overlay), which components appear, their priority, ' +
      'and confidence level. Choose components based on intent: incidents need AlertPanel + ActionChecklist, ' +
      'overviews need MetricCard + ChartView, investigations need InsightSummary + LogViewer.',
    component: SentinelComposition,
    propsSchema: z.object({ schema: uiSchemaZod }),
  },
  // Individual components also registered for fine-grained AI selection
  {
    name: 'MetricCard',
    description: 'Displays a single KPI metric with optional trend. Use for numeric indicators.',
    component: MetricCard,
    propsSchema: metricCardSchema,
  },
  {
    name: 'AlertPanel',
    description: 'Severity-coded alert list. Use for incidents and active warnings.',
    component: AlertPanel,
    propsSchema: alertPanelSchema,
  },
  {
    name: 'TimelineView',
    description: 'Vertical timeline of events. Use for incident timelines and audit trails.',
    component: TimelineView,
    propsSchema: timelineViewSchema,
  },
  {
    name: 'LogViewer',
    description: 'Scrollable log pane with level coloring. Use for system logs and debugging.',
    component: LogViewer,
    propsSchema: logViewerSchema,
  },
  {
    name: 'ChartView',
    description: 'SVG chart (bar/line/area). Use for trends, comparisons, and distributions.',
    component: ChartView,
    propsSchema: chartViewSchema,
  },
  {
    name: 'ActionChecklist',
    description: 'Interactive checklist for incident response. Use for action items and procedures.',
    component: ActionChecklist,
    propsSchema: actionChecklistSchema,
  },
  {
    name: 'InsightSummary',
    description: 'AI insights with confidence bars. Use for analysis, hypotheses, and findings.',
    component: InsightSummary,
    propsSchema: insightSummarySchema,
  },
  {
    name: 'RecommendationStrip',
    description: 'Horizontal recommendation cards. Use for suggested next actions.',
    component: RecommendationStrip,
    propsSchema: recommendationStripSchema,
  },
  {
    name: 'GeoMap',
    description: 'Abstract geographic visualization. Use for regional status and distribution.',
    component: GeoMap,
    propsSchema: geoMapSchema,
  },
  {
    name: 'StatusBanner',
    description: 'Full-width system status indicator. Use at the top of any situational view.',
    component: StatusBanner,
    propsSchema: statusBannerSchema,
  },
];
