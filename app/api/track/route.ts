// app/api/track/route.ts
import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { UAParser } from "ua-parser-js";

export async function POST(req: NextRequest) {
  try {
    const { linkId, userId } = await req.json();
    const ua = req.headers.get("user-agent") || "";
    const ip = req.headers.get("x-forwarded-for")?.split(",")[0] || "unknown";

    const parser = new UAParser(ua);
    const result = parser.getResult();

    const device = result.device.type || "desktop";
    const browser = result.browser.name || "unknown";
    const os = result.os.name || "unknown";

    // Track click
    if (linkId) {
      await prisma.click.create({
        data: { linkId, device, browser, os, ip },
      });
    }

    // Track page view
    if (userId) {
      await prisma.pageView.create({
        data: { userId, device, browser, ip },
      });
    }

    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json({ error: "Tracking failed" }, { status: 500 });
  }
}
