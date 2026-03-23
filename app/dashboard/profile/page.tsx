"use client";

import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function ProfileEditorPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState<{ type: "success" | "error", text: string } | null>(null);
  
  const [form, setForm] = useState({
    name: "",
    bio: "",
    avatar: "",
  });

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/auth");
    }
  }, [status, router]);

  useEffect(() => {
    if (status === "authenticated") {
      fetchProfile();
    }
  }, [status]);

  async function fetchProfile() {
    try {
      const res = await fetch("/api/profile");
      if (res.ok) {
        const { data } = await res.json();
        setForm({
          name: data.name || "",
          bio: data.bio || "",
          avatar: data.avatar || "",
        });
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    setMessage(null);

    try {
      const res = await fetch("/api/profile", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });

      if (res.ok) {
        setMessage({ type: "success", text: "Profile updated successfully!" });
      } else {
        const { error } = await res.json();
        setMessage({ type: "error", text: error || "Failed to update profile." });
      }
    } catch (err) {
      setMessage({ type: "error", text: "Something went wrong." });
    } finally {
      setSaving(false);
    }
  }

  if (status === "loading" || loading) {
    return <div className="min-h-screen bg-[#0a0a0a] flex items-center justify-center text-white/40">Loading...</div>;
  }

  return (
    <main className="min-h-screen bg-[#0a0a0a] text-white">
      <header className="border-b border-white/10 px-6 py-4 flex items-center gap-4">
        <Link href="/dashboard" className="text-white/40 hover:text-white transition-colors text-sm">
          ← Back
        </Link>
        <span className="font-bold text-lg">
          Link<span className="text-emerald-400">Snap</span> Profile
        </span>
      </header>

      <div className="max-w-xl mx-auto px-4 py-10">
        <div className="border border-white/10 rounded-2xl p-6 bg-white/5">
          <h2 className="text-lg font-semibold mb-6">Edit Your Profile</h2>

          {message && (
            <div className={`p-4 mb-6 rounded-xl text-sm ${message.type === "success" ? "bg-emerald-500/10 text-emerald-400" : "bg-red-500/10 text-red-400"}`}>
              {message.text}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm text-white/70 mb-2">Display Name</label>
              <input
                type="text"
                required
                className="input w-full"
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
                placeholder="Jane Doe"
              />
            </div>
            
            <div>
              <label className="block text-sm text-white/70 mb-2">Bio</label>
              <textarea
                className="input w-full min-h-[100px] resize-y"
                value={form.bio}
                onChange={(e) => setForm({ ...form, bio: e.target.value })}
                placeholder="A little bit about yourself..."
              />
            </div>

            <div>
              <label className="block text-sm text-white/70 mb-2">Avatar URL</label>
              <input
                type="url"
                className="input w-full"
                value={form.avatar}
                onChange={(e) => setForm({ ...form, avatar: e.target.value })}
                placeholder="https://example.com/avatar.jpg"
              />
            </div>

            <button
              type="submit"
              disabled={saving}
              className="btn-primary w-full mt-6"
            >
              {saving ? "Saving..." : "Save Profile"}
            </button>
          </form>
        </div>
      </div>
    </main>
  );
}