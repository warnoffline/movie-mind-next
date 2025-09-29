import type { IMovieResponse, IMovieShort } from '@/types/movies';

export const mapMovieResponse = (data: IMovieResponse): IMovieShort => ({
  id: data.id,
  title: data.movie.name,
  description: data.movie.shortDescription ?? data.movie.description,
  posterUrl: data.movie.poster.url,
  genres: data.movie.genres,
  releaseDate: data.movie.year,
  rating: data.movie.rating.imdb,
});
