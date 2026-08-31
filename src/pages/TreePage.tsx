import { useState } from 'react';
import TreeCanvas from '../components/TreeCanvas';
import TreeCanvas3D from '../components/TreeCanvas3D';
import { pillarNames, sefirot } from '../data/sefirot';

export default function TreePage() {
  const [selected, setSelected] = useState<number | null>(1);
  const [mode, setMode] = useState<'2d' | '3d'>('2d');
  const current = sefirot.find((s) => s.id === selected);

  return (
    <div className="page">
      <section className="panel">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <h2>Древо Сфирот</h2>
          <div style={{ display: 'flex', gap: 8 }}>
            <button
              className={`button ${mode === '2d' ? 'active' : ''}`}
              onClick={() => setMode('2d')}
            >
              2D
            </button>
            <button
              className={`button ${mode === '3d' ? 'active' : ''}`}
              onClick={() => setMode('3d')}
            >
              3D
            </button>
          </div>
        </div>
        <p className="muted small">
          Нажмите на сфиру, чтобы увидеть название, значение, колонну, мир и ключевые качества.
        </p>
      </section>

      <div className="grid grid-2">
        <div style={{ height: 600 }}>
          {mode === '2d' ? (
            <TreeCanvas selected={selected} onSelect={setSelected} />
          ) : (
            <TreeCanvas3D selected={selected} onSelect={setSelected} />
          )}
        </div>

        <div className="panel">
          {current ? (
            <>
              <div className="badge">{pillarNames[current.pillar]}</div>
              <h2 style={{ marginTop: 12 }}>{current.name}</h2>
              <div className="muted">
                {current.hebrew} · {current.translit}
              </div>

              <p>{current.meaning}</p>

              <div className="result-box">
                <div className="small muted">Качество</div>
                <div>{current.quality}</div>
              </div>

              <div className="result-box" style={{ marginTop: 12 }}>
                <div className="small muted">Мир</div>
                <div>{current.world}</div>
              </div>

              <div className="result-box" style={{ marginTop: 12 }}>
                <div className="small muted">Ключевые слова</div>
                <div>{current.keywords.join(' · ')}</div>
              </div>
            </>
          ) : (
            <p className="muted">Выберите сфиру.</p>
          )}
        </div>
      </div>
    </div>
  );
}
