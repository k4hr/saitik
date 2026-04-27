import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  const sourceUrl = req.nextUrl;
  const targetUrl = new URL("/auth/vk/callback", sourceUrl.origin);

  sourceUrl.searchParams.forEach((value, key) => {
    targetUrl.searchParams.set(key, value);
  });

  return NextResponse.redirect(targetUrl);
}
