"use client";
// app/dashboard/analytics/page.tsx
import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import {
  LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer,
  PieChart, Pie, Cell, Legend,
} from "recharts";

type Analytics = {
  totalClicks: number;
  totalViews: number;
  clicksByDay: { date: string; count: number }[];
  deviceBreakdown: { device: string; count: number }[];
  topLinks: { id: string; title: string; url: string; clicks: number }[];
};

const COLORS = ["#34d399", "#60a5fa", "#f472b6", "#facc15", "#a78bfa"];

export default function AnalyticsPage() {
  const { status } = useSession();
  const router = useRouter();
  const [data, setData] = useState<Analytics | null>(null);

  useEffect(() => {
    if (status === "unauthenticated") router.push("/auth");
    if (status === "authenticated") {
      fetch("/api/analytics")
        .then((r) => r.json())
        .then(setData);
    }
  }, [status, router]);

  if (!data) {
    return (
      <div className="min-h-screen bg-[#0a0a0a] flex items-center justify-center text-white/40">
        Loading analytics...
      </div>
    );
  }

  return (
    <main className="min-h-screen bg-[#0a0a0a] text-white">
      <header className="border-b border-white/10 px-6 py-4 flex items-center gap-4">
        <Link href="/dashboard" className="text-white/40 hover:text-white transition-colors text-sm">
          ← Back
        </Link>
        <span className="font-bold text-lg">
          Link<span className="text-emerald-400">Snap</span> Analytics
        </span>
        <span className="text-white/30 text-xs ml-auto">Last 30 days</span>
      </header>

      <div className="max-w-4xl mx-auto px-4 py-10 space-y-8">
        {/* Stat cards */}
        <div className="grid grid-cols-2 gap-4">
          {[
            { label: "Total Clicks", value: data.totalClicks },
            { label: "Profile Views", value: data.totalViews },
          ].map((s) => (
            <div key={s.label} className="border border-white/10 rounded-2xl p-6 bg-white/5">
              <p className="text-white/40 text-sm mb-1">{s.label}</p>
              <p className="text-4xl font-black text-emerald-400">{s.value}</p>
            </div>
          ))}
        </div>

        {/* Clicks over time */}
        <div className="border border-white/10 rounded-2xl p-6 bg-white/5">
          <h2 className="font-semibold mb-6 text-white/70">Clicks over time</h2>
          {data.clicksByDay.length === 0 ? (
            <p className="text-white/30 text-sm text-center py-8">No click data yet</p>
          ) : (
            <ResponsiveContainer width="100%" height={200}>
              <LineChart data={data.clicksByDay}>
                <XAxis dataKey="date" tick={{ fill: "#ffffff40", fontSize: 11 }} />
                <YAxis tick={{ fill: "#ffffff40", fontSize: 11 }} />
                <Tooltip
                  contentStyle={{ background: "#111", border: "1px solid #ffffff20", borderRadius: 8 }}
                  labelStyle={{ color: "#fff" }}
                />
                <Line type="monotone" dataKey="count" stroke="#34d399" strokeWidth={2} dot={false} />
              </LineChart>
            </ResponsiveContainer>
          )}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Device breakdown */}
          <div className="border border-white/10 rounded-2xl p-6 bg-white/5">
            <h2 className="font-semibold mb-4 text-white/70">Device breakdown</h2>
            {data.deviceBreakdown.length === 0 ? (
              <p className="text-white/30 text-sm text-center py-8">No data yet</p>
            ) : (
              <ResponsiveContainer width="100%" height={180}>
                <PieChart>
                  <Pie data={data.deviceBreakdown} dataKey="count" nameKey="device" cx="50%" cy="50%" outerRadius={70}>
                    {data.deviceBreakdown.map((_, i) => (
                      <Cell key={i} fill={COLORS[i % COLORS.length]} />
                    ))}
                  </Pie>
                  <Legend formatter={(v) => <span style={{ color: "#ffffff80", fontSize: 12 }}>{v}</span>} />
                  <Tooltip contentStyle={{ background: "#111", border: "1px solid #ffffff20", borderRadius: 8 }} />
                </PieChart>
              </ResponsiveContainer>
            )}
          </div>

          {/* Top links */}
          <div className="border border-white/10 rounded-2xl p-6 bg-white/5">
            <h2 className="font-semibold mb-4 text-white/70">Top links</h2>
            {data.topLinks.length === 0 ? (
              <p className="text-white/30 text-sm text-center py-8">No clicks yet</p>
            ) : (
              <div className="space-y-3">
                {data.topLinks.map((link, i) => (
                  <div key={link.id} className="flex items-center gap-3">
                    <span className="text-white/20 text-xs w-4">{i + 1}</span>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium truncate">{link.title}</p>
                    </div>
                    <span className="text-emerald-400 font-bold text-sm shrink-0">
                      {link.clicks} clicks
                    </span>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </main>
  );
}
