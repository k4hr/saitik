import { NextRequest, NextResponse } from "next/server";

import { getSession } from "@/lib/auth";
import { buildR2Key, getSignedUploadUrl } from "@/lib/r2";
import {
  getRequestIp,
  getThrottleState,
  registerThrottleFailure,
} from "@/lib/auth-throttle";

type UploadKind = "face" | "reference" | "edit-source";

type RequestBody = {
  fileName?: string;
  contentType?: string;
  kind?: UploadKind;
  fileSize?: number;
};

const ALLOWED_TYPES = new Set([
  "image/jpeg",
  "image/png",
  "image/webp",
]);

const MAX_FILE_SIZE_BY_KIND: Record<UploadKind, number> = {
  face: 10 * 1024 * 1024,
  reference: 15 * 1024 * 1024,
  "edit-source": 15 * 1024 * 1024,
};

const UPLOAD_SIGN_MAX_ATTEMPTS_IP = 40;
const UPLOAD_SIGN_MAX_ATTEMPTS_USER = 30;
const UPLOAD_SIGN_WINDOW_MS = 10 * 60 * 1000;
const UPLOAD_SIGN_BLOCK_MS = 15 * 60 * 1000;

export async function POST(req: NextRequest) {
  try {
    const session = await getSession();

    if (!session) {
      return NextResponse.json({ error: "Неавторизован" }, { status: 401 });
    }

    const ip = getRequestIp(req.headers);

    const [ipState, userState] = await Promise.all([
      getThrottleState({
        scope: "upload-sign-ip",
        key: ip,
        maxAttempts: UPLOAD_SIGN_MAX_ATTEMPTS_IP,
        windowMs: UPLOAD_SIGN_WINDOW_MS,
        blockMs: UPLOAD_SIGN_BLOCK_MS,
      }),
      getThrottleState({
        scope: "upload-sign-user",
        key: session.userId,
        maxAttempts: UPLOAD_SIGN_MAX_ATTEMPTS_USER,
        windowMs: UPLOAD_SIGN_WINDOW_MS,
        blockMs: UPLOAD_SIGN_BLOCK_MS,
      }),
    ]);

    if (ipState.isBlocked || userState.isBlocked) {
      return NextResponse.json(
        { error: "Слишком много запросов на загрузку. Попробуйте позже." },
        { status: 429 },
      );
    }

    const body = (await req.json()) as RequestBody;
    const fileName = body.fileName?.trim() || "image.jpg";
    const contentType = body.contentType?.trim() || "image/jpeg";
    const kind = body.kind || "face";
    const fileSize = Number(body.fileSize ?? 0);

    if (!ALLOWED_TYPES.has(contentType)) {
      await Promise.all([
        registerThrottleFailure({
          scope: "upload-sign-ip",
          key: ip,
          maxAttempts: UPLOAD_SIGN_MAX_ATTEMPTS_IP,
          windowMs: UPLOAD_SIGN_WINDOW_MS,
          blockMs: UPLOAD_SIGN_BLOCK_MS,
        }),
        registerThrottleFailure({
          scope: "upload-sign-user",
          key: session.userId,
          maxAttempts: UPLOAD_SIGN_MAX_ATTEMPTS_USER,
          windowMs: UPLOAD_SIGN_WINDOW_MS,
          blockMs: UPLOAD_SIGN_BLOCK_MS,
        }),
      ]);

      return NextResponse.json(
        { error: "Разрешены только JPG, PNG, WEBP" },
        { status: 400 },
      );
    }

    if (!["face", "reference", "edit-source"].includes(kind)) {
      await Promise.all([
        registerThrottleFailure({
          scope: "upload-sign-ip",
          key: ip,
          maxAttempts: UPLOAD_SIGN_MAX_ATTEMPTS_IP,
          windowMs: UPLOAD_SIGN_WINDOW_MS,
          blockMs: UPLOAD_SIGN_BLOCK_MS,
        }),
        registerThrottleFailure({
          scope: "upload-sign-user",
          key: session.userId,
          maxAttempts: UPLOAD_SIGN_MAX_ATTEMPTS_USER,
          windowMs: UPLOAD_SIGN_WINDOW_MS,
          blockMs: UPLOAD_SIGN_BLOCK_MS,
        }),
      ]);

      return NextResponse.json(
        { error: "Некорректный kind загрузки" },
        { status: 400 },
      );
    }

    if (!Number.isFinite(fileSize) || fileSize <= 0) {
      return NextResponse.json(
        { error: "Некорректный размер файла" },
        { status: 400 },
      );
    }

    if (fileSize > MAX_FILE_SIZE_BY_KIND[kind]) {
      return NextResponse.json(
        {
          error:
            kind === "face"
              ? "Фото лица слишком большое. Максимум 10 MB."
              : "Файл слишком большой. Максимум 15 MB.",
        },
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
      maxFileSize: MAX_FILE_SIZE_BY_KIND[kind],
    });
  } catch (error) {
    console.error("sign upload error", error);

    return NextResponse.json(
      { error: "Не удалось создать signed upload url" },
      { status: 500 },
    );
  }
}
