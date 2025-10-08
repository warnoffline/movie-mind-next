'use client';

import { Text } from '@/components/Text';

import s from './layout.module.scss';

export default function Error({ error }: { error: Error }) {
  return (
    <div className={s.error}>
      <Text view="title" weight="bold">
        Что-то пошло не так
      </Text>
      <Text view="p-16" color="secondary">
        {error.message}
      </Text>
    </div>
  );
}
