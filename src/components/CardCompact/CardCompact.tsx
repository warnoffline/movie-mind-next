import cn from 'classnames';
import Image from 'next/image';
import React from 'react';

import { Text } from '../Text';
import s from './CardCompact.module.scss';

type CardCompactProps = {
  /** Дополнительный classname */
  className?: string;
  /** URL изображения */
  image: string;
  /** Заголовок карточки */
  title: React.ReactNode;
  /** Клик на карточку */
  onClick?: React.MouseEventHandler;
  actionSlot?: React.ReactNode;
};

const CardCompact: React.FC<CardCompactProps> = ({
  className,
  image,
  title,
  onClick,
  actionSlot,
}) => {
  return (
    <div className={cn(s.card, className)} onClick={onClick}>
      <div className={s.imageWrapper}>
        <span className={s.bgBlur} style={{ backgroundImage: `url(${image})` }} />
        <Image src={image} alt="img" fill />
      </div>
      <div className={s.body}>
        <Text className={s.title} color="primary" weight="medium" view="p-20" maxLines={2}>
          {title}
        </Text>
        {actionSlot && <div className={s.actionSlot}>{actionSlot}</div>}
      </div>
    </div>
  );
};

export default React.memo(CardCompact);
