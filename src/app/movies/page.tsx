import { notFound } from 'next/navigation';

import { MoviesService } from '@/services/movies';

import { Movies } from './components/Movies';
import { MoviesStoreProvider } from './model';

export default async function MoviesPage() {
  const moviesService = new MoviesService();
  const movieInitData = await moviesService.getMovies(1, 12);

  if (movieInitData.movies.length < 1) notFound();

  return (
    <MoviesStoreProvider initData={movieInitData}>
      <Movies />
    </MoviesStoreProvider>
  );
}
