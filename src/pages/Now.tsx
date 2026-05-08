import { useEffect } from "react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { SoundProvider } from "@/lib/sound/SoundProvider";

/**
 * /now — a "now page" in the spirit of nownownow.com.
 *
 * Edit the LAST_UPDATED date and the section bodies below whenever you change
 * what you're focused on. No CMS — by design. The constraint that you have to
 * touch the code keeps it honest.
 */

const LAST_UPDATED = "May 7, 2026";

const Now = () => {
  useEffect(() => {
    const previous = document.title;
    document.title = "Now — Maniteja Manchikalapudi";
    return () => {
      document.title = previous;
    };
  }, []);

  return (
    <SoundProvider>
      <div
        style={{
          minHeight: "100vh",
          background: "var(--page-bg)",
          color: "var(--text-strong)",
        }}
      >
        <Header />

        <main className="container mx-auto px-5 sm:px-8 lg:px-16 pt-32 sm:pt-36 pb-24 max-w-3xl">
          <p
            className="text-xs font-semibold tracking-[0.25em] uppercase mb-3"
            style={{ color: "var(--brand-gold)" }}
          >
            007 — Now
          </p>
          <h1
            className="font-bold mb-6"
            style={{
              fontSize: "clamp(2.5rem, 5vw, 4.5rem)",
              color: "var(--text-strong)",
              lineHeight: 1.05,
            }}
          >
            What I'm doing{" "}
            <span style={{ color: "var(--brand-gold)" }}>right now.</span>
          </h1>

          <p
            className="text-base sm:text-lg leading-relaxed mb-12 max-w-xl"
            style={{ color: "var(--text-body)" }}
          >
            A snapshot of what I'm working on, reading, and building this month.
            Inspired by Derek Sivers's{" "}
            <a
              href="https://nownownow.com/about"
              target="_blank"
              rel="noopener noreferrer"
              style={{ color: "var(--brand-gold)" }}
              className="underline-offset-4 hover:underline"
            >
              /now page
            </a>{" "}
            convention.
          </p>

          <div className="flex flex-col gap-12">
            <NowSection title="Engineering">
              <p>
                Building backend systems for IFS Loops — distributed
                microservices that orchestrate autonomous Digital Workers across
                manufacturing, energy, and field-service operations. Lots of
                Kafka, lots of gRPC, lots of thinking about how an agent's
                failure modes are different from a service's.
              </p>
            </NowSection>

            <NowSection title="Writing">
              <p>
                Recently published three notes on{" "}
                <a
                  href="/writings"
                  style={{ color: "var(--brand-gold)" }}
                  className="underline-offset-4 hover:underline"
                >
                  agentic AI
                </a>{" "}
                — the failure modes that don't look like microservice failures,
                the boring infrastructure underneath, and how engineering
                practice shifts when an agent owns the workflow.
              </p>
            </NowSection>

            <NowSection title="Reading">
              <ul className="space-y-2 list-none p-0">
                {[
                  "Designing Data-Intensive Applications — Martin Kleppmann (re-read)",
                  "Recent papers on LLM tool-use reliability and agent guardrails",
                  "Anthropic's engineering posts on building with Claude",
                ].map((line) => (
                  <li
                    key={line}
                    className="text-base leading-relaxed pl-4 relative"
                  >
                    <span
                      className="absolute left-0 top-2.5 w-1.5 h-1.5 rounded-full"
                      style={{ background: "var(--brand-gold)" }}
                    />
                    {line}
                  </li>
                ))}
              </ul>
            </NowSection>

            <NowSection title="Building">
              <p>
                This site. Spent a few sessions adding a light/dark mode (paper
                aesthetic, smooth crossfade), a writings system with proper SEO
                scaffolding, theme-aware Three.js scene, and a small set of
                quality-of-life touches like reading time, anchor links, and
                comments via GitHub Discussions.
              </p>
            </NowSection>

            <NowSection title="Where">
              <p>San Francisco, CA.</p>
            </NowSection>
          </div>

          <p
            className="mt-16 text-xs font-mono"
            style={{ color: "var(--text-very-faint)" }}
          >
            Last updated: <span style={{ color: "var(--text-soft)" }}>{LAST_UPDATED}</span>
          </p>
        </main>

        <Footer />
      </div>
    </SoundProvider>
  );
};

const NowSection = ({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) => (
  <section>
    <h2
      className="text-xs font-semibold tracking-[0.22em] uppercase mb-4"
      style={{ color: "var(--text-soft)" }}
    >
      {title}
    </h2>
    <div
      className="text-base sm:text-lg leading-relaxed"
      style={{ color: "var(--text-body)" }}
    >
      {children}
    </div>
  </section>
);

export default Now;
