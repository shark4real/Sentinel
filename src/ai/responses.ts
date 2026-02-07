/**
 * SENTINEL AI RESPONSE SCHEMAS
 *
 * Contains pre-composed UISchemas for each intent/urgency combination.
 * Each schema is a complete AI → UI contract with realistic mock data.
 *
 * These are NOT hardcoded routes — the analyzer dynamically selects
 * and adjusts these based on intent classification, urgency scoring,
 * and confidence calculation. The same prompt can produce different
 * results based on context.
 *
 * DEMO SCENARIOS:
 * 1. "Users are reporting login failures"     → INCIDENT (high urgency)
 * 2. "Give me a high-level overview of today"  → OVERVIEW (low urgency)
 * 3. "Something feels off, help me investigate" → INVESTIGATION (medium urgency)
 * 4. "This is escalating, what should I do now?" → ESCALATION (critical urgency)
 */

import type { UISchema, IntentType, UrgencyLevel } from '../types/schema';

// ─── Response Generators ──────────────────────────────────────────

function incidentResponse(confidence: number): UISchema {
  return {
    layout: 'grid',
    confidence,
    explanation:
      'Incident detected. Displaying critical alerts, affected metrics, timeline of events, ' +
      'system logs, and an action checklist. Grid layout maximizes information density for rapid triage.',
    reasoning: {
      intent: 'incident',
      urgency: 'high',
      uncertaintyAreas: [
        'Root cause not yet confirmed',
        'Full blast radius unknown',
      ],
      hiddenComponents: [
        { type: 'GeoMap', reason: 'No geographic correlation detected yet' },
        { type: 'InsightSummary', reason: 'Not enough data for hypotheses — incident is active' },
      ],
    },
    components: [
      {
        id: 'banner-1',
        type: 'StatusBanner',
        priority: 1,
        visibility: 'visible',
        props: {
          status: 'critical',
          title: 'ACTIVE INCIDENT — Authentication Service Degradation',
          message: 'Multiple users reporting login failures across web and mobile. Auth service error rate elevated since 14:23 UTC.',
          timestamp: '14:23 UTC',
        },
      },
      {
        id: 'alert-1',
        type: 'AlertPanel',
        priority: 2,
        visibility: 'visible',
        props: {
          title: 'Active Alerts',
          alerts: [
            {
              id: 'a1',
              severity: 'critical',
              message: 'Auth service: 47% request failure rate (threshold: 5%)',
              timestamp: '14:23 UTC',
              source: 'auth-service',
            },
            {
              id: 'a2',
              severity: 'critical',
              message: 'Session token generation failing — Redis connection pool exhausted',
              timestamp: '14:25 UTC',
              source: 'session-mgr',
            },
            {
              id: 'a3',
              severity: 'warning',
              message: 'Client retry storm detected — 3.2x normal request volume',
              timestamp: '14:27 UTC',
              source: 'api-gateway',
            },
            {
              id: 'a4',
              severity: 'info',
              message: 'Status page auto-updated: Auth service degraded',
              timestamp: '14:30 UTC',
              source: 'statuspage',
            },
          ],
        },
      },
      {
        id: 'metric-1',
        type: 'MetricCard',
        priority: 3,
        visibility: 'visible',
        props: {
          title: 'Login Failure Rate',
          value: '47%',
          change: 340,
          changeDirection: 'up',
          status: 'critical',
        },
      },
      {
        id: 'metric-2',
        type: 'MetricCard',
        priority: 3,
        visibility: 'visible',
        props: {
          title: 'Affected Users',
          value: '2,847',
          change: 89,
          changeDirection: 'up',
          status: 'critical',
        },
      },
      {
        id: 'metric-3',
        type: 'MetricCard',
        priority: 4,
        visibility: 'visible',
        props: {
          title: 'Avg Response Time',
          value: '12.3',
          unit: 's',
          change: 780,
          changeDirection: 'up',
          status: 'warning',
        },
      },
      {
        id: 'metric-4',
        type: 'MetricCard',
        priority: 4,
        visibility: 'visible',
        props: {
          title: 'Healthy Endpoints',
          value: '23/31',
          status: 'warning',
        },
      },
      {
        id: 'timeline-1',
        type: 'TimelineView',
        priority: 5,
        visibility: 'visible',
        props: {
          title: 'Incident Timeline',
          events: [
            { id: 'e1', timestamp: '14:18 UTC', title: 'Redis latency spike detected', description: 'Redis cluster node-3 latency exceeded 500ms threshold', severity: 'warning' },
            { id: 'e2', timestamp: '14:23 UTC', title: 'Auth service errors surge', description: 'Error rate jumped from 0.3% to 47% in 90 seconds', severity: 'critical' },
            { id: 'e3', timestamp: '14:25 UTC', title: 'Connection pool exhausted', description: 'Redis connection pool at 100% capacity — new connections rejected', severity: 'critical' },
            { id: 'e4', timestamp: '14:27 UTC', title: 'Retry storm begins', description: 'Client-side retries amplifying load by 3.2x', severity: 'warning' },
            { id: 'e5', timestamp: '14:30 UTC', title: 'Automated alert triggered', description: 'PagerDuty incident created, on-call team notified', severity: 'info' },
          ],
        },
      },
      {
        id: 'logs-1',
        type: 'LogViewer',
        priority: 6,
        visibility: 'visible',
        props: {
          title: 'Auth Service Logs',
          logs: [
            { id: 'l1', timestamp: '14:23:01', level: 'error', source: 'auth-svc', message: 'ETIMEDOUT: Redis connection timed out after 3000ms' },
            { id: 'l2', timestamp: '14:23:02', level: 'error', source: 'auth-svc', message: 'Failed to generate session token: pool exhausted (128/128)' },
            { id: 'l3', timestamp: '14:23:03', level: 'warn', source: 'api-gw', message: 'Upstream auth-svc returned 503 — circuit breaker OPEN' },
            { id: 'l4', timestamp: '14:23:05', level: 'error', source: 'auth-svc', message: 'Token validation failed: cannot reach Redis cluster' },
            { id: 'l5', timestamp: '14:23:08', level: 'info', source: 'monitor', message: 'Error rate threshold exceeded — triggering PagerDuty alert' },
            { id: 'l6', timestamp: '14:23:12', level: 'error', source: 'auth-svc', message: 'Connection retry 3/3 failed for redis-node-3:6379' },
          ],
        },
      },
      {
        id: 'actions-1',
        type: 'ActionChecklist',
        priority: 7,
        visibility: 'visible',
        props: {
          title: 'Incident Response Actions',
          items: [
            { id: 'c1', label: 'Acknowledge incident in PagerDuty', completed: true, priority: 'critical' },
            { id: 'c2', label: 'Open incident Slack channel #inc-auth-20260207', completed: true, priority: 'critical' },
            { id: 'c3', label: 'Check Redis cluster node health', completed: false, priority: 'critical' },
            { id: 'c4', label: 'Enable circuit breaker bypass for VIP users', completed: false, priority: 'high' },
            { id: 'c5', label: 'Scale up Redis connection pool limit', completed: false, priority: 'high' },
            { id: 'c6', label: 'Notify affected enterprise customers', completed: false, priority: 'medium' },
            { id: 'c7', label: 'Prepare status page update', completed: false, priority: 'medium' },
          ],
        },
      },
      {
        id: 'recs-1',
        type: 'RecommendationStrip',
        priority: 8,
        visibility: 'visible',
        props: {
          recommendations: [
            { id: 'r1', title: 'Restart Redis node-3', description: 'Primary suspect based on timeline correlation', urgency: 'critical', action: 'Execute Restart' },
            { id: 'r2', title: 'Enable rate limiting', description: 'Suppress retry storm at API gateway level', urgency: 'high', action: 'Apply Config' },
            { id: 'r3', title: 'Failover to backup cluster', description: 'Switch to redis-backup if restart fails', urgency: 'high', action: 'Initiate Failover' },
          ],
        },
      },
    ],
  };
}

