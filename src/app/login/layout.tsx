'use client';

import { observer } from 'mobx-react-lite';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';

import Loading from '@/components/Loading/Loading';
import { useUserStore } from '@/store';

const LoginLayout = observer(({ children }: { children: React.ReactNode }) => {
  const router = useRouter();
  const userStore = useUserStore();

  useEffect(() => {
    if (userStore.isAuthorized && userStore.loadingStage.isFinished) {
      router.replace('/profile');
    }
  }, [userStore.isAuthorized, userStore.loadingStage.isFinished, router]);

  if (userStore.loadingStage.isLoading) return <Loading text="Проверяем данные..." />;
  if (userStore.isAuthorized) return null;

  return <>{children}</>;
});

export default LoginLayout;
