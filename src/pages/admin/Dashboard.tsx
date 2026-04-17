import { useMemo, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import {
  Bar,
  BarChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { analyticsApi } from "@/lib/api";

const formatMs = (ms: number | null | undefined): string => {
  if (ms == null) return "—";
  if (ms < 1000) return `${Math.round(ms)}ms`;
  const s = ms / 1000;
  if (s < 60) return `${s.toFixed(1)}s`;
  return `${Math.floor(s / 60)}m ${Math.round(s % 60)}s`;
};

const Dashboard = () => {
  const [days, setDays] = useState<number>(30);

  const { data, isLoading, isError, refetch, isFetching } = useQuery({
    queryKey: ["analytics", "summary", days],
    queryFn: () => analyticsApi.summary(days),
    staleTime: 30_000,
  });

  const chartData = useMemo(() => {
    if (!data) return [];
    return data.topPaths.slice(0, 10).map((p) => ({
      // Trim long paths for readability but keep full in tooltip
      path: p.path.length > 28 ? `…${p.path.slice(-26)}` : p.path,
      fullPath: p.path,
      views: p.views,
    }));
  }, [data]);

  return (
    <div className="flex flex-col gap-8">
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div>
          <span
            className="text-xs tracking-[0.25em] block mb-2"
            style={{ color: "rgba(245,184,32,0.65)" }}
          >
            DASHBOARD
          </span>
          <h1 className="text-3xl font-semibold" style={{ color: "#f1f5f9" }}>
            Traffic summary
          </h1>
        </div>

        <div className="flex items-center gap-2">
          {[7, 30, 90].map((d) => (
            <button
              key={d}
              onClick={() => setDays(d)}
              className="px-3 py-1.5 rounded-md text-sm font-medium transition-colors"
              style={{
                background: days === d ? "rgba(245,184,32,0.08)" : "transparent",
                border: `1px solid ${days === d ? "rgba(245,184,32,0.35)" : "rgba(255,255,255,0.08)"}`,
                color: days === d ? "#F5B820" : "rgba(226,232,240,0.6)",
              }}
            >
              {d}d
            </button>
          ))}
          <button
            onClick={() => refetch()}
            disabled={isFetching}
            className="px-3 py-1.5 rounded-md text-sm font-medium disabled:opacity-60"
            style={{
              border: "1px solid rgba(255,255,255,0.08)",
              color: "rgba(226,232,240,0.6)",
            }}
          >
            {isFetching ? "Refreshing…" : "Refresh"}
          </button>
        </div>
      </div>

      {isError && (
        <Card>
          <p style={{ color: "rgba(226,232,240,0.6)" }}>
            Couldn't load analytics. The backend may be waking up (cold start on free tier).
          </p>
        </Card>
      )}

      {/* Top stats */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <Stat label="Total views" value={isLoading ? "…" : data?.totalViews.toLocaleString() ?? "0"} />
        <Stat label="Avg dwell" value={isLoading ? "…" : formatMs(data?.avgDwellMs)} />
        <Stat label="Window" value={`${days} days`} />
      </div>

      {/* Top paths chart */}
      <Card title="Top paths">
        {isLoading ? (
          <div
            className="h-64 rounded"
            style={{ background: "rgba(255,255,255,0.02)" }}
            aria-hidden
          />
        ) : chartData.length === 0 ? (
          <p style={{ color: "rgba(226,232,240,0.5)" }}>No pageviews recorded yet.</p>
        ) : (
          <div style={{ width: "100%", height: 320 }}>
            <ResponsiveContainer>
              <BarChart data={chartData} layout="vertical" margin={{ left: 8, right: 24 }}>
                <CartesianGrid stroke="rgba(255,255,255,0.06)" horizontal={false} />
                <XAxis
                  type="number"
                  stroke="rgba(226,232,240,0.5)"
                  tick={{ fontSize: 11 }}
                />
                <YAxis
                  dataKey="path"
                  type="category"
                  width={220}
                  stroke="rgba(226,232,240,0.5)"
                  tick={{ fontSize: 11 }}
                />
                <Tooltip
                  contentStyle={{
                    background: "rgba(4,4,11,0.95)",
                    border: "1px solid rgba(255,255,255,0.1)",
                    borderRadius: 8,
                    color: "#e2e8f0",
                  }}
                  labelFormatter={(_label, payload) => {
                    const p = payload?.[0]?.payload as { fullPath?: string } | undefined;
                    return p?.fullPath ?? "";
                  }}
                />
                <Bar dataKey="views" fill="#F5B820" radius={[0, 4, 4, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        )}
      </Card>

      {/* Referrers */}
      <Card title="Top referrers">
        {isLoading ? (
          <div
            className="h-32 rounded"
            style={{ background: "rgba(255,255,255,0.02)" }}
            aria-hidden
          />
        ) : !data || data.topReferrers.length === 0 ? (
          <p style={{ color: "rgba(226,232,240,0.5)" }}>No referrers recorded yet.</p>
        ) : (
          <ul className="flex flex-col">
            {data.topReferrers.slice(0, 10).map((r) => (
              <li
                key={r.path}
                className="flex items-center justify-between py-2"
                style={{ borderBottom: "1px solid rgba(255,255,255,0.04)" }}
              >
                <span
                  className="text-sm truncate mr-4"
                  style={{ color: "rgba(226,232,240,0.7)" }}
                  title={r.path}
                >
                  {r.path}
                </span>
                <span className="text-sm font-medium" style={{ color: "#F5B820" }}>
                  {r.views}
                </span>
              </li>
            ))}
          </ul>
        )}
      </Card>
    </div>
  );
};

const Stat = ({ label, value }: { label: string; value: string }) => (
  <div
    className="rounded-2xl p-5"
    style={{
      background: "rgba(255,255,255,0.02)",
      border: "1px solid rgba(255,255,255,0.06)",
    }}
  >
    <div className="text-xs tracking-[0.2em] mb-2" style={{ color: "rgba(226,232,240,0.5)" }}>
      {label.toUpperCase()}
    </div>
    <div className="text-3xl font-semibold" style={{ color: "#f1f5f9" }}>
      {value}
    </div>
  </div>
);

const Card = ({ title, children }: { title?: string; children: React.ReactNode }) => (
  <section
    className="rounded-2xl p-6"
    style={{
      background: "rgba(255,255,255,0.02)",
      border: "1px solid rgba(255,255,255,0.06)",
    }}
  >
    {title && (
      <h2
        className="text-sm tracking-[0.2em] mb-4"
        style={{ color: "rgba(226,232,240,0.6)" }}
      >
        {title.toUpperCase()}
      </h2>
    )}
    {children}
  </section>
);

export default Dashboard;
