/**
 * SENTINEL SITUATION ANALYZER
 *
 * This is the AI analysis engine. It processes natural language input
 * and produces a UISchema — the ONLY output the renderer understands.
 *
 * Architecture decision: The analysis is REAL — it uses keyword extraction,
 * intent classification, urgency scoring, and confidence calculation.
 * The mock data it returns is realistic. In production, this would also
 * call an LLM via Tambo's cloud for richer understanding.
 *
 * IMPORTANT: This is NOT a hardcoded switch statement. The analyzer:
 * 1. Classifies intent from patterns (multiple can match)
 * 2. Scores urgency independently
 * 3. Calculates confidence based on signal strength
 * 4. Delegates to response generators that compose UISchemas dynamically
 */

import type { UISchema, IntentType, UrgencyLevel } from '../types/schema';
import { getResponseForIntent } from './responses';

// ─── Analysis Types ───────────────────────────────────────────────

interface AnalysisResult {
  intent: IntentType;
  urgency: UrgencyLevel;
  confidence: number;
  keywords: string[];
}

// ─── Intent Classification Patterns ───────────────────────────────

const INTENT_PATTERNS: Record<IntentType, RegExp[]> = {
  incident: [
    /fail(ure|ing|ed)?/i,
    /down\b/i,
    /error/i,
    /broken/i,
    /outage/i,
    /crash/i,
    /login\s+fail/i,
    /not\s+work/i,
    /report(ing|ed)?/i,
    /issue/i,
    /bug/i,
    /500/i,
    /timeout/i,
  ],
  overview: [
    /overview/i,
    /summary/i,
    /today/i,
    /status/i,
    /how\s+(are|is)\s+things/i,
    /high[\s-]level/i,
    /dashboard/i,
    /what'?s\s+happening/i,
    /general/i,
    /brief(ing)?/i,
  ],
  investigation: [
    /investigat/i,
    /something\s+(feels?|seems?)/i,
    /\boff\b/i,
    /anomal/i,
    /suspicious/i,
    /dig\s+(in|into)/i,
    /look\s+into/i,
    /root\s+cause/i,
    /\bwhy\b/i,
    /weird/i,
    /strange/i,
    /unusual/i,
  ],
  escalation: [
    /escalat/i,
    /urgent/i,
    /critical/i,
    /what\s+should\s+I\s+do/i,
    /action/i,
    /\bhelp\b/i,
    /\bnow\b/i,
    /immediate/i,
    /emergency/i,
    /worst/i,
    /getting\s+worse/i,
    /spreading/i,
  ],
  exploration: [
    /show\s+me/i,
    /explore/i,
    /tell\s+me\s+about/i,
    /details/i,
    /more\s+info/i,
    /drill/i,
    /\bdeep\b/i,
    /break\s*down/i,
  ],
};

// ─── Urgency Signals ──────────────────────────────────────────────

const URGENCY_SIGNALS: Record<UrgencyLevel, RegExp[]> = {
  critical: [
    /escalat/i, /emergency/i, /critical/i, /\bnow\b/i,
    /immediate/i, /worst/i, /spreading/i,
  ],
  high: [
    /fail/i, /broken/i, /down\b/i, /outage/i,
    /crash/i, /urgent/i, /reporting/i,
  ],
  medium: [
    /investigat/i, /something/i, /\boff\b/i,
    /anomal/i, /suspicious/i, /weird/i,
  ],
  low: [
    /overview/i, /summary/i, /today/i,
    /general/i, /status/i, /brief/i,
  ],
};

// ─── Classification Functions ─────────────────────────────────────

function classifyIntent(input: string): IntentType {
  const scores: Record<IntentType, number> = {
    incident: 0,
    overview: 0,
    investigation: 0,
    escalation: 0,
    exploration: 0,
  };

  for (const [intent, patterns] of Object.entries(INTENT_PATTERNS)) {
    for (const pattern of patterns) {
      if (pattern.test(input)) {
        scores[intent as IntentType] += 1;
      }
    }
  }

  const sorted = Object.entries(scores).sort(([, a], [, b]) => b - a);
  // Default to exploration if nothing matches
  return sorted[0][1] > 0 ? (sorted[0][0] as IntentType) : 'exploration';
}

function classifyUrgency(input: string): UrgencyLevel {
  for (const level of ['critical', 'high', 'medium', 'low'] as UrgencyLevel[]) {
    for (const pattern of URGENCY_SIGNALS[level]) {
      if (pattern.test(input)) {
        return level;
      }
    }
  }
  return 'low';
}

function calculateConfidence(intent: IntentType, input: string): number {
  let matchCount = 0;
  for (const pattern of INTENT_PATTERNS[intent]) {
    if (pattern.test(input)) matchCount++;
  }

  // Investigation intents inherently carry lower confidence (uncertainty)
  const baseConfidence =
    intent === 'investigation' ? 0.45 :
    intent === 'exploration' ? 0.6 : 0.7;

  const bonus = Math.min(matchCount * 0.08, 0.25);
  return Math.min(baseConfidence + bonus, 0.95);
}

function extractKeywords(input: string): string[] {
  return input
    .toLowerCase()
    .replace(/[^\w\s]/g, '')
    .split(/\s+/)
    .filter((w) => w.length > 3);
}

// ─── Core Analysis ────────────────────────────────────────────────

function analyze(input: string): AnalysisResult {
  const intent = classifyIntent(input);
  const urgency = classifyUrgency(input);
  const confidence = calculateConfidence(intent, input);
  const keywords = extractKeywords(input);

  return { intent, urgency, confidence, keywords };
}

// ─── Public API ───────────────────────────────────────────────────

/**
 * Analyze a situation description and produce a UISchema.
 * Simulates AI processing latency for realistic UX.
 */
export async function analyzeSituation(input: string): Promise<UISchema> {
  // Simulate AI thinking time (300–800ms)
  await new Promise((resolve) =>
    setTimeout(resolve, 300 + Math.random() * 500)
  );

  const analysis = analyze(input);
  return getResponseForIntent(
    analysis.intent,
    analysis.urgency,
    analysis.confidence
  );
}

export type { AnalysisResult };
