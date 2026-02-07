/**
 * TAMBO LOCAL TOOLS
 *
 * Local tools run in the browser and can be called by Tambo's AI.
 * For Sentinel, the primary tool is `analyzeSituation` which processes
 * natural language input and returns a UISchema.
 *
 * When Tambo's cloud AI is available, it can call this tool to get
 * structured analysis results, then use them to render SentinelComposition.
 */

import { z } from 'zod';
import type { TamboTool } from '@tambo-ai/react';
import { analyzeSituation } from '../ai/analyzer';

export const sentinelTools: TamboTool[] = [
  {
    name: 'analyzeSituation',
    description:
      'Analyzes a natural language situation description and returns a structured UI composition schema. ' +
      'Call this tool when the user describes an incident, asks for an overview, wants to investigate, ' +
      'or needs escalation guidance. The output is a complete UISchema that SentinelComposition can render.',
    tool: async (params: { situation: string }) => {
      const schema = await analyzeSituation(params.situation);
      return schema;
    },
    inputSchema: z.object({
      situation: z.string().describe('The user situation description to analyze'),
    }),
    outputSchema: z.object({
      layout: z.string(),
      components: z.array(z.unknown()),
      confidence: z.number(),
      explanation: z.string(),
      reasoning: z.unknown(),
    }),
  },
];
