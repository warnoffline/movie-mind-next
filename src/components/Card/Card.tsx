'use client';

import cn from 'classnames';
import Image from 'next/image';
import React from 'react';

import { Text } from '../Text';
import s from './Card.module.scss';

export type CardProps = {
  /** Дополнительный classname */
  className?: string;
  /** URL изображения */
  image: string;
  /** Слот над заголовком */
  captionSlot?: React.ReactNode;
  /** Заголовок карточки */
  title: React.ReactNode;
  /** Описание карточки */
  subtitle: React.ReactNode;
  /** Содержимое карточки (футер/боковая часть), может быть пустым */
  contentSlot?: React.ReactNode;
  /** Клик на карточку */
  onClick?: React.MouseEventHandler;
  /** Слот для действия */
  actionSlot?: React.ReactNode;
};

const Card: React.FC<CardProps> = ({
  className,
  image,
  captionSlot,
  title,
  subtitle,
  contentSlot,
  onClick,
  actionSlot,
}) => {
  return (
    <div className={cn(s['card'], className)} onClick={onClick}>
      <div className={s['card__image-wrapper']}>
        <span className={s['bg-blur']} style={{ backgroundImage: `url(${image})` }} />
        <Image src={image} alt="img" fill />
      </div>
      <div className={s['card__body']}>
        <div className={s['card__text']}>
          {captionSlot && captionSlot}
          <Text
            className={s['card__title']}
            color="primary"
            weight="medium"
            view="p-20"
            maxLines={2}
          >
            {title}
          </Text>
          <Text className={s['card__subtitle']} color="secondary" view="p-16" maxLines={3}>
            {subtitle}
          </Text>
        </div>
        <div className={s['card__footer']}>
          {contentSlot && <div className={s['card__content-slot']}>{contentSlot}</div>}
          {actionSlot}
        </div>
      </div>
    </div>
  );
};

export default React.memo(Card);
