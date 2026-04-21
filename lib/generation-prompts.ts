function clean(value?: string | null): string {
  return (value || "").trim();
}

function joinBlocks(...blocks: Array<string | null | undefined>): string {
  return blocks.map(clean).filter(Boolean).join("\n\n");
}

const FACE_LOCK_SINGLE = `
Use the uploaded face photo(s) as the only identity source for the main subject.
Preserve the exact same real person with high identity fidelity.
Keep facial structure unchanged: eye shape, brows, nose, lips, cheekbones, jawline, forehead, skin tone, and natural facial proportions.
Do not beautify, idealize, genericize, replace, or reinterpret the face.
`.trim();

const NEGATIVE_SINGLE = `
different person, lookalike, identity drift, altered facial anatomy, changed eye shape, changed brows, changed nose, changed lips, changed jawline, beautified face, idealized face, generic model face, doll face, plastic skin, wax skin, cgi, ai-perfect face
`.trim();

function buildFaceLockMulti(faceCount: number): string {
  const lines = [
    `Use the uploaded face photo groups as the only identity sources for the ${faceCount} main people in the image.`,
    `Each uploaded face group corresponds to one exact real person.`,
    "",
    "Identity mapping:",
    "- main person 1 must match uploaded face group 1",
    "- main person 2 must match uploaded face group 2",
  ];

  if (faceCount >= 3) {
    lines.push("- main person 3 must match uploaded face group 3");
  }

  if (faceCount >= 4) {
    lines.push("- main person 4 must match uploaded face group 4");
  }

  lines.push(
    "",
    "The uploaded face groups are provided in order.",
    "All images belonging to the same uploaded face group describe the same person from different angles or expressions.",
    "",
    "Do not swap identities.",
    "Do not merge identities.",
    "Do not average faces.",
    "Do not duplicate one identity across multiple main people.",
    "Do not replace any uploaded person with a new or generic face.",
    "",
    "Each person must remain separately recognizable and faithful to their own uploaded identity.",
  );

  return lines.join("\n").trim();
}

const NEGATIVE_MULTI = `
identity swap, merged faces, blended faces, averaged face, duplicated identity, lookalike, wrong person, altered facial anatomy, beautified face, idealized face, generic model face, doll face, plastic skin, wax skin, cgi, ai-perfect face
`.trim();

function buildIdentityWrapper(faceCount: number): string {
  if (faceCount <= 1) {
    return joinBlocks(FACE_LOCK_SINGLE, `Avoid: ${NEGATIVE_SINGLE}`);
  }

  const normalizedFaceCount = Math.min(Math.max(faceCount, 2), 4);

  return joinBlocks(
    buildFaceLockMulti(normalizedFaceCount),
    `The scene must include exactly ${normalizedFaceCount} main people, matching the uploaded identities in order.`,
    `Avoid: ${NEGATIVE_MULTI}`,
  );
}

function buildStylePromptBlock(params: {
  presetTitle?: string | null;
  presetDescription?: string | null;
  presetPromptTemplate?: string | null;
  analyzedReferencePrompt?: string | null;
  selectedFormat?: string | null;
  selectedMood?: string | null;
  goal?: string | null;
  notes?: string | null;
  prompt?: string | null;
}): string {
  const blocks: string[] = [];

  if (clean(params.presetPromptTemplate)) {
    blocks.push(clean(params.presetPromptTemplate));
  } else if (clean(params.analyzedReferencePrompt)) {
    blocks.push(clean(params.analyzedReferencePrompt));
  } else if (clean(params.prompt)) {
    blocks.push(clean(params.prompt));
  }

  const context: string[] = [];

  if (clean(params.presetTitle)) {
    context.push(`Style name: ${clean(params.presetTitle)}`);
  }

  if (clean(params.presetDescription)) {
    context.push(`Style description: ${clean(params.presetDescription)}`);
  }

  if (clean(params.selectedFormat)) {
    context.push(`Requested format/orientation: ${clean(params.selectedFormat)}`);
  }

  if (clean(params.selectedMood)) {
    context.push(`Mood: ${clean(params.selectedMood)}`);
  }

  if (clean(params.goal)) {
    context.push(`Goal: ${clean(params.goal)}`);
  }

  if (clean(params.notes)) {
    context.push(`User notes: ${clean(params.notes)}`);
  }

  if (context.length > 0) {
    blocks.push(context.join("\n"));
  }

  return blocks.join("\n\n").trim();
}

export const REFERENCE_ANALYZER_MASTER_PROMPT = `
Analyze the uploaded reference image and convert it into one clean image-generation style prompt.
Return only the final style prompt.
Focus on clothing, pose, composition, framing, camera distance, lighting, scene, background, mood, materials, styling, and realism.
Do not describe face identity.
Do not add explanations.
Do not add markdown.
`.trim();

export function buildReadyStylePrompt(params: {
  presetTitle?: string | null;
  presetDescription?: string | null;
  presetPromptTemplate?: string | null;
  selectedFormat?: string | null;
  selectedMood?: string | null;
  goal?: string | null;
  notes?: string | null;
  faceCount?: number;
}): string {
  const faceCount = Math.max(1, params.faceCount || 1);

  return joinBlocks(
    buildIdentityWrapper(faceCount),
    buildStylePromptBlock({
      presetTitle: params.presetTitle,
      presetDescription: params.presetDescription,
      presetPromptTemplate: params.presetPromptTemplate,
      selectedFormat: params.selectedFormat,
      selectedMood: params.selectedMood,
      goal: params.goal,
      notes: params.notes,
    }),
  );
}

export function buildReferencePrompt(params: {
  analyzedReferencePrompt: string;
  selectedFormat?: string | null;
  selectedMood?: string | null;
  goal?: string | null;
  notes?: string | null;
  faceCount?: number;
}): string {
  const faceCount = Math.max(1, params.faceCount || 1);

  return joinBlocks(
    buildIdentityWrapper(faceCount),
    buildStylePromptBlock({
      analyzedReferencePrompt: params.analyzedReferencePrompt,
      selectedFormat: params.selectedFormat,
      selectedMood: params.selectedMood,
      goal: params.goal,
      notes: params.notes,
    }),
  );
}

export function buildEditPrompt(params: {
  prompt: string;
  faceCount?: number;
}): string {
  const faceCount = Math.max(1, params.faceCount || 1);

  return joinBlocks(buildIdentityWrapper(faceCount), clean(params.prompt));
}
