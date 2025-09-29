'use client';

import { Loader } from '../Loader';
import { Text } from '../Text';
import s from './Loading.module.scss';

type LoadingProps = {
  text?: string;
};

const Loading: React.FC<LoadingProps> = ({ text = 'Грузимся...' }) => {
  return (
    <div className={s.loading}>
      <Loader size="xl" />
      <Text view="p-20" weight="bold" color="primary">
        {text}
      </Text>
    </div>
  );
};

export default Loading;
