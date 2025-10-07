'use client';

import { observer } from 'mobx-react-lite';
import { useRouter } from 'next/navigation';
import { useCallback, useEffect, useRef, useState } from 'react';

import { Button } from '@/components/Button';
import { CardCompact } from '@/components/CardCompact';
import { Input } from '@/components/Input';
import { Loading } from '@/components/Loading';
import { MovieList, MovieListSkeletons } from '@/components/MovieList';
import { SearchSuggestions } from '@/components/SearchSuggestions';
import { Text } from '@/components/Text';
import { useUserStore } from '@/store';
import { useDebounce } from '@/utils/hooks/useDebounce';
import { useSuggestionNavigation } from '@/utils/hooks/useSuggestionNavigation';
import { withProvider } from '@/utils/withProvider';

import s from './ForYouPage.module.scss';
import { ForYouStoreProvider, useForYouStore } from './model/context';

const ForYouPage = observer(() => {
  const router = useRouter();
  const { loadingStage: userLoadingStage } = useUserStore();
  const {
    searchQuery,
    setQuery,
    toggleFavorite,
    loadingStage,
    searchResults,
    recommendations,
    getRecommendations,
    favorites,
    recLoadingStage,
    reset,
  } = useForYouStore();
  const [isFocused, setIsFocused] = useState(false);
  const [inputValue, setInputValue] = useState(searchQuery);
  const inputRef = useRef<HTMLInputElement>(null);
  const debouncedQuery = useDebounce(inputValue, 300);

  const { highlightedIndex, handleKeyDown } = useSuggestionNavigation({
    items: searchResults,
    onSelect: (movie) => {
      handleClear();
      toggleFavorite(movie);
    },
  });

  const handleClear = useCallback(() => {
    setIsFocused(false);
    setInputValue('');
    inputRef.current?.blur();
  }, []);

  const handleReset = useCallback(() => {
    if (confirm('Вы уверены? Это действие нельзя будет отменить')) {
      reset();
    }
  }, [reset]);

  const handleCardClick = useCallback(
    (id: number) => {
      router.push(`/movies/${id}`);
    },
    [router]
  );

  useEffect(() => {
    setQuery(debouncedQuery);
  }, [debouncedQuery, setQuery]);

  if (userLoadingStage.isLoading) {
    return <Loading />;
  }

  return (
    <div className={s.rec}>
      <div className={s.rec__container}>
        <div className={s.rec__header}>
          <Text view="title" color="primary">
            Для вас - скрещивайте любимые фильмы и открывайте для себя новые!
          </Text>
          <Text view="p-20" color="secondary">
            Найдите, что посмотреть в одиночку, в паре или компании
          </Text>
        </div>

        <div className={s.searchWrapper}>
          <Input
            ref={inputRef}
            placeholder="Введите любимый фильм"
            value={inputValue}
            onChange={setInputValue}
            onFocus={() => setIsFocused(true)}
            onBlur={() => setTimeout(() => setIsFocused(false), 200)}
            onKeyDown={handleKeyDown}
          />
          {isFocused && (
            <SearchSuggestions
              onClick={(movie) => {
                handleClear();
                toggleFavorite(movie);
              }}
              highlightedIndex={highlightedIndex}
              movies={searchResults}
              loading={loadingStage.isLoading}
              selected={favorites.map((i) => i.id)}
            />
          )}
        </div>

        {favorites.length > 0 && (
          <>
            <div className={s.favorites__header}>
              <Text view="p-20" color="secondary" weight="bold">
                Вы выбрали:
              </Text>
              <div className={s.favorites__header__items}>
                <Button className={s.favorites__header__button} onClick={getRecommendations}>
                  Подобрать фильмы
                </Button>
                <Button
                  variant="outlined"
                  className={s.favorites__header__button}
                  onClick={handleReset}
                >
                  Очистить
                </Button>
              </div>
            </div>
            <div className={s.favorites__content}>
              {favorites.map((item) => (
                <CardCompact
                  key={item.id}
                  image={item.posterUrl}
                  title={item.title}
                  onClick={() => handleCardClick(item.id)}
                  actionSlot={
                    <Button
                      className={s.favorites__button}
                      variant="outlined"
                      onClick={(e) => {
                        e.stopPropagation();
                        toggleFavorite(item);
                      }}
                    >
                      Убрать
                    </Button>
                  }
                />
              ))}
            </div>
          </>
        )}
      </div>

      {recLoadingStage.isLoading && <MovieListSkeletons />}
      {!recLoadingStage.isLoading && recommendations.length > 0 && (
        <div className={s.top}>
          <Text view="p-20" color="secondary" weight="bold">
            Рекомендации:
          </Text>
          <MovieList movies={recommendations} />
        </div>
      )}
    </div>
  );
});

export default withProvider(ForYouPage, [ForYouStoreProvider]);
