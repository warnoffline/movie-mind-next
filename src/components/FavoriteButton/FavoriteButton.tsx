'use client';

import { observer } from 'mobx-react-lite';
import React from 'react';

import { useFavoriteStore } from '@/store';

import { Button } from '../Button';
import s from './FavoriteButton.module.scss';
import { LikeIcon } from '../icons/LikeIcon';

type Props = { movieId: number };

const FavoriteButton: React.FC<Props> = observer(({ movieId }) => {
  const store = useFavoriteStore();

  return (
    <Button
      className={s.fav__button}
      variant={store.isFavorite(movieId) ? 'contained' : 'outlined'}
      onClick={(e) => {
        e.preventDefault();
        e.stopPropagation();
        store.toggleFavorite(movieId);
      }}
    >
      <div className={s.fav__button__container}>
        <LikeIcon />
        <span className={s.fav__button__text}>
          {store.isFavorite(movieId) ? 'В избранном' : 'В избранное'}
        </span>
      </div>
    </Button>
  );
});

export default FavoriteButton;
