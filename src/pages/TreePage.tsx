import { useState } from 'react';
import UnifiedTreeSfiral from '../components/UnifiedTreeSfiral';
import { pillarNames, sefirot } from '../data/sefirot';

export default function TreePage() {
  const [selected, setSelected] = useState<number | null>(6); // Тиферет по умолчанию
  const [sfiralS, setSfiralS] = useState(0);
  const current = sefirot.find((s) => s.id === selected);

  const sfiralZone =
    sfiralS < -0.15 ? 'V− : первый виток (левая колонна)' :
    sfiralS > 0.15 ? 'V+ : второй виток (правая колонна)' :
    'S-петля : центральная ось инверсии';

  return (
    <div className="page">
      <section className="panel">
        <h2>Единая карта: Древо Сфирот + Сфираль</h2>
        <p className="muted small">
          Древо Сфирот как проекция сфиральной топологии. Два витка Сфирали соответствуют
          левой и правой колоннам Древа; центральная ось — зона S-петли и фазовых переходов.
        </p>
      </section>

      <div className="grid grid-2">
        <UnifiedTreeSfiral
          selected={selected}
          onSelect={setSelected}
          sfiralS={sfiralS}
        />

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
              <div style={{ fontSize: 28, color: current.color }}>{current.hebrew}</div>

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
                  {current.pillar === 'left' && 'Левый виток V−: форма, ограничение, анализ, сжатие.'}
                  {current.pillar === 'right' && 'Правый виток V+: расширение, импульс, отдача, движение.'}
                  {current.pillar === 'central' && 'Центральная ось: инвариантное преобразование, инверсия, баланс.'}
                </div>
              </div>
            </>
          ) : (
            <p className="muted">Выберите сфиру на карте.</p>
          )}

          <div style={{ marginTop: 22, borderTop: '1px solid rgba(255,255,255,0.08)', paddingTop: 18 }}>
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
                Двигая слайдер, вы перемещаете точку по сфиральной траектории:
                от левого витка через S-петлю (зону инверсии и выбора) к правому витку.
                Это модель любого фазового перехода — кризиса, решения, переоценки.
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
          </div>
        </div>
      </div>

      {/* Поясняющая таблица соответствий */}
      <section className="panel" style={{ marginTop: 20 }}>
        <h3>Сопоставление Древа и Сфирали</h3>
        <div className="table-wrap">
          <table>
            <thead>
              <tr>
                <th>Древо Сфирот</th>
                <th>Сфиральная модель</th>
                <th>Смысл</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>Сфира</td>
                <td>Узел состояния</td>
                <td>Локализованная конфигурация системы</td>
              </tr>
              <tr>
                <td>Путь (22)</td>
                <td>Класс траектории</td>
                <td>Допустимый топологический переход</td>
              </tr>
              <tr>
                <td>Левая колонна</td>
                <td>Виток V−</td>
                <td>Строгость, форма, сжатие</td>
              </tr>
              <tr>
                <td>Правая колонна</td>
                <td>Виток V+</td>
                <td>Милосердие, расширение</td>
              </tr>
              <tr>
                <td>Центральная колонна</td>
                <td>Ось инверсии</td>
                <td>Равновесие, баланс</td>
              </tr>
              <tr>
                <td>Даат</td>
                <td>S-петля</td>
                <td>Зона фазового перехода, скрытое знание</td>
              </tr>
              <tr>
                <td>Путь огненного меча</td>
                <td>Нисхождение по s</td>
                <td>Эманация: от Кетер к Малхут</td>
              </tr>
              <tr>
                <td>Путь змея</td>
                <td>Восхождение по s</td>
                <td>Возвращение: от Малхут к Кетер</td>
              </tr>
              <tr>
                <td>Эманация</td>
                <td>Масштабное ветвление</td>
                <td>Фрактальное вложение (1 → 0.5 → 0.25)</td>
              </tr>
            </tbody>
          </table>
        </div>
      </section>
    </div>
  );
}
