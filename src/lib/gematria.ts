import { letters } from '../data/letters';

export function hebrewValue(text: string): number {
  let sum = 0;

  for (const char of text.trim()) {
    const letter = letters.find((item) => item.hebrew === char);
    if (letter) {
      sum += letter.value;
    }
  }

  return sum;
}

export function reduceToSefirah(value: number): number {
  if (value <= 0) return 10;
  return ((value - 1) % 10) + 1;
}

export function reduceToPath(value: number): number {
  if (value <= 0) return 22;
  return ((value - 1) % 22) + 1;
}
