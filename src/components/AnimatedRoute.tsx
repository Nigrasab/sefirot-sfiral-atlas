import { useEffect, useState } from 'react';
import { sefirot } from '../data/sefirot';

interface AnimatedRouteProps {
  route: number[];
  speed?: number;
}

export default function AnimatedRoute({ route, speed = 1000 }: AnimatedRouteProps) {
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
    <div className="result-box" style={{ marginTop: 16 }}>
      <div className="small muted">Текущая позиция в маршруте</div>
      <div style={{ fontSize: 24, fontWeight: 800, color: '#d4af37' }}>
        {currentSefirah?.name ?? '—'}
      </div>
      <div className="muted small" style={{ marginTop: 8 }}>
        {currentSefirah?.quality}
      </div>
    </div>
  );
}
