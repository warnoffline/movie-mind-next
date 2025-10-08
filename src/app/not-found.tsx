import { Text } from '@/components/Text';

import s from './layout.module.scss';

export default function NotFound() {
  return (
    <div className={s.error}>
      <Text view="title" color="secondary">
        Страница не найдена
      </Text>
    </div>
  );
}