function overviewResponse(confidence: number): UISchema {
  return {
    layout: 'grid',
    confidence,
    explanation:
      'Overview requested. Showing system health banner, key performance metrics, traffic trend, ' +
      'error distribution, and a summary of observations. Grid layout for at-a-glance comprehension.',
    reasoning: {
      intent: 'overview',
      urgency: 'low',
      uncertaintyAreas: [],
      hiddenComponents: [
        { type: 'AlertPanel', reason: 'No active alerts — system is healthy' },
        { type: 'LogViewer', reason: 'Not relevant for high-level overview' },
        { type: 'ActionChecklist', reason: 'No active incidents requiring action' },
        { type: 'GeoMap', reason: 'Geographic view not requested' },
      ],
    },
    components: [
      {
        id: 'banner-1',
        type: 'StatusBanner',
        priority: 1,
        visibility: 'visible',
        props: {
          status: 'healthy',
          title: 'System Overview — February 7, 2026',
          message: 'All services operational. No active incidents. Last deployment: 2 hours ago (v3.14.2).',
          timestamp: 'Updated 30s ago',
        },
      },
      {
        id: 'metric-1',
        type: 'MetricCard',
        priority: 2,
        visibility: 'visible',
        props: {
          title: 'Active Users',
          value: '12,847',
          change: 12,
          changeDirection: 'up',
          status: 'normal',
        },
      },
      {
        id: 'metric-2',
        type: 'MetricCard',
        priority: 2,
        visibility: 'visible',
        props: {
          title: 'Requests/sec',
          value: '3,421',
          change: 5,
          changeDirection: 'up',
          status: 'normal',
        },
      },
      {
        id: 'metric-3',
        type: 'MetricCard',
        priority: 2,
        visibility: 'visible',
        props: {
          title: 'Avg Latency',
          value: '45',
          unit: 'ms',
          change: 3,
          changeDirection: 'down',
          status: 'normal',
        },
      },
      {
        id: 'metric-4',
        type: 'MetricCard',
        priority: 2,
        visibility: 'visible',
        props: {
          title: 'Uptime',
          value: '99.97',
          unit: '%',
          status: 'normal',
        },
      },
      {
        id: 'chart-1',
        type: 'ChartView',
        priority: 3,
        visibility: 'visible',
        props: {
          title: 'Traffic (Last 12 Hours)',
          chartType: 'area',
          color: '#3b82f6',
          data: [
            { label: '6AM', value: 1200 },
            { label: '7AM', value: 1800 },
            { label: '8AM', value: 2900 },
            { label: '9AM', value: 3400 },
            { label: '10AM', value: 3200 },
            { label: '11AM', value: 3100 },
            { label: '12PM', value: 2800 },
            { label: '1PM', value: 3000 },
            { label: '2PM', value: 3421 },
            { label: '3PM', value: 3300 },
            { label: '4PM', value: 3100 },
            { label: '5PM', value: 2500 },
          ],
        },
      },
      {
        id: 'chart-2',
        type: 'ChartView',
        priority: 4,
        visibility: 'visible',
        props: {
          title: 'Error Rate by Service',
          chartType: 'bar',
          color: '#f59e0b',
          data: [
            { label: 'API', value: 0.3 },
            { label: 'Auth', value: 0.1 },
            { label: 'Payment', value: 0.2 },
            { label: 'Search', value: 0.5 },
            { label: 'CDN', value: 0.05 },
          ],
        },
      },
      {
        id: 'insights-1',
        type: 'InsightSummary',
        priority: 5,
        visibility: 'visible',
        props: {
          title: 'Today\'s Observations',
          insights: [
            { id: 'i1', text: 'Traffic is 12% above weekly average — possibly driven by marketing campaign launch', confidence: 0.85, category: 'Traffic' },
            { id: 'i2', text: 'Search service error rate (0.5%) is slightly elevated but within SLA bounds', confidence: 0.72, category: 'Health' },
            { id: 'i3', text: 'Deployment v3.14.2 has been stable for 2 hours with zero rollback signals', confidence: 0.93, category: 'Deployment' },
            { id: 'i4', text: 'User session duration increased 8% after last feature release', confidence: 0.68, category: 'Product' },
          ],
        },
      },
      {
        id: 'recs-1',
        type: 'RecommendationStrip',
        priority: 6,
        visibility: 'visible',
        props: {
          recommendations: [
            { id: 'r1', title: 'Monitor Search Service', description: 'Error rate is at upper bound of normal range', urgency: 'low', action: 'View Details' },
            { id: 'r2', title: 'Review Traffic Spike', description: 'Confirm correlation with marketing campaign', urgency: 'low', action: 'View Analytics' },
          ],
        },
      },
    ],
  };
}

