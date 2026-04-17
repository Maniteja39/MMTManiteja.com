import { useQuery } from "@tanstack/react-query";
import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { SoundProvider } from "@/lib/sound/SoundProvider";
import { postsApi, type PostSummary } from "@/lib/api";

const formatDate = (iso: string | null): string => {
  if (!iso) return "";
  try {
    return new Date(iso).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  } catch {
    return "";
  }
};

const Writings = () => {
  const { data, isLoading, isError, error } = useQuery({
    queryKey: ["posts", "published", 0, 20],
    queryFn: () => postsApi.listPublished(0, 20),
    // Retry once — cheap network hiccups shouldn't kill the page.
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

        <main className="container mx-auto px-5 sm:px-8 lg:px-16 pt-32 sm:pt-36 pb-24 max-w-4xl">
          {/* Section label */}
          <div className="mb-10">
            <span
              className="text-xs font-normal tracking-[0.25em] block mb-3"
              style={{ color: "rgba(245,184,32,0.6)" }}
            >
              006 — WRITINGS
            </span>
            <h1
              className="text-4xl sm:text-5xl font-semibold tracking-tight"
              style={{ color: "#f1f5f9" }}
            >
              Notes &amp; essays
            </h1>
            <p
              className="mt-4 text-base sm:text-lg"
              style={{ color: "rgba(226,232,240,0.55)", maxWidth: 620 }}
            >
              Occasional writing on backend architecture, multi-tenant systems,
              and the unglamorous half of shipping software.
            </p>
          </div>

          {isLoading && <PostListSkeleton />}

          {isError && (
            <EmptyState
              title="Couldn't load posts"
              body={(error as Error)?.message ?? "Something went wrong."}
            />
          )}

          {!isLoading && !isError && data?.items.length === 0 && (
            <EmptyState
              title="Nothing here yet."
              body="I'm putting the first few posts together. Check back soon."
            />
          )}

          {!isLoading && !isError && data && data.items.length > 0 && (
            <ul className="flex flex-col gap-8">
              {data.items.map((p) => (
                <PostRow key={p.id} post={p} />
              ))}
            </ul>
          )}
        </main>

        <Footer />
      </div>
    </SoundProvider>
  );
};

const PostRow = ({ post }: { post: PostSummary }) => (
  <li>
    <Link
      to={`/writings/${encodeURIComponent(post.slug)}`}
      className="group block rounded-2xl p-6 sm:p-8 transition-all"
      style={{
        background: "rgba(255,255,255,0.02)",
        border: "1px solid rgba(255,255,255,0.06)",
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.borderColor = "rgba(245,184,32,0.35)";
        e.currentTarget.style.background = "rgba(245,184,32,0.04)";
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.borderColor = "rgba(255,255,255,0.06)";
        e.currentTarget.style.background = "rgba(255,255,255,0.02)";
      }}
    >
      <div
        className="text-xs tracking-[0.22em] mb-3"
        style={{ color: "rgba(245,184,32,0.6)" }}
      >
        {formatDate(post.publishedAt)}
        {post.tags ? (
          <>
            <span className="mx-2 opacity-50">·</span>
            {post.tags}
          </>
        ) : null}
      </div>
      <h2
        className="text-xl sm:text-2xl font-semibold tracking-tight mb-3"
        style={{ color: "#f1f5f9" }}
      >
        {post.title}
      </h2>
      {post.excerpt && (
        <p style={{ color: "rgba(226,232,240,0.6)" }} className="text-sm sm:text-base leading-relaxed">
          {post.excerpt}
        </p>
      )}
      <div
        className="mt-5 inline-flex items-center gap-2 text-sm font-medium"
        style={{ color: "#F5B820" }}
      >
        Read more
        <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
      </div>
    </Link>
  </li>
);

const PostListSkeleton = () => (
  <ul className="flex flex-col gap-8" aria-hidden>
    {[0, 1, 2].map((i) => (
      <li
        key={i}
        className="h-44 rounded-2xl"
        style={{
          background: "rgba(255,255,255,0.02)",
          border: "1px solid rgba(255,255,255,0.06)",
          animation: "pulse 1.6s ease-in-out infinite",
          animationDelay: `${i * 120}ms`,
        }}
      />
    ))}
  </ul>
);

const EmptyState = ({ title, body }: { title: string; body: string }) => (
  <div
    className="rounded-2xl p-10 text-center"
    style={{
      background: "rgba(255,255,255,0.02)",
      border: "1px dashed rgba(255,255,255,0.12)",
    }}
  >
    <p className="text-lg font-medium mb-2" style={{ color: "#f1f5f9" }}>
      {title}
    </p>
    <p style={{ color: "rgba(226,232,240,0.5)" }}>{body}</p>
  </div>
);

export default Writings;
