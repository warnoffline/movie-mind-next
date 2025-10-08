import { Loading } from '../Loading';
import s from './LoadingFull.module.scss';

export const LoadingFull = () => {
  return (
    <div className={s.loading__page}>
      <Loading />
    </div>
  );
};