function investigationResponse(confidence: number): UISchema {
  return {
    layout: 'split',
    confidence: Math.min(confidence, 0.54), // Investigation = inherently uncertain
    explanation:
      'Investigation mode activated. Low confidence — presenting hypotheses rather than conclusions. ' +
      'Split layout: left side shows anomaly analysis, right side shows evidence (logs, timeline, map). ' +
      'UI is intentionally exploratory to avoid premature conclusions.',
    reasoning: {
      intent: 'investigation',
      urgency: 'medium',
      uncertaintyAreas: [
        'Anomaly pattern not yet conclusive',
        'Correlation ≠ causation — multiple hypotheses active',
        'Geographic correlation needs more data points',
        'Temporal pattern may be coincidental',
      ],
      hiddenComponents: [
        { type: 'ActionChecklist', reason: 'No confirmed incident yet — premature for action items' },
        { type: 'RecommendationStrip', reason: 'Confidence too low for directive recommendations' },
        { type: 'AlertPanel', reason: 'No triggered alerts — anomalies are sub-threshold' },
      ],
    },
    components: [
      {
        id: 'banner-1',
        type: 'StatusBanner',
        priority: 1,
        visibility: 'visible',
        props: {
          status: 'investigating',
          title: 'Investigation Mode — Anomaly Analysis',
          message: 'Analyzing system behavior patterns. Multiple hypotheses under evaluation. No confirmed incident.',
          timestamp: 'Started just now',
        },
      },
      {
        id: 'insights-1',
        type: 'InsightSummary',
        priority: 2,
        visibility: 'visible',
        props: {
          title: 'Hypotheses Under Investigation',
          insights: [
            { id: 'h1', text: 'Memory leak in payment-service — RSS growing 2.1% per hour, correlates with p99 latency increase', confidence: 0.62, category: 'Memory' },
            { id: 'h2', text: 'Unusual API call pattern from IP block 203.0.113.x — 4x normal rate, possible scraping', confidence: 0.41, category: 'Security' },
            { id: 'h3', text: 'Database query planner regression after last migration — slow queries up 18%', confidence: 0.55, category: 'Database' },
            { id: 'h4', text: 'CDN cache hit ratio dropped from 94% to 87% — possible cache poisoning or config drift', confidence: 0.38, category: 'Infrastructure' },
          ],
        },
      },
      {
        id: 'chart-1',
        type: 'ChartView',
        priority: 3,
        visibility: 'visible',
        props: {
          title: 'Anomaly Score (Last 6 Hours)',
          chartType: 'line',
          color: '#8b5cf6',
          data: [
            { label: '12PM', value: 12 },
            { label: '1PM', value: 15 },
            { label: '2PM', value: 14 },
            { label: '3PM', value: 23 },
            { label: '4PM', value: 31 },
            { label: '5PM', value: 45 },
            { label: 'Now', value: 52 },
          ],
        },
      },
      {
        id: 'timeline-1',
        type: 'TimelineView',
        priority: 4,
        visibility: 'visible',
        props: {
          title: 'Suspicious Events',
          events: [
            { id: 'e1', timestamp: '12:45 UTC', title: 'Payment service memory spike', description: 'RSS jumped 150MB in 10 minutes, triggering GC pressure', severity: 'warning' },
            { id: 'e2', timestamp: '13:12 UTC', title: 'Unusual API traffic pattern', description: 'Burst of 2,400 req/s from single IP block, mostly /api/products', severity: 'warning' },
            { id: 'e3', timestamp: '14:01 UTC', title: 'DB slow query spike', description: '18% increase in queries exceeding 500ms threshold', severity: 'warning' },
            { id: 'e4', timestamp: '14:30 UTC', title: 'CDN cache miss increase', description: 'Cache hit ratio dropped 7 points — checking for config changes', severity: 'info' },
          ],
        },
      },
      {
        id: 'logs-1',
        type: 'LogViewer',
        priority: 5,
        visibility: 'visible',
        props: {
          title: 'Correlated Logs',
          logs: [
            { id: 'l1', timestamp: '14:30:12', level: 'warn', source: 'payment-svc', message: 'GC pause 340ms — heap at 89% capacity' },
            { id: 'l2', timestamp: '14:30:15', level: 'warn', source: 'api-gw', message: 'Rate limit approaching for 203.0.113.0/24 (2,100/2,500 rpm)' },
            { id: 'l3', timestamp: '14:30:18', level: 'info', source: 'db-monitor', message: 'Query plan changed for products_search — sequential scan detected' },
            { id: 'l4', timestamp: '14:30:22', level: 'warn', source: 'cdn', message: 'Cache MISS rate above threshold: 13.2% (threshold: 10%)' },
            { id: 'l5', timestamp: '14:30:30', level: 'info', source: 'anomaly-det', message: 'Anomaly score 52/100 — elevated but below alert threshold (70)' },
          ],
        },
      },
      {
        id: 'geo-1',
        type: 'GeoMap',
        priority: 6,
        visibility: 'visible',
        props: {
          title: 'Geographic Anomaly Distribution',
          points: [
            { id: 'g1', label: 'US-East', x: 28, y: 38, status: 'normal' },
            { id: 'g2', label: 'US-West', x: 15, y: 40, status: 'normal' },
            { id: 'g3', label: 'EU-West', x: 48, y: 30, status: 'warning' },
            { id: 'g4', label: 'AP-South', x: 72, y: 55, status: 'warning' },
            { id: 'g5', label: 'AP-East', x: 82, y: 40, status: 'critical' },
            { id: 'g6', label: 'SA-East', x: 33, y: 72, status: 'normal' },
          ],
        },
      },
    ],
  };
}

