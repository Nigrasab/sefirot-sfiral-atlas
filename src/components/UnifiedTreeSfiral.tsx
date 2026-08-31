import { sefirot } from '../data/sefirot';
import { treeEdges } from '../data/treeEdges';

interface Props {
  selected: number | null;
  onSelect: (id: number) => void;
  sfiralS: number;
}

export default function UnifiedTreeSfiral({ selected, onSelect, sfiralS }: Props) {
  // Преобразование координат сфирот к экранным
  const toScreen = (x: number, y: number) => ({
    cx: 320 + x * 110,
    cy: 60 + (5 - y) * 95
  });

  // Генерация двух витков Сфирали, огибающих колонны Древа
  const generateSfiralCurve = (side: 'left' | 'right') => {
    const points: string[] = [];
    const steps = 120;
    const sign = side === 'left' ? -1 : 1;

    for (let i = 0; i <= steps; i++) {
      const t = -1 + (i / steps) * 2; // от -1 до +1
      const yNorm = (1 - t) / 2; // от 1 до 0 (сверху вниз)
      const cy = 60 + yNorm * 950;
      
      // Синусоидальное отклонение от центра
      const amplitude = 180 * (1 - Math.abs(t) * 0.3);
      const wave = Math.sin(t * Math.PI * 2.5) * amplitude * sign;
      const cx = 320 + wave;

      points.push(`${cx},${cy}`);
    }
    return points.join(' ');
  };

  // S-петля — центральная зона перехода
  const sLoopY = 60 + ((1 - (sfiralS + 1) / 2) * 950);

  const leftCurve = generateSfiralCurve('left');
  const rightCurve = generateSfiralCurve('right');

  // Точка движения по сфирали
  const movingY = 60 + ((1 - (sfiralS + 1) / 2) * 950);
  const movingX =
    320 +
    (sfiralS <= 0 ? -1 : 1) *
      180 *
      (1 - Math.abs(sfiralS) * 0.3) *
      Math.sin(sfiralS * Math.PI * 2.5);

  return (
    <div className="tree-wrap" style={{ background: 'radial-gradient(ellipse at center, rgba(212,175,55,0.06), transparent 60%)' }}>
      <svg viewBox="0 0 640 1020">
        {/* Зональные подписи колонн */}
        <text x={70} y={40} fill="#ef4444" fontSize={13} opacity={0.7}>
          Левая колонна (V−)
        </text>
        <text x={320} y={40} fill="#d4af37" fontSize={13} textAnchor="middle" opacity={0.7}>
          Центральная ось (S-зона)
        </text>
        <text x={570} y={40} fill="#3b82f6" fontSize={13} textAnchor="end" opacity={0.7}>
          Правая колонна (V+)
        </text>

        {/* Фоновая центральная ось */}
        <line
          x1={320}
          y1={50}
          x2={320}
          y2={1000}
          stroke="rgba(212,175,55,0.18)"
          strokeWidth={1}
          strokeDasharray="4 6"
        />

        {/* Виток V- (левая колонна Сфирали) */}
        <polyline
          points={leftCurve}
          fill="none"
          stroke="rgba(239, 68, 68, 0.55)"
          strokeWidth={2.5}
          strokeLinecap="round"
        />

        {/* Виток V+ (правая колонна Сфирали) */}
        <polyline
          points={rightCurve}
          fill="none"
          stroke="rgba(59, 130, 246, 0.55)"
          strokeWidth={2.5}
          strokeLinecap="round"
        />

        {/* S-зона — горизонтальный индикатор перехода */}
        <line
          x1={120}
          y1={sLoopY}
          x2={520}
          y2={sLoopY}
          stroke="rgba(212,175,55,0.6)"
          strokeWidth={2}
          strokeDasharray="2 4"
        />
        <text x={540} y={sLoopY + 4} fill="#d4af37" fontSize={12}>
          s = {sfiralS.toFixed(2)}
        </text>

        {/* Пути Древа */}
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
              stroke={active ? 'rgba(255,255,255,0.95)' : 'rgba(212,175,55,0.35)'}
              strokeWidth={active ? 2.8 : 1.4}
            />
          );
        })}

        {/* Сфирот */}
        {sefirot.map((sefirah) => {
          const pos = toScreen(sefirah.position.x, sefirah.position.y);
          const isSelected = selected === sefirah.id;

          return (
            <g
              key={sefirah.id}
              className={`sefira-node ${isSelected ? 'selected' : ''}`}
              onClick={() => onSelect(sefirah.id)}
            >
              {/* Внешнее свечение */}
              <circle
                cx={pos.cx}
                cy={pos.cy}
                r={38}
                fill={sefirah.color}
                opacity={0.15}
              />
              {/* Основной узел */}
              <circle
                cx={pos.cx}
                cy={pos.cy}
                r={26}
                fill={sefirah.color}
                opacity={0.92}
                stroke="rgba(255,255,255,0.7)"
                strokeWidth={2}
              />
              {/* Номер */}
              <text
                x={pos.cx}
                y={pos.cy + 6}
                textAnchor="middle"
                fontSize={16}
                fontWeight={700}
                fill={sefirah.id === 3 ? '#ffffff' : '#05070f'}
              >
                {sefirah.id}
              </text>
              {/* Имя */}
              <text
                x={pos.cx}
                y={pos.cy + 48}
                textAnchor="middle"
                fontSize={14}
                fill="#f5f1e8"
              >
                {sefirah.name}
              </text>
              {/* Иврит */}
              <text
                x={pos.cx}
                y={pos.cy + 66}
                textAnchor="middle"
                fontSize={13}
                fill="#b8b2a7"
              >
                {sefirah.hebrew}
              </text>
            </g>
          );
        })}

        {/* Движущаяся точка по Сфирали */}
        <circle
          cx={movingX}
          cy={movingY}
          r={8}
          fill="#ffffff"
          opacity={0.95}
          style={{ filter: 'drop-shadow(0 0 8px #d4af37)' }}
        />
      </svg>
    </div>
  );
}
