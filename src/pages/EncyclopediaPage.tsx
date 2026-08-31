import { letters } from '../data/letters';
import { pillarNames, sefirot } from '../data/sefirot';

export default function EncyclopediaPage() {
  return (
    <div className="page">
      <section className="panel">
        <h2>Энциклопедия</h2>
        <p className="muted small">
          Базовые значения 10 сфирот и 22 букв иврита.
        </p>
      </section>

      <section className="panel">
        <h3>Сфирот</h3>

        <div className="table-wrap">
          <table>
            <thead>
              <tr>
                <th>№</th>
                <th>Имя</th>
                <th>Иврит</th>
                <th>Колонна</th>
                <th>Мир</th>
                <th>Значение</th>
              </tr>
            </thead>

            <tbody>
              {sefirot.map((s) => (
                <tr key={s.id}>
                  <td>{s.id}</td>
                  <td>{s.name}</td>
                  <td>{s.hebrew}</td>
                  <td>{pillarNames[s.pillar]}</td>
                  <td>{s.world}</td>
                  <td>{s.meaning}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      <section className="panel">
        <h3>22 буквы иврита</h3>

        <div className="table-wrap">
          <table>
            <thead>
              <tr>
                <th>Буква</th>
                <th>Имя</th>
                <th>Значение</th>
                <th>Тип</th>
                <th>Смысл</th>
              </tr>
            </thead>

            <tbody>
              {letters.map((letter) => (
                <tr key={letter.id}>
                  <td>{letter.hebrew}</td>
                  <td>{letter.name}</td>
                  <td>{letter.value}</td>
                  <td>{letter.type}</td>
                  <td>{letter.meaning}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  );
}
