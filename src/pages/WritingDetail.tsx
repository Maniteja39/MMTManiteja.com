import { useEffect, useRef, useState, type ReactNode } from "react";
import { useQuery } from "@tanstack/react-query";
import { Link, useParams } from "react-router-dom";
import { ArrowLeft, Check, Copy } from "lucide-react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { SoundProvider } from "@/lib/sound/SoundProvider";
import { useTheme } from "@/lib/theme/ThemeContext";
import { postsApi, type PostResponse } from "@/lib/api";
import { SEED_POSTS, SEED_POST_BY_SLUG } from "@/data/seedPosts";

/** Average adult reading speed sits around 200 wpm. Round up so a short post
 *  doesn't read as "0 min". Returns e.g. "4 min read". */
const readingTime = (markdown: string): string => {
  const words = markdown.trim().split(/\s+/).filter(Boolean).length;
  const minutes = Math.max(1, Math.round(words / 200));
  return `${minutes} min read`;
};

/** Pull the plain-text content out of ReactMarkdown's children prop, which can
 *  be a string, an array, or nested React nodes. Used to slugify headings. */
const nodeToText = (node: ReactNode): string => {
  if (typeof node === "string" || typeof node === "number") return String(node);
  if (Array.isArray(node)) return node.map(nodeToText).join("");
  if (node && typeof node === "object" && "props" in node) {
    return nodeToText((node as { props: { children?: ReactNode } }).props.children);
  }
  return "";
};

/** Convert "Why agentic systems break" → "why-agentic-systems-break". */
const slugify = (text: string): string =>
  text
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, "")
    .trim()
    .replace(/\s+/g, "-");

const SITE_ORIGIN = "https://maniteja.com";

/** Update an existing <head> meta tag's content; remember the original so we can
 *  restore on unmount. Returns null if the selector doesn't match. */
const overrideMeta = (
  selector: string,
  attribute: string,
  value: string,
): { el: Element; attribute: string; original: string | null } | null => {
  const el = document.head.querySelector(selector);
  if (!el) return null;
  const original = el.getAttribute(attribute);
  el.setAttribute(attribute, value);
  return { el, attribute, original };
};

/**
 * Inject per-post metadata while a writing is open:
 *   - <title>
 *   - Open Graph + Twitter Card overrides (so link unfurls show the post)
 *   - BlogPosting JSON-LD (for rich snippets)
 *   - BreadcrumbList JSON-LD (for "Home › Writings › <title>" in search results)
 *   - <link rel="canonical"> pointing at this post
 *
 * Everything is reverted when the post unmounts so the site-wide tags in
 * index.html remain the source of truth on every other route.
 */
