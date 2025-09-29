'use client';

import ArrowDownIcon from '@/components/icons/ArrowDownIcon';
import { Text } from '@/components/Text';

import s from './GoBackButton.module.scss';

type Props = {
  onClick?: () => void;
};

export const GoBackButton: React.FC<Props> = ({ onClick }) => {
  return (
    <div>
      <button className={s.goBack} onClick={onClick}>
        <ArrowDownIcon className={s.icon} />
        <div>
          <Text view="p-20" weight="medium">
            Назад
          </Text>
        </div>
      </button>
    </div>
  );
};
