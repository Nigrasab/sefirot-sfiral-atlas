import { sefirot } from '../data/sefirot';
import { treeEdges } from '../data/treeEdges';

interface TreeCanvasProps {
  selected: number | null;
  onSelect: (id: number) => void;
}

export default function TreeCanvas({ selected, onSelect }: TreeCanvasProps) {
  const toScreen = (x: number, y: number) => ({
    cx: 300 + x * 95,
    cy: 100 + (5 - y) * 82
  });

  return (
    <div className="tree-wrap">
      <svg viewBox="0 0 600 860">
        {treeEdges.map(([from, to], index) => {
          const a = sefirot.find((s) => s.id === from)!;
          const b = sefirot.find((s) => s.id === to)!;

          const p1 = toScreen(a.position.x, a.position.y);
          const p2 = toScreen(b.position.x, b.position.y);

          const active = selected !== null && (selected === from || selected === to);

          return (
            <line
              key={index}
              x1={p1.cx}
              y1={p1.cy}
              x2={p2.cx}
              y2={p2.cy}
              stroke={active ? 'rgba(212,175,55,0.9)' : 'rgba(212,175,55,0.28)'}
              strokeWidth={active ? 3.4 : 2}
            />
          );
        })}

        {sefirot.map((sefirah) => {
          const pos = toScreen(sefirah.position.x, sefirah.position.y);
          const isSelected = selected === sefirah.id;

          return (
            <g
              key={sefirah.id}
              className={`sefira-node ${isSelected ? 'selected' : ''}`}
              onClick={() => onSelect(sefirah.id)}
            >
              <circle
                cx={pos.cx}
                cy={pos.cy}
                r={28}
                fill={sefirah.color}
                opacity={0.88}
                stroke="rgba(255,255,255,0.65)"
                strokeWidth={2}
              />

              <text
                x={pos.cx}
                y={pos.cy + 6}
                textAnchor="middle"
                fontSize={18}
                fill={sefirah.id === 3 ? '#ffffff' : '#05070f'}
              >
                {sefirah.id}
              </text>

              <text
                x={pos.cx}
                y={pos.cy + 48}
                textAnchor="middle"
                fontSize={15}
                fill="#f5f1e8"
              >
                {sefirah.name}
              </text>
            </g>
          );
        })}
      </svg>
    </div>
  );
}
