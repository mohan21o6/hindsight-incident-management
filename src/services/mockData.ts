import { Incident, HindsightMemory, Runbook } from '../types';

export const initialMemories: HindsightMemory[] = [
  {
    id: 'mem-0912',
    memoryKey: 'payments-api:pool-exhaustion:v1',
    title: 'Database connection pool exhaustion',
    incidentId: 'INC-0912',
    service: 'payments-api',
    severity: 'SEV-1',
    rootCause: 'Database connection pool exhaustion under sudden peak checkout traffic spike',
    resolution: 'Increased HikariCP pool from 50 → 100 and restarted payment service pods with zero downtime rolling update.',
    outcome: 'Resolved',
    createdAt: '2026-09-16T10:14:00Z',
    relativeTime: '14 days ago',
    similarityScore: 94,
    category: 'Incident',
    author: 'Mohan S.',
    learnedRules: [
      'DB pool saturation triggers HTTP 503 within 45s of p99 latency > 2500ms',
      'Pool limit increase to 100 immediately restores throughput without PostgreSQL lock contention',
      'Service restart drains dead pool handles within 12s'
    ],
    affectedMetrics: [
      { metric: '503 Error Rate', before: '19.2%', after: '0.01%' },
      { metric: 'DB Active Connections', before: '50/50 (100%)', after: '68/100 (68%)' },
      { metric: 'p99 Latency', before: '4,120ms', after: '142ms' }
    ],
    runbookId: 'rb-db-pool'
  },
  {
    id: 'mem-0841',
    memoryKey: 'payments-api:timeout-saturation:v2',
    title: 'Payment API timeout saturation',
    incidentId: 'INC-0841',
    service: 'payments-api',
    severity: 'SEV-2',
    rootCause: 'Database connection saturation during batch settlement cycle',
    resolution: 'Connection pool optimization, adjusted max idle timeout from 30s to 10s.',
    outcome: 'Resolved',
    createdAt: '2026-08-30T14:22:00Z',
    relativeTime: '31 days ago',
    similarityScore: 81,
    category: 'Incident',
    author: 'Rahul K.',
    learnedRules: [
      'Idle connection leaks cause gradual saturation over 4-hour window',
      'Timeout decrease clears stale sessions automatically'
    ],
    affectedMetrics: [
      { metric: 'Timeout Rate', before: '8.4%', after: '0.00%' },
      { metric: 'DB Connection Wait', before: '850ms', after: '12ms' }
    ],
    runbookId: 'rb-http-503'
  },
  {
    id: 'mem-0720',
    memoryKey: 'payments-api:gateway-timeout:v1',
    title: 'Payment upstream gateway timeout',
    incidentId: 'INC-0720',
    service: 'payments-api',
    severity: 'SEV-2',
    rootCause: 'PostgreSQL connection queue backlog caused HTTP 504 on ingress',
    resolution: 'Scaled horizontal pods + cleared hung transactions in Aurora replica.',
    outcome: 'Resolved',
    createdAt: '2026-07-28T09:05:00Z',
    relativeTime: '2 months ago',
    similarityScore: 72,
    category: 'Resolution',
    author: 'Priya D.',
    learnedRules: [
      'Aurora read replica lagging behind master by >15s cascades connection queue'
    ]
  },
  {
    id: 'mem-0874',
    memoryKey: 'checkout-api:redis-failure:v1',
    title: 'Redis connection pool exhaustion',
    incidentId: 'INC-0874',
    service: 'checkout-service',
    severity: 'SEV-2',
    rootCause: 'Redis cluster failover caused connection churn and node saturation',
    resolution: 'Failover rebalance triggered + max client connections increased to 5,000.',
    outcome: 'Resolved',
    createdAt: '2026-09-08T18:30:00Z',
    relativeTime: '22 days ago',
    similarityScore: 88,
    category: 'Incident',
    author: 'Vikram T.',
    learnedRules: [
      'Redis cluster failover requires circuit breaker reset within checkout worker pools'
    ],
    runbookId: 'rb-redis-recovery'
  },
  {
    id: 'mem-0651',
    memoryKey: 'auth-service:jwt-timeout:v1',
    title: 'Auth token validation timeout cascade',
    incidentId: 'INC-0651',
    service: 'auth-service',
    severity: 'SEV-3',
    rootCause: 'JWKS endpoint rate limiting under mobile client retry storm',
    resolution: 'Local JWKS in-memory cache TTL extended from 60s to 3600s.',
    outcome: 'Resolved',
    createdAt: '2026-06-12T11:45:00Z',
    relativeTime: '3 months ago',
    similarityScore: 84,
    category: 'Resolution',
    author: 'Priya D.',
    learnedRules: [
      'JWKS cache misses during spike cause 10x egress amplification to identity provider'
    ],
    runbookId: 'rb-jwt-ttl'
  },
  {
    id: 'mem-0955',
    memoryKey: 'order-service:deadlock:v1',
    title: 'Order state transition deadlock',
    incidentId: 'INC-0955',
    service: 'order-service',
    severity: 'SEV-2',
    rootCause: 'Concurrent inventory lock acquisition in inverted order across distributed workers',
    resolution: 'Enforced canonical alphabetical locking order across catalog SKU keys.',
    outcome: 'Resolved',
    createdAt: '2026-09-20T14:12:00Z',
    relativeTime: '10 days ago',
    similarityScore: 68,
    category: 'Incident',
    author: 'Mohan S.',
    learnedRules: [
      'Cross-item order processing requires deterministic key ordering to avoid Postgres deadlock 40P01'
    ]
  },
  {
    id: 'mem-0932',
    memoryKey: 'notification-service:sqs-backlog:v1',
    title: 'SQS consumer throttling backlog',
    incidentId: 'INC-0932',
    service: 'notification-service',
    severity: 'SEV-3',
    rootCause: 'FCM push notification quota exceeded during promotional blast',
    resolution: 'Enabled backpressure token bucket and switched transactional alerts to priority queue.',
    outcome: 'Resolved',
    createdAt: '2026-09-18T08:20:00Z',
    relativeTime: '12 days ago',
    similarityScore: 65,
    category: 'Incident',
    author: 'Rahul K.',
    learnedRules: [
      'Separate critical transactional alerts from promotional broadcasts at queue layer'
    ]
  },
  {
    id: 'mem-0810',
    memoryKey: 'api-gateway:envoy-oom:v1',
    title: 'Envoy proxy memory spike',
    incidentId: 'INC-0810',
    service: 'api-gateway',
    severity: 'SEV-2',
    rootCause: 'Access logging buffer unbounded growth during DDoS scan',
    resolution: 'Configured async log flushing with 50MB ring buffer cap.',
    outcome: 'Resolved',
    createdAt: '2026-08-15T16:40:00Z',
    relativeTime: '1.5 months ago',
    similarityScore: 62,
    category: 'Incident',
    author: 'Vikram T.',
    learnedRules: [
      'Unbounded access log buffers cause OOMKilled events under sustained 10k RPS ingress'
    ],
    runbookId: 'rb-api-gateway'
  },
  {
    id: 'mem-0789',
    memoryKey: 'checkout-service:cart-deserialization:v1',
    title: 'JSON payload deserialization stall',
    incidentId: 'INC-0789',
    service: 'checkout-service',
    severity: 'SEV-2',
    rootCause: 'Deeply nested discount coupon tree caused quadratic CPU parse time',
    resolution: 'Added schema depth validator cap (max 4 levels) at ingress filter.',
    outcome: 'Resolved',
    createdAt: '2026-08-04T12:15:00Z',
    relativeTime: '2 months ago',
    similarityScore: 58,
    category: 'Incident',
    author: 'Rahul K.',
    learnedRules: [
      'Sanitize polymorphic payload hierarchies prior to Jackson deserialization'
    ]
  },
  {
    id: 'mem-0711',
    memoryKey: 'payments-api:stripe-webhook-timeout:v1',
    title: 'Stripe webhook signature validation backlog',
    incidentId: 'INC-0711',
    service: 'payments-api',
    severity: 'SEV-3',
    rootCause: 'Synchronous signature verification blocking event dispatcher thread',
    resolution: 'Offloaded cryptographic signature validation to worker thread pool.',
    outcome: 'Resolved',
    createdAt: '2026-07-22T19:00:00Z',
    relativeTime: '2.5 months ago',
    similarityScore: 74,
    category: 'Resolution',
    author: 'Mohan S.',
    learnedRules: [
      'Webhook receivers must acknowledge with HTTP 200 within 500ms before processing'
    ]
  },
  {
    id: 'mem-0688',
    memoryKey: 'auth-service:redis-session-leak:v1',
    title: 'Session store memory fragmentation',
    incidentId: 'INC-0688',
    service: 'auth-service',
    severity: 'SEV-3',
    rootCause: 'Missing TTL on anonymous guest session keys',
    resolution: 'Enforced 24h expiration on all anonymous token keys in Redis.',
    outcome: 'Resolved',
    createdAt: '2026-07-10T14:30:00Z',
    relativeTime: '3 months ago',
    similarityScore: 61,
    category: 'Incident',
    author: 'Priya D.',
    learnedRules: [
      'Every unauthenticated session record must specify an explicit volatile TTL'
    ]
  },
  {
    id: 'mem-0610',
    memoryKey: 'order-service:kafka-partition-lag:v1',
    title: 'Kafka order consumer partition rebalance storm',
    incidentId: 'INC-0610',
    service: 'order-service',
    severity: 'SEV-2',
    rootCause: 'Heartbeat timeout exceeded during slow database transaction',
    resolution: 'Increased max.poll.interval.ms from 300s to 600s and reduced batch size.',
    outcome: 'Resolved',
    createdAt: '2026-06-05T09:18:00Z',
    relativeTime: '4 months ago',
    similarityScore: 54,
    category: 'Incident',
    author: 'Vikram T.',
    learnedRules: [
      'Long-running DB operations inside Kafka consumers trigger unwanted consumer rebalances'
    ]
  },
  {
    id: 'mem-0580',
    memoryKey: 'notification-service:smtp-connection-leak:v1',
    title: 'SMTP socket exhaustion on welcome emails',
    incidentId: 'INC-0580',
    service: 'notification-service',
    severity: 'SEV-4',
    rootCause: 'Missing try-with-resources socket closure in legacy mail transport',
    resolution: 'Wrapped transport client in managed connection pool.',
    outcome: 'Resolved',
    createdAt: '2026-05-18T11:00:00Z',
    relativeTime: '4.5 months ago',
    similarityScore: 49,
    category: 'Resolution',
    author: 'Rahul K.',
    learnedRules: [
      'Always release raw TCP socket handles in finally blocks'
    ]
  },
  {
    id: 'mem-0520',
    memoryKey: 'payments-api:circuit-breaker-flap:v1',
    title: 'Payment gateway circuit breaker flapping',
    incidentId: 'INC-0520',
    service: 'payments-api',
    severity: 'SEV-2',
    rootCause: 'Low request volume in night window caused 1 failure to trigger 50% threshold',
    resolution: 'Configured minimum throughput ring buffer of 50 requests before evaluating failure rate.',
    outcome: 'Resolved',
    createdAt: '2026-04-30T03:14:00Z',
    relativeTime: '5 months ago',
    similarityScore: 66,
    category: 'Incident',
    author: 'Mohan S.',
    learnedRules: [
      'Circuit breakers need minimum sample size threshold to avoid false positive trips in low-traffic windows'
    ]
  },
  {
    id: 'mem-0480',
    memoryKey: 'checkout-service:dns-lookup-timeout:v1',
    title: 'CoreDNS timeout cascade under pod autoscaling',
    incidentId: 'INC-0480',
    service: 'checkout-service',
    severity: 'SEV-1',
    rootCause: 'NodeLocal DNS cache not deployed, overloading central CoreDNS pods',
    resolution: 'Deployed NodeLocal DNS DaemonSet across all Kubernetes worker nodes.',
    outcome: 'Resolved',
    createdAt: '2026-04-12T17:40:00Z',
    relativeTime: '5.5 months ago',
    similarityScore: 59,
    category: 'Resolution',
    author: 'Mohan S.',
    learnedRules: [
      'Kubernetes clusters > 50 nodes require NodeLocal DNSCache to avoid UDP query drops'
    ]
  }
];

