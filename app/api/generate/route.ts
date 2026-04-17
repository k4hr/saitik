import { NextRequest, NextResponse } from "next/server";
import {
  AssetType,
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
} from "@/lib/openai";
import {
  buildR2Key,
  getSignedReadUrl,
  readObjectFromR2,
  uploadBufferToR2,
} from "@/lib/r2";

type UploadedAssetInput = {
  storageKey: string;
  fileName?: string;
  mimeType?: string;
  fileSize?: number;
};

type GenerateBody = {
  mode?: "READY" | "REFERENCE" | "EDIT";
  stylePresetId?: string | null;
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
    sortOrder,
  };
}

function resolveImageSize(
  orientation?: "portrait" | "landscape" | "square",
): "1024x1536" | "1536x1024" | "1024x1024" {
  if (orientation === "landscape") {
    return "1536x1024";
  }

  if (orientation === "square") {
    return "1024x1024";
  }

  return "1024x1536";
}

export async function POST(req: NextRequest) {
  let orderId: string | null = null;

  try {
    const session = await getSession();

    if (!session) {
      return NextResponse.json({ error: "Неавторизован" }, { status: 401 });
    }

    const body = (await req.json()) as GenerateBody;
    const mode = (body.mode || "READY") as GenerationMode;

    if (mode === "READY" && !body.stylePresetId) {
      return NextResponse.json(
        { error: "Для готового стиля нужен stylePresetId" },
        { status: 400 },
      );
    }

    if (mode !== "EDIT" && (!body.faceAssets || body.faceAssets.length === 0)) {
      return NextResponse.json(
        { error: "Нужно загрузить хотя бы одно фото лица" },
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

    const stylePreset =
      body.stylePresetId && mode === "READY"
        ? await prisma.stylePreset.findUnique({
            where: { id: body.stylePresetId },
            select: {
              id: true,
              title: true,
              description: true,
              promptTemplate: true,
              isActive: true,
            },
          })
        : null;

    if (mode === "READY" && (!stylePreset || !stylePreset.isActive)) {
      return NextResponse.json(
        { error: "Style preset не найден или выключен" },
        { status: 404 },
      );
    }

    const faceAssets = body.faceAssets || [];
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

    const createdOrder = await prisma.order.create({
      data: {
        userId: session.userId,
        stylePresetId: stylePreset?.id || null,
        mode,
        title: body.title?.trim() || null,
        goal: body.goal?.trim() || null,
        selectedFormat: body.selectedFormat?.trim() || null,
        selectedMood: body.selectedMood?.trim() || null,
        notes: body.notes?.trim() || null,
        promptInput: body.prompt?.trim() || null,
        status: OrderStatus.PROCESSING,
        startedAt: new Date(),
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

    orderId = createdOrder.id;

    let finalPrompt = "";
    let sourceStorageKey = "";

    if (mode === "READY") {
      sourceStorageKey = faceAssets[0].storageKey;

      finalPrompt = buildReadyStylePrompt({
        presetTitle: stylePreset?.title || "Ready style",
        presetDescription: stylePreset?.description || null,
        presetPromptTemplate: stylePreset?.promptTemplate || null,
        selectedFormat: body.selectedFormat,
        selectedMood: body.selectedMood,
        goal: body.goal,
        notes: body.notes,
      });
    }

    if (mode === "REFERENCE") {
      sourceStorageKey = faceAssets[0].storageKey;

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
        goal: body.goal,
        notes: body.notes,
      });
    }

    if (mode === "EDIT") {
      sourceStorageKey = body.sourceAsset!.storageKey;
      finalPrompt = buildEditPrompt({
        prompt: body.prompt!.trim(),
      });
    }

    const sourceObject = await readObjectFromR2(sourceStorageKey);

    const generatedImageBuffer = await editImageWithOpenAi({
      prompt: finalPrompt,
      sourceImageBytes: sourceObject.bytes,
      sourceMimeType: sourceObject.contentType,
      sourceFileName: "source.png",
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
    });
  } catch (error) {
    console.error("generate error", error);

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
