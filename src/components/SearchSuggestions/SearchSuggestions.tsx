'use client';

import cn from 'classnames';
import { motion, AnimatePresence } from 'framer-motion';
import Image from 'next/image';
import { useEffect, useRef } from 'react';

import { Text } from '@/components/Text';
import type { IMovieShort } from '@/types/movies';

import { SearchSkeletons } from './SearchSkeleton';
import s from './SearchSuggestions.module.scss';

type SearchSuggestionsProps = {
  onClick: (movie: IMovieShort) => void;
  highlightedIndex?: number;
  movies: IMovieShort[];
  loading: boolean;
  selected?: number[];
  onHighlightChange?: (index: number) => void;
};

const SearchSuggestions: React.FC<SearchSuggestionsProps> = ({
  onClick,
  highlightedIndex = -1,
  movies,
  loading,
  selected,
  onHighlightChange,
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const itemRefs = useRef<(HTMLDivElement | null)[]>([]);
  const isMouseOver = useRef(false);

  useEffect(() => {
    if (!isMouseOver.current) {
      const current = itemRefs.current[highlightedIndex];
      if (current && containerRef.current) {
        current.scrollIntoView({
          behavior: 'smooth',
          block: 'nearest',
        });
      }
    }
  }, [highlightedIndex]);

  if (loading) return <SearchSkeletons />;

  return (
    <AnimatePresence>
      {movies.length > 0 ? (
        <motion.div
          ref={containerRef}
          onMouseEnter={() => (isMouseOver.current = true)}
          onMouseLeave={() => (isMouseOver.current = false)}
          className={s.list}
          initial={{ opacity: 0, y: -8 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -8 }}
          transition={{ duration: 0.25, ease: 'easeOut' }}
        >
          {movies.map((m, idx) => (
            <motion.div
              key={m.id}
              ref={(el) => {
                itemRefs.current[idx] = el;
              }}
              className={cn(s.item, {
                [s.highlighted]: idx === highlightedIndex,
                [s.selected]: selected?.includes(m.id),
              })}
              onClick={() => onClick(m)}
              onMouseEnter={() => onHighlightChange?.(idx)}
              initial={{ opacity: 0, y: 5 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.01, duration: 0.2 }}
            >
              <Image width={40} height={60} src={m.posterUrl} alt={m.title} className={s.poster} />
              <Text weight="bold" className={s.title}>
                {m.title}
              </Text>
            </motion.div>
          ))}
        </motion.div>
      ) : (
        <motion.div
          className={s.list}
          initial={{ opacity: 0, y: -8 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -8 }}
          transition={{ duration: 0.25 }}
        >
          <Text color="secondary" className={s.empty}>
            Здесь будут фильмы
          </Text>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default SearchSuggestions;