const usePostMetadata = (post: PostResponse | undefined) => {
  useEffect(() => {
    if (!post) return;

    const url = `${SITE_ORIGIN}/writings/${post.slug}`;
    const description = post.excerpt ?? "";
    const previousTitle = document.title;
    document.title = `${post.title} — Maniteja Manchikalapudi`;

    // Override head meta tags so social cards / canonical reflect the post.
    const overrides = [
      overrideMeta('meta[property="og:type"]', "content", "article"),
      overrideMeta('meta[property="og:title"]', "content", post.title),
      overrideMeta('meta[property="og:description"]', "content", description),
      overrideMeta('meta[property="og:url"]', "content", url),
      overrideMeta('meta[name="twitter:title"]', "content", post.title),
      overrideMeta('meta[name="twitter:description"]', "content", description),
      overrideMeta('link[rel="canonical"]', "href", url),
    ].filter(Boolean) as Array<{ el: Element; attribute: string; original: string | null }>;

    // BlogPosting schema — rich snippets in Google search results.
    const blogPosting = {
      "@context": "https://schema.org",
      "@type": "BlogPosting",
      "headline": post.title,
      "description": description || undefined,
      "datePublished": post.publishedAt ?? undefined,
      "dateModified": post.updatedAt ?? post.publishedAt ?? undefined,
      "author": {
        "@type": "Person",
        "@id": `${SITE_ORIGIN}/#person`,
        "name": "Maniteja Manchikalapudi",
        "url": `${SITE_ORIGIN}/`,
      },
      "publisher": { "@id": `${SITE_ORIGIN}/#person` },
      "mainEntityOfPage": { "@type": "WebPage", "@id": url },
      "url": url,
      "image": `${SITE_ORIGIN}/preview.png`,
      "keywords": post.tags ?? undefined,
    };

    // BreadcrumbList — Google shows "Home › Writings › <title>" in results.
    const breadcrumbs = {
      "@context": "https://schema.org",
      "@type": "BreadcrumbList",
      "itemListElement": [
        { "@type": "ListItem", "position": 1, "name": "Home", "item": `${SITE_ORIGIN}/` },
        { "@type": "ListItem", "position": 2, "name": "Writings", "item": `${SITE_ORIGIN}/writings` },
        { "@type": "ListItem", "position": 3, "name": post.title, "item": url },
      ],
    };

    const blogScript = document.createElement("script");
    blogScript.type = "application/ld+json";
    blogScript.dataset.blogPosting = post.slug;
    blogScript.text = JSON.stringify(blogPosting);
    document.head.appendChild(blogScript);

    const crumbScript = document.createElement("script");
    crumbScript.type = "application/ld+json";
    crumbScript.dataset.breadcrumbs = post.slug;
    crumbScript.text = JSON.stringify(breadcrumbs);
    document.head.appendChild(crumbScript);

    return () => {
      blogScript.remove();
      crumbScript.remove();
      document.title = previousTitle;
      // Restore original head meta tag values.
      overrides.forEach(({ el, attribute, original }) => {
        if (original === null) el.removeAttribute(attribute);
        else el.setAttribute(attribute, original);
      });
    };
  }, [post]);
};

const formatDate = (iso: string | null): string => {
  if (!iso) return "";
  try {
    return new Date(iso).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  } catch {
    return "";
  }
};

