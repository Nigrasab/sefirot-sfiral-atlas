import { useState } from 'react';
import UnifiedTreeSfiral3D from '../components/UnifiedTreeSfiral3D';
import { pillarNames, sefirot } from '../data/sefirot';

export default function TreePage() {
  const [selectedSefira, setSelectedSefira] = useState<number | null>(6);
  const [activeSfiralIndex, setActiveSfiralIndex] = useState(0);
  const [sfiralPhase, setSfiralPhase] = useState(0.5);
  const [fractalLevels, setFractalLevels] = useState<boolean[]>([true, true, true]);
  const [universeOpacity, setUniverseOpacity] = useState(0.14);

  const current = sefirot.find((s) => s.id === selectedSefira);
  const groupAngle = ((activeSfiralIndex / 72) * 360).toFixed(1);
  const linkedSefira = sefirot[(activeSfiralIndex % 10)];

  const toggleLevel = (idx: number) => {
    setFractalLevels((prev) => prev.map((v, i) => (i === idx ? !v : v)));
  };

  return (
    <div className="tree-page-layout">
      {/* Узкое вертикальное окно анимации */}
      <div className="animation-window">
        <UnifiedTreeSfiral3D
          selectedSefira={selectedSefira}
          onSelectSefira={setSelectedSefira}
          activeSfiralIndex={activeSfiralIndex}
          sfiralPhase={sfiralPhase}
          fractalLevels={fractalLevels}
          universeOpacity={universeOpacity}
        />
      </div>

      {/* Приборная доска справа */}
      <div className="control-panel">
        <div className="panel">
          <h2>Древо · Сфираль</h2>
          <p className="muted small">
            Модель расширяющейся Вселенной — полупрозрачный круговорот Сфиралей вокруг Древа.
            Центральная колонна Древа совпадает с продольной осью Сфирали.
          </p>
        </div>

        {/* Активная Сфираль */}
        <div className="panel">
          <h3>Активная Сфираль</h3>

          <div className="slider-row">
            <div className="slider-head">
              <span className="muted">Группа (0–71)</span>
              <strong>{activeSfiralIndex}</strong>
            </div>
            <input
              type="range"
              min={0}
              max={71}
              step={1}
              value={activeSfiralIndex}
              onChange={(e) => setActiveSfiralIndex(Number(e.target.value))}
            />
          </div>

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

          <div className="result-box">
            <div className="small muted">Угол группы</div>
            <div>{groupAngle}°</div>
          </div>

          <div className="result-box" style={{ marginTop: 8 }}>
            <div className="small muted">Связана с сфирой</div>
            <div>
              {linkedSefira ? `${linkedSefira.id}. ${linkedSefira.name} (${linkedSefira.hebrew})` : '—'}
            </div>
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
              <span>Масштаб 1</span>
            </label>

            <label className="toggle-item">
              <input
                type="checkbox"
                checked={fractalLevels[1]}
                onChange={() => toggleLevel(1)}
              />
              <span>Масштаб 0.5</span>
            </label>

            <label className="toggle-item">
              <input
                type="checkbox"
                checked={fractalLevels[2]}
                onChange={() => toggleLevel(2)}
              />
              <span>Масштаб 0.25</span>
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
            <p className="muted">Выберите сфиру в окне анимации.</p>
          )}
        </div>
      </div>
    </div>
  );
}