export const initialRunbooks: Runbook[] = [
  {
    id: 'rb-db-pool',
    title: 'Database Connection Pool Recovery',
    description: 'Diagnoses DB pool saturation, scales max pool capacity from 50 to 100, and performs zero-downtime rolling restart.',
    service: 'payments-api',
    usageCount: 23,
    successRate: 91,
    lastUsed: '14 days ago',
    relatedIncidents: ['INC-1042', 'INC-0912', 'INC-0841'],
    steps: [
      {
        stepNumber: 1,
        title: 'Check Active PostgreSQL Connection Pool State',
        command: 'kubectl exec -it deployment/payments-api -- pool-stat --verbose',
        description: 'Verify current connection count against configured maximum limit.',
        type: 'automated'
      },
      {
        stepNumber: 2,
        title: 'Apply Helm Config: Update POOL_MAX_SIZE=100',
        command: 'helm upgrade payments-api ./charts/payments-api --set config.dbPoolMax=100 --reuse-values',
        description: 'Dynamically expand HikariCP connection pool limit to 100 connections.',
        type: 'automated'
      },
      {
        stepNumber: 3,
        title: 'Perform Graceful Rolling Restart',
        command: 'kubectl rollout restart deployment/payments-api -n production',
        description: 'Drain dead handles and spin up refreshed worker pods with zero request drop.',
        type: 'automated'
      },
      {
        stepNumber: 4,
        title: 'Verify 503 Error Rate Drop Below 0.05%',
        command: 'datadog-cli query "sum:trace.http.request.errors{service:payments-api}.as_count()" --last 2m',
        description: 'Validate error rate mitigation and p99 latency returning to < 180ms baseline.',
        type: 'verification'
      }
    ]
  },
  {
    id: 'rb-http-503',
    title: 'HTTP 503 Service Unavailable Investigation',
    description: 'Standard diagnostic procedure for backend service unreachability, pool exhaustion, and upstream proxy errors.',
    service: 'payments-api',
    usageCount: 47,
    successRate: 88,
    lastUsed: '3 days ago',
    relatedIncidents: ['INC-1042', 'INC-0912', 'INC-0720'],
    steps: [
      {
        stepNumber: 1,
        title: 'Inspect Ingress / ALB 5xx Target Response Counts',
        command: 'aws elbv2 describe-target-health --target-group-arn arn:aws:tg-payments',
        description: 'Check unhealthy host count and deregistration events.',
        type: 'automated'
      },
      {
        stepNumber: 2,
        title: 'Query Hindsight Memory for Correlated Error Signatures',
        command: 'opsmind-cli memory query --service payments-api --error "503 Service Unavailable"',
        description: 'Match historical signatures and retrieve previously verified resolution paths.',
        type: 'automated'
      },
      {
        stepNumber: 3,
        title: 'Drain & Recycle Saturated Pod Instances',
        command: 'kubectl rollout restart deployment/payments-api',
        description: 'Clear stuck thread pools and reconnect fresh sockets.',
        type: 'automated'
      }
    ]
  },
  {
    id: 'rb-redis-recovery',
    title: 'Redis Connection Recovery & Circuit Breaker Reset',
    description: 'Mitigates Redis cluster node failovers, rebalances connection slots, and resets upstream service circuit breakers.',
    service: 'checkout-service',
    usageCount: 16,
    successRate: 94,
    lastUsed: '22 days ago',
    relatedIncidents: ['INC-1043', 'INC-0874'],
    steps: [
      {
        stepNumber: 1,
        title: 'Check Redis Cluster Node Health',
        command: 'redis-cli -h redis-prod.internal -p 6379 cluster nodes',
        description: 'Inspect cluster topology, master/replica synchronization, and connection slots.',
        type: 'automated'
      },
      {
        stepNumber: 2,
        title: 'Reset Client Connection Pool Thresholds',
        command: 'curl -X POST http://checkout-service.internal/ops/reconnect-redis',
        description: 'Flush disconnected socket handles and reset exponential backoff.',
        type: 'automated'
      },
      {
        stepNumber: 3,
        title: 'Verify Cache Hit Ratio > 95%',
        command: 'redis-cli info stats | grep keyspace_hits',
        description: 'Confirm caching operational normalcy.',
        type: 'verification'
      }
    ]
  },
  {
    id: 'rb-jwt-ttl',
    title: 'JWT Cache TTL Extension & Rate Limit Shedding',
    description: 'Extends in-memory JWKS public key cache TTL to protect authentication cluster from client storm.',
    service: 'auth-service',
    usageCount: 19,
    successRate: 96,
    lastUsed: '1 month ago',
    relatedIncidents: ['INC-1039', 'INC-0651'],
    steps: [
      {
        stepNumber: 1,
        title: 'Inspect JWKS Fetch Egress Rates',
        command: 'datadog-cli query "sum:jwks.fetch.count{env:prod}" --last 5m',
        description: 'Verify if downstream IAM provider is rate-limiting validation requests.',
        type: 'automated'
      },
      {
        stepNumber: 2,
        title: 'Apply Dynamic Config: JWKS_CACHE_TTL_SEC=3600',
        command: 'curl -X PUT http://auth-service.internal/admin/config -d "cache_ttl=3600"',
        description: 'Extend token caching buffer from 60s to 1 hour.',
        type: 'automated'
      }
    ]
  },
  {
    id: 'rb-api-gateway',
    title: 'API Gateway Timeout & Ingress Throttling',
    description: 'Diagnoses Envoy proxy timeout cascades, increases gateway timeout buffers, and enforces rate limit shedding.',
    service: 'api-gateway',
    usageCount: 12,
    successRate: 83,
    lastUsed: '1.5 months ago',
    relatedIncidents: ['INC-0810'],
    steps: [
      {
        stepNumber: 1,
        title: 'Inspect Envoy Ingress Upstream Response Times',
        command: 'curl -s http://localhost:15000/stats | grep "cluster.upstream_rq_timeout"',
        description: 'Identify slow upstream microservices.',
        type: 'automated'
      },
      {
        stepNumber: 2,
        title: 'Apply Circuit Breaker Rate Shedding Rule',
        command: 'kubectl apply -f ./k8s/gateway-shedding-policy.yaml',
        description: 'Drop non-critical background traffic during peak recovery window.',
        type: 'automated'
      }
    ]
  }
];

