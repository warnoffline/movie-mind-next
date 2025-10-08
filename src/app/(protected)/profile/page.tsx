'use client';

import { motion } from 'framer-motion';
import { observer } from 'mobx-react-lite';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { Suspense, useCallback } from 'react';

import { Button } from '@/components/Button';
import { PersonIcon } from '@/components/icons/PersonIcon';
import { LoadingFull } from '@/components/LoadingFull';
import { Text } from '@/components/Text';
import { useUserStore } from '@/store';

import { containerVariants, itemVariants } from './config';
import s from './Profile.module.scss';

const Profile = observer(() => {
  const { user, logout } = useUserStore();
  const router = useRouter();

  const handleLogout = useCallback(() => {
    logout();
    router.push('/login');
  }, [logout, router]);

  return (
    <motion.div
      className={s.profile}
      variants={containerVariants}
      initial="hidden"
      animate="visible"
    >
      <motion.div className={s.profile__content} variants={containerVariants}>
        <div className={s.profile__header}>
          <motion.div variants={itemVariants}>
            <Text view="title" color="primary">
              Профиль
            </Text>
          </motion.div>
          <motion.div className={s.avatar__section} variants={itemVariants}>
            <div className={s.avatar__wrapper}>
              {user?.photoURL ? (
                <Image
                  src={user.photoURL}
                  alt="avatar"
                  className={s.avatar}
                  width={120}
                  height={120}
                />
              ) : (
                <PersonIcon width={80} height={80} />
              )}
            </div>
          </motion.div>
        </div>

        <motion.div className={s.profile__body} variants={itemVariants}>
          <div className={s.userInfo}>
            <Text view="title" weight="bold" color="primary">
              {user?.displayName || user?.email}
            </Text>
            <Text view="p-16" color="secondary">
              {user?.email}
            </Text>
          </div>
        </motion.div>

        <motion.div className={s.actions} variants={itemVariants}>
          <Button onClick={handleLogout} variant="outlined">
            <Text view="p-18">Выйти</Text>
          </Button>
        </motion.div>
      </motion.div>
    </motion.div>
  );
});

export default function ProfilePage() {
  return (
    <Suspense fallback={<LoadingFull />}>
      <Profile />
    </Suspense>
  );
}
