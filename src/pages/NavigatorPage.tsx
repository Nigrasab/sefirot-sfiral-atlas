import { useMemo, useState } from 'react';
import { sefirot } from '../data/sefirot';
import { calculateBalance } from '../lib/balance';
import { shortestPath } from '../lib/graph';
import AnimatedRoute from '../components/AnimatedRoute';

export default function NavigatorPage() {
  const initial = useMemo(
    () => Object.fromEntries(sefirot.map((s) => [s.id, 5])) as Record<number, number>,
    []
  );

  const [values, setValues] = useState(initial);
  const [from, setFrom] = useState(10);
  const [to, setTo] = useState(1);

  const balance = calculateBalance(values);
  const route = shortestPath(from, to);

  const routeNames = route
    .map((id) => sefirot.find((s) => s.id === id)?.name)
    .filter(Boolean)
    .join(' → ');

  const recommendation =
    balance.dominant === 'left'
      ? 'Состояние содержит много ограничения и анализа. Рекомендуется активировать расширяющие и сердечные качества (Хесед, Тиферет).'
      : balance.dominant === 'right'
        ? 'Состояние содержит много расширения и импульса. Полезно добавить форму, границу и точность (Гвура, Ход).'
        : balance.dominant === 'central'
          ? 'Центральная ось выражена хорошо. Можно углублять равновесие и переход к проявлению (Малхут).'
          : 'Состояние смешанное. Рекомендуется стабилизировать центральную ось через Тиферет.';

  const handleExport = () => {
    const state = {
      values,
      from,
      to,
      route,
      routeNames,
      balance,
      recommendation,
      timestamp: Date.now(),
      date: new Date().toISOString()
    };
    const blob = new Blob([JSON.stringify(state, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `ssa-state-${Date.now()}.json`;
    link.click();
    URL.revokeObjectURL(url);
  };

  const handleSave = () => {
    const state = {
      values,
      from,
      to,
      route,
      routeNames,
      balance,
      recommendation,
      timestamp: Date.now()
    };
    const existing = JSON.parse(localStorage.getItem('ssa-journal') || '[]');
    existing.push(state);
    localStorage.setItem('ssa-journal', JSON.stringify(existing));
    alert('Состояние сохранено в журнал');
  };

  return (
    <div className="page">
      <section className="panel">
        <h2>Навигатор состояния</h2>
        <p className="muted small">
          Оцените 10 качеств по шкале от 0 до 10. Приложение посчитает баланс колонн,
          построит маршрут между сфирот и предложит фазовый переход.
        </p>
      </section>

      <div className="grid grid-2">
        <div className="panel">
          <h3>Качества (по сфирот)</h3>

          {sefirot.map((sefirah) => (
            <div className="slider-row" key={sefirah.id}>
              <div className="slider-head">
                <span>
                  <span style={{ color: sefirah.color, marginRight: 6 }}>●</span>
                  {sefirah.name}
                </span>
                <span className="muted small">{values[sefirah.id] ?? 5}</span>
              </div>

              <input
                type="range"
                min={0}
                max={10}
                step={1}
                value={values[sefirah.id] ?? 5}
                onChange={(event) =>
                  setValues((prev) => ({
                    ...prev,
                    [sefirah.id]: Number(event.target.value)
                  }))
                }
              />
              <div className="muted small">{sefirah.quality}</div>
            </div>
          ))}
        </div>

        <div className="panel">
          <h3>Маршрут и баланс</h3>

          <div className="grid" style={{ marginBottom: 14 }}>
            <label className="small muted">
              Откуда (текущее состояние)
              <select
                className="select"
                value={from}
                onChange={(event) => setFrom(Number(event.target.value))}
              >
                {sefirot.map((s) => (
                  <option key={s.id} value={s.id}>
                    {s.id}. {s.name} ({s.translit})
                  </option>
                ))}
              </select>
            </label>

            <label className="small muted">
              Куда (целевое состояние)
              <select
                className="select"
                value={to}
                onChange={(event) => setTo(Number(event.target.value))}
              >
                {sefirot.map((s) => (
                  <option key={s.id} value={s.id}>
                    {s.id}. {s.name} ({s.translit})
                  </option>
                ))}
              </select>
            </label>
          </div>

          <div className="result-box">
            <div className="small muted">Маршрут перехода</div>
            <div style={{ fontSize: 18, fontWeight: 700, marginTop: 4 }}>
              {routeNames || '—'}
            </div>
          </div>

          <AnimatedRoute route={route} speed={1800} />

          <div className="stat-grid" style={{ marginTop: 12 }}>
            <div className="stat-card">
              <div className="stat-label">Левая колонна</div>
              <div className="stat-value">{balance.left}</div>
              <div className="muted small">строгость, форма</div>
            </div>

            <div className="stat-card">
              <div className="stat-label">Правая колонна</div>
              <div className="stat-value">{balance.right}</div>
              <div className="muted small">милосердие, расширение</div>
            </div>

            <div className="stat-card">
              <div className="stat-label">Центральная колонна</div>
              <div className="stat-value">{balance.central}</div>
              <div className="muted small">равновесие</div>
            </div>

            <div className="stat-card">
              <div className="stat-label">Напряжение L–R</div>
              <div className="stat-value">{balance.tension}</div>
              <div className="muted small">
                {balance.tension > 10 ? 'высокое' : balance.tension > 5 ? 'среднее' : 'низкое'}
              </div>
            </div>
          </div>

          <div className="result-box" style={{ marginTop: 12 }}>
            <div className="small muted">Рекомендация</div>
            <div style={{ marginTop: 4 }}>{recommendation}</div>
          </div>

          <div style={{ display: 'flex', gap: 8, marginTop: 16, flexWrap: 'wrap' }}>
            <button className="button" onClick={handleSave}>
              Сохранить в журнал
            </button>
            <button className="button" onClick={handleExport}>
              Экспорт JSON
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
