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

    const idsParam = searchParams.get('ids');
    const page = Number(searchParams.get('page') ?? 1);
    const limit = Number(searchParams.get('limit') ?? 10);

    if (!idsParam) {
      return NextResponse.json({ error: 'No ids provided' }, { status: 400 });
    }

    const ids = idsParam.split(',').map((id) => id.trim());

    const snapshot = await getDocs(collection(db, 'movies'));
    const allMovies: IMovieResponse[] = snapshot.docs.map((d) => d.data() as IMovieResponse);

    const filtered = allMovies.filter((m) => ids.includes(String(m.id)));

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
    return NextResponse.json({ error: 'Failed to fetch movies by ids' }, { status: 500 });
  }
}
