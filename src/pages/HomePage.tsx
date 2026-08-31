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
            Единая карта Древа Сфирот и Сфирали: 10 сфирот, 22 пути, три колонны,
            два зеркальных витка, S-петля и фазовые переходы — в одной живой модели.
          </p>

          <div className="hero-actions">
            <Link className="button" to="/tree">
              Открыть Древо · Сфираль
            </Link>
            <Link className="button" to="/navigator">
              Навигатор состояния
            </Link>
            <Link className="button secondary" to="/gematria">
              Гематрия
            </Link>
          </div>
        </div>
      </section>

      <section className="grid grid-2">
        <div className="panel">
          <h2>Главная идея</h2>
          <p className="muted">
            Древо Сфирот — это не плоская схема, а проекция сфиральной топологии.
            Левая колонна — это виток V−, правая — V+, центральная — ось инверсии.
            Пути между сфирот — это классы траекторий, а не линии.
          </p>
        </div>

        <div className="panel">
          <h2>Что можно делать</h2>
          <ul className="muted" style={{ paddingLeft: 18, lineHeight: 1.8 }}>
            <li>Видеть Древо и Сфираль одновременно</li>
            <li>Перемещать точку по сфиральной траектории</li>
            <li>Оценивать состояние через 10 качеств</li>
            <li>Строить маршрут перехода</li>
            <li>Считать гематрию слов</li>
            <li>Вести журнал фазовых переходов</li>
            <li>Загружать модель расширяющейся Вселенной</li>
          </ul>
        </div>
      </section>

      <section className="panel">
        <h2>Ключевые соответствия</h2>
        <div className="table-wrap">
          <table>
            <thead>
              <tr>
                <th>Древо</th>
                <th>Сфираль</th>
                <th>Смысл</th>
              </tr>
            </thead>
            <tbody>
              <tr><td>Левая колонна</td><td>Виток V−</td><td>форма, строгость</td></tr>
              <tr><td>Правая колонна</td><td>Виток V+</td><td>расширение, милосердие</td></tr>
              <tr><td>Центр</td><td>Ось инверсии</td><td>равновесие</td></tr>
              <tr><td>Даат</td><td>S-петля</td><td>зона перехода</td></tr>
              <tr><td>Путь меча</td><td>нисхождение по s</td><td>эманация</td></tr>
              <tr><td>Путь змея</td><td>восхождение по s</td><td>возвращение</td></tr>
            </tbody>
          </table>
        </div>
      </section>
    </div>
  );
}
