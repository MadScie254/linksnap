// app/api/redirect/route.ts
import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { UAParser } from "ua-parser-js";

export async function GET(req: NextRequest) {
  const linkId = req.nextUrl.searchParams.get("id");
  if (!linkId) return NextResponse.redirect(new URL("/", req.url));

  const link = await prisma.link.findUnique({ where: { id: linkId } });
  if (!link) return NextResponse.redirect(new URL("/", req.url));

  // Track click async (don't block redirect)
  const ua = req.headers.get("user-agent") || "";
  const ip = req.headers.get("x-forwarded-for")?.split(",")[0] || "unknown";
  const parser = new UAParser(ua);
  const result = parser.getResult();

  prisma.click.create({
    data: {
      linkId,
      device: result.device.type || "desktop",
      browser: result.browser.name || "unknown",
      os: result.os.name || "unknown",
      ip,
    },
  }).catch(() => {});

  return NextResponse.redirect(link.url);
}
