import type { IGetMoviesResponse, IMovie, IMovieShort } from '@/types/movies';

import { BASE_URL } from './instance';

export const getMovies = async (page = 1, limit = 10): Promise<IGetMoviesResponse> => {
  const res = await fetch(`${BASE_URL}/movies?page=${page}&limit=${limit}`, {
    cache: 'no-store',
  });
  if (!res.ok) throw new Error('Failed to fetch movies');
  return res.json();
};

export const getMovie = async (id: string): Promise<IMovie | null> => {
  const res = await fetch(`${BASE_URL}/movies/${id}`, {
    next: { revalidate: 60 },
  });
  if (!res.ok) throw new Error('Failed to fetch movie');
  return res.json();
};

export const getMoviesByGenres = async (
  genres: string[],
  page = 1,
  limit = 10
): Promise<IGetMoviesResponse> => {
  const genreParam = genres.join(',');
  const res = await fetch(
    `${BASE_URL}/movies/by-genres?genres=${genreParam}&page=${page}&limit=${limit}`,
    {
      next: { revalidate: 60 },
    }
  );
  if (!res.ok) throw new Error('Failed to fetch movies by genres');
  return res.json();
};

export const getMoviesByIds = async (
  ids: string[],
  page = 1,
  limit = 10
): Promise<IGetMoviesResponse> => {
  if (ids.length === 0) {
    return { movies: [], page, counts: 0, totalCounts: 0 };
  }

  const idsParam = ids.join(',');
  const res = await fetch(
    `${BASE_URL}/movies/by-ids?ids=${encodeURIComponent(idsParam)}&page=${page}&limit=${limit}`,
    {
      next: { revalidate: 60 },
    }
  );

  if (!res.ok) throw new Error('Failed to fetch movies by ids');
  return res.json();
};

export const searchMoviesByTitle = async (query: string): Promise<IMovieShort[]> => {
  const res = await fetch(`${BASE_URL}/movies/search?query=${encodeURIComponent(query)}`, {
    cache: 'no-store',
  });
  if (!res.ok) throw new Error('Failed to search movies');
  return res.json();
};
