import { NextRequest, NextResponse } from "next/server";

import { getSession } from "@/lib/auth";
import { buildR2Key, getSignedUploadUrl } from "@/lib/r2";

type UploadKind = "face" | "reference" | "edit-source";

type RequestBody = {
  fileName?: string;
  contentType?: string;
  kind?: UploadKind;
};

const ALLOWED_TYPES = new Set([
  "image/jpeg",
  "image/png",
  "image/webp",
]);

export async function POST(req: NextRequest) {
  try {
    const session = await getSession();

    if (!session) {
      return NextResponse.json({ error: "Неавторизован" }, { status: 401 });
    }

    const body = (await req.json()) as RequestBody;
    const fileName = body.fileName?.trim() || "image.jpg";
    const contentType = body.contentType?.trim() || "image/jpeg";
    const kind = body.kind || "face";

    if (!ALLOWED_TYPES.has(contentType)) {
      return NextResponse.json(
        { error: "Разрешены только JPG, PNG, WEBP" },
        { status: 400 },
      );
    }

    if (!["face", "reference", "edit-source"].includes(kind)) {
      return NextResponse.json(
        { error: "Некорректный kind загрузки" },
        { status: 400 },
      );
    }

    const key = buildR2Key({
      userId: session.userId,
      kind,
      fileName,
    });

    const signedUrl = await getSignedUploadUrl({
      key,
      contentType,
    });

    return NextResponse.json({
      ok: true,
      signedUrl,
      key,
    });
  } catch (error) {
    console.error("sign upload error", error);

    return NextResponse.json(
      { error: "Не удалось создать signed upload url" },
      { status: 500 },
    );
  }
}
