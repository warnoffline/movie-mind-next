import { notFound } from 'next/navigation';

import { MoviesService } from '@/services/movies';

import { Movies } from './components/Movies';
import { MoviesStoreProvider } from './model';

export default async function MoviesPage({
  searchParams,
}: {
  searchParams: Promise<{ page?: string; category?: string }>;
}) {
  const params = await searchParams;
  const page = Number(params.page ?? 1);
  const category = params.category ?? null;

  const moviesService = new MoviesService();
  const movieInitData = category
    ? await moviesService.getMoviesByGenres([category], page, 12)
    : await moviesService.getMovies(page, 12);

  if (movieInitData.movies.length < 1) notFound();

  return (
    <MoviesStoreProvider initData={movieInitData}>
      <Movies />
    </MoviesStoreProvider>
  );
}
