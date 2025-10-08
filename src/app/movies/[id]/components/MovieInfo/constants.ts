import type { IMovie } from '@/types/movies';
import { formatDuration } from '@/utils/format';

export const getRatings = (movie: IMovie) =>
  [
    movie.rating.imdb > 0 && { label: 'IMDb', value: movie.rating.imdb.toFixed(1) },
    movie.rating.kp > 0 && { label: 'KP', value: movie.rating.kp.toFixed(1) },
    movie.rating.filmCritics > 0 && {
      label: 'Критики',
      value: movie.rating.filmCritics.toFixed(1),
    },
    movie.rating.russianFilmCritics > 0 && {
      label: 'Российские критики',
      value: movie.rating.russianFilmCritics.toFixed(1),
    },
  ].filter(Boolean) as { label: string; value: string }[];

export const getMeta = (movie: IMovie) =>
  [
    { label: 'Длительность', value: formatDuration(movie.movieLength) },
    movie.top250 && { label: 'Топ-250', value: `${movie.top250} место` },
    { label: 'Страны', value: movie.countries.map((c) => c.name).join(', ') },
  ].filter(Boolean) as { label: string; value: string }[];
