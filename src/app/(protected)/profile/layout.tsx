import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Профиль пользователя — MovieMind',
  description: 'Управляйте своими данными, настройками и избранными фильмами.',
  openGraph: {
    title: 'Профиль пользователя',
    description: 'Управляйте своими данными, настройками и избранными фильмами.',
    type: 'profile',
  },
  robots: { index: false },
};

export default function ProfileLayout({ children }: { children: React.ReactNode }) {
  return <section className="profile-layout">{children}</section>;
}