function escalationResponse(confidence: number): UISchema {
  return {
    layout: 'stack',
    confidence,
    explanation:
      'ESCALATION detected. Switching to directive stack layout that prioritizes actionable information. ' +
      'AlertPanel and ActionChecklist are top priority. Every component is ordered by urgency. ' +
      'Stack layout ensures nothing is missed during rapid response.',
    reasoning: {
      intent: 'escalation',
      urgency: 'critical',
      uncertaintyAreas: [
        'Full impact scope still being assessed',
        'Customer-facing impact duration unknown',
      ],
      hiddenComponents: [
        { type: 'GeoMap', reason: 'Geographic data not actionable during escalation' },
        { type: 'LogViewer', reason: 'Deprioritized — action items are more critical right now' },
        { type: 'ChartView', reason: 'Trend data less important than immediate actions' },
      ],
    },
    components: [
      {
        id: 'banner-1',
        type: 'StatusBanner',
        priority: 1,
        visibility: 'visible',
        props: {
          status: 'critical',
          title: 'ESCALATION — Multiple Systems Affected — Immediate Action Required',
          message: 'Situation is spreading beyond initial scope. Payment processing now impacted. Customer-facing degradation confirmed.',
          timestamp: '15:02 UTC — Escalated',
        },
      },
      {
        id: 'alert-1',
        type: 'AlertPanel',
        priority: 2,
        visibility: 'visible',
        props: {
          title: 'Critical Alerts — Cascading Failure',
          alerts: [
            { id: 'a1', severity: 'critical', message: 'Payment gateway: Transaction success rate dropped to 62%', timestamp: '15:00 UTC', source: 'payment-gw' },
            { id: 'a2', severity: 'critical', message: 'Auth service still degraded — retry storm intensifying', timestamp: '14:58 UTC', source: 'auth-svc' },
            { id: 'a3', severity: 'critical', message: 'Customer support queue: 340 tickets in last 15 minutes (10x normal)', timestamp: '15:01 UTC', source: 'support' },
            { id: 'a4', severity: 'warning', message: 'CDN edge nodes in EU-West reporting 504 timeouts', timestamp: '14:59 UTC', source: 'cdn' },
            { id: 'a5', severity: 'warning', message: 'Database connection pool at 91% capacity', timestamp: '15:02 UTC', source: 'db-primary' },
          ],
        },
      },
      {
        id: 'actions-1',
        type: 'ActionChecklist',
        priority: 3,
        visibility: 'visible',
        props: {
          title: 'IMMEDIATE ACTIONS — Escalation Protocol',
          items: [
            { id: 'c1', label: 'Page VP of Engineering — P1 escalation', completed: false, priority: 'critical' },
            { id: 'c2', label: 'Activate war room — Zoom bridge #incident-war-room', completed: false, priority: 'critical' },
            { id: 'c3', label: 'Enable emergency rate limiting across all services', completed: false, priority: 'critical' },
            { id: 'c4', label: 'Switch payment processing to fallback provider', completed: false, priority: 'critical' },
            { id: 'c5', label: 'Draft customer communication (use template: P1-cascade)', completed: false, priority: 'high' },
            { id: 'c6', label: 'Disable non-essential background jobs', completed: false, priority: 'high' },
            { id: 'c7', label: 'Scale up all services to max capacity', completed: false, priority: 'high' },
            { id: 'c8', label: 'Engage database team for connection pool tuning', completed: false, priority: 'medium' },
          ],
        },
      },
      {
        id: 'metric-1',
        type: 'MetricCard',
        priority: 4,
        visibility: 'visible',
        props: {
          title: 'Revenue Impact',
          value: '$142K',
          change: 38,
          changeDirection: 'up',
          unit: '/hr',
          status: 'critical',
        },
      },
      {
        id: 'metric-2',
        type: 'MetricCard',
        priority: 4,
        visibility: 'visible',
        props: {
          title: 'Affected Services',
          value: '4/12',
          status: 'critical',
        },
      },
      {
        id: 'metric-3',
        type: 'MetricCard',
        priority: 4,
        visibility: 'visible',
        props: {
          title: 'Customer Tickets',
          value: '340',
          change: 900,
          changeDirection: 'up',
          status: 'critical',
        },
      },
      {
        id: 'metric-4',
        type: 'MetricCard',
        priority: 4,
        visibility: 'visible',
        props: {
          title: 'MTTR Estimate',
          value: '45',
          unit: 'min',
          status: 'warning',
        },
      },
      {
        id: 'recs-1',
        type: 'RecommendationStrip',
        priority: 5,
        visibility: 'visible',
        props: {
          recommendations: [
            { id: 'r1', title: 'Activate Fallback Payment', description: 'Switch to Stripe fallback to restore payment processing immediately', urgency: 'critical', action: 'Execute Failover' },
            { id: 'r2', title: 'Global Rate Limit', description: 'Apply 50% rate limit to stop cascade. Will affect all users but stabilize systems', urgency: 'critical', action: 'Apply Limit' },
            { id: 'r3', title: 'Rollback v3.14.2', description: 'Deployment correlates with timeline — rollback to v3.14.1 as precaution', urgency: 'high', action: 'Start Rollback' },
            { id: 'r4', title: 'Customer Comms', description: 'Send proactive email to enterprise customers within 10 minutes', urgency: 'high', action: 'Draft Message' },
          ],
        },
      },
      {
        id: 'timeline-1',
        type: 'TimelineView',
        priority: 6,
        visibility: 'visible',
        props: {
          title: 'Escalation Timeline',
          events: [
            { id: 'e1', timestamp: '14:23 UTC', title: 'Initial incident: Auth service errors', description: 'Login failure rate spiked to 47%', severity: 'critical' },
            { id: 'e2', timestamp: '14:45 UTC', title: 'Retry storm detected', description: 'API gateway under 3.2x load from client retries', severity: 'warning' },
            { id: 'e3', timestamp: '14:55 UTC', title: 'Cascade begins', description: 'Payment service starts experiencing upstream timeouts', severity: 'critical' },
            { id: 'e4', timestamp: '15:00 UTC', title: 'Payment degradation confirmed', description: 'Transaction success rate dropped to 62%', severity: 'critical' },
            { id: 'e5', timestamp: '15:02 UTC', title: 'P1 Escalation triggered', description: 'Multiple systems affected — escalation protocol activated', severity: 'critical' },
          ],
        },
      },
    ],
  };
}

