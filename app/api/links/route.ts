// app/api/links/route.ts
import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "../auth/[...nextauth]/route";
import { prisma } from "@/lib/prisma";

// GET all links for logged-in user
export async function GET() {
  const session = await getServerSession(authOptions);
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const links = await prisma.link.findMany({
    where: { userId: session.user.id },
    orderBy: { order: "asc" },
  });

  return NextResponse.json(links);
}

// POST create a new link
export async function POST(req: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { title, url, icon } = await req.json();

  if (!title || !url) {
    return NextResponse.json({ error: "Title and URL required" }, { status: 400 });
  }

  // Get current max order
  const maxOrder = await prisma.link.aggregate({
    where: { userId: session.user.id },
    _max: { order: true },
  });

  const link = await prisma.link.create({
    data: {
      userId: session.user.id,
      title,
      url,
      icon: icon || null,
      order: (maxOrder._max.order ?? -1) + 1,
    },
  });

  return NextResponse.json(link, { status: 201 });
}

// PUT reorder links
export async function PUT(req: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { orderedIds } = await req.json(); // array of link IDs in new order

  const updates = orderedIds.map((id: string, index: number) =>
    prisma.link.updateMany({
      where: { id, userId: session.user.id },
      data: { order: index },
    })
  );

  await prisma.$transaction(updates);
  return NextResponse.json({ success: true });
}
