import { NextRequest, NextResponse } from "next/server";
import {
  AssetType,
  CreditTransactionType,
  GenerationMode,
  OrderStatus,
  type Prisma,
} from "@prisma/client";

import { getSession } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import {
  buildEditPrompt,
  buildReadyStylePrompt,
  buildReferencePrompt,
  REFERENCE_ANALYZER_MASTER_PROMPT,
} from "@/lib/generation-prompts";
import {
  describeReferenceImage,
  editImageWithOpenAi,
  type OpenAiInputImage,
} from "@/lib/openai";
import {
  buildR2Key,
  getSignedReadUrl,
  headObjectInR2,
  readObjectFromR2,
  uploadBufferToR2,
} from "@/lib/r2";
import {
  getRequestIp,
  getThrottleState,
  registerThrottleFailure,
} from "@/lib/auth-throttle";

type UploadedAssetInput = {
  storageKey: string;
  fileName?: string;
  mimeType?: string;
  fileSize?: number;
  personIndex?: number;
};

type GenerateBody = {
  mode?: "READY" | "REFERENCE" | "EDIT";
  showcaseItemId?: string | null;
  title?: string;
  goal?: string;
  selectedFormat?: string;
  selectedMood?: string;
  notes?: string;
  prompt?: string;
  imageOrientation?: "portrait" | "landscape" | "square";
  faceAssets?: UploadedAssetInput[];
  referenceAsset?: UploadedAssetInput | null;
  sourceAsset?: UploadedAssetInput | null;
};

const MAX_FACE_FILE_SIZE = 10 * 1024 * 1024;
const MAX_REFERENCE_FILE_SIZE = 15 * 1024 * 1024;
const MAX_FACE_FILES = 10;
const REFERENCE_GENERATION_PRICE_CREDITS = 15;

const GENERATE_MAX_ATTEMPTS_IP = 12;
const GENERATE_MAX_ATTEMPTS_USER = 8;
const GENERATE_WINDOW_MS = 10 * 60 * 1000;
const GENERATE_BLOCK_MS = 20 * 60 * 1000;

function buildAssetCreate(
  type: AssetType,
  item: UploadedAssetInput,
  sortOrder = 0,
): Prisma.OrderAssetCreateWithoutOrderInput {
  return {
    type,
    url: item.storageKey,
    storageKey: item.storageKey,
    fileName: item.fileName || null,
    mimeType: item.mimeType || null,
    fileSize: item.fileSize || null,
    personIndex:
      typeof item.personIndex === "number" ? item.personIndex : null,
    sortOrder,
  };
}

function resolveImageSize(
  orientation?: "portrait" | "landscape" | "square",
): "1024x1536" | "1536x1024" | "1024x1024" {
  if (orientation === "landscape") return "1536x1024";
  if (orientation === "square") return "1024x1024";
  return "1024x1536";
}

function assertUserOwnsStorageKey(storageKey: string, userId: string) {
  const normalized = storageKey.trim();
  const allowedPrefix = `users/${userId}/`;

  if (!normalized.startsWith(allowedPrefix)) {
    throw new Error("Некорректный storageKey");
  }
}

function assertClientDeclaredFileSize(
  item: UploadedAssetInput,
  maxBytes: number,
  label: string,
) {
  const fileSize = Number(item.fileSize ?? 0);

  if (!Number.isFinite(fileSize) || fileSize <= 0) {
    throw new Error(`Некорректный размер файла: ${label}`);
  }

  if (fileSize > maxBytes) {
    throw new Error(
      `${label} слишком большой. Максимум ${Math.floor(maxBytes / 1024 / 1024)} MB.`,
    );
  }
}

async function assertActualR2ObjectSize(
  storageKey: string,
  maxBytes: number,
  label: string,
) {
  const meta = await headObjectInR2(storageKey);

  if (!meta.contentLength || meta.contentLength <= 0) {
    throw new Error(`Не удалось определить размер файла: ${label}`);
  }

  if (meta.contentLength > maxBytes) {
    throw new Error(
      `${label} слишком большой. Максимум ${Math.floor(maxBytes / 1024 / 1024)} MB.`,
    );
  }
}

function sortFaceAssetsForOpenAi(
  faceAssets: UploadedAssetInput[],
): UploadedAssetInput[] {
  return [...faceAssets].sort((a, b) => {
    const personA =
      typeof a.personIndex === "number" && a.personIndex >= 0 ? a.personIndex : 0;
    const personB =
      typeof b.personIndex === "number" && b.personIndex >= 0 ? b.personIndex : 0;

    if (personA !== personB) {
      return personA - personB;
    }

    return (a.storageKey || "").localeCompare(b.storageKey || "");
  });
}

