import { doc, getDoc, setDoc, updateDoc, arrayUnion, arrayRemove } from 'firebase/firestore';
import { NextResponse } from 'next/server';

import { db } from '@/configs/firebase';

import type { NextRequest } from 'next/server';

export async function GET(req: NextRequest, { params }: { params: Promise<{ userId: string }> }) {
  const { userId } = await params;

  try {
    const snapshot = await getDoc(doc(db, 'users', userId));
    if (!snapshot.exists()) return NextResponse.json([]);
    const { favorites = [] } = snapshot.data() as { favorites?: number[] };
    return NextResponse.json(favorites);
  } catch {
    return NextResponse.json({ error: 'Failed to get favorites' }, { status: 500 });
  }
}

export async function POST(req: NextRequest, { params }: { params: Promise<{ userId: string }> }) {
  const { userId } = await params;

  try {
    const { movieId } = await req.json();
    if (typeof movieId !== 'number') {
      return NextResponse.json({ error: 'Invalid movieId' }, { status: 400 });
    }

    await updateDoc(doc(db, 'users', userId), { favorites: arrayUnion(movieId) });
    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json({ error: 'Failed to add favorite' }, { status: 500 });
  }
}

export async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<{ userId: string }> }
) {
  const { userId } = await params;

  try {
    const { movieId } = await req.json();
    if (typeof movieId !== 'number') {
      return NextResponse.json({ error: 'Invalid movieId' }, { status: 400 });
    }

    await updateDoc(doc(db, 'users', userId), { favorites: arrayRemove(movieId) });
    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json({ error: 'Failed to remove favorite' }, { status: 500 });
  }
}

export async function PUT(req: NextRequest, { params }: { params: Promise<{ userId: string }> }) {
  const { userId } = await params;

  try {
    const { favorites } = await req.json();
    if (!Array.isArray(favorites) || !favorites.every((id) => typeof id === 'number')) {
      return NextResponse.json({ error: 'Invalid favorites array' }, { status: 400 });
    }

    await setDoc(doc(db, 'users', userId), { favorites }, { merge: true });
    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json({ error: 'Failed to set favorites' }, { status: 500 });
  }
}