function explorationResponse(confidence: number): UISchema {
  return {
    layout: 'grid',
    confidence: Math.min(confidence, 0.65),
    explanation:
      'Exploration mode. Broad overview with charts, metrics, and insights to help guide further inquiry. ' +
      'Grid layout provides multiple entry points for deeper investigation.',
    reasoning: {
      intent: 'exploration',
      urgency: 'low',
      uncertaintyAreas: [
        'User intent is general — showing broad surface area',
        'May need follow-up questions to narrow focus',
      ],
      hiddenComponents: [
        { type: 'ActionChecklist', reason: 'No specific actions identified yet' },
        { type: 'AlertPanel', reason: 'No triggered alerts to display' },
      ],
    },
    components: [
      {
        id: 'banner-1',
        type: 'StatusBanner',
        priority: 1,
        visibility: 'visible',
        props: {
          status: 'healthy',
          title: 'Exploration Mode',
          message: 'Showing broad system overview. Describe your concern more specifically for a focused analysis.',
          timestamp: 'Now',
        },
      },
      {
        id: 'metric-1',
        type: 'MetricCard',
        priority: 2,
        visibility: 'visible',
        props: { title: 'Total Requests', value: '1.2M', change: 8, changeDirection: 'up', status: 'normal' },
      },
      {
        id: 'metric-2',
        type: 'MetricCard',
        priority: 2,
        visibility: 'visible',
        props: { title: 'Error Rate', value: '0.32', unit: '%', status: 'normal' },
      },
      {
        id: 'metric-3',
        type: 'MetricCard',
        priority: 2,
        visibility: 'visible',
        props: { title: 'P99 Latency', value: '230', unit: 'ms', change: 5, changeDirection: 'up', status: 'normal' },
      },
      {
        id: 'metric-4',
        type: 'MetricCard',
        priority: 2,
        visibility: 'visible',
        props: { title: 'Active Services', value: '31/31', status: 'normal' },
      },
      {
        id: 'chart-1',
        type: 'ChartView',
        priority: 3,
        visibility: 'visible',
        props: {
          title: 'Request Volume by Service',
          chartType: 'bar',
          color: '#3b82f6',
          data: [
            { label: 'API', value: 420 },
            { label: 'Auth', value: 280 },
            { label: 'Payment', value: 190 },
            { label: 'Search', value: 310 },
            { label: 'CDN', value: 580 },
          ],
        },
      },
      {
        id: 'insights-1',
        type: 'InsightSummary',
        priority: 4,
        visibility: 'visible',
        props: {
          title: 'System Observations',
          insights: [
            { id: 'i1', text: 'All services within normal operating parameters', confidence: 0.91, category: 'Health' },
            { id: 'i2', text: 'CDN serving highest volume — expected for current time of day', confidence: 0.88, category: 'Traffic' },
            { id: 'i3', text: 'No anomalies detected in the last 4 hours', confidence: 0.85, category: 'Anomaly' },
          ],
        },
      },
      {
        id: 'geo-1',
        type: 'GeoMap',
        priority: 5,
        visibility: 'visible',
        props: {
          title: 'Regional Status',
          points: [
            { id: 'g1', label: 'US-East', x: 28, y: 38, status: 'normal' },
            { id: 'g2', label: 'US-West', x: 15, y: 40, status: 'normal' },
            { id: 'g3', label: 'EU-West', x: 48, y: 30, status: 'normal' },
            { id: 'g4', label: 'AP-South', x: 72, y: 55, status: 'normal' },
            { id: 'g5', label: 'AP-East', x: 82, y: 40, status: 'normal' },
          ],
        },
      },
    ],
  };
}

// ─── Public API ───────────────────────────────────────────────────

/**
 * Generate a UISchema for the given intent, urgency, and confidence.
 * This is called by the analyzer after classification.
 */
export function getResponseForIntent(
  intent: IntentType,
  _urgency: UrgencyLevel,
  confidence: number
): UISchema {
  switch (intent) {
    case 'incident':
      return incidentResponse(confidence);
    case 'overview':
      return overviewResponse(confidence);
    case 'investigation':
      return investigationResponse(confidence);
    case 'escalation':
      return escalationResponse(confidence);
    case 'exploration':
    default:
      return explorationResponse(confidence);
  }
}
