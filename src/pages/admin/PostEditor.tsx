import { useEffect, useMemo, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Eye, Loader2, Save } from "lucide-react";
import { toast } from "sonner";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { postsApi, type PostWriteRequest } from "@/lib/api";

const slugify = (title: string): string =>
  title
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-")
    .replace(/^-|-$/g, "");

const PostEditor = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const qc = useQueryClient();

  const isNew = !id || id === "new";
  const numericId = isNew ? null : Number(id);

  const [slug, setSlug] = useState("");
  const [slugTouched, setSlugTouched] = useState(false);
  const [title, setTitle] = useState("");
  const [excerpt, setExcerpt] = useState("");
  const [contentMd, setContentMd] = useState("");
  const [tags, setTags] = useState("");
  const [status, setStatus] = useState<"DRAFT" | "PUBLISHED">("DRAFT");
  const [preview, setPreview] = useState(false);

  // Load existing post when editing
  const { data: existing, isLoading: loadingExisting } = useQuery({
    queryKey: ["posts", "admin", "one", numericId],
    queryFn: async () => {
      // The admin list returns full PostResponse items; we reuse that to avoid
      // adding another endpoint. For a real CMS you'd add GET /api/posts/admin/{id}.
      const all = await postsApi.listAll(0, 100);
      return all.items.find((p) => p.id === numericId) ?? null;
    },
    enabled: !isNew && numericId != null,
  });

  useEffect(() => {
    if (existing) {
      setSlug(existing.slug);
      setSlugTouched(true);
      setTitle(existing.title);
      setExcerpt(existing.excerpt ?? "");
      setContentMd(existing.contentMd);
      setTags(existing.tags ?? "");
      setStatus(existing.status);
    }
  }, [existing]);

  // Auto-derive slug from title while the user hasn't manually edited it
  useEffect(() => {
    if (isNew && !slugTouched) {
      setSlug(slugify(title));
    }
  }, [title, slugTouched, isNew]);

  const createMutation = useMutation({
    mutationFn: (body: PostWriteRequest) => postsApi.create(body),
    onSuccess: (post) => {
      qc.invalidateQueries({ queryKey: ["posts"] });
      toast.success("Post created.");
      navigate(`/admin/posts/${post.id}`, { replace: true });
    },
    onError: (err) => toast.error((err as Error).message),
  });

  const updateMutation = useMutation({
    mutationFn: (body: PostWriteRequest) => postsApi.update(numericId!, body),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["posts"] });
      toast.success("Saved.");
    },
    onError: (err) => toast.error((err as Error).message),
  });

  const saving = createMutation.isPending || updateMutation.isPending;

  const canSave = useMemo(
    () => slug.trim().length > 0 && title.trim().length > 0 && contentMd.trim().length > 0,
    [slug, title, contentMd],
  );

  const onSave = () => {
    if (!canSave) {
      toast.error("Title, slug, and content are required.");
      return;
    }
    const body: PostWriteRequest = {
      slug: slug.trim(),
      title: title.trim(),
      excerpt: excerpt.trim() || undefined,
      contentMd,
      tags: tags.trim() || undefined,
      status,
    };
    if (isNew) createMutation.mutate(body);
    else updateMutation.mutate(body);
  };

  if (!isNew && loadingExisting) {
    return <p style={{ color: "rgba(226,232,240,0.5)" }}>Loading…</p>;
  }
  if (!isNew && !loadingExisting && !existing) {
    return <p style={{ color: "rgba(226,232,240,0.5)" }}>Post not found.</p>;
  }

  return (
    <div className="flex flex-col gap-6">
      {/* Header */}
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div>
          <span
            className="text-xs tracking-[0.25em] block mb-2"
            style={{ color: "rgba(245,184,32,0.65)" }}
          >
            {isNew ? "NEW POST" : "EDIT POST"}
          </span>
          <h1 className="text-3xl font-semibold" style={{ color: "#f1f5f9" }}>
            {title || "Untitled"}
          </h1>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={() => setPreview((p) => !p)}
            className="inline-flex items-center gap-2 px-3 py-2 rounded-md text-sm font-medium"
            style={{
              border: "1px solid rgba(255,255,255,0.08)",
              color: preview ? "#F5B820" : "rgba(226,232,240,0.7)",
              background: preview ? "rgba(245,184,32,0.06)" : "transparent",
            }}
          >
            <Eye className="w-4 h-4" />
            {preview ? "Editing" : "Preview"}
          </button>
          <button
            onClick={onSave}
            disabled={!canSave || saving}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-md text-sm font-semibold disabled:opacity-60"
            style={{ background: "#F5B820", color: "#1a1205" }}
          >
            {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
            {saving ? "Saving…" : "Save"}
          </button>
        </div>
      </div>

      {/* Meta row */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Field label="TITLE" className="md:col-span-2">
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="w-full rounded-md px-3 py-2 text-base outline-none"
            style={inputStyle}
          />
        </Field>
        <Field label="STATUS">
          <select
            value={status}
            onChange={(e) => setStatus(e.target.value as "DRAFT" | "PUBLISHED")}
            className="w-full rounded-md px-3 py-2 text-sm outline-none"
            style={inputStyle}
          >
            <option value="DRAFT">Draft</option>
            <option value="PUBLISHED">Published</option>
          </select>
        </Field>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Field label="SLUG">
          <input
            type="text"
            value={slug}
            onChange={(e) => {
              setSlug(e.target.value);
              setSlugTouched(true);
            }}
            className="w-full rounded-md px-3 py-2 text-sm outline-none"
            style={inputStyle}
            placeholder="my-first-post"
          />
        </Field>
        <Field label="TAGS (comma-separated)">
          <input
            type="text"
            value={tags}
            onChange={(e) => setTags(e.target.value)}
            className="w-full rounded-md px-3 py-2 text-sm outline-none"
            style={inputStyle}
            placeholder="java, spring-boot"
          />
        </Field>
      </div>

      <Field label="EXCERPT (shown on list page)">
        <textarea
          value={excerpt}
          onChange={(e) => setExcerpt(e.target.value)}
          rows={2}
          className="w-full rounded-md px-3 py-2 text-sm outline-none resize-none"
          style={inputStyle}
          maxLength={500}
        />
      </Field>

      {/* Content: editor OR preview */}
      <Field label="CONTENT (MARKDOWN)">
        {preview ? (
          <div
            className="rounded-md px-4 py-4 min-h-[420px]"
            style={{
              background: "rgba(255,255,255,0.02)",
              border: "1px solid rgba(255,255,255,0.1)",
            }}
          >
            <div
              className="prose prose-invert max-w-none
                         prose-headings:text-slate-100
                         prose-p:text-slate-300
                         prose-a:text-[#F5B820]
                         prose-code:text-[#F5B820]
                         prose-pre:bg-white/5 prose-pre:border prose-pre:border-white/10"
            >
              <ReactMarkdown remarkPlugins={[remarkGfm]}>
                {contentMd || "_Nothing yet._"}
              </ReactMarkdown>
            </div>
          </div>
        ) : (
          <textarea
            value={contentMd}
            onChange={(e) => setContentMd(e.target.value)}
            rows={22}
            className="w-full rounded-md px-4 py-3 text-sm font-mono outline-none"
            style={{ ...inputStyle, lineHeight: 1.6 }}
            placeholder={"# Heading\n\nWrite in markdown…"}
          />
        )}
      </Field>
    </div>
  );
};

const inputStyle: React.CSSProperties = {
  background: "rgba(255,255,255,0.03)",
  border: "1px solid rgba(255,255,255,0.1)",
  color: "#f1f5f9",
};

const Field = ({
  label,
  children,
  className,
}: {
  label: string;
  children: React.ReactNode;
  className?: string;
}) => (
  <label className={`flex flex-col gap-1.5 ${className ?? ""}`}>
    <span className="text-xs tracking-[0.2em]" style={{ color: "rgba(226,232,240,0.55)" }}>
      {label}
    </span>
    {children}
  </label>
);

export default PostEditor;
