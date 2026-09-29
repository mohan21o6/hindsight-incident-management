/**
 * Hindsight Engine — Application-level similarity matching
 * 
 * STATUS: DEMO FALLBACK — keyword/heuristic similarity scoring
 * (No external Hindsight API configured; scoring computed locally)
 * 
 * This engine simulates what a production Hindsight vector store would do:
 * - Extract key signals from a new incident
 * - Compare against stored incident memories
 * - Return ranked list of similar memories with confidence scores
 */

import { HindsightMemory, Incident } from '../types';

// ---- Signal extraction -------------------------------------------------------

type IncidentSignals = {
  service: string;
  errorKeywords: string[];
  severity: string;
};

function extractSignals(incident: Partial<Incident>): IncidentSignals {
  const rawText = [
    incident.title ?? '',
    incident.errorSummary ?? '',
    ...(incident.logs?.map((l) => l.message) ?? []),
  ]
    .join(' ')
    .toLowerCase();

  const errorKeywords: string[] = [];

  // DB / connection pool
  if (rawText.match(/pool|hikari|connection.*(exhaust|timeout|saturate|max)|db pool/))
    errorKeywords.push('db-pool');

  // HTTP 503
  if (rawText.match(/503|service unavailable/)) errorKeywords.push('http-503');

  // HTTP 504
  if (rawText.match(/504|gateway timeout/)) errorKeywords.push('http-504');

  // Redis
  if (rawText.match(/redis|cache (fail|miss|timeout)/)) errorKeywords.push('redis');

  // Auth / JWT
  if (rawText.match(/jwt|jwks|token.*timeout|auth.*timeout/)) errorKeywords.push('auth-jwt');

  // Latency
  if (rawText.match(/latency|p99|slow|timeout/)) errorKeywords.push('latency');

  // OOM / memory
  if (rawText.match(/oom|memory|heap|out of memory/)) errorKeywords.push('oom');

  // Kafka
  if (rawText.match(/kafka|consumer lag|partition/)) errorKeywords.push('kafka');

  // DNS
  if (rawText.match(/dns|eai_again|name resolution/)) errorKeywords.push('dns');

  // Circuit breaker
  if (rawText.match(/circuit.?breaker/)) errorKeywords.push('circuit-breaker');

  return {
    service: incident.service?.toLowerCase() ?? '',
    errorKeywords,
    severity: incident.severity ?? '',
  };
}

function extractMemorySignals(memory: HindsightMemory): IncidentSignals {
  const rawText = [
    memory.title,
    memory.rootCause,
    memory.resolution,
    ...(memory.learnedRules ?? []),
  ]
    .join(' ')
    .toLowerCase();

  const errorKeywords: string[] = [];

  if (rawText.match(/pool|hikari|connection.*(exhaust|timeout|saturate|max)|db pool/))
    errorKeywords.push('db-pool');
  if (rawText.match(/503|service unavailable/)) errorKeywords.push('http-503');
  if (rawText.match(/504|gateway timeout/)) errorKeywords.push('http-504');
  if (rawText.match(/redis|cache (fail|miss|timeout)/)) errorKeywords.push('redis');
  if (rawText.match(/jwt|jwks|token.*timeout|auth.*timeout/)) errorKeywords.push('auth-jwt');
  if (rawText.match(/latency|p99|slow|timeout/)) errorKeywords.push('latency');
  if (rawText.match(/oom|memory|heap|out of memory/)) errorKeywords.push('oom');
  if (rawText.match(/kafka|consumer lag|partition/)) errorKeywords.push('kafka');
  if (rawText.match(/dns|eai_again|name resolution/)) errorKeywords.push('dns');
  if (rawText.match(/circuit.?breaker/)) errorKeywords.push('circuit-breaker');

  return {
    service: memory.service?.toLowerCase() ?? '',
    errorKeywords,
    severity: memory.severity ?? '',
  };
}

// ---- Scoring ------------------------------------------------------------------

function computeSimilarity(incident: IncidentSignals, memory: IncidentSignals): number {
  let score = 0;

  // Same service → strong signal (40 pts)
  if (incident.service && memory.service && incident.service === memory.service) {
    score += 40;
  }

  // Keyword overlap
  const incidentSet = new Set(incident.errorKeywords);
  const memorySet = new Set(memory.errorKeywords);

  const intersection = [...incidentSet].filter((k) => memorySet.has(k));
  const union = new Set([...incidentSet, ...memorySet]);

  if (union.size > 0) {
    // Jaccard-like: up to 50 pts
    const jaccard = intersection.length / union.size;
    score += Math.round(jaccard * 50);
  }

  // Same severity → 10 pts
  if (incident.severity && memory.severity && incident.severity === memory.severity) {
    score += 10;
  }

  return Math.min(score, 99); // cap at 99 to leave 100 for perfect matches
}

// ---- Public API ---------------------------------------------------------------

export interface MemoryMatch {
  memory: HindsightMemory;
  score: number;
}

export const MIN_RELEVANT_SCORE = 45; // threshold below which memory is not shown

/**
 * Find the most relevant Hindsight memories for an incident.
 * Returns ranked list, best match first.
 * Filters out memories below MIN_RELEVANT_SCORE.
 */
export function findRelevantMemories(
  incident: Partial<Incident>,
  memories: HindsightMemory[],
  maxResults = 5
): MemoryMatch[] {
  const incidentSignals = extractSignals(incident);

  const scored: MemoryMatch[] = memories
    .map((mem) => ({
      memory: mem,
      score: computeSimilarity(incidentSignals, extractMemorySignals(mem)),
    }))
    .filter((m) => m.score >= MIN_RELEVANT_SCORE)
    .sort((a, b) => b.score - a.score)
    .slice(0, maxResults);

  return scored;
}

/**
 * Build a plain-English explanation of why these memories were retrieved.
 */
export function buildEvidenceSummary(
  incident: Partial<Incident>,
  matches: MemoryMatch[]
): string {
  if (matches.length === 0) {
    return 'No sufficiently similar historical incident found in Hindsight. Providing general investigation guidance.';
  }

  const top = matches[0];
  const signals = extractSignals(incident);

  const parts: string[] = [];

  if (signals.errorKeywords.includes('db-pool')) {
    parts.push('database connection pool exhaustion pattern detected');
  }
  if (signals.errorKeywords.includes('http-503')) {
    parts.push('HTTP 503 error signature matched');
  }
  if (signals.errorKeywords.includes('redis')) {
    parts.push('Redis connectivity failure pattern matched');
  }

  const evidenceStr =
    parts.length > 0
      ? `Signals matched: ${parts.join('; ')}.`
      : `Error pattern matched.`;

  return `${evidenceStr} Top match: ${top.memory.incidentId} at ${top.score}% similarity. ${
    matches.length > 1
      ? `${matches.length} historical incidents retrieved, ${matches.filter((m) => m.memory.outcome === 'Resolved').length} with verified successful resolutions.`
      : ''
  }`;
}
