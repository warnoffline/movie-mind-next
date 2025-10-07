import cn from 'classnames';
import { motion, AnimatePresence } from 'framer-motion';
import Image from 'next/image';

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
};

const SearchSuggestions: React.FC<SearchSuggestionsProps> = ({
  onClick,
  highlightedIndex = -2,
  movies: filteredMovies,
  loading,
  selected,
}) => {
  if (loading) return <SearchSkeletons />;

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
              className={cn(s.item, {
                [s.highlighted]: idx === highlightedIndex,
                [s.selected]: selected?.find((sId) => sId === m.id),
              })}
              onClick={() => onClick(m)}
              initial={{ opacity: 0, y: 5 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.05, duration: 0.2 }}
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
            Фильмы не найдены
          </Text>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default SearchSuggestions;
