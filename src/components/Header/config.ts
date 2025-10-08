export type HeaderLink = {
  name: string;
  path: string;
  end?: boolean;
};

export const defaultLinks: HeaderLink[] = [
  { name: 'Главная', path: '/movies', end: true },
  { name: 'Для вас', path: '/for-you' },
  { name: 'Избранное', path: '/favorites' },
];
