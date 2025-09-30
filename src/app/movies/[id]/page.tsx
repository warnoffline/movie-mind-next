import { notFound } from 'next/navigation';

import { MoviesService } from '@/services/movies';

import { Movie } from './components/Movie';
import { MovieStoreProvider } from './model';

type MoviePageProps = {
  params: Promise<{ id: string }>;
};

export default async function MoviePage({ params }: MoviePageProps) {
  const { id } = await params;
  const moviesService = new MoviesService();

  const movieInitData = await moviesService.getMovie(id);

  if (!movieInitData) notFound();

  return (
    <MovieStoreProvider initData={movieInitData}>
      <Movie />
    </MovieStoreProvider>
  );
}
