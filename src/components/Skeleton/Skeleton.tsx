import cn from 'classnames';

import s from './Skeleton.module.scss';

type Props = {
  width?: string | number;
  height?: string | number;
  radius?: string | number;
  className?: string;
};

export const Skeleton = ({ width, height, radius = 4, className }: Props) => {
  return (
    <div className={cn(s.skeleton, className)} style={{ width, height, borderRadius: radius }} />
  );
};
