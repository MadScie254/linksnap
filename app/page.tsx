// app/page.tsx
import Link from "next/link";

export default function LandingPage() {
  return (
    <main className="min-h-screen bg-[#0a0a0a] text-white font-sans">
      {/* Nav */}
      <nav className="flex items-center justify-between px-8 py-5 border-b border-white/10">
        <span className="text-xl font-bold tracking-tight">
          Link<span className="text-emerald-400">Snap</span>
        </span>
        <div className="flex gap-4">
          <Link href="/auth" className="text-sm text-white/60 hover:text-white transition-colors">
            Log in
          </Link>
          <Link
            href="/auth?tab=register"
            className="text-sm bg-emerald-500 hover:bg-emerald-400 text-black font-semibold px-4 py-2 rounded-full transition-colors"
          >
            Get started free
          </Link>
        </div>
      </nav>

      {/* Hero */}
      <section className="max-w-4xl mx-auto px-8 py-32 text-center">
        <h1 className="text-6xl font-black tracking-tight leading-none mb-6">
          One link.
          <br />
          <span className="text-emerald-400">All of you.</span>
        </h1>
        <p className="text-xl text-white/50 mb-10 max-w-xl mx-auto">
          Create your personal link hub in seconds. Share it everywhere. Track every click with
          real-time analytics.
        </p>
        <Link
          href="/auth?tab=register"
          className="inline-block bg-emerald-500 hover:bg-emerald-400 text-black font-bold px-8 py-4 rounded-full text-lg transition-colors"
        >
          Create your LinkSnap — it&apos;s free
        </Link>
      </section>

      {/* Features */}
      <section className="max-w-5xl mx-auto px-8 py-16 grid grid-cols-1 md:grid-cols-3 gap-6">
        {[
          { icon: "🔗", title: "One link for everything", desc: "Portfolio, socials, shop, Linktree — all in one clean page." },
          { icon: "📊", title: "Real-time analytics", desc: "See who clicked, from what device, and when. Every link tracked." },
          { icon: "🎨", title: "Yours to customize", desc: "Themes, bio, avatar. Make it look like you, not a template." },
        ].map((f) => (
          <div key={f.title} className="border border-white/10 rounded-2xl p-6 bg-white/5">
            <div className="text-3xl mb-3">{f.icon}</div>
            <h3 className="font-bold text-lg mb-2">{f.title}</h3>
            <p className="text-white/50 text-sm">{f.desc}</p>
          </div>
        ))}
      </section>

      {/* Footer */}
      <footer className="text-center py-8 text-white/20 text-sm border-t border-white/10 mt-16">
        Built with Next.js + PostgreSQL · LinkSnap
      </footer>
    </main>
  );
}
