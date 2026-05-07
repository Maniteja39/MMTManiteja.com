import { useQuery } from "@tanstack/react-query";
import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { SoundProvider } from "@/lib/sound/SoundProvider";
import { postsApi, type PostSummary } from "@/lib/api";
import { seedPostSummaries } from "@/data/seedPosts";

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
  const { data, isLoading, isError } = useQuery({
    queryKey: ["posts", "published", 0, 20],
    queryFn: () => postsApi.listPublished(0, 20),
    // Retry once — cheap network hiccups shouldn't kill the page.
    retry: 1,
    staleTime: 60_000,
  });

  // Pick the list to render: prefer real backend posts; fall back to seed
  // posts when the backend is empty or unreachable. Once a real post is
  // published via the admin UI, that branch wins and seeds disappear.
  const apiPosts = data?.items ?? [];
  const usingSeeds = !isLoading && (isError || apiPosts.length === 0);
  const posts: PostSummary[] = usingSeeds ? seedPostSummaries() : apiPosts;

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

        <main className="container mx-auto px-5 sm:px-8 lg:px-16 pt-32 sm:pt-36 pb-24 max-w-4xl">
          {/* Section label */}
          <div className="mb-10">
            <span
              className="text-xs font-normal tracking-[0.25em] block mb-3"
              style={{ color: "color-mix(in srgb, var(--brand-gold) 60%, transparent)" }}
            >
              006 — WRITINGS
            </span>
            <h1
              className="text-4xl sm:text-5xl font-semibold tracking-tight"
              style={{ color: "var(--text-strong)" }}
            >
              Notes &amp; essays
            </h1>
            <p
              className="mt-4 text-base sm:text-lg"
              style={{ color: "var(--text-soft)", maxWidth: 620 }}
            >
              Occasional writing on backend architecture, multi-tenant systems,
              and the unglamorous half of shipping software.
            </p>
          </div>

          {isLoading && <PostListSkeleton />}

          {!isLoading && posts.length > 0 && (
            <ul className="flex flex-col gap-8">
              {posts.map((p) => (
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
        background: "var(--surface-1)",
        border: "1px solid var(--border-medium)",
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.borderColor =
          "color-mix(in srgb, var(--brand-gold) 35%, transparent)";
        e.currentTarget.style.background =
          "color-mix(in srgb, var(--brand-gold) 4%, transparent)";
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.borderColor = "var(--border-medium)";
        e.currentTarget.style.background = "var(--surface-1)";
      }}
    >
      <div
        className="text-xs tracking-[0.22em] mb-3"
        style={{ color: "color-mix(in srgb, var(--brand-gold) 60%, transparent)" }}
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
        style={{ color: "var(--text-strong)" }}
      >
        {post.title}
      </h2>
      {post.excerpt && (
        <p style={{ color: "var(--text-muted)" }} className="text-sm sm:text-base leading-relaxed">
          {post.excerpt}
        </p>
      )}
      <div
        className="mt-5 inline-flex items-center gap-2 text-sm font-medium"
        style={{ color: "var(--brand-gold)" }}
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
          background: "var(--surface-1)",
          border: "1px solid var(--border-medium)",
          animation: "pulse 1.6s ease-in-out infinite",
          animationDelay: `${i * 120}ms`,
        }}
      />
    ))}
  </ul>
);

export default Writings;
