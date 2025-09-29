import { BASE_URL } from './instance';

export const getFavorites = async (userId: string): Promise<number[]> => {
  const res = await fetch(`${BASE_URL}/users/${userId}/favorites`, {
    cache: 'no-store',
    next: { revalidate: 60 },
  });
  if (!res.ok) throw new Error('Failed to fetch favorites');
  return res.json();
};

export const setFavorites = async (userId: string, favorites: number[]) => {
  const res = await fetch(`${BASE_URL}/users/${userId}/favorites`, {
    method: 'PUT',
    body: JSON.stringify({ favorites }),
    headers: { 'Content-Type': 'application/json' },
    cache: 'no-store',
  });
  if (!res.ok) throw new Error('Failed to set favorites');
};

export const addFavorite = async (userId: string, movieId: number) => {
  const res = await fetch(`${BASE_URL}/users/${userId}/favorites`, {
    method: 'POST',
    body: JSON.stringify({ movieId }),
    headers: { 'Content-Type': 'application/json' },
    cache: 'no-store',
  });
  if (!res.ok) throw new Error('Failed to add favorite');
};

export const removeFavorite = async (userId: string, movieId: number) => {
  const res = await fetch(`${BASE_URL}/users/${userId}/favorites`, {
    method: 'DELETE',
    body: JSON.stringify({ movieId }),
    headers: { 'Content-Type': 'application/json' },
    cache: 'no-store',
  });
  if (!res.ok) throw new Error('Failed to remove favorite');
};