const WritingDetail = () => {
  const { slug = "" } = useParams<{ slug: string }>();

  const { data: apiData, isLoading, isError } = useQuery({
    queryKey: ["post", slug],
    queryFn: () => postsApi.get(slug),
    enabled: slug.length > 0,
    retry: 1,
    staleTime: 60_000,
  });

  // Fall back to a seed post if the backend doesn't have this slug — covers
  // both the "backend down" and "post never published" cases.
  const seed = SEED_POST_BY_SLUG[slug];
  const data = apiData ?? (isError ? seed : undefined) ?? (!isLoading && !apiData ? seed : undefined);
  const notFound = !isLoading && !data;

  // Per-post <title> + BlogPosting JSON-LD for rich snippets.
  usePostMetadata(data);

  return (
    <SoundProvider>
      <div
        style={{
          minHeight: "100vh",
          background: "var(--page-bg)",
          color: "var(--text-strong)",
        }}
      >
        <ReadingProgress />
        <Header />

        <main className="container mx-auto px-5 sm:px-8 lg:px-16 pt-32 sm:pt-36 pb-24 max-w-3xl">
          <Link
            to="/writings"
            className="inline-flex items-center gap-2 text-sm font-medium mb-10 transition-colors"
            style={{ color: "var(--text-soft)" }}
            onMouseEnter={(e) => (e.currentTarget.style.color = "var(--brand-gold)")}
            onMouseLeave={(e) =>
              (e.currentTarget.style.color = "var(--text-soft)")
            }
          >
            <ArrowLeft className="w-4 h-4" />
            All writings
          </Link>

          {isLoading && <ArticleSkeleton />}

          {notFound && (
            <div
              className="rounded-2xl p-8 text-center"
              style={{
                background: "var(--surface-1)",
                border: "1px dashed var(--border-medium)",
              }}
            >
              <p className="text-lg font-medium mb-2" style={{ color: "var(--text-strong)" }}>
                Post not found
              </p>
              <p style={{ color: "var(--text-muted)" }}>
                This post may have been unpublished or never existed.
              </p>
            </div>
          )}

          {data && (
            <article>
              {/* Meta */}
              <div
                className="text-xs tracking-[0.25em] mb-4"
                style={{ color: "color-mix(in srgb, var(--brand-gold) 70%, transparent)" }}
              >
                {formatDate(data.publishedAt)}
                <span className="mx-2 opacity-50">·</span>
                {readingTime(data.contentMd)}
                {data.tags ? (
                  <>
                    <span className="mx-2 opacity-50">·</span>
                    {data.tags}
                  </>
                ) : null}
              </div>

              {/* Title */}
              <h1
                className="text-3xl sm:text-5xl font-semibold tracking-tight leading-tight mb-6"
                style={{ color: "var(--text-strong)" }}
              >
                {data.title}
              </h1>

              {data.excerpt && (
                <p
                  className="text-lg sm:text-xl leading-relaxed mb-10"
                  style={{ color: "var(--text-body)" }}
                >
                  {data.excerpt}
                </p>
              )}

              {/* Body — Tailwind Typography plugin gives us reasonable prose
                  defaults. The `mmt-prose` class layered on top recolors prose
                  internals via CSS vars so it follows the theme. */}
              <div className="prose prose-lg max-w-none mmt-prose">
                <ReactMarkdown
                  remarkPlugins={[remarkGfm]}
                  components={{
                    h2: ({ children }) => (
                      <AnchoredHeading level={2}>{children}</AnchoredHeading>
                    ),
                    h3: ({ children }) => (
                      <AnchoredHeading level={3}>{children}</AnchoredHeading>
                    ),
                    pre: ({ children }) => <CodeBlock>{children}</CodeBlock>,
                  }}
                >
                  {data.contentMd}
                </ReactMarkdown>
              </div>

              <RelatedPosts currentSlug={data.slug} />

              <Comments slug={data.slug} />
            </article>
          )}
        </main>

        <Footer />
      </div>
    </SoundProvider>
  );
};

/** Thin gold progress bar at the very top of the viewport — mirrors how far
 *  the reader has scrolled through the page. Fixed-position so it stays
 *  visible above the LiveClock and Header. */
const ReadingProgress = () => {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const update = () => {
      const max =
        document.documentElement.scrollHeight - window.innerHeight;
      setProgress(max > 0 ? Math.min(100, Math.max(0, (window.scrollY / max) * 100)) : 0);
    };
    update();
    window.addEventListener("scroll", update, { passive: true });
    window.addEventListener("resize", update);
    return () => {
      window.removeEventListener("scroll", update);
      window.removeEventListener("resize", update);
    };
  }, []);

  return (
    <div
      aria-hidden
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        height: 2,
        width: `${progress}%`,
        background: "var(--brand-gold)",
        boxShadow: "0 0 8px color-mix(in srgb, var(--brand-gold) 60%, transparent)",
        zIndex: 100,
        transition: "width 0.1s linear",
      }}
    />
  );
};

/** Markdown code block with a copy button overlaid in the top-right corner.
 *  The button shows a check icon for ~2s after a successful copy. Falls back
 *  silently if clipboard access is denied (no error UI — readers can still
 *  select-and-copy manually). */
