export type LetterType = 'mother' | 'double' | 'simple';

export interface HebrewLetter {
  id: number;
  hebrew: string;
  name: string;
  translit: string;
  value: number;
  type: LetterType;
  meaning: string;
}

export const letters: HebrewLetter[] = [
  { id: 1, hebrew: 'א', name: 'Алеф', translit: 'Aleph', value: 1, type: 'mother', meaning: 'бык, дыхание, первичный импульс' },
  { id: 2, hebrew: 'ב', name: 'Бет', translit: 'Bet', value: 2, type: 'double', meaning: 'дом, вместилище' },
  { id: 3, hebrew: 'ג', name: 'Гимел', translit: 'Gimel', value: 3, type: 'double', meaning: 'верблюд, движение' },
  { id: 4, hebrew: 'ד', name: 'Далет', translit: 'Dalet', value: 4, type: 'double', meaning: 'дверь, граница' },
  { id: 5, hebrew: 'ה', name: 'Хей', translit: 'Heh', value: 5, type: 'simple', meaning: 'окно, дыхание, раскрытие' },
  { id: 6, hebrew: 'ו', name: 'Вав', translit: 'Vav', value: 6, type: 'simple', meaning: 'крюк, связь, опора' },
  { id: 7, hebrew: 'ז', name: 'Зайн', translit: 'Zayin', value: 7, type: 'simple', meaning: 'меч, разделение' },
  { id: 8, hebrew: 'ח', name: 'Хет', translit: 'Chet', value: 8, type: 'simple', meaning: 'ограда, граница' },
  { id: 9, hebrew: 'ט', name: 'Тет', translit: 'Tet', value: 9, type: 'simple', meaning: 'змей, скрытая сила' },
  { id: 10, hebrew: 'י', name: 'Йуд', translit: 'Yud', value: 10, type: 'simple', meaning: 'рука, точка действия' },
  { id: 11, hebrew: 'כ', name: 'Каф', translit: 'Kaf', value: 20, type: 'double', meaning: 'ладонь, захват' },
  { id: 12, hebrew: 'ל', name: 'Ламед', translit: 'Lamed', value: 30, type: 'simple', meaning: 'пастуший посох, обучение' },
  { id: 13, hebrew: 'מ', name: 'Мем', translit: 'Mem', value: 40, type: 'mother', meaning: 'вода, поток' },
  { id: 14, hebrew: 'נ', name: 'Нун', translit: 'Nun', value: 50, type: 'simple', meaning: 'рыба, жизнь в глубине' },
  { id: 15, hebrew: 'ס', name: 'Самех', translit: 'Samekh', value: 60, type: 'simple', meaning: 'опора, поддержка' },
  { id: 16, hebrew: 'ע', name: 'Айн', translit: 'Ayin', value: 70, type: 'simple', meaning: 'глаз, видение' },
  { id: 17, hebrew: 'פ', name: 'Пе', translit: 'Pe', value: 80, type: 'double', meaning: 'рот, речь' },
  { id: 18, hebrew: 'צ', name: 'Цади', translit: 'Tzadi', value: 90, type: 'simple', meaning: 'крюк, праведность' },
  { id: 19, hebrew: 'ק', name: 'Куф', translit: 'Qof', value: 100, type: 'simple', meaning: 'обезьяна, затылок, цикл' },
  { id: 20, hebrew: 'ר', name: 'Реш', translit: 'Resh', value: 200, type: 'double', meaning: 'голова, начало' },
  { id: 21, hebrew: 'ש', name: 'Шин', translit: 'Shin', value: 300, type: 'mother', meaning: 'зуб, огонь' },
  { id: 22, hebrew: 'ת', name: 'Тав', translit: 'Tav', value: 400, type: 'double', meaning: 'знак, завершение' }
];
