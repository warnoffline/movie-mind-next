import { collection, getDocs } from 'firebase/firestore';
import { NextResponse } from 'next/server';

import { db } from '@/configs/firebase';
import type { IGetMoviesResponse, IMovieResponse } from '@/types/movies';
import { mapMovieResponse } from '@/utils/mapMovieResponse';
import { paginate } from '@/utils/paginate';

import type { NextRequest } from 'next/server';

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const page = Number(searchParams.get('page') ?? 1);
  const limit = Number(searchParams.get('limit') ?? 10);
  const category = searchParams.get('category')?.toLowerCase();

  try {
    const snapshot = await getDocs(collection(db, 'movies'));
    const allMovies: IMovieResponse[] = snapshot.docs.map((d) => d.data() as IMovieResponse);

    const filtered = category
      ? allMovies.filter((m) => m.movie.genres.some((g) => g.name.toLowerCase() === category))
      : allMovies;

    const paged = paginate(filtered, page, limit);
    const movies = paged.map(mapMovieResponse);

    const response: IGetMoviesResponse = {
      movies,
      page,
      counts: movies.length,
      totalCounts: filtered.length,
    };

    return NextResponse.json(response);
  } catch {
    return NextResponse.json({ error: 'Failed to fetch movies' }, { status: 500 });
  }
}
