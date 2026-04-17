import { useQuery } from "@tanstack/react-query";
import { Link, useParams } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { SoundProvider } from "@/lib/sound/SoundProvider";
import { postsApi } from "@/lib/api";

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

  const { data, isLoading, isError, error } = useQuery({
    queryKey: ["post", slug],
    queryFn: () => postsApi.get(slug),
    enabled: slug.length > 0,
    retry: 1,
    staleTime: 60_000,
  });

  return (
    <SoundProvider>
      <div
        style={{
          minHeight: "100vh",
          background: "#04040b",
          color: "#e2e8f0",
        }}
      >
        <Header />

        <main className="container mx-auto px-5 sm:px-8 lg:px-16 pt-32 sm:pt-36 pb-24 max-w-3xl">
          <Link
            to="/writings"
            className="inline-flex items-center gap-2 text-sm font-medium mb-10 transition-colors"
            style={{ color: "rgba(226,232,240,0.55)" }}
            onMouseEnter={(e) => (e.currentTarget.style.color = "#F5B820")}
            onMouseLeave={(e) =>
              (e.currentTarget.style.color = "rgba(226,232,240,0.55)")
            }
          >
            <ArrowLeft className="w-4 h-4" />
            All writings
          </Link>

          {isLoading && <ArticleSkeleton />}

          {isError && (
            <div
              className="rounded-2xl p-8 text-center"
              style={{
                background: "rgba(255,255,255,0.02)",
                border: "1px dashed rgba(255,255,255,0.12)",
              }}
            >
              <p className="text-lg font-medium mb-2" style={{ color: "#f1f5f9" }}>
                Post not found
              </p>
              <p style={{ color: "rgba(226,232,240,0.5)" }}>
                {(error as Error)?.message ??
                  "This post may have been unpublished or never existed."}
              </p>
            </div>
          )}

          {data && (
            <article>
              {/* Meta */}
              <div
                className="text-xs tracking-[0.25em] mb-4"
                style={{ color: "rgba(245,184,32,0.7)" }}
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
                style={{ color: "#f1f5f9" }}
              >
                {data.title}
              </h1>

              {data.excerpt && (
                <p
                  className="text-lg sm:text-xl leading-relaxed mb-10"
                  style={{ color: "rgba(226,232,240,0.7)" }}
                >
                  {data.excerpt}
                </p>
              )}

              {/* Body — Tailwind Typography plugin gives us reasonable prose defaults. */}
              <div
                className="prose prose-invert prose-lg max-w-none
                           prose-headings:text-slate-100 prose-headings:font-semibold
                           prose-p:text-slate-300 prose-li:text-slate-300
                           prose-a:text-[#F5B820] hover:prose-a:underline
                           prose-code:text-[#F5B820] prose-code:bg-white/5 prose-code:rounded prose-code:px-1.5 prose-code:py-0.5 prose-code:text-sm prose-code:before:content-none prose-code:after:content-none
                           prose-pre:bg-white/5 prose-pre:border prose-pre:border-white/10 prose-pre:rounded-xl
                           prose-blockquote:border-l-[#F5B820] prose-blockquote:text-slate-400
                           prose-hr:border-white/10"
              >
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
