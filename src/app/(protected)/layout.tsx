'use client';

import { observer } from 'mobx-react-lite';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';

import Loading from '@/components/Loading/Loading';
import { useUserStore } from '@/store';

const ProtectedLayout = observer(({ children }: { children: React.ReactNode }) => {
  const router = useRouter();
  const userStore = useUserStore();

  useEffect(() => {
    if (!userStore.isAuthorized && !userStore.loadingStage.isLoading) {
      router.replace('/login');
    }
  }, [userStore.isAuthorized, userStore.loadingStage.isLoading, router]);

  if (!userStore.loadingStage.isFinished) return <Loading />;
  if (!userStore.isAuthorized) return null;

  return <>{children}</>;
});

export default ProtectedLayout;