const CodeBlock = ({ children }: { children: ReactNode }) => {
  const ref = useRef<HTMLPreElement>(null);
  const [copied, setCopied] = useState(false);

  const copy = async () => {
    const text = ref.current?.innerText ?? "";
    if (!text) return;
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // Clipboard write may be blocked (insecure origin, permissions). No-op.
    }
  };

  return (
    <div className="relative group">
      <pre ref={ref}>{children}</pre>
      <button
        onClick={copy}
        aria-label={copied ? "Copied" : "Copy code"}
        className="absolute top-3 right-3 p-2 rounded-md transition-opacity opacity-0 group-hover:opacity-100 focus:opacity-100"
        style={{
          background: "var(--surface-2)",
          border: "1px solid var(--border-medium)",
          color: copied ? "var(--brand-gold)" : "var(--text-soft)",
          backdropFilter: "blur(4px)",
        }}
      >
        {copied ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
      </button>
    </div>
  );
};

/** A heading that gets a stable `id` derived from its text, plus a small
 *  hash-link button on hover. Lets readers deep-link to specific sections. */
const AnchoredHeading = ({
  level,
  children,
}: {
  level: 2 | 3;
  children: ReactNode;
}) => {
  const text = nodeToText(children);
  const id = slugify(text);
  const Tag = (`h${level}`) as "h2" | "h3";

  return (
    <Tag id={id} className="group scroll-mt-32">
      {children}
      <a
        href={`#${id}`}
        aria-label={`Link to "${text}"`}
        className="ml-2 opacity-0 group-hover:opacity-100 transition-opacity no-underline"
        style={{ color: "var(--brand-gold)", fontWeight: 400 }}
        onClick={(e) => {
          // Update URL without scroll-jump (heading already has scroll-mt).
          e.preventDefault();
          history.replaceState(null, "", `#${id}`);
          document.getElementById(id)?.scrollIntoView({ behavior: "smooth", block: "start" });
        }}
      >
        #
      </a>
    </Tag>
  );
};

/* ────────────────────────────────────────────────────────────
 * Giscus comments
 *
 * Setup (one-time, ~3 minutes):
 *   1. Make sure GitHub Discussions is ON for the repo:
 *      https://github.com/Maniteja39/MMTManiteja.com/settings → "Features" → check Discussions
 *   2. Install the giscus app on the repo:
 *      https://github.com/apps/giscus → Install → pick this repo only
 *   3. Visit https://giscus.app, fill in:
 *        Repo: Maniteja39/MMTManiteja.com
 *        Mapping: pathname
 *        Discussion category: pick or create one (e.g. "Comments")
 *        Theme: preferred_color_scheme (we override at runtime anyway)
 *   4. Copy the four IDs giscus shows you and paste them into GISCUS_CONFIG below.
 *
 * Until repoId/categoryId are filled in, the comments section just doesn't
 * render — pushing this code without setup is safe.
 * ──────────────────────────────────────────────────────────── */
const GISCUS_CONFIG = {
  repo: "Maniteja39/MMTManiteja.com" as const,
  repoId: "R_kgDOR_MA7g",
  category: "General",
  categoryId: "DIC_kwDOR_MA7s4C8iaq",
};

