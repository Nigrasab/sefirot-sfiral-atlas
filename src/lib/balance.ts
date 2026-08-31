export const LEFT_PILLAR = [3, 5, 8];
export const RIGHT_PILLAR = [2, 4, 7];
export const CENTRAL_PILLAR = [1, 6, 9, 10];

export interface BalanceResult {
  left: number;
  right: number;
  central: number;
  tension: number;
  coherence: number;
  dominant: 'left' | 'right' | 'central' | 'mixed';
}

export function calculateBalance(values: Record<number, number>): BalanceResult {
  const sum = (ids: number[]) => ids.reduce((acc, id) => acc + (values[id] ?? 0), 0);

  const left = sum(LEFT_PILLAR);
  const right = sum(RIGHT_PILLAR);
  const central = sum(CENTRAL_PILLAR);

  const tension = Math.abs(left - right);
  const total = left + right + central + 0.0001;
  const coherence = central / total;

  let dominant: BalanceResult['dominant'] = 'mixed';

  if (central > left && central > right) dominant = 'central';
  else if (left > right && left > central) dominant = 'left';
  else if (right > left && right > central) dominant = 'right';

  return {
    left,
    right,
    central,
    tension,
    coherence,
    dominant
  };
}
