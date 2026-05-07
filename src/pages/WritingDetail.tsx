import { useQuery } from "@tanstack/react-query";
import { Link, useParams } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { SoundProvider } from "@/lib/sound/SoundProvider";
import { postsApi } from "@/lib/api";
import { SEED_POST_BY_SLUG } from "@/data/seedPosts";

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
                <ReactMarkdown remarkPlugins={[remarkGfm]}>
                  {data.contentMd}
                </ReactMarkdown>
              </div>
            </article>
          )}
        </main>

        <Footer />
      </div>
    </SoundProvider>
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
