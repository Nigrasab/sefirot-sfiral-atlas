import { useState } from 'react';
import TreeCanvas from '../components/TreeCanvas';
import { pillarNames, sefirot } from '../data/sefirot';

export default function TreePage() {
  const [selected, setSelected] = useState<number | null>(1);
  const current = sefirot.find((s) => s.id === selected);

  return (
    <div className="page">
      <section className="panel">
        <h2>Древо Сфирот</h2>
        <p className="muted small">
          Нажмите на сфиру, чтобы увидеть название, значение, колонну, мир и ключевые качества.
        </p>
      </section>

      <div className="grid grid-2">
        <TreeCanvas selected={selected} onSelect={setSelected} />

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