const Comments = ({ slug }: { slug: string }) => {
  const { theme } = useTheme();
  const ref = useRef<HTMLDivElement>(null);

  // Mount the giscus script the first time this component renders for a given
  // slug. The script injects an <iframe> into our ref div.
  useEffect(() => {
    if (!GISCUS_CONFIG.repoId || !GISCUS_CONFIG.categoryId) return;
    const container = ref.current;
    if (!container) return;

    container.innerHTML = ""; // clear any previous iframe (route changes)

    const script = document.createElement("script");
    script.src = "https://giscus.app/client.js";
    script.async = true;
    script.crossOrigin = "anonymous";
    script.setAttribute("data-repo", GISCUS_CONFIG.repo);
    script.setAttribute("data-repo-id", GISCUS_CONFIG.repoId);
    script.setAttribute("data-category", GISCUS_CONFIG.category);
    script.setAttribute("data-category-id", GISCUS_CONFIG.categoryId);
    script.setAttribute("data-mapping", "pathname");
    script.setAttribute("data-strict", "0");
    script.setAttribute("data-reactions-enabled", "1");
    script.setAttribute("data-emit-metadata", "0");
    script.setAttribute("data-input-position", "bottom");
    script.setAttribute("data-theme", theme);
    script.setAttribute("data-lang", "en");
    script.setAttribute("data-loading", "lazy");
    container.appendChild(script);
    // We intentionally only rerun on slug change. The theme effect below
    // updates the iframe in place without remount.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [slug]);

  // When the user toggles the site theme, postMessage to the giscus iframe so
  // it follows along instead of being stuck on whatever it loaded with.
  useEffect(() => {
    if (!GISCUS_CONFIG.repoId || !GISCUS_CONFIG.categoryId) return;
    const iframe = document.querySelector<HTMLIFrameElement>("iframe.giscus-frame");
    iframe?.contentWindow?.postMessage(
      { giscus: { setConfig: { theme } } },
      "https://giscus.app",
    );
  }, [theme]);

  // No config yet — render nothing rather than a broken comments box.
  if (!GISCUS_CONFIG.repoId || !GISCUS_CONFIG.categoryId) return null;

  return (
    <section
      className="mt-16 pt-10"
      style={{ borderTop: "1px solid var(--border-medium)" }}
      aria-label="Comments"
    >
      <p
        className="text-xs font-semibold tracking-[0.25em] uppercase mb-6"
        style={{ color: "var(--brand-gold)" }}
      >
        Comments
      </p>
      <div ref={ref} />
    </section>
  );
};

/** Show two other writings at the bottom of the post — gives Google internal
 *  link signals and keeps readers moving through the site. Pulls from the seed
 *  posts; once the API has its own posts the same logic could read those. */
const RelatedPosts = ({ currentSlug }: { currentSlug: string }) => {
  const others = SEED_POSTS.filter((p) => p.slug !== currentSlug).slice(0, 2);
  if (others.length === 0) return null;

  return (
    <aside
      className="mt-16 pt-10"
      style={{ borderTop: "1px solid var(--border-medium)" }}
    >
      <p
        className="text-xs font-semibold tracking-[0.25em] uppercase mb-6"
        style={{ color: "var(--brand-gold)" }}
      >
        More writings
      </p>
      <ul className="grid gap-4 sm:grid-cols-2">
        {others.map((p) => (
          <li key={p.slug}>
            <Link
              to={`/writings/${encodeURIComponent(p.slug)}`}
              className="block rounded-xl p-5 h-full transition-colors"
              style={{
                background: "var(--surface-1)",
                border: "1px solid var(--border-medium)",
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.borderColor =
                  "color-mix(in srgb, var(--brand-gold) 35%, transparent)";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.borderColor = "var(--border-medium)";
              }}
            >
              <h3
                className="text-base font-semibold leading-snug mb-2"
                style={{ color: "var(--text-strong)" }}
              >
                {p.title}
              </h3>
              {p.excerpt && (
                <p
                  className="text-sm leading-relaxed"
                  style={{ color: "var(--text-muted)" }}
                >
                  {p.excerpt}
                </p>
              )}
            </Link>
          </li>
        ))}
      </ul>
    </aside>
  );
};

const ArticleSkeleton = () => (
  <div aria-hidden className="flex flex-col gap-4">
    <div
      className="h-4 rounded w-40"
      style={{ background: "rgba(255,255,255,0.06)" }}
    />
    <div
      className="h-10 rounded w-full"
      style={{ background: "rgba(255,255,255,0.06)" }}
    />
    <div
      className="h-6 rounded w-2/3 mb-6"
      style={{ background: "rgba(255,255,255,0.04)" }}
    />
    {[0, 1, 2, 3].map((i) => (
      <div
        key={i}
        className="h-4 rounded"
        style={{
          background: "rgba(255,255,255,0.04)",
          width: `${88 - i * 8}%`,
        }}
      />
    ))}
  </div>
);

export default WritingDetail;
