import { useState } from 'react';
import UnifiedTreeSfiral3D from '../components/UnifiedTreeSfiral3D';
import { pillarNames, sefirot } from '../data/sefirot';

export default function TreePage() {
  const [selected, setSelected] = useState<number | null>(6);
  const [sfiralS, setSfiralS] = useState(0);

  const current = sefirot.find((s) => s.id === selected);

  const sfiralZone =
    sfiralS < -0.15
      ? 'V− : первый виток (левая колонна)'
      : sfiralS > 0.15
        ? 'V+ : второй виток (правая колонна)'
        : 'S-петля : центральная ось инверсии';

  return (
    <div className="page">
      <section className="panel">
        <h2>3D-карта: Древо Сфирот + Сфираль</h2>
        <p className="muted small">
          Интерактивная 3D-модель. Вращайте сцену мышью (зажмите и тяните),
          масштабируйте колёсиком. Два витка Сфирали (синий V+ и красный V−)
          огибают колонны Древа, золотая точка движется по сфиральной траектории.
        </p>
      </section>

      <UnifiedTreeSfiral3D
        selected={selected}
        onSelect={setSelected}
        sfiralS={sfiralS}
      />

      <div className="grid grid-2">
        <div className="panel">
          {current ? (
            <>
              <div className="badge">
                <span style={{ color: current.color }}>●</span>
                {pillarNames[current.pillar]}
              </div>

              <h2 style={{ marginTop: 12 }}>
                {current.name} <span className="muted">({current.translit})</span>
              </h2>

              <div style={{ fontSize: 28, color: current.color }}>
                {current.hebrew}
              </div>

              <p style={{ marginTop: 12 }}>{current.meaning}</p>

              <div className="result-box">
                <div className="small muted">Качество</div>
                <div>{current.quality}</div>
              </div>

              <div className="result-box" style={{ marginTop: 10 }}>
                <div className="small muted">Мир проявления</div>
                <div>{current.world}</div>
              </div>

              <div className="result-box" style={{ marginTop: 10 }}>
                <div className="small muted">Ключевые слова</div>
                <div>{current.keywords.join(' · ')}</div>
              </div>

              <div className="result-box" style={{ marginTop: 10 }}>
                <div className="small muted">В сфиральной топологии</div>
                <div>
                  {current.pillar === 'left' &&
                    'Левый виток V−: форма, ограничение, анализ, сжатие.'}
                  {current.pillar === 'right' &&
                    'Правый виток V+: расширение, импульс, отдача, движение.'}
                  {current.pillar === 'central' &&
                    'Центральная ось: инвариантное преобразование, инверсия, баланс.'}
                </div>
              </div>
            </>
          ) : (
            <p className="muted">Выберите сфиру на 3D-сцене.</p>
          )}
        </div>

        <div className="panel">
          <h3 style={{ marginTop: 0 }}>Сфиральное время s</h3>

          <div className="slider-row">
            <div className="slider-head">
              <span className="muted">Параметр фазы</span>
              <strong>{sfiralS.toFixed(2)}</strong>
            </div>

            <input
              type="range"
              min={-1}
              max={1}
              step={0.01}
              value={sfiralS}
              onChange={(event) => setSfiralS(Number(event.target.value))}
            />
          </div>

          <div className="result-box" style={{ marginTop: 10 }}>
            <div className="small muted">Текущая зона</div>
            <div style={{ fontWeight: 600 }}>{sfiralZone}</div>
          </div>

          <div className="result-box" style={{ marginTop: 10 }}>
            <div className="small muted">Интерпретация</div>
            <div className="small">
              Двигая слайдер, вы перемещаете золотую точку по сфиральной
              траектории: от красного витка V− через S-петлю (зону инверсии)
              к синему витку V+. Это модель фазового перехода.
            </div>
          </div>

          <div style={{ display: 'flex', gap: 6, marginTop: 12, flexWrap: 'wrap' }}>
            <button className="button secondary" onClick={() => setSfiralS(-1)}>
              V−
            </button>
            <button className="button secondary" onClick={() => setSfiralS(-0.5)}>
              −0.5
            </button>
            <button className="button active" onClick={() => setSfiralS(0)}>
              S-петля
            </button>
            <button className="button secondary" onClick={() => setSfiralS(0.5)}>
              +0.5
            </button>
            <button className="button secondary" onClick={() => setSfiralS(1)}>
              V+
            </button>
          </div>

          <section className="panel" style={{ marginTop: 20, background: 'transparent', border: 'none', padding: 0, boxShadow: 'none' }}>
            <h4 style={{ marginTop: 0 }}>Сопоставление</h4>
            <div className="table-wrap">
              <table>
                <thead>
                  <tr>
                    <th>Древо</th>
                    <th>Сфираль</th>
                  </tr>
                </thead>
                <tbody>
                  <tr><td>Сфира</td><td>Узел состояния</td></tr>
                  <tr><td>Путь (22)</td><td>Класс траектории</td></tr>
                  <tr><td>Левая колонна</td><td>Виток V−</td></tr>
                  <tr><td>Правая колонна</td><td>Виток V+</td></tr>
                  <tr><td>Центральная</td><td>Ось инверсии</td></tr>
                  <tr><td>Даат</td><td>S-петля</td></tr>
                </tbody>
              </table>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}
