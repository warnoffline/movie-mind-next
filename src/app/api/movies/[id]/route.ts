import { doc, getDoc } from 'firebase/firestore';
import { NextResponse } from 'next/server';

import { db } from '@/configs/firebase';
import type { IMovie, IMovieResponse } from '@/types/movies';

import type { NextRequest } from 'next/server';

export async function GET(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;

  try {
    const snapshot = await getDoc(doc(db, 'movies', id));
    if (!snapshot.exists()) return NextResponse.json(null);

    const data = snapshot.data() as IMovieResponse;
    const movie: IMovie = data.movie;

    return NextResponse.json(movie);
  } catch {
    return NextResponse.json({ error: 'Failed to fetch movie' }, { status: 500 });
  }
}
