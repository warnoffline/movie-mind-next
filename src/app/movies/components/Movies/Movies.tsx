'use client';

import { observer } from 'mobx-react-lite';

import { MovieList, MovieListSkeletons } from '@/components/MovieList';
import { Pagination } from '@/components/Pagination';
import { Text } from '@/components/Text';

import { useMoviesStore } from '../../model';
import { Categories } from '../Categories';
import s from './Movies.module.scss';

const Movies = observer(() => {
  const { selectedCategory, setCategory, setPage, loadingStage, movies, totalPages, page } =
    useMoviesStore();

  return (
    <div className={s.movies}>
      <div className={s.movies__article}>
        <Text view="title" color="primary">
          Фильмы
        </Text>
      </div>

      <Categories
        selectedCategory={selectedCategory}
        onSelectCategory={(cat) => {
          setCategory(cat ?? null);
        }}
      />

      {loadingStage.isLoading && <MovieListSkeletons />}

      {loadingStage.isFinished && movies.length < 1 && (
        <div className={s.empty}>
          <Text view="title" color="secondary">
            Фильмы не найдены
          </Text>
        </div>
      )}

      {loadingStage.isFinished && movies.length > 0 && (
        <>
          <MovieList movies={movies} />
          {totalPages > 1 && <Pagination page={page} totalPages={totalPages} onChange={setPage} />}
        </>
      )}
    </div>
  );
});

export default Movies;
