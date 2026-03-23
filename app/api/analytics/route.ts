// app/api/analytics/route.ts
import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "../auth/[...nextauth]/route";
import { prisma } from "@/lib/prisma";

export async function GET() {
  const session = await getServerSession(authOptions);
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const userId = session.user.id;

  // Last 30 days
  const since = new Date();
  since.setDate(since.getDate() - 30);

  const [links, clicks, pageViews] = await Promise.all([
    prisma.link.findMany({
      where: { userId },
      include: {
        _count: { select: { clicks: true } },
        clicks: {
          where: { createdAt: { gte: since } },
          select: { device: true, browser: true, createdAt: true },
        },
      },
      orderBy: { order: "asc" },
    }),
    prisma.click.findMany({
      where: { link: { userId }, createdAt: { gte: since } },
      select: { createdAt: true, device: true },
      orderBy: { createdAt: "asc" },
    }),
    prisma.pageView.findMany({
      where: { userId, createdAt: { gte: since } },
      select: { createdAt: true, device: true },
      orderBy: { createdAt: "asc" },
    }),
  ]);

  // Clicks per day (last 30 days)
  const clicksByDay: Record<string, number> = {};
  clicks.forEach((c) => {
    const day = c.createdAt.toISOString().split("T")[0];
    clicksByDay[day] = (clicksByDay[day] || 0) + 1;
  });

  // Device breakdown
  const deviceBreakdown: Record<string, number> = {};
  [...clicks, ...pageViews].forEach((item) => {
    const d = item.device || "desktop";
    deviceBreakdown[d] = (deviceBreakdown[d] || 0) + 1;
  });

  // Top links
  const topLinks = links
    .map((l) => ({ id: l.id, title: l.title, url: l.url, clicks: l._count.clicks }))
    .sort((a, b) => b.clicks - a.clicks)
    .slice(0, 5);

  return NextResponse.json({
    totalClicks: clicks.length,
    totalViews: pageViews.length,
    clicksByDay: Object.entries(clicksByDay).map(([date, count]) => ({ date, count })),
    deviceBreakdown: Object.entries(deviceBreakdown).map(([device, count]) => ({ device, count })),
    topLinks,
  });
}
