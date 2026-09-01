import { useState } from 'react';
import UnifiedTreeSfiral3D from '../components/UnifiedTreeSfiral3D';
import { pillarNames, sefirot } from '../data/sefirot';

export default function TreePage() {
  const [selectedSefira, setSelectedSefira] = useState<number | null>(6);
  const [sfiralPhase, setSfiralPhase] = useState(0.5);
  const [activeSide, setActiveSide] = useState<1 | -1>(1);
  const [fractalLevels, setFractalLevels] = useState<boolean[]>([true, true, true]);
  const [universeOpacity, setUniverseOpacity] = useState(0.12);

  const current = sefirot.find((s) => s.id === selectedSefira);

  const toggleLevel = (idx: number) => {
    setFractalLevels((prev) => prev.map((v, i) => (i === idx ? !v : v)));
  };

  return (
    <div className="tree-page-layout">
      {/* Окно визуализации: узкое, вытянутое по вертикали */}
      <div className="animation-window">
        <UnifiedTreeSfiral3D
          selectedSefira={selectedSefira}
          onSelectSefira={setSelectedSefira}
          sfiralPhase={sfiralPhase}
          activeSide={activeSide}
          fractalLevels={fractalLevels}
          universeOpacity={universeOpacity}
        />
      </div>

      {/* Приборная доска справа */}
      <div className="control-panel">
        <div className="panel">
          <h2>Древо · Сфираль</h2>
          <p className="muted small">
            Модель расширяющейся Вселенной пространственно совмещена с Древом:
            продольная ось Сфиралей = центральная колонна Древа.
            Две зеркальные цепочки = левая и правая колонны.
          </p>
        </div>

        {/* Активная сфиральная траектория */}
        <div className="panel">
          <h3>Сфиральная траектория</h3>

          <div className="slider-row">
            <div className="slider-head">
              <span className="muted">Фаза перехода</span>
              <strong>{sfiralPhase.toFixed(2)}</strong>
            </div>
            <input
              type="range"
              min={0}
              max={1}
              step={0.01}
              value={sfiralPhase}
              onChange={(e) => setSfiralPhase(Number(e.target.value))}
            />
          </div>

          <div className="fractal-toggles">
            <label className="toggle-item">
              <input
                type="radio"
                name="activeSide"
                checked={activeSide === 1}
                onChange={() => setActiveSide(1)}
              />
              <span>Правая цепочка (Хесед / Нецах)</span>
            </label>

            <label className="toggle-item">
              <input
                type="radio"
                name="activeSide"
                checked={activeSide === -1}
                onChange={() => setActiveSide(-1)}
              />
              <span>Левая цепочка (Гвура / Ход)</span>
            </label>
          </div>
        </div>

        {/* Модель Вселенной */}
        <div className="panel">
          <h3>Модель Вселенной</h3>

          <div className="slider-row">
            <div className="slider-head">
              <span className="muted">Прозрачность</span>
              <strong>{universeOpacity.toFixed(2)}</strong>
            </div>
            <input
              type="range"
              min={0.02}
              max={0.5}
              step={0.01}
              value={universeOpacity}
              onChange={(e) => setUniverseOpacity(Number(e.target.value))}
            />
          </div>

          <div className="fractal-toggles">
            <label className="toggle-item">
              <input
                type="checkbox"
                checked={fractalLevels[0]}
                onChange={() => toggleLevel(0)}
              />
              <span>Масштаб 1 (144 узла)</span>
            </label>

            <label className="toggle-item">
              <input
                type="checkbox"
                checked={fractalLevels[1]}
                onChange={() => toggleLevel(1)}
              />
              <span>Масштаб 0.5 (288 узлов)</span>
            </label>

            <label className="toggle-item">
              <input
                type="checkbox"
                checked={fractalLevels[2]}
                onChange={() => toggleLevel(2)}
              />
              <span>Масштаб 0.25 (576 узлов)</span>
            </label>
          </div>
        </div>

        {/* Выбранная сфира */}
        <div className="panel">
          <h3>Сфира</h3>
          {current ? (
            <>
              <div className="badge">
                <span style={{ color: current.color }}>●</span>
                {pillarNames[current.pillar]}
              </div>

              <div style={{ marginTop: 10, fontSize: 18, fontWeight: 700 }}>
                {current.name} <span className="muted">({current.translit})</span>
              </div>
              <div style={{ fontSize: 24, color: current.color, marginTop: 2 }}>
                {current.hebrew}
              </div>

              <p style={{ marginTop: 10 }}>{current.meaning}</p>

              <div className="result-box" style={{ marginTop: 10 }}>
                <div className="small muted">Качество</div>
                <div>{current.quality}</div>
              </div>

              <div className="result-box" style={{ marginTop: 8 }}>
                <div className="small muted">Мир</div>
                <div>{current.world}</div>
              </div>

              <div className="result-box" style={{ marginTop: 8 }}>
                <div className="small muted">Ключевые слова</div>
                <div>{current.keywords.join(' · ')}</div>
              </div>
            </>
          ) : (
            <p className="muted">Выберите сфиру в окне визуализации.</p>
          )}
        </div>

        {/* Структурное соответствие */}
        <div className="panel">
          <h4>Совмещение модели и Древа</h4>
          <div className="table-wrap">
            <table>
              <thead>
                <tr>
                  <th>Древо</th>
                  <th>Модель</th>
                </tr>
              </thead>
              <tbody>
                <tr><td>Центральная колонна</td><td>Продольная ось Сфиралей</td></tr>
                <tr><td>Левая колонна</td><td>Левая цепочка (зеркальная)</td></tr>
                <tr><td>Правая колонна</td><td>Правая цепочка</td></tr>
                <tr><td>Тиферет</td><td>Узел инверсии / ROUTER_SWAP</td></tr>
                <tr><td>Даат</td><td>S-переход</td></tr>
                <tr><td>Эманация</td><td>Масштабное ветвление 1→0.5→0.25</td></tr>
                <tr><td>22 пути</td><td>Классы траекторий перехода</td></tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}
