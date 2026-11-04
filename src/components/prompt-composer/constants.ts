import type { GenerationMode } from "@/lib/store";

/** Rotating placeholders, one pool per mode. */
export const promptIdeas: Record<GenerationMode, readonly string[]> = {
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
    "Chrome and magenta liquid metal, high contrast studio light, abstract still life, glossy surface.",
  ],
};

/** The model a mode opens with. */
export const defaultModel: Record<GenerationMode, string> = {
  video: "Chronolab Motion 2",
  image: "Chronolab Image 2",
};
