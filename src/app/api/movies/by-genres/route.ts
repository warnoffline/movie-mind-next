import { collection, getDocs } from 'firebase/firestore';
import { NextResponse } from 'next/server';

import { db } from '@/configs/firebase';
import type { IMovieResponse, IMovieShort, IGetMoviesResponse } from '@/types/movies';
import { mapMovieResponse } from '@/utils/mapMovieResponse';
import { paginate } from '@/utils/paginate';

import type { NextRequest } from 'next/server';

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const page = Number(searchParams.get('page') ?? 1);
    const limit = Number(searchParams.get('limit') ?? 10);
    const genresParam = searchParams.get('genres');
    if (!genresParam) return NextResponse.json({ error: 'No genres provided' }, { status: 400 });

    const genres = genresParam.split(',').map((g) => g.trim().toLowerCase());

    const snapshot = await getDocs(collection(db, 'movies'));
    const allMovies: IMovieResponse[] = snapshot.docs.map((d) => d.data() as IMovieResponse);

    const filtered = allMovies.filter((m) =>
      m.movie.genres.some((g) => genres.includes(g.name.toLowerCase()))
    );

    const paged = paginate(filtered, page, limit);
    const movies: IMovieShort[] = paged.map(mapMovieResponse);

    const response: IGetMoviesResponse = {
      movies,
      page,
      counts: movies.length,
      totalCounts: filtered.length,
    };

    return NextResponse.json(response);
  } catch {
    return NextResponse.json({ error: 'Failed to fetch movies by genres' }, { status: 500 });
  }
}
