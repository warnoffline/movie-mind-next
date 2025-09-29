'use client';

import cn from 'classnames';
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

    if (loadingStage.isLoading) {
      return <SearchSkeletons />;
    }

    if (filteredMovies.length === 0) {
      return (
        <div className={s.list}>
          <Text color="secondary" className={s.empty}>
            Фильмы не найдены
          </Text>
        </div>
      );
    }

    return (
      <div className={s.list}>
        {filteredMovies.map((m, idx) => (
          <div
            key={m.id}
            className={cn(s.item, { [s.highlighted]: idx === highlightedIndex })}
            onClick={() => handleClick(m.id)}
          >
            <Image width={40} height={60} src={m.posterUrl} alt={m.title} className={s.poster} />
            <Text weight="bold" className={s.title}>
              {m.title}
            </Text>
          </div>
        ))}
      </div>
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
