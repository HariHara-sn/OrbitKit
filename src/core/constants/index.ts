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

export const AUTO_OFF_TIMER_NEVER = 0;

export const AUTO_OFF_TIMER_OPTIONS: ReadonlyArray<{ label: string; value: number }> = [
  { label: 'Never', value: AUTO_OFF_TIMER_NEVER },
  { label: '10 seconds', value: 10 },
  { label: '30 seconds', value: 30 },
  { label: '1 minute', value: 60 },
  { label: '5 minutes', value: 300 },
  { label: '10 minutes', value: 600 },
  { label: '30 minutes', value: 1800 },
];

export const DEFAULT_SETTINGS = {
  automaticOn: false,
  flashlightStayOn: false,
  shakeToSwitch: false,
  notificationToolbarToggle: false,
  compass: false,
  sound: false,
  haptic: true,
  powerControl: false,
  automaticOff: false,
  automaticOffTimer: AUTO_OFF_TIMER_NEVER,
} as const;
