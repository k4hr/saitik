type CommonPromptParams = {
  selectedFormat?: string | null;
  selectedMood?: string | null;
  goal?: string | null;
  notes?: string | null;
};

function compactParts(parts: Array<string | null | undefined>) {
  return parts
    .map((item) => item?.trim())
    .filter((item): item is string => Boolean(item))
    .join("\n");
}

export const REFERENCE_ANALYZER_MASTER_PROMPT = `
Ты — сильный prompt engineer для image generation.

Твоя задача:
1. Проанализировать референс-изображение.
2. Выделить композицию, свет, объектив, фон, позу, одежду, цвет, текстуры, атмосферу, уровень realism.
3. НЕ описывать конкретное лицо человека с референса как личность.
4. Сформировать один чистый production prompt для генерации новой картинки с другим лицом пользователя.
5. Сохранять именно визуальный стиль, композицию, освещение, одежду, ракурс, окружение и общую эстетику.
6. Не писать служебные комментарии, не писать markdown, не писать объяснения.
7. Вывести только готовый prompt на английском языке, в одну смысловую структуру.

Важно:
- prompt должен быть пригоден для photorealistic premium image generation.
- без упоминаний copyrighted characters.
- без слов "same person", "exact copy".
- акцент на style transfer, composition transfer, mood transfer.
`.trim();

export function buildReadyStylePrompt(params: CommonPromptParams & {
  presetTitle: string;
  presetDescription?: string | null;
  presetPromptTemplate?: string | null;
}) {
  return compactParts([
    `Create a premium photorealistic image using the uploaded person's face and identity as the main subject.`,
    `Keep the person's facial likeness believable, attractive, natural, and consistent with the uploaded face photo.`,
    `Style preset title: ${params.presetTitle}.`,
    params.presetDescription
      ? `Preset description: ${params.presetDescription}.`
      : null,
    params.presetPromptTemplate
      ? `Core visual prompt: ${params.presetPromptTemplate}`
      : null,
    params.selectedFormat ? `Framing: ${params.selectedFormat}.` : null,
    params.selectedMood ? `Mood: ${params.selectedMood}.` : null,
    params.goal ? `Purpose of image: ${params.goal}.` : null,
    params.notes ? `Additional user wishes: ${params.notes}.` : null,
    `Photorealistic, premium, polished, clean skin texture, realistic anatomy, realistic hands, realistic proportions, elegant styling, high-end editorial quality, no text, no watermark, no collage.`,
  ]);
}

export function buildReferencePrompt(params: CommonPromptParams & {
  analyzedReferencePrompt: string;
}) {
  return compactParts([
    `Create a premium photorealistic image using the uploaded person's face and identity as the main subject.`,
    `Keep the person's facial likeness natural and believable.`,
    `Use the following analyzed reference prompt as the main creative direction:`,
    params.analyzedReferencePrompt,
    params.selectedFormat ? `Framing: ${params.selectedFormat}.` : null,
    params.selectedMood ? `Mood: ${params.selectedMood}.` : null,
    params.goal ? `Purpose of image: ${params.goal}.` : null,
    params.notes ? `Additional user wishes: ${params.notes}.` : null,
    `Photorealistic, premium, realistic skin texture, elegant styling, accurate lighting, realistic anatomy, no text, no watermark.`,
  ]);
}

export function buildEditPrompt(params: {
  prompt: string;
}) {
  return compactParts([
    `Edit the uploaded image according to the user's request while preserving realism and a premium polished result.`,
    `User request: ${params.prompt}`,
    `Keep the result photorealistic, with believable textures, realistic anatomy, realistic lighting, no text, no watermark.`,
  ]);
}
