"use client";
// app/auth/page.tsx
import { useState, useEffect } from "react";
import { signIn } from "next-auth/react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";

export default function AuthPage() {
  const searchParams = useSearchParams();
  const [tab, setTab] = useState<"login" | "register">("login");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const router = useRouter();

  useEffect(() => {
    if (searchParams.get("tab") === "register") setTab("register");
  }, [searchParams]);

  async function handleLogin(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);
    setError("");
    const form = new FormData(e.currentTarget);
    const result = await signIn("credentials", {
      email: form.get("email"),
      password: form.get("password"),
      redirect: false,
    });
    if (result?.error) {
      setError("Invalid email or password");
      setLoading(false);
    } else {
      router.push("/dashboard");
    }
  }

  async function handleRegister(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);
    setError("");
    const form = new FormData(e.currentTarget);
    const res = await fetch("/api/register", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        name: form.get("name"),
        email: form.get("email"),
        password: form.get("password"),
        username: form.get("username"),
      }),
    });
    const data = await res.json();
    if (!res.ok) {
      setError(data.error);
      setLoading(false);
    } else {
      await signIn("credentials", {
        email: form.get("email"),
        password: form.get("password"),
        redirect: false,
      });
      router.push("/dashboard");
    }
  }

  return (
    <main className="min-h-screen bg-[#0a0a0a] text-white flex flex-col items-center justify-center px-4">
      <Link href="/" className="text-xl font-bold tracking-tight mb-10">
        Link<span className="text-emerald-400">Snap</span>
      </Link>

      <div className="w-full max-w-sm bg-white/5 border border-white/10 rounded-2xl p-8">
        {/* Tabs */}
        <div className="flex mb-6 bg-white/10 rounded-full p-1">
          {(["login", "register"] as const).map((t) => (
            <button
              key={t}
              onClick={() => { setTab(t); setError(""); }}
              className={`flex-1 py-2 rounded-full text-sm font-semibold capitalize transition-colors ${
                tab === t ? "bg-emerald-500 text-black" : "text-white/50 hover:text-white"
              }`}
            >
              {t === "login" ? "Log in" : "Sign up"}
            </button>
          ))}
        </div>

        {error && (
          <p className="text-red-400 text-sm mb-4 text-center">{error}</p>
        )}

        {tab === "login" ? (
          <form onSubmit={handleLogin} className="flex flex-col gap-4">
            <input name="email" type="email" required placeholder="Email" className="input" />
            <input name="password" type="password" required placeholder="Password" className="input" />
            <button type="submit" disabled={loading} className="btn-primary">
              {loading ? "Logging in..." : "Log in"}
            </button>
          </form>
        ) : (
          <form onSubmit={handleRegister} className="flex flex-col gap-4">
            <input name="name" type="text" required placeholder="Full name" className="input" />
            <input name="username" type="text" required placeholder="Username (e.g. johndoe)" className="input" />
            <input name="email" type="email" required placeholder="Email" className="input" />
            <input name="password" type="password" required minLength={6} placeholder="Password (min 6 chars)" className="input" />
            <button type="submit" disabled={loading} className="btn-primary">
              {loading ? "Creating account..." : "Create account"}
            </button>
          </form>
        )}
      </div>
    </main>
  );
}
