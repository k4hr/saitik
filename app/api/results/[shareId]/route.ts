import { NextRequest, NextResponse } from "next/server";
import { OrderStatus } from "@prisma/client";

import { prisma } from "@/lib/prisma";
import { readObjectFromR2 } from "@/lib/r2";

type RouteContext = {
  params: Promise<{
    shareId: string;
  }>;
};

export async function GET(req: NextRequest, context: RouteContext) {
  try {
    const { shareId } = await context.params;
    const download = req.nextUrl.searchParams.get("download") === "1";

    const order = await prisma.order.findUnique({
      where: { shareId },
      select: {
        status: true,
        assets: {
          where: {
            type: "RESULT",
          },
          orderBy: {
            createdAt: "desc",
          },
          take: 1,
          select: {
            storageKey: true,
            fileName: true,
            mimeType: true,
          },
        },
      },
    });

    if (!order || order.status !== OrderStatus.DONE || order.assets.length === 0) {
      return new NextResponse("Not found", { status: 404 });
    }

    const asset = order.assets[0];

    if (!asset.storageKey) {
      return new NextResponse("Result storage key missing", { status: 500 });
    }

    const file = await readObjectFromR2(asset.storageKey);

    return new NextResponse(file.bytes, {
      headers: {
        "Content-Type": asset.mimeType || file.contentType || "image/png",
        "Cache-Control": "public, max-age=31536000, immutable",
        "Content-Disposition": download
          ? `attachment; filename="${asset.fileName || "result.png"}"`
          : `inline; filename="${asset.fileName || "result.png"}"`,
      },
    });
  } catch (error) {
    console.error("result image route error", error);
    return new NextResponse("Internal error", { status: 500 });
  }
}
