import { doc, getDoc, getDocs, collection } from 'firebase/firestore';
import { NextResponse } from 'next/server';

import { db } from '@/configs/firebase';
import type { IMovieResponse, IMovieShort } from '@/types/movies';
import { mapMovieResponse } from '@/utils/mapMovieResponse';

import type { NextRequest } from 'next/server';

function cosineSim(a: number[], b: number[]): number {
  const dot = a.reduce((sum, val, i) => sum + val * b[i], 0);
  const magA = Math.sqrt(a.reduce((sum, val) => sum + val * val, 0));
  const magB = Math.sqrt(b.reduce((sum, val) => sum + val * val, 0));
  return dot / (magA * magB);
}

function averageVectors(vectors: number[][]): number[] {
  const len = vectors[0].length;
  const avg = Array(len).fill(0);
  for (const vec of vectors) {
    for (let i = 0; i < len; i++) {
      avg[i] += vec[i];
    }
  }
  for (let i = 0; i < len; i++) {
    avg[i] /= vectors.length;
  }
  return avg;
}

async function getMovie(movieId: string): Promise<IMovieResponse> {
  const movieRef = doc(db, 'movies', movieId);
  const snapshot = await getDoc(movieRef);
  if (!snapshot.exists()) throw new Error(`Фильм с ID ${movieId} не найден`);
  return snapshot.data() as IMovieResponse;
}

async function getAllMovies(): Promise<IMovieResponse[]> {
  const moviesCol = collection(db, 'movies');
  const snapshot = await getDocs(moviesCol);
  return snapshot.docs.map((d) => d.data() as IMovieResponse);
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { movieIds } = body as { movieIds: string[] };

    if (!Array.isArray(movieIds) || movieIds.length < 1 || movieIds.length > 6) {
      return NextResponse.json({ error: 'Нужно от 1 до 6 ID фильмов' }, { status: 400 });
    }

    const inputMovies = await Promise.all(movieIds.map((id) => getMovie(id)));
    const avgVector = averageVectors(inputMovies.map((m) => m.movie.vector));

    const allMovies = await getAllMovies();
    const similarMovies = allMovies.filter((m) => !movieIds.includes(String(m.id)));

    similarMovies.sort(
      (a, b) => cosineSim(avgVector, b.movie.vector) - cosineSim(avgVector, a.movie.vector)
    );

    const topMoviesShort: IMovieShort[] = similarMovies
      .slice(0, 12)
      .map((m) => mapMovieResponse(m));

    return NextResponse.json(topMoviesShort);
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Неизвестная ошибка';
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
