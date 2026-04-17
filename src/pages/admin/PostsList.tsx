import { useQuery, useQueryClient, useMutation } from "@tanstack/react-query";
import { Link } from "react-router-dom";
import { Edit2, ExternalLink, Plus, Trash2 } from "lucide-react";
import { toast } from "sonner";
import { postsApi, type PostResponse } from "@/lib/api";

const formatDate = (iso: string | null) => {
  if (!iso) return "—";
  try {
    return new Date(iso).toLocaleString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  } catch {
    return "—";
  }
};

const PostsList = () => {
  const qc = useQueryClient();

  const { data, isLoading, isError, refetch } = useQuery({
    queryKey: ["posts", "admin", 0, 50],
    queryFn: () => postsApi.listAll(0, 50),
  });

  const deleteMutation = useMutation({
    mutationFn: (id: number) => postsApi.remove(id),
    onSuccess: () => {
      toast.success("Post deleted.");
      qc.invalidateQueries({ queryKey: ["posts"] });
    },
    onError: (err) => toast.error((err as Error).message),
  });

  const onDelete = (p: PostResponse) => {
    if (!window.confirm(`Delete "${p.title}"? This can't be undone.`)) return;
    deleteMutation.mutate(p.id);
  };

  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div>
          <span
            className="text-xs tracking-[0.25em] block mb-2"
            style={{ color: "rgba(245,184,32,0.65)" }}
          >
            POSTS
          </span>
          <h1 className="text-3xl font-semibold" style={{ color: "#f1f5f9" }}>
            All posts
          </h1>
        </div>

        <Link
          to="/admin/posts/new"
          className="inline-flex items-center gap-2 px-4 py-2 rounded-md text-sm font-semibold"
          style={{
            background: "#F5B820",
            color: "#1a1205",
          }}
        >
          <Plus className="w-4 h-4" />
          New post
        </Link>
      </div>

      {isError && (
        <div
          className="rounded-xl p-5"
          style={{ background: "rgba(255,50,50,0.06)", border: "1px solid rgba(255,80,80,0.2)" }}
        >
          <p style={{ color: "#fca5a5" }}>Couldn't load posts.</p>
          <button
            onClick={() => refetch()}
            className="mt-2 text-sm underline"
            style={{ color: "#F5B820" }}
          >
            Try again
          </button>
        </div>
      )}

      {isLoading && (
        <div
          className="rounded-xl p-8 text-center"
          style={{
            background: "rgba(255,255,255,0.02)",
            border: "1px solid rgba(255,255,255,0.06)",
          }}
        >
          <p style={{ color: "rgba(226,232,240,0.5)" }}>Loading…</p>
        </div>
      )}

      {!isLoading && data && data.items.length === 0 && (
        <div
          className="rounded-xl p-10 text-center"
          style={{
            background: "rgba(255,255,255,0.02)",
            border: "1px dashed rgba(255,255,255,0.12)",
          }}
        >
          <p className="text-lg font-medium mb-2" style={{ color: "#f1f5f9" }}>
            No posts yet
          </p>
          <p style={{ color: "rgba(226,232,240,0.5)" }}>Create your first writing.</p>
        </div>
      )}

      {!isLoading && data && data.items.length > 0 && (
        <div
          className="rounded-xl overflow-hidden"
          style={{
            background: "rgba(255,255,255,0.02)",
            border: "1px solid rgba(255,255,255,0.06)",
          }}
        >
          <table className="w-full text-sm">
            <thead>
              <tr style={{ borderBottom: "1px solid rgba(255,255,255,0.06)" }}>
                <th className="text-left font-medium px-4 py-3" style={{ color: "rgba(226,232,240,0.5)" }}>
                  Title
                </th>
                <th className="text-left font-medium px-4 py-3 hidden md:table-cell" style={{ color: "rgba(226,232,240,0.5)" }}>
                  Slug
                </th>
                <th className="text-left font-medium px-4 py-3" style={{ color: "rgba(226,232,240,0.5)" }}>
                  Status
                </th>
                <th className="text-left font-medium px-4 py-3 hidden sm:table-cell" style={{ color: "rgba(226,232,240,0.5)" }}>
                  Published
                </th>
                <th className="px-4 py-3" />
              </tr>
            </thead>
            <tbody>
              {data.items.map((p) => (
                <tr
                  key={p.id}
                  style={{ borderBottom: "1px solid rgba(255,255,255,0.04)" }}
                >
                  <td className="px-4 py-3" style={{ color: "#f1f5f9" }}>
                    {p.title}
                  </td>
                  <td className="px-4 py-3 hidden md:table-cell" style={{ color: "rgba(226,232,240,0.55)" }}>
                    <code className="text-xs">{p.slug}</code>
                  </td>
                  <td className="px-4 py-3">
                    <StatusChip status={p.status} />
                  </td>
                  <td className="px-4 py-3 hidden sm:table-cell" style={{ color: "rgba(226,232,240,0.55)" }}>
                    {formatDate(p.publishedAt)}
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex items-center justify-end gap-1">
                      {p.status === "PUBLISHED" && (
                        <Link
                          to={`/writings/${encodeURIComponent(p.slug)}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="p-2 rounded-md transition-colors"
                          style={{ color: "rgba(226,232,240,0.55)" }}
                          title="Open public page"
                        >
                          <ExternalLink className="w-4 h-4" />
                        </Link>
                      )}
                      <Link
                        to={`/admin/posts/${p.id}`}
                        className="p-2 rounded-md transition-colors"
                        style={{ color: "rgba(226,232,240,0.7)" }}
                        title="Edit"
                      >
                        <Edit2 className="w-4 h-4" />
                      </Link>
                      <button
                        onClick={() => onDelete(p)}
                        disabled={deleteMutation.isPending}
                        className="p-2 rounded-md transition-colors disabled:opacity-40"
                        style={{ color: "rgba(255,120,120,0.7)" }}
                        title="Delete"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

const StatusChip = ({ status }: { status: "DRAFT" | "PUBLISHED" }) => {
  const published = status === "PUBLISHED";
  return (
    <span
      className="inline-block px-2 py-0.5 rounded text-xs font-medium"
      style={{
        background: published ? "rgba(34,197,94,0.12)" : "rgba(226,232,240,0.08)",
        color: published ? "#86efac" : "rgba(226,232,240,0.6)",
        border: `1px solid ${published ? "rgba(34,197,94,0.25)" : "rgba(255,255,255,0.08)"}`,
      }}
    >
      {status}
    </span>
  );
};

export default PostsList;
