import { useState } from 'react';
import { letters } from '../data/letters';
import { sefirot } from '../data/sefirot';
import { hebrewValue, reduceToPath, reduceToSefirah } from '../lib/gematria';

export default function GematriaPage() {
  const [text, setText] = useState('אמת');

  const value = hebrewValue(text);
  const sefirahId = reduceToSefirah(value);
  const pathId = reduceToPath(value);

  const sefirah = sefirot.find((s) => s.id === sefirahId);
  const letter = letters[pathId - 1];

  return (
    <div className="page">
      <section className="panel">
        <h2>Гематрия</h2>
        <p className="muted small">
          Введите слово буквами иврита. Приложение посчитает числовое значение и сопоставит его
          с сфирой и путём.
        </p>
      </section>

      <div className="grid grid-2">
        <div className="panel">
          <h3>Ввод</h3>

          <input
            className="input"
            dir="rtl"
            value={text}
            onChange={(event) => setText(event.target.value)}
            placeholder="כתוב כאן"
          />

          <p className="muted small" style={{ marginTop: 12 }}>
            Пример: אמת
          </p>
        </div>

        <div className="panel">
          <h3>Результат</h3>

          <div className="stat-grid">
            <div className="stat-card">
              <div className="stat-label">Число</div>
              <div className="stat-value">{value}</div>
            </div>

            <div className="stat-card">
              <div className="stat-label">Сфира</div>
              <div className="stat-value">{sefirah?.name ?? '—'}</div>
            </div>

            <div className="stat-card">
              <div className="stat-label">Путь</div>
              <div className="stat-value">{pathId}</div>
            </div>

            <div className="stat-card">
              <div className="stat-label">Буква пути</div>
              <div className="stat-value">
                {letter ? `${letter.hebrew} ${letter.name}` : '—'}
              </div>
            </div>
          </div>

          <div className="result-box" style={{ marginTop: 12 }}>
            <div className="small muted">Смысл буквы</div>
            <div>{letter?.meaning ?? '—'}</div>
          </div>
        </div>
      </div>
    </div>
  );
}
