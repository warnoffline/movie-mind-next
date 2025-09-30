import { BASE_URL } from './instance';

export class FavoritesService {
  private userId: string;

  constructor(userId: string) {
    this.userId = userId;
  }

  private get endpoint() {
    return `${BASE_URL}/users/${this.userId}/favorites`;
  }

  async get(): Promise<number[]> {
    const res = await fetch(this.endpoint, { cache: 'no-store', next: { revalidate: 60 } });
    if (!res.ok) throw new Error('Failed to fetch favorites');
    return res.json();
  }

  async set(favorites: number[]) {
    const res = await fetch(this.endpoint, {
      method: 'PUT',
      body: JSON.stringify({ favorites }),
      headers: { 'Content-Type': 'application/json' },
      cache: 'no-store',
    });
    if (!res.ok) throw new Error('Failed to set favorites');
  }

  async add(movieId: number) {
    const res = await fetch(this.endpoint, {
      method: 'POST',
      body: JSON.stringify({ movieId }),
      headers: { 'Content-Type': 'application/json' },
      cache: 'no-store',
    });
    if (!res.ok) throw new Error('Failed to add favorite');
  }

  async remove(movieId: number) {
    const res = await fetch(this.endpoint, {
      method: 'DELETE',
      body: JSON.stringify({ movieId }),
      headers: { 'Content-Type': 'application/json' },
      cache: 'no-store',
    });
    if (!res.ok) throw new Error('Failed to remove favorite');
  }
}
