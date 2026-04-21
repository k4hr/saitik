const FACE_IDENTITY_LOCK_SHARED = `
IDENTITY LOCK — MAX FIDELITY

Use the uploaded face references as the absolute and only identity source for all main subjects in the generated image.

Preserve exact real-person identity with maximum fidelity. Do not approximate, reinterpret, beautify, idealize, genericize, randomize, replace, reconstruct, or create lookalikes. Do not generate new faces "based on" the references. The result must depict the exact same real people.

Identity must remain dominant over style, beauty, composition, glamour, mood, lens treatment, makeup, hairstyle, and scene aesthetics.

For every referenced person, preserve without deviation:
overall facial geometry, skull shape, head shape, face width, face length, forehead height and width, hairline shape, eyebrow shape, eyebrow density, eyebrow spacing, eye shape, eye size, eye spacing, eyelid shape, canthal tilt, iris color, pupil appearance, nose bridge, nose width, nose tip, nostril shape, philtrum, mouth width, lip contour, lip proportions, cheek volume, cheekbone placement, midface proportions, jawline, chin shape, ear shape if visible, skin tone, undertone, pore feel, skin texture, under-eye structure, natural asymmetry, freckles, moles, beauty marks, expression lines, and all unique identity markers.

Preserve exact apparent age, exact ethnicity appearance, exact attractiveness level, exact natural imperfections, exact asymmetry, exact proportions, and all non-symmetrical details. Do not make anyone younger, older, prettier, more symmetrical, more glamorous, more generic, more model-like, or more AI-perfect.

If pose, angle, lighting, hairstyle, makeup, expression, lens, styling, wardrobe, or background change, identity must still remain unmistakably the same exact real people. Adapt only perspective, lighting integration, pose adaptation, and scene coherence.

Do not modify facial anatomy for aesthetics. Do not improve proportions. Do not clean up asymmetry. Do not smooth distinctive features. Do not alter the natural relationship between eyes, nose, lips, cheekbones, forehead, and jawline.

Skin must preserve real-person identity texture:
same pore feel, same under-eye topology, same skin thickness impression, same facial planes, same lip texture, same subtle irregularities, same human imperfections.

The final result must look like a real photograph of the exact same people placed into the requested scene, not newly generated people with similar traits.
`.trim();

const NEGATIVE_IDENTITY_DRIFT = `
NEGATIVE IDENTITY DRIFT:

different person, similar person, lookalike, approximate likeness, weak resemblance, face drift, identity drift, altered identity, face mutation, inspired by reference, based on reference, reinterpreted face, reconstructed face, beautified face, glamourized face, idealized face, generic face, generic model face, symmetrical remake, prettier version, younger version, older version, changed ethnicity, changed age, changed skin tone, changed undertone, changed facial anatomy, changed eyes, changed eyelids, changed brows, changed brow spacing, changed iris color, changed nose, changed nostrils, changed lips, changed philtrum, changed cheekbones, changed jawline, changed chin, changed forehead, changed face width, changed face length, changed proportions, changed asymmetry, removed imperfections, smoothed identity, doll face, mannequin face, plastic skin, wax skin, cgi face, ai-perfect face
`.trim();

function normalizeBlock(value?: string | null): string {
  return (value || "").trim();
}

function buildFaceCountBlock(faceCount: number): string {
  if (faceCount <= 1) {
    return `
SUBJECT COUNT AND IDENTITY MAPPING

There is exactly 1 uploaded face identity.
Generate exactly 1 main person unless the style prompt explicitly requires background people.
The main visible subject must use that exact uploaded identity with strict 1:1 fidelity.
Do not invent a second main person.
Do not split, duplicate, blend, or reinterpret the identity.
`.trim();
  }

  return `
SUBJECT COUNT AND IDENTITY MAPPING

There are exactly ${faceCount} uploaded face identities.
Generate exactly ${faceCount} main people and map each visible main subject to one distinct uploaded identity.

Identity assignment rules:
- subject 1 must remain identity 1
- subject 2 must remain identity 2
${faceCount >= 3 ? "- subject 3 must remain identity 3" : ""}
${faceCount >= 4 ? "- subject 4 must remain identity 4" : ""}

Never merge identities.
Never average faces.
Never duplicate one identity across multiple main subjects.
Never swap identities between subjects.
Never reduce multiple uploaded people into one person.
Never invent extra main subjects beyond the uploaded identities unless the style prompt explicitly requires small non-primary background people.

All uploaded people must remain clearly distinct, separately recognizable, and individually faithful to their own reference identity.
If the scene is romantic, family, friendship, or group based, preserve each person as a separate exact real person with consistent facial fidelity.
`.trim();
}

