# SENTINEL — AI Situational Command Center

> A Generative UI application powered by Tambo's React SDK.  
> The AI decides which UI components to render, how they're laid out, and when the UI should change.

## Architecture

```
┌─────────────────────────────────────────────────────┐
│                   User Input                         │
│          "Users are reporting login failures"        │
└──────────────────────┬──────────────────────────────┘
                       │
                       ▼
┌─────────────────────────────────────────────────────┐
│               AI Analysis Engine                     │
│  ┌──────────┐  ┌──────────┐  ┌─────────────────┐  │
│  │  Intent   │  │ Urgency  │  │   Confidence    │  │
│  │Classifier │  │ Scorer   │  │  Calculator     │  │
│  └──────────┘  └──────────┘  └─────────────────┘  │
└──────────────────────┬──────────────────────────────┘
                       │
                       ▼
┌─────────────────────────────────────────────────────┐
│               UISchema (JSON Contract)               │
│  { layout, components[], confidence, explanation }   │
└──────────────────────┬──────────────────────────────┘
                       │
                       ▼
┌─────────────────────────────────────────────────────┐
│        SentinelComposition (Tambo Renderer)          │
│  ┌─────────┐  ┌──────────┐  ┌─────────────────┐   │
│  │  Filter  │→ │  Sort by │→ │  Select Layout  │   │
│  │ visible  │  │ priority │  │  grid/stack/etc │   │
│  └─────────┘  └──────────┘  └─────────────────┘   │
└──────────────────────┬──────────────────────────────┘
                       │
                       ▼
┌─────────────────────────────────────────────────────┐
│              Component Registry                      │
│  MetricCard · AlertPanel · TimelineView · LogViewer  │
│  ChartView · ActionChecklist · InsightSummary        │
│  RecommendationStrip · GeoMap · StatusBanner         │
└─────────────────────────────────────────────────────┘
```

## Quick Start

```bash
npm install
npm run dev
```

To enable Tambo cloud AI features, create a `.env` file:

```bash
cp .env.example .env
# Add your Tambo API key
```

Without an API key, the app runs in local analysis mode (fully functional demo).

## Folder Structure

```
src/
├── ai/                          # AI Analysis Engine
│   ├── analyzer.ts              # Intent/urgency/confidence classification
│   └── responses.ts             # UISchema generators for each scenario
├── components/
│   ├── sentinel/                # 10 Self-contained UI components
│   │   ├── MetricCard.tsx       # KPI metric with trend
│   │   ├── AlertPanel.tsx       # Severity-coded alerts
│   │   ├── TimelineView.tsx     # Vertical event timeline
│   │   ├── LogViewer.tsx        # Scrollable log pane
│   │   ├── ChartView.tsx        # SVG bar/line/area chart
│   │   ├── ActionChecklist.tsx  # Interactive response checklist
│   │   ├── InsightSummary.tsx   # AI insights with confidence
│   │   ├── RecommendationStrip.tsx # Actionable recommendations
│   │   ├── GeoMap.tsx           # Abstract geographic viz
│   │   └── StatusBanner.tsx     # System status indicator
│   ├── registry/                # Component Registry
│   │   └── index.ts             # Type → React component map
│   ├── composition/             # Generative Rendering Engine
│   │   ├── SentinelComposition.tsx # Main composition renderer
│   │   └── layouts/             # Layout strategies
│   │       ├── GridLayout.tsx   # Responsive grid
│   │       ├── StackLayout.tsx  # Vertical priority stack
│   │       ├── SplitLayout.tsx  # Two-column investigation
│   │       └── OverlayLayout.tsx # Base + floating overlays
│   └── shell/                   # App Shell
│       ├── SituationInput.tsx   # Command input bar
│       └── ExplainabilityPanel.tsx # "Why this UI?" feature
├── tambo/                       # Tambo SDK Integration
│   ├── components.ts            # Component registration with Zod schemas
│   └── tools.ts                 # Local tools for AI analysis
├── types/
│   └── schema.ts                # AI → UI schema contract (CORE)
├── App.tsx                      # Root app with TamboProvider
├── main.tsx                     # Entry point
└── index.css                    # Dark command center theme
```

## Core Concepts

### AI → UI Schema Contract

The AI outputs a `UISchema` — the ONLY thing the renderer consumes:

```typescript
interface UISchema {
  layout: 'grid' | 'stack' | 'split' | 'overlay';
  components: UIComponentSpec[];
  confidence: number;     // 0–1
  explanation: string;
  reasoning: {
    intent: IntentType;
    urgency: UrgencyLevel;
    uncertaintyAreas: string[];
    hiddenComponents: { type: string; reason: string }[];
  };
}
```

### Adaptive Behaviors

| Intent       | Urgency  | Layout | Key Components                                    |
|-------------|----------|--------|---------------------------------------------------|
| Incident    | High     | Grid   | StatusBanner, AlertPanel, MetricCards, Logs        |
| Overview    | Low      | Grid   | StatusBanner, MetricCards, Charts, Insights        |
| Investigation | Medium | Split  | InsightSummary (hypotheses), Logs, GeoMap         |
| Escalation  | Critical | Stack  | StatusBanner, AlertPanel, ActionChecklist          |

### Confidence-Aware UI

- **High confidence (≥0.8)** → Directive UI with clear actions
- **Medium confidence (0.5–0.8)** → Balanced information display
- **Low confidence (<0.5)** → Exploratory UI with hypotheses

### Explainability

Toggle "Why this UI?" to see:
- AI's reasoning for the composition
- Why each component was shown or hidden
- Uncertainty areas and confidence level

## Demo Prompts

1. **"Users are reporting login failures"** → Incident response dashboard
2. **"Give me a high-level overview of today"** → System health overview
3. **"Something feels off, help me investigate"** → Exploratory investigation view
4. **"This is escalating, what should I do now?"** → Critical escalation protocol

## Design Principles

1. **AI outputs UI intent, not prose** — No text-first responses
2. **No static dashboards** — Every view is generated
3. **No fixed routes** — Layout and components change dynamically
4. **Same prompt, different context → different UI** — Context-sensitive
5. **Progressive disclosure** — Start minimal, reveal complexity on demand
