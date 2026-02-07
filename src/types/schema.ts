/**
 * SENTINEL AI → UI SCHEMA CONTRACT
 *
 * This is the ONLY interface between the AI analysis engine and the renderer.
 * The AI produces a UISchema. The renderer consumes it. Nothing else.
 *
 * This schema drives ALL rendering decisions:
 * - Which components appear
 * - How they are laid out
 * - Their priority ordering
 * - Visibility conditions
 * - Confidence transparency
 * - Explainability metadata
 */

// ─── Layout & Rendering Enums ─────────────────────────────────────

/** Layout strategies the AI can choose from */
export type LayoutType = 'grid' | 'stack' | 'split' | 'overlay';

/** Component visibility states */
export type VisibilityState = 'visible' | 'hidden' | 'conditional';

/** Urgency classification driving UI adaptation */
export type UrgencyLevel = 'low' | 'medium' | 'high' | 'critical';

/** Intent classification from user input */
export type IntentType =
  | 'overview'
  | 'investigation'
  | 'incident'
  | 'escalation'
  | 'exploration';

/** Severity levels for alerts and events */
export type Severity = 'info' | 'warning' | 'critical';

/** Status for banners and overall system state */
export type SystemStatus =
  | 'healthy'
  | 'degraded'
  | 'critical'
  | 'investigating'
  | 'maintenance';

/** Component types — maps 1:1 to the component registry */
export type ComponentType =
  | 'MetricCard'
  | 'AlertPanel'
  | 'TimelineView'
  | 'LogViewer'
  | 'ChartView'
  | 'ActionChecklist'
  | 'InsightSummary'
  | 'RecommendationStrip'
  | 'GeoMap'
  | 'StatusBanner';

// ─── Schema Structures ────────────────────────────────────────────

/** A single component specification within the composition */
export interface UIComponentSpec {
  id: string;
  type: ComponentType;
  props: Record<string, unknown>;
  priority: number; // 1 = highest importance
  visibility: VisibilityState;
  visibilityCondition?: string;
}

/** Explanation for why a component was NOT shown */
export interface HiddenComponentExplanation {
  type: ComponentType;
  reason: string;
}

/** The AI's structured reasoning metadata */
export interface AIReasoning {
  intent: IntentType;
  urgency: UrgencyLevel;
  uncertaintyAreas: string[];
  hiddenComponents: HiddenComponentExplanation[];
}

/**
 * THE CORE CONTRACT — UISchema
 *
 * This is the only thing the renderer consumes.
 * The AI produces this. Everything else follows from it.
 */
export interface UISchema {
  /** Layout strategy for arranging components */
  layout: LayoutType;
  /** Ordered list of components to render */
  components: UIComponentSpec[];
  /** AI confidence level in this composition (0–1) */
  confidence: number;
  /** Human-readable explanation of why this UI was chosen */
  explanation: string;
  /** Structured reasoning for the explainability panel */
  reasoning: AIReasoning;
}

// ─── Component-Specific Prop Interfaces ───────────────────────────

export interface MetricCardProps {
  title: string;
  value: string | number;
  change?: number;
  changeDirection?: 'up' | 'down' | 'stable';
  unit?: string;
  status?: 'normal' | 'warning' | 'critical';
}

export interface Alert {
  id: string;
  severity: Severity;
  message: string;
  timestamp: string;
  source: string;
}

export interface AlertPanelProps {
  alerts: Alert[];
  title?: string;
}

export interface TimelineEvent {
  id: string;
  timestamp: string;
  title: string;
  description: string;
  severity: Severity;
}

export interface TimelineViewProps {
  events: TimelineEvent[];
  title?: string;
}

export interface LogEntry {
  id: string;
  timestamp: string;
  level: 'debug' | 'info' | 'warn' | 'error';
  message: string;
  source: string;
}

export interface LogViewerProps {
  logs: LogEntry[];
  title?: string;
}

export interface ChartDataPoint {
  label: string;
  value: number;
}

export interface ChartViewProps {
  title: string;
  data: ChartDataPoint[];
  chartType: 'bar' | 'line' | 'area';
  color?: string;
}

export interface ChecklistItem {
  id: string;
  label: string;
  completed: boolean;
  priority: 'low' | 'medium' | 'high' | 'critical';
}

export interface ActionChecklistProps {
  title: string;
  items: ChecklistItem[];
}

export interface Insight {
  id: string;
  text: string;
  confidence: number;
  category: string;
}

export interface InsightSummaryProps {
  title: string;
  insights: Insight[];
}

export interface Recommendation {
  id: string;
  title: string;
  description: string;
  urgency: 'low' | 'medium' | 'high' | 'critical';
  action: string;
}

export interface RecommendationStripProps {
  recommendations: Recommendation[];
}

export interface GeoPoint {
  id: string;
  label: string;
  x: number; // 0–100, abstract position
  y: number; // 0–100, abstract position
  status: 'normal' | 'warning' | 'critical';
}

export interface GeoMapProps {
  title: string;
  points: GeoPoint[];
}

export interface StatusBannerProps {
  status: SystemStatus;
  title: string;
  message: string;
  timestamp: string;
}
