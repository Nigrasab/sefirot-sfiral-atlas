import { Link } from 'react-router-dom';

export default function HomePage() {
  return (
    <div className="page">
      <section className="hero">
        <div>
          <h1>
            Sefirot–Sfiral
            <br />
            Atlas
          </h1>

          <p>
            Интерактивная модель Древа Сфирот и Сфирали: 10 сфирот, 22 пути, три колонны,
            фазовые переходы, маршруты состояний, гематрия и визуализация внутренних процессов.
          </p>

          <div className="hero-actions">
            <Link className="button" to="/tree">
              Открыть Древо
            </Link>
            <Link className="button" to="/sfiral">
              Запустить Сфираль
            </Link>
            <Link className="button" to="/navigator">
              Начать навигацию
            </Link>
          </div>
        </div>
      </section>

      <section className="grid grid-2">
        <div className="panel">
          <h2>Что это даёт</h2>
          <p className="muted">
            Приложение помогает изучать Древо Сфирот не как статичную схему, а как живую
            навигационную систему: видеть сфирот, пути, баланс колонн, маршруты переходов
            и фазовую динамику Сфирали.
          </p>
        </div>

        <div className="panel">
          <h2>Основные модули</h2>
          <ul className="muted">
            <li>Древо Сфирот с названиями и значениями</li>
            <li>Сфираль с параметром s и S-петлёй</li>
            <li>Навигатор состояния</li>
            <li>Гематрия</li>
            <li>Энциклопедия</li>
            <li>Лаборатория будущих моделей</li>
          </ul>
        </div>
      </section>
    </div>
  );
}
