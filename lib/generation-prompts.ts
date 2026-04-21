function clean(value?: string | null): string {
  return (value || "").trim();
}

function joinBlocks(...blocks: Array<string | null | undefined>): string {
  return blocks.map(clean).filter(Boolean).join("\n\n");
}

function buildStylePromptBlock(params: {
  presetPromptTemplate?: string | null;
  analyzedReferencePrompt?: string | null;
  selectedFormat?: string | null;
  selectedMood?: string | null;
  notes?: string | null;
  prompt?: string | null;
}): string {
  const primary =
    clean(params.presetPromptTemplate) ||
    clean(params.analyzedReferencePrompt) ||
    clean(params.prompt);

  const extras: string[] = [];

  if (clean(params.selectedFormat)) {
    extras.push(`Format: ${clean(params.selectedFormat)}`);
  }

  if (clean(params.selectedMood)) {
    extras.push(`Mood: ${clean(params.selectedMood)}`);
  }

  if (clean(params.notes)) {
    extras.push(`Notes: ${clean(params.notes)}`);
  }

  return joinBlocks(primary, extras.join("\n"));
}

export const REFERENCE_ANALYZER_MASTER_PROMPT = `
Analyze the uploaded reference image and convert it into one clean image-generation style prompt.
Return only the final style prompt.
Focus on clothing, pose, composition, framing, camera distance, lighting, scene, background, mood, materials, styling, and realism.
Do not add explanations.
Do not add markdown.
`.trim();

export function buildReadyStylePrompt(params: {
  presetPromptTemplate?: string | null;
  selectedFormat?: string | null;
  selectedMood?: string | null;
  notes?: string | null;
}): string {
  return buildStylePromptBlock({
    presetPromptTemplate: params.presetPromptTemplate,
    selectedFormat: params.selectedFormat,
    selectedMood: params.selectedMood,
    notes: params.notes,
  });
}

export function buildReferencePrompt(params: {
  analyzedReferencePrompt: string;
  selectedFormat?: string | null;
  selectedMood?: string | null;
  notes?: string | null;
}): string {
  return buildStylePromptBlock({
    analyzedReferencePrompt: params.analyzedReferencePrompt,
    selectedFormat: params.selectedFormat,
    selectedMood: params.selectedMood,
    notes: params.notes,
  });
}

export function buildEditPrompt(params: {
  prompt: string;
}): string {
  return clean(params.prompt);
}
