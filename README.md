# OpsMind AI — Self-Learning Incident Response System

> **HackwithHyderabad 3.0 Submission**  
> **Track / Category:** AI Agents That Learn Using Hindsight  
> **Built by:** Team OpsMind

---

## 🚀 Overview

**OpsMind AI** is an enterprise-grade incident response agent designed for DevOps and Site Reliability Engineering (SRE) teams. Modern production systems experience recurring degradation patterns, but traditional monitoring alerts on symptoms in isolation—forcing engineers to manually re-diagnose problems that have already been solved before.

OpsMind solves this by utilizing **Hindsight Memory**:
1. **Remembers** past production incidents, execution telemetry, and verified root causes.
2. **Retrieves** high-similarity memory vectors when a new incident is triggered.
3. **Compares** "Without Hindsight" (naive LLM guess) vs "With Hindsight" (evidence-backed recommendation).
4. **Learns & Indexes** post-mortem findings and runbook execution outcomes back into the memory catalog, creating a continuous self-learning loop.

---

## 🎯 Hackathon Problem Statement Compliance

| Requirement | How OpsMind Implements It | Status |
| :--- | :--- | :--- |
| **Hindsight Memory Store** | Indexed repository of past incident vectors (`HindsightCatalog`), searchable by error signals, service context, and root causes. | ✅ Complete |
| **Similar Incident Retrieval** | Signal-based similarity scoring (keyword/Jaccard heuristic engine) computing 0–100% match scores with evidence summaries. | ✅ Complete |
| **Resolution Recommendation** | Synthesized actionable steps with confidence metrics based on historical runbook success rates. | ✅ Complete |
| **Before / After Learning Proof** | Side-by-side **Hindsight Comparison Panel** directly exposing the difference between naive and memory-backed reasoning. | ✅ Complete |
| **Post-Incident Learning Loop** | Comprehensive Post-Mortem modal auto-indexing resolutions & learnings back into Hindsight memory vectors. | ✅ Complete |
| **Dynamic Runbook Verification** | Live outcome recording (Pass/Fail) adjusting runbook success rates and future recommendation weights. | ✅ Complete |
| **Human-Designed UI** | Modern, professional SaaS interface (`#004643` deep green, `#F0EDE5` warm canvas, zero cyberpunk/neon tropes). | ✅ Complete |

---

## 🔄 The Self-Learning Feedback Loop

```
  ┌────────────────────────────────────────────────────────┐
  │                 1. NEW INCIDENT ALERTS                 │
  │     (e.g., INC-1042: HTTP 503 Spike on payments-api)   │
  └──────────────────────────┬─────────────────────────────┘
                             │
                             ▼
  ┌────────────────────────────────────────────────────────┐
  │          2. HINDSIGHT VECTOR MEMORY RETRIEVAL          │
  │     Searches knowledge base for similar past cases     │
  │     Matches INC-891 (94%) & INC-654 (88%)              │
  └──────────────────────────┬─────────────────────────────┘
                             │
                             ▼
  ┌────────────────────────────────────────────────────────┐
  │         3. ROOT CAUSE & RUNBOOK RECOMMENDATION         │
  │     "Pool Exhaustion detected (94% confidence)"        │
  │     Recommends: Scale Pool Limit & Restart Pods        │
  └──────────────────────────┬─────────────────────────────┘
                             │
                             ▼
  ┌────────────────────────────────────────────────────────┐
  │         4. RUNBOOK EXECUTION & VERIFICATION            │
  │     Automated execution + live telemetry recovery      │
  │     Dynamic outcome feedback adjusts success rate      │
  └──────────────────────────┬─────────────────────────────┘
                             │
                             ▼
  ┌────────────────────────────────────────────────────────┐
  │         5. POST-MORTEM & KNOWLEDGE INDEXING            │
  │     Saves verified fix to Hindsight Memory store       │
  │     → Future incidents automatically benefit!          │
  └────────────────────────────────────────────────────────┘
```

---

## ⏱️ 60-Second Demo Walkthrough for Judges

Follow these steps for a live presentation of the self-learning capabilities:

1. **Step 1 — Review Active Incident**
   - Click on **INC-1042 (`payments-api` 503 error rate spike)** from the Active Incidents list.
   - Note the **Hindsight Memory Match** banner indicating a 94% match with historical incident `INC-891`.

2. **Step 2 — Inspect "With vs. Without Hindsight"**
   - Scroll to the **Hindsight Memory Comparison** card.
   - Contrast the left panel (*Generic AI diagnosis without past context*) with the right panel (*Evidence-backed diagnosis with 94% confidence*).

3. **Step 3 — Execute Recommended Runbook**
   - In the **Recommended Investigation Path**, click **Execute Runbook: Connection Pool Resize & Pod Restart**.
   - Watch the instant telemetry recovery and timeline event logging.

4. **Step 4 — Resolve & Index Knowledge**
   - Click **Resolve Incident** in the top action bar.
   - Confirm resolution details and click **Confirm & Index to Hindsight**.
   - Fill out the **Post-Mortem & Memory Indexing** modal and click **Save & Index to Hindsight Memory**.
   - Notice the toast notification confirming the new memory vector has been indexed.

5. **Step 5 — Verify Learning in Catalog & Runbooks**
   - Navigate to **Hindsight Memory** from the sidebar to inspect the newly indexed vector.
   - Navigate to **Runbooks & Rules** to observe dynamic success rate updates from recorded outcomes.
   - Click **Simulate New Incident** (`+ New Incident`) with a database 503 pattern to see your newly saved memory automatically retrieved!

---

## 🛠️ Tech Stack & Architecture

- **Frontend:** React 18 with TypeScript, Vite 5, Tailwind CSS
- **Icons:** Lucide React
- **Hindsight Server Proxy:** Node.js / Vite middleware (`server/hindsightProxy.js`)
  - `GET /api/hindsight/health` — Checks live connection to Hindsight Vector Bank
  - `POST /api/hindsight/retain` — Dispatches memories to `POST /v1/default/banks/{bank_id}/memories`
  - `POST /api/hindsight/recall` — Dispatches queries to `POST /v1/default/banks/{bank_id}/memories/recall`
- **Security:** Secret `HINDSIGHT_API_KEY` is isolated strictly to the server layer and never bundled in the frontend client.
- **Fallback Engine:** High-fidelity local signal extraction & Jaccard similarity fallback (`src/services/hindsightEngine.ts`) active when API key is unconfigured.

---

## 📦 Getting Started

### Prerequisites
- Node.js 18.x or higher
- npm 9.x or higher

### Installation & Execution

```bash
# 1. Clone or navigate to the repository
cd microhyd

# 2. Install dependencies
npm install

# 3. Start development server
npm run dev

# 4. Open in browser
# Visit http://localhost:3000 (or the port specified in console)
```

### Production Build

```bash
npm run build
npm run preview
```

---

## 👥 Team & Attribution

- **Project:** OpsMind AI — Self-Learning Incident Response System
- **Hackathon:** HackwithHyderabad 3.0
- **License:** MIT
