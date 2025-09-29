export const paginate = <T>(items: T[], page: number, limit: number): T[] => {
  const start = (page - 1) * limit;
  return items.slice(start, start + limit);
};
