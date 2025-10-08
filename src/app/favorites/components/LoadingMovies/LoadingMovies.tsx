import { MovieListSkeletons } from '@/components/MovieList';

export const LoadingMovies = () => {
  return (
    <div style={{ paddingTop: '60px' }}>
      <MovieListSkeletons />
    </div>
  );
};
