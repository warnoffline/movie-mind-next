'use client';

import { observer } from 'mobx-react-lite';

import { MovieList } from '@/components/MovieList';
import { Pagination } from '@/components/Pagination';
import { Text } from '@/components/Text';

import s from './Favorites.module.scss';
import { useFavoritesPageStore } from '../../model';
import { LoadingMovies } from '../LoadingMovies';

const Favorites = observer(() => {
  const { movies, loadingStage, totalPages, page, setPage } = useFavoritesPageStore();

  if (loadingStage.isLoading) {
    return <LoadingMovies />;
  }

  if (!loadingStage.isSuccess || movies.length === 0) {
    return (
      <div className={s.empty}>
        <Text view="title" color="secondary">
          Избранные не найдены
        </Text>
      </div>
    );
  }

  return (
    <div className={s.favorites}>
      <div className={s.favorites__header}>
        <Text color="primary" view="title" weight="bold">
          Избранное
        </Text>
      </div>
      <div>
        <MovieList movies={movies} />
        {totalPages > 1 && <Pagination page={page} totalPages={totalPages} onChange={setPage} />}
      </div>
    </div>
  );
});

export default Favorites;