export const initialIncidents: Incident[] = [
  {
    id: 'INC-1042',
    title: 'Payment API returning HTTP 503',
    service: 'payments-api',
    severity: 'SEV-1',
    status: 'Investigating',
    startedAt: '2026-09-30T12:04:00Z',
    relativeTime: '8 min ago',
    assignee: {
      name: 'Mohan S.',
      role: 'Staff SRE',
    },
    environment: 'Production',
    errorSummary: 'HTTP 503 Service Unavailable',
    affectedPercentage: '18.4%',
    latencyP99: '3,420ms (Normal: 140ms)',
    logs: [
      {
        id: 'log-1',
        timestamp: '2026-09-30 12:04:18',
        level: 'INFO',
        service: 'payment-service',
        message: 'Handling checkout request batch: tx_count=420 req/s'
      },
      {
        id: 'log-2',
        timestamp: '2026-09-30 12:04:21',
        level: 'ERROR',
        service: 'payment-service',
        message: 'Database connection timeout after 3000ms [HikariPool-1 - Connection is not available]',
        meta: { pool: 'HikariPool-1', timeoutMs: 3000 }
      },
      {
        id: 'log-3',
        timestamp: '2026-09-30 12:04:23',
        level: 'FATAL',
        service: 'payment-service',
        message: 'ConnectionPool exhausted: active=100 max=100 waiting=84 threads',
        meta: { active: 100, max: 100, waiting: 84 }
      },
      {
        id: 'log-4',
        timestamp: '2026-09-30 12:04:24',
        level: 'ERROR',
        service: 'payment-service',
        message: 'HTTP 503 Service Unavailable returned to client (upstream_timeout_exhaustion)',
        meta: { code: 503, downstream: 'checkout-service' }
      },
      {
        id: 'log-5',
        timestamp: '2026-09-30 12:04:28',
        level: 'WARN',
        service: 'payment-service',
        message: 'High thread contention detected on HikariPool.getConnection() lock'
      },
      {
        id: 'log-6',
        timestamp: '2026-09-30 12:04:35',
        level: 'ERROR',
        service: 'payment-service',
        message: 'Circuit breaker opened for Postgres master replica (fail_threshold=90%)'
      }
    ],
    memoriesRetrieved: [
      initialMemories[0], // INC-0912 (94% match)
      initialMemories[1], // INC-0841 (81% match)
      initialMemories[2]  // INC-0720 (72% match)
    ],
    recommendedPath: {
      title: 'Recommended Investigation Path',
      investigationSteps: [
        'Check database connection pool saturation (HikariPool active=100/100)',
        'Verify maximum pool configuration and idle timeout thresholds',
        'Compare current configuration with previous successful incident INC-0912'
      ],
      previousResolution: 'Increase database connection pool from 50 to 100 and restart payment service.',
      suggestedRunbookId: 'rb-db-pool',
      confidenceScore: 94
    },
    timeline: [
      {
        id: 'tl-1',
        time: '12:04',
        title: 'Incident detected',
        description: 'Alert triggered by Prometheus: HTTP 503 error rate exceeded 5% on payments-api',
        type: 'alert'
      },
      {
        id: 'tl-2',
        time: '12:05',
        title: 'Logs analyzed',
        description: 'Pattern match: ConnectionPool exhausted (active=100 max=100) on HikariPool-1',
        type: 'system'
      },
      {
        id: 'tl-3',
        time: '12:06',
        title: '3 similar incidents found in Hindsight',
        description: 'Retrieved INC-0912 (94% match), INC-0841 (81% match), INC-0720 (72% match)',
        type: 'memory'
      },
      {
        id: 'tl-4',
        time: '12:07',
        title: 'Previous successful resolution identified',
        description: 'Hindsight mapped resolution rule from INC-0912: Scale pool to 100 + rolling restart',
        type: 'memory'
      },
      {
        id: 'tl-5',
        time: '12:08',
        title: 'Engineer reviewing recommendation',
        description: 'Mohan S. opened incident workspace and verified DB pool metrics',
        type: 'action',
        author: 'Mohan S.'
      }
    ]
  },
  {
    id: 'INC-1043',
    title: 'Checkout latency spike on payment step',
    service: 'checkout-service',
    severity: 'SEV-2',
    status: 'Investigating',
    startedAt: '2026-09-30T11:51:00Z',
    relativeTime: '21 min ago',
    assignee: {
      name: 'Rahul K.',
      role: 'Backend Lead'
    },
    environment: 'Production',
    errorSummary: 'p99 latency 2,800ms on /api/v2/checkout/complete',
    affectedPercentage: '9.2%',
    latencyP99: '2,800ms (Normal: 110ms)',
    logs: [
      {
        id: 'log-c1',
        timestamp: '2026-09-30 11:51:04',
        level: 'WARN',
        service: 'checkout-service',
        message: 'Redis cluster cache lookup exceeded 450ms'
      },
      {
        id: 'log-c2',
        timestamp: '2026-09-30 11:51:12',
        level: 'ERROR',
        service: 'checkout-service',
        message: 'Downstream payments-api connection pool stall'
      }
    ],
    memoriesRetrieved: [initialMemories[3], initialMemories[1]],
    recommendedPath: {
      title: 'Recommended Investigation Path',
      investigationSteps: [
        'Inspect Redis connection pool latency and node health',
        'Verify downstream payments-api pool utilization',
        'Execute Redis Connection Recovery runbook'
      ],
      previousResolution: 'Rebalance Redis cluster socket pool and flush idle handles.',
      suggestedRunbookId: 'rb-redis-recovery',
      confidenceScore: 88
    },
    timeline: [
      {
        id: 'tl-c1',
        time: '11:51',
        title: 'Latency threshold breached',
        description: 'Checkout completion p99 spiked from 120ms to 2,800ms',
        type: 'alert'
      },
      {
        id: 'tl-c2',
        time: '11:53',
        title: 'Hindsight retrieved INC-0874',
        description: 'Correlated Redis cluster failover pattern with 88% similarity',
        type: 'memory'
      }
    ]
  },
  {
    id: 'INC-1039',
    title: 'Auth token validation timeout cascade',
    service: 'auth-service',
    severity: 'SEV-3',
    status: 'Resolved',
    startedAt: '2026-09-30T10:45:00Z',
    resolvedAt: '2026-09-30T11:03:00Z',
    relativeTime: '1h ago',
    assignee: {
      name: 'Priya D.',
      role: 'Security Engineer'
    },
    environment: 'Production',
    errorSummary: 'JWKS public key cache miss timeout',
    affectedPercentage: '1.2%',
    logs: [],
    memoriesRetrieved: [initialMemories[4]],
    recommendedPath: {
      title: 'Recommended Investigation Path',
      investigationSteps: ['Inspect JWKS cache hit ratio', 'Verify IAM rate limits'],
      previousResolution: 'Extended in-memory JWKS cache TTL from 60s to 3600s.',
      confidenceScore: 92,
      suggestedRunbookId: 'rb-jwt-ttl'
    },
    timeline: [
      {
        id: 'tl-a1',
        time: '10:45',
        title: 'Auth latency alert',
        type: 'alert'
      },
      {
        id: 'tl-a2',
        time: '10:48',
        title: 'Hindsight matched INC-0651',
        description: 'Applied JWKS TTL extension recommendation',
        type: 'memory'
      },
      {
        id: 'tl-a3',
        time: '11:03',
        title: 'Incident resolved & saved to Hindsight',
        description: 'Resolution validated with zero token failures',
        type: 'resolution'
      }
    ],
    savedToHindsight: true
  },
  {
    id: 'INC-1036',
    title: 'Order processing queue congestion',
    service: 'order-service',
    severity: 'SEV-2',
    status: 'Resolved',
    startedAt: '2026-09-29T18:20:00Z',
    resolvedAt: '2026-09-29T18:44:00Z',
    relativeTime: 'Yesterday',
    assignee: {
      name: 'Vikram T.',
      role: 'Platform Engineer'
    },
    environment: 'Production',
    errorSummary: 'Kafka consumer lag > 25,000 messages',
    affectedPercentage: '4.8%',
    logs: [],
    memoriesRetrieved: [initialMemories[5], initialMemories[11]],
    recommendedPath: {
      title: 'Recommended Investigation Path',
      investigationSteps: ['Scale consumer worker pods', 'Check database write locks'],
      previousResolution: 'Enforced canonical alphabetical locking order across catalog SKU keys.',
      confidenceScore: 84
    },
    timeline: [
      {
        id: 'tl-o1',
        time: '18:20',
        title: 'Queue lag alert',
        type: 'alert'
      },
      {
        id: 'tl-o2',
        time: '18:44',
        title: 'Resolved via Hindsight memory INC-0955',
        type: 'resolution'
      }
    ],
    savedToHindsight: true
  },
  {
    id: 'INC-1032',
    title: 'Notification dispatch rate limiting',
    service: 'notification-service',
    severity: 'SEV-3',
    status: 'Resolved',
    startedAt: '2026-09-29T14:10:00Z',
    resolvedAt: '2026-09-29T14:28:00Z',
    relativeTime: 'Yesterday',
    assignee: {
      name: 'Rahul K.',
      role: 'Backend Lead'
    },
    environment: 'Production',
    errorSummary: 'FCM 429 Too Many Requests',
    affectedPercentage: '2.1%',
    logs: [],
    memoriesRetrieved: [initialMemories[6]],
    recommendedPath: {
      title: 'Recommended Investigation Path',
      investigationSteps: ['Inspect outbound push queue', 'Enable token bucket rate limiter'],
      previousResolution: 'Enabled backpressure token bucket and switched transactional alerts to priority queue.',
      confidenceScore: 90
    },
    timeline: [
      {
        id: 'tl-n1',
        time: '14:10',
        title: 'FCM rate limit threshold breached',
        type: 'alert'
      },
      {
        id: 'tl-n2',
        time: '14:28',
        title: 'Resolved and saved to Hindsight memory',
        type: 'resolution'
      }
    ],
    savedToHindsight: true
  },
  {
    id: 'INC-1028',
    title: 'API Gateway 504 upstream timeout',
    service: 'api-gateway',
    severity: 'SEV-2',
    status: 'Resolved',
    startedAt: '2026-09-28T16:00:00Z',
    resolvedAt: '2026-09-28T16:32:00Z',
    relativeTime: '2 days ago',
    assignee: {
      name: 'Mohan S.',
      role: 'Staff SRE'
    },
    environment: 'Production',
    errorSummary: 'HTTP 504 Gateway Timeout on /api/v1/search',
    affectedPercentage: '6.4%',
    logs: [],
    memoriesRetrieved: [initialMemories[7]],
    recommendedPath: {
      title: 'Recommended Investigation Path',
      investigationSteps: ['Inspect search cluster latency', 'Apply Gateway timeout shedding runbook'],
      previousResolution: 'Configured async log flushing with 50MB ring buffer cap.',
      suggestedRunbookId: 'rb-api-gateway',
      confidenceScore: 82
    },
    timeline: [],
    savedToHindsight: true
  },
  {
    id: 'INC-1024',
    title: 'Stripe Webhook processing backlog',
    service: 'payments-api',
    severity: 'SEV-3',
    status: 'Resolved',
    startedAt: '2026-09-27T09:15:00Z',
    resolvedAt: '2026-09-27T09:35:00Z',
    relativeTime: '3 days ago',
    assignee: {
      name: 'Mohan S.',
      role: 'Staff SRE'
    },
    environment: 'Production',
    errorSummary: 'Webhook delivery response timeout > 2000ms',
    affectedPercentage: '3.5%',
    logs: [],
    memoriesRetrieved: [initialMemories[9]],
    recommendedPath: {
      title: 'Recommended Investigation Path',
      investigationSteps: ['Inspect cryptographic signature worker pool'],
      previousResolution: 'Offloaded signature validation to worker thread pool.',
      confidenceScore: 88
    },
    timeline: [],
    savedToHindsight: true
  },
  {
    id: 'INC-1019',
    title: 'Redis session store memory fragmentation',
    service: 'auth-service',
    severity: 'SEV-3',
    status: 'Resolved',
    startedAt: '2026-09-26T13:40:00Z',
    resolvedAt: '2026-09-26T14:10:00Z',
    relativeTime: '4 days ago',
    assignee: {
      name: 'Priya D.',
      role: 'Security Engineer'
    },
    environment: 'Production',
    errorSummary: 'Redis memory usage > 85% of allocated maxmemory',
    affectedPercentage: '0.0%',
    logs: [],
    memoriesRetrieved: [initialMemories[10]],
    recommendedPath: {
      title: 'Recommended Investigation Path',
      investigationSteps: ['Inspect key expiration distribution'],
      previousResolution: 'Enforced 24h expiration on all anonymous token keys in Redis.',
      confidenceScore: 91
    },
    timeline: [],
    savedToHindsight: true
  },
  {
    id: 'INC-1014',
    title: 'CoreDNS timeout cascade during deployment scale',
    service: 'checkout-service',
    severity: 'SEV-1',
    status: 'Resolved',
    startedAt: '2026-09-25T11:00:00Z',
    resolvedAt: '2026-09-25T11:22:00Z',
    relativeTime: '5 days ago',
    assignee: {
      name: 'Mohan S.',
      role: 'Staff SRE'
    },
    environment: 'Production',
    errorSummary: 'Temporary failure in name resolution (EAI_AGAIN)',
    affectedPercentage: '22.4%',
    logs: [],
    memoriesRetrieved: [initialMemories[14]],
    recommendedPath: {
      title: 'Recommended Investigation Path',
      investigationSteps: ['Deploy NodeLocal DNSCache DaemonSet'],
      previousResolution: 'Deployed NodeLocal DNS DaemonSet across all Kubernetes worker nodes.',
      confidenceScore: 95
    },
    timeline: [],
    savedToHindsight: true
  },
  {
    id: 'INC-1008',
    title: 'Order cart payload deserialization stall',
    service: 'checkout-service',
    severity: 'SEV-2',
    status: 'Resolved',
    startedAt: '2026-09-24T15:30:00Z',
    resolvedAt: '2026-09-24T15:58:00Z',
    relativeTime: '6 days ago',
    assignee: {
      name: 'Rahul K.',
      role: 'Backend Lead'
    },
    environment: 'Production',
    errorSummary: 'Thread CPU stall in JSON deserialization filter',
    affectedPercentage: '5.1%',
    logs: [],
    memoriesRetrieved: [initialMemories[8]],
    recommendedPath: {
      title: 'Recommended Investigation Path',
      investigationSteps: ['Verify coupon structure schema limits'],
      previousResolution: 'Added schema depth validator cap (max 4 levels) at ingress filter.',
      confidenceScore: 89
    },
    timeline: [],
    savedToHindsight: true
  }
];
