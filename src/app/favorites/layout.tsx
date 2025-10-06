import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Избранные фильмы — MovieMind',
  description:
    'Ваши любимые фильмы в одном месте. Смотрите, сохраняйте и возвращайтесь к лучшим кинокартинам.',
  openGraph: {
    title: 'Избранные фильмы',
    description:
      'Ваши любимые фильмы в одном месте. Смотрите, сохраняйте и возвращайтесь к лучшим кинокартинам.',
    type: 'website',
  },
};

export default function FavoritesLayout({ children }: { children: React.ReactNode }) {
  return <section className="favorites-layout">{children}</section>;
}
