import { collection, getDocs } from 'firebase/firestore';
import { NextResponse } from 'next/server';

import { db } from '@/configs/firebase';
import type { IMovieResponse, IMovieShort } from '@/types/movies';
import { mapMovieResponse } from '@/utils/mapMovieResponse';

import type { NextRequest } from 'next/server';

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const query = searchParams.get('query')?.toLowerCase() ?? '';

  try {
    const snapshot = await getDocs(collection(db, 'movies'));
    const allMovies: IMovieResponse[] = snapshot.docs.map((d) => d.data() as IMovieResponse);

    const filtered = allMovies.filter((m) => m.movie.name.toLowerCase().includes(query));

    const movies: IMovieShort[] = filtered.map(mapMovieResponse);
    return NextResponse.json(movies);
  } catch {
    return NextResponse.json({ error: 'Failed to search movies' }, { status: 500 });
  }
}
