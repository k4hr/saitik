function getEnv(name: string): string {
  const value = process.env[name];

  if (!value) {
    throw new Error(`${name} is not set`);
  }

  return value;
}

function getOpenAiHeaders(contentType?: string) {
  const apiKey = getEnv("OPENAI_API_KEY");

  return {
    Authorization: `Bearer ${apiKey}`,
    ...(contentType ? { "Content-Type": contentType } : {}),
  };
}

function extractOutputText(payload: any): string {
  if (typeof payload?.output_text === "string" && payload.output_text.trim()) {
    return payload.output_text.trim();
  }

  const chunks: string[] = [];

  if (Array.isArray(payload?.output)) {
    for (const item of payload.output) {
      if (!Array.isArray(item?.content)) continue;

      for (const contentItem of item.content) {
        if (typeof contentItem?.text === "string" && contentItem.text.trim()) {
          chunks.push(contentItem.text.trim());
        }
      }
    }
  }

  return chunks.join("\n").trim();
}

export type OpenAiImageSize =
  | "1024x1024"
  | "1024x1536"
  | "1536x1024"
  | "auto";

export type OpenAiInputImage = {
  bytes: Uint8Array;
  mimeType: string;
  fileName: string;
};

export async function describeReferenceImage(params: {
  imageUrl: string;
  masterPrompt: string;
  userContext?: string;
}) {
  const model = process.env.OPENAI_VISION_MODEL || "gpt-4.1";

  const response = await fetch("https://api.openai.com/v1/responses", {
    method: "POST",
    headers: getOpenAiHeaders("application/json"),
    body: JSON.stringify({
      model,
      input: [
        {
          role: "system",
          content: [
            {
              type: "input_text",
              text: params.masterPrompt,
            },
          ],
        },
        {
          role: "user",
          content: [
            {
              type: "input_text",
              text:
                params.userContext?.trim() ||
                "Analyze this reference image and return one production-ready visual prompt only.",
            },
            {
              type: "input_image",
              image_url: params.imageUrl,
              detail: "high",
            },
          ],
        },
      ],
    }),
  });

  if (!response.ok) {
    const text = await response.text();
    throw new Error(`OpenAI responses error: ${response.status} ${text}`);
  }

  const payload = (await response.json()) as any;
  const text = extractOutputText(payload);

  if (!text) {
    throw new Error("OpenAI did not return reference prompt text");
  }

  return text;
}

function uint8ToArrayBuffer(bytes: Uint8Array): ArrayBuffer {
  return bytes.buffer.slice(
    bytes.byteOffset,
    bytes.byteOffset + bytes.byteLength,
  ) as ArrayBuffer;
}

async function generateImageWithOpenAi(params: {
  prompt: string;
  size?: OpenAiImageSize;
}) {
  const model = process.env.OPENAI_IMAGE_MODEL || "gpt-image-1.5";
  const size = params.size || process.env.OPENAI_IMAGE_SIZE || "1024x1536";

  const response = await fetch("https://api.openai.com/v1/images/generations", {
    method: "POST",
    headers: getOpenAiHeaders("application/json"),
    body: JSON.stringify({
      model,
      prompt: params.prompt,
      size,
    }),
  });

  if (!response.ok) {
    const text = await response.text();
    throw new Error(`OpenAI image generation error: ${response.status} ${text}`);
  }

  const payload = (await response.json()) as {
    data?: Array<{
      b64_json?: string;
    }>;
  };

  const base64 = payload.data?.[0]?.b64_json;

  if (!base64) {
    throw new Error("OpenAI image generation returned empty image");
  }

  return Buffer.from(base64, "base64");
}

export async function editImageWithOpenAi(params: {
  prompt: string;
  inputImages?: OpenAiInputImage[];
  size?: OpenAiImageSize;
}) {
  const inputImages = params.inputImages || [];

  if (inputImages.length === 0) {
    return generateImageWithOpenAi({
      prompt: params.prompt,
      size: params.size,
    });
  }

  const model = process.env.OPENAI_IMAGE_MODEL || "gpt-image-1.5";
  const size = params.size || process.env.OPENAI_IMAGE_SIZE || "1024x1536";

  const formData = new FormData();

  formData.append("model", model);
  formData.append("prompt", params.prompt);
  formData.append("size", size);

  for (const image of inputImages) {
    const blob = new Blob([uint8ToArrayBuffer(image.bytes)], {
      type: image.mimeType || "image/png",
    });

    formData.append("image[]", blob, image.fileName || "source.png");
  }

  const response = await fetch("https://api.openai.com/v1/images/edits", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${getEnv("OPENAI_API_KEY")}`,
    },
    body: formData,
  });

  if (!response.ok) {
    const text = await response.text();
    throw new Error(`OpenAI image edit error: ${response.status} ${text}`);
  }

  const payload = (await response.json()) as {
    data?: Array<{
      b64_json?: string;
    }>;
  };

  const base64 = payload.data?.[0]?.b64_json;

  if (!base64) {
    throw new Error("OpenAI image edit returned empty image");
  }

  return Buffer.from(base64, "base64");
}
