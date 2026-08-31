import { useState } from 'react';
import SfiralCanvas2D from '../components/SfiralCanvas2D';

export default function SfiralPage() {
  const [s, setS] = useState(0);

  const zone = s < -0.12 ? 'V−: первый виток' : s > 0.12 ? 'V+: второй виток' : 'S-петля: зона перехода';

  return (
    <div className="page">
      <section className="panel">
        <h2>Сфираль</h2>
        <p className="muted small">
          Сфираль — это два зеркально-антисимметричных витка и S-петля между ними.
          Параметр s показывает внутреннюю фазу движения системы.
        </p>
      </section>

      <div className="grid grid-2">
        <SfiralCanvas2D s={s} />

        <div className="panel">
          <h3>Управление фазой</h3>

          <div className="slider-row">
            <div className="slider-head">
              <span className="muted">Сфиральное время s</span>
              <strong>{s.toFixed(2)}</strong>
            </div>
            <input
              type="range"
              min={-1}
              max={1}
              step={0.01}
              value={s}
              onChange={(event) => setS(Number(event.target.value))}
            />
          </div>

          <div className="result-box" style={{ marginTop: 16 }}>
            <div className="small muted">Текущая зона</div>
            <div>{zone}</div>
          </div>

          <div className="result-box" style={{ marginTop: 12 }}>
            <div className="small muted">Интерпретация</div>
            <div>
              s &lt; 0 — движение в первом витке; s = 0 — зона инверсии; s &gt; 0 — движение
              во втором витке.
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
