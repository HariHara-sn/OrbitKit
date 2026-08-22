export type MorseSignal = 'DOT' | 'DASH' | 'CHARACTER_GAP' | 'WORD_GAP';

export const MORSE_LETTERS: ReadonlyArray<readonly [string, string]> = [
  ['A', '.-'],
  ['B', '-...'],
  ['C', '-.-.'],
  ['D', '-..'],
  ['E', '.'],
  ['F', '..-.'],
  ['G', '--.'],
  ['H', '....'],
  ['I', '..'],
  ['J', '.---'],
  ['K', '-.-'],
  ['L', '.-..'],
  ['M', '--'],
  ['N', '-.'],
  ['O', '---'],
  ['P', '.--.'],
  ['Q', '--.-'],
  ['R', '.-.'],
  ['S', '...'],
  ['T', '-'],
  ['U', '..-'],
  ['V', '...-'],
  ['W', '.--'],
  ['X', '-..-'],
  ['Y', '-.--'],
  ['Z', '--..'],
];

export const MORSE_NUMBERS: ReadonlyArray<readonly [string, string]> = [
  ['1', '.----'],
  ['2', '..---'],
  ['3', '...--'],
  ['4', '....-'],
  ['5', '.....'],
  ['6', '-....'],
  ['7', '--...'],
  ['8', '---..'],
  ['9', '----.'],
  ['0', '-----'],
];

export const MORSE_SYMBOLS: ReadonlyArray<readonly [string, string]> = [
  ['.', '.-.-.-'],
  [',', '--..--'],
  ['?', '..--..'],
  ['!', '-.-.--'],
  ['/', '-..-.'],
  ['@', '.--.-.'],
  ['&', '.-...'],
  ['=', '-...-'],
  ['+', '.-.-.'],
  ['-', '-....-'],
  ['_', '..--.-'],
  ['"', '.-..-.'],
  ["'", '.----.'],
  [':', '---...'],
  [';', '-.-.-.'],
  ['(', '-.--.'],
  [')', '-.--.-'],
  ['$', '...-..-'],
  ['%', '----- -..-'],
];

const MORSE_CODES: Record<string, string> = {};
for (const [char, code] of [
  ...MORSE_LETTERS,
  ...MORSE_NUMBERS,
  ...MORSE_SYMBOLS,
]) {
  MORSE_CODES[char] = code;
}

/**
 * Encodes text into an international Morse string.
 * Characters are separated by a space, words by " / ".
 * "SOS" -> "... --- ..."
 */
export const encodeToMorse = (text: string): string =>
  text
    .toUpperCase()
    .trim()
    .split(/\s+/)
    .map(word =>
      word
        .split('')
        .map(char => MORSE_CODES[char] ?? '')
        .filter(Boolean)
        .join(' '),
    )
    .filter(Boolean)
    .join(' / ');

/**
 * Converts an encoded Morse string into discrete transmission tokens so the
 * transmitter can apply exact timings (signal vs gap).
 */
export const morseToSignals = (morse: string): MorseSignal[] => {
  const signals: MorseSignal[] = [];
  for (const char of morse) {
    if (char === '.') {
      signals.push('DOT');
    } else if (char === '-') {
      signals.push('DASH');
    } else if (char === ' ') {
      signals.push('CHARACTER_GAP');
    } else if (char === '/') {
      signals.push('WORD_GAP');
    }
  }
  return signals;
};
