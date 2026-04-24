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

const READY_STYLE_REFERENCE_PROMPT = `
Use the uploaded face photo(s) as the only source of facial identity for the final subject.

Use the uploaded style cover image only as a visual reference for:
composition, framing, pose, outfit, styling, lighting, color palette, environment, background, atmosphere, camera feel, and overall realism.

The final image must preserve the uploaded user identity, but follow the visual direction of the uploaded style cover image as closely as possible.

Do not copy or reuse the face from the style cover image.
Do not mix the face from the style cover with the uploaded user face.
Replace the person from the style cover with the uploaded user identity while preserving the style, scene, and photographic feel.

Keep the result realistic, photographic, premium, and visually close to the style cover image.
`.trim();

export const REFERENCE_EXTRA_PROMPT = `
Use the uploaded face photo(s) as the only identity source for the main subject.

Preserve the exact same real person with strong identity fidelity and stable recognizability. The generated subject must remain clearly the same person as in the uploaded face photo(s), not a similar-looking person, not a beautified version, and not a newly invented face.

Use the uploaded reference image only as the source for visual style and scene direction: clothing, pose, composition, camera framing, camera distance, angle, lighting, background, setting, mood, color palette, and overall photographic feel.

Identity must come from the uploaded face photo(s).
Style and scene must come from the uploaded reference image.

Keep the person's facial identity consistent and believable:
preserve facial structure, face shape, forehead, brows, eyes, nose, lips, cheekbones, jawline, chin, skin tone, natural proportions, and distinctive identity markers.
Keep the person recognizable even if hairstyle, makeup, pose, wardrobe, lighting, or background differ from the original face photo.

Do not replace the person.
Do not reinterpret the face.
Do not beautify, idealize, glamourize, genericize, or over-correct facial features.
Do not make the person more symmetrical, more perfect, younger, older, or more model-like.
Do not drift away from the real identity.

The final image must look like a real photograph of this exact same person placed into the scene and style of the uploaded reference image.

Prioritize photorealism and realism:
natural skin texture, real pores, natural asymmetry, realistic eyes, realistic hair strands, believable hands, believable fabric texture, believable lighting, believable shadows, believable reflections, natural depth of field, and true photographic rendering.

The result must look premium and realistic, but still human and natural.
No beauty-filter effect.
No plastic skin.
No waxy skin.
No doll-like face.
No overprocessed portrait look.
No CGI look.
No illustration look.
No fake AI-generated finish.

Avoid:
different person, lookalike, weak resemblance, identity drift, altered facial anatomy, changed eye shape, changed brows, changed nose, changed lips, changed jawline, changed proportions, beautified face, idealized face, generic model face, doll face, plastic skin, wax skin, cgi, 3d render, illustration, painting, anime, cartoon, fake photo, over-smoothed skin, beauty filter, unnatural face, dead eyes, bad anatomy, distorted hands, extra fingers, unrealistic lighting, fake shadows, fake background
`.trim();

export function buildReadyStylePrompt(params: {
  presetPromptTemplate?: string | null;
  selectedFormat?: string | null;
  selectedMood?: string | null;
  notes?: string | null;
}): string {
  return joinBlocks(
    READY_STYLE_REFERENCE_PROMPT,
    buildStylePromptBlock({
      presetPromptTemplate: params.presetPromptTemplate,
      selectedFormat: params.selectedFormat,
      selectedMood: params.selectedMood,
      notes: params.notes,
    }),
  );
}

export function buildReferencePrompt(params: {
  analyzedReferencePrompt: string;
  selectedFormat?: string | null;
  selectedMood?: string | null;
  notes?: string | null;
}): string {
  return joinBlocks(
    REFERENCE_EXTRA_PROMPT,
    buildStylePromptBlock({
      analyzedReferencePrompt: params.analyzedReferencePrompt,
      selectedFormat: params.selectedFormat,
      selectedMood: params.selectedMood,
      notes: params.notes,
    }),
  );
}

export function buildEditPrompt(params: {
  prompt: string;
}): string {
  return clean(params.prompt);
}
