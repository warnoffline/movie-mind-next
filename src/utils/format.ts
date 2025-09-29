export const formatGenre = (name: string) => name.charAt(0).toUpperCase() + name.slice(1);

export const formatDuration = (minutes: number) => {
  if (!minutes) return '—';
  const h = Math.floor(minutes / 60);
  const m = minutes % 60;
  return h > 0 ? `${h} ч ${m} мин` : `${m} мин`;
};
