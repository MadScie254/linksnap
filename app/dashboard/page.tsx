"use client";
// app/dashboard/page.tsx
import { useEffect, useState } from "react";
import { useSession, signOut } from "next-auth/react";
import { useRouter } from "next/navigation";
import Link from "next/link";

type LinkItem = { id: string; title: string; url: string; icon?: string; isActive: boolean; order: number };

export default function DashboardPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [links, setLinks] = useState<LinkItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({ title: "", url: "", icon: "" });
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (status === "unauthenticated") router.push("/auth");
  }, [status, router]);

  useEffect(() => {
    if (status === "authenticated") fetchLinks();
  }, [status]);

  async function fetchLinks() {
    const res = await fetch("/api/links");
    const data = await res.json();
    setLinks(data);
    setLoading(false);
  }

  async function addLink(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    await fetch("/api/links", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form),
    });
    setForm({ title: "", url: "", icon: "" });
    setShowForm(false);
    setSaving(false);
    fetchLinks();
  }

  async function toggleActive(link: LinkItem) {
    await fetch(`/api/links/${link.id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ isActive: !link.isActive }),
    });
    fetchLinks();
  }

  async function deleteLink(id: string) {
    if (!confirm("Delete this link?")) return;
    await fetch(`/api/links/${id}`, { method: "DELETE" });
    fetchLinks();
  }

  if (status === "loading" || loading) {
    return <div className="min-h-screen bg-[#0a0a0a] flex items-center justify-center text-white/40">Loading...</div>;
  }

  const username = session?.user?.username;

  return (
    <main className="min-h-screen bg-[#0a0a0a] text-white">
      {/* Header */}
      <header className="border-b border-white/10 px-6 py-4 flex items-center justify-between">
        <span className="font-bold text-lg">
          Link<span className="text-emerald-400">Snap</span>
        </span>
        <div className="flex items-center gap-4">
          <Link href="/dashboard/analytics" className="text-sm text-white/50 hover:text-white transition-colors">
            📊 Analytics
          </Link>
          <a
            href={`/${username}`}
            target="_blank"
            className="text-sm text-white/50 hover:text-white transition-colors"
          >
            🔗 My Page
          </a>
          <button
            onClick={() => signOut({ callbackUrl: "/" })}
            className="text-sm text-white/40 hover:text-white transition-colors"
          >
            Sign out
          </button>
        </div>
      </header>

      <div className="max-w-xl mx-auto px-4 py-10">
        {/* Profile bar */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <p className="text-white/40 text-sm">Your profile link</p>
            <p className="font-mono text-emerald-400 text-sm mt-0.5">
              {process.env.NEXT_PUBLIC_APP_URL}/{username}
            </p>
          </div>
          <a
            href={`/${username}`}
            target="_blank"
            className="bg-emerald-500 hover:bg-emerald-400 text-black text-sm font-semibold px-4 py-2 rounded-full transition-colors"
          >
            View page ↗
          </a>
        </div>

        {/* Links list */}
        <div className="space-y-3 mb-6">
          {links.length === 0 && !showForm && (
            <div className="border border-dashed border-white/20 rounded-xl p-10 text-center text-white/30">
              No links yet. Add your first one below!
            </div>
          )}

          {links.map((link) => (
            <div
              key={link.id}
              className={`border rounded-xl px-4 py-3 flex items-center justify-between gap-4 transition-colors ${
                link.isActive ? "border-white/15 bg-white/5" : "border-white/5 bg-white/2 opacity-50"
              }`}
            >
              <div className="min-w-0">
                <p className="font-medium text-sm truncate">{link.title}</p>
                <p className="text-white/40 text-xs truncate">{link.url}</p>
              </div>
              <div className="flex items-center gap-2 shrink-0">
                <button
                  onClick={() => toggleActive(link)}
                  className={`text-xs px-3 py-1 rounded-full font-medium transition-colors ${
                    link.isActive
                      ? "bg-emerald-500/20 text-emerald-400 hover:bg-emerald-500/30"
                      : "bg-white/10 text-white/40 hover:bg-white/20"
                  }`}
                >
                  {link.isActive ? "Live" : "Off"}
                </button>
                <button
                  onClick={() => deleteLink(link.id)}
                  className="text-white/30 hover:text-red-400 transition-colors text-sm"
                >
                  ✕
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* Add link form */}
        {showForm ? (
          <form onSubmit={addLink} className="border border-emerald-500/30 rounded-xl p-5 space-y-3 bg-emerald-500/5">
            <input
              value={form.title}
              onChange={(e) => setForm({ ...form, title: e.target.value })}
              required
              placeholder="Link title (e.g. My Portfolio)"
              className="input"
            />
            <input
              value={form.url}
              onChange={(e) => setForm({ ...form, url: e.target.value })}
              required
              type="url"
              placeholder="URL (e.g. https://yoursite.com)"
              className="input"
            />
            <div className="flex gap-3">
              <button type="submit" disabled={saving} className="btn-primary flex-1">
                {saving ? "Adding..." : "Add link"}
              </button>
              <button
                type="button"
                onClick={() => setShowForm(false)}
                className="px-4 py-3 rounded-xl border border-white/20 text-white/50 hover:text-white transition-colors"
              >
                Cancel
              </button>
            </div>
          </form>
        ) : (
          <button
            onClick={() => setShowForm(true)}
            className="w-full border border-dashed border-white/20 hover:border-emerald-500/50 text-white/40 hover:text-emerald-400 rounded-xl py-4 text-sm font-medium transition-colors"
          >
            + Add new link
          </button>
        )}
      </div>
    </main>
  );
}
