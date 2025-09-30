'use client';
import cn from 'classnames';
import { motion } from 'framer-motion';
import { useState } from 'react';

import { StarIcon } from '@/components/icons/StarIcon';

import s from './StarRating.module.scss';

type StarRatingProps = {
  value?: number;
  onChange?: (value: number) => void;
  max?: number;
  readOnly?: boolean;
};

export const StarRating = ({ value = 0, onChange, max = 5, readOnly = false }: StarRatingProps) => {
  const [hover, setHover] = useState<number | null>(null);

  return (
    <div className={s.stars}>
      {Array.from({ length: max }, (_, i) => {
        const starValue = i + 1;
        const active = hover ? starValue <= hover : starValue <= value;

        return (
          <motion.span
            key={starValue}
            className={cn(s.star, active && s.active, readOnly && s.readOnly)}
            {...(!readOnly && {
              onClick: () => onChange?.(starValue),
              onMouseEnter: () => setHover(starValue),
              onMouseLeave: () => setHover(null),
              whileHover: { scale: 1.2 },
              whileTap: { scale: 0.9, rotate: -10 },
            })}
          >
            <StarIcon className={cn(s.icon, active && s.activeIcon)} />
          </motion.span>
        );
      })}
    </div>
  );
};
