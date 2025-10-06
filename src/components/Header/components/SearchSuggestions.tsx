'use client';

import cn from 'classnames';
import { motion, AnimatePresence } from 'framer-motion';
import { observer } from 'mobx-react-lite';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { Suspense, useCallback } from 'react';

import { Text } from '@/components/Text';

import { useSearchStore } from '../model';
import { SearchSkeletons } from './SearchSkeleton';
import s from './SearchSuggestions.module.scss';

type SearchSuggestionsProps = {
  onClick: () => void;
  highlightedIndex?: number;
};

const SearchSuggestions: React.FC<SearchSuggestionsProps> = observer(
  ({ onClick, highlightedIndex = -2 }) => {
    const { filteredMovies, loadingStage } = useSearchStore();
    const router = useRouter();

    const handleClick = useCallback(
      (id: number) => {
        onClick();
        router.push(`/movies/${id}`);
      },
      [router, onClick]
    );

    if (loadingStage.isLoading) return <SearchSkeletons />;

    return (
      <AnimatePresence>
        {filteredMovies.length > 0 ? (
          <motion.div
            className={s.list}
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.25, ease: 'easeOut' }}
          >
            {filteredMovies.map((m, idx) => (
              <motion.div
                key={m.id}
                className={cn(s.item, { [s.highlighted]: idx === highlightedIndex })}
                onClick={() => handleClick(m.id)}
                initial={{ opacity: 0, y: 5 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: idx * 0.05, duration: 0.2 }}
              >
                <Image
                  width={40}
                  height={60}
                  src={m.posterUrl}
                  alt={m.title}
                  className={s.poster}
                />
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
              Фильмы не найдены
            </Text>
          </motion.div>
        )}
      </AnimatePresence>
    );
  }
);

export default function SearchSuggestionsWrapper(props: SearchSuggestionsProps) {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <SearchSuggestions {...props} />
    </Suspense>
  );
}
