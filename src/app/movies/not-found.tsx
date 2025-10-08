import { Text } from '@/components/Text';

import s from './NotFound.module.scss';

export default function NotFound() {
  return (
    <div className={s.empty}>
      <Text view="title" color="secondary">
        Фильмы не найдены
      </Text>
    </div>
  );
}
