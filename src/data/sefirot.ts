export type Pillar = 'left' | 'right' | 'central';

export interface Sefirah {
  id: number;
  name: string;
  hebrew: string;
  translit: string;
  meaning: string;
  pillar: Pillar;
  color: string;
  world: string;
  keywords: string[];
  quality: string;
  position: {
    x: number;
    y: number;
  };
}

export const sefirot: Sefirah[] = [
  {
    id: 1,
    name: 'Кетер',
    hebrew: 'כתר',
    translit: 'Keter',
    meaning: 'Корона, источник, первичная точка, чистое единство.',
    pillar: 'central',
    color: '#ffffff',
    world: 'Ацилут',
    keywords: ['источник', 'воля', 'единство', 'импульс'],
    quality: 'Первичный импульс и единство',
    position: { x: 0, y: 5 }
  },
  {
    id: 2,
    name: 'Хохма',
    hebrew: 'חכמה',
    translit: 'Chokhmah',
    meaning: 'Мудрость, вспышка, активное начало, чистое движение.',
    pillar: 'right',
    color: '#a7b0bf',
    world: 'Ацилут',
    keywords: ['вспышка', 'интуиция', 'начало', 'потенциал'],
    quality: 'Первичная идея и вдохновение',
    position: { x: 2, y: 4 }
  },
  {
    id: 3,
    name: 'Бина',
    hebrew: 'בינה',
    translit: 'Binah',
    meaning: 'Понимание, форма, структура, различение.',
    pillar: 'left',
    color: '#1f2430',
    world: 'Ацилут',
    keywords: ['форма', 'структура', 'глубина', 'различение'],
    quality: 'Оформление и понимание',
    position: { x: -2, y: 4 }
  },
  {
    id: 4,
    name: 'Хесед',
    hebrew: 'חסד',
    translit: 'Chesed',
    meaning: 'Милосердие, расширение, отдача, щедрость.',
    pillar: 'right',
    color: '#3b82f6',
    world: 'Брия',
    keywords: ['милосердие', 'расширение', 'любовь', 'поток'],
    quality: 'Расширение и отдача',
    position: { x: 2, y: 2 }
  },
  {
    id: 5,
    name: 'Гвура',
    hebrew: 'גבורה',
    translit: 'Gevurah',
    meaning: 'Сила, граница, ограничение, точность.',
    pillar: 'left',
    color: '#ef4444',
    world: 'Брия',
    keywords: ['сила', 'граница', 'дисциплина', 'сокращение'],
    quality: 'Ограничение и точность',
    position: { x: -2, y: 2 }
  },
  {
    id: 6,
    name: 'Тиферет',
    hebrew: 'תפארת',
    translit: 'Tiferet',
    meaning: 'Красота, гармония, равновесие, сердце Древа.',
    pillar: 'central',
    color: '#facc15',
    world: 'Брия',
    keywords: ['гармония', 'красота', 'баланс', 'центр'],
    quality: 'Равновесие и сердце',
    position: { x: 0, y: 2 }
  },
  {
    id: 7,
    name: 'Нецах',
    hebrew: 'נצח',
    translit: 'Netzach',
    meaning: 'Победа, устойчивость, ритм, непрерывность.',
    pillar: 'right',
    color: '#22c55e',
    world: 'Йецира',
    keywords: ['победа', 'ритм', 'выносливость', 'желание'],
    quality: 'Устойчивость и продолжение',
    position: { x: 2, y: 0 }
  },
  {
    id: 8,
    name: 'Ход',
    hebrew: 'הוד',
    translit: 'Hod',
    meaning: 'Слава, форма, речь, передача, отражение.',
    pillar: 'left',
    color: '#fb923c',
    world: 'Йецира',
    keywords: ['форма', 'речь', 'логика', 'передача'],
    quality: 'Форма и передача',
    position: { x: -2, y: 0 }
  },
  {
    id: 9,
    name: 'Йесод',
    hebrew: 'יסוד',
    translit: 'Yesod',
    meaning: 'Основание, связь, канал, передача света.',
    pillar: 'central',
    color: '#a855f7',
    world: 'Йецира',
    keywords: ['основание', 'связь', 'канал', 'передача'],
    quality: 'Соединение и фундамент',
    position: { x: 0, y: -1 }
  },
  {
    id: 10,
    name: 'Малхут',
    hebrew: 'מלכות',
    translit: 'Malkhut',
    meaning: 'Царство, проявление, воплощение, действие.',
    pillar: 'central',
    color: '#84cc16',
    world: 'Асия',
    keywords: ['проявление', 'тело', 'воплощение', 'действие'],
    quality: 'Проявление и действие',
    position: { x: 0, y: -3 }
  }
];

export const pillarNames: Record<Pillar, string> = {
  left: 'Левая колонна',
  right: 'Правая колонна',
  central: 'Центральная колонна'
};