async function buildOpenAiInputImage(
  item: UploadedAssetInput,
  fallbackName: string,
): Promise<OpenAiInputImage> {
  const object = await readObjectFromR2(item.storageKey);

  return {
    bytes: object.bytes,
    mimeType: item.mimeType || object.contentType || "image/png",
    fileName: item.fileName || fallbackName,
  };
}

export async function POST(req: NextRequest) {
  let orderId: string | null = null;
  let chargedCredits = 0;
  let sessionUserId: string | null = null;

  try {
    const session = await getSession();

    if (!session) {
      return NextResponse.json({ error: "Неавторизован" }, { status: 401 });
    }

    sessionUserId = session.userId;

    const ip = getRequestIp(req.headers);

    const [ipState, userState] = await Promise.all([
      getThrottleState({
        scope: "generate-ip",
        key: ip,
        maxAttempts: GENERATE_MAX_ATTEMPTS_IP,
        windowMs: GENERATE_WINDOW_MS,
        blockMs: GENERATE_BLOCK_MS,
      }),
      getThrottleState({
        scope: "generate-user",
        key: session.userId,
        maxAttempts: GENERATE_MAX_ATTEMPTS_USER,
        windowMs: GENERATE_WINDOW_MS,
        blockMs: GENERATE_BLOCK_MS,
      }),
    ]);

    if (ipState.isBlocked || userState.isBlocked) {
      return NextResponse.json(
        { error: "Слишком много генераций. Попробуйте позже." },
        { status: 429 },
      );
    }

    const body = (await req.json()) as GenerateBody;
    const mode = (body.mode || "READY") as GenerationMode;

    if (mode === "READY" && !body.showcaseItemId) {
      return NextResponse.json(
        { error: "Для готового стиля нужен showcaseItemId" },
        { status: 400 },
      );
    }

    if (mode !== "EDIT" && (!body.faceAssets || body.faceAssets.length === 0)) {
      return NextResponse.json(
        { error: "Нужно загрузить хотя бы одно фото лица" },
        { status: 400 },
      );
    }

    if ((body.faceAssets || []).length > MAX_FACE_FILES) {
      return NextResponse.json(
        { error: `Можно загрузить максимум ${MAX_FACE_FILES} фото лица` },
        { status: 400 },
      );
    }

    if (mode === "REFERENCE" && !body.referenceAsset?.storageKey) {
      return NextResponse.json(
        { error: "Нужно загрузить референс" },
        { status: 400 },
      );
    }

    if (mode === "EDIT" && !body.sourceAsset?.storageKey) {
      return NextResponse.json(
        { error: "Нужно загрузить исходную картинку для редактирования" },
        { status: 400 },
      );
    }

    if (mode === "EDIT" && !body.prompt?.trim()) {
      return NextResponse.json(
        { error: "Для свободного редактирования нужен промпт" },
        { status: 400 },
      );
    }

    const faceAssets = body.faceAssets || [];
    const sortedFaceAssets = sortFaceAssetsForOpenAi(faceAssets);

    for (const asset of sortedFaceAssets) {
      assertUserOwnsStorageKey(asset.storageKey, session.userId);
      assertClientDeclaredFileSize(asset, MAX_FACE_FILE_SIZE, "Фото лица");
    }

    if (body.referenceAsset?.storageKey) {
      assertUserOwnsStorageKey(body.referenceAsset.storageKey, session.userId);
      assertClientDeclaredFileSize(
        body.referenceAsset,
        MAX_REFERENCE_FILE_SIZE,
        "Референс",
      );
    }

    if (body.sourceAsset?.storageKey) {
      assertUserOwnsStorageKey(body.sourceAsset.storageKey, session.userId);
      assertClientDeclaredFileSize(
        body.sourceAsset,
        MAX_REFERENCE_FILE_SIZE,
        "Исходная картинка",
      );
    }

    await Promise.all([
      ...sortedFaceAssets.map((asset) =>
        assertActualR2ObjectSize(asset.storageKey, MAX_FACE_FILE_SIZE, "Фото лица"),
      ),
      ...(body.referenceAsset?.storageKey
        ? [
            assertActualR2ObjectSize(
              body.referenceAsset.storageKey,
              MAX_REFERENCE_FILE_SIZE,
              "Референс",
            ),
          ]
        : []),
      ...(body.sourceAsset?.storageKey
        ? [
            assertActualR2ObjectSize(
              body.sourceAsset.storageKey,
              MAX_REFERENCE_FILE_SIZE,
              "Исходная картинка",
            ),
          ]
        : []),
    ]);

    const showcaseItem =
      body.showcaseItemId && mode === "READY"
        ? await prisma.showcaseItem.findUnique({
            where: { id: body.showcaseItemId },
            select: {
              id: true,
              kind: true,
              title: true,
              description: true,
              promptTemplate: true,
              generationPriceCredits: true,
              isActive: true,
            },
          })
        : null;

    if (
      mode === "READY" &&
      (!showcaseItem ||
        !showcaseItem.isActive ||
        showcaseItem.kind !== "READY" ||
        !showcaseItem.promptTemplate)
    ) {
      return NextResponse.json(
        { error: "Готовый стиль не найден или у него нет промпта" },
        { status: 404 },
      );
    }

    const creditsToCharge =
      mode === "READY"
        ? Math.max(showcaseItem?.generationPriceCredits ?? 0, 0)
        : mode === "REFERENCE"
          ? REFERENCE_GENERATION_PRICE_CREDITS
          : 0;

    const assetsToCreate: Prisma.OrderAssetCreateWithoutOrderInput[] = [];

    for (const [index, item] of faceAssets.entries()) {
      assetsToCreate.push(buildAssetCreate(AssetType.FACE, item, index));
    }

    if (body.referenceAsset?.storageKey) {
      assetsToCreate.push(
        buildAssetCreate(AssetType.REFERENCE, body.referenceAsset, 0),
      );
    }

    if (body.sourceAsset?.storageKey) {
      assetsToCreate.push(
        buildAssetCreate(AssetType.REFERENCE, body.sourceAsset, 0),
      );
    }

    const createdOrder = await prisma.$transaction(async (tx) => {
      let balanceAfter = 0;

      if (creditsToCharge > 0) {
        const user = await tx.user.findUnique({
          where: { id: session.userId },
          select: { id: true, creditBalance: true },
        });

        if (!user) {
          throw new Error("Пользователь не найден");
        }

        if (user.creditBalance < creditsToCharge) {
          throw new Error("Недостаточно кредитов");
        }

        balanceAfter = user.creditBalance - creditsToCharge;

        await tx.user.update({
          where: { id: session.userId },
          data: {
            creditBalance: balanceAfter,
          },
        });
      }

      const order = await tx.order.create({
        data: {
          userId: session.userId,
          showcaseItemId: showcaseItem?.id || null,
          mode,
          title: body.title?.trim() || null,
          goal: body.goal?.trim() || null,
          selectedFormat: body.selectedFormat?.trim() || null,
          selectedMood: body.selectedMood?.trim() || null,
          notes: body.notes?.trim() || null,
          promptInput: body.prompt?.trim() || null,
          status: OrderStatus.PROCESSING,
          startedAt: new Date(),
          creditsSpent: creditsToCharge,
          assets: assetsToCreate.length
            ? {
                create: assetsToCreate,
              }
            : undefined,
        },
        select: {
          id: true,
          shareId: true,
        },
      });

      if (creditsToCharge > 0) {
        await tx.creditTransaction.create({
          data: {
            userId: session.userId,
            orderId: order.id,
            type: CreditTransactionType.SPEND,
            amount: -creditsToCharge,
            balanceAfter,
            description:
              mode === "REFERENCE"
                ? "Списание за генерацию по референсу"
                : `Списание за генерацию: ${showcaseItem?.title || "Готовый стиль"}`,
          },
        });
      }

      return order;
    });

    orderId = createdOrder.id;
    chargedCredits = creditsToCharge;

    let finalPrompt = "";
    let inputImages: OpenAiInputImage[] = [];

    if (mode === "READY") {
      finalPrompt = buildReadyStylePrompt({
        presetPromptTemplate: showcaseItem?.promptTemplate || null,
        selectedFormat: body.selectedFormat,
        selectedMood: body.selectedMood,
        notes: body.notes,
      });

      inputImages = await Promise.all(
        sortedFaceAssets.map((asset, index) =>
          buildOpenAiInputImage(asset, `face-${index + 1}.png`),
        ),
      );
    }

    if (mode === "REFERENCE") {
      const referenceSignedUrl = await getSignedReadUrl({
        key: body.referenceAsset!.storageKey,
      });

      const analyzedReferencePrompt = await describeReferenceImage({
        imageUrl: referenceSignedUrl,
        masterPrompt: REFERENCE_ANALYZER_MASTER_PROMPT,
        userContext:
          "Analyze this reference image and return one polished production image-generation prompt only.",
      });

      finalPrompt = buildReferencePrompt({
        analyzedReferencePrompt,
        selectedFormat: body.selectedFormat,
        selectedMood: body.selectedMood,
        notes: body.notes,
      });

      inputImages = await Promise.all(
        sortedFaceAssets.map((asset, index) =>
          buildOpenAiInputImage(asset, `face-${index + 1}.png`),
        ),
      );
    }

    if (mode === "EDIT") {
      finalPrompt = buildEditPrompt({
        prompt: body.prompt!.trim(),
      });

      const editBase = await buildOpenAiInputImage(
        body.sourceAsset!,
        "edit-source.png",
      );

      const faceReferenceImages = await Promise.all(
        sortedFaceAssets.map((asset, index) =>
          buildOpenAiInputImage(asset, `face-${index + 1}.png`),
        ),
      );

      inputImages = [editBase, ...faceReferenceImages];
    }

    const generatedImageBuffer = await editImageWithOpenAi({
      prompt: finalPrompt,
      inputImages,
      size: resolveImageSize(body.imageOrientation),
    });

    const resultKey = buildR2Key({
      userId: session.userId,
      kind: "result",
      orderId: createdOrder.id,
      fileName: "result.png",
    });

    await uploadBufferToR2({
      key: resultKey,
      body: generatedImageBuffer,
      contentType: "image/png",
      contentDisposition: 'inline; filename="result.png"',
      cacheControl: "public, max-age=31536000, immutable",
    });

    await prisma.order.update({
      where: { id: createdOrder.id },
      data: {
        status: OrderStatus.DONE,
        promptFinal: finalPrompt,
        finishedAt: new Date(),
        assets: {
          create: {
            type: AssetType.RESULT,
            url: resultKey,
            storageKey: resultKey,
            fileName: "result.png",
            mimeType: "image/png",
            fileSize: generatedImageBuffer.length,
            sortOrder: 0,
          },
        },
      },
    });

    return NextResponse.json({
      ok: true,
      orderId: createdOrder.id,
      shareId: createdOrder.shareId,
      imagePath: `/api/results/${createdOrder.shareId}`,
      downloadPath: `/api/results/${createdOrder.shareId}?download=1`,
      sharePath: `/share/${createdOrder.shareId}`,
      chargedCredits,
    });
  } catch (error) {
    console.error("generate error", error);

    if (sessionUserId) {
      const ip = getRequestIp(req.headers);

      await Promise.all([
        registerThrottleFailure({
          scope: "generate-ip",
          key: ip,
          maxAttempts: GENERATE_MAX_ATTEMPTS_IP,
          windowMs: GENERATE_WINDOW_MS,
          blockMs: GENERATE_BLOCK_MS,
        }),
        registerThrottleFailure({
          scope: "generate-user",
          key: sessionUserId,
          maxAttempts: GENERATE_MAX_ATTEMPTS_USER,
          windowMs: GENERATE_WINDOW_MS,
          blockMs: GENERATE_BLOCK_MS,
        }),
      ]).catch(() => undefined);
    }

    if (orderId) {
      await prisma.order
        .update({
          where: { id: orderId },
          data: {
            status: OrderStatus.FAILED,
            errorMessage:
              error instanceof Error ? error.message : "Generation failed",
            finishedAt: new Date(),
          },
        })
        .catch(() => undefined);

      if (chargedCredits > 0 && sessionUserId) {
        const refundUserId = sessionUserId;

        await prisma
          .$transaction(async (tx) => {
            const user = await tx.user.findUnique({
              where: { id: refundUserId },
              select: { creditBalance: true },
            });

            if (!user) return;

            const balanceAfter = user.creditBalance + chargedCredits;

            await tx.user.update({
              where: { id: refundUserId },
              data: {
                creditBalance: balanceAfter,
              },
            });

            await tx.creditTransaction.create({
              data: {
                userId: refundUserId,
                orderId,
                type: CreditTransactionType.REFUND,
                amount: chargedCredits,
                balanceAfter,
                description: "Возврат кредитов из-за ошибки генерации",
              },
            });
          })
          .catch(() => undefined);
      }
    }

    return NextResponse.json(
      {
        error:
          error instanceof Error
            ? error.message
            : "Не удалось выполнить генерацию",
      },
      { status: 500 },
    );
  }
}
