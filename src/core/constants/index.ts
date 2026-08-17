export type FlashlightMode = 'torch' | 'white' | 'morse' | 'strobe';

export const MODE_LABELS: Record<FlashlightMode, string> = {
  torch: 'Torch',
  white: 'White Screen',
  morse: 'Morse Code',
  strobe: 'Strobe',
};

export const MAX_BRIGHTNESS = 1;

export const STROBE_MIN_INTERVAL = 60;
export const STROBE_MAX_INTERVAL = 1000;
export const STROBE_DEFAULT_INTERVAL = 300;

export const MORSE_MIN_UNIT = 60;
export const MORSE_MAX_UNIT = 400;
export const MORSE_DEFAULT_UNIT = 300;
