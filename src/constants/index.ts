export type FlashlightMode = 'torch' | 'white' | 'dj' | 'strobe';

export const MODE_LABELS: Record<FlashlightMode, string> = {
  torch: 'Torch',
  white: 'White Screen',
  dj: 'DJ',
  strobe: 'Strobe',
};

export const MAX_BRIGHTNESS = 1;

export const STROBE_MIN_INTERVAL = 60;
export const STROBE_MAX_INTERVAL = 1000;
export const STROBE_DEFAULT_INTERVAL = 300;
