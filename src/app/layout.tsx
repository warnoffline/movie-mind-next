import { Montserrat } from 'next/font/google';
import { NuqsAdapter } from 'nuqs/adapters/next';

import { AlertList } from '@/components/AlertList';
import { Header } from '@/components/Header';
import '@/configs/mobx/configureMobX';
import { RootStoreProvider } from '@/store/RootStoreProvider';
import '@/styles/resets.scss';

import s from './layout.module.scss';

import type { Metadata } from 'next';

const montserrat = Montserrat({
  subsets: ['latin'],
});

export const metadata: Metadata = {
  title: 'MovieMind',
  description: 'Поиск информации о фильмах',
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={montserrat.className}>
      <body>
        <NuqsAdapter>
          <RootStoreProvider>
            <Header />
            <AlertList />
            <div className={s.body}>{children}</div>
          </RootStoreProvider>
        </NuqsAdapter>
      </body>
    </html>
  );
}
