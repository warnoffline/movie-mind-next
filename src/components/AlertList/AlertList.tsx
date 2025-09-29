'use client'

import cn from 'classnames';
import { observer } from 'mobx-react-lite';

import { useAlertStore } from '@/store/useRootStore';

import { Text } from '../Text';
import s from './AlertList.module.scss';

const AlertList = observer(() => {
  const { alerts } = useAlertStore();

  return (
    <div className={s.alerts}>
      {alerts.map((a) => (
        <div key={a.id} className={cn(s.alert, s[a.type])}>
          <Text color="primary" weight="bold">
            {a.message}
          </Text>
        </div>
      ))}
    </div>
  );
});

export default AlertList;
