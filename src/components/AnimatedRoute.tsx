import { useEffect, useState } from 'react';
import { sefirot } from '../data/sefirot';

interface Props {
  route: number[];
  speed?: number;
}

export default function AnimatedRoute({ route, speed = 1800 }: Props) {
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    if (route.length === 0) return;
    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % route.length);
    }, speed);
    return () => clearInterval(interval);
  }, [route, speed]);

  if (route.length === 0) return null;

  const currentSefirah = sefirot.find((s) => s.id === route[currentIndex]);

  return (
    <div className="result-box" style={{ marginTop: 12 }}>
      <div className="small muted">Текущая позиция в маршруте</div>
      <div style={{ fontSize: 22, fontWeight: 800, color: currentSefirah?.color, marginTop: 4 }}>
        {currentSefirah?.name ?? '—'}
      </div>
      <div className="muted small" style={{ marginTop: 4 }}>
        {currentSefirah?.quality}
      </div>
      <div style={{ marginTop: 8, display: 'flex', gap: 4 }}>
        {route.map((id, idx) => (
          <div
            key={idx}
            style={{
              width: 10,
              height: 10,
              borderRadius: '50%',
              background: idx === currentIndex ? '#d4af37' : 'rgba(255,255,255,0.2)'
            }}
          />
        ))}
      </div>
    </div>
  );
}
