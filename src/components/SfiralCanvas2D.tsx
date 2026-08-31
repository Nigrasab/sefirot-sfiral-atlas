import { useMemo } from 'react';

interface SfiralCanvas2DProps {
  s: number;
}

function sfiralPoint(s: number): [number, number] {
  const mirror = s <= 0 ? 1 : -1;
  const radius = 150;
  const turns = 2.2;

  const x = 300 + radius * Math.sin(Math.abs(s) * Math.PI * turns) * mirror;
  const y = 320 - s * 240;

  return [x, y];
}

export default function SfiralCanvas2D({ s }: SfiralCanvas2DProps) {
  const leftPoints = useMemo(() => {
    const points: string[] = [];

    for (let i = 0; i <= 120; i++) {
      const t = -1 + (i / 120) * 1;
      const [x, y] = sfiralPoint(t);
      points.push(`${x},${y}`);
    }

    return points.join(' ');
  }, []);

  const rightPoints = useMemo(() => {
    const points: string[] = [];

    for (let i = 0; i <= 120; i++) {
      const t = i / 120;
      const [x, y] = sfiralPoint(t);
      points.push(`${x},${y}`);
    }

    return points.join(' ');
  }, []);

  const [cx, cy] = sfiralPoint(s);

  return (
    <div className="sfiral-wrap">
      <svg viewBox="0 0 600 640">
        <line x1={300} y1={40} x2={300} y2={600} stroke="rgba(255,255,255,0.14)" strokeWidth={1.5} />

        <polyline
          points={leftPoints}
          fill="none"
          stroke="rgba(244,63,94,0.72)"
          strokeWidth={3}
          strokeLinecap="round"
        />

        <polyline
          points={rightPoints}
          fill="none"
          stroke="rgba(125,211,252,0.78)"
          strokeWidth={3}
          strokeLinecap="round"
        />

        <circle cx={300} cy={320} r={10} fill="#d4af37" />
        <circle cx={cx} cy={cy} r={12} fill="#ffffff" opacity={0.92} />

        <text x={45} y={80} fill="#fda4af" fontSize={17}>
          V−
        </text>
        <text x={520} y={80} fill="#7dd3fc" fontSize={17}>
          V+
        </text>
        <text x={315} y={325} fill="#d4af37" fontSize={16}>
          S-петля
        </text>
      </svg>
    </div>
  );
}
