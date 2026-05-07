import type { PostResponse } from "@/lib/api";

/**
 * Static seed posts shown when the backend has no published posts (or is
 * unreachable). Once real posts exist in the DB, these are hidden — see
 * the fallback logic in Writings.tsx and WritingDetail.tsx.
 *
 * IDs are negative to keep them distinguishable from any backend-issued IDs.
 */
export const SEED_POSTS: PostResponse[] = [
  {
    id: -1,
    slug: "why-agentic-systems-break-differently",
    title: "Why agentic systems break differently than microservices",
    excerpt:
      "Years of distributed-systems failures gave me a debugging playbook. Agents break that playbook in ways worth naming.",
    tags: "Agentic AI, Distributed Systems",
    status: "PUBLISHED",
    publishedAt: "2026-04-15T16:00:00Z",
    createdAt: "2026-04-15T16:00:00Z",
    updatedAt: "2026-04-15T16:00:00Z",
    contentMd: `I've spent most of my career chasing failures in distributed systems — exhausted retries, half-applied transactions, message ordering bugs that only show up under load. Over time you build a playbook. There's a finite number of ways a microservice can fail, and most of them are well-understood.

Agentic systems don't break that way. They break in ways that *look* familiar at first — a retry loop, a stuck workflow — and then turn out to be subtly different in ways that matter.

Three failure modes I keep seeing:

## 1. Retry loops where the agent re-decides slightly differently each time

In a normal microservice, retrying a failed call means re-running deterministic code. Same input produces the same output. Bounded.

In an agentic system, retrying often means re-asking a model what to do. Same input, slightly different output — different tool selection, different argument values, different ordering. The "same" retry can pick a different path. So your exponential backoff doesn't bound anything; it just gives you N independent attempts at being wrong, with no guarantee they converge.

The fix isn't retry tuning. The fix is freezing the decision once made — cache the agent's plan, and on retry, re-execute the plan rather than re-deriving it.

## 2. State drift between observation and action

A traditional service reads state, makes a decision, writes state — usually in a single transaction or with optimistic locking. An agent often reads state, *thinks* for a few seconds, and then acts. By the time it acts, the world has moved.

In multi-agent systems this gets worse: agent A reads state, agent B reads the same state, both decide independently, both act. Now you have two diverging worldviews modifying shared state. The fix here is the same fix every distributed system eventually rediscovers — versioned reads, idempotency keys, and assuming the world will move under you.

## 3. Confidence cascades

The most insidious one. The agent picks the wrong tool for step 1 — but does it *confidently*. Steps 2 through 5 then run on the assumption that step 1 succeeded. By the time you notice, you've invoked five external systems based on a wrong premise.

There's no microservice analogue for this. A bad result from one service propagates as data; a bad decision from an agent propagates as more decisions. You need verification gates between meaningful actions, not just at the end.

## What actually helps

The patterns that work are mostly things distributed-systems people already know — they just have to be applied at a different layer:

- **Idempotency at the *action* level**, not the call level. "Send this email" needs an idempotency key, not just the HTTP request to the email API.
- **Decision logs.** Every choice an agent makes should be recoverable from the trace, not just the inputs.
- **Hard limits.** "Max five tool calls per task" beats "tune the prompt to avoid loops."
- **A clean separation between deciding and acting.** Deciding is exploratory and can be retried; acting touches the world and shouldn't be.

We're not solving distributed systems again. We're hitting the same problems from one abstraction higher up — and most of the lessons port over, if you remember to apply them.`,
  },
  {
    id: -2,
    slug: "the-boring-infrastructure-under-agentic-ai",
    title: "The boring infrastructure under agentic AI",
    excerpt:
      "The model is the small dependency. The system around it is the product.",
    tags: "Agentic AI, Infrastructure",
    status: "PUBLISHED",
    publishedAt: "2026-04-22T16:00:00Z",
    createdAt: "2026-04-22T16:00:00Z",
    updatedAt: "2026-04-22T16:00:00Z",
    contentMd: `Every demo of an "AI agent" I've watched hides 90% of the work that actually matters in production. The demo shows the model picking a tool, executing it, returning a clean result. What it doesn't show is everything around that loop.

After spending real time on the infrastructure side of agentic systems, I've come to think the people who'll ship reliable ones are the people who've shipped reliable distributed backends — not because the model is the hard part, but because it isn't.

Here's what's actually under a working agent, from what I've seen:

## A reliable event log of every agent action

Not just for debugging — for replay, for audit, for the "why did the agent do X three weeks ago" question that will eventually come from someone in legal or operations. Kafka or its equivalent isn't a nice-to-have here. Every decision and every tool invocation should land in an immutable, queryable log.

## A tool gateway that mediates every external call

Agents don't call your APIs directly. They call a gateway that you control — one that enforces rate limits, redacts sensitive arguments, normalizes errors into something the agent can reason about, and refuses calls the agent shouldn't be making. This is the most important piece of infrastructure I've worked on, and the one that's almost never in the architecture diagrams.

## Backpressure

Agents are expensive — model calls, tool calls, state reads. Bursty traffic into an agentic system is brutal if you don't queue it. You need the same capacity-management primitives you'd build for any real backend: bounded queues, circuit breakers per tool, a way to shed load before the model bills explode.

## An audit trail humans can read

Distributed tracing with proper correlation IDs is table stakes. But for agents you want one level higher — a human-readable narrative of what the agent decided and why, reconstructable from the trace. Not "span 4 invoked tool X" but "the agent saw the order was overdue, picked the escalation tool, and sent a follow-up." That summary view is engineering work, not a side effect of OpenTelemetry.

## Hard authorization boundaries

Agents will try to do things you didn't anticipate. The right model is the same one we use for service-to-service auth: explicit scopes, deny by default, every tool call signed and authorized. Don't rely on the prompt to keep an agent in its lane — that's not a security boundary, it's a suggestion.

## The model is not the product

The model is one of maybe a dozen components in the system, and the cheapest to swap. The cost of switching from one model version to another is hours; the cost of switching your event-log architecture is months. So most of the engineering attention should be on the parts that aren't going to change.

This isn't a hot take — it's just what I've observed. The demos look magical. The actual systems look a lot like the rest of the backends I've built, with one extra moving part.`,
  },
  {
    id: -3,
    slug: "what-changes-when-an-agent-owns-the-workflow",
    title: "What changes when an agent owns the workflow",
    excerpt:
      "Moving from \"code that does X\" to \"context that lets an agent figure out X\" reshapes more of the engineering practice than I expected.",
    tags: "Agentic AI, Engineering",
    status: "PUBLISHED",
    publishedAt: "2026-04-29T16:00:00Z",
    createdAt: "2026-04-29T16:00:00Z",
    updatedAt: "2026-04-29T16:00:00Z",
    contentMd: `Most of the systems I've built follow the same shape: a request comes in, my code decides what happens, the response goes out. The control flow is mine. I write the if-statements. I pick the order. I'm responsible for every branch.

Agentic systems flip this. The agent owns the workflow. My job changes from *writing code that does X* to *writing context that lets an agent figure out X*. That sounds like a small shift. In practice it changes a lot of how I work.

## Testing changes shape

Deterministic asserts — "given input A, expect output B" — still apply at the unit level, but most of the agent's behavior isn't unit-testable. What I've found useful is replay-based testing: capture real traces from production, replay them against new prompt or tool changes, and diff the decisions. Plus property-based tests for invariants ("the agent never charges a card twice for the same order"). Specific input/output assertions become rare.

## Idempotency becomes load-bearing

I always cared about idempotency, but in agentic systems it's not a nice-to-have. The agent might retry differently, branch into parallel paths, or revisit the same goal three different ways. Every tool that touches the world has to be safe to call twice. Idempotency keys go from "good practice" to the only thing standing between you and duplicate side effects.

## Contracts get fuzzier

A REST endpoint has a fixed input shape. An agent's "input" is a prompt plus whatever context it pulls in — variable shape, variable content, variable depth. Versioning becomes harder because you can't pin a contract that doesn't have firm edges. I've ended up doing more contract work at the *tool* layer than the agent layer. The agent's view of the world shifts; the tools it calls have to stay stable.

## Debugging is archeology

When something goes wrong in a microservice, I read the logs and reconstruct what happened. With an agent, I'm reconstructing why it *decided* something — and the answer is always "based on the context it had at the time, plus model nondeterminism." The trace gives me the inputs; I have to infer the reasoning. Saving the agent's intermediate reasoning — plan, scratchpad, tool-selection rationale — is essential. Without it, you're guessing.

## Constraint design is the hard part

The hardest engineering work I'm doing on agents isn't telling them what to do — it's telling them what *not* to do, without enumerating every possible "not." You can't list every wrong action. You can only describe the shape of the space of allowed actions, and trust the model plus the tool gateway to keep the agent inside it. This feels closer to writing a security policy than writing a function.

## What I'm enjoying

Less boilerplate. Less "wire up step 4 of a 12-step workflow." More time thinking about the system's shape — what the agent should know, what it shouldn't, what tools it gets, what guardrails exist between it and the world. It's a different kind of engineering problem than the ones I cut my teeth on, and it uses different muscles.

The familiar muscles still matter. Distributed systems, idempotency, observability — none of that goes away. The new muscle is constraint design: building systems where *I* don't make every decision, and being deliberate about what an agent gets to decide instead.`,
  },
];

export const SEED_POST_BY_SLUG: Record<string, PostResponse> = Object.fromEntries(
  SEED_POSTS.map((p) => [p.slug, p]),
);

export const seedPostSummaries = () =>
  SEED_POSTS.map(({ id, slug, title, excerpt, tags, publishedAt }) => ({
    id,
    slug,
    title,
    excerpt,
    tags,
    publishedAt,
  }));