function buildStyleBlock(params: {
  presetTitle?: string | null;
  presetDescription?: string | null;
  presetPromptTemplate?: string | null;
  selectedFormat?: string | null;
  selectedMood?: string | null;
  goal?: string | null;
  notes?: string | null;
}): string {
  const parts = [
    params.presetTitle ? `STYLE TITLE:\n${params.presetTitle.trim()}` : "",
    params.presetDescription
      ? `STYLE DESCRIPTION:\n${params.presetDescription.trim()}`
      : "",
    params.presetPromptTemplate
      ? `STYLE PROMPT:\n${params.presetPromptTemplate.trim()}`
      : "",
    params.selectedFormat
      ? `REQUESTED ORIENTATION OR FORMAT:\n${params.selectedFormat.trim()}`
      : "",
    params.selectedMood ? `MOOD:\n${params.selectedMood.trim()}` : "",
    params.goal ? `GOAL:\n${params.goal.trim()}` : "",
    params.notes ? `USER NOTES:\n${params.notes.trim()}` : "",
  ].filter(Boolean);

  return parts.join("\n\n").trim();
}

export const REFERENCE_ANALYZER_MASTER_PROMPT = `
Analyze the uploaded reference image and convert it into one polished production-ready image-generation prompt.

Return only the final prompt.
Do not add explanations.
Do not add markdown.
Do not add headings.
Do not mention camera if it is not visually justified.
Describe composition, clothing, styling, mood, background, lighting, framing, texture, realism, and visual details clearly and professionally.
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
  const styleBlock = buildStyleBlock(params);

  return [
    FACE_IDENTITY_LOCK_SHARED,
    buildFaceCountBlock(faceCount),
    styleBlock,
    NEGATIVE_IDENTITY_DRIFT,
    "Output a single final production-quality image prompt result that strictly follows the identity lock and style instructions above.",
  ]
    .map(normalizeBlock)
    .filter(Boolean)
    .join("\n\n");
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

  const contextParts = [
    params.selectedFormat
      ? `REQUESTED ORIENTATION OR FORMAT:\n${params.selectedFormat.trim()}`
      : "",
    params.selectedMood ? `MOOD:\n${params.selectedMood.trim()}` : "",
    params.goal ? `GOAL:\n${params.goal.trim()}` : "",
    params.notes ? `USER NOTES:\n${params.notes.trim()}` : "",
  ].filter(Boolean);

  return [
    FACE_IDENTITY_LOCK_SHARED,
    buildFaceCountBlock(faceCount),
    `REFERENCE STYLE PROMPT:\n${params.analyzedReferencePrompt.trim()}`,
    contextParts.join("\n\n").trim(),
    NEGATIVE_IDENTITY_DRIFT,
    "Output a single final production-quality image prompt result that strictly follows the identity lock and the analyzed reference style.",
  ]
    .map(normalizeBlock)
    .filter(Boolean)
    .join("\n\n");
}

export function buildEditPrompt(params: {
  prompt: string;
  faceCount?: number;
}): string {
  const faceCount = Math.max(1, params.faceCount || 1);

  return [
    FACE_IDENTITY_LOCK_SHARED,
    buildFaceCountBlock(faceCount),
    `EDIT INSTRUCTION:\n${params.prompt.trim()}`,
    NEGATIVE_IDENTITY_DRIFT,
    "Apply the requested edit while preserving uploaded identities with strict fidelity.",
  ]
    .map(normalizeBlock)
    .filter(Boolean)
    .join("\n\n");
}
