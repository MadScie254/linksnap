// app/[username]/page.tsx
import { prisma } from "@/lib/prisma";
import { notFound } from "next/navigation";
import TrackView from "./TrackView";

export async function generateMetadata({ params }: { params: { username: string } }) {
  const user = await prisma.user.findUnique({ where: { username: params.username } });
  if (!user) return { title: "Not Found" };
  return { title: `${user.name} | LinkSnap`, description: user.bio || `Check out ${user.name}'s links` };
}

export default async function ProfilePage({ params }: { params: { username: string } }) {
  const user = await prisma.user.findUnique({
    where: { username: params.username },
    include: {
      links: {
        where: { isActive: true },
        orderBy: { order: "asc" },
      },
    },
  });

  if (!user) notFound();

  return (
    <main className="min-h-screen bg-[#0a0a0a] text-white flex flex-col items-center px-4 py-16">
      {/* Track page view */}
      <TrackView userId={user.id} />

      {/* Avatar */}
      <div className="w-20 h-20 rounded-full bg-emerald-500/20 border-2 border-emerald-500/40 flex items-center justify-center text-3xl font-black text-emerald-400 mb-4">
        {user.avatar ? (
          <img src={user.avatar} alt={user.name} className="w-full h-full rounded-full object-cover" />
        ) : (
          user.name.charAt(0).toUpperCase()
        )}
      </div>

      {/* Name & bio */}
      <h1 className="text-xl font-bold mb-1">{user.name}</h1>
      {user.bio && <p className="text-white/50 text-sm mb-8 text-center max-w-xs">{user.bio}</p>}
      {!user.bio && <div className="mb-8" />}

      {/* Links */}
      <div className="w-full max-w-sm space-y-3">
        {user.links.length === 0 && (
          <p className="text-center text-white/30 text-sm py-8">No links added yet</p>
        )}
        {user.links.map((link) => (
          <a
            key={link.id}
            href={`/api/redirect?id=${link.id}`}
            target="_blank"
            rel="noopener noreferrer"
            className="block w-full border border-white/15 hover:border-emerald-500/50 bg-white/5 hover:bg-emerald-500/10 rounded-xl px-5 py-4 text-center font-medium text-sm transition-all duration-200 hover:scale-[1.02]"
          >
            {link.icon && <span className="mr-2">{link.icon}</span>}
            {link.title}
          </a>
        ))}
      </div>

      {/* Footer */}
      <p className="mt-16 text-white/20 text-xs">
        Powered by <span className="text-emerald-400/50">LinkSnap</span>
      </p>
    </main>
  );
}
