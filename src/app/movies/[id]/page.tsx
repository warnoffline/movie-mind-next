import { notFound } from 'next/navigation';

import { MoviesService } from '@/services/movies';

import { Movie } from './components/Movie';
import { MovieStoreProvider } from './model';

import type { Metadata } from 'next';

type MoviePageProps = {
  params: Promise<{ id: string }>;
};

const moviesService = new MoviesService();

export async function generateMetadata({ params }: MoviePageProps): Promise<Metadata> {
  const { id } = await params;
  const movie = await moviesService.getMovie(id);

  if (!movie) {
    return {
      title: 'Фильм не найден — MovieMind',
      description: 'К сожалению, такой фильм отсутствует в базе.',
    };
  }

  return {
    title: `${movie.name} (${movie.year}) — MovieMind`,
    description: movie.description || `Информация о фильме ${movie.name}`,
    openGraph: {
      title: movie.name,
      description: movie.description,
      images: movie.poster,
      type: 'video.movie',
    },
  };
}

export default async function MoviePage({ params }: MoviePageProps) {
  const { id } = await params;
  const movieInitData = await moviesService.getMovie(id);

  if (!movieInitData) notFound();

  return (
    <MovieStoreProvider initData={movieInitData}>
      <Movie />
    </MovieStoreProvider>
  );
}
