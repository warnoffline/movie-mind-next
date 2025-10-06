import { collection, getDocs, query, where, addDoc } from 'firebase/firestore';
import { NextResponse } from 'next/server';
import xss from 'xss';
import { z } from 'zod';

import { db } from '@/configs/firebase';
import type { IMovieReview } from '@/types/movies';
import { mapReviewResponse } from '@/utils/mapReviewResponse';
import { paginate } from '@/utils/paginate';

import type { NextRequest } from 'next/server';

const ReviewSchema = z.object({
  author: z.string().min(1).max(100),
  content: z.string().min(1).max(2000),
  rating: z.number().min(1).max(5).optional(),
});

type ReviewBody = {
  author: string;
  content: string;
  rating?: number;
};

export async function GET(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const { searchParams } = new URL(req.url);

  const page = Number(searchParams.get('page') ?? 1);
  const limit = Number(searchParams.get('limit') ?? 10);

  if (!id) {
    return NextResponse.json({ error: 'Movie ID is required' }, { status: 400 });
  }

  try {
    const reviewsRef = collection(db, 'reviews');
    const q = query(reviewsRef, where('movieId', '==', id));
    const snapshot = await getDocs(q);

    const allReviews: IMovieReview[] = snapshot.docs
      .map((doc) => mapReviewResponse(doc, id))
      .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());

    const reviews = paginate(allReviews, page, limit);

    return NextResponse.json({
      reviews,
      page,
      counts: reviews.length,
      totalCounts: allReviews.length,
    });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : String(err);
    return NextResponse.json(
      { error: 'Failed to fetch reviews', detail: message },
      { status: 500 }
    );
  }
}

export async function POST(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const body: ReviewBody = await req.json();

  if (!body.author || !body.content) {
    return NextResponse.json({ error: 'Author and content are required' }, { status: 400 });
  }

  try {
    const parsed = ReviewSchema.parse(body);

    const cleanContent = xss(parsed.content);
    const cleanAuthor = xss(parsed.author);

    const review = {
      movieId: id,
      author: cleanAuthor,
      content: cleanContent,
      rating: parsed.rating ?? null,
      createdAt: new Date().toISOString(),
    };
    const reviewsRef = collection(db, 'reviews');
    const docRef = await addDoc(reviewsRef, review);

    return NextResponse.json({ id: docRef.id, ...review });
  } catch {
    return NextResponse.json({ error: 'Failed to add review' }, { status: 500 });
  }
}
