import { NextRequest, NextResponse } from "next/server";
import { AssetType, GenerationMode, OrderStatus } from "@prisma/client";

import { getSession } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

type UploadedAssetInput = {
  storageKey: string;
  fileName?: string;
  mimeType?: string;
  fileSize?: number;
};

type CreateDraftBody = {
  mode?: "READY" | "REFERENCE" | "EDIT";
  showcaseItemId?: string | null;
  title?: string;
  goal?: string;
  selectedFormat?: string;
  selectedMood?: string;
  notes?: string;
  promptInput?: string | null;
  faceAssets?: UploadedAssetInput[];
  referenceAsset?: UploadedAssetInput | null;
  sourceAsset?: UploadedAssetInput | null;
};

export async function POST(req: NextRequest) {
  try {
    const session = await getSession();

    if (!session) {
      return NextResponse.json({ error: "Неавторизован" }, { status: 401 });
    }

    const body = (await req.json()) as CreateDraftBody;
    const mode = (body.mode || "READY") as GenerationMode;

    const assetsToCreate: Array<{
      type: AssetType;
      url: string;
      storageKey: string;
      fileName?: string;
      mimeType?: string;
      fileSize?: number;
      sortOrder?: number;
    }> = [];

    for (const [index, item] of (body.faceAssets || []).entries()) {
      if (!item?.storageKey) continue;

      assetsToCreate.push({
        type: AssetType.FACE,
        url: item.storageKey,
        storageKey: item.storageKey,
        fileName: item.fileName,
        mimeType: item.mimeType,
        fileSize: item.fileSize,
        sortOrder: index,
      });
    }

    if (body.referenceAsset?.storageKey) {
      assetsToCreate.push({
        type: AssetType.REFERENCE,
        url: body.referenceAsset.storageKey,
        storageKey: body.referenceAsset.storageKey,
        fileName: body.referenceAsset.fileName,
        mimeType: body.referenceAsset.mimeType,
        fileSize: body.referenceAsset.fileSize,
        sortOrder: 0,
      });
    }

    if (body.sourceAsset?.storageKey) {
      assetsToCreate.push({
        type: AssetType.REFERENCE,
        url: body.sourceAsset.storageKey,
        storageKey: body.sourceAsset.storageKey,
        fileName: body.sourceAsset.fileName,
        mimeType: body.sourceAsset.mimeType,
        fileSize: body.sourceAsset.fileSize,
        sortOrder: 0,
      });
    }

    const order = await prisma.order.create({
      data: {
        userId: session.userId,
        showcaseItemId: body.showcaseItemId || null,
        mode,
        title: body.title?.trim() || null,
        goal: body.goal?.trim() || null,
        selectedFormat: body.selectedFormat?.trim() || null,
        selectedMood: body.selectedMood?.trim() || null,
        notes: body.notes?.trim() || null,
        promptInput: body.promptInput?.trim() || null,
        status: OrderStatus.DRAFT,
        assets: assetsToCreate.length
          ? {
              create: assetsToCreate,
            }
          : undefined,
      },
      select: {
        id: true,
        status: true,
        mode: true,
        shareId: true,
        createdAt: true,
      },
    });

    return NextResponse.json({
      ok: true,
      order,
    });
  } catch (error) {
    console.error("create draft order error", error);

    return NextResponse.json(
      { error: "Не удалось создать draft order" },
      { status: 500 },
    );
  }
}
