'use client'

import cn from 'classnames';
import React from 'react';
import { useMemo } from 'react';

import { getGenres } from '@/utils/genres';

import s from './GenreTags.module.scss';
import { Text } from '../Text';

type GenreTagsProps = {
  genres: { name: string }[];
  isFull?: boolean;
};

const GenreTags: React.FC<GenreTagsProps> = ({ genres, isFull }) => {
  const prepared = useMemo(() => getGenres(genres), [genres]);

  return (
    <div className={s.genres}>
      {prepared.map((g) => (
        <Text
          key={g.label}
          color="primary"
          className={cn(s.genreTag, isFull && s.isFull)}
          style={{ backgroundColor: g.color }}
        >
          {g.label}
        </Text>
      ))}
    </div>
  );
};

export default React.memo(GenreTags);
