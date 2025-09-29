import { notFound } from 'next/navigation';

import { getMovies } from '@/services/movies';

import { Movies } from './components/Movies';
import { MoviesStoreProvider } from './model';

export default async function MoviesPage() {
  const movieInitData = await getMovies(1, 12);

  if (movieInitData.movies.length < 1) notFound();

  return (
    <MoviesStoreProvider initData={movieInitData}>
      <Movies />
    </MoviesStoreProvider>
  );
}
