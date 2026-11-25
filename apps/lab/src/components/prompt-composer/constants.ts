import type { GenerationMode } from "@/components/studio/types";

export const PROMPT_IDEAS: Record<GenerationMode, readonly string[]> = {
  video: [
    "A slow dolly through a rain-soaked Tokyo alley, neon reflections, anamorphic lens, shallow depth of field.",
    "Fashion campaign on a salt flat at golden hour, yellow tailoring, slow camera push, 35mm film grain.",
    "An astronaut drifting through a violet nebula, volumetric light, IMAX cinematography, dust particles.",
    "Liquid chrome folding into a human face, macro lens, high contrast studio light, seamless loop.",
  ],
  image: [
    "An editorial portrait in cool blue light, direct gaze, subtle film grain, 85mm lens, shallow focus.",
    "Iridescent ceramic form floating in pastel haze, softbox lighting, product study, muted backdrop.",
    "A lone cabin beside an alpine lake, low clouds on the ridge, muted film stock, overcast light.",
    "Chrome and magenta liquid metal, high contrast studio light, abstract tabletop scene, glossy surface.",
  ],
};

export const COMPOSER_COPY = {
  promptLabel: "Describe your generation",
  modeLabels: {
    video: "Video",
    image: "Image",
  },
  aspectRatio: "Aspect ratio",
  duration: "Duration",
  modelLabels: {
    video: "Motion model",
    image: "Image model",
  },
  compareModels: "Compare models and rates",
  loadingModels: "Loading models",
  noModels: "No models available",
  attach: {
    ariaLabel: "Attach reference",
    addReference: "Add reference",
    menuLabel: "Reference",
    upload: "Upload from device",
    paste: "Paste from clipboard",
    fromLibrary: "Choose from library",
    remove: "Remove attachment",
    pastedName: "pasted-reference.png",
  },
  submit: "Start generation",
  shortcut: "⌘ ↵",
  modeLabel: "Generation mode",
};

export const MODE_OPTIONS: { value: GenerationMode; label: string }[] = [
  { value: "video", label: COMPOSER_COPY.modeLabels.video },
  { value: "image", label: COMPOSER_COPY.modeLabels.image },
];
